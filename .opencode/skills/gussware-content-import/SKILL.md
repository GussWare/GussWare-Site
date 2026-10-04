---
name: gussware-content-import
description: Imports the 6 GussWare services from an Obsidian Markdown document into the WordPress service CPT via REST API, with Service Detail ACF fields, service_category taxonomy, and Polylang es/en translations. Use when importing services, creating service translations, or syncing Markdown service content to WordPress.
---

# GussWare Content Import

## Purpose

Import the 6 services defined in an Obsidian Markdown source document into the existing WordPress installation.

- Source of truth: Markdown document.
- Destination: existing WordPress via REST API.
- Scope: CPT `service` only, plus its ACF group and Polylang relations.
- Idempotent: re-running must not create duplicates.

Do not perform cleanup, refactors, config changes, or unrelated code changes.

## Integration

Use WordPress REST API as the primary mechanism:

```text
/wp-json/wp/v2/services
/wp-json/wp/v2/service-categories
/wp-json/pll/v1/languages
```

Use MCP only if a WordPress MCP is already configured and exposes the required operations. Do not assume an MCP exists. Do not create one.

Before writes, inspect schema if needed:

```http
OPTIONS /wp-json/wp/v2/services
OPTIONS /wp-json/wp/v2/services/{id}
```

Use authenticated requests. Follow the installed schema; do not assume undocumented shapes.

## WordPress Model

```text
post_type: service
rest_base: services
supports: title, editor, excerpt, thumbnail, revisions, custom-fields, author

taxonomy: service_category
rest_base: service-categories

ACF group: group_gw_service_detail
title: Service Detail
show_in_rest: true, exposed as `acf` object
```

All fields in this group use `translations: ignore`. ES and EN must receive explicit independent payloads. Never rely on automatic sync.

## Languages

Support exactly `es` and `en`.

Source frontmatter uses `es-MX` + English. Map `es-MX → es`, `English → en` unless WordPress reports different codes.

Before import:

```http
GET /wp-json/pll/v1/languages
```

Verify `es` and `en` exist. Do not create or modify languages, ACF config, Polylang config, or CPT definition.

## Source Structure

Only `#` headings are services. All other headings are content hierarchy to map to WP/ACF fields.

Expected 6 logical services:

1. Consultoría técnica
2. Diseño de sitios web y tiendas en línea
3. Aplicaciones móviles
4. Desarrollo a medida
5. DevOps y Soporte Técnico
6. Integración de APIs y Servicios Externos

Semantic hierarchy:

```text
# Servicio
## Identificación
## 🇲🇽 Español
### Información principal (Título de WordPress, Extracto, Contenido)
### Intro (Eyebrow, Título, Descripción, Suffix)
### Hero Stats (Stat XX: label, value)
### Development (title, content, tags)
### Solutions (eyebrow, title, description, solutions[])
### Approach (title, description, items[])
### Technologies (title, description, groups[])
### FAQ (items[])
### CTA (title, description, button_text, button_url)
## 🇺🇸 English (same structure: Main Information, Intro, Hero Stats, ...)
## Import Notes
```

Do not treat every Markdown heading as a WP field. Map semantically per tables below.

## Existing Detection

Before creating anything:

```http
GET /wp-json/wp/v2/services?lang=es&per_page=100
GET /wp-json/wp/v2/services?lang=en&per_page=100
```

Inspect `id, slug, title, lang, translations, service_category, acf`.

Match in this order:

1. Existing Polylang `translations` relationship.
2. Exact normalized WP `slug`.
3. Exact normalized `title` within same `lang`.

Normalization: trim, case-insensitive, collapse repeated whitespace. No fuzzy matching for auto-merge. If ambiguous, stop for that service and report `AMBIGUOUS`.

Also query categories first:

```http
GET /wp-json/wp/v2/service-categories?per_page=100
```

## Create ES and EN

For each logical service:

1. Find ES post, find EN post per matching above.
2. Create only missing side. Reuse existing post and ID.
3. Never create a second translation if link already exists.
4. Populate ES ACF independently to ES post.
5. Populate EN ACF independently to EN post.
6. Assign `lang` explicitly on create/update.
7. Link translations via Polylang, then verify both directions.

New post:

```http
POST /wp-json/wp/v2/services
```

Update ACF via same resource:

```http
POST /wp-json/wp/v2/services/{id}
```

Link translations (follow installed schema):

```text
Spanish: lang=es + translations[en]=EN_ID
English: lang=en + translations[es]=ES_ID
```

Verify afterwards:

```text
ES: lang=es, translations.en=EN_ID
EN: lang=en, translations.es=ES_ID
```

## Post Field Mapping

| Source (per language) | WP field |
|---|---|
| Información principal → Título de WordPress / Main Information → WordPress Title | `title` |
| Extracto | `excerpt` |
| Contenido | `content` |
| service_category from `## Identificación` if present | `service_category` term IDs |

Preserve editorial meaning when converting Markdown to WP content. Do not put structural ACF data into `post_content`.

## ACF Mapping

Use exact keys. For EN still use `pregunta`, `respuesta`. Never rename keys.

| Section | ACF keys |
|---|---|
| Intro | `intro_eyebrow, intro_title, intro_description, intro_eyebrow_suffix` |
| Hero Stats | `hero_stats[]: {label, value}` ordered |
| Development | `development_title, development_content, development_tags[]: {tag}` |
| Solutions | `solutions_eyebrow, solutions_title, solutions_description, solutions[]` |
| Approach | `approach_title, approach_description, approach[]: {title, description}` |
| Technologies | `tech_title, tech_description, tech_groups[]: {title, items[]: {name}}` |
| FAQ | `faq_items[]: {pregunta, respuesta}` |
| CTA | `cta: {title, description, button_text, button_url}` |

Shapes:

```json
{"hero_stats": [{"label": "...", "value": "..."}]}
{"development_tags": [{"tag": "..."}]}
{"solutions": [{"title": "...", "description": "...", "features": [{"feature": "..."}], "link": {"text": "...", "url": "..."}}]}
{"approach": [{"title": "...", "description": "..."}]}
{"tech_groups": [{"title": "...", "items": [{"name": "..."}]}]}
{"faq_items": [{"pregunta": "...", "respuesta": "..."}]}
{"cta": {"title": "...", "description": "...", "button_text": "...", "button_url": "..."}}
```

Rules: preserve order; do not invent features, URLs, technologies, categories, translations. If source has no link/URL, leave absent/empty per existing field behavior.

## Categories

1. Match by normalized name within same language.
2. Reuse existing term.
3. Create only if explicitly in source and missing.
4. Preserve Polylang relation for translated categories same as posts.

Do not invent or duplicate categories.

## Status Values

Report per service:

```text
CREATED: post(s) newly created
EXISTING: detected, no change needed
UPDATED: existing post content/ACF/link updated
SKIPPED: intentionally not touched (reason required)
AMBIGUOUS: identity unclear, stopped to avoid duplicate
ERROR: operation failed, include detail
```

## Validation

After all 6:

- [ ] 6 logical services exist (ES + EN each, unless source has single language).
- [ ] `ES lang=es`, `EN lang=en`.
- [ ] `ES translations.en=EN_ID`, `EN translations.es=ES_ID`.
- [ ] `acf` contains expected keys for both languages: `intro_eyebrow, intro_title, intro_description, development_title, development_content, solutions_title, solutions_description, solutions, approach_title, approach_description, approach, tech_title, tech_description, tech_groups, faq_items, cta` plus optional `intro_eyebrow_suffix, hero_stats, development_tags, solutions_eyebrow` when in source.
- [ ] Same payloads retrievable via Astro-consumed REST: `title, excerpt, content, lang, translations, acf` independently per language.

## Failure Rules

Stop instead of guessing when: auth fails; `services` endpoint missing; `acf` object unavailable; `es`/`en` not configured; ambiguous match; inconsistent translation relation; required ACF field unwritable; schema mismatch.

Never fix by: duplicating posts, deleting posts, changing Polylang/ACF/plugin/CPT config, inventing content.

Report exact problem + affected service.

## Final Report Template

```text
Services processed: 6

Created:
- ...

Already existed:
- ...

Updated:
- ...

Skipped:
- ...

Ambiguous:
- ...

Errors:
- ...

Spanish/English relationships verified:
YES/NO

ACF data verified:
YES/NO

REST API consumption verified:
YES/NO

IDs:
Service
├── ES: ID
└── EN: ID
```

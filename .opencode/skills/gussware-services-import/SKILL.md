---
name: gussware-services-import
description: Imports the 6 GussWare services from an Obsidian Markdown document into the WordPress service CPT via REST API, with Service Detail ACF fields, service_category taxonomy, and Polylang es/en translations. Use when importing services, creating service translations, or syncing Markdown service content to WordPress.
---

# GussWare Content Import

## Purpose

Import the 6 services defined in an Obsidian Markdown source document into the existing WordPress installation.

- Source of truth: Markdown document.
- Destination: existing WordPress via REST API.
- Scope: CPT `service` only, plus its ACF group and Polylang relations.
- Idempotent: re-running must not create duplicates.
- Incorporated common core: `gussware-import-core` v1.0 (see Domain File below). This file is self-contained: use it with a single skill load, without loading another skill or reading additional files for the operative instructions.

Do not perform cleanup, refactors, config changes, or unrelated code changes.

## Ficha del dominio — Servicios

Concrete values for this adapter. The incorporated common blocks below refer to this file.

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

```text
Primary language: es (source frontmatter `es-MX` maps to `es`)
Secondary language: en (source frontmatter `English` maps to `en`)
Logical items: 6 services (see Source Structure)
Inspected fields: id, slug, title, lang, translations, service-categories, acf
Estados: publish,draft (los listados excluyen borradores por defecto; consultar ambos estados para no tratar un borrador existente como inexistente)
```

```text
Endpoints:
GET /wp-json/wp/v2/services?lang=es&per_page=100&status=publish,draft
GET /wp-json/wp/v2/services?lang=en&per_page=100&status=publish,draft
GET /wp-json/wp/v2/service-categories?per_page=100
GET /wp-json/pll/v1/languages
OPTIONS /wp-json/wp/v2/services
OPTIONS /wp-json/wp/v2/services/{id}
POST /wp-json/wp/v2/services
POST /wp-json/wp/v2/services/{id}
```

## Integration

<!-- BLOQUE-NUCLEO v1.0 INICIO: integration -->

Use WordPress REST API as the primary mechanism with the endpoints listed in the adapter's Domain File (content listing per language, taxonomy terms, languages).

Use MCP only if a WordPress MCP is already configured and exposes the required operations. Do not assume an MCP exists. Do not create one.

Before writes, inspect schema if needed:

```http
OPTIONS {item endpoint from the Domain File}
OPTIONS {single-item endpoint from the Domain File}
```

Use authenticated requests. Follow the installed schema; do not assume undocumented shapes.

<!-- BLOQUE-NUCLEO v1.0 FIN: integration -->

## Languages

<!-- BLOQUE-NUCLEO v1.0 INICIO: languages -->

Support exactly the language codes listed in the adapter's Domain File.

Map source frontmatter language labels to those codes per the Domain File, unless WordPress reports different codes.

Before import:

```http
GET {languages endpoint from the Domain File}
```

Verify the configured codes exist. Do not create or modify languages, ACF config, Polylang config, or CPT definition.

<!-- BLOQUE-NUCLEO v1.0 FIN: languages -->

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

<!-- BLOQUE-NUCLEO v1.0 INICIO: detection -->

Before creating anything, query the primary- and secondary-language listing endpoints from the Domain File:

```http
GET {listing endpoint, primary language}
GET {listing endpoint, secondary language}
```

Inspect `id, slug, title, lang, translations` plus the taxonomy field and `acf` named in the Domain File.

Match in this order:

1. Existing Polylang `translations` relationship.
2. Exact normalized WP `slug`.
3. Exact normalized `title` within same `lang`.

Normalization: trim, case-insensitive, collapse repeated whitespace. No fuzzy matching for auto-merge. If ambiguous, stop for that item and report `AMBIGUOUS`.

Also query taxonomy terms first:

```http
GET {taxonomy endpoint from the Domain File}
```

<!-- BLOQUE-NUCLEO v1.0 FIN: detection -->

Matching in this adapter uses Normalization below for every lookup: translations relationship first, then exact slug anchor, then `norm(title)` / `norm(name)` within the same language — for posts and for `service_category` terms alike, before creating or updating anything.

## Create ES and EN

<!-- BLOQUE-NUCLEO v1.0 INICIO: create-link -->

For each logical item:

1. Find primary-language post, find secondary-language post per matching above.
2. Create only missing side. Reuse existing post and ID.
3. Never create a second translation if link already exists.
4. Populate primary-language ACF independently to primary post.
5. Populate secondary-language ACF independently to secondary post.
6. Assign `lang` explicitly on create/update.
7. Link translations via Polylang, then verify both directions.

New post:

```http
POST {collection endpoint from the Domain File}
```

Update ACF via same resource:

```http
POST {single-item endpoint from the Domain File}
```

Link translations (follow installed schema; language codes from the Domain File):

```text
Primary: lang=[A] + translations[[B]]=[B]_ID
Secondary: lang=[B] + translations[[A]]=[A]_ID
```

Verify afterwards:

```text
[A]: lang=[A], translations.[B]=[B]_ID
[B]: lang=[B], translations.[A]=[A]_ID
```

<!-- BLOQUE-NUCLEO v1.0 FIN: create-link -->

## Post Field Mapping

| Source (per language) | WP field |
|---|---|
| Información principal → Título de WordPress / Main Information → WordPress Title | `title` |
| Extracto | `excerpt` |
| Contenido | `content` |
| service_category from `## Identificación` if present | `service-categories` term IDs (clave REST; taxonomía interna `service_category`) |

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

<!-- BLOQUE-NUCLEO v1.0 INICIO: categories -->

1. Match by normalized name within same language.
2. Reuse existing term.
3. Create only if explicitly in source and missing.
4. Preserve Polylang relation for translated categories same as posts.

Do not invent or duplicate categories.

<!-- BLOQUE-NUCLEO v1.0 FIN: categories -->

## Status Values

<!-- BLOQUE-NUCLEO v1.0 INICIO: status -->

Report per logical item:

```text
CREATED: post(s) newly created
EXISTING: detected, no change needed
UPDATED: existing post content/ACF/link updated
SKIPPED: intentionally not touched (reason required)
AMBIGUOUS: identity unclear, stopped to avoid duplicate
ERROR: operation failed, include detail
```

<!-- BLOQUE-NUCLEO v1.0 FIN: status -->

## Validation

After all 6:

- [ ] 6 logical services exist (ES + EN each, unless source has single language).
- [ ] `ES lang=es`, `EN lang=en`.
- [ ] `ES translations.en=EN_ID`, `EN translations.es=ES_ID`.
- [ ] `acf` contains expected keys for both languages: `intro_eyebrow, intro_title, intro_description, development_title, development_content, solutions_title, solutions_description, solutions, approach_title, approach_description, approach, tech_title, tech_description, tech_groups, faq_items, cta` plus optional `intro_eyebrow_suffix, hero_stats, development_tags, solutions_eyebrow` when in source.
- [ ] Same payloads retrievable via Astro-consumed REST: `title, excerpt, content, lang, translations, acf` independently per language.

## Failure Rules

<!-- BLOQUE-NUCLEO v1.0 INICIO: failure -->

Stop instead of guessing when: auth fails; the domain endpoints are missing (see Domain File); `acf` object unavailable; the configured languages are not present; ambiguous match; inconsistent translation relation; required ACF field unwritable; schema mismatch.

Never fix by: duplicating posts, deleting posts, changing Polylang/ACF/plugin/CPT config, inventing content.

Report exact problem + affected item.

<!-- BLOQUE-NUCLEO v1.0 FIN: failure -->

## Normalization

<!-- BLOQUE-NUCLEO v1.0 INICIO: normalization -->

Compare and resolve names with normalized equality. Normalization `norm(s)`:

1. Require text input; empty or whitespace-only values never match anything.
2. Apply Unicode NFC canonical composition (composed sequences equal their decomposed equivalents).
3. Trim leading/trailing whitespace; collapse every interior run of whitespace (spaces, tabs, newlines, non-breaking spaces) to one ASCII space.
4. Compare case-insensitively (Unicode casefold): `Php` equals `PHP`; `"  MySQL "` equals `"mysql"`.
5. Never strip accents or diacritics: `papa` does not equal `papá`. Accent differences never auto-merge; multiple conflicting candidates stop as `AMBIGUOUS`.

Resolution (always within one language, never across languages):

1. An explicit stable anchor from the source (slug or WP ID) matches exactly first. An anchor pointing at different entities, or a slug collision between different entities, stops the item (`SLUG_COLLISION` / `AMBIGUOUS`) — never reuse across entities.
2. Otherwise match by `norm(name)` equality within the same language: zero matches follow the create path; exactly one is reused (report its id); two or more stop as `AMBIGUOUS` — never pick one.
3. Derive slugs with the platform rule (lowercase, accent-transliterated, words joined by `-`); empty slugs never match. If the derived slug already belongs to a different term or post, stop (`SLUG_COLLISION`) instead of reusing it or silently accepting a suffixed variant; record the final slug of everything created.
4. Pre-flight indexes plus an intra-source duplicate scan make retries converge: a second run resolves to the same records (`REUSED` / `EXISTING`) and creates nothing new.

<!-- BLOQUE-NUCLEO v1.0 FIN: normalization -->

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

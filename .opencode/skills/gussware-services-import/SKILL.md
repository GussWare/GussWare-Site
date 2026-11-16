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

ACF group: group_gw_service_detail (Service Detail)
  location: post_type = service · show_in_rest: true
  9 campos de tipo ACF Group, uno por sección de la plantilla.
  REST devuelve la estructura ANIDADA: acf.hero.intro_title, acf.cierre.cta.title…
  hero (key field_gw_svc_section_hero, 9 campos)
  problema (field_gw_svc_section_problema, 5)
  soluciones (field_gw_svc_section_soluciones, 4)
  plataformas (field_gw_svc_section_plataformas, 9) — bloque opcional, solo Integración
  proceso (field_gw_svc_section_proceso, 4)
  ficha (field_gw_svc_section_ficha, 5) — bloque opcional
  faq (field_gw_svc_section_faq, 2)
  cierre (field_gw_svc_section_cierre, 1) — contiene el grupo `cta`
  relacionados (field_gw_svc_section_relacionados, 3)
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

Los campos están **anidados** en un campo ACF Group por sección: la columna indica la ruta
completa en el payload `acf`.

| Section | ACF keys (ruta en `acf`) |
|---|---|
| Hero | `hero.intro_eyebrow, hero.intro_title, hero.intro_description, hero.intro_eyebrow_suffix` |
| Hero Stats | `hero.hero_stats[]: {label, value, description}` ordered |
| Hero CTA | `hero.hero_cta_label, hero.hero_cta_url, hero.hero_secondary_label, hero.hero_secondary_url` |
| Development | `problema.development_eyebrow, problema.development_title, problema.development_content, problema.development_situations[]: {number, situation}, problema.development_tags[]: {tag}` |
| Solutions | `soluciones.solutions_eyebrow, soluciones.solutions_title, soluciones.solutions_description, soluciones.solutions[]` |
| Plataformas | `plataformas.platforms_enabled, plataformas.platforms_eyebrow, plataformas.platforms_title, plataformas.platforms_description, plataformas.platforms[]: {name, example}, plataformas.platforms_cta_title, plataformas.platforms_cta_text, plataformas.platforms_cta_label, plataformas.platforms_cta_url` |
| Approach | `proceso.approach_eyebrow, proceso.approach_title, proceso.approach_description, proceso.approach[]: {title, description}` |
| Technologies | `ficha.tech_enabled, ficha.tech_eyebrow, ficha.tech_title, ficha.tech_description, ficha.tech_groups[]: {title, items[]: {name}}` |
| FAQ | `faq.faq_eyebrow, faq.faq_items[]: {pregunta, respuesta}` |
| CTA | `cierre.cta: {eyebrow, title, description, button_text, button_url, secondary_text, secondary_url}` |
| Relacionados | `relacionados.related_eyebrow, relacionados.related_title, relacionados.related[]: {category, name, description, url}` |

Shapes (cada línea es el valor de UN campo Group de sección):

```json
{"hero": {"intro_eyebrow": "...", "intro_title": "...", "intro_description": "...", "hero_stats": [{"label": "01", "value": "título", "description": "descripción"}]}}
{"problema": {"development_eyebrow": "...", "development_title": "...", "development_content": "...", "development_situations": [{"number": "01", "situation": "..."}], "development_tags": [{"tag": "..."}]}}
{"soluciones": {"solutions_eyebrow": "...", "solutions_title": "...", "solutions_description": "...", "solutions": [{"title": "...", "description": "...", "features": [{"feature": "..."}], "benefit": "...", "link": {"text": "...", "url": "..."}}]}}
{"plataformas": {"platforms_enabled": true, "platforms_eyebrow": "...", "platforms_title": "...", "platforms_description": "...", "platforms": [{"name": "SAP", "example": "..."}]}}
{"proceso": {"approach_eyebrow": "...", "approach_title": "...", "approach_description": "...", "approach": [{"title": "...", "description": "..."}]}}
{"ficha": {"tech_enabled": true, "tech_eyebrow": "...", "tech_title": "...", "tech_description": "...", "tech_groups": [{"title": "...", "items": [{"name": "..."}]}]}}
{"faq": {"faq_eyebrow": "...", "faq_items": [{"pregunta": "...", "respuesta": "..."}]}}
{"cierre": {"cta": {"eyebrow": "...", "title": "...", "description": "...", "button_text": "...", "button_url": "...", "secondary_text": "...", "secondary_url": "..."}}}
{"relacionados": {"related_eyebrow": "...", "related_title": "...", "related": [{"category": "SOFTWARE", "name": "...", "description": "...", "url": "/servicios/..."}]}}
```

Reglas de sección:

- Los bloques opcionales se controlan con su interruptor: `platforms_enabled` y `tech_enabled`.
  Si el servicio no los usa, el interruptor queda en `0` y el resto de campos del bloque, vacíos.
- `hero_stats[].label` es el número del indicador (`01`, `02`, `03`), `value` el título y
  `description` la bajada. El número es posicional en el diseño; se escribe explícito.
- Los eyebrow de sección (`development_eyebrow`, `solutions_eyebrow`, `approach_eyebrow`,
  `tech_eyebrow`, `faq_eyebrow`, `cta.eyebrow`, `related_eyebrow`) llevan el número de la
  sección ya calculado, p. ej. `01 — EL PROBLEMA`. Si se oculta un bloque, renumerar los demás.
- Ojo con el nombre `faq`: el grupo *Home* (`group_6ab1bb51390c5`) tiene un campo `faq`
  distinto. Para escribir en el del servicio hay que usar la key del campo Group
  (`field_gw_svc_section_faq`), no el nombre de la sección.

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
- [ ] `acf` contains the 9 section groups with the expected keys, for both languages:
      `hero.{intro_eyebrow, intro_title, intro_description, hero_stats, hero_cta_label, hero_cta_url, hero_secondary_label, hero_secondary_url}`,
      `problema.{development_eyebrow, development_title, development_content, development_situations, development_tags}`,
      `soluciones.{solutions_eyebrow, solutions_title, solutions_description, solutions}`,
      `proceso.{approach_eyebrow, approach_title, approach_description, approach}`,
      `ficha.{tech_enabled, tech_eyebrow, tech_title, tech_description, tech_groups}`,
      `faq.{faq_eyebrow, faq_items}`,
      `cierre.cta.{eyebrow, title, description, button_text, button_url, secondary_text, secondary_url}`,
      `relacionados.{related_eyebrow, related_title, related}`,
      `plataformas.{platforms_enabled, platforms_eyebrow, platforms_title, platforms_description, platforms, platforms_cta_title, platforms_cta_text, platforms_cta_label, platforms_cta_url}`
      (los de los bloques opcionales pueden ir vacíos si el servicio no los usa).
- [ ] Same payloads retrievable via Astro-consumed REST: `title, excerpt, content, lang, translations, acf` independently per language.
- [ ] La página de servicio renderiza el contenido en `/servicios/{slug}` (el sitio consume el shape anidado: `acf.hero.intro_title`, `acf.cierre.cta.title`…).

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
2. Otherwise match by `norm(name)` equality among records in the requested language, including legacy records with no assigned language (`lang: false`), which participate as candidates in every language: zero matches follow the create path; exactly one is reused (report its id, preserving it); two or more stop as `AMBIGUOUS` — never pick one. A legacy record is never confused with an existing translation nor assigned a language automatically. Query terms so that unassigned records stay visible (unfiltered listing, or per-language plus unassigned).
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

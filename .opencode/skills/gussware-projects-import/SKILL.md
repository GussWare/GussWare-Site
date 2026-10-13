---
name: gussware-projects-import
description: Imports GussWare projects from a source document following TEMPLATE.md into the WordPress projects CPT via REST API, with the RGW-315 ACF model, projects_type/technology/industry_sector taxonomies, client_company relationship and Polylang es/en translations. Use when importing projects or syncing project content to WordPress.
---

# GussWare Projects Import

## Purpose

Import projects defined in an approved source document into the existing WordPress installation.

- Source of truth: source document following `TEMPLATE.md` in this skill directory (see Source Structure).
- Destination: existing WordPress via REST API.
- Scope: CPT `projects` only, plus its ACF group, its three taxonomies, its `client_company` relation and Polylang relations.
- Idempotent: re-running must not create duplicates.
- Incorporated common core: `gussware-import-core` v1.0 (see Domain File below). This file is self-contained: use it with a single skill load, without loading another skill or reading additional files for the operative instructions.
- Model reference: RGW-315 dictionary and closure (Jira). Field names, types and decisions below come from there unless marked otherwise.
- If the source does not follow `TEMPLATE.md`, stop before any write and report `TEMPLATE_MISMATCH`. Pending fields (gallery, unproven procedures) never block the import of supported fields from the same project.

Do not perform cleanup, refactors, config changes, or unrelated code changes.

## Ficha del dominio — Proyectos

Concrete values for this adapter. The incorporated common blocks below refer to this file.

```text
post_type: projects
rest_base: projects
has_archive: false, hierarchical: false [verificado-vivo: /wp/v2/types/projects]

taxonomy: projects_type (rest_base: projects_type, flat)
taxonomy: technology (rest_base: technologies, flat)
taxonomy: industry_sector (rest_base: industries_sector, flat)
All three assigned to [projects] [verificado-vivo: /wp/v2/taxonomies]

Related CPT: client_company (rest_base: client_company) [verificado-vivo]
ACF: Proyectos group, show_in_rest: true, exposed as `acf` object [cierre RGW-315]
```

Writable args on POST /wp/v2/projects [verificado-vivo: OPTIONS]:
`title, slug, status, featured_media, template, projects_type, technologies, industries_sector, acf, lang, translations`
NOT writable: `content`, `excerpt` (absent from schema). Native `editor`/`excerpt` are unsupported: full/short descriptions live in ACF (`description`, `short_description`, `executive_summary`).

```text
Primary language: es
Secondary language: en
Polylang coverage of CPT + three taxonomies: per RGW-315 closure (verify at pre-flight)
Logical items: source-dependent (no fixed count; the source defines the items)
Inspected fields: id, slug, status, lang, translations, projects_type, industry_sector, technology, acf
Estados: publish,draft (los listados excluyen borradores por defecto; consultar ambos estados para no tratar un borrador existente como inexistente)
```

```text
Endpoints:
GET /wp-json/wp/v2/projects?lang=es&per_page=100&status=publish,draft
GET /wp-json/wp/v2/projects?lang=en&per_page=100&status=publish,draft
GET /wp-json/wp/v2/projects_type?per_page=100
GET /wp-json/wp/v2/technologies?per_page=100
GET /wp-json/wp/v2/industries_sector?per_page=100
GET /wp-json/wp/v2/client_company?per_page=100
GET /wp-json/pll/v1/languages
OPTIONS /wp-json/wp/v2/projects
OPTIONS /wp-json/wp/v2/projects/{id}
POST /wp-json/wp/v2/projects
POST /wp-json/wp/v2/projects/{id}
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

The source is a document following `TEMPLATE.md` in this skill directory.

Item boundaries: each `## Proyecto: [Nombre]` under `# Proyectos` is one logical project. All other headings are content hierarchy mapped per the tables below.

Per-language sections: `# 🇲🇽 Español` and `# 🇺🇸 English` represent the same project (same order, same slots). `# Import Notes` carries import-specific data (exact taxonomy terms, `client_company` title — reused when unique, created when missing — verified featured-image ID, translation notes). `# End of Project` closes the item.

Template sections map 1:1 to Post/ACF Mapping rows below (Identificación → native fields + `project_code`; Descripción → `description`/`short_description`/`executive_summary`; Contexto → `context_objective`/`problem_need`/`implemented_solution`; Funcionalidades/Responsabilidades/Resultados/Métricas → repeaters in order; Enlaces → URL fields).

If the source deviates (reordered/renamed sections, ES/EN mismatch), stop for that item before any write and report `TEMPLATE_MISMATCH`. Do not map ad-hoc documents. A missing `project_code` is not a mismatch: it triggers Project Code Resolution below.

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

`project_code` is the logical primary key (decided: RGW-319 comments 10242/10243; the earlier "pending" state is closed). Identity and creation follow Project Code Resolution below. Safety tiebreaker: if a translations/slug/title match points to an item whose stored `project_code` differs non-empty from the resolved code, stop that item as `AMBIGUOUS` instead of updating — never overwrite a different project. Every name comparison here uses Normalization below (`norm`, same language, anchors first).

## Project Code Resolution

Binding rules (RGW-319 comments 10242/10243; the 10243 correction supersedes any numeric-suffix example). The WordPress ID stays the technical record identifier; `project_code` is the business logical key, shared verbatim by the ES and EN translations.

1. Source provides `project_code` → look it up in the live pre-flight index (`acf.project_code`, normalized: trim, case-insensitive). Exactly one logical project → update it. Zero matches → create by code, but only after validating no conflict (steps 4–5). Never fall back to title/slug matching when a code was provided.
2. Source omits `project_code` → search by exact normalized `slug` for safe reuse. Found and codeless → assign it the corresponding project code automatically and report `CODE_ASSIGNED`.
3. Slug search finds nothing → derive a stable project code from the project or its Jira project key (e.g. `RGW` for Rediseño de GussWare Site), without consecutives that mimic card keys. The candidate must be unique against the live index and stable across future updates.
4. Before assigning or saving any code, verify it is unused by another project. If code or slug lookup returns multiple matches, stop that item and report `PROJECT_CODE_CONFLICT`; never pick one arbitrarily.
5. If no unequivocal code can be derived, or a collision exists, stop that item and report the conflict instead of silently inventing a variant. An empty code with no derivable candidate is reported as `PROJECT_CODE_MISSING`.

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

Only natively writable fields (per live OPTIONS). Never write `content` or `excerpt` for this CPT.

| Source (per language) | WP field |
|---|---|
| Project title | `title` |
| Project slug (or derived) | `slug` |
| Publication state | `status` |
| Featured image (verified attachment ID, or empty; no file uploads) | `featured_media` |
| `projects_type` terms | `projects_type` term IDs (clave REST; taxonomía interna `projects_type`) |
| `industry_sector` terms | `industries_sector` term IDs (clave REST; taxonomía interna `industry_sector`) |
| `technology` terms | `technologies` term IDs (clave REST; taxonomía interna `technology`) |

Full/short/executive descriptions live in ACF (`description`, `short_description`, `executive_summary`), not in `post_content`/`excerpt`.

## ACF Mapping

Model: RGW-315 dictionary + closure. Provenance per row in brackets. Live keys CONFIRMED against group `group_6ab87ad1eb78e` (`Proyectos - CPT`, 26 fields, verified 2026-10-12): every name, type, required flag and repeater subfield below matches the live group. Re-confirm at pre-flight if the group changed.

Use exact keys. Never rename keys.

| Grupo | Campo / capacidad | Nombre técnico | Tipo |
|---|---|---|---|
| Información general | Cliente / empresa [diccionario+cierre] | `client_company` | Relationship con CPT `client_company`, return object; el nombre es el título nativo del relacionado |
| Información general | Rol desempeñado [diccionario] | `role_performed` | Text |
| Información general | Fecha de inicio [diccionario] | `start_date` | Date Picker (escribir `AAAAMMDD`; el retorno `d/m/Y` es solo visualización) |
| Información general | Fecha de finalización [diccionario] | `end_date` | Date Picker (escribir `AAAAMMDD`; el retorno `d/m/Y` es solo visualización) |
| Información general | Proyecto en curso [diccionario] | `is_ongoing` | True / False |
| Información general | Código del proyecto [diccionario+cierre, requerido] | `project_code` | Text |
| Descripción del proyecto | Descripción completa [diccionario, reutilizar sin duplicar] | `description` | WYSIWYG |
| Descripción del proyecto | Descripción corta [cierre] | `short_description` | Textarea |
| Descripción del proyecto | Resumen amplio [cierre] | `executive_summary` | WYSIWYG |
| Presentación | Proyecto destacado [cierre] | `is_featured` | True / False |
| Presentación | Orden de presentación [diccionario, pendiente validar pantallas] | `display_order` | Number |
| Contexto e implementación | Contexto y objetivo [diccionario] | `context_objective` | WYSIWYG |
| Contexto e implementación | Problema o necesidad [diccionario] | `problem_need` | WYSIWYG |
| Contexto e implementación | Solución implementada [diccionario+cierre] | `implemented_solution` | WYSIWYG |
| Contexto e implementación | Estatus del proyecto [esquema vivo: select requerido] | `status` | Select (`in_development` / `completed`, retorno valor) |
| Contexto e implementación | Funcionalidades desarrolladas [diccionario+2º ciclo] | `funcionalidades_desarrolladas` | Repeater (subcampos según grupo vivo; referencia 2º ciclo: `feature_name`, `feature_description`) |
| Contexto e implementación | Responsabilidades y contribuciones [diccionario+2º ciclo] | `responsibilities_contributions` | Repeater (referencia 2º ciclo: `responsibility`, `responsibility_description`) |
| Recursos y enlaces | Imágenes adicionales [diccionario] | `additional_images` | Gallery (requiere attachment IDs previamente subidos; procedimiento pendiente) |
| Recursos y enlaces | URL pública [diccionario+cierre] | `project_url` | URL |
| Recursos y enlaces | URL de demo [diccionario+cierre] | `demo_url` | URL |
| Recursos y enlaces | URL del repositorio [diccionario+cierre] | `repository_url` | URL |
| Resultados y métricas | Resultados y logros [diccionario+2º ciclo] | `results_achievements` | Repeater (referencia 2º ciclo: `achievement_name`, `achievement_description`) |
| Resultados y métricas | Métricas verificables [diccionario+2º ciclo] | `verifiable_metrics` | Repeater (referencia 2º ciclo: `nombre_de_la_metrica`, `metric_value`, `metric_unit`, `metric_description`) |

Rules: preserve order; do not invent values, URLs, technologies, terms, translations, or subfield names. Subfield names marked as 2º-cycle references must be confirmed against the live group before writing. If the source has no value for an optional field, leave absent/empty per existing field behavior.

Complex-field constraints (documented limits, not procedures):
- `client_company`: resolve by normalized native title (`norm`, per Normalization) within the item's language (optional WP-ID anchor from Import Notes wins when given); write order matters — the company must be resolved before the project is persisted. Unique match → reuse. Zero matches → create automatically from the source title (title-only is complete under the current client model: group `Cliente / Empresa - CPT` holds no fields yet, RGW-315 "basta el título por ahora"); use the same title for the EN counterpart when the CPT is Polylang-enabled, otherwise create once in the default language and relate from both sides by ID. Never invent other company data. Multiple exact matches → stop as `AMBIGUOUS`; missing/empty title in source → stop as `COMPANY_UNRESOLVED` (nothing to create from). The stop affects only that item: other projects continue.
- `additional_images`: gallery payloads need uploaded attachment IDs; the media-upload playbook is unproven in this project — blocked until proven.
- `project_code`: resolved per Project Code Resolution above (never `PROJECT_CODE_MISSING` by default; stops are `PROJECT_CODE_CONFLICT` / `PROJECT_CODE_MISSING` only when no unequivocal code is derivable).

## Categories

<!-- BLOQUE-NUCLEO v1.0 INICIO: categories -->

1. Match by normalized name within same language.
2. Reuse existing term.
3. Create only if explicitly in source and missing.
4. Preserve Polylang relation for translated categories same as posts.

Do not invent or duplicate categories.

<!-- BLOQUE-NUCLEO v1.0 FIN: categories -->

Applies independently to `projects_type`, `technology` (`technologies` endpoint) and `industry_sector` (`industries_sector` endpoint). Term translations follow the pre-flight Polylang configuration. Term lookup order and matching follow Normalization below (slug anchor, then `norm(name)`).

## Dependency Order (anti-orphan)

Resolve and validate everything before persisting the project, in this order: (1) validate source; (2) environment pre-flight; (3) project-code resolution (read-only gate — identity conflicts stop here, before any write); (4) resolve/create terms per language, linking ES/EN term translations when both sides are known (`TERM_TRANSLATION_PENDING` otherwise); (5) resolve/create the company; (6) gate: all dependencies resolved, else stop the item; (7) persist the project (update-if-one / create-if-zero by code); (8) assign resolved terms and relationships; (9) re-verify via GET. Terms/companies are created only after the read-only gates pass, so conflicts never leave orphans; if persistence itself fails afterwards, created dependencies are reported as `CREATED` and retries reuse them by name (convergent, never duplicated). Per-dependency report codes: `TERM_REUSED`, `TERM_CREATED`, `COMPANY_REUSED`, `COMPANY_CREATED`.

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

Additional stop codes for this adapter: `TEMPLATE_MISMATCH`, `PROJECT_CODE_CONFLICT`, `PROJECT_CODE_MISSING` (no unequivocal code derivable), `TERM_AMBIGUOUS`, `COMPANY_AMBIGUOUS`, `COMPANY_UNRESOLVED` (no company title in source to create from). Report flag (not a stop): `CODE_ASSIGNED`.

## Validation

After all items:

- [ ] Source follows `TEMPLATE.md` sections in order, ES/EN representing the same project.
- [ ] Every logical project exists (ES + EN each, unless source has single language).
- [ ] `ES lang=es`, `EN lang=en`.
- [ ] `ES translations.en=EN_ID`, `EN translations.es=ES_ID`.
- [ ] `project_code` present on every item (from source, or assigned per Project Code Resolution — flagged `CODE_ASSIGNED`).
- [ ] ACF `status` válido (`in_development` / `completed`) en cada ítem.
- [ ] `technology` terms assigned (required); each term `REUSED` (id reported) or `CREATED` then reused on retry; equivalents never duplicated by case differences.
- [ ] `client_company` reused (unique title match) or created from the source title, related from both languages; ambiguous or title-less cases stopped with code.
- [ ] `acf` contains the expected keys for both languages per the ACF Mapping above (live keys confirmed 2026-10-12 against `group_6ab87ad1eb78e`; re-confirm if the group changed).
- [ ] Taxonomies assigned from the three project taxonomies; no terms invented.
- [ ] Same payloads retrievable via Astro-consumed REST: `title, slug, status, featured_media, lang, translations, acf` independently per language (no `content`/`excerpt` on this CPT).

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

Project-specific stops: missing source specification; unresolvable `project_code` (underivable or colliding); ambiguous or uncreatable `client_company` (multiple matches, or no title to create from); ambiguous terms; gallery without uploaded attachment IDs.

## Final Report Template

```text
Projects processed: N

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
Project
├── ES: ID
└── EN: ID

Dependencies per project (REUSED with id, or CREATED):
Terms:
- ...
Company:
- ...

Codes assigned during this run (`CODE_ASSIGNED`):
- ...
```

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

Per-language sections: `# 🇲🇽 Español` and `# 🇺🇸 English` represent the same project (same order, same slots). `# Import Notes` carries import-specific data (exact taxonomy terms, existing `client_company` title, verified featured-image ID, translation notes). `# End of Project` closes the item.

Template sections map 1:1 to Post/ACF Mapping rows below (Identificación → native fields + `project_code`; Descripción → `description`/`short_description`/`executive_summary`; Contexto → `context_objective`/`problem_need`/`implemented_solution`; Funcionalidades/Responsabilidades/Resultados/Métricas → repeaters in order; Enlaces → URL fields).

If the source deviates (missing required `project_code`, reordered/renamed sections, ES/EN mismatch), stop for that item before any write and report `TEMPLATE_MISMATCH`. Do not map ad-hoc documents.

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

Natural key candidate (pending source-spec decision): `project_code` (required by RGW-315 closure). Until decided, match per the order above; never auto-merge on `project_code` alone without an approved rule. Safety tiebreaker without uniqueness claim: if a translations/slug/title match points to an item whose stored `project_code` differs from the source value, stop that item as `AMBIGUOUS` instead of updating — never overwrite a different project.

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

Model: RGW-315 dictionary + closure. Provenance per row in brackets. Live key confirmation is PENDING (no items exist to read); confirm exact keys against the live group before any write.

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
- `client_company`: the related `client_company` post must exist first (resolve by exact native title within the item's language); write order matters. No auto-creation of companies. Zero exact matches → stop that item (`COMPANY_UNRESOLVED`); multiple exact matches → stop as `AMBIGUOUS`; never pick one. The stop affects only that item: other projects continue.
- `additional_images`: gallery payloads need uploaded attachment IDs; the media-upload playbook is unproven in this project — blocked until proven.
- Required `project_code`: stop if missing (`PROJECT_CODE_MISSING`).

## Categories

<!-- BLOQUE-NUCLEO v1.0 INICIO: categories -->

1. Match by normalized name within same language.
2. Reuse existing term.
3. Create only if explicitly in source and missing.
4. Preserve Polylang relation for translated categories same as posts.

Do not invent or duplicate categories.

<!-- BLOQUE-NUCLEO v1.0 FIN: categories -->

Applies independently to `projects_type`, `technology` (`technologies` endpoint) and `industry_sector` (`industries_sector` endpoint). Term translations follow the pre-flight Polylang configuration.

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

Additional stop codes for this adapter: `TEMPLATE_MISMATCH`, `PROJECT_CODE_MISSING`, `COMPANY_UNRESOLVED`.

## Validation

After all items:

- [ ] Source follows `TEMPLATE.md` sections in order, ES/EN representing the same project.
- [ ] Every logical project exists (ES + EN each, unless source has single language).
- [ ] `ES lang=es`, `EN lang=en`.
- [ ] `ES translations.en=EN_ID`, `EN translations.es=ES_ID`.
- [ ] `project_code` present on every item.
- [ ] ACF `status` válido (`in_development` / `completed`) en cada ítem.
- [ ] `technology` terms assigned (required); no terms invented.
- [ ] `client_company` resolves to an existing `client_company` post in both languages.
- [ ] `acf` contains the expected keys for both languages per the ACF Mapping above (exact live keys pending confirmation).
- [ ] Taxonomies assigned from the three project taxonomies; no terms invented.
- [ ] Same payloads retrievable via Astro-consumed REST: `title, slug, status, featured_media, lang, translations, acf` independently per language (no `content`/`excerpt` on this CPT).

## Failure Rules

<!-- BLOQUE-NUCLEO v1.0 INICIO: failure -->

Stop instead of guessing when: auth fails; the domain endpoints are missing (see Domain File); `acf` object unavailable; the configured languages are not present; ambiguous match; inconsistent translation relation; required ACF field unwritable; schema mismatch.

Never fix by: duplicating posts, deleting posts, changing Polylang/ACF/plugin/CPT config, inventing content.

Report exact problem + affected item.

<!-- BLOQUE-NUCLEO v1.0 FIN: failure -->

Project-specific stops: missing source specification; missing `project_code`; unresolvable `client_company`; gallery without uploaded attachment IDs; live ACF keys not yet confirmed.

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
```

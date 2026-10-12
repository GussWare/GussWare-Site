---
name: gussware-import-core
description: Shared WordPress content-import protocol (REST transport, auth, pre-flight, existing detection and idempotency, Polylang translation linking, failure rules, status values). Single hand-edited source of the common instructions; domain adapters incorporate it at authoring time. Do not execute directly: load the domain adapter (e.g. gussware-services-import) to run an import.
---

# GussWare Import Core

## Purpose

Common, domain-independent import protocol for WordPress content (CPTs, taxonomies, ACF fields, Polylang relations) via REST API.

- This file is the single hand-edited source of the shared instructions (version below).
- Each domain adapter incorporates the marked blocks verbatim at authoring time and adds its own Domain File with concrete values (endpoints, codes, counts, keys).
- Do not add domain values, field maps, endpoints, or checklists here.
- Do not execute an import from this file alone: load the domain adapter, which is self-contained.
- Do not perform cleanup, refactors, config changes, or unrelated code changes.

Core version: v1.0

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

## Create and Link Translations

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

## Failure Rules

<!-- BLOQUE-NUCLEO v1.0 INICIO: failure -->

Stop instead of guessing when: auth fails; the domain endpoints are missing (see Domain File); `acf` object unavailable; the configured languages are not present; ambiguous match; inconsistent translation relation; required ACF field unwritable; schema mismatch.

Never fix by: duplicating posts, deleting posts, changing Polylang/ACF/plugin/CPT config, inventing content.

Report exact problem + affected item.

<!-- BLOQUE-NUCLEO v1.0 FIN: failure -->

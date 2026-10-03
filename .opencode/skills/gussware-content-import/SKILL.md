---
name: gussware-content-import
description: Use when importing or creating GussWare services from an Obsidian Markdown content document into the WordPress service CPT, including Spanish/English content, ACF Service Detail fields, service categories, and Polylang translations.
compatibility: opencode
metadata:
  project: gussware-site
  content_type: services
  wordpress_post_type: service
  integration: wordpress-rest-api
  languages:
    - es
    - en
---

# GussWare Content Import

## Purpose

Use this skill to import GussWare service content from an Obsidian-compatible Markdown source document into the existing WordPress installation.

The source document is the content source of truth for the services being imported.

The WordPress installation is the destination and must be modified through its existing REST APIs.

This skill is specifically for the `service` custom post type and its associated ACF and Polylang data.

---

## Required Integration

Use the **WordPress REST API** for this task.

Do not assume or introduce a WordPress MCP integration.

MCP may only be used if an existing configured MCP explicitly exposes the required WordPress operations. If no such MCP exists, use the WordPress REST API.

The expected API namespaces are:

* WordPress REST API: `/wp-json/wp/v2/`
* Services endpoint: `/wp-json/wp/v2/services`
* Service categories: `/wp-json/wp/v2/service-categories`
* Polylang languages: `/wp-json/pll/v1/languages`

ACF data is exposed through the `acf` object of the service REST resource because the `Service Detail` field group has `show_in_rest` enabled.

---

## WordPress Configuration

The target CPT is:

```text
post_type: service
rest_base: services
```

The target taxonomy is:

```text
taxonomy: service_category
rest_base: service-categories
```

The ACF field group is:

```text
group_gw_service_detail
title: Service Detail
```

All fields in this group currently use:

```text
translations: ignore
```

Therefore:

**Do not rely on ACF/Polylang automatic field synchronization.**

Spanish and English ACF content must be populated independently.

---

# Supported Languages

The import must support exactly these content languages:

```text
es
en
```

The source document contains:

```yaml
language: es-MX
translation_languages:
  - es
  - en
```

Treat:

```text
es-MX → es
English → en
```

as the WordPress/Polylang language codes unless the existing WordPress configuration reports different codes.

Before importing, query:

```http
GET /wp-json/pll/v1/languages
```

Verify that the expected Spanish and English languages exist.

Do not create or modify languages.

---

# Translation Rules

Every service represents one logical service with two language versions:

```text
Service
├── Spanish post
└── English post
```

Spanish and English must be separate WordPress posts.

The two posts must be linked through Polylang.

Polylang exposes the language and translation relationship in REST responses and supports assigning the language and translation relationship through REST.

After both posts exist, verify:

```text
Spanish post:
lang = es
translations.en = English post ID

English post:
lang = en
translations.es = Spanish post ID
```

Never create a second translation when the existing translation relationship already represents the same service.

---

# Import Source

The input document is an Obsidian Markdown document.

Its six services are the only top-level service entities.

The six expected services are:

1. Consultoría técnica
2. Diseño de sitios web y tiendas en línea
3. Aplicaciones móviles
4. Desarrollo a medida
5. DevOps y Soporte Técnico
6. Integración de APIs y Servicios Externos

The Markdown hierarchy is semantic:

```text
# Servicio
## Identificación
## 🇲🇽 Español
### Información principal
#### ...
### Intro
#### ...
### Hero Stats
#### ...
### Development
#### ...
### Solutions
#### ...
### Approach
#### ...
### Technologies
#### ...
### FAQ
#### ...
### CTA
## 🇺🇸 English
### Main Information
#### ...
### Intro
#### ...
### Hero Stats
#### ...
### Development
#### ...
### Solutions
#### ...
### Approach
#### ...
### Technologies
#### ...
### FAQ
#### ...
### CTA
## Import Notes
```

Do not interpret every Markdown heading as a WordPress field.

Map the semantic sections to the ACF field structure defined below.

---

# Existing Service Detection

Before creating anything, retrieve the existing services.

Query the service endpoint separately by language when possible:

```http
GET /wp-json/wp/v2/services?lang=es&per_page=100
GET /wp-json/wp/v2/services?lang=en&per_page=100
```

Inspect:

* post ID
* slug
* title
* language
* translations
* categories
* ACF data

The objective is to prevent duplicates.

## Matching

Prefer this order when identifying an existing service:

1. Existing Polylang translation relationship.
2. Exact normalized WordPress slug.
3. Exact normalized title within the same language.

Normalization for comparison may include:

* trimming whitespace
* case-insensitive comparison
* normalizing repeated whitespace

Do not use approximate/fuzzy matching to automatically merge two services.

If the identity of an existing service is ambiguous, stop and report the ambiguity instead of creating a possible duplicate.

---

# Creation Rules

For each of the six logical services:

1. Find the Spanish version.
2. Find the English version.
3. Determine whether either already exists.
4. Create only missing posts.
5. Populate the Spanish content independently.
6. Populate the English content independently.
7. Establish the Polylang translation relationship.
8. Verify the final result.

### Existing service

If the service already exists:

* Do not create another post.
* Do not create another translation.
* Preserve the existing WordPress post ID.
* Use the existing post as the target for the imported language content.

Do not delete existing services.

Do not duplicate existing categories.

Do not create alternative service slugs unnecessarily.

---

# WordPress Post Mapping

For each service language version:

### WordPress title

Map:

```text
Español → Información principal → Título de WordPress
English → Main Information → WordPress Title
```

to the WordPress post `title`.

### Extract

Map:

```text
Extracto
```

to the WordPress `excerpt`.

### Content

Map:

```text
Contenido
```

to the WordPress `content`.

The Markdown source may contain formatting intended for editorial content.

Preserve the actual content meaning and structure when converting it to WordPress content.

Do not put ACF structural data into `post_content` when the source section clearly maps to an ACF field.

---

# ACF Mapping

Populate the `acf` object using the following exact field names.

## Intro

```text
intro_eyebrow
intro_title
intro_description
intro_eyebrow_suffix
```

Source:

```text
Intro
├── Eyebrow
├── Título / Title
├── Descripción / Description
└── Suffix
```

---

## Hero Stats

Map:

```text
Hero Stats
└── Stat XX
    ├── label
    └── value
```

to:

```json
{
  "hero_stats": [
    {
      "label": "...",
      "value": "..."
    }
  ]
}
```

Preserve the source ordering.

---

## Development

Map:

```text
development_title
development_content
development_tags
```

`development_tags` must use:

```json
{
  "development_tags": [
    {
      "tag": "..."
    }
  ]
}
```

Preserve ordering.

---

# Solutions

Map:

```text
solutions_eyebrow
solutions_title
solutions_description
solutions
```

Each solution must use:

```json
{
  "title": "...",
  "description": "...",
  "features": [
    {
      "feature": "..."
    }
  ],
  "link": {
    "text": "...",
    "url": "..."
  }
}
```

If the source does not contain a link, do not invent one.

Preserve the source solution ordering.

Do not invent features.

Do not invent URLs.

---

# Approach

Map:

```text
approach_title
approach_description
approach
```

Each approach item:

```json
{
  "title": "...",
  "description": "..."
}
```

Preserve ordering.

---

# Technologies

Map:

```text
tech_title
tech_description
tech_groups
```

Each technology group:

```json
{
  "title": "...",
  "items": [
    {
      "name": "..."
    }
  ]
}
```

Preserve the order of groups and technology items.

Do not invent technologies.

---

# FAQ

Map:

```text
faq_items
```

to:

```json
{
  "faq_items": [
    {
      "pregunta": "...",
      "respuesta": "..."
    }
  ]
}
```

For English content, still use the exact ACF field names:

```text
pregunta
respuesta
```

Do not rename the ACF keys to English.

---

# CTA

Map:

```text
cta
```

to:

```json
{
  "cta": {
    "title": "...",
    "description": "...",
    "button_text": "...",
    "button_url": "..."
  }
}
```

Do not invent `button_url`.

If the source does not provide a URL, preserve it as absent/empty according to the existing WordPress field behavior.

---

# Service Categories

The source may identify a service category.

Before creating a category:

1. Query existing `service_category` terms.
2. Match by language and normalized name.
3. Reuse an existing category when it already exists.
4. Create only when the category is explicitly present in the source and does not exist.

Do not invent categories.

Do not create duplicate categories.

If categories are translated, preserve their Polylang relationship in the same way as service posts.

---

# REST Write Strategy

Use authenticated WordPress REST requests.

For a new service:

```http
POST /wp-json/wp/v2/services
```

Populate the appropriate language and basic WordPress fields.

Then populate ACF data through the same service REST resource:

```http
POST /wp-json/wp/v2/services/{id}
```

or the appropriate supported update method exposed by the installed WordPress/ACF REST schema.

ACF supports reading and updating custom fields through the WordPress REST API when the field group is exposed in REST.

Before performing writes, inspect the REST schema if necessary:

```http
OPTIONS /wp-json/wp/v2/services
OPTIONS /wp-json/wp/v2/services/{id}
```

Do not assume an undocumented request shape when the installed API exposes its schema.

---

# Polylang Linking

After both language posts exist, establish the translation relationship.

Use the Polylang REST mechanism:

```text
POST /wp-json/wp/v2/services/{id}?lang={language}&translations[{other_language}]={other_post_id}
```

The exact request must follow the installed REST schema and authentication behavior.

Example concept:

```text
Spanish:
lang=es
translations[en]=EN_POST_ID

English:
lang=en
translations[es]=ES_POST_ID
```

Do not assume that creating two posts automatically links them.

Verify the relationship afterward.

---

# Important Language Safety Rule

Because the ACF fields use:

```text
translations: ignore
```

never assume that updating the Spanish ACF data will populate English automatically.

Explicitly send the Spanish ACF payload to the Spanish post.

Explicitly send the English ACF payload to the English post.

Never copy Spanish ACF content into English.

Never translate content automatically unless the source document already provides the English version.

The source document is expected to provide both languages.

---

# Idempotency

Running the same import twice must not create duplicate services.

Example:

```text
First execution:
ES service → created
EN service → created
translation → linked

Second execution:
ES service → detected
EN service → detected
translation → detected
no duplicate posts created
```

The agent must report whether each service was:

```text
CREATED
EXISTING
UPDATED
SKIPPED
AMBIGUOUS
ERROR
```

Do not silently create duplicates.

---

# Validation

After importing all six services, verify:

## Services

Exactly the expected six logical services exist.

For each service:

```text
ES post exists
EN post exists
```

unless the source explicitly contains only one language.

## Languages

Verify:

```text
ES post → lang = es
EN post → lang = en
```

## Translation relationship

Verify:

```text
ES translations.en = EN ID
EN translations.es = ES ID
```

## ACF

Verify the returned `acf` object contains the expected data for both languages.

At minimum verify:

```text
intro_eyebrow
intro_title
intro_description
development_title
development_content
solutions_title
solutions_description
solutions
approach_title
approach_description
approach
tech_title
tech_description
tech_groups
faq_items
cta
```

Also verify optional fields when present in the source:

```text
intro_eyebrow_suffix
hero_stats
development_tags
solutions_eyebrow
solution links
```

## REST Consumption

Finally query the services through the same API consumed by Astro.

Verify that the resulting REST responses contain:

```text
title
excerpt
content
lang
translations
acf
```

and that both language versions can be retrieved independently.

---

# Failure Rules

Stop instead of guessing when:

* WordPress authentication fails.
* The `service` endpoint does not exist.
* The ACF `acf` object is unavailable.
* Spanish or English is not configured in Polylang.
* An existing service cannot be matched unambiguously.
* Two existing posts appear to represent the same logical service but their translation relationship is inconsistent.
* A required ACF field cannot be written.
* A REST response differs materially from the expected schema.

Never solve these situations by:

* creating duplicate posts
* deleting existing posts
* modifying Polylang configuration
* modifying ACF field configuration
* modifying WordPress plugins
* changing the CPT definition
* changing the ACF field group
* inventing missing content

Report the exact problem and affected service.

---

# Final Report

At the end report:

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

Errors:
- ...

Spanish/English relationships verified:
YES/NO

ACF data verified:
YES/NO

REST API consumption verified:
YES/NO
```

Also report the final WordPress IDs:

```text
Service
├── ES: ID
└── EN: ID
```

Do not perform unrelated cleanup, refactoring, configuration changes, or code changes outside the content import.

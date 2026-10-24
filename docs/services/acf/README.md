# Estructura ACF del CPT `service`

Un **único grupo de campos** (`group_gw_service_detail`, `location: post_type = service`,
`show_in_rest = 1`) que contiene **9 campos de tipo ACF Group**, uno por sección de la
página de servicio. Cada campo `Group` agrupa los campos de su sección.

```
group_gw_service_detail  (Service Detail)
├── hero          (Hero)                    → 9 campos
├── problema      (Problema)                → 5 campos
├── soluciones    (Soluciones)              → 4 campos
├── plataformas   (Plataformas)             → 9 campos   (bloque opcional, solo Integración)
├── proceso       (Cómo trabajamos)          → 4 campos
├── ficha         (Ficha técnica)           → 5 campos   (bloque opcional)
├── faq           (Preguntas frecuentes)    → 2 campos
├── cierre        (Cierre)                  → 1 campo    (el grupo `cta`)
└── relacionados  (Servicios relacionados)  → 3 campos
```

**42 campos** en total (76 nodos contando subcampos).

## REST: la estructura es anidada

Al anidar los campos en grupos, `acf` en `/wp/v2/services/{id}` deja de ser plano:

```json
{
  "acf": {
    "hero":   { "intro_title": "…", "hero_stats": [ … ] },
    "problema": { "development_title": "…", "development_content": "…" },
    "soluciones": { "solutions_title": "…", "solutions": [ … ] },
    "cierre": { "cta": { "title": "…", "button_text": "…", "button_url": "…" } }
  }
}
```

El sitio consume ese shape en `src/lib/wordpress/types.ts` (`WpServiceAcf` y las
interfaces `WpServiceHeroAcf`, `WpServiceProblemAcf`, `WpServiceSolutionsAcf`,
`WpServiceProcessAcf`, `WpServiceTechAcf`, `WpServiceFaqAcf`, `WpServiceClosingAcf`).

## Campos por sección

**Hero** — `intro_eyebrow`, `intro_title`, `intro_description`, `intro_eyebrow_suffix`
(reservado), `hero_stats[]` {label= Número, value= Título, description= Descripción},
`hero_cta_label`/`hero_cta_url`, `hero_secondary_label`/`hero_secondary_url`.

**Problema** — `development_eyebrow`, `development_title`, `development_content`,
`development_situations[]` {number, situation}, `development_tags[]` {tag} (línea de cierre).

**Soluciones** — `solutions_eyebrow`, `solutions_title`, `solutions_description`,
`solutions[]` {title, description, features[] {feature}, benefit, link {text, url}}.

**Plataformas** (bloque opcional, solo Integración) — `platforms_enabled`, `platforms_eyebrow`,
`platforms_title`, `platforms_description`, `platforms[]` {name, example},
`platforms_cta_title`, `platforms_cta_text`, `platforms_cta_label`, `platforms_cta_url`.

**Cómo trabajamos** — `approach_eyebrow`, `approach_title`, `approach_description`,
`approach[]` {title, description}.

**Ficha técnica** (bloque opcional) — `tech_enabled`, `tech_eyebrow`, `tech_title`,
`tech_description`, `tech_groups[]` {title, items[] {name}}.

**FAQ** — `faq_eyebrow`, `faq_items[]` {pregunta, respuesta}.

**Cierre** — `cta` (grupo) {eyebrow, title, description, button_text, button_url,
secondary_text, secondary_url}.

**Relacionados** — `related_eyebrow`, `related_title`, `related[]` {category, name, description, url}.

## Archivos

| Archivo | Contenido |
|---|---|
| `field-group-service-BEFORE.json` | Estructura anterior: un único grupo `group_gw_service_detail` con 20 campos planos |
| `field-group-service-TARGET.json` | Definición objetivo de los 42 campos en un solo grupo (referencia) |
| `field-group-service-AFTER.json` | Definición aplicada: 1 grupo con 9 campos `Group`, con `key`, `parent` y `_name` de cada campo |

## Notas técnicas

- En ACF 6.1 cada campo es un post `acf-field` con `post_parent` = ID del padre. Cada campo
  necesita su `key` explícita; los subcampos de un `group` necesitan además `_name` (ACF deriva
  el nombre completo como `grupo_subnombre`) y `parent` = key del padre.
- Los subcampos de un `group` deben llevar los **defaults del tipo** (p. ej. `new_lines` en los
  `textarea`); si faltan, ACF emite warnings al formatear el valor.
- Al anidar, las claves de postmeta cambian: `intro_title` → `hero_intro_title`,
  `cta_title` → `cierre_cta_title`, `hero_stats_0_label` → `hero_hero_stats_0_label`.
  Los valores existentes se migraron con `get_field()` → `update_field()` (API de ACF).
- Con el campo `Group` de sección, el nombre del campo en REST es el `name` del grupo
  (`hero`, `problema`, …). Ojo: el grupo `faq` colisiona por nombre con el campo `faq`
  del grupo *Home* (`group_6ab1bb51390c5`); para escribir en el correcto hay que usar su
  `key` (`field_gw_svc_section_faq`), no el nombre.
- Se conservó la `key` de todos los campos existentes, de modo que **los valores ya cargados no
  se perdieron**. Los subcampos `label` y `value` de los indicadores conservan su nombre (la
  etiqueta pasa a ser «Número» / «Título»), así que su contenido actual queda por reasignar en la
  importación de contenido.

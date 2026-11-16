# RGW-EP09-01-02 — Modelo ACF Service Detail

Grupo único `Service Detail` (location: `post_type == service`),
`show_in_rest: true`. Claves `field_gw_svc_*`. Números siempre derivados
del índice en Astro (ningún campo numérico).

El grupo vive en WordPress (`key: group_gw_service_detail`, id 964) y
está compuesto por **9 subgrupos** (uno por sección de la plantilla).

## Estructura
```text
Service Detail (Group)
├── hero (Group)
│   ├── intro_eyebrow (Text, req.) · intro_title (Text, req.)
│   ├── intro_description (Textarea, req.) · intro_eyebrow_suffix (Text)
│   ├── icono (Text) → nombre del icono en el catálogo de Icon.astro
│   ├── hero_stats[] (Repeater: label/value/description)
│   ├── hero_cta_label (Text) · hero_cta_url (Text)
│   └── hero_secondary_label (Text) · hero_secondary_url (Text)
├── problema (Group)
│   ├── development_eyebrow (Text) · development_title (Text, req.)
│   ├── development_content (Textarea, req.)
│   ├── development_situations[] (Repeater: number/situation)
│   └── development_tags[] (Repeater: tag)
├── soluciones (Group)
│   ├── solutions_eyebrow (Text) · solutions_title (Text, req.)
│   ├── solutions_description (Textarea, req.)
│   └── solutions[] (Repeater, req.)
│       ├── title (Text req.) · description (Textarea req.)
│       ├── features[] (Repeater opcional: feature Text req.)
│       ├── benefit (Text)
│       └── link (Group opcional: text Text + url Text)
├── plataformas (Group)
│   ├── platforms_enabled (True/False) → interruptor del bloque
│   ├── platforms_eyebrow (Text) · platforms_title (Text)
│   ├── platforms_description (Textarea)
│   ├── platforms[] (Repeater: name Text + example Textarea)
│   └── platforms_cta_title (Text) · platforms_cta_text (Textarea)
│       · platforms_cta_label (Text) · platforms_cta_url (Text)
├── proceso (Group)
│   ├── approach_eyebrow (Text) · approach_title (Text, req.)
│   ├── approach_description (Textarea, req.)
│   └── approach[] (Repeater, req.: title/description)
├── ficha (Group)
│   ├── tech_enabled (True/False) · tech_eyebrow (Text)
│   ├── tech_title (Text, req.) · tech_description (Textarea, req.)
│   └── tech_groups[] (Repeater, req.: title + items[] {name})
├── faq (Group)
│   ├── faq_eyebrow (Text)
│   └── faq_items[] (Repeater opcional: pregunta/respuesta)
├── cierre (Group)
│   └── cta (Group: eyebrow/title/description/button_text/button_url
│             + secondary_text/secondary_url)
└── relacionados (Group)
    ├── related_eyebrow (Text) · related_title (Text)
    └── related[] (Repeater: category/name/description/url)
```

## Reglas
- Imagen del servicio = WP `featured_media` (no campo ACF imagen).
- Enlaces = Group `{text, url}` (patrón `WpHomeButton`).
- **`Translations = Ignore` en TODOS los subcampos** (lección de los
  syncs ES↔EN: `translate` propaga vía `PLL ACF Dispatcher::update`).
  Verificado también en `icono`: cambiar el valor ES no propaga al EN.
- Títulos/descripciones visibles: req.; `features`, `faq`, `link`: opcionales.
- Sin lógica por slug; sin contenido hardcodeado en Astro.
- `icono` es un **único campo técnico compartido** por ES y EN (no hay
  campos duplicados por idioma); cada publicación tiene su propio valor.

## Integración en Astro
| Subgrupo ACF     | Componente                                        |
|------------------|---------------------------------------------------|
| `hero`           | `ServiceHeader` (icono: `acf.hero.icono`)         |
| `problema`       | `ServiceDetail` (S02)                             |
| `soluciones`     | `ServiceDetail` (S03)                             |
| `plataformas`    | `ServicePlatforms` (S03b; lo habilita `platforms_enabled`) |
| `proceso`        | `ServiceApproach` (S04)                           |
| `ficha`          | `ServiceDetail` (S05; lo habilita `tech_enabled`) |
| `faq`            | `ServiceFaq` (S06)                                |
| `cierre`         | `ServiceDetail` (S07)                             |
| `relacionados`   | `ServiceRelated` (S08)                            |

El campo `hero.icono` alimenta además las tarjetas de servicios del Home
(`Expertise.astro`): si no hay valor, se conserva el emparejamiento por
palabra clave del título.

## Creación
El grupo se administra en WordPress (base de datos, no en este repo); su
definición se versiona en la documentación y se valida por REST
(`/wp-json/wp/v2/services`).

# RGW-EP09-01-02 — Modelo ACF Service Detail

Grupo único `Service Detail` (location: `post_type == service`),
`show_in_rest: true`. Claves `field_gw_svc_*`. Números siempre derivados
del índice en Astro (ningún campo numérico).

## Estructura
```text
service_detail (Group)
├── intro_eyebrow (Text, req.) · intro_title (Text, req.)
├── intro_description (Textarea, req.)
├── development_title (Text, req.) · development_content (Textarea, req.)
├── solutions_title/description (req.)
├── solutions[] (Repeater, min 1)
│   └── title (Text req.) + description (Textarea req.)
│       + features[] (Repeater opcional: Text req.)
│       + link (Group opcional: text Text + url Url)
├── approach_title/description (req.)
├── approach[] (Repeater, min 1)
│   └── title (Text req.) + description (Textarea req.)
├── tech_title/description (req.)
├── tech_groups[] (Repeater, min 1)
│   └── title (Text req.) + items[] (Repeater: name Text req.)
├── faq_items[] (Repeater opcional: {pregunta, respuesta})
└── cta (Group: title/description/button_text/button_url, req. salvo url)
```

## Reglas
- Imagen del servicio = WP `featured_media` (no campo ACF imagen).
- Enlaces = Group `{text, url}` (patrón `WpHomeButton`).
- **`Translations = Ignore` en TODOS los subcampos** (lección de los
  syncs ES↔EN: `translate` propaga vía `PLL ACF Dispatcher::update`).
- Títulos/descripciones visibles: req.; `features`, `faq`, `link`: opcionales.
- Sin lógica por slug; sin contenido hardcodeado en Astro.

## Creación
`acf_add_local_field_group()` en el child theme (código versionado en
Jira como evidencia; el grupo vive en WP, no en este repo).

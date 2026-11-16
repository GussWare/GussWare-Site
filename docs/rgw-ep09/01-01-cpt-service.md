# RGW-EP09-01-01 — Modelo del CPT Service

Decisión de arquitectura para el Custom Post Type `service` (fuente única de Servicios).

## Registro
- **Key**: `service` (singular inglés, convención WP/REST).
- **Implementación**: registro por código en `functions.php` del child theme
  (`hello-theme-child-master`), sin plugins nuevos (el CPT `proyects`
  existente no tiene origen en código localizable; se evita repetir ese patrón).
- **Labels**: ES/EN vía `__()` (el CPT es traducible; los labels admin quedan en
  idioma del backend).

## Argumentos `register_post_type`
- `public: true`, `show_ui: true`, `show_in_menu: true`,
  `show_in_rest: true`, `rest_base: 'services'`.
- `hierarchical: false`, `has_archive: false` (Astro define las rutas;
  se evita colisión con el frontend WP), `rewrite: { slug: 'servicios' }`,
  `query_var: true`.
- `supports`: `title, editor, excerpt, thumbnail (featured image = visual
  del servicio), revisions, custom-fields, author`.
- `menu_icon: 'dashicons-admin-tools'`, `menu_position: 21`.
- `capability_type: 'post'`, `map_meta_cap: true`.

## Polylang
- Filtro `pll_get_post_types` para declarar `service` traducible
  (el CPT `proyects` demuestra que sin esto no hay `lang`/`translations`).
- Slugs independientes por idioma; relación vía `translations`
  (igual que pages 62↔224).

## REST
- Colección `/wp/v2/services`, ítem `/wp/v2/services/<id>`,
  filtro `?slug=` + `?lang=` (patrón `getPageBySlug`).
- ACF con `show_in_rest: true` expone `acf.service_detail`.

## Fuera de alcance
Taxonomías (RGW-EP09-02-03) y campos ACF (RGW-EP09-03).

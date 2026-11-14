# RGW-EP09-01-03 — Relación Servicios ↔ Home

## Decisión
El Home deja de ser fuente de servicios. `Home.acf.services` conserva
solo el encabezado (`title`, `description`); los ítems se consultan del
CPT `service` filtrando por `lang`.

## Consumo
- Listado Home: `GET /wp/v2/services?lang=<locale>&per_page=100` →
  `{title (post_title), description (excerpt o campo resumen), url}`.
- Cada tarjeta enlaza al detalle (navegación Home→índice/detalle).
- `services.items[]` del Home queda obsoleto (no se borra el campo ACF
  en este Epic; se deja de consumir).

## Rutas (patrón blog, sin lógica por slug)
- Índice: `/servicios` (ES), `/en/servicios` (EN) — mismo segmento
  ambos idiomas, como `/blog`.
- Detalle: `/servicios/[slug]` (ES), `/en/servicios/[slug]` (EN).
- Helpers en `src/lib/routes.ts`: `servicesBaseUrl(locale)`,
  `serviceDetailUrl(locale, slug)` (análogos a `blogBaseUrl/blogPostUrl`).
- Breadcrumb raíz existente (`getBreadcrumbHome`); `LocaleUrls` vía
  `translations` de Polylang del propio CPT.

## Sitemap
Extender `discoverSitemapUrls()` (`astro.config.mjs`) con
`/wp/v2/services?per_page=100&_fields=id,slug,status,lang`.

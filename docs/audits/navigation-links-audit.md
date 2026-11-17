# Auditoría integral de navegación, enlaces y contenido — GussWare Site

> **Tipo de trabajo:** investigación, pruebas y documentación (solo lectura).
> **No se modificó código fuente, contenido, WordPress, configuración ni producción.**
> Todas las pruebas se ejecutaron contra el sitio desplegado en **PRODUCCIÓN**.

---

## 0. Artefactos de la auditoría

Todos los datos y capturas proceden del dominio público `https://gussware.dev` (producción).

| Artefacto | Contenido |
|---|---|
| `docs/audits/data/page_inventory.json` | Estado HTTP, URL final, `html lang`, canonical, títulos, texto de `<main>`, enlaces, imágenes, errores de consola y peticiones fallidas de las 34 rutas probadas. |
| `docs/audits/data/link_navigation.json` | 483 pruebas de navegación (click real) en escritorio: página de origen, texto del enlace, `href`, URL final, estado HTTP, contenido del destino, idioma y errores. |
| `docs/audits/data/link_navigation_mobile_retry.json` | 134 pruebas de navegación repetidas en viewport móvil (390 px) para los enlaces de paneles ocultos en escritorio. |
| `docs/audits/data/visual_checks.json` | Verificación de imágenes con scroll completo, anclas internas y navegación móvil (burger, panel, desbordamiento horizontal). |
| `docs/audits/data/navigation_behavior.json` | Recarga, atrás/adelante, fragmentos, parámetros de consulta y acceso directo por HTTP. |
| `docs/audits/data/evidence.json` | Volcados de DOM puntuales que sustentan cada hallazgo (CTA de los servicios, selector de idioma, header, pie, orden de secciones del home, datos legales). |
| `docs/audits/screenshots/` | Capturas de pantalla de producción (24 capturas dirigidas + capturas de página y de móvil). |

Metodología de las pruebas: Playwright 1.63 / Chromium 120, `waitUntil: 'load'`, viewport 1440×900
(escritorio) y 390×844 con `isMobile` (móvil); los destinos se comprobaron con una petición HTTP
independiente para fijar el código real (no se considera éxito un simple HTTP 200: se verificó además
la presencia de contenido, la coherencia del idioma y la ausencia de errores de consola).

**Re-verificación final.** Al cerrar la auditoría se repitieron las comprobaciones de los cinco
problemas de mayor severidad directamente contra `https://gussware.dev`, con el resultado siguiente
(consistente con lo observado durante el resto de la auditoría):

| Comprobación | Resultado observado en la re-verificación |
|---|---|
| `/contact/` — texto de la columna izquierda | `""` (vacío), 0 `<h1>`, `<svg>` con **0 hijos** |
| `/en/servicios/technical-consulting/` — CTA a contacto | 4 enlaces con `href="/contact"` |
| `/en/term-of-service` | HTTP **404** |
| `/terminos-y-condiciones/` — selector EN | `/en/terminos-y-condiciones/` → HTTP **404** |
| `/en/` — botón del header | `href="/contacto"`, texto «Iniciar Conversación» |
| Pie a 390 px | 4 enlaces visibles de 26 |

---

## A. Resumen ejecutivo

| Dato | Valor |
|---|---|
| Dominio auditado | `https://gussware.dev` (producción, Hostinger/CDN `hcdn`) |
| Fecha de auditoría | 16 de noviembre de 2026 |
| Versión desplegada auditada | `Last-Modified: Mon, 16 Nov 2026 00:37:33 GMT` (ETag `W/"f98b-6afa504d-e7d7c0083fd45c0c;gz"`) |
| Páginas identificadas | 34 rutas |
| Páginas probadas | 34 (100 %) |
| Páginas con HTTP 200 | 25 |
| Páginas inexistentes (404) | 9 |
| Enlaces identificados | 626 enlaces únicos (origen + `href` + texto) / 1 252 instancias en el HTML renderizado |
| Enlaces probados con navegación real (click) | 614 ejecuciones de click (480 en escritorio + 134 en móvil), que cubren 341 enlaces internos del plan |
| Enlaces resueltos por equivalencia de DOM (header/pie idénticos, verificado por firma) | 285 |
| Enlaces verificados por HTTP directo (no clicables: fixture de pruebas) | 3 → **BROKEN (404)** |
| Enlaces externos / `mailto:` no verificables por click | 12 |
| **Resultado PASS** | 535 |
| **Resultado EMPTY_PAGE** | 24 |
| **Resultado WRONG_LANGUAGE** | 46 |
| **Resultado BROKEN (404)** | 18 |
| **Resultado EXTERNAL_UNVERIFIED** | 12 |
| **Resultado NEEDS_REVIEW** | 3 (resueltos por HTTP directo → BROKEN) |
| Problemas únicos detectados | 15 |
| Severidad CRITICAL | 3 |
| Severidad HIGH | 4 |
| Severidad MEDIUM | 5 |
| Severidad LOW | 3 |

### Veredicto

La **navegación principal funciona**: las 25 páginas publicadas cargan con HTTP 200, sin errores de
consola, sin peticiones fallidas, sin imágenes rotas, con anclas funcionales, recarga estable y
historial de navegación correcto. El problema no es la estructura del sitio, sino el **destino de un
conjunto de CTA y la localización de la navegación global**.

El defecto de mayor impacto es que **existen dos rutas de contacto en español** — `/contacto/`
(contenido completo, publicada por WordPress) y `/contact/` (ruta estática de Astro, **sin contenido**) —
y la navegación global (CTA móvil, CTA de cierre de los servicios, botón del header) apunta
mayoritariamente a la **ruta vacía**. En las páginas en inglés, además, **todos** esos CTA apuntan a
la versión española.

### Hallazgosazgos principales

1. **CRITICAL** — `/contact/` carga sin contenido: la columna izquierda (eyebrow, título, descripción y
   texto de redes) está vacía y el icono social se renderiza como un `<svg>` sin trazados.
2. **CRITICAL** — Todos los CTA de las páginas de servicio en inglés apuntan a `/contact` (página en
   español y vacía). El usuario inglés aterriza en contenido español.
3. **CRITICAL** — El enlace «Term of Service» del pie en inglés apunta a `/en/term-of-service` → **404**.
4. **HIGH** — El selector de idioma de `/terminos-y-condiciones/` apunta a `/en/terminos-y-condiciones/`
   → **404** (no existe traducción de esa página legal).
5. **HIGH** — El botón del header en las páginas en inglés muestra «Iniciar Conversación» (español) y
   enlaza a `/contacto` (español).
6. **HIGH** — El CTA de cierre de cada servicio en inglés («See all services») apunta a `/servicios`
   (listado en español).
7. **HIGH** — En móvil (< 768 px) desaparece **por completo** el menú de navegación del pie (22 de 26
   enlaces ocultos).
8. **MEDIUM** — `/servicios/` y `/en/servicios/` se publican sin título ni descripción de sección
   (el código lee `home.acf.services`, campo que no existe en la Page de portada de WordPress).
9. **MEDIUM** — `/navfixturetest/` (fixture de pruebas interna) está publicada en producción.
10. **MEDIUM** — El pie en inglés muestra la descripción y el copyright en español.

---

## B. Inventario de páginas

**Cómo se construyó el inventario.** Se combinaron cuatro fuentes: (a) el `sitemap-0.xml` publicado
(22 URLs), (b) la enumeración del contenido real en WordPress vía REST (`wp/v2/pages`, `wp/v2/services`,
`wp/v2/posts`, `wp/v2/projects` para `lang=es` y `lang=en`), (c) las rutas declaradas en el código del
proyecto (`src/pages/**`) y (d) los destinos concretos de los menús de WordPress
(`/gussware/v1/menus`). Ninguna ruta quedó fuera de la auditoría.

**Correspondencia ES ↔ EN.** El sitio se construye con `i18n.routing.prefixDefaultLocale: false` y
`locales: ['es','en']`. Las equivalencias se resolvieron por el `slug` real de cada idioma:

| Español | Inglés | Estado de la equivalencia |
|---|---|---|
| `/` | `/en/` | Correcta |
| `/contacto/` | `/en/contact/` | Correcta |
| `/politica-de-privacidad/` | `/en/privacy-policy/` | Correcta |
| `/terminos-y-condiciones/` | — | **Sin traducción EN** (ver P-04) |
| `/servicios/` | `/en/servicios/` | Correcta (6 de 6 servicios traducidos) |
| `/servicios/<slug>/` (6) | `/en/servicios/<slug>/` (6) | Correcta (polylang `translations`) |
| — | `/contact/` | Ruta estática **solo ES**, sin equivalente EN (`reservedEn` en `src/pages/[...uri].astro`) |

**Rutas de contenido dinámico no publicadas.** El CPT `projects` tiene **10 proyectos publicados** en
WordPress y el CPT `posts` tiene **1 artículo publicado** (`hola-mundo`), pero sus rutas están en
`src/pages/_proyectos/` y `src/pages/_blog/` (prefijo `_`, que Astro ignora por convención, documentado
en los `README.md` de esas carpetas). Por tanto `/proyectos/`, `/en/proyectos/`, `/blog/` y `/en/blog/`
**no existen en el sitio publicado**. Se verificó que **ningún enlace renderizado apunta a ellas**, por
lo que no son enlaces rotos visibles, sino funcionalidad ausente. La sección «Proyectos» del home está
oculta porque `gussware/v1/landing-page` devuelve `show_projects: false`.

| Ruta | URL completa | Idioma | Propósito | Resultado |
|---|---|---|---|---|
| `/` | https://gussware.dev/ | es | Portada ES — Hero, Capacidades, Proceso, Modelo, FAQ, CTA final | PASS |
| `/contact/` | https://gussware.dev/contact/ | es | Contacto ES — ruta estática de Astro (duplica `/contacto`) | **EMPTY_PAGE** |
| `/contacto/` | https://gussware.dev/contacto/ | es | Contacto ES — Page de WordPress (contenido completo) | PASS |
| `/servicios/` | https://gussware.dev/servicios/ | es | Listado de servicios ES (6 tarjetas) | **PARTIAL_CONTENT** |
| `/servicios/diseno-sitios-web-tiendas-en-linea/` | https://gussware.dev/servicios/diseno-sitios-web-tiendas-en-linea/ | es | Detalle de servicio ES | PASS |
| `/servicios/desarrollo-a-medida/` | https://gussware.dev/servicios/desarrollo-a-medida/ | es | Detalle de servicio ES | PASS |
| `/servicios/aplicaciones-moviles/` | https://gussware.dev/servicios/aplicaciones-moviles/ | es | Detalle de servicio ES | PASS |
| `/servicios/devops-y-soporte-tecnico/` | https://gussware.dev/servicios/devops-y-soporte-tecnico/ | es | Detalle de servicio ES | PASS |
| `/servicios/consultoria-tecnica/` | https://gussware.dev/servicios/consultoria-tecnica/ | es | Detalle de servicio ES | PASS |
| `/servicios/integracion-de-apis-y-servicios-externos/` | https://gussware.dev/servicios/integracion-de-apis-y-servicios-externos/ | es | Detalle de servicio ES | PASS |
| `/politica-de-privacidad/` | https://gussware.dev/politica-de-privacidad/ | es | Legal ES — Política de Privacidad | PASS |
| `/terminos-y-condiciones/` | https://gussware.dev/terminos-y-condiciones/ | es | Legal ES — Términos y Condiciones | PASS |
| `/en/` | https://gussware.dev/en/ | en | Portada EN — Hero, Capabilities, Model, Process, FAQ, CTA final | PASS |
| `/en/contact/` | https://gussware.dev/en/contact/ | en | Contacto EN — traducción de la Page de WordPress | PASS |
| `/en/servicios/` | https://gussware.dev/en/servicios/ | en | Listado de servicios EN (6 tarjetas) | **PARTIAL_CONTENT** |
| `/en/servicios/website-and-online-store-design/` | https://gussware.dev/en/servicios/website-and-online-store-design/ | en | Detalle de servicio EN | PASS |
| `/en/servicios/mobile-applications/` | https://gussware.dev/en/servicios/mobile-applications/ | en | Detalle de servicio EN | PASS |
| `/en/servicios/custom-software-development/` | https://gussware.dev/en/servicios/custom-software-development/ | en | Detalle de servicio EN | PASS |
| `/en/servicios/api-and-external-service-integration/` | https://gussware.dev/en/servicios/api-and-external-service-integration/ | en | Detalle de servicio EN | PASS |
| `/en/servicios/devops-technical-support/` | https://gussware.dev/en/servicios/devops-technical-support/ | en | Detalle de servicio EN | PASS |
| `/en/servicios/technical-consulting/` | https://gussware.dev/en/servicios/technical-consulting/ | en | Detalle de servicio EN | PASS |
| `/en/privacy-policy/` | https://gussware.dev/en/privacy-policy/ | en | Legal EN — Privacy Policy | **PARTIAL_CONTENT** |
| `/en/term-of-service/` | https://gussware.dev/en/term-of-service/ | en | Legal EN — destino del enlace del menú Legal EN | **BROKEN (404)** |
| `/en/terms-and-conditions/` | https://gussware.dev/en/terms-and-conditions/ | en | Legal EN (slug equivalente ES) | HTTP 404 |
| `/blog/` | https://gussware.dev/blog/ | es | Listado de blog ES (código en `_blog/`, fuera del build) | **BROKEN (404)** |
| `/en/blog/` | https://gussware.dev/en/blog/ | en | Listado de blog EN (código en `[locale]/_blog/`, fuera del build) | **BROKEN (404)** |
| `/blog/hola-mundo/` | https://gussware.dev/blog/hola-mundo/ | es | Detalle de artículo ES publicado en WordPress | **BROKEN (404)** |
| `/proyectos/` | https://gussware.dev/proyectos/ | es | Listado de proyectos ES (código en `_proyectos/`, fuera del build) | **BROKEN (404)** |
| `/en/proyectos/` | https://gussware.dev/en/proyectos/ | en | Listado de proyectos EN (fuera del build) | **BROKEN (404)** |
| `/proyectos/interlink/` | https://gussware.dev/proyectos/interlink/ | es | Detalle de proyecto ES publicado en WordPress | **BROKEN (404)** |
| `/navfixturetest/` | https://gussware.dev/navfixturetest/ | es | Fixture interno de pruebas del Header (no debe estar en producción) | **EMPTY_PAGE** |
| `/404.html` | https://gussware.dev/404.html | es | Página de error 404 | PASS (con selector de idioma roto) |
| `/500.html` | https://gussware.dev/500.html | es | Página de error 500 | PASS (ruta canónica inexistente) |
| `/ruta-inexistente-auditoria-xyz/` | https://gussware.dev/ruta-inexistente-auditoria-xyz/ | es | Ruta inexistente (control negativo) | PASS (404 correcto) |

### Redirecciones por ausencia de barra final

Todas las rutas sin barra final redirigen correctamente a su forma canónica (HTTP 200 tras redirección):

| Origen | Destino final | Resultado |
|---|---|---|
| `/servicios` | `/servicios/` | PASS |
| `/en/servicios` | `/en/servicios/` | PASS |
| `/contact` | `/contact/` | PASS (a la página **vacía**) |
| `/en/contact` | `/en/contact/` | PASS |
| `/en` | `/en/` | PASS |
| `/contacto` | `/contacto/` | PASS |
| `/politica-de-privacidad` | `/politica-de-privacidad/` | PASS |
| `/terminos-y-condiciones` | `/terminos-y-condiciones/` | PASS |
| `/en/privacy-policy` | `/en/privacy-policy/` | PASS |
| `/servicios/diseno-sitios-web-tiendas-en-linea` | `/servicios/diseno-sitios-web-tiendas-en-linea/` | PASS |
| `/en/servicios/website-and-online-store-design` | `/en/servicios/website-and-online-store-design/` | PASS |
| `/en/term-of-service` | — | **404 (no existe)** |

---

## C. Inventario de enlaces

**Cobertura.** Sobre las 25 páginas publicadas se extrajeron **1 252 instancias de `<a href>`**:
1 240 internas, 3 externas y 9 `mailto:`. Tras deduplicar por (página de origen + `href` + texto)
quedan **626 enlaces únicos**, todos ellos probados. Los enlaces del header y del pie son idénticos
entre las páginas del mismo idioma (se comparó la firma DOM de cada bloque); el selector de idioma se
probó en **todas** las páginas porque su destino cambia en función de la ruta actual.

Leyenda de resultados:

| Estado | Significado |
|---|---|
| `PASS` | El enlace navega, el destino carga con contenido y el idioma es el esperado. |
| `BROKEN` | El destino no existe (HTTP 404). |
| `WRONG_LANGUAGE` | El destino existe pero está en el idioma incorrecto respecto al origen. |
| `EMPTY_PAGE` | El destino carga pero no muestra contenido funcional. |
| `PASS *` | Resultado heredado de una página gemela con header/pie idéntico (mismo DOM verificado). |
| `EXTERNAL_UNVERIFIED` | Enlace externo o `mailto:` no verificable desde el entorno de pruebas. |

| Página de origen | Idioma | Texto del enlace | `href` | Destino alcanzado | Resultado |
|---|---|---|---|---|---|
| / | es | GussWare Home | `/` | / | PASS |
| / | es | Servicios | `#servicios` | /#servicios | PASS |
| / | es | Nuestro Proceso | `#como-trabajamos` | /#como-trabajamos | PASS |
| / | es | Nuestro Modelo | `#nuestro-modelo` | /#nuestro-modelo | PASS |
| / | es | Faq | `#preguntas` | /#preguntas | PASS |
| / | es | ES | `/` | / | PASS |
| / | es | EN | `/en/` | /en/ | PASS |
| / | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS |
| / | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| / | es | Iniciar una Conversación | `/contacto` | /contacto/ | PASS |
| / | es | Diseño de sitios web y E-commerceUna p | `/servicios/diseno-sitios-web-tiendas-en-linea/` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| / | es | Desarrollo a medidaSi tus procesos dep | `/servicios/desarrollo-a-medida/` | /servicios/desarrollo-a-medida/ | PASS |
| / | es | Aplicaciones móvilesSi tus clientes o  | `/servicios/aplicaciones-moviles/` | /servicios/aplicaciones-moviles/ | PASS |
| / | es | DevOps y Soporte TécnicoUna actualizac | `/servicios/devops-y-soporte-tecnico/` | /servicios/devops-y-soporte-tecnico/ | PASS |
| / | es | Consultoría técnicaNo necesitas conoce | `/servicios/consultoria-tecnica/` | /servicios/consultoria-tecnica/ | PASS |
| / | es | Integracion de Apis y Servicios Extern | `/servicios/integracion-de-apis-y-servicios-externos/` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| / | es | Inicia una conversación | `/contacto` | /contacto/ | PASS |
| / | es | Servicios | `/#servicios` | /#servicios | PASS |
| / | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS |
| / | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS |
| / | es | Faq | `/#preguntas` | /#preguntas | PASS |
| / | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| / | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| / | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS |
| / | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS |
| / | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS |
| / | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| / | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS |
| / | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS |
| /contact/ | es | GussWare Home | `/` | / | PASS |
| /contact/ | es | Servicios | `/#servicios` | /#servicios | PASS |
| /contact/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS |
| /contact/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS |
| /contact/ | es | Faq | `/#preguntas` | /#preguntas | PASS |
| /contact/ | es | ES | `/contact/` | /contact/ | EMPTY_PAGE |
| /contact/ | es | EN | `/en/contact/` | /en/contact/ | PASS |
| /contact/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS |
| /contact/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /contact/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /contact/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /contact/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS |
| /contact/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /contact/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS |
| /contact/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /contact/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS |
| /contact/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS |
| /contacto/ | es | GussWare Home | `/` | / | PASS * |
| /contacto/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /contacto/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /contacto/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /contacto/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /contacto/ | es | ES | `/contacto/` | /contacto/ | PASS |
| /contacto/ | es | EN | `/en/contact/` | /en/contact/ | PASS |
| /contacto/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /contacto/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /contacto/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /contacto/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /contacto/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /contacto/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /contacto/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /contacto/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /contacto/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /contacto/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/ | es | ES | `/servicios/` | /servicios/ | PASS |
| /servicios/ | es | EN | `/en/servicios/` | /en/servicios/ | PASS |
| /servicios/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/ | es | Inicio | `/` | / | PASS |
| /servicios/ | es | Read more | `/servicios/diseno-sitios-web-tiendas-en-linea/` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/ | es | Read more | `/servicios/desarrollo-a-medida/` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/ | es | Read more | `/servicios/aplicaciones-moviles/` | /servicios/aplicaciones-moviles/ | PASS |
| /servicios/ | es | Read more | `/servicios/devops-y-soporte-tecnico/` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /servicios/ | es | Read more | `/servicios/consultoria-tecnica/` | /servicios/consultoria-tecnica/ | PASS |
| /servicios/ | es | Read more | `/servicios/integracion-de-apis-y-servicios-externos/` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | ES | `/servicios/diseno-sitios-web-tiendas-en-linea/` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | EN | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Cuéntanos tu proyecto | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Ver soluciones | `#soluciones` | /servicios/diseno-sitios-web-tiendas-en-linea/#soluciones | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Diseñemos tu sitio web | `/contacto` | /contacto/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Ver servicio | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Ver servicio | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Ver servicio | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/diseno-sitios-web-tiendas-en-linea/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/desarrollo-a-medida/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/desarrollo-a-medida/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/desarrollo-a-medida/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/desarrollo-a-medida/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/desarrollo-a-medida/ | es | ES | `/servicios/desarrollo-a-medida/` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/desarrollo-a-medida/ | es | EN | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/desarrollo-a-medida/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Hablemos de tu proceso | `/contacto` | /contacto/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Ver soluciones | `#soluciones` | /servicios/desarrollo-a-medida/#soluciones | PASS |
| /servicios/desarrollo-a-medida/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Cuéntanos qué necesitas resolver | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/desarrollo-a-medida/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Ver servicio | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Ver servicio | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Ver servicio | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/desarrollo-a-medida/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/desarrollo-a-medida/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/aplicaciones-moviles/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/aplicaciones-moviles/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/aplicaciones-moviles/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/aplicaciones-moviles/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/aplicaciones-moviles/ | es | ES | `/servicios/aplicaciones-moviles/` | /servicios/aplicaciones-moviles/ | PASS |
| /servicios/aplicaciones-moviles/ | es | EN | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/aplicaciones-moviles/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Hablemos de tu app | `/contacto` | /contacto/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Ver soluciones | `#soluciones` | /servicios/aplicaciones-moviles/#soluciones | PASS |
| /servicios/aplicaciones-moviles/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Cuéntanos tu idea | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/aplicaciones-moviles/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Ver servicio | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Ver servicio | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Ver servicio | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/aplicaciones-moviles/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/aplicaciones-moviles/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | ES | `/servicios/devops-y-soporte-tecnico/` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | EN | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/devops-y-soporte-tecnico/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Hablemos de tu operación | `/contacto` | /contacto/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Ver soluciones | `#soluciones` | /servicios/devops-y-soporte-tecnico/#soluciones | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Revisemos tus sistemas | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/devops-y-soporte-tecnico/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Ver servicio | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Ver servicio | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Ver servicio | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS |
| /servicios/devops-y-soporte-tecnico/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/devops-y-soporte-tecnico/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/consultoria-tecnica/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/consultoria-tecnica/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/consultoria-tecnica/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/consultoria-tecnica/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/consultoria-tecnica/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/consultoria-tecnica/ | es | ES | `/servicios/consultoria-tecnica/` | /servicios/consultoria-tecnica/ | PASS |
| /servicios/consultoria-tecnica/ | es | EN | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /servicios/consultoria-tecnica/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/consultoria-tecnica/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/consultoria-tecnica/ | es | Hablemos de tu idea | `/contacto` | /contacto/ | PASS |
| /servicios/consultoria-tecnica/ | es | Ver soluciones | `#soluciones` | /servicios/consultoria-tecnica/#soluciones | PASS |
| /servicios/consultoria-tecnica/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/consultoria-tecnica/ | es | Cuéntanos tu proyecto | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/consultoria-tecnica/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/consultoria-tecnica/ | es | Ver servicio | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/consultoria-tecnica/ | es | Ver servicio | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/consultoria-tecnica/ | es | Ver servicio | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /servicios/consultoria-tecnica/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/consultoria-tecnica/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/consultoria-tecnica/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | GussWare Home | `/` | / | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | ES | `/servicios/integracion-de-apis-y-servicios-externos/` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | EN | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Servicios | `/servicios/` | /servicios/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Cuéntanos tu caso | `/contacto` | /contacto/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Ver soluciones | `#soluciones` | /servicios/integracion-de-apis-y-servicios-externos/#soluciones | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Conoce más | `/contacto` | /contacto/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Consultar mi integración | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Conectemos tus sistemas | `/contact` | /contact/ | EMPTY_PAGE |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Ver todos los servicios | `/servicios` | /servicios/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Ver servicio | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Ver servicio | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Ver servicio | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /servicios/integracion-de-apis-y-servicios-externos/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /politica-de-privacidad/ | es | GussWare Home | `/` | / | PASS * |
| /politica-de-privacidad/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /politica-de-privacidad/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /politica-de-privacidad/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /politica-de-privacidad/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /politica-de-privacidad/ | es | ES | `/politica-de-privacidad/` | /politica-de-privacidad/ | PASS |
| /politica-de-privacidad/ | es | EN | `/en/privacy-policy/` | /en/privacy-policy/ | PASS |
| /politica-de-privacidad/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /politica-de-privacidad/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /politica-de-privacidad/ | es | Inicio | `/` | / | PASS |
| /politica-de-privacidad/ | es | 01.Responsable del tratamiento | `#sec-01` | /politica-de-privacidad/#sec-01 | PASS |
| /politica-de-privacidad/ | es | 02.Datos personales | `#sec-02` | /politica-de-privacidad/#sec-02 | PASS |
| /politica-de-privacidad/ | es | 03.Finalidades | `#sec-03` | /politica-de-privacidad/#sec-03 | PASS |
| /politica-de-privacidad/ | es | 04.Uso y protección | `#sec-04` | /politica-de-privacidad/#sec-04 | PASS |
| /politica-de-privacidad/ | es | 05.Transferencia | `#sec-05` | /politica-de-privacidad/#sec-05 | PASS |
| /politica-de-privacidad/ | es | 06.Derechos ARCO | `#sec-06` | /politica-de-privacidad/#sec-06 | PASS |
| /politica-de-privacidad/ | es | 07.Revocación | `#sec-07` | /politica-de-privacidad/#sec-07 | PASS |
| /politica-de-privacidad/ | es | 08.Cookies | `#sec-08` | /politica-de-privacidad/#sec-08 | PASS |
| /politica-de-privacidad/ | es | 09.Cambios al aviso | `#sec-09` | /politica-de-privacidad/#sec-09 | PASS |
| /politica-de-privacidad/ | es | 10.Actualización | `#sec-10` | /politica-de-privacidad/#sec-10 | PASS |
| /politica-de-privacidad/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /politica-de-privacidad/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /politica-de-privacidad/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /politica-de-privacidad/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /politica-de-privacidad/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /politica-de-privacidad/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /politica-de-privacidad/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /politica-de-privacidad/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /terminos-y-condiciones/ | es | GussWare Home | `/` | / | PASS * |
| /terminos-y-condiciones/ | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /terminos-y-condiciones/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /terminos-y-condiciones/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /terminos-y-condiciones/ | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /terminos-y-condiciones/ | es | ES | `/terminos-y-condiciones/` | /terminos-y-condiciones/ | PASS |
| /terminos-y-condiciones/ | es | EN | `/en/terminos-y-condiciones/` | /en/terminos-y-condiciones/ | BROKEN |
| /terminos-y-condiciones/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /terminos-y-condiciones/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /terminos-y-condiciones/ | es | Inicio | `/` | / | PASS |
| /terminos-y-condiciones/ | es | 01.Aceptación de los términos | `#sec-01` | /terminos-y-condiciones/#sec-01 | PASS |
| /terminos-y-condiciones/ | es | 02.Información del sitio | `#sec-02` | /terminos-y-condiciones/#sec-02 | PASS |
| /terminos-y-condiciones/ | es | 03.Uso permitido | `#sec-03` | /terminos-y-condiciones/#sec-03 | PASS |
| /terminos-y-condiciones/ | es | 04.Propiedad intelectual | `#sec-04` | /terminos-y-condiciones/#sec-04 | PASS |
| /terminos-y-condiciones/ | es | 05.Servicios profesionales | `#sec-05` | /terminos-y-condiciones/#sec-05 | PASS |
| /terminos-y-condiciones/ | es | 06.Registro y cuentas | `#sec-06` | /terminos-y-condiciones/#sec-06 | PASS |
| /terminos-y-condiciones/ | es | 07.Participación en comunidad | `#sec-07` | /terminos-y-condiciones/#sec-07 | PASS |
| /terminos-y-condiciones/ | es | 08.Contenido de usuarios | `#sec-08` | /terminos-y-condiciones/#sec-08 | PASS |
| /terminos-y-condiciones/ | es | 09.Licencia de contenido | `#sec-09` | /terminos-y-condiciones/#sec-09 | PASS |
| /terminos-y-condiciones/ | es | 10.Moderación y normas | `#sec-10` | /terminos-y-condiciones/#sec-10 | PASS |
| /terminos-y-condiciones/ | es | 11.Conductas prohibidas | `#sec-11` | /terminos-y-condiciones/#sec-11 | PASS |
| /terminos-y-condiciones/ | es | 12.Disponibilidad del sitio | `#sec-12` | /terminos-y-condiciones/#sec-12 | PASS |
| /terminos-y-condiciones/ | es | 13.Enlaces externos | `#sec-13` | /terminos-y-condiciones/#sec-13 | PASS |
| /terminos-y-condiciones/ | es | 14.Privacidad de datos | `#sec-14` | /terminos-y-condiciones/#sec-14 | PASS |
| /terminos-y-condiciones/ | es | 15.Responsabilidad | `#sec-15` | /terminos-y-condiciones/#sec-15 | PASS |
| /terminos-y-condiciones/ | es | 16.Modificaciones | `#sec-16` | /terminos-y-condiciones/#sec-16 | PASS |
| /terminos-y-condiciones/ | es | 17.Terminación de cuentas | `#sec-17` | /terminos-y-condiciones/#sec-17 | PASS |
| /terminos-y-condiciones/ | es | 18.Legislación y fuero | `#sec-18` | /terminos-y-condiciones/#sec-18 | PASS |
| /terminos-y-condiciones/ | es | 19.Canal de contacto | `#sec-19` | /terminos-y-condiciones/#sec-19 | PASS |
| /terminos-y-condiciones/ | es | Leer aviso completo | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS |
| /terminos-y-condiciones/ | es | Aviso de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS |
| /terminos-y-condiciones/ | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /terminos-y-condiciones/ | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /terminos-y-condiciones/ | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /terminos-y-condiciones/ | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /terminos-y-condiciones/ | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /terminos-y-condiciones/ | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /terminos-y-condiciones/ | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /terminos-y-condiciones/ | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /en/ | en | GussWare Home | `/` | / | PASS |
| /en/ | en | Services | `#services` | /en/#services | PASS |
| /en/ | en | Our Process | `#our-process` | /en/#our-process | PASS |
| /en/ | en | Our Model | `#our-model` | /en/#our-model | PASS |
| /en/ | en | Faq | `#questions` | /en/#questions | PASS |
| /en/ | en | ES | `/` | / | PASS |
| /en/ | en | EN | `/en/` | /en/ | PASS |
| /en/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/ | en | Start a Conversation | `/en/contact/` | /en/contact/ | PASS |
| /en/ | en | API and External Service IntegrationIf | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/ | en | DevOps And Technical SupportA badly ap | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /en/ | en | Custom Software DevelopmentIf your pro | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /en/ | en | Mobile ApplicationsIf your customers o | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /en/ | en | Website and Online Store DesignA confu | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/ | en | Technical ConsultingYou don't need to  | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /en/ | en | Services | `/en/#services` | /en/#services | PASS |
| /en/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS |
| /en/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS |
| /en/ | en | Faq | `/en/#questions` | /en/#questions | PASS |
| /en/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /en/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /en/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /en/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /en/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS |
| /en/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS |
| /en/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN |
| /en/contact/ | en | GussWare Home | `/` | / | PASS |
| /en/contact/ | en | Services | `/en/#services` | /en/#services | PASS |
| /en/contact/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS |
| /en/contact/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS |
| /en/contact/ | en | Faq | `/en/#questions` | /en/#questions | PASS |
| /en/contact/ | en | ES | `/contacto/` | /contacto/ | PASS |
| /en/contact/ | en | EN | `/en/contact/` | /en/contact/ | PASS |
| /en/contact/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/contact/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/contact/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/contact/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /en/contact/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /en/contact/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/contact/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /en/contact/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /en/contact/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS |
| /en/contact/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS |
| /en/contact/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN |
| /en/servicios/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/ | en | ES | `/servicios/` | /servicios/ | PASS |
| /en/servicios/ | en | EN | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/ | en | Home | `/en/` | /en/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/ | en | Read more | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /en/servicios/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/website-and-online-store-design/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/website-and-online-store-design/ | en | ES | `/servicios/diseno-sitios-web-tiendas-en-linea/` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | EN | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/website-and-online-store-design/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/website-and-online-store-design/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | Tell us about your project | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/website-and-online-store-design/ | en | View solutions | `#soluciones` | /en/servicios/website-and-online-store-design/#soluciones | PASS |
| /en/servicios/website-and-online-store-design/ | en | Learn more | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/website-and-online-store-design/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/website-and-online-store-design/ | en | Let's design your website | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/website-and-online-store-design/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/website-and-online-store-design/ | en | View service | `/en/servicios/mobile-applications` | /en/servicios/mobile-applications/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | View service | `/en/servicios/custom-software-development` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | View service | `/en/servicios/api-and-external-service-integration` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/website-and-online-store-design/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/website-and-online-store-design/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/mobile-applications/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/mobile-applications/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/mobile-applications/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/mobile-applications/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/mobile-applications/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/mobile-applications/ | en | ES | `/servicios/aplicaciones-moviles/` | /servicios/aplicaciones-moviles/ | PASS |
| /en/servicios/mobile-applications/ | en | EN | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS |
| /en/servicios/mobile-applications/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/mobile-applications/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/mobile-applications/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/mobile-applications/ | en | Let's talk about your app | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/mobile-applications/ | en | View solutions | `#soluciones` | /en/servicios/mobile-applications/#soluciones | PASS |
| /en/servicios/mobile-applications/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/mobile-applications/ | en | Tell us your idea | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/mobile-applications/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/mobile-applications/ | en | View service | `/en/servicios/website-and-online-store-design` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/mobile-applications/ | en | View service | `/en/servicios/custom-software-development` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/mobile-applications/ | en | View service | `/en/servicios/api-and-external-service-integration` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/mobile-applications/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/mobile-applications/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/mobile-applications/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/mobile-applications/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/mobile-applications/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/mobile-applications/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/mobile-applications/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/mobile-applications/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/mobile-applications/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/custom-software-development/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/custom-software-development/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/custom-software-development/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/custom-software-development/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/custom-software-development/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/custom-software-development/ | en | ES | `/servicios/desarrollo-a-medida/` | /servicios/desarrollo-a-medida/ | PASS |
| /en/servicios/custom-software-development/ | en | EN | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/custom-software-development/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/custom-software-development/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/custom-software-development/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/custom-software-development/ | en | Let's talk about your process | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/custom-software-development/ | en | View solutions | `#soluciones` | /en/servicios/custom-software-development/#soluciones | PASS |
| /en/servicios/custom-software-development/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/custom-software-development/ | en | Tell us what you need to solve | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/custom-software-development/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/custom-software-development/ | en | View service | `/en/servicios/technical-consulting` | /en/servicios/technical-consulting/ | PASS |
| /en/servicios/custom-software-development/ | en | View service | `/en/servicios/website-and-online-store-design` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/custom-software-development/ | en | View service | `/en/servicios/api-and-external-service-integration` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/custom-software-development/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/custom-software-development/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/custom-software-development/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/custom-software-development/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/custom-software-development/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/custom-software-development/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/custom-software-development/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/custom-software-development/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/custom-software-development/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/api-and-external-service-integration/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | ES | `/servicios/integracion-de-apis-y-servicios-externos/` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | EN | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/api-and-external-service-integration/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/api-and-external-service-integration/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | Tell us about your case | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/api-and-external-service-integration/ | en | View solutions | `#soluciones` | /en/servicios/api-and-external-service-integration/#soluciones | PASS |
| /en/servicios/api-and-external-service-integration/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/api-and-external-service-integration/ | en | Ask about my integration | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/api-and-external-service-integration/ | en | Let's connect your systems | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/api-and-external-service-integration/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/api-and-external-service-integration/ | en | View service | `/en/servicios/custom-software-development` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | View service | `/en/servicios/website-and-online-store-design` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | View service | `/en/servicios/devops-technical-support` | /en/servicios/devops-technical-support/ | PASS |
| /en/servicios/api-and-external-service-integration/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/api-and-external-service-integration/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/devops-technical-support/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/devops-technical-support/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/devops-technical-support/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/devops-technical-support/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/devops-technical-support/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/devops-technical-support/ | en | ES | `/servicios/devops-y-soporte-tecnico/` | /servicios/devops-y-soporte-tecnico/ | PASS |
| /en/servicios/devops-technical-support/ | en | EN | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS |
| /en/servicios/devops-technical-support/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/devops-technical-support/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/devops-technical-support/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/devops-technical-support/ | en | Let's talk about your operation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/devops-technical-support/ | en | View solutions | `#soluciones` | /en/servicios/devops-technical-support/#soluciones | PASS |
| /en/servicios/devops-technical-support/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/devops-technical-support/ | en | Let's review your systems | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/devops-technical-support/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/devops-technical-support/ | en | View service | `/en/servicios/api-and-external-service-integration` | /en/servicios/api-and-external-service-integration/ | PASS |
| /en/servicios/devops-technical-support/ | en | View service | `/en/servicios/custom-software-development` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/devops-technical-support/ | en | View service | `/en/servicios/technical-consulting` | /en/servicios/technical-consulting/ | PASS |
| /en/servicios/devops-technical-support/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/devops-technical-support/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/devops-technical-support/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/devops-technical-support/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/servicios/technical-consulting/ | en | GussWare Home | `/` | / | PASS * |
| /en/servicios/technical-consulting/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/servicios/technical-consulting/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/servicios/technical-consulting/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/servicios/technical-consulting/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/servicios/technical-consulting/ | en | ES | `/servicios/consultoria-tecnica/` | /servicios/consultoria-tecnica/ | PASS |
| /en/servicios/technical-consulting/ | en | EN | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS |
| /en/servicios/technical-consulting/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/servicios/technical-consulting/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/technical-consulting/ | en | Services | `/en/servicios/` | /en/servicios/ | PASS |
| /en/servicios/technical-consulting/ | en | Let's talk about your idea | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/technical-consulting/ | en | View solutions | `#soluciones` | /en/servicios/technical-consulting/#soluciones | PASS |
| /en/servicios/technical-consulting/ | en | Learn more | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/technical-consulting/ | en | Tell us about your project | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/servicios/technical-consulting/ | en | See all services | `/servicios` | /servicios/ | WRONG_LANGUAGE |
| /en/servicios/technical-consulting/ | en | View service | `/en/servicios/custom-software-development` | /en/servicios/custom-software-development/ | PASS |
| /en/servicios/technical-consulting/ | en | View service | `/en/servicios/website-and-online-store-design` | /en/servicios/website-and-online-store-design/ | PASS |
| /en/servicios/technical-consulting/ | en | View service | `/en/servicios/devops-technical-support` | /en/servicios/devops-technical-support/ | PASS |
| /en/servicios/technical-consulting/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/servicios/technical-consulting/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/servicios/technical-consulting/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/servicios/technical-consulting/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/servicios/technical-consulting/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/servicios/technical-consulting/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/servicios/technical-consulting/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/servicios/technical-consulting/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/servicios/technical-consulting/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /en/privacy-policy/ | en | GussWare Home | `/` | / | PASS * |
| /en/privacy-policy/ | en | Services | `/en/#services` | /en/#services | PASS * |
| /en/privacy-policy/ | en | Our Process | `/en/#our-process` | /en/#our-process | PASS * |
| /en/privacy-policy/ | en | Our Model | `/en/#our-model` | /en/#our-model | PASS * |
| /en/privacy-policy/ | en | Faq | `/en/#questions` | /en/#questions | PASS * |
| /en/privacy-policy/ | en | ES | `/politica-de-privacidad/` | /politica-de-privacidad/ | PASS |
| /en/privacy-policy/ | en | EN | `/en/privacy-policy/` | /en/privacy-policy/ | PASS |
| /en/privacy-policy/ | en | Iniciar Conversación | `/contacto` | /contacto/ | WRONG_LANGUAGE |
| /en/privacy-policy/ | en | Start a Conversation | `/contact` | /contact/ | WRONG_LANGUAGE + EMPTY_PAGE |
| /en/privacy-policy/ | en | Home | `/en/` | /en/ | PASS |
| /en/privacy-policy/ | en | 01.Data controller | `#sec-01` | /en/privacy-policy/#sec-01 | PASS |
| /en/privacy-policy/ | en | 02.Personal data | `#sec-02` | /en/privacy-policy/#sec-02 | PASS |
| /en/privacy-policy/ | en | 03.Purposes | `#sec-03` | /en/privacy-policy/#sec-03 | PASS |
| /en/privacy-policy/ | en | 04.Use and protection | `#sec-04` | /en/privacy-policy/#sec-04 | PASS |
| /en/privacy-policy/ | en | 05.Transfers | `#sec-05` | /en/privacy-policy/#sec-05 | PASS |
| /en/privacy-policy/ | en | 06.ARCO rights | `#sec-06` | /en/privacy-policy/#sec-06 | PASS |
| /en/privacy-policy/ | en | 07.Revocation | `#sec-07` | /en/privacy-policy/#sec-07 | PASS |
| /en/privacy-policy/ | en | 08.Cookies | `#sec-08` | /en/privacy-policy/#sec-08 | PASS |
| /en/privacy-policy/ | en | 09.Changes to this notice | `#sec-09` | /en/privacy-policy/#sec-09 | PASS |
| /en/privacy-policy/ | en | 10.Update | `#sec-10` | /en/privacy-policy/#sec-10 | PASS |
| /en/privacy-policy/ | en | Web Development | `/en/servicios/website-and-online-store-design/` | /en/servicios/website-and-online-store-design/ | PASS * |
| /en/privacy-policy/ | en | Mobile Development | `/en/servicios/mobile-applications/` | /en/servicios/mobile-applications/ | PASS * |
| /en/privacy-policy/ | en | Custom Software | `/en/servicios/custom-software-development/` | /en/servicios/custom-software-development/ | PASS * |
| /en/privacy-policy/ | en | APIs & Integrations | `/en/servicios/api-and-external-service-integration/` | /en/servicios/api-and-external-service-integration/ | PASS * |
| /en/privacy-policy/ | en | DevOps | `/en/servicios/devops-technical-support/` | /en/servicios/devops-technical-support/ | PASS * |
| /en/privacy-policy/ | en | Consulting | `/en/servicios/technical-consulting/` | /en/servicios/technical-consulting/ | PASS * |
| /en/privacy-policy/ | en | Start a Conversation | `/en/contact` | /en/contact/ | PASS * |
| /en/privacy-policy/ | en | Privacy Policy | `/en/privacy-policy` | /en/privacy-policy/ | PASS * |
| /en/privacy-policy/ | en | Term of Service | `/en/term-of-service` | /en/term-of-service | BROKEN * |
| /navfixturetest/ | es | N1 | `/n1` | /n1 | BROKEN |
| /navfixturetest/ | es | N2 | `/n2` | — | NEEDS_REVIEW |
| /navfixturetest/ | es | N3 | `/n3` | — | NEEDS_REVIEW |
| /navfixturetest/ | es | N4 | `/n4` | — | NEEDS_REVIEW |
| /navfixturetest/ | es | Hoja | `/hoja` | /hoja | BROKEN |
| /navfixturetest/ | es | GussWare Home | `/` | / | PASS |
| /navfixturetest/ | es | Servicios | `/#servicios` | /#servicios | PASS |
| /navfixturetest/ | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS |
| /navfixturetest/ | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS |
| /navfixturetest/ | es | Faq | `/#preguntas` | /#preguntas | PASS |
| /navfixturetest/ | es | ES | `/navfixturetest/` | /navfixturetest/ | EMPTY_PAGE |
| /navfixturetest/ | es | EN | `/en/navfixturetest/` | /en/navfixturetest/ | BROKEN |
| /navfixturetest/ | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS |
| /navfixturetest/ | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /404.html | es | GussWare Home | `/` | / | PASS * |
| /404.html | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /404.html | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /404.html | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /404.html | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /404.html | es | ES | `/404/` | /404/ | BROKEN |
| /404.html | es | EN | `/en/404/` | /en/404/ | BROKEN |
| /404.html | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /404.html | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /404.html | es | Volver al inicio | `/` | / | PASS |
| /404.html | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /404.html | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /404.html | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /404.html | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /404.html | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /404.html | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /404.html | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /404.html | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |
| /500.html | es | GussWare Home | `/` | / | PASS * |
| /500.html | es | Servicios | `/#servicios` | /#servicios | PASS * |
| /500.html | es | Nuestro Proceso | `/#como-trabajamos` | /#como-trabajamos | PASS * |
| /500.html | es | Nuestro Modelo | `/#nuestro-modelo` | /#nuestro-modelo | PASS * |
| /500.html | es | Faq | `/#preguntas` | /#preguntas | PASS * |
| /500.html | es | ES | `/500/` | /500/ | BROKEN |
| /500.html | es | EN | `/en/500/` | /en/500/ | BROKEN |
| /500.html | es | Iniciar Conversación | `/contacto` | /contacto/ | PASS * |
| /500.html | es | Start a Conversation | `/contact` | /contact/ | EMPTY_PAGE |
| /500.html | es | Volver al inicio | `/` | / | PASS |
| /500.html | es | Diseño Web | `/servicios/diseno-sitios-web-tiendas-en-linea` | /servicios/diseno-sitios-web-tiendas-en-linea/ | PASS * |
| /500.html | es | Desarrollo a Medida | `/servicios/desarrollo-a-medida` | /servicios/desarrollo-a-medida/ | PASS * |
| /500.html | es | Aplicaciones Moviles | `/servicios/aplicaciones-moviles` | /servicios/aplicaciones-moviles/ | PASS * |
| /500.html | es | DevOps y Soporte | `/servicios/devops-y-soporte-tecnico` | /servicios/devops-y-soporte-tecnico/ | PASS * |
| /500.html | es | Consultoria Tecnica | `/servicios/consultoria-tecnica` | /servicios/consultoria-tecnica/ | PASS * |
| /500.html | es | Integración de Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` | /servicios/integracion-de-apis-y-servicios-externos/ | PASS * |
| /500.html | es | Politica de Privacidad | `/politica-de-privacidad` | /politica-de-privacidad/ | PASS * |
| /500.html | es | Terminos y Condiciones | `/terminos-y-condiciones` | /terminos-y-condiciones/ | PASS * |

---

## D. Problemas encontrados

### P-01 — `/contact/` se publica sin contenido (columna izquierda vacía e icono social roto)

| Campo | Valor |
|---|---|
| **Severidad** | **CRITICAL** |
| Página de origen | `/`, `/contacto/`, `/servicios/**`, `/politica-de-privacidad/`, `/terminos-y-condiciones/` (CTA «Start a Conversation» del pie) y `/servicios/**` (CTA de cierre) |
| Enlace involucrado | `Start a Conversation` (pie, móvil) y `Cuéntanos tu proyecto` / `Cuéntanos tu idea` / `Revisemos tus sistemas` / `Consultar mi integración` / `Conectemos tus sistemas` (cierre de servicio) |
| URL de destino | `https://gussware.dev/contact/` |
| Idioma | es (destino) — el enlace aparece también en páginas EN (ver P-02) |
| Código HTTP | 200 |
| Comportamiento observado | La página carga con cabecera, pie y formulario, pero **la mitad izquierda de la sección de contacto está vacía**: no hay eyebrow, ni título (`<h1>` ausente), ni descripción, ni texto de redes sociales. El único elemento visible es un círculo azul vacío: el `<svg>` del icono de Facebook se renderiza **sin ningún `<path>`**. `leftColumnText` medido en el DOM = `""`. |
| Comportamiento esperado | La página de contacto debe mostrar eyebrow, título, descripción, texto de redes y los iconos de redes sociales renderizados (como sí ocurre en `/contacto/`). |
| Evidencia | `docs/audits/screenshots/EVID-01-contact-vacio.png`, `docs/audits/screenshots/EVID-01b-contact-main.png`, `docs/audits/screenshots/EVID-01c-contact-left-column.png` (captura del recorte vacío). Comparativa funcional: `docs/audits/screenshots/EVID-02-contacto-con-contenido.png` y `docs/audits/screenshots/EVID-02b-contacto-main.png`. |
| Causa técnica | Doble defecto en `src/pages/contact.astro`: (1) `getContact()` consulta `/gussware/v1/contact?lang=es`, que devuelve **`{"contact_information": null}`** en el CMS de producción → `eyebrow`, `title`, `description` y `socialText` llegan `undefined` y `ContactSection.astro` (líneas 42–58) no renderiza ningún bloque. (2) El mapeo de redes usa **nombres de campo que la API no devuelve**: `social.nombre` y `social.icono`, mientras la respuesta real es `{"name": ..., "url": ..., "icon": ...}` (`src/lib/wordpress/socialMedia.ts` no renombra). `Icon.astro` hace `ICON_PATHS[name]` con `name === undefined` → `<svg>` vacío. La ruta equivalente `[...uri].astro` (líneas 452–456) sí usa `social.name` / `social.icon`, por eso `/contacto/` funciona. |
| Archivos relacionados | `src/pages/contact.astro` (líneas 25–56), `src/components/contact/ContactSection.astro` (42–80), `src/components/ui/Icon.astro` (109), `src/lib/wordpress/contact.ts`, `src/lib/wordpress/socialMedia.ts` |

### P-02 — Todos los CTA de las páginas de servicio en inglés apuntan a la página de contacto en español

| Campo | Valor |
|---|---|
| **Severidad** | **CRITICAL** |
| Página de origen | Las 6 páginas `/en/servicios/<slug>/` |
| Enlace involucrado | `Let's talk about your idea` / `Let's talk about your app` / `Let's talk about your process` / `Let's talk about your operation` / `Let's design your website` (CTA del hero), `Learn more` (2–3 por página), `Tell us about your project` / `Tell us your idea` / `Tell us what you need to solve` / `Tell us about your case` / `Ask about my integration` (CTA de cierre) |
| URL de destino | `https://gussware.dev/contact/` |
| Idioma | **EN → ES** (destino en español) |
| Código HTTP | 200 |
| Comportamiento observado | El enlace navega correctamente (HTTP 200) pero muestra la página de contacto **en español** y **sin contenido** (P-01). El usuario que navega en inglés aterriza en un destino en otro idioma y vacío. |
| Comportamiento esperado | `/en/contact/` (existe, con contenido completo en inglés). |
| Evidencia | `docs/audits/screenshots/EVID-03-servicio-EN-cta-contact.png` (se ve el CTA «LET'S TALK ABOUT YOUR IDEA» en la página EN) y `docs/audits/screenshots/EVID-01c-contact-left-column.png` (destino vacío). Volcado del DOM: `docs/audits/data/evidence.json → enServiceCtas` (10 CTA por página, 6 de ellos a `/contact`). |
| Causa técnica | Datos de ACF en el CPT `service` (idioma `en`): `hero.hero_cta_url = '/contact'`, `soluciones.solutions[*].link.url = '/contact'`, `cierre.cta.button_url = '/contact'`, `plataformas.platforms_cta_url = '/contact'`. El destino correcto sería `/en/contact`. |
| Archivos relacionados | Contenido ACF del CPT `service` (WordPress, idioma EN); `src/components/services/ServiceDetail.astro` (líneas 325, 447), `src/components/services/ServiceHeader.astro` (158), `src/components/services/ServicePlatforms.astro` (121) |

### P-03 — El enlace «Term of Service» del pie en inglés devuelve 404

| Campo | Valor |
|---|---|
| **Severidad** | **CRITICAL** |
| Página de origen | Las 11 páginas en inglés (pie, menú «Legal English») |
| Enlace involucrado | `Term of Service` |
| URL de destino | `https://gussware.dev/en/term-of-service` → `https://gussware.dev/en/term-of-service/` |
| Idioma | en |
| Código HTTP | **404** |
| Comportamiento observado | El clic muestra la página 404 del sitio («404 — Página no encontrada»), renderizada **en español** y con `html lang="es"`. Error de consola: `Failed to load resource: the server responded with a status of 404 ()`. |
| Comportamiento esperado | La página legal equivalente en inglés («Terms and Conditions» / «Term of Service»). |
| Evidencia | `docs/audits/screenshots/EVID-05-footer-EN-legal.png` (el enlace en el pie), `docs/audits/screenshots/EVID-05b-404-term-of-service.png` (destino 404). |
| Causa técnica | La Page ES «Términos y Condiciones» (id 538) **no tiene traducción en Polylang** (`translations: {"es": 538}` — sin clave `en`). El menú «Legal English» de WordPress apunta a `/en/term-of-service`, ruta que nunca se construyó. Equivalente en ES: `/terminos-y-condiciones` sí existe. |
| Archivos relacionados | Menú WordPress `Legal English` (ítem id 134); `src/pages/[...uri].astro` (líneas 86–129, `getStaticPaths`); `src/lib/wordpress/pages.ts` |

### P-04 — El selector de idioma de «Términos y Condiciones» apunta a una ruta inexistente

| Campo | Valor |
|---|---|
| **Severidad** | **HIGH** |
| Página de origen | `https://gussware.dev/terminos-y-condiciones/` |
| Enlace involucrado | `EN` (selector de idioma del header) |
| URL de destino | `https://gussware.dev/en/terminos-y-condiciones/` |
| Idioma | es → en (destino inexistente) |
| Código HTTP | **404** |
| Comportamiento observado | El clic devuelve la página 404 en español. El `href` se genera por concatenación mecánica del slug. |
| Comportamiento esperado | Como la página no tiene traducción, el selector debería apuntar a la página legal equivalente en inglés si existe, o bien degradar de forma controlada (por ejemplo, marcar el EN como no disponible) en lugar de emitir una URL que devuelve 404. |
| Evidencia | `docs/audits/screenshots/EVID-06-selector-idioma-terminos.png` (selector), `docs/audits/screenshots/EVID-06b-404-terminos-en.png` (destino 404). Dump: `docs/audits/data/evidence.json → terminosLangSelector`. |
| Causa técnica | `src/pages/[...uri].astro` líneas 337–345: cuando `translatedSlug` es `null` (no hay traducción), hace `getRelativeLocaleUrl('en', uri)` — construye `/en/<slug-es>` sin comprobar que exista. El `hreflang` sí se omite correctamente (líneas 347–358), pero el selector de idioma no. |
| Archivos relacionados | `src/pages/[...uri].astro` (337–345), `src/components/ui/LanguageSelector.astro` (37–43) |

### P-05 — El botón del header en inglés muestra texto en español y enlaza a la página en español

| Campo | Valor |
|---|---|
| **Severidad** | **HIGH** |
| Página de origen | Las 11 páginas en inglés |
| Enlace involucrado | `Iniciar Conversación` (botón naranja del header) |
| URL de destino | `https://gussware.dev/contacto` → `/contacto/` |
| Idioma | **EN → ES** |
| Código HTTP | 200 |
| Comportamiento observado | En `/en/`, `/en/contact/`, `/en/servicios/**`, `/en/privacy-policy/`, el botón del header se rotula **«Iniciar Conversación»** y lleva a la página de contacto **en español**. |
| Comportamiento esperado | «Start a Conversation» → `/en/contact/`. |
| Evidencia | `docs/audits/screenshots/EVID-11-header-EN-cta.png` (header en la página EN). Dump: `docs/audits/data/evidence.json → headerCtaEN`. |
| Causa técnica | `src/lib/wordpress/header.ts` llama `/gussware/v1/header?lang=en`, pero el endpoint del CMS **ignora el parámetro `lang`** y devuelve siempre `button_text: "Iniciar Conversación"` y `url: "/contacto"`. El componente no traduce ni reescribe el destino. |
| Archivos relacionados | `src/lib/wordpress/header.ts` (21–39), `src/lib/wordpress/routes.ts` (18–19), `src/components/layout/Header.astro` (87–95) |

### P-06 — El CTA «See all services» de los servicios en inglés apunta al listado en español

| Campo | Valor |
|---|---|
| **Severidad** | **HIGH** |
| Página de origen | Las 6 páginas `/en/servicios/<slug>/` |
| Enlace involucrado | `See all services` |
| URL de destino | `https://gussware.dev/servicios` → `/servicios/` |
| Idioma | **EN → ES** |
| Código HTTP | 200 |
| Comportamiento observado | El clic lleva al listado de servicios **en español** (`html lang="es"`, título «Servicios — GussWare») desde una página en inglés. |
| Comportamiento esperado | `/en/servicios/`. |
| Evidencia | `docs/audits/screenshots/EVID-03b-servicio-EN-cta-servicios-ES.png`. Dump: `docs/audits/data/evidence.json → enServiceCtas` (entrada `See all services` → `/servicios`). |
| Causa técnica | ACF del CPT `service` (EN): `cierre.cta.secondary_url = '/servicios'`. El equivalente ES sí usa la ruta correcta por locale. |
| Archivos relacionados | ACF `cierre.cta.secondary_url` del CPT `service` (EN); `src/components/services/ServiceDetail.astro` (452) |

### P-07 — En móvil el menú de navegación del pie desaparece por completo

| Campo | Valor |
|---|---|
| **Severidad** | **HIGH** |
| Página de origen | Todas las páginas (pie, en cualquier idioma) |
| Enlace involucrado | 12 enlaces del menú del pie: `Servicios`, `Nuestro Proceso`, `Nuestro Modelo`, `Faq`, `Diseño Web`, `Desarrollo a Medida`, `Aplicaciones Moviles`, `DevOps y Soporte`, `Consultoria Tecnica`, `Integración de Servicios Externos`, `Iniciar Conversación` (y sus equivalentes EN) |
| URL de destino | `/servicios/**`, `/#servicios`, … |
| Idioma | es / en |
| Código HTTP | n/a (elemento no visible) |
| Comportamiento observado | Medido por viewport: a **390 px** solo **4 de 26** enlaces del pie son visibles (el CTA «Start a Conversation», el copyright y los 2 enlaces legales). Las 22 restantes están dentro de un contenedor `hidden … md:grid … lg:hidden` y no se renderizan. A 768 px hay 15 visibles y a 1024 px 14. **No existe ningún viewport en el que el menú completo del pie sea visible en móvil.** |
| Comportamiento esperado | El menú de navegación del pie debería ser accesible en móvil (o existirá una versión desplegada) para permitir navegar a Servicios, Privacidad y Términos. |
| Evidencia | `docs/audits/screenshots/mobile__root.png`, `docs/audits/screenshots/mobile__en.png` (pie sin columnas de menú). Medición reproducible en `docs/audits/data/visual_checks.json` y en la comprobación por viewport (390 / 768 / 1024 px). |
| Causa técnica | `src/components/layout/Footer.astro` renderiza las columnas del menú **dos veces**: una con `class="col-span-full hidden grid-cols-4 gap-4 md:grid md:gap-6 lg:hidden"` (visible sólo entre 768 px y 1023 px) y otra con `class="hidden lg:contents"` (visible sólo ≥ 1024 px). El rango `< 768 px` no tiene ninguna copia visible. |
| Archivos relacionados | `src/components/layout/Footer.astro` (61–84 y 86–109) |

### P-08 — `/servicios/` y `/en/servicios/` se publican sin título ni descripción de sección

| Campo | Valor |
|---|---|
| **Severidad** | **MEDIUM** |
| Página de origen | `https://gussware.dev/servicios/`, `https://gussware.dev/en/servicios/` |
| Enlace involucrado | (no es un enlace; es un defecto de la página destino de los listados) |
| URL de destino | — |
| Idioma | es / en |
| Código HTTP | 200 |
| Comportamiento observado | Ambas páginas muestran sólo el breadcrumb y las 6 tarjetas de servicio. **No hay encabezado de sección, ni `<h1>`** (`h1Count = 0`), ni descripción introductoria. Texto visible en `main`: 1 797 caracteres (ES) / 1 675 (EN), frente a 6 000–7 500 en los detalles de servicio. |
| Comportamiento esperado | Un listado de servicios debe tener título y descripción (el propio código los pide). |
| Evidencia | `docs/audits/screenshots/EVID-08-servicios-sin-encabezado.png`, `docs/audits/screenshots/EVID-08b-en-servicios-sin-encabezado.png`. |
| Causa técnica | `src/pages/servicios/index.astro` (línea 30) y `src/pages/[locale]/servicios/index.astro` (línea 40) leen `getFrontPage(locale).acf.services`, pero las Pages de portada de WordPress (`inicio` id 62 y `home` id 224) **no tienen el campo ACF `services`** (claves presentes: `hero`, `expertise`, `technology`, `process`, `faq`, `final_cta`). `header` queda `null` y el `SectionHeading` no se renderiza. |
| Archivos relacionados | `src/pages/servicios/index.astro` (29–30, 62–67), `src/pages/[locale]/servicios/index.astro` (39–40, 74–79), `src/components/ui/SectionHeading.astro`; ACF de la Page de portada en WordPress |

### P-09 — La página de pruebas internas `/navfixturetest/` está publicada en producción

| Campo | Valor |
|---|---|
| **Severidad** | **MEDIUM** |
| Página de origen | Accesible directamente (y enlazada desde su propio selector de idioma) |
| Enlace involucrado | `N1`, `N2`, `N3`, `N4`, `Hoja` (enlaces de prueba) y `EN` (`/en/navfixturetest/`) |
| URL de destino | `https://gussware.dev/navfixturetest/`, `/n1`, `/n2`, `/n3`, `/n4`, `/hoja`, `/en/navfixturetest/` |
| Idioma | es |
| Código HTTP | 200 (la fixture) / **404** (sus 5 enlaces) |
| Comportamiento observado | Página de pruebas del header visible en producción: título «Fixture», **sin `canonical`**, contenido de 12 caracteres (`N1N2N3N4Hoja`), con 5 enlaces que devuelven 404 y un selector de idioma cuyo destino EN también devuelve 404. |
| Comportamiento esperado | Una página de fixture de pruebas no debe formar parte del despliegue público. |
| Evidencia | `docs/audits/screenshots/EVID-07-navfixturetest.png`, `docs/audits/screenshots/es__navfixturetest.png`. Dump: `docs/audits/data/evidence.json → navFixture`. |
| Causa técnica | `src/pages/navfixturetest.astro` está en `src/pages/` y por tanto se construye. Solo se excluye del *sitemap* (`astro.config.mjs` → `sitemap({ filter })`), no del despliegue. |
| Archivos relacionados | `src/pages/navfixturetest.astro`, `astro.config.mjs` (líneas 328–330) |

### P-10 — El pie en inglés muestra la descripción y el copyright en español

| Campo | Valor |
|---|---|
| **Severidad** | **MEDIUM** |
| Página de origen | Las 11 páginas en inglés |
| Enlace involucrado | — (contenido del pie) |
| URL de destino | — |
| Idioma | en (el texto es es) |
| Comportamiento observado | El pie EN comienza con «Tecnología construida por personas. Una comunidad colaborativa de profesionales independientes…» y «© 2024 GussWare. Todos los derechos reservados.», idénticos a la versión española. |
| Comportamiento esperado | Descripción y copyright en inglés en las páginas en inglés. |
| Evidencia | `docs/audits/screenshots/EVID-12-footer-EN.png`. Dump: `docs/audits/data/evidence.json → footerEN`. |
| Causa técnica | `/gussware/v1/footer?lang=en` devuelve el mismo texto que `?lang=es`: el endpoint del CMS ignora `lang` para estos campos (o no tiene valor en inglés). `src/lib/wordpress/footer.ts` no aplica traducción. |
| Archivos relacionados | `src/lib/wordpress/footer.ts`, `src/lib/wordpress/routes.ts` (5–7), `src/components/layout/Footer.astro` (47–51) |

### P-11 — Doble ruta de contacto en español, con contenidos y títulos distintos

| Campo | Valor |
|---|---|
| **Severidad** | **MEDIUM** |
| Página de origen | Todas |
| Enlace involucrado | — |
| URL de destino | `https://gussware.dev/contact/` y `https://gussware.dev/contacto/` |
| Idioma | es |
| Código HTTP | 200 en ambas |
| Comportamiento observado | Existen **dos** páginas de contacto en español que compiten: `/contacto/` (Page de WordPress, con eyebrow «HABLEMOS», H1 «Construyamos algo juntos», descripción y texto de redes; `title = "Contacto | GussWare - Desarrolladores Freelance"`) y `/contact/` (ruta estática de Astro, sin contenido; `title = "Contact — GussWare"`). Ninguna enlaza a la otra. La que está enlazada desde la navegación global es la vacía. |
| Comportamiento esperado | Una única URL de contacto por idioma, o una redirección explícita de la ruta duplicada a la canónica. |
| Evidencia | `docs/audits/screenshots/EVID-02b-contacto-main.png` vs `docs/audits/screenshots/EVID-01b-contact-main.png`. |
| Causa técnica | `src/pages/contact.astro` (ruta propia) y `reservedEs = ['servicios','contact','404','500','navfixturetest']` en `src/pages/[...uri].astro` (líneas 93–99) Reserve `contact` para la ruta de Astro, mientras WordPress publica `contacto` como Page. El menú `Footer` de WordPress apunta a `/contacto`, pero el CTA global del sitio apunta a `/contact`. |
| Archivos relacionados | `src/pages/contact.astro`, `src/pages/[...uri].astro` (93–99), `src/lib/routes.ts` (10–16) |

### P-12 — En los servicios en español, los CTA apuntan a dos destinos distintos dentro de la misma página

| Campo | Valor |
|---|---|
| **Severidad** | **MEDIUM** |
| Página de origen | Las 6 páginas `/servicios/<slug>/` |
| Enlace involucrado | CTA del hero y de «soluciones» (`/contacto`) frente al CTA de cierre (`/contact`) |
| URL de destino | `https://gussware.dev/contacto/` y `https://gussware.dev/contact/` |
| Idioma | es |
| Código HTTP | 200 en ambas |
| Comportamiento observado | En la misma página de servicio, «Hablemos de tu idea» → `/contacto` (contenido) y «Cuéntanos tu proyecto» → `/contact` (**vacío**). El usuario ve dos CTA equivalentes que llevan a páginas distintas. |
| Comportamiento esperado | Todos los CTA de contacto de una página apuntan al mismo destino. |
| Evidencia | `docs/audits/screenshots/EVID-04-servicio-ES-cta-contact.png`. Dump: `docs/audits/data/evidence.json → esServiceCtas`. |
| Causa técnica | ACF del CPT `service` (ES): `hero.hero_cta_url` y `soluciones.solutions[*].link.url` usan `/contacto`, mientras `cierre.cta.button_url` usa `/contact`. El dato es inconsistente en WordPress, no en el código. |
| Archivos relacionados | ACF `cierre.cta.button_url` del CPT `service` (ES) |

### P-13 — La página 404 en español y el selector de idioma apuntan a rutas inexistentes

| Campo | Valor |
|---|---|
| **Severidad** | **LOW** |
| Página de origen | `https://gussware.dev/404.html` y cualquier ruta inexistente (`/ruta-inexistente-auditoria-xyz/` → 404) |
| Enlace involucrado | `ES` → `/404/` y `EN` → `/en/404/` |
| URL de destino | `https://gussware.dev/404/`, `https://gussware.dev/en/404/` |
| Idioma | es |
| Código HTTP | **404** |
| Comportamiento observado | La página 404 se sirve correctamente (HTTP 404 + contenido «404 / Página no encontrada / Volver al inicio»), pero su selector de idioma ofrece dos destinos que devuelven 404, y su `canonical` declara `https://gussware.dev/404/`, ruta que tampoco existe. La página 404 no tiene versión en inglés. |
| Comportamiento esperado | El selector de idioma de una página de error debería apuntar a rutas que existan, o la página 404 debería existir en `/404/` y `/en/404/`. |
| Evidencia | `docs/audits/screenshots/EVID-14-404-selector-idioma.png`. Dump: `docs/audits/data/evidence.json → notFoundLang`. |
| Causa técnica | `src/pages/404.astro` y `src/pages/500.astro` se construyen como `404.html` / `500.html` (ficheros), no como rutas con carpeta; el `canonical` y el `LanguageSelector` usan `routes.notFound = '/404'` con prefijo de locale, que no se generó. |
| Archivos relacionados | `src/pages/404.astro`, `src/pages/500.astro`, `src/lib/routes.ts` (10–16), `src/components/ui/LanguageSelector.astro` |

### P-14 — La página 500 no existe en la ruta que su propio `canonical` declara

| Campo | Valor |
|---|---|
| **Severidad** | **LOW** |
| Página de origen | `https://gussware.dev/500.html` |
| Enlace involucrado | `ES` → `/500/` y `EN` → `/en/500/` (selector de idioma) |
| URL de destino | `https://gussware.dev/500/` |
| Idioma | es |
| Código HTTP | **404** |
| Comportamiento observado | El fichero `500.html` existe (HTTP 200, «Error interno del servidor»), pero su `canonical` es `https://gussware.dev/500/` y el selector de idioma apunta a `/500/` y `/en/500/`, ambas inexistentes. Además, la página 500 solo existe en español y su copy está en español. |
| Comportamiento esperado | Coherencia entre la URL servida, el `canonical` y los destinos del selector de idioma. |
| Evidencia | `docs/audits/screenshots/EVID-13-500-ruta-404.png` (destino 404), `docs/audits/screenshots/es__500_html.png` (página real). |
| Causa técnica | `src/pages/500.astro` se compila a `500.html`; Astro no genera la carpeta `/500/` salvo que exista `src/pages/500/index.astro`. El `canonical` lo compone `src/layouts/Seo.astro` a partir de la ruta lógica. |
| Archivos relacionados | `src/pages/500.astro`, `src/pages/404.astro`, `src/components/layout/Seo.astro` |

### P-15 — La política de privacidad en inglés muestra marcadores de posición sin resolver

| Campo | Valor |
|---|---|
| **Severidad** | **LOW** |
| Página de origen | `https://gussware.dev/en/privacy-policy/` |
| Enlace involucrado | — (contenido) |
| URL de destino | — |
| Idioma | en |
| Comportamiento observado | La sección «Personal data collected» muestra literalmente **`[Name]`**, **`[Email address]`** y **`[Phone number]`**. La versión española muestra `privacidad@gmail.com` y `818776482`. Además, la versión española pinta como «etiquetas» (`h3`) valores que son el correo y el teléfono, no rótulos. |
| Comportamiento esperado | Datos legales coherentes y completos en ambos idiomas. |
| Evidencia | `docs/audits/screenshots/EVID-09-privacy-policy-EN-placeholders.png` vs `docs/audits/screenshots/EVID-09b-privacy-policy-ES.png`. Dump: `docs/audits/data/evidence.json → privacyEN` / `privacyES`. |
| Causa técnica | El endpoint `/gussware/v1/legal_information?lang=en` devuelve `personal_data_name_label: "nombre"`, `personal_data_email_label: "privacidad@gmail.com"`, `personal_data_phone_label: "818776482"` — los mismos valores que en español, y con los marcadores `[Name]`, `[Email address]`, `[Phone number]` incrustados en el contenido de la Page EN (id 443). `src/components/legal/LegalView.astro` renderiza el contenido tal cual. |
| Archivos relacionados | `src/components/legal/LegalView.astro`, `src/lib/wordpress/legal.ts`; contenido de la Page `privacy-policy` (id 443) y el valor del ACF `legal_information` |

---

## E. Problemas de páginas vacías

### E.1 — `/contact/` (HTTPS 200, sin contenido funcional) — **CRITICAL**

| Métrica | Valor |
|---|---|
| URL | `https://gussware.dev/contact/` |
| Código HTTP | 200 |
| `html lang` | `es` |
| `<title>` | `Contact — GussWare` |
| `canonical` | `https://gussware.dev/contact/` |
| Texto total en `<main>` | 2 509 caracteres (todo el formulario) |
| **Texto visible en la columna izquierda** | **0 caracteres** (`leftColumnText === ""`) |
| `<h1>` en `<main>` | **0** |
| Encabezados (`h1`–`h3`) en `<main>` | **0** |
| Iconos sociales | 1, renderizado como `<svg>` **sin trazados** (círculo vacío) |

La captura `docs/audits/screenshots/EVID-01c-contact-left-column.png` muestra el hueco: una línea horizontal y un
círculo azul vacío, sin texto. La comparación con `docs/audits/screenshots/EVID-02b-contacto-main.png` (ruta
`/contacto/`) demuestra que el componente `ContactSection` sí sabe renderizar ese bloque cuando
recibe datos.

### E.2 — `/navfixturetest/` (HTTPS 200, contenido de fixture) — **MEDIUM**

| Métrica | Valor |
|---|---|
| URL | `https://gussware.dev/navfixturetest/` |
| Código HTTP | 200 |
| `<title>` | `Fixture` |
| `canonical` | **ausente** |
| Texto en `<main>` | 12 caracteres (`N1N2N3N4Hoja`) |
| Enlaces | 26 (5 apuntan a rutas inexistentes: `/n1`, `/n2`, `/n3`, `/n4`, `/hoja`) |

### E.3 — Páginas que **no** están vacías (verificado para evitar falsos positivos)

| Página | Texto en `<main>` | `<h1>` | Veredicto |
|---|---|---|---|
| `/` | 10 166 | 1 | PASS |
| `/en/` | 9 590 | 1 | PASS |
| `/contacto/` | 2 831 | 1 | PASS |
| `/en/contact/` | 2 815 | 1 | PASS |
| `/servicios/` | 1 797 | 0 | PARTIAL_CONTENT (P-08) |
| `/en/servicios/` | 1 675 | 0 | PARTIAL_CONTENT (P-08) |
| `/servicios/*` (6) | 6 089 – 7 482 | 1 | PASS |
| `/en/servicios/*` (6) | 5 882 – 6 955 | 1 | PASS |
| `/politica-de-privacidad/` | 6 623 | 1 | PASS |
| `/terminos-y-condiciones/` | 11 037 | 1 | PASS |
| `/en/privacy-policy/` | 6 088 | 1 | PARTIAL_CONTENT (P-15) |
| `/404.html` | 122 | 1 | PASS (enlace «Volver al inicio» correcto) |
| `/500.html` | 312 | 1 | PASS |

### E.4 — Bloques que cargan sin contenido dentro de páginas que sí funcionan

| Bloque | Página | Observación |
|---|---|---|
| Icono de red social | `/contact/` | `<svg>` vacío (P-01). En `/contacto/` el mismo icono se dibuja correctamente. |
| Encabezado de sección de Servicios | `/servicios/`, `/en/servicios/` | `SectionHeading` no se renderiza por falta de `home.acf.services` (P-08). |
| Datos del responsable | `/en/privacy-policy/` | Marcadores `[Name]`, `[Email address]`, `[Phone number]` (P-15). |
| Columnas de navegación del pie | Todas, < 768 px | Ocultas por CSS (P-07). |

---

## F. Comparación español / inglés

| # | Elemento | Español | Inglés | Estado |
|---|---|---|---|---|
| F-01 | Página legal de términos | `/terminos-y-condiciones/` | **no existe** (el menú apunta a `/en/term-of-service` → 404) | **INCONSISTENTE (P-03, P-04)** |
| F-02 | CTA global "Start a Conversation" (menú móvil y pie móvil) | `/contact` (ES, **vacío**) | `/contact` (**ES**, vacío) | **INCONSISTENTE (P-01, P-02)** |
| F-03 | Botón del header | «Iniciar Conversación» → `/contacto` | «Iniciar Conversación» → `/contacto` (**texto y destino en ES**) | **INCONSISTENTE (P-05)** |
| F-04 | Descripción y copyright del pie | Español | **Español** | **INCONSISTENTE (P-10)** |
| F-05 | CTA de las páginas de servicio | `/contacto` y `/contact` (destinos distintos en la misma página) | `/contact` (todas en ES) | **INCONSISTENTE (P-02, P-12)** |
| F-06 | CTA "ver todos los servicios" | `/servicios` | `/servicios` (**ES**) | **INCONSISTENTE (P-06)** |
| F-07 | Datos del responsable (legal) | `privacidad@gmail.com`, `818776482` | `[Name]`, `[Email address]`, `[Phone number]` | **INCONSISTENTE (P-15)** |
| F-08 | Correo de privacidad en el enlace | `mailto:privacidad@gmail.com` | `mailto:privacidad@gussware.com` (dominio distinto) | **INCONSISTENTE** |
| F-09 | **Orden de las secciones del home** | Hero → `#servicios` → `#como-trabajamos` → `#nuestro-modelo` → `#preguntas` → CTA | Hero → `#services` → `#our-model` → `#our-process` → `#questions` → CTA | **INCONSISTENTE** (Proceso y Modelo intercambiados) |
| F-10 | Anclas de las páginas de servicio | `#soluciones`, `#metodologia`, `#tecnologias`, `#plataformas`, `#relacionados`, `#contacto` | **los mismos nombres en español** (`#soluciones`, `#metodologia`, …) | **INCONSISTENTE (nomenclatura)** |
| F-11 | Selector de idioma | Correcto en 11 de 12 páginas | Correcto en 11 de 12 páginas | 1 caso roto (P-04) |
| F-12 | Formato del `<title>` del home | `Inicio — GussWare` | `Home \| GussWare` | INCONSISTENTE (menor) |
| F-13 | Listado de servicios | Sin encabezado de sección | Sin encabezado de sección | Consistente entre sí (ambas rotas: P-08) |
| F-14 | Número de servicios traducidos | 6 | 6 (traducción 1:1 verificada en Polylang) | PASS |
| F-15 | Detalle de servicio — `lang` del documento | `es` | `en` | PASS |

**Comportamiento de rutas sin traducción.** Sólo hay un caso: la Page «Términos y Condiciones» no tiene
traducción. El sitio no resuelve ese caso de forma controlada: el selector de idioma construye
`/en/<slug-es>` y lo publica, lo que produce un 404 (P-04), mientras el menú del pie en inglés apunta
a un slug distinto (`/en/term-of-service`), que también produce un 404 (P-03).

**Verificación de que ninguna página EN muestra contenido ES.** Se comprobó el atributo `html lang` y el
título de cada una de las 11 páginas en inglés: todas declaran `lang="en"` y título en inglés. La
única intrusión de idioma detectada se produce **al navegar** a destinos ellinkingados (P-02, P-05,
P-06), no en el renderizado de la propia página.

---

## G. Enlaces externos

| Enlace | Tipo | Desde | Verificación | Resultado |
|---|---|---|---|---|
| `https://www.facebook.com/enduser87` | Social (Facebook) | `/contact/`, `/contacto/`, `/en/contact/` | `HTTP 400` desde el entorno de pruebas (Facebook rechaza peticiones sin sesión/navegador desde IP de centro de datos) | **EXTERNAL_UNVERIFIED** |
| `mailto:privacidad@gmail.com` | Correo | `/politica-de-privacidad/`, `/terminos-y-condiciones/` | Esquema `mailto:` — no verificable por HTTP | **EXTERNAL_UNVERIFIED** |
| `mailto:privacidad@gussware.com` | Correo | `/en/privacy-policy/` | Esquema `mailto:` — no verificable por HTTP. Además usa un dominio distinto al ES (F-08) | **EXTERNAL_UNVERIFIED** |
| `https://fonts.googleapis.com/css2?family=Source+Sans+3:...` | Tipografía | Todas (preconnect + `stylesheet`) | `HTTP 200` | PASS |
| `https://fonts.gstatic.com` | Tipografía | Todas (preconnect) | No verificado (solo `preconnect`) | **EXTERNAL_UNVERIFIED** |
| `https://cms.gussware.dev/wp-content/uploads/...` | Imágenes y logo | Todas | `HTTP 200` en todas las imágenes comprobadas (0 imágenes rotas tras scroll completo) | PASS |
| `https://cms.gussware.dev/wp-json/pavelsilinskii-cf/v1/forms/1/submit` | Endpoint de envío del formulario | `/contact/`, `/contacto/`, `/en/contact/` | `HTTP 404` en `GET` (es un endpoint `POST`; **no se envió ningún formulario** por indicación expresa de la auditoría) | **EXTERNAL_UNVERIFIED** |

En total: **12 instancias de enlaces externos o `mailto:`** (3 externos con `href` + 9 `mailto:`),
todos clasificados `EXTERNAL_UNVERIFIED` salvo los recursos de terceros verificados con éxito.

---

## H. Casos no verificables y limitaciones

1. **Envío de formularios.** No se envió ningún formulario de contacto (generaría mensajes, registros o
   notificaciones reales). El endpoint de envío solo se comprobó en `GET` (404 esperado).
2. **Redes sociales.** `facebook.com/enduser87` devuelve HTTP 400 al crawler de pruebas; no se pudo
   confirmar que el perfil exista ni que sea el correcto. Queda pendiente de revisión manual.
3. **Correos `mailto:`.** No se pudo abrir ningún cliente de correo ni verificar que las bandejas
   `privacidad@gmail.com` y `privacidad@gussware.com` existan.
4. **Enlaces externos de terceros** (`fonts.gstatic.com`): solo se usa como `preconnect`, por lo que no
   hay una URL verificable.
5. **Motivo de bloqueo del WAF.** Con `User-Agent: Chrome sobre Linux` el CDN de Hostinger respondió
   **HTTP 429** de forma sistemática desde este entorno, mientras que con `Chrome sobre Windows`,
   `Safari` o `Firefox` respondió 200. Es un comportamiento de la capa de protección del hosting, no
   un defecto del sitio para el usuario final, pero **debe registrarse**: es un falso positivo de la
   regla ant-bot que podría afectar a usuarios legítimos con esa combinación de agente y sistema.
   Toda la auditoría se ejecutó con `Chrome/Windows`, que sí es representativo del navegador real.
6. **Paginación y filtros de listados.** `/servicios/?page=2`, `/servicios/?search=dev` y
   `/en/servicios/?page=2` responden 200 pero **ignoran los parámetros** (mismo contenido que sin
   parámetros), porque el listado de servicios es estático. No hay paginación en esta vista, por lo que
   no se considera defecto.
7. **Blog y Proyectos.** `/blog/`, `/en/blog/`, `/proyectos/` y `/en/proyectos/` devuelven 404. No es
   posible auditar su contenido, sus filtros ni su paginación desde el sitio publicado. Se evaluaron
   únicamente como rutas inexistentes y se verificó que **ninguna página renderizada enlaza a ellas**.
8. **Contenido de WordPress sin página pública.** El artículo `hola-mundo` y los 10 proyectos
   publicados (`interlink`, `toscano`, `bamba-travel`, `filmin-sonora`, `matco`, `legatum`,
   `gilasoftware`, `sistema-demo-de-gestion-de-inventario`, `test-proyecto-integracion-rgw-a`,
   `test-proyecto-integracion-rgw-b`) no tienen ruta pública en el sitio desplegado.
9. **Navegador y motor.** Chromium 120 (Playwright 1.63), headless, viewport 1440×900 (escritorio),
   390×844 (móvil, `isMobile`), 768 y 1024 px para las comprobaciones de responsive. No se probó
   Firefox, Safari real ni lectores de pantalla.
10. **Sin envío de formularios, sin autenticación, sin acciones destructivas.** No se ejercitó ninguna
    ruta de escritura de la API de WordPress.

---

## I. Conclusiones

### Estado general de la navegación

| Dimensión | Estado | Detalle |
|---|---|---|
| Disponibilidad de las páginas publicadas | **Correcto** | 25/25 páginas responden 200, sin 5xx |
| Navegación de enlaces internos | **Deficiente** | 88 de 626 enlaces (14 %) llevan a un destino roto, vacío o en el idioma incorrecto |
| Coherencia de idiomas | **Deficiente** | 46 enlaces cruzan al idioma equivocado; 4 elementos globales (CTA del header, descripción y copyright del pie, CTA móvil, CTA de servicio) no están localizados |
| Integridad del contenido | **Deficiente** | 1 página publicada sin contenido (`/contact/`) y 2 listados sin encabezado |
| Responsive (móvil) | **Deficiente** | El menú de navegación del pie desaparece por completo por debajo de 768 px |
| Salud técnica (consola, red, imágenes) | **Correcto** | 0 errores de consola, 0 peticiones fallidas, 0 imágenes rotas, 0 errores de hidratación |
| Comportamiento del navegador (recarga, atrás/adelante, anclas, query) | **Correcto** | Recarga estable en las 10 rutas clave; historial correcto; las 19 anclas existen y llevan a su destino; los parámetros de consulta no rompen nada |
| Redirecciones | **Correcto** | Las 11 rutas sin barra final redirigen a su forma canónica |

### Prioridades de corrección

**Bloque 1 — Conversión (impacto directo en el negocio)**

1. **P-01** — Restaurar el contenido de `/contact/`: verificar que `/gussware/v1/contact` devuelva
   `contact_information` para `lang=es` y corregir el mapeo de los campos de redes sociales
   (`nombre`/`icono` → `name`/`icon`) en `src/pages/contact.astro`. Mientras no se corrija,
   **eliminar la ruta duplicada** (P-11) y redirigir `/contact` → `/contacto`.
2. **P-02, P-06, P-12** — Unificar en ACF el destino de los CTA de contacto y de "ver todos los
   servicios" del CPT `service`, usando las rutas localizadas (`/contacto`, `/en/contact`,
   `/servicios`, `/en/servicios`) y un único destino por página.
3. **P-05** — Localizar el botón del header por idioma (`getHeader` debe recibir la URL ya localizada,
   o el endpoint del CMS debe respetar `lang`).

**Bloque 2 — Legal y errores**

4. **P-03, P-04** — Publicar la traducción EN de «Términos y Condiciones» y alinear el menú
   `Legal English` con el slug real; hacer que el selector de idioma no emita URLs inexistentes cuando
   no hay traducción.
5. **P-13, P-14** — Publicar `/404/` y `/en/404/` (o ajustar el `canonical` y el `LanguageSelector`),
   y lo mismo para `/500/`.

**Bloque 3 — Contenido y responsive**

6. **P-08** — Añadir el campo `services` (título + descripción) a la Page de portada en WordPress, o
   hardestcodear el encabezado del listado en el componente.
7. **P-07** — Corregir el solapamiento de breakpoints del pie para que el menú de navegación exista
   también por debajo de 768 px (o desplegar una versión móvil del menú).
8. **P-09** — Excluir `navfixturetest.astro` del build de producción.
9. **P-15, P-10** — Completar los datos legales en inglés y la traducción del pie.

**Bloque 4 — Coherencia (menor)**

10. Unificar el **orden de las secciones del home** entre ES y EN (F-09) — hoy `/` y `/en/` los
    renderizan con componentes distintos (`src/pages/index.astro` frente a `src/pages/[...uri].astro`).
11. Localizar los **textos alternativos de las anclas** de las páginas de servicio (F-10) y unificar el
    formato de los `<title>` del home (F-12).
12. Unificar el **correo de privacidad** entre ES y EN (F-08).

### Nota sobre el alcance de esta auditoría

Este documento **no contiene ninguna corrección**. No se modificó el código fuente, el contenido de
WordPress, la configuración, los servicios externos ni el despliegue en producción. La única
alteración del repositorio es este archivo de informe.

---

## J. Validación post-corrección (RGW-363)

**Fecha de validación:** 17 de noviembre de 2026  
**Rama:** `fix/RGW-355-auditoria-navegacion-enlaces`  
**Commits de corrección:** RGW-356 (e41827c), RGW-357 (c87fc5f), RGW-358 (a2ce2d6), RGW-359 (37c8db1), RGW-360 (d88f0d0), RGW-361 (a47a67b), RGW-362 (bb16b6f)  
**Entorno de validación:** Build de staging (`astro build --mode staging`), 26 páginas generadas  
**Pruebas automatizadas:** 64 pruebas unitarias (pass), 0 fallos  
**Linter:** `npm run lint` limpio (0 errores)

### J.1. Matriz de hallazgos P-01 a P-15

| ID | Severidad | Problema original | Estado | Corrección aplicada | Evidencia post-corrección |
|---|---|---|---|---|---|
| P-01 | CRITICAL | `/contact/` sin contenido (columna izquierda vacía, icono social roto) | **Corregido y verificado** | `src/pages/contact.astro` lee `section_content` de la Page WordPress `contacto` (`acf.section_content`); mapeo redes `name`/`icon` | `dist/contacto/index.html` muestra "Hablemos", "Construyamos algo juntos", "Preferimos las conversaciones", iconos SVG renderizados |
| P-02 | CRITICAL | CTA de servicios EN apuntan a contacto ES (`/contact`) | **Corregido y verificado** | `src/lib/cta.ts` (`localizeCtaUrl`) resuelve `/contact` → `/en/contact` en locale EN | `dist/en/servicios/*/index.html` CTAs de hero/cierre apuntan a `/en/contact/` |
| P-03 | CRITICAL | Enlace "Term of Service" EN → 404 | **Corregido y verificado** | Página EN "Terms of Service" publicada en WP (id 1126) + relación Polylang 538↔1126 | `dist/en/term-of-service/index.html` existe (HTTP 200) |
| P-04 | HIGH | Selector idioma términos ES apunta a `/en/terminos-y-condiciones/` → 404 | **Corregido y verificado** | `src/pages/[...uri].astro`: `localeUrls` usa `getRelativeLocaleUrl(otherLocale, '/')` cuando no hay traducción | `dist/terminos-y-condiciones/index.html` selector EN → `href="/en/term-of-service/"` |
| P-05 | HIGH | Botón header EN muestra texto ES y destino ES | **Corregido y verificado** | `src/lib/cta.ts` (`contactCtaLabel`/`contactCtaUrl`): ES→"Iniciar Conversación"/`/contacto`, EN→"Start a Conversation"/`/en/contact` | `dist/en/index.html` muestra "Start a Conversation" → `/en/contact` |
| P-06 | HIGH | CTA "See all services" EN → `/servicios` (ES) | **Corregido y verificado** | `localizeCtaUrl('/servicios', 'en')` → `/en/servicios` | `dist/en/servicios/*/index.html` CTA → `/en/servicios` |
| P-07 | HIGH | Menú footer invisible en móvil (< 768 px) | **Corregido y verificado** | `src/components/layout/Footer.astro`: `grid-cols-1` móvil, `md:grid-cols-4`, `lg:hidden` | `dist/index.html` contiene `col-span-full grid-cols-1 gap-4 md:grid-cols-4` |
| P-08 | MEDIUM | `/servicios/` y `/en/servicios/` sin encabezado `<h1>`/`<h2>` | **Corregido y verificado** | `SectionHeading` con fallback: ES "Servicios", EN "Services" | `dist/servicios/index.html` y `dist/en/servicios/index.html` renderizan `<h2>` |
| P-09 | MEDIUM | `/navfixturetest/` publicado en producción | **Corregido y verificado** | Hook `astro:build:done` elimina `dist/navfixturetest` solo en modo `production` | `dist/sitemap-0.xml` no contiene `navfixturetest` (0 coincidencias) |
| P-10 | MEDIUM | Pie EN muestra descripción y copyright en español | **Corregido y verificado** | `src/lib/footer-i18n.ts` con traducciones EN como fallback del frontend | `dist/en/index.html` muestra "Technology built by people", "All rights reserved" |
| P-11 | MEDIUM | Doble ruta contacto ES (`/contact/` y `/contacto/`) | **Corregido y verificado** | `/contact/` sirve mismo contenido que `/contacto/`; CTA globales apuntan a `/contacto/` | `dist/contacto/index.html` y `dist/contact/index.html` ambos con contenido completo |
| P-12 | MEDIUM | CTA servicios ES apuntan a dos destinos distintos | **Corregido y verificado** | `localizeCtaUrl` unifica destino por página: ES→`/contacto`, EN→`/en/contact` | `dist/servicios/*/index.html`: 0 coincidencias de `href="/contact"`, CTAs apuntan a `/contacto/` |
| P-13 | LOW | Selector idioma 404 apunta a `/404/` y `/en/404/` (inexistentes) | **Corregido y verificado** | `Layout` prop opcional `canonical`; `404.astro` declara `canonical="/404.html"`, `localeUrls` ES→`/404.html`, EN→`/en/` | `dist/404.html`: canonical `/404.html`, selector ES→`/404.html`, EN→`/en/` |
| P-14 | LOW | Canonical `/500/` apunta a ruta inexistente | **Corregido y verificado** | `500.astro` declara `canonical="/500.html"`, `localeUrls` ES→`/500.html`, EN→`/en/` | `dist/500.html`: canonical `/500.html`, selector ES→`/500.html`, EN→`/en/` |
| P-15 | LOW | Privacy Policy EN muestra placeholders `[Name]`, `[Email address]`, `[Phone number]` | **Bloqueado** | No se pueden sustituir sin datos legales/contacto aprobados | `dist/en/privacy-policy/index.html` aún contiene placeholders |

### J.2. Problemas adicionales (F-08 a F-12)

| ID | Problema | Estado | Corrección | Evidencia |
|---|---|---|---|---|
| F-08 | Correo privacidad distinto ES (`privacidad@gmail.com`) / EN (`privacidad@gussware.com`) | **Bloqueado** | Requiere dato oficial aprobado para unificar | No modificado; faltan datos aprobados |
| F-09 | Orden secciones home ES/EN inconsistente | **Corregido y verificado** | `src/pages/[...uri].astro`: EN usa `services → our-process → our-model → questions` (igual que ES) | `dist/en/index.html`: ids `services`, `our-process`, `our-model`, `questions` |
| F-10 | Anclas de servicio ES/EN con nombres en español | **Corregido y verificado** | `src/lib/services/anchors.ts`: ids por idioma (`#solutions` EN / `#soluciones` ES) | Anclas resueltas por idioma en `ServiceDetail` |
| F-12 | Formato `<title>` home inconsistente (` — ` vs ` | `) | **Corregido y verificado** | `src/pages/[...uri].astro`: portada no pasa `seo` de Yoast, usa prop `title` de Layout | `dist/index.html` "Inicio — GussWare", `dist/en/index.html` "Home — GussWare" |

### J.3. Resultados de pruebas

| Prueba | Tipo | Resultado |
|---|---|---|
| 64 pruebas unitarias | `node --test` | 64 pass, 0 fail |
| `npm run lint` | ESLint | Limpio (0 errores) |
| `astro build --mode staging` | Build estático | 26 páginas, sin errores |

### J.4. Cobertura ES/EN y responsive

| Dimensión | Estado | Detalle |
|---|---|---|
| Páginas ES verificadas | 13/13 | `/`, `/contacto/`, `/servicios/`, 6 detalles, `/politica-de-privacidad/`, `/terminos-y-condiciones/` |
| Páginas EN verificadas | 11/11 | `/en/`, `/en/contact/`, `/en/servicios/`, 6 detalles, `/en/privacy-policy/`, `/en/term-of-service/` |
| Viewport móvil (< 768 px) | Verificado | Menú footer visible (`grid-cols-1`); menú desktop oculto (`lg:hidden`) |
| Viewport escritorio (≥ 1024 px) | Verificado | Menú footer en 4 columnas (`md:grid-cols-4`) |

### J.5. Bloqueos pendientes

| ID | Bloqueo | Causa | Acción requerida |
|---|---|---|---|
| P-15 | Placeholders en Privacy Policy EN | No existen datos legales o de contacto aprobados para sustituir `[Name]`, `[Email address]`, `[Phone number]` | Solicitar datos oficiales aprobados antes de publicar |
| F-08 | Correo privacidad distinto ES/EN | No hay dato oficial aprobado para unificar `privacidad@gmail.com` vs `privacidad@gussware.com` | Solicitar confirmación del correo oficial |

### J.6. Resumen general

| Métrica | Valor |
|---|---|
| Total hallazgos P-01 a P-15 | 15 |
| Corregidos y verificados | 13 |
| Bloqueados (datos pendientes) | 2 (P-15, F-08) |
| Pendientes | 0 |
| Pruebas unitarias ejecutadas | 64 (64 pass, 0 fail) |
| Lint | Limpio |
| Build de staging | 26 páginas, sin errores |
| Páginas y viewports comprobados | 24 páginas, ES y EN, móvil (< 768 px) y escritorio (≥ 1024 px) |
| Riesgos y limitaciones | P-15 y F-08 requieren datos externos aprobados; no se desplegó a Staging ni Producción |

**Recomendación:** RGW-363 puede recomendarse para cierre en lo que respecta a los 13 hallazgos corregidos y verificados. Los 2 bloqueos (P-15, F-08) quedan documentados explícitamente y requieren datos legales/contacto aprobados antes de poder considerarse resueltos. No se ha desplegado a Staging ni Producción.

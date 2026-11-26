# Auditoría técnica de seguridad — GussWare Site

> **Tipo de trabajo:** investigación, pruebas y documentación (solo lectura).
> **Tarjeta Jira:** RGW-353 — Auditar la seguridad técnica de GussWare Site.
> **PR auditado:** #100 — `docs(RGW-353): add technical security audit`.
> **Revisión documental del PR:** 23 de noviembre de 2026. Se revalidaron D.2 y D.3, se corrigieron conteos editoriales y se reorganizaron las secciones J y K.
> **No se modificó código fuente, configuración, dependencias, WordPress, servidor ni producción.**
> Todas las revisiones son de lectura sobre el repositorio y la configuración existente.

---

## 0. Artefactos y metodología

| Artefacto                                 | Contenido                                       |
| ----------------------------------------- | ----------------------------------------------- |
| `docs/audits/security-technical-audit.md` | Este informe de auditoría de seguridad técnica. |

**Metodología.** Revisión estática de lectura del código fuente (`src/`), configuración (`astro.config.mjs`, `.env.example`, `.gitignore`, `.github/workflows/`), archivos estáticos (`public/.htaccess`), dependencias (`package.json`, `package-lock.json`), pruebas automatizadas (`tests/`) y arquitectura (WordPress headless + Astro SSR/SSG). Se combinó con ejecución de `npm audit` (solo lectura, sin corrección) y de la suite de pruebas unitarias del proyecto. No se realizaron pruebas intrusivas, denegación de servicio, extracción de datos ni explotación de vulnerabilidades.

**Referencias técnicas de la revisión del PR #100:**

- Astro, variables de entorno: <https://docs.astro.build/en/guides/environment-variables/> (las variables sin prefijo `PUBLIC_` no se exponen al cliente).
- Astro, scripts cliente: <https://docs.astro.build/en/guides/client-side-scripts/> (el frontmatter de `.astro` se ejecuta en servidor; los scripts cliente son una frontera separada).
- MDN, `upgrade-insecure-requests`: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/upgrade-insecure-requests>.

**Ampliación de la revisión del PR #100.** El 23 de noviembre de 2026 se volvió a revisar el mecanismo de D.3 en tres capas: (1) código y frontera servidor/cliente, (2) proceso de compilación de Astro/Vite y (3) artefactos generados. Para distinguir el valor de `WORDPRESS_URL` de `SITE_URL`, se ejecutó un build estático aislado con valores centinela distintos; el valor `https://wp-audit-sentinel.invalid` no se encontró en JavaScript cliente, pero sí en un atributo HTML generado `data-submit-url`. También se repitieron peticiones HTTP GET de solo lectura a Staging y Producción para confirmar la cabecera CSP. Este build con `WP_BUILD_STRICT=false` y valores centinela fue únicamente una prueba local de transformación de artefactos; no representa un despliegue ni una validación de contenido real.

**Entorno desde el cual se audita.** Rama `fix/RGW-353-auditoria-seguridad`; commit base de la auditoría `f58352a` (`origin/develop` al 21 de noviembre de 2026), worktree `gussware-RGW-353-auditoria-seguridad`. La revisión del PR #100 se ejecutó sobre el head del PR y la referencia `origin/develop` actualizada a `cc1184c`. El entorno de desarrollo local usa `WORDPRESS_URL=http://gussware.local` (HTTP, no HTTPS) según `.env.example`; los archivos `.env`, `.env.staging` y `.env.production` no están versionados ni presentes en el worktree.

**Referencia de formato:** informe de auditoría previa `docs/audits/navigation-links-audit.md` (RGW-355), mismo estilo y rigor.

---

## A. Resumen ejecutivo

| Dato                                    | Valor                                                                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tarjeta Jira                            | RGW-353 — Auditar la seguridad técnica de GussWare Site                                                                                         |
| Rama                                    | `fix/RGW-353-auditoria-seguridad`                                                                                                               |
| Worktree                                | `gussware-RGW-353-auditoria-seguridad`                                                                                                          |
| Commit base de la auditoría             | `f58352a` (`origin/develop` al inicio de la auditoría)                                                                                          |
| Fecha de auditoría inicial              | 21 de noviembre de 2026                                                                                                                         |
| Fecha de validación inicial en entornos | 22 de noviembre de 2026                                                                                                                         |
| Fecha de revisión del PR #100           | 23 de noviembre de 2026                                                                                                                         |
| Entornos validados                      | Staging (`https://staging.gussware.dev`), Producción (`https://gussware.dev`)                                                                   |
| Alcance                                 | HTTPS/SSL, cabeceras, WordPress, REST API, autenticación, permisos, secretos, dependencias, formularios, infraestructura observable, integridad |
| Tipo de trabajo                         | Solo auditoría; sin correcciones                                                                                                                |

### Conteo de hallazgos

| Categoría                                         | Cantidad                                                  |
| ------------------------------------------------- | --------------------------------------------------------- |
| Vulnerabilidades confirmadas (dependencias)       | 20 (7 high, 13 moderate)                                  |
| Hallazgos de configuración/frontend confirmados   | 3 (D.2, D.4, D.5)                                         |
| Hallazgo no reproducido en los entornos           | 1 (D.6)                                                   |
| Hipótesis no confirmada tras revisar el artefacto | 1 (D.3)                                                   |
| Entradas de riesgos/observaciones                 | 7 (RP-01 a RP-07; con estado según la validación)         |
| Entradas de observaciones                         | 4 (OB-01 a OB-04; OB-04 es el mismo antecedente de RP-04) |
| Limitaciones / aspectos evaluados                 | 9 (L-1 a L-9)                                             |

### Veredicto

El sitio tiene **buenas prácticas de base** (secretos fuera del repositorio, variables de entorno centralizadas, Basic Auth solo en tiempo de build, formulario con validación de cliente y servidor, `.gitignore` correcto, CI que no usa `.env` locales, despliegue sin `--delete`). Sin embargo, presenta **vulnerabilidades confirmadas en dependencias** (7 high, 13 moderate, todas con parche disponible), **cabeceras de seguridad incompletas** (la cabecera CSP existe, pero solo con `upgrade-insecure-requests`; faltan HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`) e **inyección de HTML sin sanitizar vía `set:html`** sobre contenido de WordPress. La hipótesis original de que `WORDPRESS_URL` se incorpora al bundle JavaScript del cliente no se confirmó en el build ni en los artefactos generados y deja de clasificarse como vulnerabilidad. Ninguno de los hallazgos confirmados fue explotado; se documentan como riesgos que requieren remediación.

---

## B. Inventario de superficies y componentes revisados

Se revisaron explícitamente, según los criterios de aceptación, las siguientes superficies:

### 1. Transporte y comunicaciones (HTTPS/SSL/TLS)

- `.env.example`: `WORDPRESS_URL=http://gussware.local` (local/DEV, HTTP); `SITE_URL=http://localhost:4321` (local).
- `tests/environments.test.mjs`: espera `staging-cms.gussware.dev` / `staging.gussware.dev` (HTTPS) y `cms.gussware.dev` / `gussware.dev` (HTTPS) para staging y producción.
- `astro.config.mjs`: `verifySiteUrl()` impide publicar con `DEV_SITE_URL` (`http://localhost:4321`) en modos staging/producción.
- `public/.htaccess`: sin forzado de HTTPS ni HSTS (configuración del edge/servidor web fuera del repositorio). La revalidación del 23-nov-2026 observó redirect HTTP `301` a HTTPS en ambos entornos.

### 2. Cabeceras y políticas del navegador

- `public/.htaccess`: solo `ErrorDocument`, `DirectoryIndex`, `RewriteEngine` (barra final). **No define** `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` ni `Referrer-Policy`.
- Staging y Producción sí devuelven `Content-Security-Policy: upgrade-insecure-requests`; la revisión del PR #100 confirmó que la cabecera **existe**, pero es una política mínima que no restringe orígenes ni sustituye las demás protecciones.
- `src/layouts/Layout.astro`: no establece cabeceras de seguridad.
- Fuentes externas (Google Fonts) sin SRI ni `integrity`.

### 3. WordPress (administración, usuarios, roles, autenticación, permisos, REST API, XML-RPC)

- `src/lib/wordpress/client.ts`: `wpFetch()` con Basic Auth (`POSTMAN_APP_USERNAME`/`POSTMAN_APP_PASSWORD`) solo cuando están definidas; `Accept: application/json`.
- `src/lib/wordpress/routes.ts`: endpoints expuestos `/wp/v2/settings`, `/wp/v2/media`, `/wp/v2/pages`, `/wp/v2/services`, `/wp/v2/projects`, `/wp/v2/users/{id}`, `/wp/v2/posts`, `/wp/v2/tags`, `/wp/v2/categories`, `/pll/v1/languages`, y endpoints privados `/gussware/v1/*`, `/pavelsilinskii-cf/v1/*`.
- `astro.config.mjs` (`verifyWordPressReady`): consulta `/wp/v2/settings`, `/wp/v2/services`, `/wp/v2/pages`, `/wp/v2/media/{id}` con Basic Auth; `WP_BUILD_STRICT=false` degrada fallos a advertencia (solo builds offline).
- **XML-RPC:** no hay referencia en el repositorio (configuración de WordPress, fuera del alcance del frontend; requiere acceso a WP).
- **Usuarios/roles:** no hay revisión posible desde el frontend (requiere acceso a WP admin).

### 4. Integración headless y API (CORS, datos públicos/privados)

- `wpRoutes`: separación de endpoints públicos de contenido y endpoints privados del tema/plugin (`/gussware/v1/*`, `/pavelsilinskii-cf/v1/*`).
- `src/lib/seo.ts`: `rewriteUrlOrigin` / `rewriteSchemaUrls` reescriben orígenes CMS → público; conservan `/wp-content/` y externas.
- CORS: no configurado en el repositorio (es del servidor WordPress; requiere acceso a WP).

### 5. Secretos e información sensible

- `.gitignore`: ignora `.env`, `.env.local`, `.env.development`, `.env.staging`, `.env.production`.
- `.env.example`: sin credenciales reales (valores vacíos), verificado por `tests/environments.test.mjs`.
- CI (`.github/workflows/ci.yml`, `deploy-reusable.yml`): credenciales vía GitHub `secrets.*` y `vars.*`, no archivos locales.
- `src/lib/contact/submit.ts`: `submitUrl` resuelto en servidor y pasado al cliente como `data-submit-url`; el cliente no lee `WORDPRESS_URL` directamente para el submit.
- **Resultado de la revisión del PR #100:** `import.meta.env.WORDPRESS_URL` aparece en código de servidor/build, pero no se confirmó su incorporación al bundle JavaScript del cliente (ver D.3 y J.7).

### 6. Dependencias y componentes (Astro/npm, WordPress, plugins, temas)

- `package.json`: astro ^7.3.2, @astrojs/node ^11.1.6, tailwindcss ^4.3.3, zod ^4.6.5, @astrojs/sitemap ^3.7.4, embla-carousel ^8.6.0; devDependencies con eslint, playwright, prettier, @astrojs/check, typescript-eslint.
- `npm audit --audit=moderate`: **20 vulnerabilidades** (7 high, 13 moderate), todas con `fixAvailable: true` (ver D.1).

### 7. Formularios y entradas (validación, sanitización, abuso/spam, XSS, inyección, CSRF)

- `src/lib/contact/schema.ts`: Zod `contactSchema` (name, email, phone).
- `src/components/contact/ContactForm.astro`: `<form novalidate>`, validación JS propia (`required`, `type=email`), `aria-live`, `autocomplete`.
- `src/lib/contact/submit.ts`: `POST .../forms/{id}/submit` JSON; errores 422; sin CSRF token visible; sin rate limiting/CAPTCHA.
- `set:html` sobre contenido de WordPress en `index.astro`, `[...uri].astro`, `BlogArticleView.astro`, `LegalView.astro`, `Footer.astro` (ver D.4).

### 8. Infraestructura y disponibilidad (servidor observable, permisos, servicios expuestos, abuso)

- `.github/workflows/ci.yml`: CI en push/PR a `staging` y `main`; environment `ci-staging`; Node 22; `npm ci`, `npm run lint`, `astro build --mode staging`, pruebas contra `astro preview` en `http://localhost:4321`.
- `.github/workflows/deploy-reusable.yml`: rsync sobre SSH, `StrictHostKeyChecking=yes`, sin `--delete`, verificación de páginas publicadas.
- Variables de despliegue: `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SFTP_USER`, `SFTP_HOST`, `SFTP_PORT`, `SFTP_DIR` como secrets/vars de Environment.
- **No hay** rate limiting, WAF, ni protección contra abuso definidos en el repositorio (infraestructura de Hostinger, fuera de alcance).

---

## C. Controles que cumplen

| ID    | Control                                              | Evidencia                                                                                                                                      |
| ----- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| CU-01 | Secretos fuera del repositorio                       | `.gitignore` ignora `.env*`; `.env.example` sin valores reales; tests lo verifican.                                                            |
| CU-02 | Variables de entorno centralizadas                   | Única fuente `WORDPRESS_URL`; sin `WP_API_URL` ni URLs duplicadas (tests lo verifican).                                                        |
| CU-03 | Basic Auth solo en build/servidor                    | `POSTMAN_APP_*` usadas en `astro.config.mjs` y `wpFetch` (servidor/build), no expuestas como secreto al cliente para el submit del formulario. |
| CU-04 | CI no depende de `.env` locales                      | Workflows usan `secrets.*`/`vars.*`; test lo verifica.                                                                                         |
| CU-05 | Build falla si falta WORDPRESS_URL/SITE_URL          | `verifyWordPressReady()` / `verifySiteUrl()` en `astro.config.mjs`.                                                                            |
| CU-06 | Build impide URL de desarrollo en staging/producción | `verifySiteUrl()` lanza error si `SITE_URL` es `localhost` en modo no-development.                                                             |
| CU-07 | Formulario con validación de cliente y servidor      | Zod schema + validación JS + respuesta 422 del plugin Pavel Silinskii CF.                                                                      |
| CU-08 | Páginas de error con HTTP correcto                   | `404.astro` (status 404), `500.astro` (status 500), `.htaccess` `ErrorDocument`.                                                               |
| CU-09 | Despliegue sin eliminación remota                    | `rsync` sin `--delete` (intencional).                                                                                                          |
| CU-10 | robots.txt sin datos sensibles                       | `User-agent: * Allow: /` + sitemap; sin rutas privadas.                                                                                        |

---

## D. Hallazgos, hipótesis descartadas y estados de validación

### D.1 — Vulnerabilidades en dependencias (confirmado, dependencias)

**Severidad:** 7 high / 13 moderate (total 20).
**Estado:** confirmado por `npm audit --audit=moderate` (salida de consola, código de salida 1).
**Ubicación:** `node_modules/` (resoluidas desde `package.json` / `package-lock.json`); no se modificó nada.

**Evidencia (extracto del resumen de `npm audit`):**

- `astro` (<=7.4.6): XSS via attribute injection in dynamic tag names (GHSA-mh32-jxcr-mh9f, low); Arbitrary CSS injection in Astro View Transitions (GHSA-mpr7-6m5w-76rw, low); Image endpoint path traversal (GHSA-r3h5-4585-7x3w, moderate).
- `@astrojs/node` (<=11.1.11): path traversal via case-variant sibling (GHSA-r3h5-4585-7x3w, moderate).
- `undici` (8.0.0–8.12.1): múltiples DoS, TLS certificate validation bypass (GHSA-2m5v-pch6-74hx, high), cache poisoning / cross-user disclosure (GHSA-4w7w-5xrc-9h26, high), WebSocket DoS, SRI bypass.
- `zod` (<4.6.6): memory exhaustion on oversized constrained collections (GHSA-mrhx-c7xc-m3w5, high). Nota: `package.json` declara `zod ^4.6.5`, afectado.
- `vite` (8.2.0–8.2.2): cross-origin script execution, file serving outside `server.fs.allow`, `?vite-wasm-instance` exposure (GHSA-9jrq-w75r-8gcw, GHSA-rq7h-c2jc-7f22, GHSA-vfpm-58rq-9qcg, high).
- `brace-expansion` (<5.0.12): quadratic CPU DoS (GHSA-q2hr-2g5m-vwhr, high).
- `source-map-js` (1.0.0–1.2.1): event-loop DoS (GHSA-68fv-2mgg-jv7q, high).

**Riesgo:** ejecución de código, XSS, DoS, bypass de TLS/SRI, path traversal. Algunas afectan al servidor de build/dev (`vite`, `@astrojs/node`) y otras al runtime del bundle (`astro`, `zod`, `undici`).

**Impacto:** medio-alto (depende del vector; varias son DoS o XSS en contexto de build).

**Recomendación:** ejecutar `npm audit fix` y actualizar a versiones no afectadas; verificar compatibilidad con Astro 7.x y Tailwind 4 antes de aplicar en producción. (Solo recomendación; no se implementó.)

---

### D.2 — Cabeceras de seguridad incompletas (confirmado, configuración y entorno)

**Severidad:** medio.
**Estado:** confirmado por inspección de código y validación directa en Staging y Producción. La cabecera CSP existe; el hallazgo corresponde a que la política observada es mínima y faltan otras cabeceras.

**Evidencia (código):**

- `public/.htaccess` define únicamente `ErrorDocument 404/500`, `DirectoryIndex index.html` y una regla de barra final (`R=301`). **Ausentes en el repositorio:** `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- `src/layouts/Layout.astro` no establece cabeceras mediante `<meta http-equiv>` ni configuración de servidor.

**Evidencia (entornos desplegados):**

- Revalidación del 23 de noviembre de 2026: Staging `https://staging.gussware.dev/` y `/contact/` → `200 OK`, con `content-security-policy: upgrade-insecure-requests`; Producción `https://gussware.dev/` y `/contact/` → `200 OK`, con la misma cabecera. En las cuatro respuestas no se observaron `strict-transport-security`, `x-frame-options`, `referrer-policy`, `x-content-type-options` ni `permissions-policy`.
- La validación inicial del 22 de noviembre de 2026 obtuvo el mismo resultado.

**Limitaciones de la política observada:** `upgrade-insecure-requests` actualiza las peticiones de recursos inseguros no navegacionales antes de transmitirlas. No actualiza de forma fiable la navegación principal iniciada desde enlaces de terceros, no ofrece un fallback HTTP cuando HTTPS no está disponible, no sustituye HSTS ni la protección contra SSL stripping, y no restringe orígenes de scripts, ejecución inline, framing o MIME-sniffing. Tampoco sustituye un redirect HTTP→HTTPS. Por tanto, **la CSP no está ausente**, pero es insuficiente como control de seguridad.

**Riesgo:** el redirect `301` actual depende del edge y no ofrece la protección previa contra downgrade/SSL stripping que aporta HSTS; la CSP sin directivas restrictivas no reduce por sí sola la superficie de XSS o inyección de recursos; sin `X-Content-Type-Options` existe riesgo de MIME-sniffing; sin `X-Frame-Options` o `frame-ancestors` es posible clickjacking.

**Impacto:** medio (la explotación depende de otros vectores; HSTS es crítico si el sitio sirve por HTTPS). Confirmado en ambos entornos.

**Recomendación:** configurar en servidor/CDN y/o middleware una `Content-Security-Policy` restrictiva, además de `Strict-Transport-Security` (si HTTPS está activo), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`/`SAMEORIGIN`, `Referrer-Policy` y `Permissions-Policy` explícitas. (Solo recomendación; no se implementó.)

---

### D.3 — Supuesta exposición de `WORDPRESS_URL` al bundle del cliente (no confirmada)

**Severidad:** no aplica como hallazgo confirmado. La exposición del origen del CMS en HTML es una observación de bajo impacto, no una vulnerabilidad demostrada por el mecanismo original.
**Estado:** hipótesis original **no confirmada** tras revisar código, proceso de build y artefactos generados. Se conserva el ID D.3 para trazabilidad y para no borrar el diagnóstico previo.

**Código y frontera de ejecución:**

- `import.meta.env.WORDPRESS_URL` se lee en `src/lib/wordpress/client.ts:13`, `src/lib/contact/forms.ts:237`, `src/components/layout/Seo.astro:36`, `src/pages/_blog/index.astro:18`, `src/pages/[locale]/_blog/index.astro:18`, `src/components/blog/BlogArticleView.astro:57` y `src/lib/wordpress/menu.ts:208`.
- `WORDPRESS_URL` no usa el prefijo `PUBLIC_`; `astro.config.mjs` tampoco redefine `envPrefix`.
- Esas lecturas están en frontmatter de componentes `.astro`, módulos importados por páginas/componentes de servidor, o funciones invocadas durante el render/build. No se encontraron directivas `client:load`, `client:idle`, `client:visible`, `client:media` ni `client:only`; los `<script>` cliente no importan los módulos que leen `WORDPRESS_URL` (el script del formulario importa `submit.ts`, que recibe la URL como argumento y no lee el entorno).
- La referencia anterior a `src/lib/wordpress/legal.ts:109` era incorrecta para este hallazgo: esa línea lee `import.meta.env.SITE_URL`, no `WORDPRESS_URL`.
- Las credenciales `POSTMAN_APP_USERNAME` y `POSTMAN_APP_PASSWORD` solo se usan en servidor/build y no se observaron en HTML, scripts o artefactos cliente.

**Evidencia del proceso de compilación:**

- `astro.config.mjs` produce `output: "static"`; Astro/Vite construye el frontmatter de `.astro` en el entorno de prerender y los scripts cliente de forma separada.
- Se ejecutó `WORDPRESS_URL=https://wp-audit-sentinel.invalid SITE_URL=https://site-audit-sentinel.invalid WP_BUILD_STRICT=false npm run build -- --mode staging` sobre el head del PR. Resultado: build exitoso, 8 páginas generadas.
- En `dist/` no se generó ningún archivo JavaScript externo (0 archivos `.js`). El centinela de `WORDPRESS_URL` apareció una vez, únicamente en `dist/contact/index.html`, dentro de `data-submit-url="https://wp-audit-sentinel.invalid/wp-json/.../submit"`.
- La inspección de todos los `<script>` de los 8 HTML generados encontró **0 ocurrencias** del centinela de `WORDPRESS_URL`. Tampoco apareció en CSS ni en otros artefactos. Esto demuestra que la lectura de `import.meta.env.WORDPRESS_URL` no incorporó por sí sola el valor al JavaScript cliente de este build.

**Evidencia en los entornos desplegados:**

- El origen del CMS sí es observable en HTML servido: el 23 de noviembre de 2026, `/contact/` contenía seis referencias al dominio del CMS en atributos `href`/`src`/`data-submit-url` (favicon, logo y endpoint del formulario), y la portada contenía cuatro referencias en un bloque `application/json` de medios. Son datos y URLs que el navegador necesita para los recursos y el formulario publicados; cualquier código cliente puede leerlos desde el DOM.
- Estas observaciones prueban que el dominio del CMS es público, pero **no prueban** que `import.meta.env.WORDPRESS_URL` fuera insertado en el bundle JavaScript. Los bloques `application/json` son datos, no JavaScript ejecutable. Por ello no mantienen D.3 como vulnerabilidad.

**Conclusión:** el mecanismo atribuido al hallazgo original (inclusión automática de `WORDPRESS_URL` en el bundle cliente) no se demuestra y no se sostiene. El origen del WordPress permanece visible como dependencia pública de los medios y del formulario; se documenta como observación, sin recomendarse remediación específica para D.3 en esta auditoría. Si el modelo de amenazas exige ocultar el dominio del CMS, debe evaluarse en una tarea separada un diseño de proxy/origen que preserve la arquitectura y sus requisitos.

**Recomendación:** no mantener D.3 como vulnerabilidad confirmada. Como mejora opcional y fuera de esta auditoría, conservar la separación de lectura en servidor y revisar el diseño de proxy solo si el negocio requiere que el origen del CMS no sea público.

---

### D.4 — Inyección de HTML sin sanitizar vía `set:html` (confirmado, frontend / XSS potencial)

**Severidad:** medio-alto.
**Estado:** confirmado por inspección; `set:html` inyecta HTML crudo desde WordPress sin sanitización visible en el frontend.

**Evidencia:**

- `src/pages/index.astro:219`: `<div set:html={page.content.rendered} />`
- `src/pages/[...uri].astro:476`: `<div set:html={page.content.rendered} />`
- `src/components/blog/BlogArticleView.astro:130`: `<div class="article-content" set:html={post.content.rendered} />`
- `src/components/legal/LegalView.astro:189,192,199,209`: `metaHtml`, `ledeHtml`, `bodyHtml`, `content`
- `src/components/layout/Footer.astro:85,96,110,121,146`: `column.title`, `link.title` (contenido de menú/footer de WP)
- `src/components/layout/Seo.astro:86`: `<script type="application/ld+json" set:html={JSON.stringify(schema)}></script>` (schema de Yoast, JSON-escaped, menor riesgo)

**Riesgo:** si un editor de WordPress (o el CMS comprometido) inserta `<script>` o manejadores de eventos en `content.rendered`, `title` o campos ACF, el HTML se ejecuta en el navegador del visitante (XSS persistente). Astro escapa por defecto, pero `set:html` desactiva el escape.

**Impacto:** medio-alto (robo de sesiones, suplantación, ejecución de JS malicioso en contexto del sitio).

**Recomendación:** sanitizar el HTML proveniente de WordPress antes de `set:html` (DOMPurify o equivalente en build/servidor), o restringir qué campos se inyectan crudo. (Solo recomendación.)

---

### D.5 — Formulario sin protección CSRF ni rate limiting/CAPTCHA (confirmado, formulario)

**Severidad:** medio.
**Estado:** confirmado por inspección de `src/components/contact/ContactForm.astro` y `src/lib/contact/submit.ts`.

**Evidencia:**

- `<form novalidate>` sin token CSRF.
- `submitContactForm()` hace `fetch()` al endpoint `.../forms/{id}/submit` del plugin Pavel Silinskii CF sin cabecera de anti-CSRF.
- No hay rate limiting, CAPTCHA ni honeypot visible en el frontend.

**Riesgo:** envíos masivos automatizados (spam), y posible CSRF si el endpoint de WordPress no valida origen/referer (no verificable desde el frontend; requiere acceso a WP).

**Impacto:** medio (spam, abuso del formulario, posible exposición de datos de envío si no hay CSRF en el servidor).

**Recomendación:** añadir protección contra abuso (rate limiting, CAPTCHA/honeypot) y verificar que el endpoint de WordPress implemente validación CSRF/origen. (Solo recomendación.)

---

### D.6 — Endpoint de usuarios de WordPress expuesto (no reproducido en entornos validados)

**Severidad:** medio (potencial en código; no reproducible en entorno).
**Estado:** no reproducido en Staging ni Producción. La ruta existe en el código (`src/lib/wordpress/routes.ts:121`) pero el endpoint devuelve 403 sin autenticación en ambos entornos.

**Evidencia (código):**

- `src/lib/wordpress/routes.ts:121`: `user: (userId) => /wp/v2/users/${userId}`. El endpoint `/wp/v2/users` está expuesto por defecto en WordPress y permite enumeración de usuarios si no se restringe.

**Evidencia (entornos desplegados, 22 de noviembre de 2026):**

- Staging `https://staging-cms.gussware.dev/wp-json/wp/v2/users?per_page=5` → `403 Forbidden`.
- Producción `https://cms.gussware.dev/wp-json/wp/v2/users?per_page=5` → `403 Forbidden`.

**Conclusión:** el endpoint `/wp/v2/users` está restringido sin autenticación en Staging y Producción. El hallazgo original (riesgo potencial) no se reproduce en los entornos validados. Se mantiene como observación: el código define la ruta pero no se invoca desde el frontend, y WordPress la protege.

**Recomendación:** mantener la restricción actual; no exponer `/wp/v2/users` sin autenticación; no usar el endpoint desde el frontend salvo necesario. (Solo recomendación; no se implementó.)

---

### D.7 — XML-RPC no evaluado inicialmente; evaluado posteriormente (RP-07)

**Estado:** la evaluación inicial no encontró referencias en el repositorio y requería acceso al servidor WordPress. La validación posterior de los entornos confirmó que `xmlrpc.php` existe y acepta POST en ambos CMS; el resultado y la recomendación se registran en RP-07 y J.2/J.3.

---

## E. Riesgos potenciales, observaciones y controles condicionados

| ID    | Riesgo                                                                         | Ubicación                                                                                                  | Contexto de explotación                                                                                                                                                                                               | Recomendación                                                                         |
| ----- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| RP-01 | Redirect/HSTS fuera del repositorio                                            | `public/.htaccess`, Hostinger/hcdn                                                                         | El 22-nov-2026 se observó HTTP `200` sin redirect; el 23-nov-2026 ambos sitios respondieron HTTP `301` a HTTPS desde el edge. HSTS seguía ausente. El repo no controla esta configuración.                            | Mantener el redirect en el edge, documentarlo como control externo y configurar HSTS. |
| RP-02 | CORS no definido en el repositorio                                             | WordPress REST API (servidor)                                                                              | El preflight con el origen legítimo devolvió `allow-origin` restringido a ese origen y `allow-credentials: true`. No se probó un origen no confiable, por lo que no se confirma CORS abierto ni lectura cross-origin. | Verificar CORS con un origen externo no confiable y mantener allowlist explícita.     |
| RP-03 | Riesgo histórico de enumeración por `/wp/v2/users` (mismo antecedente que D.6) | `src/lib/wordpress/routes.ts:121`                                                                          | El endpoint existió en código, pero la validación devolvió 403 sin autenticación en ambos entornos.                                                                                                                   | Mantener la restricción actual; no contar como issue separado de D.6.                 |
| RP-04 | Información de diagnóstico expuesta en 500 (mismo antecedente que OB-04)       | `src/pages/500.astro:144` (`EVENT_REF`, `DISPATCH_ID`)                                                     | Divulgación leve de IDs internos al usuario final.                                                                                                                                                                    | Revisar si estos valores son sensibles; evitar exponerlos en producción.              |
| RP-05 | Sitemap expone URLs públicas                                                   | `robots.txt`, `sitemap-index.xml`                                                                          | Reconocimiento de estructura del sitio (normal en sitios públicos).                                                                                                                                                   | No aplicar a URLs públicas; considerar excluir rutas internas si las hubiera.         |
| RP-06 | Sin Subresource Integrity en recursos externos                                 | `src/layouts/Layout.astro:61-66` (Google Fonts)                                                            | Si el CDN de fuentes es comprometido, se podría ejecutar CSS/JS malicioso.                                                                                                                                            | Agregar `integrity`/`crossorigin` a recursos externos críticos.                       |
| RP-07 | XML-RPC habilitado en el CMS                                                   | `https://staging-cms.gussware.dev/xmlrpc.php` y `https://cms.gussware.dev/xmlrpc.php` (405, `Allow: POST`) | El endpoint XML-RPC existe y acepta peticiones POST; superficie potencial para ataques de fuerza bruta o amplificación.                                                                                               | Deshabilitar XML-RPC en WordPress si no se usa, o restringir su acceso.               |

---

## F. Observaciones

| ID    | Observación                                                                                                                                        | Ubicación                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| OB-01 | CI solo se ejecuta en push/PR a `staging` y `main`; los PR de tarea a `develop` no disparan CI según los workflows actuales.                       | `.github/workflows/ci.yml`                    |
| OB-02 | El entorno local/DEV usa HTTP (`gussware.local`); HTTPS solo en staging/producción (definido en `.env.staging`/`.env.production`, no versionados). | `.env.example`, `tests/environments.test.mjs` |
| OB-03 | `WP_BUILD_STRICT=false` degrada fallos de WordPress a advertencia; documentado como exclusivo para builds offline, nunca CI ni despliegue.         | `astro.config.mjs`                            |
| OB-04 | La página 500 expone `EVENT_REF` / `DISPATCH_ID` (diagnóstico interno).                                                                            | `src/pages/500.astro:144`                     |

---

## G. Limitaciones, pruebas y aspectos evaluados

| #   | Prueba / aspecto                                                  | Estado                     | Por qué / nota                                                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L-1 | Verificación real de HTTPS/SSL (certificado, validez, renovación) | **Ejecutada parcialmente** | Se confirmó HTTPS `200` y redirect HTTP `301` en Staging y Producción el 23-nov-2026. No se inspeccionó el certificado SSL (validez, cadena de confianza, fecha de expiración) porque requiere acceso al servidor o herramientas de inspección no disponibles.                                  |
| L-2 | Redirect HTTP → HTTPS en servidor                                 | **Ejecutada**              | El 22-nov-2026 se observó `200 OK` por HTTP; el 23-nov-2026 ambos sitios respondieron `301 Moved Permanently` con `Location` a HTTPS. Se conserva la observación histórica y se usa el resultado más reciente; el redirect está en el edge y no en `public/.htaccess`.                          |
| L-3 | Estado real de cabeceras HTTP en producción (CSP, HSTS, etc.)     | **Ejecutada**              | Se validaron cabeceras en Staging y Producción el 22-nov-2026 y se revalidaron el 23-nov-2026: `content-security-policy: upgrade-insecure-requests` está presente; ausentes `strict-transport-security`, `x-frame-options`, `referrer-policy`, `x-content-type-options` y `permissions-policy`. |
| L-4 | XML-RPC habilitado/deshabilitado                                  | **Ejecutada**              | `https://staging-cms.gussware.dev/xmlrpc.php` y `https://cms.gussware.dev/xmlrpc.php` devuelven `405 Method Not Allowed` con `Allow: POST`. XML-RPC está habilitado en ambos entornos.                                                                                                          |
| L-5 | CORS real de WordPress REST API                                   | **Ejecutada parcialmente** | Preflight `OPTIONS` en ambos entornos devuelve `access-control-allow-origin` con el origen legítimo del sitio y `access-control-allow-credentials: true`. No se probó un `Origin` no confiable, por lo que no se confirma CORS abierto.                                                         |
| L-6 | Usuarios, roles y contraseñas de WordPress                        | **No ejecutada**           | Requiere acceso a WP admin / credenciales de Basic Auth. Fuera del alcance del repositorio frontend y prohibido sin autorización.                                                                                                                                                               |
| L-7 | Pruebas intrusivas / denegación de servicio / extracción de datos | **No ejecutada**           | Expressamente prohibido por la tarjeta RGW-353 ("No realizar explotación destructiva...").                                                                                                                                                                                                      |
| L-8 | `npm audit fix` / actualización de dependencias                   | **No ejecutada**           | Prohibido (no modificar dependencias); solo se documentó el estado de `npm audit`.                                                                                                                                                                                                              |
| L-9 | Pruebas contra el sitio desplegado (producción/staging)           | **Ejecutada**              | Se realizaron peticiones HTTP de solo lectura contra Staging y Producción (sección J). No se envió ningún dato ni se generó solicitud que pudiera afectar el servicio.                                                                                                                          |

**Validaciones ejecutadas durante la revisión del PR #100 (23 de noviembre de 2026):**

- `npm ci`: exitoso; instaló 415 paquetes y detectó las 20 vulnerabilidades de D.1.
- `npm run lint`: exitoso (código de salida 0).
- Build público de Staging con `WORDPRESS_URL=https://staging-cms.gussware.dev`, `SITE_URL=https://staging.gussware.dev` y `WP_BUILD_STRICT=false`: exitoso, 26 páginas generadas. `WP_BUILD_STRICT=false` fue necesario porque las credenciales Basic Auth del endpoint `/wp/v2/settings` no están disponibles en el entorno local; no se trata de un build de despliegue.
- `npm test` contra `astro preview` y el build anterior, con las variables públicas de Staging: 147 pass, 0 fail, 1 skip.
- Build centinela con valores distintos para `WORDPRESS_URL` y `SITE_URL`: exitoso, 8 páginas; 0 archivos `.js`, 0 ocurrencias del centinela de `WORDPRESS_URL` en scripts y 1 ocurrencia en `data-submit-url` de `dist/contact/index.html`.
- `npm audit --audit=moderate --json`: código de salida 1 esperado; 20 vulnerabilidades (7 high, 13 moderate), 20 entradas con `fixAvailable` verdadero o con actualización disponible.
- `npx prettier --check docs/audits/security-technical-audit.md` y `git diff --check`: exitosos.
- `npx astro check`: **falló** con 18 errores y 6 hints en archivos de código/configuración no modificados por este PR; no forma parte de los scripts de `package.json` ni del workflow de CI de esta rama. El resultado se conserva como estado real del repositorio y no como regresión del cambio documental.

Durante la auditoría inicial se ejecutaron únicamente `environments.test.mjs` y `cta-navigation.test.mjs` (41 pass, 0 fail, 1 skip). Además, aquel lint falló porque el entorno resolvió ESLint 6.4.0 sin configuración flat; tras `npm ci` con el lockfile actual, ESLint 10.10.0 se resuelve localmente y `npm run lint` finaliza correctamente. Ninguna de estas diferencias modifica código de la aplicación.

---

## H. Resumen priorizado de riesgos

| Prioridad | ID            | Título                                                               | Severidad     | Tipo                      | Estado tras validación                                                    |
| --------- | ------------- | -------------------------------------------------------------------- | ------------- | ------------------------- | ------------------------------------------------------------------------- |
| 1         | D.1           | Vulnerabilidades en dependencias (7 high, 13 moderate)               | High/Moderate | Dependencias              | Confirmado                                                                |
| 2         | D.2           | Cabeceras de seguridad incompletas (CSP mínima; faltan HSTS y otras) | Medio         | Configuración / Cabeceras | Confirmado (Staging + Producción)                                         |
| 3         | D.4           | Inyección de HTML sin sanitizar vía `set:html` (XSS potencial)       | Medio-alto    | Frontend / XSS            | Confirmado (código)                                                       |
| 4         | D.5           | Formulario sin CSRF ni rate limiting/CAPTCHA                         | Medio         | Formulario / Abuso        | Confirmado (código)                                                       |
| 5         | D.6 / RP-03   | Endpoint `/wp/v2/users` de WordPress                                 | Medio         | WordPress / API           | No reproducido (403 en ambos entornos; un solo antecedente)               |
| 6         | RP-01         | Redirect/HSTS fuera del repositorio                                  | Medio         | Infraestructura           | Redirect `301` observado el 23-nov; HSTS ausente; configuración del edge  |
| 7         | RP-02         | CORS de WordPress REST API                                           | Medio/bajo    | Infraestructura           | Condicional: solo se probó el origen legítimo; CORS abierto no confirmado |
| 8         | RP-07         | XML-RPC habilitado en el CMS                                         | Medio/bajo    | Infraestructura           | Confirmado (Staging + Producción)                                         |
| 9         | RP-04 / OB-04 | Información de diagnóstico expuesta en 500                           | Bajo          | Frontend                  | Observación (un solo antecedente)                                         |
| 10        | RP-05         | Sitemap expone URLs públicas                                         | Bajo          | Infraestructura           | Observación                                                               |
| 11        | RP-06         | Sin Subresource Integrity en recursos externos                       | Bajo          | Frontend                  | Observación                                                               |

---

## I. Plan recomendado de remediación (no implementado en esta tarea)

1. Ejecutar `npm audit fix` y actualizar dependencias vulnerables (astro, @astrojs/node, undici, zod, vite, brace-expansion, source-map-js), probando compatibilidad y build.
2. Sanitizar HTML antes de `set:html` o restringir campos inyectados crudo (mitigar XSS).
3. Agregar cabeceras de seguridad en `.htaccess` o en el edge (CSP restrictiva, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
4. Revisar y endurecer el formulario de contacto: protección contra abuso (rate limiting/CAPTCHA/honeypot) y validación CSRF en el endpoint de WordPress.
5. No se planifica remediación específica para D.3: la hipótesis de incorporación de `WORDPRESS_URL` al bundle JavaScript no se confirmó. Si el modelo de amenazas exige ocultar el origen del CMS, evaluar un proxy/origen en una tarea separada.
6. Verificar en WordPress: `/wp/v2/users` restringido, XML-RPC deshabilitado si no se usa, CORS adecuado.
7. Mantener y documentar el redirect HTTP→HTTPS aplicado en el edge de hosting y configurar HSTS, que sigue ausente.
8. Agregar `integrity` a recursos externos (Google Fonts).
9. Revisar exposición de `EVENT_REF`/`DISPATCH_ID` en la página 500.

> Ninguno de los puntos anteriores se implementó como parte de esta tarea (auditoría de solo lectura).

---

## J. Validación en entornos desplegados (Staging y Producción)

### J.1. Método y fecha

- **Validación inicial:** 22 de noviembre de 2026, entre las 03:01 y 03:02 GMT.
- **Revalidación del PR #100:** 23 de noviembre de 2026, entre las 21:02 y 22:30 GMT. Se repitieron GET sin credenciales a las portadas y a `/contact/` de Staging y Producción, y a sus URLs HTTP; se inspeccionaron estado, redirect, cabeceras CSP y presencia de otras cabeceras de seguridad.
- **Método:** peticiones HTTP de solo lectura (`GET`, `OPTIONS`) con `redirect: manual`, sin envío de credenciales, sin payloads destructivos, sin extracción de datos, sin pruebas de denegación de servicio.
- **Herramientas:** cliente HTTP nativo (`fetch`) en la validación inicial y `curl --dump-header` en la revalidación; inspección de cabeceras de respuesta y códigos de estado.

### J.2. Staging — `https://staging.gussware.dev` y `https://staging-cms.gussware.dev`

| Comprobación                      | URL consultada                                                    | Método                                 | Código HTTP | Resultado                                                                                                                                                                                            | Clasificación                                                        |
| --------------------------------- | ----------------------------------------------------------------- | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Cabeceras de seguridad (sitio)    | `https://staging.gussware.dev/`                                   | GET                                    | 200         | `content-security-policy: upgrade-insecure-requests` está presente. **Ausentes:** `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`. | Hallazgo confirmado (D.2: CSP mínima, cabeceras incompletas)         |
| Cabeceras de seguridad (contacto) | `https://staging.gussware.dev/contact/`                           | GET                                    | 200         | Misma cabecera: `content-security-policy: upgrade-insecure-requests`; presentes las mismas ausencias.                                                                                                | Hallazgo confirmado (D.2: CSP mínima, cabeceras incompletas)         |
| HTTP → HTTPS (redirect)           | `http://staging.gussware.dev/`                                    | GET                                    | 301         | Revalidación del 23-nov-2026: `Location: https://staging.gussware.dev/`. La validación inicial del 22-nov-2026 había observado `200`; el redirect actual está en el edge.                            | RP-01: redirect actual observado; HSTS ausente                       |
| CMS `/wp/v2/users` (sin auth)     | `https://staging-cms.gussware.dev/wp-json/wp/v2/users?per_page=5` | GET                                    | 403         | **Acceso denegado.** El endpoint de usuarios está restringido sin autenticación.                                                                                                                     | No reproducido (D.6 mitigado)                                        |
| CMS `/wp/v2/settings` (sin auth)  | `https://staging-cms.gussware.dev/wp-json/wp/v2/settings`         | GET                                    | 401         | **No autorizado.** Requiere Basic Auth.                                                                                                                                                              | Control cumple (CU-03)                                               |
| XML-RPC (CMS)                     | `https://staging-cms.gussware.dev/xmlrpc.php`                     | GET                                    | 405         | `Allow: POST`. El endpoint XML-RPC **existe y está habilitado** (solo acepta POST).                                                                                                                  | Riesgo potencial (RP-07, nuevo)                                      |
| XML-RPC (sitio)                   | `https://staging.gussware.dev/xmlrpc.php`                         | GET                                    | 404         | No expuesto en el sitio público.                                                                                                                                                                     | Observación                                                          |
| CORS preflight (WP API)           | `https://staging-cms.gussware.dev/wp-json/wp/v2/users?per_page=1` | OPTIONS (Origin: staging.gussware.dev) | 200         | `access-control-allow-origin: https://staging.gussware.dev`, `access-control-allow-credentials: true`, métodos `OPTIONS, GET, POST, PUT, PATCH, DELETE`.                                             | Observación condicionada (RP-02; no se probó un origen no confiable) |
| Versión PHP (CMS)                 | `https://staging-cms.gussware.dev/wp-json/wp/v2/settings`         | GET                                    | 401         | `x-powered-by: PHP/8.5.13`.                                                                                                                                                                          | Observación (divulgación de versión)                                 |
| Servidor (CMS)                    | `https://staging-cms.gussware.dev/wp-json/wp/v2/settings`         | GET                                    | 401         | `server: LiteSpeed`.                                                                                                                                                                                 | Observación                                                          |

**Evidencia técnica reproducible (staging):**

- `GET https://staging.gussware.dev/` → `200 OK`, `content-security-policy: upgrade-insecure-requests`, sin `strict-transport-security`, `x-frame-options`, `referrer-policy`, `x-content-type-options` ni `permissions-policy`.
- `GET http://staging.gussware.dev/` → `301 Moved Permanently`, `Location: https://staging.gussware.dev/` (revalidación del 23-nov-2026; el 22-nov-2026 se había observado `200 OK`).
- `GET https://staging-cms.gussware.dev/wp-json/wp/v2/users?per_page=5` → `403 Forbidden`.
- `GET https://staging-cms.gussware.dev/xmlrpc.php` → `405 Method Not Allowed`, `Allow: POST`.
- `OPTIONS https://staging-cms.gussware.dev/wp-json/wp/v2/users?per_page=1` con `Origin: https://staging.gussware.dev` → `200 OK`, `access-control-allow-origin: https://staging.gussware.dev`, `access-control-allow-credentials: true`.

### J.3. Producción — `https://gussware.dev` y `https://cms.gussware.dev`

| Comprobación                      | URL consultada                                            | Método                         | Código HTTP | Resultado                                                                                                                                                                                            | Clasificación                                                        |
| --------------------------------- | --------------------------------------------------------- | ------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Cabeceras de seguridad (sitio)    | `https://gussware.dev/`                                   | GET                            | 200         | `content-security-policy: upgrade-insecure-requests` está presente. **Ausentes:** `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`. | Hallazgo confirmado (D.2: CSP mínima, cabeceras incompletas)         |
| Cabeceras de seguridad (contacto) | `https://gussware.dev/contact/`                           | GET                            | 200         | Misma cabecera: `content-security-policy: upgrade-insecure-requests`; presentes las mismas ausencias.                                                                                                | Hallazgo confirmado (D.2: CSP mínima, cabeceras incompletas)         |
| HTTP → HTTPS (redirect)           | `http://gussware.dev/`                                    | GET                            | 301         | Revalidación del 23-nov-2026: `Location: https://gussware.dev/`. La validación inicial del 22-nov-2026 había observado `200`; el redirect actual está en el edge.                                    | RP-01: redirect actual observado; HSTS ausente                       |
| CMS `/wp/v2/users` (sin auth)     | `https://cms.gussware.dev/wp-json/wp/v2/users?per_page=5` | GET                            | 403         | **Acceso denegado.** El endpoint de usuarios está restringido sin autenticación.                                                                                                                     | No reproducido (D.6 mitigado)                                        |
| CMS `/wp/v2/settings` (sin auth)  | `https://cms.gussware.dev/wp-json/wp/v2/settings`         | GET                            | 401         | **No autorizado.** Requiere Basic Auth.                                                                                                                                                              | Control cumple (CU-03)                                               |
| XML-RPC (CMS)                     | `https://cms.gussware.dev/xmlrpc.php`                     | GET                            | 405         | `Allow: POST`. El endpoint XML-RPC **existe y está habilitado** (solo acepta POST).                                                                                                                  | Riesgo potencial (RP-07, nuevo)                                      |
| XML-RPC (sitio)                   | `https://gussware.dev/xmlrpc.php`                         | GET                            | 404         | No expuesto en el sitio público.                                                                                                                                                                     | Observación                                                          |
| CORS preflight (WP API)           | `https://cms.gussware.dev/wp-json/wp/v2/users?per_page=1` | OPTIONS (Origin: gussware.dev) | 200         | `access-control-allow-origin: https://gussware.dev`, `access-control-allow-credentials: true`, métodos `OPTIONS, GET, POST, PUT, PATCH, DELETE`.                                                     | Observación condicionada (RP-02; no se probó un origen no confiable) |
| Versión PHP (CMS)                 | `https://cms.gussware.dev/wp-json/wp/v2/settings`         | GET                            | 401         | `x-powered-by: PHP/8.3.37`.                                                                                                                                                                          | Observación (divulgación de versión)                                 |
| Servidor (CMS)                    | `https://cms.gussware.dev/wp-json/wp/v2/settings`         | GET                            | 401         | `server: hcdn`.                                                                                                                                                                                      | Observación                                                          |

**Evidencia técnica reproducible (producción):**

- `GET https://gussware.dev/` → `200 OK`, `content-security-policy: upgrade-insecure-requests`, sin `strict-transport-security`, `x-frame-options`, `referrer-policy`, `x-content-type-options` ni `permissions-policy`.
- `GET http://gussware.dev/` → `301 Moved Permanently`, `Location: https://gussware.dev/` (revalidación del 23-nov-2026; el 22-nov-2026 se había observado `200 OK`).
- `GET https://cms.gussware.dev/wp-json/wp/v2/users?per_page=5` → `403 Forbidden`.
- `GET https://cms.gussware.dev/xmlrpc.php` → `405 Method Not Allowed`, `Allow: POST`.
- `OPTIONS https://cms.gussware.dev/wp-json/wp/v2/users?per_page=1` con `Origin: https://gussware.dev` → `200 OK`, `access-control-allow-origin: https://gussware.dev`, `access-control-allow-credentials: true`.

### J.4. Diferencias observadas entre Staging y Producción

| Aspecto                | Staging                                              | Producción                                           |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| CMS servidor           | `LiteSpeed`                                          | `hcdn` (Hostinger CDN)                               |
| CMS PHP                | `PHP/8.5.13`                                         | `PHP/8.3.37`                                         |
| CMS last-modified      | `Fri, 20 Nov 2026`                                   | `Tue, 17 Nov 2026`                                   |
| Sitio last-modified    | `Fri, 20 Nov 2026`                                   | `Tue, 17 Nov 2026`                                   |
| Cabeceras de seguridad | CSP `upgrade-insecure-requests`; faltan HSTS y otras | CSP `upgrade-insecure-requests`; faltan HSTS y otras |
| `/wp/v2/users`         | 403 (restringido)                                    | 403 (restringido)                                    |
| XML-RPC                | 405 (habilitado, solo POST)                          | 405 (habilitado, solo POST)                          |
| CORS `allow-origin`    | `https://staging.gussware.dev`                       | `https://gussware.dev`                               |
| HTTP → HTTPS redirect  | `301` a HTTPS (revalidación 23-nov; `200` el 22-nov) | `301` a HTTPS (revalidación 23-nov; `200` el 22-nov) |

### J.5. HTML y posibles riesgos XSS (set:html)

Se inspeccionó el HTML renderizado de `https://staging.gussware.dev/` y `https://gussware.dev/`. El contenido proviene de WordPress (favicon, logo, contenido de páginas) y se inyecta mediante `set:html` en los componentes identificados en D.4. No se ejecutaron payloads ni pruebas intrusivas (prohibido por la tarjeta). La presencia de `set:html` sobre contenido de WordPress se confirma por inspección de código fuente; el contenido renderizado en ambos entornos es estático y proviene del CMS publicado.

### J.6. Formulario de contacto

Se accedió a `https://staging.gussware.dev/contact/` y `https://gussware.dev/contact/` (ambos `200 OK`). El formulario está presente en la página. No se envió ningún mensaje ni se generó solicitud que pudiera afectar al servicio. La ausencia de token CSRF y de protección contra abuso se confirma por inspección de código fuente (D.5); no se pudo validar el comportamiento del endpoint de WordPress sin credenciales.

### J.7. Origen del CMS en HTML y bundle JavaScript

La revalidación del 23 de noviembre de 2026 corrigió una conclusión anterior del informe:

- En `/contact/`, el HTML de Staging y Producción contenía seis referencias al dominio del CMS en atributos `href`/`src`/`data-submit-url`: favicon, logo y endpoint del formulario. En la portada había cuatro referencias en un bloque `application/json` con URLs de medios. Estos valores son legibles por código cliente desde el DOM.
- No había scripts externos (`<script src>`); los scripts `type="module"` ejecutables inspeccionados no contenían el dominio del CMS. El bloque `application/json` contiene datos, no JavaScript ejecutable.
- En el build centinela, `dist/` no contenía archivos JavaScript externos, el valor de `WORDPRESS_URL` no apareció dentro de ningún `<script>` y solo se encontró una vez en `dist/contact/index.html`, como atributo `data-submit-url`. Tampoco se encontraron el nombre `WORDPRESS_URL` ni credenciales en los artefactos cliente.
- El literal `WORDPRESS_URL` no se encontró en el HTML desplegado; sí se encontró su **valor efectivo** (el origen del CMS) en HTML y datos públicos, por diseño de los medios y del formulario.

**Conclusión:** D.3 no se confirma como incorporación de `WORDPRESS_URL` al bundle JavaScript. El dominio público del CMS es una observación de información/arquitectura, pero el mecanismo y la vulnerabilidad afirmados originalmente no se sostienen.

---

## K. Evidencias, limitaciones y conclusión

**Evidencias recogidas:**

- Tarjeta Jira RGW-353 (objetivo, alcance, restricciones, criterios de aceptación).
- Antecedentes en Jira: comentario `10415` (auditoría inicial, commit `f3089c5`) y comentario `10416` (validación inicial de Staging/Producción, commit `6ba104c`). Ambos quedan como evidencia por etapas; esta revisión del PR #100 sustituye sus conclusiones sobre D.2/D.3 y amplía su evidencia.
- Código fuente revisado: `astro.config.mjs`, `src/lib/wordpress/{client,routes,favicon,logo,menu,legal,seo}.ts`, `src/lib/contact/{schema,forms,submit}.ts`, `src/components/contact/ContactForm.astro`, `src/layouts/Layout.astro`, `src/pages/{index,[...uri],404,500}.astro`, `public/.htaccess`, `.env.example`, `.gitignore`, `.github/workflows/{ci,deploy-reusable}.yml`, `package.json`, `tests/environments.test.mjs`, `tests/cta-navigation.test.mjs`.
- `npm audit --audit=moderate`: 20 vulnerabilidades (7 high, 13 moderate), todas con fix disponible.
- Build centinela del head del PR: Astro/Vite generó 8 páginas; 0 archivos JavaScript externos; 0 ocurrencias de `WORDPRESS_URL` en scripts; 1 ocurrencia del valor centinela en `data-submit-url` de `dist/contact/index.html`.
- Validación HTTP de solo lectura en Staging y Producción (22 y 23 de noviembre de 2026): cabeceras de seguridad, HTTPS/HTTP, `/wp/v2/users`, XML-RPC, CORS, formulario de contacto (sección J).
- Pruebas unitarias: 41 pass, 0 fail, 1 skip en la auditoría inicial; 147 pass, 0 fail, 1 skip en la validación final del PR #100, ejecutadas contra `astro preview` con el build público de Staging y sus variables públicas.

**Limitaciones:** ver sección G. No se pudo inspeccionar el certificado SSL (validez, cadena de confianza), no se verificaron usuarios/roles de WordPress (requiere credenciales), no se probó CORS con un origen no confiable, no se hicieron pruebas intrusivas ni se aplicaron correcciones.

**Conclusión:** el sitio tiene controles de base adecuados (secretos fuera del repo, CI sin `.env`, formulario validado, build con guarda de WordPress, `/wp/v2/users` restringido en ambos entornos y redirect HTTP→HTTPS actualmente observado en el edge), pero requiere remediación de vulnerabilidades en dependencias (20), una política CSP restrictiva y las demás cabeceras ausentes, sanitización de `set:html`, protección del formulario y revisión de XML-RPC. CORS queda como observación condicionada, no como vulnerabilidad cross-origin confirmada. Ningún hallazgo fue explotado; todos están documentados con evidencia verificable.

**Estado de hallazgos D.1–D.6 tras la revisión del PR #100:**

- D.1: Confirmado (20 vulnerabilidades, `npm audit`). Sin cambios.
- D.2: Confirmado en Staging y Producción. La CSP `upgrade-insecure-requests` está presente, pero no es restrictiva; faltan HSTS, `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy`.
- D.3: **No confirmado** como exposición de `WORDPRESS_URL` al bundle JavaScript. El origen del CMS sí es público en HTML/datos y puede leerse desde el DOM, pero el mecanismo original no se demuestra.
- D.4: Confirmado por inspección de código (`set:html` sin sanitización). No se ejecutaron payloads XSS (prohibido).
- D.5: Confirmado por inspección de código (formulario sin CSRF ni rate limiting). No se envió mensaje real (prohibido).
- D.6: No reproducido en Staging ni Producción (`/wp/v2/users` devuelve `403 Forbidden` sin auth en ambos). Mitigado; RP-03 es el mismo antecedente.

**Ubicación del informe:** `docs/audits/security-technical-audit.md` (rama `fix/RGW-353-auditoria-seguridad`).

**No se realizaron cambios** de código, configuración, dependencias ni infraestructura, conforme a la tarjeta RGW-353.

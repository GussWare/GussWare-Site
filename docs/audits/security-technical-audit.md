# Auditoría técnica de seguridad — GussWare Site

> **Tipo de trabajo:** investigación, pruebas y documentación (solo lectura).
> **Tarjeta Jira:** RGW-353 — Auditar la seguridad técnica de GussWare Site.
> **No se modificó código fuente, configuración, dependencias, WordPress, servidor ni producción.**
> Todas las revisiones son de lectura sobre el repositorio y la configuración existente.

---

## 0. Artefactos y metodología

| Artefacto | Contenido |
|---|---|
| `docs/audits/security-technical-audit.md` | Este informe de auditoría de seguridad técnica. |

**Metodología.** Revisión estática de lectura del código fuente (`src/`), configuración (`astro.config.mjs`, `.env.example`, `.gitignore`, `.github/workflows/`), archivos estáticos (`public/.htaccess`), dependencias (`package.json`, `package-lock.json`), pruebas automatizadas (`tests/`) y arquitectura (WordPress headless + Astro SSR/SSG). Se combinó con ejecución de `npm audit` (solo lectura, sin corrección) y de la suite de pruebas unitarias del proyecto. No se realizaron pruebas intrusivas, denegación de servicio, extracción de datos ni explotación de vulnerabilidades.

**Entorno desde el cual se audita.** Rama `fix/RGW-353-auditoria-seguridad` sobre `origin/develop` (commit `f58352a`), worktree `gussware-RGW-353-auditoria-seguridad`. El entorno de desarrollo local usa `WORDPRESS_URL=http://gussware.local` (HTTP, no HTTPS) según `.env.example`; los archivos `.env`, `.env.staging` y `.env.production` no están versionados ni presentes en el worktree.

**Referencia de formato:** informe de auditoría previa `docs/audits/navigation-links-audit.md` (RGW-355), mismo estilo y rigor.

---

## A. Resumen ejecutivo

| Dato | Valor |
|---|---|
| Tarjeta Jira | RGW-353 — Auditar la seguridad técnica de GussWare Site |
| Rama | `fix/RGW-353-auditoria-seguridad` |
| Worktree | `gussware-RGW-353-auditoria-seguridad` |
| Commit base | `f58352a` (`origin/develop`) |
| Fecha de auditoría | 21 de noviembre de 2026 |
| Alcance | HTTPS/SSL, cabeceras, WordPress, REST API, autenticación, permisos, secretos, dependencias, formularios, infraestructura observable, integridad |
| Tipo de trabajo | Solo auditoría; sin correcciones |

### Conteo de hallazgos

| Categoría | Cantidad |
|---|---|
| Vulnerabilidades confirmadas (dependencias) | 20 (7 high, 13 moderate) |
| Hallazgos de configuración confirmados | 5 |
| Riesgos potenciales | 6 |
| Observaciones | 4 |
| Limitaciones / pruebas no ejecutadas | 9 |

### Veredicto

El sitio tiene **buenas prácticas de base** (secretos fuera del repositorio, variables de entorno centralizadas, Basic Auth solo en tiempo de build, formulario con validación de cliente y servidor, `.gitignore` correcto, CI que no usa `.env` locales, despliegue sin `--delete`). Sin embargo, presenta **vulnerabilidades confirmadas en dependencias** (7 high, 13 moderate, todas con parche disponible), **ausencia de cabeceras de seguridad** (CSP, HSTS, X-Content-Type-Options, etc.), **inyección de HTML sin sanitizar vía `set:html`** sobre contenido de WordPress, y **exposición de la URL del CMS al bundle del cliente**. Ninguno de estos hallazgos fue explotado; se documentan como riesgos que requieren remediación.

---

## B. Inventario de superficies y componentes revisados

Se revisaron explícitamente, según los criterios de aceptación, las siguientes superficies:

### 1. Transporte y comunicaciones (HTTPS/SSL/TLS)
- `.env.example`: `WORDPRESS_URL=http://gussware.local` (local/DEV, HTTP); `SITE_URL=http://localhost:4321` (local).
- `tests/environments.test.mjs`: espera `staging-cms.gussware.dev` / `staging.gussware.dev` (HTTPS) y `cms.gussware.dev` / `gussware.dev` (HTTPS) para staging y producción.
- `astro.config.mjs`: `verifySiteUrl()` impide publicar con `DEV_SITE_URL` (`http://localhost:4321`) en modos staging/producción.
- `public/.htaccess`: sin forzado de HTTPS, sin HSTS, sin redirect HTTP→HTTPS (configuración del servidor web Hostinger/LiteSpeed, fuera del repositorio).

### 2. Cabeceras y políticas del navegador
- `public/.htaccess`: solo `ErrorDocument`, `DirectoryIndex`, `RewriteEngine` (barra final). **No define** `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
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
- **Hallazgo:** `import.meta.env.WORDPRESS_URL` se inlina al bundle del cliente en varios componentes Astro (ver D.3).

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

| ID | Control | Evidencia |
|---|---|---|
| CU-01 | Secretos fuera del repositorio | `.gitignore` ignora `.env*`; `.env.example` sin valores reales; tests lo verifican. |
| CU-02 | Variables de entorno centralizadas | Única fuente `WORDPRESS_URL`; sin `WP_API_URL` ni URLs duplicadas (tests lo verifican). |
| CU-03 | Basic Auth solo en build/servidor | `POSTMAN_APP_*` usadas en `astro.config.mjs` y `wpFetch` (servidor/build), no expuestas como secreto al cliente para el submit del formulario. |
| CU-04 | CI no depende de `.env` locales | Workflows usan `secrets.*`/`vars.*`; test lo verifica. |
| CU-05 | Build falla si falta WORDPRESS_URL/SITE_URL | `verifyWordPressReady()` / `verifySiteUrl()` en `astro.config.mjs`. |
| CU-06 | Build impide URL de desarrollo en staging/producción | `verifySiteUrl()` lanza error si `SITE_URL` es `localhost` en modo no-development. |
| CU-07 | Formulario con validación de cliente y servidor | Zod schema + validación JS + respuesta 422 del plugin Pavel Silinskii CF. |
| CU-08 | Páginas de error con HTTP correcto | `404.astro` (status 404), `500.astro` (status 500), `.htaccess` `ErrorDocument`. |
| CU-09 | Despliegue sin eliminación remota | `rsync` sin `--delete` (intencional). |
| CU-10 | robots.txt sin datos sensibles | `User-agent: * Allow: /` + sitemap; sin rutas privadas. |

---

## D. Hallazgos confirmados

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

### D.2 — Ausencia de cabeceras de seguridad HTTP (confirmado, configuración)

**Severidad:** medio.  
**Estado:** confirmado por inspección de `public/.htaccess` y `src/layouts/Layout.astro`.

**Evidencia:**
- `public/.htaccess` define únicamente `ErrorDocument 404/500`, `DirectoryIndex index.html` y una regla de barra final (`R=301`). **Ausentes:** `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- `src/layouts/Layout.astro` no establece cabeceras mediante `<meta http-equiv>` ni configuración de servidor.

**Riesgo:** sin HSTS el navegador acepta conexiones HTTP (downgrade); sin CSP hay mayor superficie para XSS e inyección de recursos; sin `X-Content-Type-Options` existe riesgo de MIME-sniffing; sin `X-Frame-Options` posible clickjacking.

**Impacto:** medio (explotación depende de otros vectores; HSTS es crítico si el sitio sirve por HTTPS).

**Recomendación:** agregar cabeceras de seguridad en `.htaccess` (servidor Hostinger/LiteSpeed) y/o mediante middleware de Astro; incluir `Content-Security-Policy` restrictiva, `Strict-Transport-Security` (si HTTPS está activo), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`/`SAMEORIGIN`, `Referrer-Policy: no-referrer`. (Solo recomendación; no se implementó.)

---

### D.3 — Exposición de la URL del CMS al bundle del cliente (confirmado, frontend)

**Severidad:** bajo-medio.  
**Estado:** confirmado por inspección de código; `import.meta.env.*` se inlina al cliente en builds de Astro/Vite.

**Evidencia:** `import.meta.env.WORDPRESS_URL` aparece en:
- `src/components/layout/Seo.astro:36` (`originOf(import.meta.env?.WORDPRESS_URL)`)
- `src/pages/_blog/index.astro:18` y `src/pages/[locale]/_blog/index.astro:18` (`baseUrl`)
- `src/components/blog/BlogArticleView.astro:57` (`wpApiUrl`)
- `src/lib/wordpress/menu.ts:208`, `src/lib/wordpress/legal.ts:109`

**Riesgo:** se revela al cliente la URL interna del CMS WordPress (información de infraestructura, surface de reconocimiento). Las credenciales `POSTMAN_APP_*` no llegan al cliente para el submit del formulario (resuelto en servidor), pero `WORDPRESS_URL` sí viaja al bundle.

**Impacto:** bajo (divulgación de información; no expone credenciales directamente).

**Recomendación:** evitar leer `import.meta.env.WORDPRESS_URL` en componentes que se emiten al cliente; resolver orígenes en el servidor (getStaticPaths/request) y pasar solo lo necesario como prop. (Solo recomendación.)

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

### D.6 — Endpoint de usuarios de WordPress expuesto (potencial, WordPress REST API)

**Severidad:** medio (potencial).  
**Estado:** potencial; ruta definida pero no se confirma uso ni estado en WordPress.

**Evidencia:** `src/lib/wordpress/routes.ts:121`: `user: (userId) => /wp/v2/users/${userId}`. El endpoint `/wp/v2/users` está expuesto por defecto en WordPress y permite enumeración de usuarios si no se restringe.

**Riesgo:** enumeración de nombres de usuario, ataques de fuerza bruta contra cuentas de administración.

**Impacto:** medio (requiere acceso a WP para confirmar si el endpoint está restringido).

**Recomendación:** verificar en WordPress que `/wp/v2/users` esté deshabilitado o restringido a autenticados; no usar el endpoint desde el frontend salvo necesario. (Solo recomendación; no se verificó por falta de acceso a WP.)

---

### D.7 — XML-RPC no evaluado (requiere acceso a WordPress)

**Estado:** requiere acceso adicional. No hay referencia en el repositorio; la habilitación/deshabilitación de `xmlrpc.php` es una configuración del servidor WordPress.

---

## E. Riesgos potenciales

| ID | Riesgo | Ubicación | Contexto de explotación | Recomendación |
|---|---|---|---|---|
| RP-01 | No hay forzado HTTPS ni HSTS a nivel de servidor | `public/.htaccess`, Hostinger/LiteSpeed | Si se accede por HTTP, credenciales de sesión/cookies viajan en claro; downgrade. El repo no controla el servidor. | Configurar redirect HTTP→HTTPS y HSTS en el servidor de hosting. |
| RP-02 | CORS no definido en el repositorio | WordPress REST API (servidor) | Si WordPress permite CORS abierto, sitios externos podrían leer endpoints públicos. | Revisar CORS de WordPress (requiere acceso a WP/servidor). |
| RP-03 | Endpoint `/wp/v2/users` expuesto | `src/lib/wordpress/routes.ts:121` | Enumeración de usuarios si WordPress no lo restringe. | Deshabilitar o restringir `/wp/v2/users` en WordPress. |
| RP-04 | Información de diagnóstico expuesta en 500 | `src/pages/500.astro:144` (`EVENT_REF`, `DISPATCH_ID`) | Divulgación leve de IDs internos al usuario final. | Revisar si estos valores son sensibles; evitar exponerlos en producción. |
| RP-05 | Sitemap expone URLs públicas | `robots.txt`, `sitemap-index.xml` | Reconocimiento de estructura del sitio (normal en sitios públicos). | No aplicar a URLs públicas; considerar excluir rutas internas si las hubiera. |
| RP-06 | Sin Subresource Integrity en recursos externos | `src/layouts/Layout.astro:61-66` (Google Fonts) | Si el CDN de fuentes es comprometido, se podría ejecutar CSS/JS malicioso. | Agregar `integrity`/`crossorigin` a recursos externos críticos. |

---

## F. Observaciones

| ID | Observación | Ubicación |
|---|---|---|
| OB-01 | CI solo se ejecuta en push/PR a `staging` y `main`; los PR de tarea a `develop` no disparan CI según los workflows actuales. | `.github/workflows/ci.yml` |
| OB-02 | El entorno local/DEV usa HTTP (`gussware.local`); HTTPS solo en staging/producción (definido en `.env.staging`/`.env.production`, no versionados). | `.env.example`, `tests/environments.test.mjs` |
| OB-03 | `WP_BUILD_STRICT=false` degrada fallos de WordPress a advertencia; documentado como exclusivo para builds offline, nunca CI ni despliegue. | `astro.config.mjs` |
| OB-04 | La página 500 expone `EVENT_REF` / `DISPATCH_ID` (diagnóstico interno). | `src/pages/500.astro:144` |

---

## G. Limitaciones y pruebas no ejecutadas

| # | Prueba / aspecto | Por qué no se ejecutó |
|---|---|---|
| L-1 | Verificación real de HTTPS/SSL (certificado, validez, renovación) | No hay acceso a los entornos staging/producción desde este entorno; las URLs son `https://` en `.env.staging`/`.env.production` pero no se pueden consultar. Es una prueba contra infraestructura ajena. |
| L-2 | Redirect HTTP → HTTPS en servidor | El servidor web (Hostinger/LiteSpeed) no está bajo control del repositorio; `.htaccess` no lo define. Requiere acceso al hosting. |
| L-3 | Estado real de cabeceras HTTP en producción (CSP, HSTS, etc.) | No se puede hacer `curl` contra `gussware.dev`/`staging.gussware.dev` sin credenciales de acceso y sería una prueba contra producción (fuera de alcance de auditoría de solo lectura sobre el repositorio). |
| L-4 | XML-RPC habilitado/deshabilitado | Configuración de WordPress/servidor; no hay acceso a WP admin ni a `xmlrpc.php`. |
| L-5 | CORS real de WordPress REST API | Configuración del servidor WordPress; no verificable desde el frontend. |
| L-6 | Usuarios, roles y contraseñas de WordPress | Requiere acceso a WP admin; fuera del alcance del repositorio frontend. |
| L-7 | Pruebas intrusivas / denegación de servicio / extracción de datos | Expressamente prohibido por la tarjeta RGW-353 ("No realizar explotación destructiva..."). |
| L-8 | `npm audit fix` / actualización de dependencias | Prohibido (no modificar dependencias); solo se documentó el estado de `npm audit`. |
| L-9 | Pruebas contra el sitio desplegado (producción/staging) | No autorizado; el alcance del repositorio es de lectura. La suite `contact.test.mjs` requiere un servidor de desarrollo activo y `WORDPRESS_URL`, no disponibles en este worktree sin `.env`. |

Nota: las pruebas unitarias del proyecto sí se ejecutaron (`npm test` sobre `environments.test.mjs` y `cta-navigation.test.mjs`: 41 pass, 0 fail, 1 skip por ausencia de `.env` local). `npm run lint` falló porque ESLint reportó versión 6.4.0 sin configuración flat (`eslint.config.js` requiere ESLint 9+); esto es una observación de configuración de tooling, no un hallazgo de seguridad de la aplicación.

---

## H. Resumen priorizado de riesgos

| Prioridad | ID | Título | Severidad | Tipo |
|---|---|---|---|---|
| 1 | D.1 | Vulnerabilidades en dependencias (7 high, 13 moderate) | High/Moderate | Dependencias |
| 2 | D.4 | Inyección de HTML sin sanitizar vía `set:html` (XSS potencial) | Medio-alto | Frontend / XSS |
| 3 | D.2 | Ausencia de cabeceras de seguridad (CSP, HSTS, etc.) | Medio | Configuración / Cabeceras |
| 4 | D.5 | Formulario sin CSRF ni rate limiting/CAPTCHA | Medio | Formulario / Abuso |
| 5 | D.3 | Exposición de `WORDPRESS_URL` al bundle del cliente | Bajo-medio | Secretos / Datos |
| 6 | D.6 | Endpoint `/wp/v2/users` de WordPress expuesto (potencial) | Medio | WordPress / API |
| 7 | RP-01..RP-06 | Riesgos potenciales (HTTPS forzado, CORS, SRI, diagnóstico 500, sitemap, XML-RPC) | Medio/bajo | Infraestructura / Configuración |

---

## I. Plan recomendado de remediación (no implementado en esta tarea)

1. Ejecutar `npm audit fix` y actualizar dependencias vulnerables (astro, @astrojs/node, undici, zod, vite, brace-expansion, source-map-js), probando compatibilidad y build.
2. Sanitizar HTML antes de `set:html` o restringir campos inyectados crudo (mitigar XSS).
3. Agregar cabeceras de seguridad en `.htaccess` (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy).
4. Revisar y endurecer el formulario de contacto: protección contra abuso (rate limiting/CAPTCHA/honeypot) y validación CSRF en el endpoint de WordPress.
5. Evitar inlina `WORDPRESS_URL` al cliente; resolver orígenes en servidor.
6. Verificar en WordPress: `/wp/v2/users` restringido, XML-RPC deshabilitado si no se usa, CORS adecuado.
7. Configurar en el servidor de hosting: redirect HTTP→HTTPS y HSTS.
8. Agregar `integrity` a recursos externos (Google Fonts).
9. Revisar exposición de `EVENT_REF`/`DISPATCH_ID` en la página 500.

> Ninguno de los puntos anteriores se implementó como parte de esta tarea (auditoría de solo lectura).

---

## J. Evidencias, limitaciones y conclusión

**Evidencias recogidas:**
- Tarjeta Jira RGW-353 (objetivo, alcance, restricciones, criterios de aceptación).
- Código fuente revisado: `astro.config.mjs`, `src/lib/wordpress/{client,routes,favicon,logo,menu,legal,seo}.ts`, `src/lib/contact/{schema,forms,submit}.ts`, `src/components/contact/ContactForm.astro`, `src/layouts/Layout.astro`, `src/pages/{index,[...uri],404,500}.astro`, `public/.htaccess`, `.env.example`, `.gitignore`, `.github/workflows/{ci,deploy-reusable}.yml`, `package.json`, `tests/environments.test.mjs`, `tests/cta-navigation.test.mjs`.
- `npm audit --audit=moderate`: 20 vulnerabilidades (7 high, 13 moderate), todas con fix disponible.
- Pruebas unitarias ejecutadas: 41 pass, 0 fail, 1 skip (`environments.test.mjs`, `cta-navigation.test.mjs`).

**Limitaciones:** ver sección G (no se pudo verificar HTTPS real, cabeceras en producción, XML-RPC, CORS de WP, usuarios/roles; no se hicieron pruebas intrusivas ni se aplicaron correcciones).

**Conclusión:** el sitio tiene controles de base adecuados (secretos fuera del repo, CI sin `.env`, formulario validado, build con guarda de WordPress), pero requiere remediación de vulnerabilidades en dependencias, cabeceras de seguridad, sanitización de `set:html` y protección del formulario. Ningún hallazgo fue explotado; todos son documentados con evidencia verificable.

**Ubicación del informe:** `docs/audits/security-technical-audit.md` (rama `fix/RGW-353-auditoria-seguridad`).

**No se realizaron cambios** de código, configuración, dependencias ni infraestructura, conforme a la tarjeta RGW-353.

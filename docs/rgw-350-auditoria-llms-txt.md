# RGW-350 — Auditoría y optimización de `llms.txt`

- **Tarjeta:** RGW-350 — Auditar y optimizar `llms.txt` para sistemas de IA
- **Épica:** RGW-342 — SEO
- **Fecha de auditoría:** 2026-11-21
- **Base auditada:** `origin/develop` en `f58352a`
- **Sitios comprobados:** producción (`https://gussware.dev/`) y staging (`https://staging.gussware.dev/`)
- **Alcance:** ubicación y respuesta HTTP, formato, contenido, inventario público, URLs canónicas, versión ES/EN, decisión sobre `llms-full.txt`, mantenimiento y validaciones.

## 1. Estado inicial y hallazgos

| Comprobación                                 | Resultado                                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Archivo versionado                           | No existía `public/llms.txt` ni una ruta de Astro que publicara `/llms.txt`.              |
| Referencias en código o documentación        | No había referencias a `llms.txt` en el repositorio.                                      |
| `GET https://gussware.dev/llms.txt`          | `404`, servido como la página HTML de error del sitio.                                    |
| `GET https://staging.gussware.dev/llms.txt`  | `404`, servido como la página HTML de error del sitio.                                    |
| `GET https://gussware.dev/robots.txt`        | `200`, `Content-Type: text/plain`; declara `https://gussware.dev/sitemap-index.xml`.      |
| `GET https://gussware.dev/sitemap-index.xml` | `200`, `Content-Type: application/xml`; referencia `sitemap-0.xml`.                       |
| Sitemap público                              | Contiene 23 páginas HTML reales; no contiene blog, proyectos ni la fixture de navegación. |

La ausencia del archivo era el problema principal. La optimización crea una referencia estática y curada en la ubicación pública esperada, sin introducir un servicio externo, una dependencia, un CMS adicional ni una generación automática.

### Hallazgos que condicionaron el inventario

1. **Contacto duplicado en español:** `/contact/` y `/contacto/` sirven contenido equivalente y ambos aparecen en el sitemap. La interfaz, los CTA y `hreflang` usan `/contacto/`; por ello el inventario público de `llms.txt` prefiere `/contacto/` y omite `/contact/`. `/contact/` no es una URL inexistente ni redirige: es un duplicado público que se deja fuera de la selección curada.
2. **Rutas todavía no publicadas:** `/blog/`, `/en/blog/`, `/proyectos/` y `/en/proyectos/` devuelven `404`. Las carpetas Astro de blog y proyectos están desactivadas con el prefijo `_`, así que no se incluyen.
3. **Fixture de pruebas:** `/navfixturetest/` se excluye del sitemap y del build de producción mediante el mecanismo de RGW-361, pero continúa respondiendo `200` en producción por un artefacto remoto residual. No es contenido público y no se enlaza.
4. **Contenido legal incompleto:** `/en/term-of-service/` indica que su traducción está pendiente; `/en/privacy-policy/` conserva campos sin completar; `/terminos-y-condiciones/` contiene dos variables sin resolver. Estas páginas sí son públicas y canónicas, por lo que se enlazan con descripciones neutras, sin afirmar que su texto esté completo. La corrección de esos contenidos pertenece al trabajo editorial/legal y queda fuera de RGW-350.
5. **Ruta de servicios en inglés:** la URL pública real es `/en/servicios/`; no existe `/en/services/`.

## 2. Formato adoptado

La referencia auditada es la versión 2 de la propuesta publicada en <https://llmstxt.org/> (publicada el 2024-09-03, modificada el 2026-08-10, consultada el 2026-11-21). Es una convención propuesta, no un estándar universal, un requisito de los motores de búsqueda ni una garantía de indexación, posicionamiento o inclusión en respuestas de IA.

Convenciones aplicadas:

- Markdown publicado en la raíz del sitio (`/llms.txt`).
- Un único título `H1` con el nombre del sitio.
- Un único `blockquote` con un resumen breve en español e inglés.
- Información introductoria sin encabezados antes de las listas de archivos.
- Secciones `H2`; cada una contiene únicamente entradas `- [Título](URL): descripción`.
- URLs absolutas del dominio público, sin parámetros, fragmentos ni credenciales.
- Contenido conciso y curado, pensado para que un agente localice la página relevante y solicite después su detalle.

Decisiones y adaptaciones:

- No se usan subtítulos `H3`. La propuesta define las listas de archivos mediante secciones `H2`; separar los servicios por idioma con dos secciones `H2` mantiene un formato portable y parseable.
- No se crea una sección `Optional`: todas las entradas son referencias principales del sitio.
- La versión 2 recomienda que los enlaces apunten a contenido Markdown-friendly. El sitio no publica variantes `.md` de sus páginas, por lo que este archivo enlaza sus páginas HTML canónicas. Generar y mantener esas variantes requiere una estrategia de render y publicación que no existe en el proyecto y no forma parte de esta tarjeta.
- El resumen bilingüe se mantiene en una sola cita para que un lector que consuma únicamente el campo `summary` no pierda la versión inglesa.

## 3. Implementación

### `public/llms.txt`

Es la ubicación fuente correcta para Astro: los archivos de `public/` se copian sin transformación al artefacto estático y quedan disponibles en `/llms.txt`. El archivo contiene 24 enlaces:

- 2 portadas: `/` y `/en/`.
- 2 índices de servicios: `/servicios/` y `/en/servicios/`.
- 12 detalles de servicio: 6 en español y 6 en inglés.
- 2 páginas de contacto: `/contacto/` y `/en/contact/`.
- 4 páginas legales: privacidad y condiciones en español e inglés.
- 2 recursos técnicos: `sitemap-index.xml` y `robots.txt`.

Los enlaces usan siempre `https://gussware.dev/`, incluso en staging. Es deliberado: un archivo desplegado en staging no debe presentar dominios de entorno temporal como referencias canónicas.

### `.prettierignore`

Se agrega `public/llms.txt` porque Prettier no puede inferir un parser para la extensión `.txt`; el contenido sí sigue las convenciones Markdown de la propuesta. No se excluyen otros archivos del repositorio.

### `tests/rgw-350-llms-txt.test.mjs`

La prueba automatiza el contrato y evita regresiones de formato e inventario:

- respuesta `200` y `Content-Type: text/plain`;
- un `H1`, un resumen y solo secciones `H2`;
- cada sección contiene exclusivamente enlaces con descripción;
- conjunto exacto de 24 URLs absolutas de producción, sin duplicados;
- forma canónica de las páginas y exclusión de rutas no publicadas, internas o duplicadas;
- respuesta `200` y canonical propio de las 22 páginas;
- publicación de `sitemap-index.xml` y `robots.txt`;
- conciliación de las páginas del archivo con `sitemap-0.xml`, salvo el duplicado `/contact/`.

La prueba requiere que el preview de Astro esté activo. En CI se levanta con `astro preview` antes de ejecutar `npm test`.

## 4. Fuentes y comprobación de URLs

### Fuentes del inventario

1. Sitemaps públicos de producción y staging:
   - <https://gussware.dev/sitemap-0.xml>
   - <https://staging.gussware.dev/sitemap-0.xml>
2. API REST pública de WordPress, para contrastar servicios, páginas y estados de publicación:
   - `/wp/v2/pages`
   - `/wp/v2/services`
   - `/wp/v2/projects`
   - `/wp/v2/posts`
3. HTML publicado de cada ruta, para comprobar `<link rel="canonical">`, idioma y metadatos.
4. Generadores y reglas de i18n del proyecto:
   - `src/pages/index.astro`
   - `src/pages/[...uri].astro`
   - `src/pages/servicios/index.astro`
   - `src/pages/servicios/[slug].astro`
   - `src/pages/[locale]/servicios/index.astro`
   - `src/pages/[locale]/servicios/[slug].astro`
   - `src/pages/contact.astro`
   - `src/lib/wordpress/routes.ts`
   - `src/lib/wordpress/languages.ts`
   - `src/lib/cta.ts`
   - `astro.config.mjs`
   - `public/.htaccess`

### Comprobación externa

Se hizo un `GET` sin seguimiento de redirecciones a las 24 URL incluidas:

- las 24 respondieron `200`;
- las 22 páginas HTML declararon una URL canonical igual a la URL enlazada;
- `sitemap-index.xml` y `robots.txt` respondieron `200` y son sus propias rutas públicas;
- los controles `/blog/`, `/en/blog/`, `/proyectos/` y `/en/proyectos/` respondieron `404` y no están incluidos.

Para repetir la comprobación de disponibilidad:

```bash
grep -oE '\]\(https://[^)]+\)' public/llms.txt \
  | sed -E 's/^\]\(//; s/\)$//' \
  | while read -r url; do
      printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$url")" "$url"
    done
```

Todos deben devolver `200`.

## 5. Decisión sobre `llms-full.txt`

**No se crea `llms-full.txt`.** Justificación:

- El contenido público ya está disponible en las páginas HTML enlazadas; duplicarlo completo aumentaría tamaño, mantenimiento y riesgo de divergencia sin una necesidad demostrada.
- La tarjeta prohíbe duplicar indiscriminadamente el contenido completo del sitio.
- No existe una estrategia automática de regeneración, revisión ni publicación que mantenga un volcado sincronizado con WordPress.
- El blog y los proyectos todavía no están publicados; no hay documentación técnica pública extensa que justifique un volcado separado.

Se reconsiderará solo cuando exista contenido público extenso y estable y se defina una estrategia automática de regeneración y mantenimiento. Mientras tanto, `llms.txt` funciona como índice curado y `sitemap-0.xml` como inventario completo de URLs HTML.

## 6. Mantenimiento

- **Responsable técnico:** los mantenedores del repositorio GussWare Site, responsables del artefacto Astro y de `tests/rgw-350-llms-txt.test.mjs`.
- **Responsable editorial:** el responsable de contenido/SEO del sitio, que revisa títulos, descripciones y selección de páginas. No existe una persona nominal ni una regla `CODEOWNERS`; el cambio de rutas públicas debe quedar siempre asociado a la tarea que lo introduce.
- **Ubicación:** `public/llms.txt`.
- **Revisión obligatoria:** al cambiar una ruta pública, publicar o retirar un servicio, una página, el blog o proyectos, cambiar un slug, el dominio, la estructura de idiomas o una URL legal.
- **Control periódico:** contrastar el inventario con el sitemap y la API de WordPress durante la revisión trimestral del sitio y antes de publicar un release que pueda haber alterado contenido público.

Procedimiento:

1. Contrastar el inventario con `sitemap-0.xml` y la API de WordPress.
2. Revisar las rutas preferidas frente a duplicados, aliases y páginas aún no publicadas.
3. Editar `public/llms.txt` conservando `H1`, un único resumen y listas `H2` con enlaces absolutos y descripciones.
4. Ejecutar `npm run lint`, el build, el preview y `npm test` con la variable `BASE_URL` apuntando al preview.
5. Después del despliegue, repetir el `GET` de las 24 URL y comprobar los canonical.
6. Actualizar la fecha de revisión del archivo y de este informe.

## 7. Validaciones

| Validación                     | Resultado                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Lint del repositorio           | `npm run lint`: correcto.                                                                                             |
| Formato de los archivos nuevos | Prettier sobre el informe y la prueba: correcto.                                                                      |
| Build estático                 | `npm run build -- --mode production`: correcto; `dist/llms.txt` generado.                                             |
| Publicación local              | `astro preview`: `/llms.txt` responde `200` con `Content-Type: text/plain`.                                           |
| Prueba específica              | `node --test tests/rgw-350-llms-txt.test.mjs`: 10 pruebas correctas.                                                  |
| Suite completa                 | `npm test` contra el preview: 158 pruebas, 157 correctas, 1 omitida y 0 fallidas.                                     |
| Parser de referencia           | El archivo se validó con el parser oficial de `llms-txt` v2: título, resumen y cinco secciones parseadas sin errores. |
| Inventario externo             | 24 URL con `200`; 22 canonicals coincidentes; controles no publicados con `404`.                                      |

## 8. Limitaciones y pendientes

- `llms.txt` es un archivo estático y versionado: no se regenera automáticamente desde WordPress. La prueba detecta cambios en el sitemap del build, pero la revisión editorial sigue siendo necesaria.
- Los enlaces apuntan a páginas HTML canónicas porque aún no existen variantes Markdown de las páginas. Una futura estrategia `.md` deberá evaluar también las relaciones `rel="alternate"` y `rel="describedby"` de la versión 2.
- El contenido legal pendiente y la fixture remota residual no se modificaron porque no pertenecen al alcance de RGW-350; quedan identificados para sus responsables.
- `llms.txt` no garantiza indexación, posicionamiento ni inclusión en respuestas de IA; es una guía para agentes.
- Esta tarea no despliega a producción. La publicación requiere el flujo habitual y aprobación del entorno.
- Las comprobaciones externas se ejecutaron el 2026-11-21; una caída o un cambio posterior de slug exige repetirlas.

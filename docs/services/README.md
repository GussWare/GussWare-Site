# Pantallas de servicio — versión actual (Stitch)

Referencia de las **6 pantallas de detalle de servicio** que quedan vigentes en el proyecto de
Stitch **GussWare Design System** (`projects/2794415955264565177`).

Se guardó la **estructura** (plantilla, contenedores, grids, tokens) y el **contenido**
(textos, listas, enlaces y destinos) completos, para poder rediseñar las pantallas sin perder
el copy aprobado ni la maqueta validada.

> Origen: los HTML se descargaron directamente de Stitch (`projects/{id}/screens/{id}`) el
> **20 de octubre de 2026**, después de homologar la sección de FAQ en las seis pantallas.
> No se modificó ningún texto: es una fotografía del estado actual.

---

## Inventario

| Archivo | Qué contiene |
|---|---|
| `README.md` | Este índice, el estado actual y el método de extracción |
| `estructura.md` | Anatomía de la plantilla común: bloques, contenedores, grids, tokens y diferencias entre las 6 |
| `contenido.md` | Todo el copy de las 6 pantallas, sección por sección, con sus enlaces y destinos |
| `componentes/faq.md` | Especificación del componente de preguntas frecuentes (homologado en las 6) |
| `componentes/como-trabajamos.md` | Especificación del componente de proceso (homologado, versión oficial) |
| `prompts/` | **Prompts de diseño por servicio.** `prompts/diseno-sitios-web-tiendas-en-linea.prompt.md` es la plantilla oficial de ejecución |
| `estructura.json` | Los mismos datos en formato legible por máquina |
| `html/<slug>.html` | HTML completo y original de cada pantalla — **fuente de verdad** |
| `acf/payloads-servicios-stitch.json` | Payload final escrito en los ACF de los 6 servicios (origen Stitch + 2 correcciones del v4) |

---

## Las 6 pantallas vigentes

Todas las 6 están rediseñadas con el sistema de tokens del proyecto («Tokens Oficiales») y
son la referencia vigente. IDs leídos del proyecto de Stitch
`2794415955264565177` («GussWare Design System») el 21-oct-2026.

| Servicio | Pantalla en Stitch | ID de pantalla | Post WP (ES) |
|---|---|---|---|
| Integración de APIs y Servicios Externos | GussWare Service Detail - Integración de APIs y Servicios Externos (Tokens Oficiales) | `454f096230174de285a70db168b19373` | 497 |
| Diseño de sitios web y tiendas en línea | GussWare - Diseño de sitios web y tiendas en línea (Tokens Oficiales) | `3570bdd8914b400590a34b1a1dd6a9f6` | 525 |
| Aplicaciones Móviles | GussWare Service Detail - Aplicaciones móviles (Tokens Oficiales) | `ab2a94c1475648728b54e35aac22219e` | 527 |
| Desarrollo a medida | GussWare Service Detail - Desarrollo a medida (Tokens Oficiales) | `2d12b7febe7442d881c4a47a7dc42484` | 529 |
| DevOps y Soporte Técnico | GussWare Service Detail - DevOps y Soporte Técnico (Tokens Oficiales) | `064777d861154a52b3f5936737c29847` | 531 |
| Consultoría Técnica | GussWare Service Detail - Consultoría Técnica (Tokens Oficiales) | `4389f260009049018896152d52800522` | 523 |

El HTML vivo de cada pantalla se descarga desde
`GET /v1/projects/{id}/screens/{screenId}` → `htmlCode.downloadUrl`.

### Bloques por servicio

| Servicio | Problema | Soluciones | Plataformas | Proceso | Ficha técnica | FAQ | Cierre | Relacionados |
|---|---|---|---|---|---|---|---|---|
| Integración | 01 | 02 | **03** | 04 | — | 05 | 06 | ✓ |
| Web | 01 | 02 | — | 03 | 04 | 05 | 06 | ✓ |
| Móviles | 01 | 02 | — | 03 | 04 | 05 | 06 | ✓ |
| A medida | 01 | 02 | — | 03 | 04 | 05 | 06 | ✓ |
| DevOps | 01 | 02 | — | 03 | 04 | 05 | 06 | ✓ |
| Consultoría | 01 | 02 | — | 03 | 04 | 05 | 06 | ✓ |

La numeración de los eyebrows (`NN — ETIQUETA`) se recalcula por servicio según qué bloques
existen.

---

## Estado de homologación

| Bloque | Estado | Nota |
|---|---|---|
| Hero | 6 diseños distintos | Eyebrow, H1, lead, 2 CTAs y 3 indicadores; grillas y classes varies |
| Problema (01) | 6 diseños distintos | Mismo patrón de lista numerada, distinta composición interna |
| Soluciones (02) | 6 diseños distintos | 3 tarjetas en 4 servicios, 2 tarjetas en Consultoría y Móviles |
| Plataformas (03) | Solo Integración | Bloque exclusivo de ese servicio |
| **Cómo trabajamos** | **Homologado** | **Tarjeta blanca con borde y marcador blanco** (ver `componentes/como-trabajamos.md`) |
| Ficha técnica (04) | 6 diseños distintos | Solo en los 5 servicios sin bloque de plataformas |
| **FAQ (05)** | **Homologado** | **Mismo diseño y mismo markup en las 6** (ver `componentes/faq.md`) |
| Cierre / CTA (06) | 6 diseños distintos | Fondo azul profundo, título, párrafo y 2 enlaces |
| Servicios relacionados (07) | 6 diseños distintos | 3 tarjetas con enlace «Ver servicio →» |

**Pendiente de homologar** (además de la FAQ y «cómo trabajamos», ya resueltas): hero, problema,
soluciones, ficha técnica, CTA y servicios relacionados. La sección de fichas técnicas tiene
además 4 títulos distintos («Ficha del proyecto», «Enfoque técnico», «Capacidades del sistema»,
«Qué cubrimos», «Marco de trabajo»).

---

## Método de extracción

1. `GET /v1/projects/{id}/screens/{id}` → `htmlCode.downloadUrl` por cada pantalla.
2. Descarga del HTML original (sin transformar).
3. Parser local que separa `<body>` en `<section>` de primer nivel y extrae, por sección:
   `class` del contenedor, clases de grid, y la lista ordenada de `h1/h2/h3/h4/p/a/li/span`
   con su texto y su `href`.
4. Tokens leídos del `tailwind.config` embebido en cada `<head>`.

El parser y su salida están en `estructura.json`; el script usado quedó en `/tmp` y no forma
parte del repositorio porque no hay código de aplicación implicado.

---

## Importación del contenido a WordPress

El contenido de las 6 pantallas vigentes se importó a los ACF del CPT `service` (posts ES
publicados) mediante `PATCH /wp/v2/services/{id}` con el campo `acf` (payload anidado por
sección). El payload exacto está en `acf/payloads-servicios-stitch.json`.

### Criterio de origen

1. **Base: Stitch.** Todo el copy sale del HTML vivo de cada pantalla (1:1), incluidos los
   eyebrows numerados (`01 — EL PROBLEMA`), las etiquetas de la ficha técnica, las URLs de
   servicios relacionados y las categorías.
2. **Correcciones del v4 aplicadas** (documentadas en `docs/servicios-v4/…`, §2.5 y §4):
   - `problema.development_content`: los prompts de Stitch dejaron el párrafo truncado en la
     primera frase; se escribe el párrafo completo del v4 (el v4 indica «se conserva el
     párrafo»).
   - Integración, plataforma «Microsoft 365»: el mock dice «con tu CRM»; el v4 lo corrige a
     «con otros sistemas». **La pantalla de Stitch aún muestra la redacción antigua.**
3. **FAQ:** Stitch solo trae la primera respuesta desplegada (las demás no están en el DOM);
   las respuestas se toman del v4. Las 6 preguntas coinciden al 100 % entre Stitch y v4.
4. **Secciones no usadas:** los bloques opcionales se escriben vacíos con su interruptor en
   `0` (`platforms_enabled`, `tech_enabled`). En Integración la ficha técnica se conserva con
   `tech_enabled = 0` porque el diseño no la muestra y el campo `tech_groups` exige ≥ 1 fila.

### Pendiente

- Las **traducciones EN** (posts 524, 526, 528, 530, 532, 533) siguen en `draft` con el copy
  v3: el v4 declara que «las traducciones al inglés no están aprobadas» y Stitch solo tiene
  pantallas en español.
- El **sitio Astro** no renderiza todavía los bloques «¿Te pasa esto?», «Plataformas» y
  «Servicios relacionados», y no consulta `tech_enabled` para la ficha técnica.

---

## Nota de rutas

Los `href` que aparecen en el contenido **no están unificados**. Hoy conviven:

- `/contact` (Integración, DevOps, Consultoría) y `/contacto` (Web, Móviles, A medida)
- `/servicios` (Integración, Web, Móviles), `/services` (DevOps, Consultoría) y `#servicios` (A medida)
- `#soluciones` como ancla interna en lugar de ruta
- `/servicios/...` en A medida y Consultoría, frente a `/services/...` en DevOps
- La referencia móvil y la versión EN usan su propio prefijo de idioma

La unificación de rutas está **pendiente de aprobación** y no se aplicó en esta documentación.
En la importación a WordPress se conservaron los `href` tal como aparecen en Stitch.

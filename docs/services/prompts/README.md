# Prompts de pantallas de servicio

Un prompt por cada pantalla de detalle de servicio. Cada prompt es una **especificación
ejecutable**: describe la estructura precisa (tokens, rejilla, espaciado, markup interno de cada
bloque) y el contenido exacto que va en cada sección.

| Archivo | Servicio | Estado |
|---|---|---|
| [`integracion.md`](integracion.md) | Integración de APIs y Servicios Externos | **v3 · especificación completa** (documentación) |
| [`integracion.prompt.md`](integracion.prompt.md) | Integración de APIs y Servicios Externos | **v3 · prompt pegable** |
| [`diseno-sitios-web-tiendas-en-linea.prompt.md`](diseno-sitios-web-tiendas-en-linea.prompt.md) | Diseño de sitios web y tiendas en línea | **v2 · prompt pegable · PLANTILLA OFICIAL** |

### Dos archivos por servicio

- `*.md` — la **especificación** completa: reglas, tablas, alternativas y el detalle de por qué
  cada decisión. Es la documentación y la plantilla de la que se derivan los demás.
- `*.prompt.md` — el **prompt ejecutable**: el texto que se pega en Stitch, sin explicaciones
  alrededor. Es lo que se usa para generar.

### Plantilla oficial

**El prompt de Web es la plantilla oficial** (`diseno-sitios-web-tiendas-en-linea.prompt.md`).
Fue el primero en generarse con el sistema de tokens y es el que fija el resultado de referencia
del bloque de proceso.

Al comparar las dos primeras pantallas generadas, la sección **«Cómo trabajamos»** había salido
distinta en cada una (tarjeta blanca con borde y marcador blanco en Web; texto suelto y marcador
gris en Integración). Se adoptó la de Web como oficial y se corrigió la pantalla de Integración.
La corrección quedó fijada en los dos prompts y documentada en
[`../componentes/como-trabajamos.md`](../componentes/como-trabajamos.md).

## Convenciones

- **Nombre de archivo:** el *slug* del servicio en el CPT (`integracion.md`,
  `consultoria-tecnica.md`, `aplicaciones-moviles.md`, …).
- **Plantilla:** `diseno-sitios-web-tiendas-en-linea.prompt.md` es la plantilla oficial de
  ejecución. `integracion.md` es la especificación maestra con el detalle de cada decisión.
- **Alcance:** solo pantallas de detalle de servicio. Ningún prompt de este directorio debe
  tocar Home, Proyectos, Blog, Comunidad, Login, Registro, errores, legales, contacto, header,
  footer ni el design system.
- **Versionado:** cuando un prompt cambie, se sube la versión en la línea *Estado* del README de
  esta carpeta y se anota el cambio.

## Requisito de tokens

Todo prompt de este directorio **debe usar el sistema de tokens y colores de marca ya existente
en el proyecto**, nunca valores hex literales:

- Tokens base: `src/styles/tokens/` (`brand.css`, `supporting.css`, `semantic.css`,
  `typography.css`, `spacing.css`, `shape.css`, `layout.css`).
- Mapeo a Tailwind: `src/styles/theme.css`.
- Clases resultantes: `bg-brand-primary`, `text-gw-text-primary`, `border-gw-border-subtle`,
  `bg-gw-surface-secondary`, `bg-supporting-blue-dark`, `text-label-bold`, `text-headline-lg`,
  `text-body-md`, `max-w-[var(--container-max)]`,
  `py-[var(--section-padding-desktop)]`, `rounded-none`, `font-mono`.
- Componentes a reutilizar: `src/components/ui/` (`Container`, `Section`, `SectionHeading`,
  `Button`, `Link`, `Card`, `Badge`, `Breadcrumbs`) y `src/components/services/`.

La tabla de diferencias entre la maqueta de Stitch y el sistema de tokens está en
[`../estructura.md`](../estructura.md) §1.7 y en §1.7 de cada prompt.

## Qué está fijo y qué cambia

| Elemento | ¿Cambia por servicio? |
|---|---|
| Tokens de color, escala tipográfica, rejilla, espaciado, forma | **No** |
| Patrón de fondos de sección y orden de los bloques | **No** (salvo bloques ocultos) |
| Markup interno de cada bloque (hero, problema, soluciones, proceso, FAQ, cierre, relacionados) | **No** |
| Bloque de FAQ | **No** — ya homologado, es un componente reutilizable |
| Bloque de «Cómo trabajamos» | **No** — ya homologado, es un componente reutilizable |
| Bloque de plataformas | Solo donde aplique |
| Bloque de ficha técnica | Opcional por servicio |
| Textos, listas, numeraciones y enlaces | **Sí** |
| Rutas de enlace | Sí, siempre a rutas reales del sitio (§2.4 del prompt maestro) |

## Servicios pendientes de prompt

- [x] Integración de APIs y Servicios Externos (`integracion-de-apis-y-servicios-externos`)
- [x] Diseño de sitios web y tiendas en línea (`diseno-sitios-web-tiendas-en-linea`)
- [ ] Aplicaciones móviles (`aplicaciones-moviles`)
- [ ] Desarrollo a medida (`desarrollo-a-medida`)
- [ ] DevOps y Soporte Técnico (`devops-y-soporte-tecnico`)
- [ ] Consultoría técnica (`consultoria-tecnica`)

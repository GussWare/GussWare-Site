---

name: gussware-layout
description: Define las reglas de maquetación y estandarización visual del proyecto GussWare Site con Astro y Tailwind: reutilizar componentes UI existentes (Container, Section, SectionHeading, Card, Button y demás), composición de páginas, spacing con tokens, responsive mobile-first, jerarquía visual y criterios para crear nuevos componentes. Usar cuando una tarea implique maquetar, componer secciones o páginas, o crear o modificar componentes visuales.
---

# GussWare Layout

## Purpose

Estandarizar la maquetación del proyecto GussWare Site para que toda
sección y página nueva reutilice el sistema visual existente.

Este Skill controla únicamente decisiones de maquetación y
estandarización visual:

* Reutilización de componentes existentes (§1)
* Uso estandarizado de componentes UI (§2)
* Composición de páginas (§3)
* Spacing con tokens (§4)
* Responsive (§5)
* Jerarquía visual (§6)
* Criterios para crear nuevos componentes (§7)

El catálogo operativo (props y tokens) vive en
[reference.md](reference.md). Las reglas generales de desarrollo
permanecen en `AGENTS.md`. El flujo Git/Jira vive en el skill
`gussware-workflow`.

---

## 1. Primera regla: reutilizar antes de crear

Antes de maquetar cualquier sección o página:

1. Revisar el catálogo de componentes UI existentes
   (`src/components/ui/`, ver [reference.md](reference.md)).
2. Reutilizar el componente existente que cubra la necesidad, aunque
   requiera calibrarlo con sus props (`class`, variantes, tamaños).
3. Componer componentes existentes antes de crear uno nuevo (ejemplo:
   `CTA` compone `SectionHeading` + `Button`; `Card` compone `Badge` +
   `Image` + `Icon`).
4. Solo crear un componente nuevo cuando ninguno existente cubra la
   necesidad y se cumplan los criterios de §7.

No duplicar un componente existente con otro nombre, ni reimplementar
su estructura con clases sueltas en la página o sección consumidora.

---

## 2. Uso estandarizado de componentes UI

### Container

* Todo contenido de página va dentro de `Container` (directamente o
  vía `Section`, que ya lo integra).
* Ancho máximo 1280px, centrado horizontal, gutter responsive
  (16px mobile / 24px desde `md`).
* No sustituir la base con `class`: solo calibración aditiva.

### Section

* Cada bloque de página es un `Section`: aporta el spacing vertical
  del sistema (64px mobile / 120px desktop) y el `Container`.
* Usar `id` para anclas de navegación (`#servicios`, etc.).
* `Section` no impone colores, fondos ni tipografías: el tono visual
  lo define el contenido con tokens.
* No anidar `Section` dentro de `Section`.

### SectionHeading

* Encabezado estándar de sección: `eyebrow` opcional + `title`
  requerido + `description` opcional.
* `level` por defecto `h2`; usar `h1` solo para el título principal
  de la página (§6).
* `align` (`left` | `center`): el bloque centrado centra también las
  acciones que lo acompañen (patrón de `CTA`).

### Card

* Tarjeta editorial estándar: imagen (proporción `4/3` por defecto o
  altura fija), `Badge` en flujo sobre el título, título, descripción
  y metadatos o fila de enlace.
* Sin imagen se renderiza un bloque de maquetación: no inventar
  assets ni URLs de imagen.
* Con `href`, la tarjeta es navegable y el título alinea los enlaces
  abajo; sin `href`, no forzar comportamiento de enlace.
* El sistema usa capas tonales, no sombras: no agregar sombras.

### Button

* Acciones y envíos: `variant` (`primary` | `secondary` | `ghost`).
* Con `href` renderiza `<a>`; sin `href`, `<button>` con `type`.
* Para enlaces de texto o navegación usar `Link`, nunca `Button`.

### Demás componentes UI

* `Badge`: etiqueta única del sistema (una sola variante); no crear
  variantes de color o tamaño.
* `Breadcrumbs`: ruta de navegación (`items`); el último ítem sin
  `href` es la página actual. Convive como hermano sobre el
  encabezado, no dentro de él.
* `CTA`: composición de contenido (encabezado + fila de acciones con
  `Button`); `tone` (`light` | `dark`) según fondo; no duplicar
  botones fuera de `Button`.
* `Divider`: línea divisoria sin márgenes propios; el espaciado lo
  pone el contexto.
* `FormField`: campo de formulario (label + input underline + error
  opcional); no reinventar campos con markup suelto.
* `Image`: toda imagen de contenido pasa por `Image` (`src`/`alt`
  requeridos, proporciones y ajustes del sistema); las imágenes son
  URLs remotas (WordPress), sin integración nueva.
* `Link`: enlaces con variantes (`nav` | `body` | `accent`); siempre
  `<a>` semántico.
* `Icon`: catálogo cerrado de nombres con `size` del sistema; el
  color se hereda del texto. No agregar iconos fuera del catálogo
  salvo criterio de §7.

---

## 3. Composición de páginas

Estructura estándar:

```text
Layout (Header / main / Footer)
  └── main
      ├── Section (hero o encabezado de página)
      ├── Section (contenido)
      └── Section (CTA / cierre)
```

* Toda página usa `Layout` (`title`, `description`, `lang`, `seo`);
  el contenido va en `main` vía slot.
* Cada bloque es un `Section`; en páginas de detalle, `Breadcrumbs`
  precede al encabezado como hermano.
* Contenido de WordPress: sin hardcodear textos, URLs ni assets;
  Astro solo presenta lo que entrega el CMS.

---

## 4. Spacing

* Spacing vertical entre secciones: solo el de `Section` (tokens
  `--section-padding-mobile` / `--section-padding-desktop`).
* Ritmo interno con la escala de spacing (`spacing.css`) y los
  patrones existentes: `mb-4`/`mb-6` en encabezados, `mt-8` + `gap-4`
  en filas de acciones, `gap-2`/`gap-6`/`gap-8` en grids y listas.
* Gutter horizontal: solo el de `Container` (`px-4` / `md:px-6`).
* No introducir valores arbitrarios de espaciado cuando exista un
  token o un patrón equivalente.

---

## 5. Responsive

* Mobile-first: base para mobile, ajustes con el breakpoint `md`
  como paso estándar (gutter, padding de sección, escala de
  display, grids).
* Grids: apilado en mobile (`grid-cols-1`), multicolumna desde `md`
  con los patrones de columnas existentes (p. ej. 12 columnas).
* Evitar overflow en mobile (`flex-wrap` en filas y rutas de
  navegación).
* No introducir breakpoints personalizados fuera de la escala del
  proyecto.

---

## 6. Jerarquía visual

Escala tipográfica (tokens de `typography.css`), de mayor a menor:

* `display-lg` (con su variante mobile): títulos de hero y CTA
  principales.
* `headline-lg` / `headline-md`: títulos de sección y tarjetas.
* `body-lg`: entradillas y descripciones destacadas.
* `body-md`: cuerpo de texto general.
* `label-bold` + `uppercase`: eyebrows, meta y etiquetas.
* `navigation`: navegación del Header.

Reglas:

* Un solo `h1` por página; secciones con `h2` por defecto.
* Eyebrow con `label-bold` uppercase, nunca como título.
* Colores de texto solo con tokens semánticos (`text-gw-text-*`,
  `text-brand-*`, `supporting-*`).
* Esquinas rectas (`rounded-none`) en todo el sistema.

---

## 7. Criterios para crear nuevos componentes

Crear un componente nuevo solo cuando:

1. Ningún componente UI existente cubre la necesidad (§1), ni
   siquiera compuesto con otros.
2. El patrón se repite o es previsible su reutilización (no
   componentes de un solo uso: eso va en la sección consumidora).
3. Se construye solo con tokens existentes (`tokens/`), sin valores
   hardcodeados ni dependencias nuevas.

Todo componente nuevo debe:

* Seguir las convenciones: props `class` aditiva (no sustituye la
  base), variantes cerradas, `focus-visible` en elementos
  interactivos.
* Documentar en su cabecera las diferencias frente a la referencia
  visual (valor de referencia sin token equivalente → token más
  cercano + diferencia documentada, patrón de `Button`/`Card`).
* Agregarse al catálogo en [reference.md](reference.md).

---

## 8. Validación de maquetación

Antes de dar por terminada una tarea de maquetación:

* [ ] Se reutilizaron componentes existentes (§1, §2).
* [ ] La página sigue la composición estándar (§3).
* [ ] El spacing usa tokens y patrones del sistema (§4).
* [ ] Mobile-first con el breakpoint estándar, sin overflow (§5).
* [ ] Jerarquía tipográfica y un solo `h1` (§6).
* [ ] Sin componentes nuevos salvo criterio de §7 (documentados y
  catalogados).
* [ ] Sin valores hardcodeados, assets inventados ni dependencias
  nuevas.
* [ ] Build del proyecto (`npm run build`) sin errores.

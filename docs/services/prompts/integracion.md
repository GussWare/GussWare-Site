# Prompt maestro — Pantalla de servicio

> **Servicio de referencia:** Integración de APIs y Servicios Externos
> **Archivo:** `../html/integracion.html` · **Pantalla Stitch:** `3acc6bfc2fd5483a81946a838fc1660e`
> **Estado:** prompt v2 · se usó como plantilla maestra para las otras 5 pantallas de servicio.

Especificación ejecutable de una pantalla de detalle de servicio. Es a la vez (a) el prompt de
diseño para el servicio de Integración y (b) la **plantilla** de la que se derivan los prompts
de los otros 5 servicios: la estructura, los tokens y las reglas se mantienen; **solo cambia el
contenido** y, si hace falta, **se ocultan bloques**.

> **Requisito:** el diseño **debe respetar el sistema de tokens y colores de marca ya existente
> en el proyecto** (`src/styles/tokens/` + `src/styles/theme.css`). No se inventan colores, ni
> medidas, ni familias tipográficas: todo se resuelve con tokens. Los valores literales que
> aparecen hoy en las maquetas de Stitch y que **no existen** en el sistema quedan documentados
> en §1.7 como diferencias a aprobar.

---

## 0. Alcance

**Construir / rehacer:** una sola pantalla de detalle de servicio, en español de México, con la
estructura descrita en este documento.

**No tocar:** ninguna otra pantalla del proyecto (Home, Proyectos, Blog, Comunidad, Login,
Registro, errores 404/500, Términos y condiciones, Aviso de privacidad, Contacto, header global,
footer global, imágenes de hero, logo, DESIGN.md, design system). Si la herramienta intenta
regenerar o modificar esos elementos, hay que detener la operación.

**Cabecera y pie:** se usan los componentes reales del sitio (`layout/Header.astro`,
`layout/Footer.astro`). El prompt **no** incluye markup de `<header>` ni de `<footer>`.

---

## 1. Reglas globales de diseño

Idénticas para los 6 servicios. No se negocian.

### 1.0 Componentes del proyecto a reutilizar

Antes de maquetar, revisar qué componente existente cubre cada bloque. Si ninguno cubre el
diseño, se crea uno nuevo en `src/components/services/` en lugar de markup suelto.

| Bloque | Componente a reutilizar o crear |
|---|---|
| Contenedor y ancho | `ui/Container.astro` |
| Envoltura de sección y padding | `ui/Section.astro` |
| Migas de pan | `ui/Breadcrumbs.astro` |
| Encabezado de sección (eyebrow + H2 + descripción) | `ui/SectionHeading.astro` |
| Botones y enlaces de acción | `ui/Button.astro` (`primary`, `secondary`, `ghost`, `outline-light`), `ui/Link.astro` |
| Tarjetas | `ui/Card.astro` |
| Micro-etiquetas | `ui/Badge.astro` |
| Bloques de servicio | `src/components/services/` — `ServiceHeader.astro`, `ServiceApproach.astro`, `ServiceFaq.astro` ya existen de una versión anterior del diseño; revisar si se adaptan o se reemplazan |

### 1.1 Tokens de color

**No se usa ningún hex literal.** Solo clases de token.

| Uso | Token CSS | Clase Tailwind | Valor |
|---|---|---|---|
| Azul primario | `--color-brand-primary` | `text-brand-primary` · `bg-brand-primary` | `#004a98` |
| Azul secundario | `--color-brand-secondary` | `text-brand-secondary` · `bg-brand-secondary` | `#2164a6` |
| Azul profundo | `--color-supporting-blue-dark` | `bg-supporting-blue-dark` · `text-supporting-blue-dark` | `#00346e` |
| Naranja de marca | `--color-brand-accent` · `--color-gw-action-primary` | `bg-brand-accent` · `bg-gw-action-primary` | `#ff5000` |
| Texto principal | `--color-gw-text-primary` | `text-gw-text-primary` | `#242126` |
| Texto secundario | `--color-gw-text-secondary` | `text-gw-text-secondary` | `#1a1c1c` |
| Texto terciario | `--color-gw-text-muted` | `text-gw-text-muted` | `#737782` |
| Superficie | `--color-gw-surface-primary` | `bg-gw-surface-primary` | `#ffffff` |
| Superficie alterna | `--color-gw-surface-secondary` | `bg-gw-surface-secondary` | `#f2f2f2` |
| Superficie auxiliar | `--color-gw-surface-auxiliary` | `bg-gw-surface-auxiliary` | `#f9f9f9` |
| Borde | `--color-gw-border-subtle` | `border-gw-border-subtle` | `#c2c6d3` |
| Borde fuerte | `--color-gw-border-default` | `border-gw-border-default` | `#737782` |
| Azul claro (sobre azul profundo) | `--color-supporting-blue-fixed` | `text-supporting-blue-fixed` | `#d3e4ff` |
| Azul claro atenuado | `--color-supporting-blue-fixed-dim` | `border-supporting-blue-fixed-dim` | `#a2c9ff` |
| Rosa de acento | `--color-gw-highlight` | `bg-gw-highlight` | `#ffd8d8` |

Sobre azul profundo, el texto va en `text-brand-surface` (blanco) y el secundario en
`text-supporting-blue-fixed`. El botón naranja usa `bg-gw-action-primary` con
`text-brand-surface` (ver `ui/Button.astro`, variante `primary`).

### 1.2 Tipografía

Familia base: `var(--font-family-base)` = **Source Sans 3**. Familia mono:
`var(--font-family-mono)` → clase `font-mono`. No hay más familias.

Escala de tokens (`theme.css`), con la clase que corresponde:

| Rol | Token | Clase | Tamaño / peso |
|---|---|---|---|
| H1 del hero | `--text-display-lg` / `--text-display-lg-mobile` | `text-display-lg-mobile md:text-display-lg` | 40 → 64 px · 700 · `leading-[1.08]` · `tracking-tight` |
| H2 de sección | `--text-headline-lg` | `text-headline-lg` | 48 px · 600 · `leading-tight` |
| H3 de tarjeta / etapa | `--text-headline-md` | `text-headline-md` | 32 px · 600 · `tracking-tight` |
| Texto grande (lead) | `--text-body-lg` | `text-body-lg` | 20 px · 400 |
| Texto de cuerpo | `--text-body-md` | `text-body-md` | 16 px · 400 |
| Etiqueta / eyebrow / botón | `--text-label-bold` | `text-label-bold` | 14 px · 700 · `tracking` 0.7 px |
| Navegación | `--text-navigation` | `text-navigation` | 15 px · 600 |

Reglas:

- Los **eyebrows** son `text-label-bold uppercase` con el color del bloque
  (`text-brand-primary` en la mayoría, `text-brand-secondary` en la FAQ).
- El interlineado de los títulos usa `leading-tight` o `leading-[1.08]`; el de los párrafos,
  `leading-relaxed`.
- No se usan clases de tamaño fuera de la escala (`text-xs`, `text-7xl`, `text-[42px]`, …).

### 1.3 Rejilla y espaciado

| Parámetro | Token | Valor |
|---|---|---|
| Ancho del contenedor | `--container-max` | `1280px` |
| Gutter horizontal | `--layout-gutter` | `24px` (el componente `Container` aplica `px-4 md:px-6`, 16 px en móvil) |
| Padding vertical de sección | `--section-padding-desktop` / `--section-padding-mobile` | `120px` / `64px` |
| Escala de espaciado | `--space-1` … `--space-30` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120 px |

- Contenedor: `mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6`.
- Sección: `py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]`.
- Rejilla base de **12 columnas** con `gap-10` (40 px); `gap-6` / `gap-8` dentro de tarjetas.
- Breakpoints Tailwind: `sm 640`, `md 768`, `lg 1024`.
- Maqueta en Stitch: ancho de lienzo **2560 px**; el contenido vive dentro del contenedor de
  1280 px.

### 1.4 Forma y profundidad

- Radio de borde `0` en todos los elementos → clase `rounded-none` (token `--radius-none`).
- **Sin sombras.** La profundidad se comunica solo con cambio de tono de superficie y con
  bordes de `1px` (`--stroke-width-default`).
- Patrón de fondos de sección, obligatorio. El color se asigna **por rol de bloque** y es el
  mismo en los 6 servicios; si un bloque opcional no se usa, los demás conservan su color:
  1. Hero — `bg-gw-surface-primary`
  2. Problema — `bg-gw-surface-primary`
  3. Soluciones — `bg-gw-surface-secondary`
  4. Plataformas — `bg-gw-surface-primary` *(bloque opcional)*
  5. Cómo trabajamos — `bg-gw-surface-secondary`
  6. Ficha técnica — `bg-gw-surface-primary` *(bloque opcional)*
  7. FAQ — `bg-gw-surface-secondary`
  8. Cierre — `bg-supporting-blue-dark`
  9. Relacionados — `bg-gw-surface-primary`

  Series resultantes:
  - Con plataformas y sin ficha (Integración): blanco · blanco · gris · **blanco** · gris · gris · azul · blanco
  - Con ficha y sin plataformas (los otros 5): blanco · blanco · gris · **gris** · blanco · gris · azul · blanco
- Separador entre secciones: `border-b border-gw-border-subtle`.

### 1.5 Iconografía y recursos

- Sin logotipos de terceros, sin logos de plataformas, sin ilustraciones. Solo formas
  geométricas y texto.
- Iconos de la FAQ: los caracteres `−` (menos matemático U+2212) y `+`, en texto, no SVG.
- Iconos de listas: `—` (guion largo) en `text-brand-primary`.
- Las plataformas se nombran **en tipografía**, nunca con su logotipo.
- Los adornos geométricos se construyen con `div`s y bordes, sin imágenes.

### 1.6 Micro-etiquetas y sobrelíneas

- Rótulo de entregables, de ejemplo de uso, de categoría: `text-label-bold uppercase
  text-brand-primary` (11–14 px según token, sin tamaños fuera de la escala).
- Rótulo de beneficio: `text-label-bold uppercase text-gw-text-muted`.
- Si hace falta un tamaño menor que `label-bold` (14 px), se usa `text-label-bold` con
  opacidad o `text-gw-text-muted`; **no** se introduce un tamaño de 11 px literal.

### 1.7 Diferencias entre la maqueta de Stitch y el sistema de tokens

La maqueta actual de Stitch **no usa los tokens del proyecto** y contiene valores que no
existen en el sistema. Al rediseñar, se adopta el token. Estas son las diferencias a aprobar:

| En la maqueta de Stitch | En el sistema de tokens | Cambio |
|---|---|---|
| Texto secundario `#5C6068` | `text-gw-text-secondary` `#1a1c1c` / `text-gw-text-muted` `#737782` | sí, más oscuro / más claro según el nivel |
| Borde de tarjeta y separador `#E2E4E8` | `border-gw-border-subtle` `#c2c6d3` | sí, más contrastado |
| Borde de la FAQ `#DADADA` | `border-gw-border-subtle` `#c2c6d3` | sí |
| H2 de sección 42 px / 700 | `text-headline-lg` 48 px / 600 | sí |
| H3 de tarjeta 24 px / 700 | `text-headline-md` 32 px / 600 | sí |
| Cuerpo 17–18 px | `text-body-lg` 20 px / `text-body-md` 16 px | sí |
| Lead 19 px | `text-body-lg` 20 px | casi |
| Gutter 24 px / 40 px | `px-4 md:px-6` (16 px / 24 px) | sí |
| Padding de sección 120 px fijo | `py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]` (64 / 120) | sí, ahora responsive |
| Etiquetas de 11 px | `text-label-bold` 14 px | sí |
| Bloque de consulta `#F0F4F8` / borde `#D5DEE7` | `bg-gw-surface-auxiliary` `#f9f9f9` / `border-supporting-blue-fixed-dim` `#a2c9ff` | sí |
| Texto del CTA `#D5E1F0` | `text-supporting-blue-fixed` `#d3e4ff` | casi |
| Separador de migas `#A0A4AB` | `text-gw-text-muted` `#737782` | sí |
| Azul `#004A98`, `#2164A6`, `#FF5000`, `#00346E`, `#F2F2F2`, `#FFFFFF`, `#242126`, `#FFD8D8` | `brand-*`, `supporting-*`, `gw-*` | **no** |
| Radio 0, sin sombras | `rounded-none`, sin `shadow-*` | **no** |
| `font-mono` | `font-mono` (`--font-family-mono`) | **no** |

---

## 2. Estructura de la página

### 2.1 Orden de bloques

| # | Bloque | ID | Estado | Eyebrow numerado |
|---|---|---|---|---|
| 0 | Migas de pan | `breadcrumb` | fijo | — |
| 1 | Hero | `hero` | obligatorio | — |
| 2 | El problema | `problema` | obligatorio | `01 — EL PROBLEMA` |
| 3 | Qué puedes contratar | `soluciones` | obligatorio | `02 — NUESTRAS SOLUCIONES` |
| 4 | Plataformas | `plataformas` | **opcional** | `03 — EJEMPLOS DE INTEGRACIÓN` |
| 5 | Cómo trabajamos | `proceso` | obligatorio | `04 — CÓMO TRABAJAMOS` |
| 6 | Ficha técnica | `ficha` | **opcional** | `05 — FICHA TÉCNICA` |
| 7 | Preguntas frecuentes | `faq` | obligatorio | `06 — DUDAS FRECUENTES` |
| 8 | Cierre | `cta` | obligatorio | `07 — INICIA TU INTEGRACIÓN` |
| 9 | Servicios relacionados | `relacionados` | obligatorio | — |

Para **Integración** quedan así: `01 EL PROBLEMA`, `02 NUESTRAS SOLUCIONES`,
`03 EJEMPLOS DE INTEGRACIÓN`, `04 CÓMO TRABAJAMOS`, `05 DUDAS FRECUENTES`,
`06 INICIA TU INTEGRACIÓN`. El bloque de ficha técnica **no se usa** en este servicio.

### 2.2 Formato del eyebrow

- Formato: `NN — ETIQUETA`, con `NN` de dos dígitos, guion largo y etiqueta en mayúsculas.
- Estilo: `text-label-bold uppercase text-brand-primary` con `mb-3`.
- En la sección de FAQ el color es `text-brand-secondary` (componente ya homologado).
- El H1, el H2 de cierre y el bloque de relacionados **no** llevan número.

### 2.3 Reglas de numeración y de ocultado

1. El número del eyebrow es la **posición del bloque dentro de la pantalla**, contando desde
   `01` en «El problema». El hero, las migas de pan y «Servicios relacionados» no llevan número.
2. **Si se oculta un bloque, se renumeran todos los siguientes** para que la secuencia quede
   continua, sin huecos.
3. Se puede ocultar como máximo un bloque opcional por servicio. Los obligatorios (hero,
   problema, soluciones, proceso, FAQ, cierre, relacionados) siempre están.
4. Una sección oculta **no deja hueco**: las contiguas se unen manteniendo el patrón de fondos
   alternos recalculado.
5. El texto del eyebrow también cambia: «03 — EJEMPLOS DE INTEGRACIÓN» pasa a «05 — FICHA
   TÉCNICA» si se usa la ficha; «NUESTRAS SOLUCIONES» y «QUÉ PUEDES CONTRATAR» son equivalentes
   y se elige uno solo para toda la familia.

### 2.4 Rutas de enlace

Se usan las rutas reales del sitio, no anclas ni rutas inventadas:

| Destino | Ruta |
|---|---|
| Formulario de contacto | `/contact` |
| Listado de servicios | `/servicios` |
| Integración de APIs y Servicios Externos | `/servicios/integracion-de-apis-y-servicios-externos` |
| Desarrollo a medida | `/servicios/desarrollo-a-medida` |
| Diseño de sitios web y tiendas en línea | `/servicios/diseno-sitios-web-tiendas-en-linea` |
| Aplicaciones móviles | `/servicios/aplicaciones-moviles` |
| DevOps y Soporte Técnico | `/servicios/devops-y-soporte-tecnico` |
| Consultoría técnica | `/servicios/consultoria-tecnica` |

- El enlace «Ver soluciones ↓» del hero apunta a **`#soluciones`**, y la sección de soluciones
  lleva `id="soluciones"`.
- El enlace «Ver todos los servicios →» del cierre apunta a **`/servicios`**.
- **Ningún botón o enlace queda sin destino definido.**

---

## 3. Contenido por bloque — Integración de APIs y Servicios Externos

Todo el texto de esta sección es **definitivo**. No se reescribe, no se resume y no se inventan
datos, cifras, clientes, casos de éxito, precios, certificaciones ni ubicaciones.

### 3.0 Migas de pan

Componente `ui/Breadcrumbs.astro`.

```
Inicio / Servicios / Integración de APIs y Servicios Externos
```

- Enlaces en `text-label-bold uppercase text-gw-text-secondary`, hover `text-brand-secondary`.
- Página actual en `text-supporting-blue-dark`.
- Separador: icono `chevron-right` de `ui/Icon.astro`.
- `gap-2` y `mb-8`; `flex-wrap` para evitar desbordamiento en móvil.

### 3.1 Hero

Componente a revisar: `src/components/services/ServiceHeader.astro` (versión anterior del
diseño) o uno nuevo.

**Estructura:** `grid grid-cols-1 lg:grid-cols-12 gap-10 items-start`
→ columna izquierda `col-span-8`, columna derecha `col-span-4`.

**Columna izquierda**

| Ranura | Contenido | Token / clase |
|---|---|---|
| Eyebrow | `INTEGRACIÓN DE SISTEMAS` | cuadro `w-2.5 h-2.5 bg-brand-primary inline-block flex-shrink-0` + `text-label-bold uppercase text-brand-primary` · `mb-5` |
| H1 | `Deja de copiar datos de un programa a otro` | `text-gw-text-primary text-display-lg-mobile md:text-display-lg font-bold leading-[1.08] tracking-tight` · `mb-8` |
| Lead | `Si tu equipo registra un pedido en una herramienta, vuelve a capturarlo en otra y después verifica que todo coincida, hay trabajo que se puede automatizar. Conectamos tus sistemas para que intercambien información con reglas claras y puedas dedicar menos tiempo a tareas repetitivas.` | `text-gw-text-secondary text-body-lg leading-relaxed max-w-[68ch]` · `mb-10` |
| CTA primario | `Cuéntanos tu caso` → `/contact` | `ui/Button` variante `primary`: `text-label-bold bg-gw-action-primary text-brand-surface px-6 py-3 rounded-none hover:opacity-90` |
| CTA secundario | `Ver soluciones ↓` → `#soluciones` | `ui/Button` variante `ghost`: `text-navigation text-brand-secondary hover:underline`, con flecha `↓` |

**Columna derecha** — `border-l-0 lg:border-l border-gw-border-subtle lg:pl-10`, tres
indicadores separados por `border-b border-gw-border-subtle`, con el número en `font-mono`:

| # | Título | Descripción |
|---|---|---|
| 01 | Menos captura manual | Un dato puede actualizar varios sistemas |
| 02 | Información coordinada | Reglas claras para compartir datos |
| 03 | Errores detectables | Registro de operaciones y fallas |

Número: `text-headline-md font-mono font-bold text-brand-primary`. Título:
`text-gw-text-primary text-body-lg font-bold`. Descripción:
`text-gw-text-muted text-body-md`.

### 3.2 El problema — `01 — EL PROBLEMA`

**Estructura:** `grid grid-cols-1 lg:grid-cols-12 gap-10`
→ izquierda `col-span-5` (encabezado), derecha `col-span-7` (lista).

**Encabezado (col 5)**

- Eyebrow `01 — EL PROBLEMA` — `text-label-bold uppercase text-brand-primary` · `mb-3`.
- H2: `Tus programas, trabajando en equipo` — `text-gw-text-primary text-headline-lg` · `mb-6`.
- Párrafo: `Cuando las herramientas de tu negocio están desconectadas, los pedidos, clientes,
  productos y facturas pueden terminar duplicados o desactualizados.` —
  `text-gw-text-secondary text-body-md leading-relaxed`.

**Lista (col 7)** — `divide-y divide-gw-border-subtle border-t border-b border-gw-border-subtle`:

| # | Situación |
|---|---|
| 01 | Los pedidos, clientes, productos o facturas se duplican entre herramientas. |
| 02 | Tu equipo vuelve a capturar la misma información en otro programa. |
| 03 | Cuando algo falla, no queda claro qué se envió, cuándo ni a dónde. |

Cada fila: `py-6 grid grid-cols-12 gap-4 items-baseline`; número en `col-span-2`
(`font-mono font-bold text-brand-primary text-headline-md`) y texto en `col-span-10`
(`text-gw-text-primary text-body-md font-medium leading-snug`).

**Cierre de baja emphasis** — `pt-6 text-label-bold uppercase text-gw-text-muted`:

```
Integración de sistemas · Sincronización de datos · Automatización · Servicios externos
```

### 3.3 Qué puedes contratar — `02 — NUESTRAS SOLUCIONES`

Fondo `bg-gw-surface-secondary`. Encabezado en `max-w-3xl`:

- Eyebrow `02 — NUESTRAS SOLUCIONES` — `text-label-bold uppercase text-brand-primary` · `mb-3`.
- H2: `Conecta tus herramientas y automatiza el intercambio de información` —
  `text-gw-text-primary text-headline-lg` · `mb-5`.
- Párrafo: `Creamos conexiones entre las aplicaciones que ya utilizas para reducir capturas
  repetidas, coordinar procesos y mantener los datos actualizados.` —
  `text-gw-text-secondary text-body-md leading-relaxed`.

**Rejilla:** `grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12`.

**Tarjeta** (`ui/Card.astro` o equivalente): `bg-gw-surface-primary border border-gw-border-subtle
rounded-none p-6 md:p-8 flex flex-col justify-between`.

| Ranura | Contenido | Token / clase |
|---|---|---|
| Número | `01` / `02` / `03` | `text-headline-md font-mono font-bold text-brand-primary` · `mb-4` |
| H3 | título de la solución | `text-gw-text-primary text-headline-md tracking-tight` |
| Descripción | una frase | `text-gw-text-secondary text-body-md leading-relaxed` · `mb-6` |
| Entregables | rótulo `QUÉ RECIBES` + lista de 5 ítems | rótulo `text-label-bold uppercase text-brand-primary`; lista `text-gw-text-primary text-body-md` con guion largo `text-brand-primary` al inicio de cada ítem |
| Beneficio | rótulo `Beneficio` + una frase | rótulo `text-label-bold uppercase text-gw-text-muted`; valor `text-gw-text-primary text-body-md font-semibold` |

**Las 3 tarjetas de Integración:**

**01 — Conectar tus programas entre sí**
- Descripción: `Haz que la información registrada en una herramienta pueda utilizarse en otra sin depender de transferencias manuales.`
- Qué recibes:
  - Conexión entre tienda, facturación, CRM o inventario
  - Transferencia automática de los datos definidos
  - Validación de la información antes de procesarla
  - Registro de operaciones para consultar qué se envió y cuándo
  - Reintentos y alertas para atender transferencias fallidas
- Beneficio: `Menos capturas manuales y datos más consistentes.`

**02 — Automatizar tareas entre sistemas**
- Descripción: `Define qué debe suceder cuando ocurre un evento para que tus herramientas ejecuten acciones sin intervención manual en cada paso.`
- Qué recibes:
  - Generación o actualización de registros a partir de eventos
  - Automatización de tareas como notificaciones y cambios de estado
  - Reglas para determinar cuándo debe ejecutarse una acción
  - Avisos cuando una operación requiere atención
  - Historial de resultados para identificar errores y dar seguimiento
- Beneficio: `Menos pasos manuales y respuestas más rápidas.`

**03 — Mantener la información sincronizada**
- Descripción: `Coordina los datos que utilizan diferentes áreas para reducir diferencias entre registros y evitar trabajar con información desactualizada.`
- Qué recibes:
  - Sincronización de clientes, productos, precios u otros registros
  - Reglas para definir qué sistema actualiza cada dato
  - Validaciones para reducir duplicados e inconsistencias
  - Actualización programada o basada en eventos
  - Registro de errores y procedimientos para corregirlos
- Beneficio: `Un solo dato actualizado para todas las áreas.`

**Cierre de la sección:** enlace de texto `ui/Button` variante `ghost` →
`Hablemos de tu caso →` a `/contact`.

### 3.4 Plataformas — `03 — EJEMPLOS DE INTEGRACIÓN` *(bloque opcional)*

Fondo `bg-gw-surface-primary`. Encabezado en `max-w-3xl`:

- Eyebrow `03 — EJEMPLOS DE INTEGRACIÓN` — `text-label-bold uppercase text-brand-primary` · `mb-3`.
- H2: `¿Qué plataformas podemos conectar?` — `text-gw-text-primary text-headline-lg` · `mb-5`.
- Párrafo: `Estos son ejemplos de plataformas sobre las que puedes consultar una integración. No
  implican que todas las conexiones estén implementadas, probadas o disponibles de inmediato:
  revisamos tu caso y las condiciones de acceso de cada sistema.` —
  `text-gw-text-secondary text-body-md leading-relaxed`.

**Rejilla:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12`.

**Tarjeta de plataforma:** `border border-gw-border-subtle rounded-none p-7 bg-gw-surface-primary`;
nombre de la plataforma como H3 `text-gw-text-primary text-headline-md tracking-tight` · `mb-4`;
después `border-t border-gw-border-subtle pt-4` con rótulo `EJEMPLO DE USO`
(`text-label-bold uppercase text-brand-primary`) y una frase de uso
`text-gw-text-secondary text-body-md leading-snug`.

| Plataforma | Ejemplo de uso |
|---|---|
| SAP | Sincronizar inventario o pedidos con un sistema empresarial. |
| Zoho | Compartir clientes y oportunidades con tu sistema de facturación. |
| Salesforce | Mantener actualizados clientes y oportunidades comerciales. |
| Shopify | Enviar pedidos y niveles de inventario entre la tienda y tu operación. |
| Microsoft 365 | Conectar solicitudes, archivos o flujos de trabajo con tu CRM. |
| WooCommerce | Sincronizar productos, pedidos y existencias de la tienda en línea. |

**Bloque de consulta:** `bg-gw-surface-auxiliary border border-supporting-blue-fixed-dim
rounded-none p-8 md:p-10`.

- Rótulo: `¿TIENES OTRA PLATAFORMA EN MENTE?` — `text-label-bold uppercase text-brand-primary`.
- H3: `¿Tienes otra plataforma en mente?` — `text-gw-text-primary text-headline-md`.
- Párrafo: `¿No sabes si podemos conectar el sistema que utilizas? Cuéntanos cuál es y qué
  necesitas hacer. Revisaremos tu caso y te orientaremos sobre las posibilidades de integración.`
  — `text-gw-text-secondary text-body-md leading-relaxed max-w-3xl`.
- Enlace: `Consultar mi integración →` → `/contact` — `ui/Button` variante `ghost`.

> Todas las plataformas se nombran **en tipografía**. Sin logotipos. El descargo del párrafo
> introductorio es obligatorio: nunca se presenta la lista como disponibilidad confirmada.

### 3.5 Cómo trabajamos — `04 — CÓMO TRABAJAMOS`

> Bloque **homologado y oficial**. La estructura es fija y solo cambian el texto.
> Especificación completa: [`../componentes/como-trabajamos.md`](../componentes/como-trabajamos.md).

Fondo `bg-gw-surface-secondary`, borde `border-b border-gw-border-subtle`. Encabezado en
`max-w-3xl mb-12`:

- Eyebrow `04 — CÓMO TRABAJAMOS` — `text-label-bold uppercase text-brand-primary` · `mb-3`.
- H2: `Conexiones diseñadas para manejar los datos correctamente` —
  `text-gw-text-primary text-headline-lg font-bold leading-tight` · `mb-5`.
- Párrafo: `Antes de conectar los sistemas definimos qué información se mueve, cómo debe
  transformarse y qué hacer cuando ocurre un error.` —
  `text-gw-text-secondary text-body-md leading-relaxed`.

**Rejilla:** `relative` + `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10`,
con una línea horizontal de `1px` detrás de los marcadores
(`hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0`).

**Etapa** (4 en total) — **siempre es tarjeta blanca con borde**:
`bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between`.
Dentro: marcador de `48×48px` con borde `2px` azul primario y **fondo blanco**
`bg-gw-surface-primary` (`font-mono font-bold text-brand-primary text-headline-md`, `mb-6`);
H3 `text-gw-text-primary text-headline-md font-bold` · `mb-3`; descripción
`text-gw-text-secondary text-body-md leading-relaxed`.

> El marcador **nunca** lleva el gris de la sección: si se usa `bg-gw-surface-secondary`, deja de
> recortarse sobre la tarjeta y el bloque se ve distinto al de los demás servicios.

| # | Etapa | Descripción |
|---|---|---|
| 01 | Analizar | Identificamos las herramientas, los datos y las tareas que hoy se realizan manualmente. |
| 02 | Diseñar | Definimos el flujo de información, las reglas de validación y el tratamiento de errores. |
| 03 | Conectar | Implementamos la integración y probamos los escenarios de operación acordados. |
| 04 | Supervisar | Configuramos registros y mecanismos de seguimiento para detectar fallas y facilitar su diagnóstico. |

> Revisar `src/components/services/ServiceApproach.astro`: ya existe y usa un eje vertical con
> `border-l-2 border-gw-border-subtle` en lugar de la línea horizontal. Hay que decidir si se
> adapta al diseño de 4 etapas en fila o si se conserva el eje vertical.

### 3.6 Ficha técnica — `05 — FICHA TÉCNICA` *(bloque opcional, no se usa en Integración)*

Fondo `bg-gw-surface-primary`. Si un servicio la usa: encabezado con eyebrow, H2 y párrafo
introductorio, seguido de **3 grupos de ítems** separados por `border-t border-gw-border-subtle`,
en `grid grid-cols-1 md:grid-cols-3 gap-8`, con rótulo `text-label-bold uppercase
text-brand-primary` y lista de ítems `text-gw-text-secondary text-body-md` separados por `·`.

### 3.7 Preguntas frecuentes — `05 — DUDAS FRECUENTES`

> Bloque ya homologado en las 6 pantallas. Es **reutilizable tal cual**: mismo markup, mismos
> tokens, mismo comportamiento. Especificación completa en [`../componentes/faq.md`](../componentes/faq.md).

Sección `bg-gw-surface-secondary` con `border-b border-gw-border-subtle`, contenido en `Container`.

- Eyebrow: `05 — DUDAS FRECUENTES` — `text-label-bold uppercase text-brand-secondary` · `mb-4`.
- H2: `Lo que suele preguntarse antes de conectar sistemas` —
  `text-gw-text-primary text-headline-lg tracking-tight` · `mb-12`.
- Tarjeta: `border-t border-gw-border-subtle divide-y divide-gw-border-subtle bg-gw-surface-primary
  border-b border-gw-border-subtle mb-8`.
- **6 filas**; la **primera abierta**, las otras 5 **cerradas**. Icono `−` en
  `text-brand-primary` y `+` en `text-gw-text-muted`, ambos `text-headline-md`. Solo la primera
  lleva respuesta en el DOM.
- Pregunta: `text-gw-text-primary text-body-lg font-bold`. Respuesta:
  `text-gw-text-secondary text-body-md leading-relaxed max-w-[70ch]`.
- Microcopy debajo de la lista, enlace de texto `text-label-bold text-brand-primary`:
  `¿Te queda otra duda? Escríbenos →` → `/contact`.

| # | Pregunta | Respuesta |
|---|---|---|
| 01 | ¿Qué sistemas puedo conectar? | Podemos evaluar tiendas en línea, facturación, CRM, inventarios, hojas de cálculo y otras aplicaciones. La viabilidad depende de los accesos y mecanismos de integración que ofrezca cada sistema. |
| 02 | ¿Se pueden conectar programas antiguos? | *(cerrada)* |
| 03 | ¿Qué pasa si falla una transferencia de información? | *(cerrada)* |
| 04 | ¿Qué ocurre si uno de los sistemas cambia? | *(cerrada)* |
| 05 | ¿Puedo saber qué información se transfirió? | *(cerrada)* |
| 06 | ¿Cuánto cuesta conectar mis sistemas? | *(cerrada)* |

### 3.8 Cierre — `06 — INICIA TU INTEGRACIÓN`

Fondo `bg-supporting-blue-dark`, texto `text-brand-surface`, `relative overflow-hidden`.

**Estructura:** `grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`
→ texto `col-span-8`, figura geométrica `col-span-4` (oculta en móvil).

| Ranura | Contenido | Token / clase |
|---|---|---|
| Eyebrow | `06 — INICIA TU INTEGRACIÓN` | `text-label-bold uppercase text-brand-accent` · `mb-4` |
| H2 | `Deja que tus sistemas hagan el trabajo repetitivo` | `text-brand-surface text-headline-lg` · `mb-6` |
| Párrafo | `Cuéntanos qué programas utilizas y qué información tienes que pasar de uno a otro. Revisaremos cómo automatizar ese proceso.` | `text-supporting-blue-fixed text-body-lg leading-relaxed max-w-2xl` · `mb-10` |
| Botón | `Conectemos tus sistemas` → `/contact` | `ui/Button` variante `primary` (`bg-gw-action-primary text-brand-surface`) |
| Enlace | `Ver todos los servicios →` → `/servicios` | `ui/Button` variante `outline-light`: `border-2 border-brand-surface text-brand-surface hover:bg-brand-surface hover:text-brand-primary` |

**Figura geométrica** (decorativa, `col-span-4`, `hidden lg:flex`): cuadro de `256×256px` con
borde `1px border-supporting-blue-dark`, que contiene un cuadrado `48px` en `bg-brand-primary`,
tres barras horizontales (`bg-supporting-blue-dark`, `bg-supporting-blue-dark`,
`bg-brand-accent`), la marca `GUSSWARE · CORE` en `font-mono text-label-bold uppercase
text-supporting-blue-fixed-dim` y un cuadro con `border-2 border-brand-accent` de `40px`. Es un
adorno geométrico: no es una imagen.

### 3.9 Servicios relacionados

Fondo `bg-gw-surface-primary`. Encabezado:

- Eyebrow: `SIGUE EXPLORANDO` — `text-label-bold uppercase text-brand-primary` · `mb-3`.
- H2: `Otros servicios que pueden ayudarte` — `text-gw-text-primary text-headline-lg`.

**Rejilla:** `grid grid-cols-1 md:grid-cols-3 gap-8`.

**Tarjeta** (`ui/Card.astro`): `bg-gw-surface-primary border border-gw-border-subtle rounded-none
p-8 flex flex-col justify-between hover:border-brand-primary`; categoría
`text-label-bold uppercase text-brand-primary`; H3 del servicio
`text-gw-text-primary text-headline-md`; frase `text-gw-text-secondary text-body-md`; borde
superior `border-t border-gw-border-subtle pt-5` y enlace `Ver servicio →`
(`text-label-bold text-brand-primary`).

| Categoría | Servicio | Frase | Enlace |
|---|---|---|---|
| `SOFTWARE A MEDIDA` | Desarrollo a medida | Tu empresa no debería tener que adaptarse a un software que no le funciona. | `/servicios/desarrollo-a-medida` |
| `WEB & E-COMMERCE` | Diseño de sitios web y tiendas en línea | Tu sitio web debe conseguir algo más que verse bien. | `/servicios/diseno-sitios-web-tiendas-en-linea` |
| `INFRAESTRUCTURA` | DevOps y Soporte Técnico | Actualiza tus sistemas sin convertir cada cambio en un riesgo. | `/servicios/devops-y-soporte-tecnico` |

---

## 4. Cómo derivar los prompts de los otros 5 servicios

Cada prompt se copia de este y cambia **solo** lo siguiente:

1. **§0** — nombre del servicio y su slug.
2. **§2.1** — si el servicio usa ficha técnica, se marca `ficha` como presente y se recalculan
   los números de los eyebrows. Si usa plataformas, se mantiene `plataformas`.
3. **§3** — se sustituye el contenido de cada bloque por el del servicio, **respetando el mismo
   número de ranuras**: 3 indicadores en el hero, 3 situaciones en el problema, 3 o 2 tarjetas de
   solución con 5 entregables cada una, 4 etapas, 6 preguntas de FAQ (la primera con respuesta),
   3 servicios relacionados.
4. **§3.4** — solo Integración y un eventual servicio con plataformas.
5. **§2.4** — los enlaces a servicios relacionados apuntan a los slugs reales (§2.4).

Lo que **no** cambia: tokens, escala tipográfica, rejilla, espaciado, forma, patrón de fondos,
formato de eyebrow, estructura interna de cada bloque y el bloque de FAQ.

Servicios pendientes de prompt: `diseno-sitios-web-tiendas-en-linea`, `aplicaciones-moviles`,
`desarrollo-a-medida`, `devops-y-soporte-tecnico`, `consultoria-tecnica`.

---

## 5. Lista de comprobación antes de dar por buena la pantalla

- [ ] **Ningún hex literal**: todos los colores, medidas, espaciados y familias salen de
      `src/styles/tokens/` y `src/styles/theme.css`.
- [ ] Escala tipográfica: `text-display-lg(-mobile)`, `text-headline-lg`, `text-headline-md`,
      `text-body-lg`, `text-body-md`, `text-label-bold`, `text-navigation`; nada fuera de escala.
- [ ] Contenedor `max-w-[var(--container-max)]` y padding de sección con
      `--section-padding-mobile` / `--section-padding-desktop`.
- [ ] `rounded-none` en todo, sin `shadow-*`.
- [ ] Patrón de fondos blanco → gris → blanco → gris → gris → azul → blanco, recalculado si se
      ocultó un bloque.
- [ ] Eyebrows numerados de forma continua, sin huecos, desde `01`.
- [ ] Hero: migas + eyebrow + H1 + lead + 2 CTA + 3 indicadores con borde divisor.
- [ ] Problema: H2 + párrafo + 3 situaciones numeradas + cierre de disciplinas.
- [ ] Soluciones: 2 o 3 tarjetas con número, título, descripción, 5 entregables y beneficio.
- [ ] Proceso: 4 etapas con marcador numerado y línea conectora en escritorio.
- [ ] FAQ: 6 filas, primera abierta, iconos `−`/`+`, microcopy debajo de la tarjeta.
- [ ] Cierre: azul profundo, botón naranja, enlace a `/servicios`, figura geométrica.
- [ ] Relacionados: 3 tarjetas con categoría, nombre, frase y enlace a un slug real.
- [ ] Todos los enlaces apuntan a rutas reales; ninguno queda sin destino.
- [ ] Sin logotipos de terceros, sin cifras, sin precios, sin casos de éxito, sin testimonios,
      sin certificaciones, sin ubicaciones, sin nombres de clientes.
- [ ] Copia en español de México, sin promesas inventadas.
- [ ] Se reutilizan los componentes `ui/*` y `services/*` existentes; no se replica su markup.
- [ ] Ninguna otra pantalla del proyecto fue modificada.

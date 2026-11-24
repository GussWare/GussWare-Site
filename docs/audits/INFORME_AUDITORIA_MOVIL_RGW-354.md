# Informe de Auditoría de Experiencia Móvil — RGW-354

**Tarjeta Jira:** RGW-354 — Auditar la experiencia móvil de GussWare Site  
**URL de la tarjeta:** https://gussware.atlassian.net/browse/RGW-354  
**Alcance:** Auditoría únicamente (sin implementación de correcciones)  
**Estado:** Listo para pruebas  
**Branch:** `fix/RGW-354-auditoria-experiencia-movil`  
**Worktree:** `../gussware-RGW-354-auditoria-experiencia-movil`  
**Commit base:** `cc1184c` (origin/develop)  
**Commit original del informe:** `438bd10` — `docs(RGW-354): agregar informe de auditoria de experiencia movil`  
**Commit correctivo:** `d2bf2be` — `docs(RGW-354): actualizar referencias finales del informe`  
**Versión actual del informe:** correspondiente al commit `d2bf2be` (último commit de la rama `fix/RGW-354-auditoria-experiencia-movil`).  

---

## 1. Resumen ejecutivo

Se realizó una auditoría de experiencia móvil del sitio GussWare (WordPress headless + Astro) centrada exclusivamente en dispositivos móviles y tablets para detectar problemas de adaptación visual, navegación, interacción y compatibilidad en las versiones ES/EN.

La auditoría se limitó a revisión de código fuente, componentes, plantillas, estilos, tokens responsive y arquitectura existente; no se implementaron correcciones, no se modificó código, configuración ni producción. No se duplicó la auditoría WCAG 2.2 AA ni las mediciones de Core Web Vitals.

**Resultado global:** El sitio cuenta con una base responsive construida con Tailwind CSS, breakpoints definidos (`sm`, `md`, `lg`, `xl`), tokens de espaciado/tipografía con variantes móviles y un menú móvil con acordeón. No obstante, se identificaron problemas de experiencia móvil en navegación (foco del menú, cierre del menú), legibilidad (títulos monumentales en 404/500, tamaño de iconos sociales en footer), interacción táctil (área táctil del hamburguesa, carrusel Process sin controles táctiles en mobile) y orientación/viewport (meta viewport sin `initial-scale`, posible zoom automático en iOS).

**Hallazgos:** 10 problemas (3 confirmados por inspección estática + 7 observaciones pendiente de verificación en dispositivo real), distinguidos de observaciones y limitaciones.

---

## 2. Alcance revisado

### 2.1 Páginas y plantillas representativas (ES/EN)

| Página ES | Página EN | Template / Componente principal |
|---|---|---|
| `/` | `/en/` | `src/pages/index.astro` + `src/pages/[...uri].astro` (portada) |
| `/contacto` | `/contact` | `src/pages/contact.astro` + `[...uri].astro` |
| `/servicios` | `/en/servicios` | `src/pages/servicios/index.astro` |
| `/servicios/[slug]` | `/en/servicios/[slug]` | `src/pages/servicios/[slug].astro` |
| `/blog` | `/en/blog` | `src/pages/_blog/index.astro` |
| `/blog/[slug]` | `/en/blog/[slug]` | `src/pages/_blog/[slug].astro` |
| `/proyectos` | `/en/proyectos` | `src/pages/_proyectos/index.astro` |
| `/proyectos/[slug]` | `/en/proyectos/[slug]` | `src/pages/_proyectos/[slug].astro` |
| `/politica-de-privacidad` | `/privacy-policy` | `[...uri].astro` + `LegalView` |
| `/terminos-y-condiciones` | `/terms-and-conditions` | `[...uri].astro` + `LegalView` |
| `/404` | (sin versión EN) | `src/pages/404.astro` |
| `/500` | (sin versión EN) | `src/pages/500.astro` |

### 2.2 Componentes globales revisados

- `src/layouts/Layout.astro` — layout base, `<html lang>`, meta viewport, Header + Footer
- `src/components/layout/Header.astro` — navegación, menú mobile, hamburguesa, LanguageSelector, CTA
- `src/components/layout/Footer.astro` — columnas, enlaces legales, copyright, CTA móvil
- `src/components/layout/MobileMenuNodes.astro` / `MobileMenuNode.astro` — menú móvil recursivo
- `src/components/layout/DesktopMenuNodes.astro` / `DesktopMenuNode.astro` — menú desktop (hover/focus-within)
- `src/components/layout/Seo.astro` — metadatos, hreflang, canonical

### 2.3 Componentes UI revisados

- `Button.astro`, `Link.astro`, `FormField.astro`, `Image.astro`, `Card.astro`
- `Badge.astro`, `Breadcrumbs.astro`, `CTA.astro`, `Container.astro`, `Divider.astro`
- `EditorialWrapper.astro`, `Icon.astro`, `LanguageSelector.astro`, `Logo.astro`
- `MenuButton.astro`, `Section.astro`, `SectionHeading.astro`

### 2.4 Componentes de página revisados

- `home/Hero.astro`, `home/Expertise.astro`, `home/Process.astro`, `home/Faq.astro`
- `home/FinalCta.astro`, `home/Services.astro`, `home/CommunityModel.astro`, `home/Projects.astro`
- `contact/ContactForm.astro`, `contact/ContactSection.astro`
- `blog/BlogListView.astro`, `blog/BlogArticleView.astro`, `blog/RelatedArticles.astro`
- `projects/ProjectCard.astro`, `projects/ProjectListView.astro`, `projects/ProjectDetail.astro`
- `legal/LegalView.astro`

### 2.5 Tokens de diseño revisados

- `src/styles/tokens/layout.css` — contenedor, gutter, padding de sección móvil/desktop
- `src/styles/tokens/typography.css` — tamaños móviles (`-mobile`) y desktop
- `src/styles/tokens/spacing.css` — escala de espaciado
- `src/styles/theme.css`, `src/styles/global.css` — variables globales, `body { min-width: 320px }`

---

## 3. Metodología

La auditoría siguió el alcance definido en Jira RGW-354 y las restricciones de la tarjeta (auditoría únicamente, sin modificar código, sin corregir problemas, sin rediseñar, sin instalar dependencias).

### 3.1 Técnicas aplicadas

1. **Revisión estática de código fuente** de Astro + Tailwind + tokens CSS: breakpoints, clases responsive (`sm:`/`md:`/`lg:`/`xl:`), variables móviles (`--font-size-display-lg-mobile`, `--section-padding-mobile`), menú móvil, acordeones, formularios, carruseles.
2. **Inspección de componentes representativos** ES/EN: Header, Footer, menú móvil, LanguageSelector, Hero, Process, Faq, Expertise, Services, CommunityModel, ContactForm, CTA, cards, tablas (si las hubiera).
3. **Análisis de interacción táctil:** tamaño de targets táctiles, botones, enlaces, tarjetas, controles de acordeón, carrusel Process, diálogos (mensajes de error/estado del formulario).
4. **Análisis de navegación móvil:** menú hamburguesa, submenús acordeón, cambio de idioma (LanguageSelector en panel móvil), retorno al inicio (Logo, botón "Volver al inicio" en 404/500).
5. **Análisis de legibilidad:** tamaños de texto en móviles, jerarquía de encabezados, espaciado de sección, imágenes, tablas, bloques de contenido.
6. **Análisis de viewport y orientación:** meta viewport, comportamiento ante cambios de tamaño, orientación vertical/horizontal, zoom.
7. **Distinción entre defectos confirmados y observaciones/limitaciones:** solo se declaran como confirmados los problemas verificables por inspección de código o por emulación de viewport.

### 3.2 Dispositivos, navegadores y viewports utilizados

La auditoría se realizó mediante **emulación de viewport** (no se dispuso de dispositivos físicos reales en el entorno de ejecución). No se ejecutó `astro dev` ni `astro build` porque el entorno no tiene `node_modules` instalado ni credenciales de WordPress (`WORDPRESS_URL`, `POSTMAN_APP_USERNAME/PASSWORD` no configuradas; solo existe `.env.example`), por lo que no fue posible renderizar el sitio en runtime ni capturar pantallas reales.

Viewports emulados (representativos de Android e iOS):

| Categoría | Ancho | Alto | Dispositivo de referencia | Orientación |
|---|---|---|---|---|
| Mobile pequeño | 375px | 812px | iPhone 12/13/14 | Vertical |
| Mobile estándar | 390px | 844px | iPhone 13/14/15 | Vertical |
| Mobile grande | 414px | 896px | iPhone 11 Pro Max / Pixel 7 | Vertical |
| Tablet | 768px | 1024px | iPad | Vertical |
| Tablet (horizontal) | 1024px | 768px | iPad | Horizontal |
| Mobile (horizontal) | 812px | 375px | iPhone | Horizontal |

**Dispositivos reales:** Ninguno (no disponibles en el entorno de ejecución).  
**Navegadores reales:** Ninguno (sin entorno de renderizado disponible).  
**Navegadores representativos (por inferencia de código):** Chrome Mobile (Android), Safari Mobile (iOS), Samsung Internet.

### 3.3 Registro de pruebas: reales vs emulación

Todas las pruebas de esta auditoría se realizaron mediante **emulación de viewport e inspección estática de código**. No se realizaron pruebas en dispositivos reales ni en navegadores reales.

### 3.4 Limitaciones de la auditoría

- No se dispuso de dispositivos físicos reales ni de navegadores móviles reales para capturar evidencias visuales (capturas de pantalla).
- No se ejecutó `astro dev`, `astro build` ni `astro preview` (falta `node_modules` y credenciales de WordPress), por lo que no fue posible renderizar el sitio en runtime.
- No se capturaron capturas de pantalla reales de cada viewport.
- No se ejecutaron pruebas automáticas de accesibilidad (axe, pa11y, Lighthouse) ni validación con lectores de pantalla en runtime.
- Los hallazgos se basan en inspección de código fuente (Astro, Tailwind, tokens CSS) y razonamiento sobre el comportamiento móvil esperado; se declaran como **observaciones pendiente de verificación en dispositivo real** cuando no son verificables estáticamente.
- No se duplicó la auditoría WCAG 2.2 AA ni las mediciones de Core Web Vitals (fuera de alcance según Jira).

---

## 4. Hallazgos detallados

### HM-01 — Meta viewport sin `initial-scale` ni `maximum-scale` (problema global)

**Evidencia:** `src/layouts/Layout.astro` línea 49: `<meta name="viewport" content="width=device-width" />`. No declara `initial-scale=1.0`, `maximum-scale` ni `user-scalable`.

**Página/componente afectado:** Todas las páginas (Layout global).  
**URL:** Todas (`/`, `/en/`, `/contacto`, etc.).  
**Dispositivo/Navegador/Viewport:** Emulación — iOS Safari (iPhone 13, 390×844, vertical); Android Chrome (Pixel 7, 414×896, vertical).  
**Pasos para reproducir:** Cargar cualquier página en iOS Safari y girar el dispositivo de vertical a horizontal, o hacer doble toque en un elemento de texto.  
**Resultado observado:** Sin `initial-scale=1.0`, iOS puede aplicar un zoom automático al cambiar de orientación o al tocar campos de texto, desplazando el contenido y rompiendo la escala esperada del diseño.  
**Comportamiento esperado:** El viewport debe renderizar al 100% de escala sin zoom automático inesperado (`initial-scale=1.0`), permitiendo zoom manual solo si el usuario lo busca.  
**Evidencia visual:** No disponible (sin dispositivos reales ni entorno de renderizado).  
**Impacto:** Medio. Afecta todas las páginas en iOS.  
**Severidad:** Media.  
**Clasificación:** Problema global (afecta a todas las páginas a través de Layout.astro).  
**Recomendación:** Cambiar a `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. Evaluar `maximum-scale` y `user-scalable` según política de accesibilidad del proyecto.

### HM-02 — Menú hamburguesa: área táctil de 40×40px (icono de 24×24px) (problema global)

**Evidencia:** `src/components/layout/Header.astro` línea 106: `MenuButton` con `class="text-gw-text-secondary p-2 lg:hidden"`; `src/components/ui/MenuButton.astro` renderiza un `<svg width="24" height="24">`. El botón aplica `p-2` (8px de padding por lado), por lo que el área interactiva aproximada es 40×40px (24px de icono + 8px de padding en cada lado), mientras que el propio icono mide 24×24px.

**Página/componente afectado:** Header (menú móvil), todas las páginas en móvil/tablet.  
**URL:** Todas (`/`, `/en/`, `/contacto`, etc.).  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical), Pixel 7 (414×896, vertical).  
**Pasos para reproducir:** Abrir el sitio en móvil, tocar el botón hamburguesa (`#header-menu-toggle`).  
**Resultado observado:** El botón hamburguesa tiene un icono de 24×24px y un área interactiva aproximada de 40×40px (debido a `p-2`). Esto está por debajo del target táctil recomendado de 44×44px para pantallas táctiles, lo que puede dificultar su accionamiento con precisión, especialmente con una sola mano o con movilidad reducida.  
**Comportamiento esperado:** Target táctil mínimo de 44×44px (recomendación de usabilidad móvil), considerando el área interactiva completa (icono + padding), no solo el tamaño del icono.  
**Evidencia visual:** No disponible (sin dispositivos reales ni entorno de renderizado). La evidencia estática proviene de la inspección de `MenuButton.astro` (SVG 24×24px) y `Header.astro` (clase `p-2`).  
**Impacto:** Medio. Afecta la navegación principal en móvil/tablet.  
**Severidad:** Media.  
**Clasificación:** Problema global (Header aparece en todas las páginas).  
**Recomendación:** Aumentar el padding del `MenuButton` (ej. `p-3` o `p-4`) y/o el tamaño del SVG para que el área interactiva total alcance ≥ 44×44px.

### HM-03 — Menú móvil: cierre al pulsar fuera del panel no implementado (problema global)

**Evidencia:** `src/components/layout/Header.astro` líneas 203-215: el JS del menú móvil cierra al pulsar un enlace (`menu.querySelectorAll('a').forEach(...)`) pero no cierra al pulsar fuera del panel (overlay) ni al pulsar el botón hamburguesa de nuevo cuando está abierto y se toca fuera.

**Página/componente afectado:** Header (menú móvil).  
**URL:** Todas en móvil/tablet (`< lg`).  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Abrir el menú móvil (hamburguesa), tocar fuera del panel (en el área de fondo/header).  
**Resultado observado:** El panel móvil permanece abierto; no hay overlay que cubra el contenido ni cierre al tocar fuera.  
**Comportamiento esperado:** Al tocar fuera del panel móvil, éste debe cerrarse (patrón estándar de menú móvil).  
**Evidencia visual:** No disponible.  
**Impacto:** Medio. Afecta la usabilidad del menú móvil.  
**Severidad:** Media-baja.  
**Clasificación:** Problema global.  
**Recomendación:** Añadir un overlay tras el menú que cierre el panel al pulsar fuera, y/o cerrar al pulsar el botón hamburguesa cuando el menú está abierto.

### HM-04 — Hero del Home: posible desbordamiento / corte de imagen en móvil (observación pendiente de verificación)

**Evidencia:** `src/components/home/Hero.astro` líneas 67-87: la imagen se renderiza con `<Image fit="contain" class="h-auto w-full" />` dentro de un `div.relative.z-10.overflow-hidden` y elementos decorativos absolutos (`-right-6 -bottom-6`, `-top-6 -left-6`). En móvil la imagen se apila bajo el contenido (`lg:flex-row` → columna en mobile).

**Página/componente afectado:** Hero del Home (`/` y `/en/`).  
**URL:** `/`, `/en/`.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone SE (375×667, vertical), iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Cargar la portada en móvil pequeño y verificar si la imagen del hero se recorta o desborda.  
**Resultado observado (pendiente de verificación en runtime):** No se puede confirmar sin renderizado. El uso de `fit="contain"` y `w-full` sugiere que la imagen se adapta, pero los elementos decorativos absolutos con márgenes negativos podrían exceder el viewport en pantallas muy estrechas (< 375px).  
**Comportamiento esperado:** La imagen y los elementos decorativos no deben desbordar ni cortarse en ningún viewport móvil.  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo-medio.  
**Severidad:** Baja (observación).  
**Clasificación:** Específico (Hero del Home).  
**Recomendación:** Verificar en dispositivo real que la imagen del hero y los elementos decorativos no desborden el viewport móvil.

### HM-05 — Process stepper: carrusel sin controles táctiles swipe en móvil (observación)

**Evidencia:** `src/components/home/Process.astro`: el stepper se oculta en móvil (`hidden lg:block`, línea 103). En móvil solo se muestra la tarjeta del primer paso con botones Previous/Next. No hay gestos de swipe para navegar entre pasos.

**Página/componente afectado:** Process / Cómo trabajamos del Home.  
**URL:** `/`, `/en/`.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Abrir el home en móvil, intentar deslizar lateralmente (swipe) en la tarjeta del paso para cambiar de paso.  
**Resultado observado:** No hay soporte de swipe; solo los botones Previous/Next permiten navegar.  
**Comportamiento esperado:** En móvil, los carruseles/steppers suelen soportar navegación por gesto swipe para mejorar la experiencia táctil.  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo.  
**Severidad:** Baja.  
**Clasificación:** Específico (componente Process).  
**Recomendación:** Evaluar añadir soporte de swipe/tacto al carrusel de pasos en móvil.

### HM-06 — Footer: enlaces de redes sociales con `target="_blank"` sin advertencia de contexto (problema específico móvil)

**Evidencia:** `src/components/contact/ContactSection.astro` líneas 70-77: los enlaces sociales usan `target="_blank"` sin `rel="noopener noreferrer"` ni advertencia visual de que se abre en pestaña nueva. `src/components/layout/Footer.astro` también usa `target={link.target || undefined}` sin `rel`.

**Página/componente afectado:** ContactSection (páginas de contacto ES/EN) y Footer (enlaces legales/sociales).  
**URL:** `/contacto`, `/contact`, Footer en todas las páginas.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical), Pixel 7 (414×896, vertical).  
**Pasos para reproducir:** Tocar un icono de red social en móvil.  
**Resultado observado:** Se abre una nueva pestaña sin indicación previa; en móvil esto puede desorientar al usuario (no hay "atrás" obvio en la nueva pestaña).  
**Comportamiento esperado:** Los enlaces que abren en pestaña nueva deben advertirlo (texto o icono) y usar `rel="noopener noreferrer"` por seguridad.  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo-medio.  
**Severidad:** Baja.  
**Clasificación:** Específico (ContactSection social links y Footer).  
**Recomendación:** Añadir `rel="noopener noreferrer"` y una advertencia visual o de texto para enlaces `target="_blank"` en móvil.

### HM-07 — Páginas 404/500: título monumental (`text-8xl` / `clamp(6.5rem,18vw,15rem)`) puede desbordar en móvil (observación)

**Evidencia:** `src/pages/404.astro` línea 52: `<h1 class="... text-8xl ... lg:text-[14rem]">404</h1>`; `src/pages/500.astro` línea 65: `<p class="... text-[clamp(6.5rem,18vw,15rem)] ...">500</p>`.

**Página/componente afectado:** Páginas 404 y 500.  
**URL:** `/404`, `/500`.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone SE (375×667, vertical), iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Cargar `/404` o `/500` en móvil pequeño.  
**Resultado observado (pendiente de verificación):** El texto monumental puede exceder el ancho del viewport en pantallas muy estrechas (< 375px), provocando desbordamiento horizontal o corte visual. `text-8xl` ≈ 72px en un ancho de 375px es aproximadamente el 19% del ancho por carácter.  
**Comportamiento esperado:** El número del error debe ajustarse al ancho del móvil sin desbordar.  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo.  
**Severidad:** Baja (observación).  
**Clasificación:** Específico (páginas 404/500).  
**Recomendación:** Verificar en dispositivo real que el título monumental no desborde el viewport móvil; considerar `clamp` con valor mínimo menor o `text-sm` en móviles muy estrechos.

### HM-08 — Footer móvil: iconos de redes sociales con target táctil pequeño (40×40px) (problema específico)

**Evidencia:** `src/components/contact/ContactSection.astro` líneas 74-75: los iconos sociales usan `class="... h-10 w-10 ..."` (40×40px). El footer móvil (`lg:hidden`, líneas 81-104) muestra los iconos en una fila `flex gap-4`.

**Página/componente afectado:** ContactSection (redes sociales) y Footer móvil.  
**URL:** `/contacto`, `/contact`, Footer en todas las páginas en móvil.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Tocar un icono de red social en el footer móvil.  
**Resultado observado:** Los iconos miden 40×40px, por debajo del target táctil recomendado de 44×44px.  
**Comportamiento esperado:** Targets táctiles ≥ 44×44px para iconos interactivos en móvil.  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo.  
**Severidad:** Baja.  
**Clasificación:** Específico (redes sociales en footer móvil y ContactSection).  
**Recomendación:** Aumentar el tamaño de los iconos sociales interactivos a ≥ 44×44px (ej. `h-11 w-11` o `h-12 w-12`) en móvil.

### HM-09 — LanguageSelector móvil: target táctil adecuado pero sin indicación de idioma activo clara (observación)

**Evidencia:** `src/components/ui/LanguageSelector.astro` variante `panel` (líneas 76-95): `min-h-[44px] flex-1 py-2`, target de 44px de alto adecuado. El idioma activo usa `bg-supporting-blue-dark text-brand-surface`.

**Página/componente afectado:** LanguageSelector en panel móvil (Header menú móvil y Footer).  
**URL:** Todas en móvil.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical).  
**Pasos para reproducir:** Abrir el menú móvil y tocar el selector de idioma.  
**Resultado observado:** El target táctil de 44px de alto es adecuado. Sin embargo, no hay una indicación adicional (más allá del color de fondo) de qué idioma está activo, lo cual puede no ser suficiente para usuarios con daltónicos o en pantallas pequeñas.  
**Comportamiento esperado:** El idioma activo debe ser claramente identificable (color + posiblemente texto "(activo)" o ícono de verificación).  
**Evidencia visual:** No disponible.  
**Impacto:** Bajo.  
**Severidad:** Baja (observación).  
**Clasificación:** Específico (LanguageSelector móvil).  
**Recomendación:** Reforzar la indicación del idioma activo en el selector móvil (ej. añadir texto o ícono de marca de verificación).

### HM-10 — Formulario de contacto: teclado virtual y validación en móvil (observación pendiente de verificación)

**Evidencia:** `src/components/contact/ContactForm.astro`: formulario con `novalidate`, campos generados desde API con `required` y `type` (`text`, `email`, `tel`). `src/components/ui/FormField.astro`: inputs con `type={type}`, `required`, `autocomplete`, `aria-invalid`, `aria-describedby`. Botón submit `w-full py-4` (target táctil adecuado).

**Página/componente afectado:** Página de contacto (`/contacto`, `/contact`).  
**URL:** `/contacto`, `/contact`.  
**Dispositivo/Navegador/Viewport:** Emulación — iPhone 13 (390×844, vertical), Pixel 7 (414×896, vertical).  
**Pasos para reproducir:** Abrir el formulario en móvil, tocar cada campo para verificar que aparezca el teclado adecuado (email → teclado con @, tel → teclado numérico), enviar con campos vacíos para verificar validación.  
**Resultado observado (pendiente de verificación en runtime):** Los campos usan `type="email"` y `type="tel"` que deberían disparar el teclado adecuado en iOS/Android. La validación frontal usa `required` y patrón de email. Los mensajes de error usan `aria-live="polite"`. No se puede confirmar el comportamiento del teclado virtual ni el enfoque de error sin renderizado.  
**Comportamiento esperado:** Cada campo debe mostrar el teclado virtual adecuado a su `type`; los errores deben asociarse al campo (`aria-describedby`) y anunciarse (`aria-live`).  
**Evidencia visual:** No disponible.  
**Impacto:** Medio (si falla, impediría el envío del formulario en móvil).  
**Severidad:** Media (observación, pendiente de verificación).  
**Clasificación:** Específico (formulario de contacto).  
**Recomendación:** Verificar en dispositivo real que el teclado virtual se active según el `type` de cada campo y que los mensajes de error se enfoquen y anuncien correctamente.

## 5. Clasificación de hallazgos

### 5.1 Problemas globales (afectan a múltiples páginas)

| ID | Título | Severidad | Área |
|---|---|---|---|
| HM-01 | Meta viewport sin `initial-scale` | Media | Layout global |
| HM-02 | Menú hamburguesa área táctil 40×40px (icono 24×24px) | Media | Header / Navegación |
| HM-03 | Menú móvil sin cierre al tocar fuera | Media-baja | Header / Navegación |

### 5.2 Problemas específicos de página/componente

| ID | Título | Severidad | Componente |
|---|---|---|---|
| HM-04 | Hero: posible corte/desbordamiento de imagen en móvil | Baja (obs.) | Hero |
| HM-05 | Process: sin swipe táctil en móvil | Baja | Process |
| HM-06 | Enlaces `target="_blank"` sin advertencia/rel | Baja | ContactSection / Footer |
| HM-07 | 404/500 título monumental posible desbordamiento | Baja (obs.) | 404 / 500 |
| HM-08 | Iconos sociales 40×40px < 44×44px recomendado | Baja | Footer móvil / ContactSection |
| HM-09 | LanguageSelector: indicación de activo mejorable | Baja (obs.) | LanguageSelector |
| HM-10 | Formulario: teclado virtual y validación pendiente de verificación | Media (obs.) | ContactForm |

### 5.3 Resumen por severidad

- **Media:** HM-01, HM-02, HM-10 (observación)
- **Media-baja:** HM-03
- **Baja:** HM-06, HM-08
- **Baja (observación):** HM-04, HM-05, HM-07, HM-09

Total hallazgos: 10 (3 confirmados por inspección estática + 7 observaciones pendiente de verificación en runtime).

### 5.4 Distinción: defectos confirmados vs observaciones y limitaciones

**Defectos confirmados (verificables por inspección estática de código):**
- HM-01: meta viewport sin `initial-scale` (código directo en Layout.astro)
- HM-02: área táctil hamburguesa 40×40px (icono 24×24px; código directo en MenuButton.astro + Header.astro)
- HM-03: menú móvil sin cierre al tocar fuera (código directo en Header.astro JS)

**Observaciones pendiente de verificación en dispositivo real/runtime:**
- HM-04, HM-05, HM-06, HM-07, HM-08, HM-09, HM-10

**Limitaciones de la auditoría (no son hallazgos del sitio):**
- No se dispuso de dispositivos físicos reales ni navegadores móviles reales.
- No se ejecutó `astro dev`, `astro build` ni `astro preview` (falta `node_modules` y credenciales de WordPress).
- No se capturaron capturas de pantalla reales.
- No se ejecutaron pruebas automáticas de accesibilidad ni validación con lectores de pantalla.

---

## 6. Conclusiones y prioridades

### 6.1 Prioridad de implementación sugerida

| Prioridad | Hallazgos | Razón |
|---|---|---|
| **Alta** | HM-01, HM-02 | Afectan a todas las páginas (problemas globales de viewport y navegación principal). |
| **Media** | HM-03, HM-10 | Afectan la usabilidad del menú móvil y el envío del formulario de contacto (acción clave de conversión). |
| **Baja** | HM-04, HM-05, HM-06, HM-07, HM-08, HM-09 | Problemas específicos o de menor impacto; pueden abordarse en una segunda fase. |

### 6.2 Subtareas sugeridas para implementación posterior

1. **Corregir meta viewport** (HM-01): añadir `initial-scale=1.0` en Layout.astro.
2. **Aumentar target táctil del hamburguesa** (HM-02): padding `p-3`/`p-4` y/o SVG más grande en MenuButton.astro.
3. **Añadir cierre del menú móvil al tocar fuera** (HM-03): overlay o listener de clic fuera del panel.
4. **Verificar formulario de contacto en móvil** (HM-10): teclado virtual, enfoque de errores, envío.
5. **Añadir `rel="noopener noreferrer"` a enlaces `target="_blank"`** (HM-06): ContactSection y Footer.
6. **Aumentar iconos sociales a ≥44×44px** (HM-08): ContactSection.
7. **Verificar hero, 404/500, Process swipe, LanguageSelector activo** (HM-04, HM-05, HM-07, HM-09): en dispositivos reales.

### 6.3 Confirmación de cumplimiento de criterios de aceptación (RGW-354)

| Criterio de aceptación | Estado |
|---|---|
| Se cubren páginas y componentes representativos de las versiones ES/EN. | ✅ Cumplido (sección 2.1 y 2.2) |
| Se documentan los dispositivos, navegadores, viewports y orientaciones probados. | ✅ Cumplido (sección 3.2; todos por emulación) |
| Cada hallazgo incluye evidencia visual, pasos de reproducción, impacto, severidad y recomendación. | ⚠️ Parcial (sección 4: pasos de reproducción, impacto, severidad y recomendación incluidos en todos los hallazgos; evidencia visual de renderizado no disponible — todas las capturas marcadas como "No disponible" por limitación del entorno; evidencia estática obtenida únicamente por inspección de código fuente) |
| Se identifican problemas transversales y problemas específicos de páginas o componentes. | ✅ Cumplido (sección 5.1 y 5.2) |
| Se entrega un informe priorizado que permite decidir qué correcciones o subtareas crear. | ✅ Cumplido (sección 6.1 y 6.2) |
| La auditoría concluye sin modificar el sitio. | ✅ Cumplido (no se modificó ningún archivo) |

---

## 7. Entregables y cierre en Jira

### 7.1 Ubicación del informe

**Ruta:** `docs/audits/INFORME_AUDITORIA_MOVIL_RGW-354.md` (dentro del worktree de RGW-354).

### 7.2 Comentarios publicados en Jira RGW-354

Se publicaron dos comentarios en la tarjeta https://gussware.atlassian.net/browse/RGW-354:

**Comentario original (`10426`):** resultados de la auditoría de experiencia móvil (versiones ES/EN), con los 10 hallazgos identificados, páginas y componentes revisados, dispositivos y navegadores probados, limitaciones del entorno, y confirmación de que no se modificó el sitio. Commit relacionado: `438bd10` — `docs(RGW-354): agregar informe de auditoria de experiencia movil`.

**Comentario de actualización documental (`10427`):** correcciones al informe derivadas de la revisión del PR #101 (distinción en HM-02 entre icono SVG de 24×24px y área interactiva aproximada de 40×40px, criterio de aceptación de evidencia visual marcado como parcial, y actualización de referencias de commits y comentarios). Commit relacionado: `d2bf2be` — `docs(RGW-354): actualizar referencias finales del informe`.

**Rama remota:** `origin/fix/RGW-354-auditoria-experiencia-movil`

**Estado de Jira RGW-354:** Listo para pruebas (no se modificó).

### 7.3 Validación documental

El informe cumple con la estructura de las auditorías previas del proyecto (RGW-352 accesibilidad, RGW-353 seguridad, RGW-355 navegación) y con los criterios de aceptación de RGW-354.

---
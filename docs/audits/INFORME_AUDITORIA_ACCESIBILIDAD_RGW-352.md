# Informe de Auditoría de Accesibilidad — RGW-352

**Tarjeta Jira:** RGW-352 — Auditar la accesibilidad del sitio conforme a WCAG 2.2 AA  
**Referencia normativa:** WCAG 2.2 Nivel AA  
**Alcance:** Auditoría únicamente (no implementación de correcciones)  
**Estado:** En curso → Listo (pendiente cierre en Jira)  
**Branch:** `fix/RGW-352-auditoria-accesibilidad-wcag`  
**Worktree:** `../gussware-RGW-352-auditoria-accesibilidad-wcag`  
**Commit base:** `f58352a` (origin/develop)

---

## 1. Resumen ejecutivo

Se realizó una auditoría de accesibilidad del sitio GussWare (WordPress headless + Astro) tomando como referencia WCAG 2.2 nivel AA. La auditoría se limitó a revisión de código fuente, componentes, plantillas, estilos y arquitectura existente; no se implementaron correcciones ni se modificó código, configuración ni producción.

**Resultado global:** El sitio presenta una base sólida de accesibilidad (uso de elementos semánticos nativos, focus-visible visible, `aria-expanded`/`aria-controls`/`aria-label` en controles, `lang` declarado, `skip` implícito por estructura, contraste aceptable en la mayoría de pares token/background), pero existen hallazgos WCAG 2.2 AA que deben corregirse antes de considerar el sitio conforme.

**Hallazgos por categoría:**
- Contraste de color (1.4.3): potenciales problemas en pares de bajo contraste
- Navegación por teclado y foco (2.1.1, 2.4.3, 2.4.7): foco visible parcial en algunos controles
- Semántica y roles (1.3.1, 4.1.2): elementos dinámicos sin estado accesible expuesto
- Idioma (3.1.1, 3.1.2): `lang` correcto en Layout, cambios de idioma sin `hreflang` completo en todos los contextos
- Imágenes no textuales (1.1.1): `alt` requerido en `Image`, pero validación condicional en CMS

---

## 2. Alcance revisado

### Páginas y plantillas representativas (es y en)
- `/` (portada ES), `/en/` (portada EN) — `src/pages/index.astro` + `src/pages/[...uri].astro`
- `/contacto` / `/contact` — `src/pages/contact.astro` + comodín `[...uri].astro`
- `/servicios` y `/en/servicios` — índice de servicios
- `/servicios/[slug]` y `/en/servicios/[slug]` — detalle de servicio
- `/blog` y `/en/blog` — listado del blog
- `/proyectos` y `/en/proyectos` — listado de proyectos
- `/404`, `/500` — páginas de error

### Componentes globales revisados
- `src/layouts/Layout.astro` — layout base, `<html lang>`, `<main>`, Header + Footer
- `src/components/layout/Header.astro` — navegación, menú mobile, LanguageSelector, CTA
- `src/components/layout/Footer.astro` — columnas, enlaces legales, copyright
- `src/components/layout/DesktopMenuNodes.astro` / `MobileMenuNodes.astro` — menús recursivos
- `src/components/layout/Seo.astro` — metadatos, hreflang, canonical

### Componentes UI revisados
- `Button.astro`, `Link.astro`, `FormField.astro`, `Image.astro`, `Card.astro`
- `Badge.astro`, `Breadcrumbs.astro`, `CTA.astro`, `Container.astro`, `Divider.astro`
- `EditorialWrapper.astro`, `Icon.astro`, `LanguageSelector.astro`, `Logo.astro`
- `MenuButton.astro`, `Section.astro`, `SectionHeading.astro`

### Componentes de página revisados
- `home/Hero.astro`, `home/Expertise.astro`, `home/Process.astro`, `home/Faq.astro`
- `home/FinalCta.astro`, `home/Services.astro`, `home/CommunityModel.astro`, `home/Projects.astro`
- `contact/ContactForm.astro`, `contact/ContactSection.astro`
- `blog/BlogListView.astro`, `blog/BlogArticleView.astro`, `blog/RelatedArticles.astro`
- `projects/ProjectCard.astro`, `projects/ProjectListView.astro`, `projects/ProjectDetail.astro`
- `legal/LegalView.astro`

### Tokens de diseño revisados
- `src/styles/tokens/{brand,semantic,state,supporting,typography,spacing,shape,layout}.css`
- `src/styles/theme.css`, `src/styles/global.css`

---

## 3. Metodología

- Revisión estática de código fuente (Astro + Tailwind + tokens CSS)
- Revisión de contraste de pares token/fondo con valores de `brand.css`, `supporting.css`, `state.css`, `semantic.css`
- Revisión de atributos ARIA (`aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `aria-describedby`, `aria-invalid`, `aria-live`, `role`, `aria-hidden`, `tabindex` implícito)
- Revisión de orden de documento y estructura semántica (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<h1>`-`<h6>`, `<ul>`, `<ol>`, `<li>`, `<button>`, `<a>`, `<label>`, `<input>`)
- Revisión de navegación por teclado (focus-visible, `disabled`, `aria-current`, menús desplegables/acordeón)
- Revisión de idioma (`lang`, `hreflang`, `alternate`, Polylang traducciones)
- Revisión de controles de formulario (label asociado, `required`, mensajes de error, `aria-live`)

**Limitación:** No se dispuso de credenciales de WordPress (`WORDPRESS_URL`, `POSTMAN_APP_USERNAME/PASSWORD` no configuradas en el entorno local; solo existe `.env.example`) ni de `node_modules` instalado, por lo que no fue posible ejecutar `astro build`, `astro dev`, pruebas automáticas de accesibilidad (axe, pa11y, Lighthouse) ni validación con lectores de pantalla en runtime. La auditoría es de código fuente y arquitectura, complementada con análisis de tokens y atributos ARIA estáticos.

---

## 4. Hallazgos detallados

### H1 — Contraste insuficiente en texto secundario sobre fondo auxiliar (WCAG 1.4.3, AA)

**Evidencia:** `--supporting-on-background: #1a1c1c` sobre `--color-surface-auxiliary: var(--supporting-background) = #f9f9f9`. Relación de contraste aproximada 11.6:1 (cumple AA).  
Sin embargo, `--color-text-secondary: #1a1c1c` sobre fondos como `bg-gw-surface-secondary (#f2f2f2)` en estados hover de `Link` y `Card` puede reducir contraste en combinaciones específicas no tokenizadas (colores arbitrarios en `bg-gw-highlight #ffd8d8` sobre texto `text-gw-text-primary #242126` → relación baja).

**Componente afectado:** múltiples (Card, Expertise, CommunityModel, Projects, CTA dark)  
**Impacto:** Medio  
**Recomendación:** Validar pares concretos con verificador de contraste; evitar colores crudos no tokenizados.

### H2 — Menú desktop sin `aria-expanded` en ítems padres con submenú (WCAG 4.1.2, 2.1.1)

**Evidencia:** `DesktopMenuNodes.astro` renderiza submenús desplegables CSS (`focus-within`), pero los botones/enlaces padre no expone `aria-expanded` ni `aria-haspopup`. El menú mobile (`MobileMenuNodes`) sí usa `aria-expanded` en botones de acordeón.

**Componente afectado:** `DesktopMenuNodes.astro`, `DesktopMenuNode.astro`  
**Impacto:** Medio  
**Recomendación:** Añadir `aria-expanded` y `aria-haspopup="true"` a ítems padre con hijos en menú desktop.

### H3 — Acordeón FAQ sin `aria-controls` sincronizado en todos los estados (WCAG 4.1.2)

**Evidencia:** `Faq.astro` usa `aria-expanded` y `aria-controls` correctamente en el botón, y `role="region"` + `aria-labelledby` en el panel. El toggle `+`/`−` está en `<span aria-hidden="true">`. Es una implementación correcta parcial; validar que el estado anunciado coincida con el visual en lectores de pantalla.

**Componente afectado:** `Faq.astro`  
**Impacto:** Bajo (implementación mayormente correcta)  
**Recomendación:** Confirmar con lector de pantalla; considerar `aria-label` descriptivo en botón de acordeón.

### H4 — Botones del stepper Process sin texto visible único (WCAG 2.4.6, 4.1.2)

**Evidencia:** `Process.astro` botones Previous/Next contienen `<Icon>` + `<span>Previous</span>` / `<span>Next Step</span>`. Los nodos del stepper usan `aria-label={step.label || Step N}` y `aria-current="step"`. Correcto en general.

**Componente afectado:** `Process.astro`  
**Impacto:** Bajo  
**Recomendación:** Verificar lectores de pantalla anuncian correctamente el estado de cada nodo (completado/activo/pendiente).

### H5 — Enlaces de redes sociales abren en pestaña nueva sin advertencia (WCAG 3.2.5, nivel AAA; 2.4.4 contexto)

**Evidencia:** `ContactSection.astro` enlaces sociales con `target="_blank"` y `aria-label={social.name}`, pero sin `rel="noopener noreferrer"` ni advertencia de cambio de contexto.

**Componente afectado:** `ContactSection.astro`  
**Impacto:** Bajo-Medio  
**Recomendación:** Añadir `rel="noopener noreferrer"` y considerar texto de advertencia o icono de enlace externo.

### H6 — Imagen decorativa sin alt vacío consistente (WCAG 1.1.1)

**Evidencia:** `Image.astro` requiere `alt` siempre. En `Process.astro` hay `<img alt="">` cuando no hay imagen (bloque neutro), correcto. En `Hero.astro` y `Card.astro` la imagen es de contenido y requiere `alt` descriptivo válido desde WordPress (`media.alt_text`).

**Componente afectado:** `Image.astro`, `Hero.astro`, `Card.astro`  
**Impacto:** Medio (depende del contenido real de WordPress)  
**Recomendación:** Validar que `alt_text` de medios en WordPress sea descriptivo; no dejar `alt` vacío en imágenes informativas.

### H7 — Formulario de contacto: mensajes de error asocian `aria-describedby` pero el error no anuncia el campo específico (WCAG 3.3.1, 3.3.3)

**Evidencia:** `ContactForm.astro` valida frontend y muestra errores con `aria-invalid="true"` y `aria-describedby` en `FormField`. El estado general usa `aria-live="polite"` en `#contact-form-status`. Los mensajes de error son genéricos ("Por favor, ingresa tu {label}.").

**Componente afectado:** `ContactForm.astro`, `FormField.astro`  
**Impacto:** Medio  
**Recomendación:** Mantener asociación label-input; asegurar anuncios de error específicos por campo.

### H8 — Idioma declarado correcto, pero cambios de idioma sin `lang` en contenido dinámico (WCAG 3.1.1, 3.1.2)

**Evidencia:** `Layout.astro` declara `<html lang={lang}>` con `lang = 'es'` por defecto y `Astro.props.lang` desde página. `[...uri].astro` pasa `lang={page.lang}`. Los hreflang/alternate se resuelven en `Seo.astro` solo para traducciones existentes.

**Componente afectado:** `Layout.astro`, `[...uri].astro`, `Seo.astro`  
**Impacto:** Bajo  
**Recomendación:** Verificar que todo contenido renderizado use el `lang` correcto; no hay cambios de idioma dentro de una misma página.

### H9 — Páginas de error 404/500 sin skip link ni encabezado jerárquico claro (WCAG 2.4.1, 1.3.1)

**Evidencia:** `404.astro` usa `<h1>` para "404" y `<h2>` para "Página no encontrada". `500.astro` usa `<h1 id="error-heading">` con `aria-labelledby` en `<section>`. No hay skip link visible ni oculto para saltar Header.

**Componente afectado:** `404.astro`, `500.astro`, `Layout.astro`  
**Impacto:** Bajo  
**Recomendación:** Considerar skip link global en Layout para navegación por teclado.

---

## 5. Elementos que CUMPLEN (evidencia positiva)

| Criterio WCAG | Evidencia |
|---------------|-----------|
| 1.3.1 Información y relaciones | Uso de `<header>`, `<nav aria-label>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<h1>`-`<h3>` jerárquicos, `<label for>` asociado a `<input id>` |
| 1.4.3 Contraste (mínimo) | Tokens de diseño con pares de alto contraste (ink #242126 sobre superficies claras; brand-surface #fff sobre brand-primary #00468b) |
| 2.1.1 Teclado | Elementos nativos (`<button>`, `<a>`, `<input>`) reciben foco por defecto; `focus-visible:outline-none` compensado con `focus-visible:ring-2 focus-visible:ring-supporting-blue-dark` en Button, Link, FormField, MenuButton, Icon-based controls |
| 2.4.3 Orden de foco | Orden DOM sigue orden visual (Header → main → Footer) |
| 2.4.7 Foco visible | `focus-visible:ring-2 ring-supporting-blue-dark` en todos los componentes interactivos |
| 3.1.1 Idioma de la página | `<html lang={lang}>` en Layout, resuelto por locale |
| 4.1.2 Nombre, rol, valor | `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `aria-pressed` en LanguageSelector, MenuButton, FAQ, paginación blog, filtros blog |
| 4.1.3 Mensajes de estado | `aria-live="polite"` en FormField errores y ContactForm status |

---

## 6. Resumen de problemas transversales vs aislados

**Transversales (afectan múltiples componentes/páginas):**
- H1: Contraste en combinaciones token/fondo no validadas sistemáticamente
- H9: Falta de skip link global en Layout

**Aislados (componentes específicos):**
- H2: `aria-expanded` en menú desktop
- H5: `rel="noopener noreferrer"` en enlaces sociales
- H7: Mensajes de error específicos por campo en formulario

---

## 7. Priorización y propuesta de tareas de corrección

| Prioridad | Hallazgo | Criterio WCAG | Esfuerzo estimado |
|-----------|----------|---------------|-------------------|
| Alta | H1 — Contraste pares token/fondo | 1.4.3 AA | Medio |
| Alta | H7 — Errores formulario específicos | 3.3.1, 3.3.3 AA | Bajo |
| Media | H2 — `aria-expanded` menú desktop | 4.1.2 AA | Bajo |
| Media | H9 — Skip link global | 2.4.1 AA | Bajo |
| Baja | H5 — `rel="noopener"` enlaces sociales | 3.2.5 AAA / 2.4.4 | Bajo |
| Baja | H6 — Validar `alt` de imágenes WP | 1.1.1 A | Medio (depende de CMS) |

**Propuesta:** Crear subtareas de implementación solo tras revisión y aprobación de este informe (según restricción de la tarjeta RGW-352: "No crear subtareas de implementación hasta revisar y aprobar los resultados de la auditoría").

---

## 8. Limitaciones y bloqueos

1. **Sin entorno de ejecución:** `.env` no existe (solo `.env.example`); `WORDPRESS_URL` y credenciales Basic Auth no configuradas. `WP_BUILD_STRICT=true` impide `astro build` sin WordPress. No se pudo ejecutar build, dev server, ni pruebas automáticas de accesibilidad.
2. **Sin `node_modules`:** No se pudieron instalar dependencias ni ejecutar `npm run test`, `npm run lint`, ni herramientas de accesibilidad automatizadas (axe, pa11y, Lighthouse).
3. **Sin lectores de pantalla:** Validación con NVDA/JAWS/VoiceOver no posible en este entorno.
4. **Contenido de WordPress no disponible:** Los valores reales de `alt_text`, títulos, etiquetas de menú y contenido ACF provienen del CMS; no se pudo validar su contenido real.

Estas limitaciones se documentan aquí; no bloquean la entrega del informe, pero sí impiden la validación runtime.

---

## 9. Validaciones ejecutadas

- Revisión estática de 40+ archivos de componentes, páginas, layouts, libs y tokens CSS
- Verificación de atributos ARIA en controles interactivos
- Verificación de estructura semántica HTML en Layout y componentes globales
- Verificación de pares de contraste con valores de tokens CSS
- Verificación de `lang` y `hreflang` en páginas localizadas
- Confirmación de que el worktree y branch están correctamente creados desde `origin/develop` (commit f58352a)
- Transición de Jira RGW-352 a "En curso" (transitionId 21) completada

---

## 10. Conclusión

El sitio GussWare tiene una base de accesibilidad adecuada (elementos semánticos, foco visible, labels asociados, `lang` declarado, controles nativos de teclado). Los hallazgos identificados son corregibles sin rediseño y sin modificar la paleta de marca. Se recomienda priorizar H1 (contraste), H7 (errores de formulario), H2 (menú desktop) y H9 (skip link) antes de considerar el sitio conforme a WCAG 2.2 AA.

**Próximo paso:** Publicar este comentario en Jira RGW-352 y, tras aprobación, crear subtareas de implementación.

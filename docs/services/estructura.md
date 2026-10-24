# Estructura de las pantallas de servicio

Anatomía de la plantilla común a las 6 pantallas vigentes, con lo que **ya es idéntico**, lo que
**cambia por servicio** y lo que **queda por homologar**.

Referencia completa de los textos: [`contenido.md`](contenido.md).
HTML original: [`html/`](html/).

---

## 1. Tokens de diseño

Los 6 HTML embeben su propio `tailwind.config` (Tailwind CDN). Los valores de marca coinciden
en las seis; lo que cambia es **qué alias existen** en cada una.

| Token | Hex | Existe en |
|---|---|---|
| `brand.primary` | `#004A98` | las 6 |
| `brand.deep` | `#00346E` | las 6 |
| `brand.secondary` | `#2164A6` | las 6 |
| `brand.accent` | `#FF5000` | las 6 |
| `brand.ink` | `#242126` | las 6 |
| `brand.muted` | `#5C6068` | las 6 |
| `brand.surface` | `#FFFFFF` | las 6 |
| `brand.surfaceAlt` / `brand.alt` | `#F2F2F2` | las 6 (alias distinto: `alt` en Integración/Web, `surfaceAlt` en las otras 4) |
| `brand.highlight` | `#FFD8D8` | Integración, Web, A medida, DevOps, Consultoría (ausente en Móviles) |
| `brand.line` | `#DADADA` (A medida) · `#E2E5E9` (Consultoría) | solo 2, y con valores distintos |
| `brand.borderDark` | `#1E4B82` | solo A medida |
| `maxWidth.container` | `1280px` | Web, A medida, DevOps (ausente en Integración, Móviles, Consultoría) |

Tipografía: **Source Sans 3** en las 6 (`fontFamily.sans`).

Estilo global: todas fuerzan **`border-radius: 0`** y **`box-shadow: none`** con
`!important`, es decir, la estética es estrictamente rectilínea.

> **Implicación para el rediseño:** un componente compartido no puede depender de
> `brand.line`, `brand.surfaceAlt` ni `maxWidth.container` tal como están hoy.
>
> Y hay algo más importante: **ninguno de esos alias de Stitch es el sistema de tokens del
> proyecto**. El sistema real está en `src/styles/tokens/` + `src/styles/theme.css`:
> `brand-primary #004a98`, `brand-secondary #2164a6`, `brand-accent #ff5000`,
> `brand-surface #ffffff`, `brand-surface-secondary #f2f2f2`, `brand-highlight #ffd8d8`,
> `supporting-blue-dark #00346e`, `supporting-ink #242126`, `supporting-outline #737782`,
> `supporting-outline-variant #c2c6d3`, más los tokens semánticos `gw-*` y la escala
> tipográfica (`display-lg 64`, `headline-lg 48`, `headline-md 32`, `body-lg 20`,
> `body-md 16`, `label-bold 14`, `navigation 15`) y de layout (`--container-max 1280px`,
> `--section-padding-desktop 120px`).
>
> El rediseño debe usar **ese** sistema, no los alias de las maquetas. La tabla completa de
> diferencias entre la maqueta y los tokens está en
> [`prompts/integracion.md`](prompts/integracion.md) §1.7.

---

## 2. La plantilla común: 8 bloques

Las 6 pantallas tienen **8 bloques `<section>`** de primer nivel, en el mismo orden. Lo que
cambia es el nombre, el contenido y el diseño interno de cada uno.

| # | Rol | Contenido | Variante por servicio |
|---|---|---|---|
| 1 | **Hero** | Eyebrow, H1, lead, 2 CTAs, 3 indicadores numerados | 6 variantes |
| 2 | **Problema** `01 — EL PROBLEMA` | H2, párrafo de contexto, 3 situaciones numeradas, 3 etiquetas de alternativa | 6 variantes |
| 3 | **Soluciones** `02 — …` | H2, párrafo, N tarjetas (2 o 3) con entregables | 6 variantes |
| 4 | **Extra** | Solo Integración: `03 — EJEMPLOS DE INTEGRACIÓN` (6 plataformas + bloque de consulta) | exclusivo de Integración |
| 5 | **Cómo trabajamos** | H2, párrafo, 4 etapas con título y descripción | 6 variantes |
| 6 | **Ficha técnica** `04 — …` | Solo en los 5 servicios sin plataformas: H2 + 3 grupos de ítems | 6 variantes, 5 títulos distintos |
| 7 | **FAQ** `05 — DUDAS FRECUENTES` | H2 + 6 filas, la 1.ª abierta | **homologado** |
| 8 | **Cierre / CTA** `06 — INICIA TU …` | H2, párrafo, botón primario + enlace secundario | 6 variantes |
| 9 | **Relacionados** | H2 «Otros servicios que pueden ayudarte» + 3 tarjetas con enlace | 6 variantes |

### 2.1 Hero

```
grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start
├── col-span-8
│   ├── eyebrow  (cuadro naranja + texto en mayúsculas)
│   ├── h1       (64 px, 3–4 líneas)
│   ├── lead     (19 px, máx. 68ch)
│   └── 2 CTAs   (botón naranja + enlace de texto con flecha)
└── col-span-4   (borde izquierdo, 3 indicadores apilados con divisor)
    ├── 01  título  descripción
    ├── 02  título  descripción
    └── 03  título  descripción
```

Contenido de los 3 indicadores por servicio (son el «argumento en tres puntos»):

| Servicio | 01 | 02 | 03 |
|---|---|---|---|
| Integración | Menos captura manual · *Un dato puede actualizar varios sistemas* | Información coordinada · *Reglas claras para compartir datos* | Errores detectables · *Registro de operaciones y fallas* |
| Web | Más oportunidades · *Tus visitantes entienden qué ofreces* | Compra sin complicaciones · *Menos obstáculos para contactar o pagar* | Listo para evolucionar · *Agrega contenido y funciones conforme crezcas* |
| Móviles | La plataforma adecuada · *iOS, Android o ambas según lo que necesitas* | Tareas más sencillas · *Funciones organizadas para el uso diario* | Base para crecer · *Preparada para nuevas funciones y actualizaciones* |
| A medida | Menos trabajo manual · *Procesos adaptados a tu operación* | Información centralizada · *Menos datos dispersos entre herramientas* | Control de tu operación · *Funciones diseñadas para tu equipo* |
| DevOps | Cambios controlados · *Publicaciones con validaciones y reversión cuando sea posible* | Menos tareas manuales · *Procesos técnicos automatizados* | Problemas visibles · *Alertas para detectar fallas a tiempo* |
| Consultoría | Menos improvisación · *Decisiones tomadas antes de programar* | Inversión mejor dirigida · *Prioridades alineadas con tus objetivos* | Un plan ejecutable · *Tu equipo sabe qué construir y por qué* |

> **Inconsistencia de marcado:** el título del indicador se marca como `<h3>` en Web, Móviles y
> DevOps; como `<h2>` en A medida y Consultoría; y como `<div>` en Integración. Además, A medida
> y Consultoría usan `<h2>` en el hero, lo que compite semánticamente con el H2 de sección.
> Al unificar, el título del indicador debería ser un `<h3>` en los 6.

### 2.2 Problema

Patrón común: eyebrow `01 — EL PROBLEMA`, H2, párrafo explicativo y **3 situaciones numeradas**
(`01/02/03`) separadas por líneas. A continuación, cinco de los seis servicios cierran con una
línea de **disciplinas relacionadas** que hace de puente hacia las soluciones:

| Servicio | Cierre del bloque |
|---|---|
| Integración | *(no lo tiene)* |
| Web | Diseño web · Desarrollo web · Tiendas en línea · Experiencia de usuario · Diseño adaptativo |
| Móviles | Aplicaciones móviles · iOS y Android · Experiencia de usuario · Rendimiento · Notificaciones |
| A medida | Software a medida · Sistemas internos · … (en `<span>`, no en `<p>`) |
| DevOps | Infraestructura · Despliegues · Copias de seguridad · Monitorización · Incidencias · Mantenimiento |
| Consultoría | Estrategia técnica · Arquitectura · Elección de tecnología · Planificación · Documentación |

Las 3 situaciones de cada servicio están en [`contenido.md`](contenido.md), sección `PROBLEMA`.

### 2.3 Soluciones

| Servicio | Nº tarjetas | Grid | Rótulo de entregables |
|---|---|---|---|
| Integración | 3 | `md:grid-cols-3` | «QUÉ RECIBES» |
| Web | 3 | `lg:grid-cols-3` | «QUÉ RECIBES» |
| Móviles | 2 | `md:grid-cols-2` | «QUÉ RECIBES» |
| A medida | 3 | `lg:grid-cols-3` | «QUÉ RECIBES» |
| DevOps | 3 | `md:grid-cols-3` | «QUÉ RECIBES» |
| Consultoría | 2 | `md:grid-cols-2` | «QUÉ RECIBES» |

Cada tarjeta: número `01`, H3, descripción, lista de entregables, y una etiqueta de beneficio.
Debajo, un enlace de texto al CTA: «Hablemos de tu caso/proyecto/app/operación/proceso/idea →».

### 2.4 Bloque de plataformas (solo Integración)

`03 — EJEMPLOS DE INTEGRACIÓN` · H2 «¿Qué plataformas podemos conectar?» · 6 tarjetas
tipográficas (SAP, Zoho, Salesforce, Shopify, Microsoft 365, WooCommerce) con un ejemplo de
uso, un párrafo de descargo (los ejemplos **no** implican disponibilidad) y un bloque
«¿Tienes otra plataforma en mente?» con enlace «Consultar mi integración →».

### 2.5 Cómo trabajamos

4 etapas siempre. Grid `md:grid-cols-2 lg:grid-cols-4` en cinco pantallas; DevOps usa
`md:grid-cols-4` (salta el breakpoint intermedio) y el `gap` varía entre `gap-6` y `gap-8`.
Rótulos por servicio:

| Servicio | 01 | 02 | 03 | 04 |
|---|---|---|---|---|
| Integración | Analizar | Diseñar | Conectar | Supervisar |
| Web | Entender | Diseñar | Desarrollar | Publicar y mejorar |
| Móviles | Entender | Diseñar | Desarrollar | Publicar y evolucionar |
| A medida | Entender | Diseñar | Desarrollar | Evolucionar |
| DevOps | Revisar | Automatizar | Implementar | Supervisar |
| Consultoría | Entender | Definir | Planificar | Documentar |

### 2.6 Ficha técnica (5 servicios)

Misma forma (H2 + 3 grupos de ítems separados por líneas), **5 títulos distintos**:

| Servicio | Eyebrow | H2 |
|---|---|---|
| Web | `04 — FICHA DEL PROYECTO` | Qué incluye la solución web |
| Móviles | `04 · ENFOQUE TÉCNICO` | Cómo desarrollamos tu aplicación |
| A medida | `04 — CAPACIDADES DEL SISTEMA` | Qué puede resolver el software |
| DevOps | `04 — QUÉ CUBRIMOS` | Qué utilizamos para operar tus sistemas |
| Consultoría | `04 — MARCO DE TRABAJO` | Cómo organizamos el proyecto |

### 2.7 FAQ — homologada

Es el único bloque idéntico en las 6. Ver [`componentes/faq.md`](componentes/faq.md).

### 2.8 Cierre / CTA

Fondo `brand.deep` (`#00346E`), texto blanco, H2, párrafo y dos salidas: botón naranja +
enlace «Ver todos los servicios →». Eyebrow `06 — INICIA TU …` con variante de texto por servicio.

### 2.9 Servicios relacionados

H2 fijo «Otros servicios que pueden ayudarte», 3 tarjetas (`md:grid-cols-3`) con nombre,
descripción corta y enlace «Ver servicio →». Las combinaciones difieren por servicio y los
`href` no están unificados (`/servicios/...` vs `/services/...`).

---

## 3. Matriz de las 6 pantallas

| Bloque | Integración | Web | Móviles | A medida | DevOps | Consultoría |
|---|---|---|---|---|---|---|
| Hero | col-8 / col-4 | col-8 / col-4 | col-12 | col-8 / col-4 | col-8 / col-4 | col-8 / col-4 |
| Problema | 12 col | 12 col | 12 col | 12 col | 12 col | 12 col |
| Soluciones | 3 | 3 | 2 | 3 | 3 | 2 |
| Plataformas | **sí** | — | — | — | — | — |
| Cómo trabajamos | 4 | 4 | 4 | 4 | 4 | 4 |
| Ficha técnica | — | sí | sí | sí | sí | sí |
| FAQ | 6 filas | 6 filas | 6 filas | 6 filas | 6 filas | 6 filas |
| CTA | sí | sí | sí | sí | sí | sí |
| Relacionados | 3 | 3 | 3 | 3 | 3 | 3 |

---

## 4. Inventario de diferencias a resolver en el rediseño

| # | Diferencia | Impacto | Dónde |
|---|---|---|---|
| 1 | Fondos de sección alternos con 4 valores distintos (`#FFFFFF`, `#F2F2F2`, `border-[#E2E4E8]`, `border-[#dadada]`, `border-[#E5E5E5]`) | Rompe el ritmo entre servicios | todas |
| 2 | Padding vertical: `120px` en casi todo, `90px` (Web) y `96px` (Consultoría) | Inconsistencia vertical | Web, Consultoría |
| 3 | Alias de tokens inexistentes en unas pantallas (`brand.line`, `brand.surfaceAlt`, `maxWidth.container`) | Impide compartir markup literal | 4 pantallas |
| 4 | `brand.line` con 2 valores distintos (`#DADADA` vs `#E2E5E9`) | Bordes visibles distintos | A medida, Consultoría |
| 5 | Clases utilitarias a medida (`section-py`, `content-container`) en lugar de `max-w-container` | Contenedor no portable | Móviles, Consultoría |
| 6 | Separador del eyebrow: `—` vs `·` | Detalle tipográfico visible | Móviles (`·`), resto (`—`) |
| 7 | 5 títulos distintos para la ficha técnica | El lector no reconoce el bloque | Web, Móviles, A medida, DevOps, Consultoría |
| 8 | Grid del hero: 12 columnas vs `grid-cols-12` sin `lg:` | Comportamiento responsive distinto | Móviles |
| 9 | Rótulos de las 4 etapas de «Cómo trabajamos» | Es correcto que difieran; el bloque, no | los 6 |
| 10 | Rutas de navegación sin unificar (`/contact` vs `/contacto`, `/servicios` vs `/services`, `#soluciones` vs ruta) | Enlaces rotos en producción | los 6 |

---

## 5. Componentes reutilizables identificados

| Componente | Estado | Bloques que agrupa | Notas |
|---|---|---|---|
| **FAQ / Dudas frecuentes** | Homologado | 1 | `componentes/faq.md` |
| Cómo trabajamos | Pendiente | 1 | 4 etapas; rótulos parametrizables |
| Tarjeta de solución | Pendiente | 1 | Título, descripción, entregables, beneficio |
| Situación de problema (numerada) | Pendiente | 1 | 3 por servicio |
| Indicador de hero | Pendiente | 1 | 3 por servicio |
| Tarjeta de servicio relacionado | Pendiente | 1 | 3 por servicio |
| Bloque de plataformas | Exclusivo | 1 | Solo Integración |
| Ficha técnica | Pendiente | 1 | 3 grupos de ítems, título variable |
| Hero | Pendiente | 1 | |
| CTA de cierre | Pendiente | 1 | |

---

## 6. Cabecera y pie

Cada pantalla trae su **propio `<header>` y `<footer>` embebidos**, con 6 enlaces de
navegación y 12–13 de pie. **No son reutilizables tal cual**: en el proyecto Astro ya existen
componentes reales de cabecera y pie, así que el rediseño debe usar esos y descartar el
markup de Stitch. La diferencia de rutas (`/servicios` vs `/services` vs `#servicios`) es
justamente lo que hay que resolver en el sitio real.

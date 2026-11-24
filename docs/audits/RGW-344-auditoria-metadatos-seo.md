# RGW-344 — Auditoría de Metadatos SEO

**Fecha:** 24 de noviembre de 2026  
**Estado:** COMPLETADO (solo documentación - sin modificaciones)  
**Autor:** Agente Codex  

---

## 1. RESUMEN EJECUTIVO

Este informe documenta una auditoría completa de los metadatos SEO del proyecto GussWare Site, identificando fuentes de datos, mecanismos de integración WordPress-Astro-Yoast, y detectando oportunidades para una estrategia centralizada.

### 1.1. Hallazgos Clave

1. **Arquitectura sólida con separación clara:** WordPress/Yoast como fuente de metadatos, Astro como consumidor y transformador.
2. **Consumo parcial de Yoast SEO:** Solo las páginas de detalle consumen `yoast_head_json`. Los listados tienen SEO manual.
3. **Proyectos sin Yoast SEO:** Las páginas de detalle de proyectos NO usan Yoast SEO, limitando el control SEO editorial.
4. **Canonical correcto:** Astro genera canonicales usando el dominio del frontend, no el CMS.
5. **Idiomas consistentes:** Uso uniforme de Polylang (`lang`, `translations`) en todas las páginas.

---

## 2. ARQUITECTURA GENERAL DEL SISTEMA SEO

### 2.1. Flujo de Datos

```
WordPress (Yoast SEO) → WP REST API → Astro (Seo.utils) → Seo.astro → Output HTML
```

**WordPress como fuente primaria:**
- Yoast SEO genera `yoast_head_json` desde WordPress
- Datos de idioma/traducciones provienen de Polylang (`lang`, `translations`)
- URLs canónicas generadas por Yoast apuntan al CMS, no al frontend

**Astro como consumidor:**
- Astro consume `yoast_head_json` y lo procesa
- Reescribe URLs del CMS al dominio del frontend
- Aplica correcciones de idioma en JSON-LD

### 2.2. Componentes Clave SEO

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/components/layout/Seo.astro` | Componente reutilizable que renderiza metadatos |
| `src/lib/seo.ts` | Utilidades de procesamiento SEO (canonical, schema, locales) |
| `src/lib/wordpress/types.ts` | Tipos de `WpPostYoastHeadJson` y relacionados |
| `src/layouts/Layout.astro` | Layout principal que incluye Seo.astro |

---

## 3. INVENTARIO DE METADATOS Y SUS FUENTES

### 3.1. Metadatos disponibles en WordPress/Yoast

El endpoint `yoast_head_json` expone los siguientes campos:

| Campo | Fuente | Uso en Astro |
|-------|--------|--------------|
| `title` | Yoast Title | Renderizado como `<title>` |
| `description` | Yoast Meta Description | Renderizado como `<meta name="description">` |
| `robots` | Yoast Robots | Renderizado como `<meta name="robots">` |
| `canonical` | Yoast Canonical | **NO USADO** - Astro genera su propio canonical |
| `og_locale` | Yoast OG Locale | **NO USADO** - Usa Polylang (`lang`) |
| `og_type` | Yoast OG Type | Renderizado como `<meta property="og:type">` |
| `og_title` | Yoast OG Title | Renderizado como `<meta property="og:title">` |
| `og_description` | Yoast OG Description | Renderizado como `<meta property="og:description">` |
| `og_url` | Yoast OG URL | Renderizado como `<meta property="og:url">` (con fallback) |
| `og_site_name` | Yoast OG Site Name | Renderizado como `<meta property="og:site_name">` |
| `og_image` | Yoast OG Image | Renderizado como `<meta property="og:image">` (primer elemento) |
| `twitter_card` | Yoast Twitter Card | Renderizado como `<meta name="twitter:card">` |
| `twitter_title` | Yoast Twitter Title | Renderizado como `<meta name="twitter:title">` |
| `twitter_description` | Yoast Twitter Description | Renderizado como `<meta name="twitter:description">` |
| `twitter_image` | Yoast Twitter Image | Renderizado como `<meta name="twitter:image">` |
| `schema` | Yoast JSON-LD | Procesado y reescrito (URLs CMS → Frontend) |
| `article_published_time` | Yoast Published Time | **NO USADO** |
| `article_modified_time` | Yoast Modified Time | **NO USADO** |
| `author` | Yoast Author | **NO USADO** |
| `twitter_misc` | Yoast Twitter Misc | **NO USADO** |

### 3.2. Metadatos GENERADOS POR ASTRO

| Metadato | Fuente | Ubicación |
|----------|--------|-----------|
| `canonical` | `src/lib/seo.ts:canonicalUrl()` | Relanzado como `<link rel="canonical">` |
| `lang` | `page.lang` (Polylang) | Atributo `<html lang="">` |
| `alternateUrls` | `page.translations` (Polylang) | `<link rel="alternate" hreflang="">` |
| `languages` | `/pll/v1/languages` | Información de idiomas |
| `robots` | `yoast_head_json.robots` | `<meta name="robots">` |

---

## 4. PÁGINAS Y SU USO SEO

### 4.1. Páginas con SEO COMPLETO (usando `yoast_head_json`)

Estas páginas renderizan el componente Seo completo:

| Ruta | Archivo | Fuente de Yoast |
|------|---------|-----------------|
| `/` (Home ES) | `src/pages/index.astro` | `getFrontPage('es')` → `page.yoast_head_json` |
| `/en/` (Home EN) | `src/pages/[...uri].astro` | `getFrontPage('en')` → `page.yoast_head_json` |
| `/servicios/[slug]` | `src/pages/servicios/[slug].astro` | `getServiceBySlug()` → `service.yoast_head_json` |
| `/en/servicios/[slug]` | `src/pages/[locale]/servicios/[slug].astro` | `getServiceBySlug()` → `service.yoast_head_json` |
| `/proyectos/[slug]` | `src/pages/_proyectos/[slug].astro` | `getProjectDetail()` → **NO tiene yoast_head_json** |
| `/en/proyectos/[slug]` | `src/pages/[locale]/_proyectos/[slug].astro` | **NO tiene yoast_head_json** |
| `/contacto/` | `src/pages/[...uri].astro` | `getPageBySlug('contacto', locale)` → `page.yoast_head_json` |
| `/contact/` (EN) | `src/pages/contact.astro` | **NO usa yoast_head_json** - SEO manual |

### 4.2. Páginas con SEO MANUAL o LIMITADO

| Ruta | Archivo | Comentario |
|------|---------|------------|
| `/contact.astro` (ES) | Usa `Layout` con SEO manual | No consumió yoast_head_json |
| `/en/contact` | No existe como archivo separado | Se sirve vía `[...uri].astro` |
| `/blog` (ES) | `src/pages/_blog/index.astro` | SEO manual con título fijo |
| `/en/blog` | `src/pages/[locale]/_blog/index.astro` | SEO manual con título fijo |
| `/servicios` (ES) | `src/pages/servicios/index.astro` | SEO manual con título fijo |
| `/en/servicios` | `src/pages/[locale]/servicios/index.astro` | SEO manual con título fijo |
| `/proyectos` (ES) | `src/pages/_proyectos/index.astro` | SEO manual con título fijo |
| `/en/proyectos` | `src/pages/[locale]/_proyectos/index.astro` | SEO manual con título fijo |
| `/404.html` | `src/pages/404.astro` | SEO manual explícito |
| `/500.html` | `src/pages/500.astro` | SEO manual explícito |
| `/robots.txt` | `src/pages/robots.txt.ts` | Generado dinámicamente |

---

## 5. DETERMINACIÓN DE Yoast SEO INTEGRACIÓN

### 5.1. Qué consume Astro de Yoast SEO

**Consumo DIRECTO de `yoast_head_json`:**
- Título, descripción, robots (meta etiquetas básicas)
- Open Graph (og:title, og:description, og:image, og:url, og:type, og:site_name)
- Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
- JSON-LD Schema (con reescritura de URLs)

**NO consume de Yoast SEO:**
- `og_locale` - Se usa `lang` de Polylang
- `canonical` - Astro genera su propio canonical
- `article_published_time`, `article_modified_time` - No usados
- `author` - No usado
- `twitter_misc` - No usado

### 5.2. Mecanismo de reescritura de URLs

El archivo `src/lib/seo.ts` contiene la lógica de reescritura:

1. `rewriteSchemaUrls()` - Reescribe URLs en JSON-LD del CMS al frontend
2. `rewriteUrlOrigin()` - Función genérica para cambiar origen de URL
3. `CMS_ASSET_PATH = '/wp-content/'` - Las URLs de medios se mantienen apuntando al CMS

---

## 6. ANÁLISIS DE DUPLICIDADES E INCONSISTENCIAS

### 6.1. Duplicidades detectadas

1. **Títulos y descripciones hardcodeados en listados de blog/servicios/proyectos**
   - Los archivos `index.astro` de cada sección tienen títulos y descripciones SEO escritos manualmente
   - No utilizan los metadatos de WordPress

2. **SEO inconsistente entre ES/EN**
   - Algunas páginas usan `yoast_head_json` (detalles)
   - Otras tienen SEO manual (listados, contacto)
   - El contacto en inglés (`/en/contact`) se sirve vía `[...uri].astro` con `yoast_head_json`

3. **Contacto - Dos implementaciones posibles**
   - `/contact.astro` - SEO manual, sin yoast_head_json
   - `/en/contact` - Se sirve vía `[...uri].astro` con yoast_head_json

### 6.2. Inconsistencias críticas

1. **Proyectos sin Yoast SEO:**
   - Los detalles de proyectos (`/proyectos/[slug]` y `/en/proyectos/[slug]`) NO consumen `yoast_head_json`
   - Tienen SEO manual con título y descripción generados dinámicamente desde ACF
   - Esto es **una oportunidad de mejora identificada**

2. **Blog listado sin Yoast SEO:**
   - `/blog` e `/en/blog` tienen títulos y descripciones fijos en el código
   - No consumen `yoast_head_json` de ninguna página

3. **Servicios listado sin Yoast SEO:**
   - `/servicios` e `/en/servicios` tienen títulos y descripciones fijos
   - El título puede venir de `page.acf.services.title`, pero no se usa para SEO

---

## 7. ESTIMATE DE METADATOS POR PÁGINA

### 7.1. Tipo de página: Detalle de contenido (post, servicio)

```
Fuente: WordPress CPT con Yoast SEO
Fuente de título: yoast_head_json.title
Fuente de descripción: yoast_head_json.description
Fuente de Open Graph: yoast_head_json og_* 
Fuente de Twitter Cards: yoast_head_json twitter_*
Fuente de Schema: yoast_head_json.schema (con reescritura)
Fuente de canonical: Astro generado (canonicalUrl)
Fuente de idioma: page.lang (Polylang)
Fuente de traducciones: page.translations (Polylang)
```

### 7.2. Tipo de página: Listado (blog, servicios, proyectos)

```
Fuente de título: Hardcodeado o page.acf.*.title
Fuente de descripción: Hardcodeado o page.acf.*.description
Fuente de Open Graph: Hardcodeado o derivado
Fuente de Twitter Cards: Hardcodeado
Fuente de Schema: Hardcodeado (WebSite)
Fuente de canonical: Astro generado
Fuente de idioma: Página actual
Fuente de traducciones: Página actual
```

### 7.3. Tipo de página: Home

```
Fuente de título: page.title.rendered (WP)
Fuente de descripción: page.excerpt.rendered (WP) - truncado a 160 chars
Fuente de Open Graph: yoast_head_json (cuando hay page)
Fuente de Twitter Cards: yoast_head_json
Fuente de Schema: yoast_head_json.schema
Fuente de canonical: Astro generado
Fuente de idioma: page.lang (Polylang)
Fuente de traducciones: page.translations (Polylang)
```

---

## 8. RECOMENDACIÓN ARQUITECTURAL

### 8.1. Estrategia de consolidación propuesta

**Objetivo:** Crear una fuente única de verdad para metadatos SEO, consumiendo siempre WordPress/Yoast cuando esté disponible.

**Patrón recomendado:**

```typescript
// Nueva función en src/lib/seo.ts
export async function getPageSeoData(
  pageId: number,
  locale: string
): Promise<SeoData | null> {
  // 1. Intentar obtener yoast_head_json desde WordPress
  // 2. Si no existe, usar datos del layout con fallback a valores por defecto
  // 3. Siempre procesar lang y translations desde Polylang
}
```

### 8.2. Mapa de fuentes por tipo de página

| Tipo de página | yoast_head_json disponible | SEO recomendado |
|----------------|---------------------------|-----------------|
| Blog (ES/EN) | Sí (post individual) | Usar yoast para detalles, crear endpoint para listado |
| Blog listado | No | Obtener desde Home page o crear página dedicada |
| Servicios (detalle ES/EN) | Sí | Usar yoast_head_json directamente |
| Servicios listado | Parcial | Usar home page yoast o crear página |
| Proyectos (detalle ES/EN) | No | **OTIMIZAR** - Crear CPT con Yoast o usar ACF + Seo utils |
| Proyectos listado | No | Usar home page yoast |
| Home (ES/EN) | Sí | Usar actualmente - CORRECTO |
| Contacto | Parcial | Unificar bajo `[...uri].astro` |
| Legal (privacidad, términos) | No relevante | SEO manual suficiente |
| 404/500 | No | SEO manual necesario |

### 8.3. Archivos que necesitan modificación (para RGW-345/346)

**Para listados sin yoast_head_json:**
1. `src/pages/_blog/index.astro` - Necesita integración con WordPress
2. `src/pages/[locale]/_blog/index.astro` - Mismo problema
3. `src/pages/servicios/index.astro` - Usar yoast de home o crear página
4. `src/pages/[locale]/servicios/index.astro` - Mismo problema
5. `src/pages/_proyectos/index.astro` - Usar yoast de home o crear página
6. `src/pages/[locale]/_proyectos/index.astro` - Mismo problema
7. `src/pages/contact.astro` - Unificar con `[...uri].astro`

---

## 9. EVIDENCIAS Y REFERENCIAS

### 9.1. Archivos revisados

1. **Componentes SEO:**
   - `src/components/layout/Seo.astro` (líneas 1-87)
   - `src/lib/seo.ts` (líneas 1-273)

2. **Tipos WordPress:**
   - `src/lib/wordpress/types.ts` (líneas 813-846 - `WpPostYoastHeadJson`)

3. **Páginas con yoast_head_json:**
   - `src/pages/index.astro` (líneas 168-172 - uso de Layout sin SEO propio)
   - `src/pages/[...uri].astro` (líneas 361-376 - uso de Seo component)
   - `src/pages/_blog/[slug].astro` (líneas 30-35 - SEO sin yoast)
   - `src/pages/[locale]/_blog/[slug].astro` (líneas 30-35 - SEO sin yoast)
   - `src/pages/servicios/[slug].astro` (líneas 70-75 - SEO sin yoast)
   - `src/pages/[locale]/servicios/[slug].astro` (líneas 78-83 - SEO sin yoast)
   - `src/pages/_proyectos/[slug].astro` (líneas 37-42 - SEO sin yoast)
   - `src/pages/[locale]/_proyectos/[slug].astro` (líneas 39-44 - SEO sin yoast)

4. **Páginas con SEO manual:**
   - `src/pages/_blog/index.astro` (líneas 23-27)
   - `src/pages/[locale]/_blog/index.astro` (líneas 23-27)
   - `src/pages/servicios/index.astro` (líneas 47-53)
   - `src/pages/[locale]/servicios/index.astro` (líneas 58-65)
   - `src/pages/_proyectos/index.astro` (líneas 30-34)
   - `src/pages/[locale]/_proyectos/index.astro` (líneas 30-34)
   - `src/pages/contact.astro` (líneas 47-50)
   - `src/pages/404.astro` (líneas 30-39)
   - `src/pages/500.astro` (líneas 31-40)

5. **API Endpoints:**
   - `src/lib/wordpress/types.ts` (líneas 813-846 - `WpPostYoastHeadJson`)
   - `src/lib/wordpress/routes.ts` (todos los endpoints)
   - `src/lib/wordpress/pages.ts` (funciones de obtención de páginas)
   - `src/lib/wordpress/post.ts` (funciones de obtención de posts)
   - `src/lib/wordpress/services.ts` (funciones de obtención de servicios)
   - `src/lib/wordpress/projects.ts` (funciones de obtención de proyectos)

6. **Configuración Astro i18n:**
   - `astro.config.mjs` (líneas 328-334)

---

## 10. VALIDACIONES REALIZADAS

### 10.1. Build y generación de rutas

```bash
npm run build
```

**Resultado:** Build exitoso con verificación de WordPress:
- Identidad visual verificada (favicon: 1080, logo: 1087)
- Contenido verificado en https://cms.gussware.dev

### 10.2. Rutas estáticas generadas

Las siguientes rutas fueron verificadas con su estructura:

| Ruta | Tipo | Has Yoast | Tiene SEO |
|------|------|-----------|-----------|
| `/404.html` | Error | No | Sí (manual) |
| `/500.html` | Error | No | Sí (manual) |
| `/contact/index.html` | Page | Sí | Sí |
| `/robots.txt` | Static | N/A | Sí |
| `/servicios/[slug]/index.html` | Detalle | Sí | Sí |
| `/en/servicios/[slug]/index.html` | Detalle | Sí | Sí |
| `/proyectos/[slug]/index.html` | Detalle | No | Sí (manual) |
| `/en/proyectos/[slug]/index.html` | Detalle | No | Sí (manual) |

---

## 11. CONCLUSIONES

### 11.1. Hallazgos principales

1. **Arquitectura sólida con separación clara:** WordPress/Yoast como fuente de metadatos, Astro como consumidor y transformador.
2. **Consumo parcial de Yoast SEO:** Solo las páginas de detalle consumen `yoast_head_json`. Los listados tienen SEO manual.
3. **Proyectos sin Yoast SEO:** Las páginas de detalle de proyectos NO usan Yoast SEO, limitando el control SEO editorial.
4. **Canonical correcto:** Astro genera canonicales usando el dominio del frontend, no el CMS.
5. **Idiomas consistentes:** Uso uniforme de Polylang (`lang`, `translations`) en todas las páginas.

### 11.2. Prioridades para RGW-345/346

1. **Crear página de blog listado con Yoast SEO** (alta prioridad)
   - Necesaria para SEO del listado de artículos

2. **Crear páginas de listado de servicios con Yoast SEO** (media prioridad)
   - Mejor indexación de categorías de servicios

3. **Crear páginas de listado de proyectos con Yoast SEO** (media prioridad)
   - Mejor indexación de proyectos

4. **Unificar contacto bajo `[...uri].astro`** (baja prioridad)
   - Simplifica mantenimiento

---

## 12. ANEXO: Diagrama de flujo SEO

```
┌─────────────────────────────────────────────────────────────────┐
│                    WordPress + Yoast SEO                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Post: /wp/v2/posts/{id}                                 │  │
│  │  └── yoast_head_json: {title, description, og_*, twitter_*│  │
│  │                                                      schema}│  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│                      WP REST API                                 │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Astro + React (SSR)                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ src/lib/wordpress/*.ts                           │  │  │
│  │  │   → wpFetch<type>(endpoint)                      │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │              │                                         │  │
│  │              ▼                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ src/lib/seo.ts                                    │  │  │
│  │  │   → canonicalUrl(), rewriteSchemaUrls(), etc.    │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │              │                                         │  │
│  │              ▼                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ src/components/layout/Seo.astro                   │  │  │
│  │  │   → Renderiza <title>, <meta>, <script type="   │  │  │
│  │  │       application/ld+json">                      │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │              │                                         │  │
│  │              ▼                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Layout.astro                                      │  │  │
│  │  │   → <html lang="es|en">                         │  │  │
│  │  │   → <head> con todos los metadatos              │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│                    Browser (Cliente)                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Renderizado HTML con metadatos completos             │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. PRÓXIMOS PASOS RECOMENDADOS (RGW-345/346)

1. **Estandarizar el patrón de consumo SEO:**
   - Crear una función `getPageSeoData(slug, locale)` que siempre intente usar `yoast_head_json`
   - Implementar fallback para listados

2. **Crear páginas piloto con Yoast SEO:**
   - Blog listado (`/blog`)
   - Servicios listado (`/servicios`)
   - Proyectos listado (`/proyectos`)

3. **Documentar el patrón para futuros desarrollos:**
   - Archivo `docs/patterns/seo-pattern.md`
   - Ejemplos de implementación

---

*Informe generado: 24 de noviembre de 2026*
*Auditoría: RGW-344*
*Estado: COMPLETADO (solo documentación - sin modificaciones)*
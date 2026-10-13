# GussWare — Catálogo de Proyectos

## Info

**Documento fuente de contenido para WordPress**

Esta plantilla debe contener únicamente contenido que posteriormente será cargado en el Custom Post Type `projects` de GussWare.

Referencia de importación: `.opencode/skills/gussware-projects-import/SKILL.md` (único lector autorizado de este documento).

---

# Instrucciones de llenado

- Cada proyecto debe tener una sección independiente.
- No eliminar campos de la plantilla.
- Si un campo opcional no aplica, dejarlo vacío.
- Los campos marcados como **requeridos** deben tener contenido.
- Los repeaters pueden tener múltiples elementos (se muestran 02 como ejemplo; repetir el bloque según necesidad).
- Mantener el mismo orden de las secciones.
- El contenido en español y en inglés debe representar el mismo proyecto.
- No agregar contenido directamente en WordPress que no exista en este documento durante una importación.
- Los valores técnicos como IDs de WordPress, IDs de traducción o slugs serán determinados por el workflow de importación.
- Los nombres (términos, empresas, títulos) se comparan sin distinguir mayúsculas/minúsculas ni espacios sobrantes: escribe cada nombre siempre igual y no crees variantes del mismo registro.

---

# Proyectos

## Proyecto: [Nombre del proyecto]

### Identificación

**Clave interna:** `[código del proyecto, p. ej. PRY-2024-001; si se omite, se asigna según la regla aprobada en RGW-319]`

**Tipo:** `[tipo de proyecto, taxonomía projects_type]`

**Sector:** `[sector o industria, taxonomía industry_sector]`

**Tecnologías:** `[tecnologías separadas por comas, taxonomía technology]`

**Cliente / Empresa:** `[título exacto del post client_company existente, requerido]`

**Rol desempeñado:** `[rol]`

**Fecha de inicio:** `[AAAAMMDD, p. ej. 20240115]`

**Fecha de finalización:** `[AAAAMMDD o vacío si está en curso]`

**Estatus del proyecto:** `[in_development / completed, requerido]`

**Proyecto en curso:** `[sí / no]`

**Proyecto destacado:** `[sí / no]`

**Orden de presentación:** `[número o vacío]`

**Estado:** `draft`

---

# 🇲🇽 Español

## WordPress

### Título

> [Título del proyecto]

### Imagen destacada

> [ID numérico del adjunto en la biblioteca de medios, o vacío. No se suben archivos durante la importación.]

---

## Descripción

### Descripción completa

> [Descripción completa del proyecto.]

### Descripción corta

> [Resumen para tarjetas y listados.]

### Resumen amplio

> [Resumen ejecutivo del proyecto.]

---

## Contexto

### Contexto y objetivo

> [Contexto y objetivo.]

### Problema o necesidad

> [Problema o necesidad.]

### Solución implementada

> [Solución implementada.]

---

## Funcionalidades

### Funcionalidad 01

**Nombre:**

> [Nombre]

**Descripción:**

> [Descripción]

### Funcionalidad 02

**Nombre:**

> [Nombre]

**Descripción:**

> [Descripción]

---

## Responsabilidades

### Responsabilidad 01

**Título:**

> [Título]

**Descripción:**

> [Descripción]

### Responsabilidad 02

**Título:**

> [Título]

**Descripción:**

> [Descripción]

---

## Enlaces

### URL pública

> [URL o vacío]

### URL de demo

> [URL o vacío]

### URL del repositorio

> [URL o vacío]

---

## Resultados

### Resultado 01

**Nombre:**

> [Nombre]

**Descripción:**

> [Descripción]

### Resultado 02

**Nombre:**

> [Nombre]

**Descripción:**

> [Descripción]

---

## Métricas

Solo métricas verificables.

### Métrica 01

**Nombre:**

> [Nombre]

**Valor:**

> [Valor]

**Unidad:**

> [Unidad o vacío]

**Descripción:**

> [Descripción o vacío]

### Métrica 02

**Nombre:**

> [Nombre]

**Valor:**

> [Valor]

**Unidad:**

> [Unidad o vacío]

**Descripción:**

> [Descripción o vacío]

---

# 🇺🇸 English

## WordPress

### Title

> [Project title]

### Featured image

> [Numeric media library attachment ID, or empty. No files are uploaded during import.]

---

## Description

### Full description

> [Full project description.]

### Short description

> [Card and listing summary.]

### Executive summary

> [Executive summary.]

---

## Context

### Context and objective

> [Context and objective.]

### Problem or need

> [Problem or need.]

### Implemented solution

> [Implemented solution.]

---

## Features

### Feature 01

**Name:**

> [Name]

**Description:**

> [Description]

### Feature 02

**Name:**

> [Name]

**Description:**

> [Description]

---

## Responsibilities

### Responsibility 01

**Title:**

> [Title]

**Description:**

> [Description]

### Responsibility 02

**Title:**

> [Title]

**Description:**

> [Description]

---

## Links

### Public URL

> [URL or empty]

### Demo URL

> [URL or empty]

### Repository URL

> [URL or empty]

---

## Results

### Result 01

**Name:**

> [Name]

**Description:**

> [Description]

### Result 02

**Name:**

> [Name]

**Description:**

> [Description]

---

## Metrics

Verifiable metrics only.

### Metric 01

**Name:**

> [Name]

**Value:**

> [Value]

**Unit:**

> [Unit or empty]

**Description:**

> [Description or empty]

### Metric 02

**Name:**

> [Name]

**Value:**

> [Value]

**Unit:**

> [Unit or empty]

**Description:**

> [Description or empty]

---

# Import Notes

Esta sección es para información específica de importación que deba conocer OpenCode antes de cargar este proyecto.

**Tipos y sectores WordPress:** `[términos exactos de projects_type, industry_sector y technology]`

**Cliente WordPress:** `[título exacto del post client_company; se reutiliza si es único, se crea si no existe]`

**Notas sobre imágenes:** `[ID de destacada verificado; las imágenes adicionales (galería) no se importan en esta fase]`

**Notas sobre traducción:** `[el contenido ES/EN representa el mismo proyecto; asociar mediante Polylang]`

**Notas adicionales:** `[p. ej. mantener draft; códigos y fechas verificados]`

---

# End of Project

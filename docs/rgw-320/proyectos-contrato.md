# RGW-328 — Contrato JSON de importación masiva de Proyectos

Derivado de `.opencode/skills/gussware-projects-import/SKILL.md`,
`TEMPLATE.md`, `gussware-import-core` v1.0 y del modelo vivo verificado
el 2026-10-13 (CPT `projects`, `rest_base: projects`, grupo ACF
`Proyectos - CPT` con `show_in_rest: true`, taxonomías `projects_type`
(`projects_type`), `technology` (`technologies`), `industry_sector`
(`industries_sector`), CPT relacionado `client_company`, Polylang
`es`/`en`). Independiente del contrato de Servicios (RGW-327).

Lote de importación: `proyectos.json` (mismo directorio, 2 proyectos
TEST; los DEMO 598/599 en borrador quedan fuera del alcance).

## Estructura

```text
{
  "version": 1,            // entero, requerido, debe ser 1
  "type": "proyectos",     // requerido, debe ser "proyectos"
  "items": [ ... ]         // 1..N proyectos lógicos, sin duplicados
}
```

Cada ítem:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `project_code` | string no vacío | sí | Clave lógica del negocio, idéntica en ES/EN. Resolución primaria: índice vivo de `acf.project_code` normalizado. |
| `es.titulo` / `en.titulo` | string no vacío | ES sí; EN solo si `en` presente | Título por idioma. |
| `es.slug` / `en.slug` | string | ES sí | Slug por idioma (los EN vivos pueden traer slug propio). |
| `es.tipos` / `tecnologias` / `sectores` | string[] (nombres exactos) | no | Taxonomías ES (`Sistemas empresariales`, `MySQL`/`Php`, `Comercio`). Lado EN: sin términos EN vivos → no se asigna taxonomía en EN. |
| `es.empresa` / `en.empresa` | string o null | sí (título exacto `client_company`) | Se reutiliza si el match es único; si no existe se crea solo con título (modelo actual sin campos); ambiguo → AMBIGUOUS. |
| `es.acf` / `en.acf` | objeto | sí | Claves ACF exactas del grupo vivo: `description`, `short_description`, `executive_summary`, `role_performed`, `start_date`/`end_date` (`AAAAMMDD`), `is_ongoing`, `is_featured`, `display_order`, `context_objective`, `problem_need`, `implemented_solution`, `status` (`in_development`/`completed`, requerido), repeaters `funcionalidades_desarrolladas[]: {feature_name, feature_description}`, `responsibilities_contributions[]: {responsibility, responsibility_description}`, `results_achievements[]: {achievement_name, achievement_description}`, `verifiable_metrics[]: {nombre_de_la_metrica, metric_value, metric_unit, metric_description}`, URLs `project_url`/`demo_url`/`repository_url`. |
| `en` | objeto o null | no | `null` = ítem monolingüe: NO se crea la traducción (documentado). |
| `imagen_destacada_id` | entero o ausente | no | Attachment verificado. `additional_images` (galería) excluido: procedimiento de subida no probado. |

## Reglas de validación del lote

1. `version`/`type` exactos; `project_code` único en el lote y no vacío
   (sin candidato inequívoco → `PROJECT_CODE_MISSING`; colisión →
   `PROJECT_CODE_CONFLICT`).
2. Estados: el JSON no declara estado; el flujo preserva el estado vivo
   (nunca publica ni despublica).
3. Resolución por código (índice vivo); con código provisto nunca se
   recurre a título/slug. Salvaguarda: si el match apunta a un registro
   con distinto `project_code` no vacío → AMBIGUOUS.
4. Dependencias antes de persistir: términos (reutilizar/crear por
   nombre normalizado mismo idioma; legados `lang:false` participan),
   empresa (título único por idioma), traducciones ES/EN verificadas en
   ambas direcciones.
5. Escritura solo por `title, slug, featured_media, projects_type,
   technologies, industries_sector, acf, lang, translations`
   (verificado en `OPTIONS`). Sin `content`/`excerpt` (inexistentes en
   el esquema). Espejos ACF de taxonomías no se escriben: se verifican
   en lectura posterior.
6. Repertibilidad: segunda ejecución → mismos registros
   (EXISTING/UPDATED), cero creados.

## Desviaciones y límites verificados

- Sin términos EN en las tres taxonomías: el lado EN no recibe
  taxonomía (se preserva lo vivo).
- Galería excluida (subida no probada); URLsopcionales vacías se dejan
  vacías.
- DEMO 598/599 (borradores ficticios previos) fuera del lote.

## Ejemplo completo y válido (`TEST-RGW321-A`)

```json
{
  "project_code": "TEST-RGW321-A",
  "es": {
    "titulo": "TEST — Proyecto de integración RGW-A",
    "slug": "test-proyecto-integracion-rgw-a",
    "tipos": [
      "Sistemas empresariales"
    ],
    "tecnologias": [
      "Php"
    ],
    "sectores": [
      "Comercio"
    ],
    "empresa": "Empresa Demo Inventario",
    "acf": {
      "additional_images": null,
      "client_company": [
        596
      ],
      "context_objective": "<p>Objetivo ficticio de prueba.</p>",
      "demo_url": "",
      "description": "<p>Proyecto ficticio de prueba para validar la integración RGW-321/322/323. Sin datos comerciales reales.</p>",
      "display_order": 1,
      "end_date": "20261012",
      "executive_summary": "<p>Resumen ficticio de prueba.</p>",
      "funcionalidades_desarrolladas": [
        {
          "feature_name": "Funcionalidad de prueba 1",
          "feature_description": "Desc ficticia"
        }
      ],
      "implemented_solution": "<p>Solución ficticia de prueba.</p>",
      "industry_sector": [
        64
      ],
      "is_featured": true,
      "is_ongoing": false,
      "problem_need": "<p>Necesidad ficticia de prueba.</p>",
      "project_code": "TEST-RGW321-A",
      "project_type": [
        62
      ],
      "project_url": "",
      "repository_url": "",
      "responsibilities_contributions": [
        {
          "responsibility": "Responsabilidad de prueba",
          "responsibility_description": "Desc ficticia"
        }
      ],
      "results_achievements": [
        {
          "achievement_name": "Logro de prueba",
          "achievement_description": "Desc ficticia"
        }
      ],
      "role_performed": "Rol de prueba",
      "short_description": "Resumen corto de prueba A. (Contenido ficticio de prueba RGW-321.)",
      "start_date": "20261001",
      "status": "completed",
      "technology": [
        71
      ],
      "verifiable_metrics": [
        {
          "nombre_de_la_metrica": "Métrica de prueba",
          "metric_value": "1",
          "metric_unit": "ud",
          "metric_description": "Desc ficticia"
        }
      ]
    }
  },
  "en": {
    "titulo": "TEST — Integration project RGW-A",
    "slug": "test-integration-project-rgw-a",
    "tipos": [
      "Sistemas empresariales"
    ],
    "tecnologias": [
      "Php"
    ],
    "sectores": [
      "Comercio"
    ],
    "empresa": "Empresa Demo Inventario",
    "acf": {
      "additional_images": null,
      "client_company": [
        597
      ],
      "context_objective": "<p>Objetivo ficticio de prueba.</p>",
      "demo_url": "",
      "description": "<p>Proyecto ficticio de prueba para validar la integración RGW-321/322/323. Sin datos comerciales reales.</p>",
      "display_order": 1,
      "end_date": "20261012",
      "executive_summary": "<p>Resumen ficticio de prueba.</p>",
      "funcionalidades_desarrolladas": [
        {
          "feature_name": "Funcionalidad de prueba 1",
          "feature_description": "Desc ficticia"
        }
      ],
      "implemented_solution": "<p>Solución ficticia de prueba.</p>",
      "industry_sector": [
        64
      ],
      "is_featured": true,
      "is_ongoing": false,
      "problem_need": "<p>Necesidad ficticia de prueba.</p>",
      "project_code": "TEST-RGW321-A",
      "project_type": [
        62
      ],
      "project_url": "",
      "repository_url": "",
      "responsibilities_contributions": [
        {
          "responsibility": "Responsabilidad de prueba",
          "responsibility_description": "Desc ficticia"
        }
      ],
      "results_achievements": [
        {
          "achievement_name": "Logro de prueba",
          "achievement_description": "Desc ficticia"
        }
      ],
      "role_performed": "Rol de prueba",
      "short_description": "Test short summary A. (Contenido ficticio de prueba RGW-321.)",
      "start_date": "20261001",
      "status": "completed",
      "technology": [
        34
      ],
      "verifiable_metrics": [
        {
          "nombre_de_la_metrica": "Métrica de prueba",
          "metric_value": "1",
          "metric_unit": "ud",
          "metric_description": "Desc ficticia"
        }
      ]
    }
  }
}
```

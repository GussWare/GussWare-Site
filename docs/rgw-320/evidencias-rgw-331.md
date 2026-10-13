# RGW-331 — Evidencias de validación (flujos bulk Servicios y Proyectos)

Fecha: 2026-10-13. Lotes: `servicios.json` (6 servicios), `proyectos.json`
(2 proyectos). Flujos: `importar-servicios.py`, `importar-proyectos.py`.
Modos: `--validar`, `--pre-vuelo`, `--importar`. Toda escritura fue real
vía REST con credenciales de aplicación; conteos globales verificados
antes/después.

## Leyenda

- **REAL**: ejecutada contra WordPress vivo con evidencia.
- **LOCAL**: prueba unitaria sin red (lógica pura).
- **PENDIENTE**: no ejecutada, con motivo.

## Servicios

| # | Prueba | Tipo | Resultado |
|---|---|---|---|
| S0 | Lote válido + pre-vuelo | REAL | 0 errores; idiomas es/en; 7+7 registros; 7 categorías ES (0 EN); esquema verificado |
| S1 | Importación real (2 pasadas) | REAL | 6 UPDATED (ES 523/525/527/529/531/497 + EN 524/526/528/530/532/533), 0 creados; estados publish/draft preservados; conteos 7/7 invariantes; TEST 592/593 intacto |
| S2 | JSON malformado | REAL | `lote inválido ...`, exit 2, sin red |
| S3 | Clave/título vacíos, acf no objeto, clave duplicada | REAL | 4 errores listados, exit 1, sin escrituras |
| S4 | Fallo parcial (1 válido + categoría inexistente) | REAL | 1 UPDATED + 1 ERROR aislado, exit 1; el válido persiste verificado |
| S5 | Credenciales inválidas | REAL | pre-vuelo BLOQUEO (`listado inaccesible`), exit 2, cero escrituras |
| S6 | Título ES duplicado (índice sintético) | LOCAL | `AMBIGUOUS` sin adivinar |
| S7 | Idempotencia | REAL | 2 pasadas, mismos IDs, 0 creados |

## Proyectos

| # | Prueba | Tipo | Resultado |
|---|---|---|---|
| P0 | Lote válido + pre-vuelo | REAL | 0 errores; 5 proyectos; taxonomías 1/3/1 (+EN tras pasada 1); 2 empresas; esquema verificado |
| P1 | Importación real (3 pasadas) | REAL | 2 UPDATED (ES 600/601 + EN 602, empresas REUSED, publish preservado, espejos/taxonomías verificados), 0 creados; DEMO 598/599 intacto |
| P2 | JSON malformado | REAL | exit 2, sin red |
| P3 | `project_code` ausente, `acf.status` inválido, código duplicado | REAL | 3 errores listados, exit 1, sin escrituras |
| P4 | Ambigüedad `Php` sin ancla (legado 34 vs `es` 71) | REAL | `TERM_AMBIGUOUS` en pasadas 1-2 de RGW-330; el flujo se detuvo como exige la skill; resuelto con `taxonomia_ids` verificados |
| P5 | Espejos ACF requeridos (`rest_property_required`) | REAL | 400 diagnosticado; corrección: espejos con IDs resueltos/preservados; verificación posterior los comprueba |
| P6 | Efecto colateral: Polylang creó términos EN (73/75/77) | REAL | Detectado en pre-vuelo de pasada 2; benigno y consistente; guarda anti-reenvío añadida; pasada 3 estable sin nuevos términos |
| P7 | Idempotencia | REAL | 3 pasadas, mismos IDs, 0 creados |

## Separación de flujos

Archivos, contratos, lotes y reportes independientes por tipo
(`servicios.*` vs `proyectos.*`); ninguna ejecución cruza tipos.

## Pendientes / no ejecutados

- Creación de términos desde la fuente (política reuse-only + ERROR;
  no se necesitó: todo existía).
- Galería `additional_images` (procedimiento de subida no probado;
  excluido por contrato).
- Traducciones EN de categorías de servicio (no existen en vivo;
  EN sin taxonomía por diseño verificado).
- `assignee`/URLs/fechas del detalle Astro (sin slot en el template;
  ver RGW-323, fuera de este alcance).

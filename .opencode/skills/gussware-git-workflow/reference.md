# Referencia operativa Jira (gussware-git-workflow)

Detalle operativo para §0 y §17. Las reglas viven en `SKILL.md`;
aquí solo el cómo con el MCP de Atlassian.

## Consultar la tarjeta (§0)

1. Resolver `cloudId` una vez por sesión con
   `getAccessibleAtlassianResources` y reutilizarlo.
2. Leer con `getJiraIssue` (`issueIdOrKey: <ID>`, `view: evidence`):
   Summary, Description, Status y Acceptance Criteria (si existe).
3. Sin MCP, sin acceso o tarjeta inexistente: detenerse y avisar (§0.4).

## Transicionar a Listo para pruebas (§17)

1. Solo después de que todas las validaciones de la tarea pasaron.
2. Listar transiciones reales con `listJiraIssueTransitions`.
3. Si existe la transición a `Listo para pruebas`, aplicarla con
   `transitionJiraIssue` (por `transitionId`, nunca por nombre
   inventado).
4. Si no existe para esa tarjeta: no usar otra transición ni cambiar
   a otro estado; informarlo en el campo `Jira:` del reporte (§18).

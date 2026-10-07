# Referencia operativa Jira (gussware-workflow)

Detalle operativo para §0, §10 y §17. Las reglas viven en `SKILL.md`;
aquí solo el cómo con el MCP de Atlassian.

## Consultar la tarjeta (§0)

1. Resolver `cloudId` una vez por sesión con
   `getAccessibleAtlassianResources` y reutilizarlo.
2. Leer con `getJiraIssue` (`issueIdOrKey: <ID>`, `view: evidence`):
   Summary, Description, Status y Acceptance Criteria (si existe).
3. Sin MCP, sin acceso o tarjeta inexistente: detenerse y avisar (§0.4).

## Tarea principal en curso durante subtareas (§17)

1. Antes de comenzar a trabajar una subtarea, identificar su tarea
   principal (`fields.parent` de la subtarea con `getJiraIssue`) y
   verificar su estado (`fields.status`).
2. Si la tarea principal no está en `En curso`, listar sus transiciones
   reales con `listJiraIssueTransitions` y aplicar la transición a
   `En curso` con `transitionJiraIssue` (por `transitionId`, nunca por
   nombre inventado).
3. Si esa transición no existe: no usar otra transición ni cambiar a
   otro estado; informarlo en el campo `Jira:` del reporte (§18).

## Transicionar al estado correspondiente (§17)

1. Solo después de que todas las validaciones de la tarea pasaron y
   existe el commit correspondiente a esa subtarea/tarea.
2. Determinar el destino según el tipo de tarjeta (tipo de issue /
   padre obtenido con `getJiraIssue`): subtarea → `Listo`; tarea
   principal → `Listo para pruebas`.
3. Terminar una subtarea no cambia el estado de su tarea principal.
   No mover la tarea principal a `Listo para pruebas` solo porque
   terminó una subtarea; la finalización de todas las subtareas
   necesarias solo permite que la principal pase a `Listo para
   pruebas` cuando su propio trabajo también está terminado y
   validado.
4. Observaciones del usuario: al retomar el trabajo sobre una tarea
   principal en `Listo para pruebas` o una subtarea en `Listo`,
   devolver esa tarjeta a `En curso`. Tras corregir y validar de
   nuevo, volver al destino del punto 2 (subtarea → `Listo`;
   principal → `Listo para pruebas`).
5. Listar transiciones reales con `listJiraIssueTransitions`.
6. Si existe la transición al estado destino, aplicarla con
   `transitionJiraIssue` (por `transitionId`, nunca por nombre
   inventado).
7. Si no existe para esa tarjeta: no usar otra transición ni cambiar
   a otro estado; informarlo en el campo `Jira:` del reporte (§18).

## Comentario obligatorio en Jira (§17)

1. Con `addOrEditJiraIssueComment` (`issueIdOrKey: <ID>`) agregar el
   comentario resumido en la subtarea o tarea principal terminada
   (o tras corregir observaciones, agregar/actualizarlo).
2. Contenido breve: qué se realizó; resultado; validaciones
   ejecutadas; commit relacionado, cuando corresponda.
3. Comentario de resumen en la tarjeta padre (cierre de tareas con
   subtareas): con `addOrEditJiraIssueComment`
   (`issueIdOrKey: <ID-padre>`) agregar el comentario consolidado
   solo cuando todas las subtareas necesarias hayan terminado y la
   tarea padre esté completamente validada. Contenido mínimo:
   subtareas completadas; resultado general; validaciones; commits
   relevantes; PR cuando corresponda; observaciones o pendientes, si
   existen. No copiar los comentarios individuales: redactar una
   consolidación. Después del comentario, continuar con la
   transición (§17, sección anterior).
4. No inventar estados, nombres de transiciones ni IDs; las
   transiciones usadas son únicamente las reales listadas en el punto
   5 anterior.

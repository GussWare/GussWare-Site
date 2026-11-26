# Referencia operativa Jira (gussware-workflow)

Detalle operativo para §0, §10 y §17. Las reglas viven en `SKILL.md`;
aquí solo el cómo con el MCP de Atlassian.

## ⚠️ Estado inicial obligatorio: "En curso" (Actualizado)

**Regla operativa principal:**

> **Antes de modificar cualquier archivo, crear commits, hacer push o abrir una Pull Request, el agente debe confirmar que la tarjeta Jira correspondiente está en estado `En curso`.**
>
> Esta es una guardia **obligatoria y verificable**: no basta con haber intentado una transición ni con asumir que el estado es correcto sin corroborarlo.
>
> **Condiciones para proceder:**
> 1. Si la tarjeta está en `En curso`: **puede proceder** con modificaciones, commits, push y PR.
> 2. Si la tarjeta está en `Por hacer` o cualquier otro estado distinto de `En curso`: **no** modificar archivos, crear commits, hacer push ni abrir una PR. Aplicar el procedimiento de bloques que se detalla a continuación.
> 3. **La lectura inicial** necesaria para identificar la tarea, comprender sus condiciones y consultar su estado **no está bloqueada** por esta regla. El agente puede leer la descripción, verificar IDs y consultar el estado actual.
> 4. **En ningún caso** el agente debe continuar con acciones de implementación sin haber verificado personalmente (leyendo el estado actual de Jira) que la tarjeta está en `En curso`.
>
> **Procedimiento de verificación:**
> 1. Consultar el estado de la tarjeta Jira mediante el MCP de Atlassian.
> 2. Si el estado es `En curso`: continuar con las operaciones permitidas.
> 3. Si el estado no es `En curso`: aplicar el procedimiento de bloques (ver tabla abajo).
> 3. **Después** de solicitar una transición: **volver a consultar Jira** y verificar que el estado realmente cambió a `En curso`. No basta con haber enviado la solicitud de transición.

**Procedimiento ante bloqueos** (para cuando la tarjeta no está en `En curso`):

| Escenario | Comportamiento requerido |
|---|---|
| **Jira inaccesible** | No iniciar modificaciones ni implementación. Informar el problema indicando que el MCP de Atlassian no está disponible o no hay conexión. Documentar la imposibilidad en el reporte y solicitar intervención humana antes de continuar. |
| **Permisos insuficientes** | No intentar eludir los permisos ni usar credenciales ajenas. Informar el bloqueo indicando qué operación no está permitida y solicitar intervención al administrador o al usuario con los permisos adecuados. |
| **Transición no disponible** | No continuar con la implementación. Informar el estado actual de la tarjeta y especificar qué transición falta (por ejemplo: "La tarjeta está en `Por hacer` pero no hay transición disponible a `En curso`"). Detenerse y solicitar que se configure la transición correcta antes de continuar. |
| **Estado inesperado** | No asumir que el estado es equivalente a `En curso` por ninguna razón. Detenerse y solicitar aclaración o intervención. Documentar el estado actual observado y por qué no corresponde ni a `En curso` ni a un estado con transición conocida. |
| **Transición solicitada sin confirmación** | Considerar que el cambio de estado **no está verificado** y **no continuar** con acciones de implementación. Después de solicitar la transición, volver a consultar Jira y comprobar que el estado realmente cambió a `En curso`. Si no cambió, no proceder y reportar que la transición no tuvo efecto. |

**Salida finita para todos los escenarios:**
1. Identificar el bloqueo
2. Conservar evidencia (estado observado, mensaje de error, IDs involucrados)
3. Informar claramente qué intervención se necesita
4. Detener las acciones dependientes de la autorización

**Durante el trabajo:**
- `En curso` = implementación o corrección activa.
- Una tarjeta en `Por hacer` no puede tener cambios activos.

> **Esto es una guardia obligatoria**: el agente debe verificar el estado de Jira
> antes de tocar cualquier archivo. Si no puede verificar, detenerse y solicitar
> intervención.

## Consultar la tarjeta (§0)

1. Resolver `cloudId` una vez por sesión con
   `getAccessibleAtlassianResources` y reutilizarlo.
2. Leer con `getJiraIssue` (`issueIdOrKey: <ID>`, solicitando los campos
   disponibles de la incidencia): Summary, Description, Status y
   Acceptance Criteria dentro de la descripción (si existe).
3. Sin MCP, sin acceso o tarjeta inexistente: detenerse y avisar (§0.4).

## Tarea principal en curso durante subtareas (§17)

1. Antes de comenzar a trabajar una subtarea, identificar su tarea
   principal (`fields.parent` de la subtarea con `getJiraIssue`) y
   verificar su estado (`fields.status`).
2. Si la tarea principal no está en `En curso`, listar sus transiciones
   reales con `getTransitionsForJiraIssue` y aplicar la transición a
   `En curso` con `transitionJiraIssue` (por `transitionId`, nunca por
   nombre inventado).
3. Si esa transición no existe: no usar otra transición ni cambiar a
   otro estado; informarlo en el campo `Jira:` del reporte (§18).

## Ciclo obligatorio de estados Jira (§17)

### Guardia de entrada obligatoria: estado "En curso"

**Antes de modificar archivos, commits, pushes o Pull Requests:**

1. **La tarjeta correspondiente debe estar en `En curso`.**
   - Esta es una guardia obligatoria: si la tarjeta está en `Por hacer`,
     **no** modificar archivos, crear commits, hacer push ni abrir una PR.
   - Si la tarjeta está en `Por hacer` y el agente necesita trabajar en ella,
     debe transicionarse a `En curso` primero usando `transitionJiraIssue`
     (por `transitionId`, nunca por nombre inventado).
   - Si la tarjeta no existe o el MCP no está disponible: detenerse y avisar.

2. **Si se trabaja una subtarea, su tarjeta padre también debe estar en `En curso`.**
   - Una tarea principal nunca permanece en `Por hacer` mientras sus subtareas
     ya están siendo ejecutadas.

3. **Una tarjeta en `Por hacer` no puede tener cambios activos.**
   - Este es un punto crítico de cumplimiento: los agentes deben verificar este
     estado antes de tocar cualquier archivo relacionado con la tarea.

Durante el trabajo:

* `En curso` = implementación o corrección activa.
* `Tarea terminada` = desarrollo terminado y validación técnica del
  desarrollador aprobada, incluyendo unit tests y comprobaciones locales
  o CI; todavía no está en staging.
* `Listo para pruebas` = cambio desplegado correctamente en staging y
  disponible para QA.
* `En pruebas` = tester QA inició las pruebas manuales en staging.
  No representa pruebas del desarrollador.
* `Listo` = QA aprobó la tarea y la evidencia quedó registrada sin defectos
  pendientes.

### Transiciones obligatorias y re-apertura

Una subtarea solo puede pasar a `Tarea terminada` después de validar su
commit con las pruebas del desarrollador y agregar el comentario
correspondiente. Solo pasa a `Listo para pruebas` después de un
despliegue exitoso en staging. Después de que QA inicia, pasa a `En
pruebas`; tras la aprobación de QA pasa a `Listo` con su evidencia de
cierre. Si una observación o fallo reabre trabajo, devolver la tarjeta a
`En curso` antes de modificarla. **No inventar transiciones.**

Para reabrir trabajo observado:

* Si una observación reabre una subtarea o tarea: devolverla a `En curso`
  antes de corregirla.
* Si falla una prueba del desarrollador: mantener la tarjeta en `En curso`.
* Si falla QA: devolverla también a `En curso`.
* No inventar transiciones; solo usar estados y transiciones existentes en Jira.

## Transicionar al estado correspondiente (§17)

1. Solo después de que todas las validaciones de la tarea pasaron y
   existe el commit correspondiente a esa subtarea/tarea.
2. Determinar el destino según la fase real: desarrollo validado →
   `Tarea terminada`; cambio desplegado en staging → `Listo para
   pruebas`; QA iniciado → `En pruebas`; QA aprobado → `Listo`.
3. Terminar una subtarea no cambia el estado de su tarea principal.
   No mover la tarea principal a `Tarea terminada` solo porque terminó
   una subtarea; la finalización de todas las subtareas necesarias solo
   permite ese estado cuando su propio trabajo también está terminado y
   validado por el desarrollador.
4. Observaciones del usuario: al retomar el trabajo sobre una tarea o
   subtarea en `Tarea terminada`, `Listo para pruebas`, `En pruebas` o
   `Listo`, devolver esa tarjeta a `En curso`. Tras corregir y validar
   de nuevo por el desarrollador, volver a `Tarea terminada` y
   continuar el flujo de staging y QA.
5. Listar transiciones reales con `getTransitionsForJiraIssue`.
6. Si existe la transición al estado destino, aplicarla con
   `transitionJiraIssue` pasando `{ transition: { id: <transitionId> } }`;
   nunca usar un nombre inventado.
7. Si no existe para esa tarjeta: no usar otra transición ni cambiar
   a otro estado; informarlo en el campo `Jira:` del reporte (§18).

## Comentario obligatorio en Jira (§17)

1. Con `addCommentToJiraIssue` (`issueIdOrKey: <ID>`) agregar el
   comentario resumido en la subtarea o tarea principal terminada.
   Para actualizar uno existente, pasar su `commentId` explícito.
2. Contenido breve: qué se realizó; resultado; validaciones
   ejecutadas; commit relacionado, cuando corresponda.
3. Comentario de resumen en la tarjeta padre (cierre de tareas con
   subtareas): con `addCommentToJiraIssue`
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

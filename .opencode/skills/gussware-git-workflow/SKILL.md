---

name: gussware-git-workflow
description: Gestiona el flujo Git y Git Worktree de GussWare para ramas de tarea, worktrees, upstreams, fetch, pull, commits, push y Pull Requests, incluyendo contexto y cierre de tarjetas Jira. Usar cuando una tarea implique operaciones Git, branches, worktrees o Pull Requests, o cuando la solicitud incluya un ID Jira (p. ej. RGW-272).
---

# GussWare Git Workflow

## Purpose

Aplicar el flujo Git estándar del proyecto GussWare Site.

Este Skill controla únicamente operaciones relacionadas con:

* Git
* Git Worktree
* Branches
* Upstream
* Fetch
* Pull
* Commits
* Push
* Pull Requests
* Contexto y cierre de tarjetas Jira vinculadas a la tarea (§0, §17)

Las reglas generales de desarrollo del proyecto permanecen en `AGENTS.md`.

---

## 0. Contexto Jira (antes de ramas y worktrees)

Si la solicitud incluye explícitamente un ID Jira (p. ej. `RGW-272`):

1. Consultar la tarjeta vía MCP de Atlassian antes de crear o
   seleccionar branch/worktree (el Summary y el alcance alimentan §3).
   Detalle operativo en [reference.md](reference.md).
2. Obtener como mínimo: Summary, Description, Status y Acceptance
   Criteria (si existe). El Sprint no es obligatorio.
3. No inferir una tarjeta desde el nombre de branch/worktree.
4. Si el MCP no está disponible, no hay acceso, la tarjeta no existe
   o el alcance está vacío/ambiguo: detenerse y preguntar. No inventar
   requisitos ni alcance por inferencia.

Sin ID Jira explícito en la solicitud, continuar con §1.

---

## 1. Initial Verification

Antes de realizar operaciones Git, verificar el estado actual:

```bash
pwd
git status --short --branch
git branch --show-current
git branch -vv
git worktree list
git remote -v
git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'
```

Nunca asumir que el upstream configurado es correcto.

---

## 2. Remote Synchronization

Antes de crear una nueva rama de tarea:

```bash
git fetch origin
```

Las nuevas ramas de tarea deben partir de:

```text
origin/develop
```

No utilizar automáticamente el `develop` local como base.

---

## 3. Task Branches

Cada tarea independiente debe tener:

* su propio branch;
* su propio worktree;
* su propio upstream remoto.

Una tarjeta principal con subtareas es una sola unidad de trabajo Git:
se utiliza el mismo worktree y la misma rama de la tarjeta principal
para trabajar todas sus subtareas. No crear un worktree ni una rama
independiente por cada subtarea.

### Feature

```text
feature/<jira-id>-<short-description>
```

Ejemplo:

```text
feature/RGW-300-nueva-seccion
```

### Bug Fix

```text
fix/<jira-id>-<short-description>
```

Ejemplo:

```text
fix/RGW-301-error-formulario
```

Cuando exista Jira, el ID debe formar parte del nombre del branch.

---

## 4. Create Worktree

Crear una nueva tarea desde `origin/develop`:

```bash
git fetch origin
git worktree add ../gussware-<jira-id>-<short-description> \
  -b <branch-name> \
  origin/develop
```

Ejemplo:

```bash
git fetch origin
git worktree add ../gussware-RGW-300-nueva-seccion \
  -b feature/RGW-300-nueva-seccion \
  origin/develop
```

Después verificar:

```bash
git status --short --branch
git branch -vv
git worktree list
```

---

## 5. Worktree Safety

Antes de crear o modificar un worktree:

```bash
git worktree list
```

Si el branch ya está asociado a otro worktree:

* no eliminar el worktree;
* no moverlo;
* no hacer checkout forzado;
* no hacer detach;
* no modificarlo.

Primero determinar si ese worktree corresponde a la tarea actual.

Un branch puede estar legítimamente asociado a otro worktree.

No asumir que `develop` está disponible para checkout en cualquier worktree.

---

## 6. Branch and Upstream Verification

En el worktree de la tarea:

```bash
git branch --show-current
git status --short --branch
git branch -vv
```

La rama debe cumplir:

```text
branch actual = branch de la tarea
upstream = origin/<mismo branch>
```

Ejemplo:

```text
feature/RGW-300-nueva-seccion...origin/feature/RGW-300-nueva-seccion
```

`origin/develop` es la rama de integración y normalmente **no debe ser el upstream de una rama de tarea**.

---

## 7. First Push

Después del primer commit:

```bash
git push -u origin <branch-name>
```

Esto establece el upstream de la rama de tarea.

Después verificar:

```bash
git status --short --branch
git branch -vv
```

---

## 8. Fetch and Pull

Actualizar referencias remotas:

```bash
git fetch origin
```

Para actualizar una rama desde su propio upstream:

```bash
git pull --ff-only
```

No ejecutar automáticamente:

```bash
git pull origin develop
```

sobre una rama de tarea.

Si se necesita incorporar cambios de `origin/develop`, esa acción debe estar explícitamente justificada por la tarea.

No utilizar automáticamente merge, rebase o reset para resolver divergencias.

---

## 9. Wrong Upstream

Si una rama de tarea muestra:

```text
...origin/develop
```

como upstream, verificar el estado (§1) y comprobar si existe el
branch remoto correcto:

```bash
git ls-remote --heads origin <branch-name>
```

Si la rama actual corresponde claramente a la tarea y la rama remota correspondiente es la esperada, corregir el upstream mediante:

```bash
git push -u origin <branch-name>
```

Si existen divergencias, commits inesperados o contenido diferente en el remoto, detenerse y diagnosticar antes de hacer push.

Nunca sobrescribir el remoto para solucionar un upstream incorrecto.

---

## 10. Task Flow

El flujo estándar es:

```text
Solicitud con Jira → consultar Jira (§0)
      ↓ (sin tarjeta Jira, el flujo inicia aquí)
origin/develop
      ↓
git fetch
      ↓
crear branch + worktree
      ↓
verificar branch + upstream
      ↓
implementar tarea
      ↓
validar
      ↓
revisar diff
      ↓
commit
      ↓
push
      ↓
transicionar Jira al estado correspondiente (si aplica, §17)
      ↓
Pull Request
      ↓
origin/develop
```

No comenzar una tarea independiente nueva hasta completar el commit de la tarea actual.

Dentro de una tarjeta principal con subtareas: cada subtarea es una
unidad independiente de trabajo dentro de la tarjeta principal y debe
quedar en un commit independiente. Trabajar una subtarea a la vez y no
comenzar la siguiente hasta terminar y hacer commit de la actual.

---

## 11. Before Commit

Antes de crear un commit:

```bash
git status
git diff
git diff --stat
```

Verificar que:

* los cambios pertenecen a la tarea;
* no existen modificaciones accidentales;
* no se incluyeron archivos no relacionados;
* el diff representa exactamente el trabajo realizado.

No modificar archivos únicamente para limpiar el diff.

---

## 12. Commits

Formato:

```text
<tipo>(<jira-id>): <descripción>
```

Ejemplos:

```text
feat(RGW-300): agregar sección de servicios
fix(RGW-301): corregir validación del formulario
style(RGW-302): ajustar espaciado del hero
```

Los commits deben representar unidades lógicas de trabajo.

Cada subtarea terminada debe quedar en su propio commit independiente;
no agrupar varias subtareas en un mismo commit.

No utilizar:

```bash
git commit --amend
```

salvo instrucción explícita.

---

## 13. Push

Después de crear el commit:

```bash
git push
```

Si todavía no existe upstream:

```bash
git push -u origin <branch-name>
```

Después verificar:

```bash
git status --short --branch
git branch -vv
```

---

## 14. Pull Request

Los Pull Requests de tareas deben utilizar:

```text
base: develop
head: <branch de la tarea>
```

Antes de crear o entregar el Pull Request:

```bash
git status --short --branch
git branch -vv
git log --oneline --decorate -n 5
```

El branch debe estar publicado en `origin`.

No realizar el merge localmente.

---

## 15. Protected Operations

No ejecutar sin instrucción explícita:

```bash
git reset --hard
git clean -fd
git push --force
git push --force-with-lease
git branch -D
git worktree remove
git worktree prune
git checkout .
git restore .
git commit --amend
```

Tampoco eliminar, mover o modificar branches o worktrees pertenecientes a otras tareas.

---

## 16. Existing Local Changes

Si existen cambios antes de comenzar:

```bash
git status
git diff
```

No:

* eliminarlos;
* sobrescribirlos;
* hacer stash automáticamente;
* incluirlos automáticamente en el commit.

Determinar primero si pertenecen a la tarea actual.

Si no puede determinarse con seguridad, detenerse y solicitar instrucciones.

---

## 17. Completion Checklist

Si el flujo incluyó tarjeta Jira, solo después de que todas las
validaciones pasaron: transicionarla al estado correspondiente según
el tipo de tarjeta (ver [reference.md](reference.md)). Si esa
transición no existe para la tarjeta, no inventar otra ni cambiar a
otro estado: informarlo en el reporte.

Reglas de estado:

* Subtarea completamente terminada y validada → `Listo`. Nunca
  `Listo para pruebas`. Terminar una subtarea no cambia el estado de
  su tarea principal. Antes de cambiar el estado debe existir el
  commit correspondiente a esa subtarea.
* Tarea principal completamente terminada y validada → `Listo para
  pruebas` (queda esperando validación/prueba manual). No mover la
  tarea principal a `Listo para pruebas` solamente porque terminó una
  subtarea; solo cuando el trabajo completo de la tarea principal esté
  terminado y, cuando aplique, sus subtareas necesarias también estén
  terminadas. Mientras existan subtareas pendientes, la tarjeta
  principal continúa en su estado correspondiente. A partir de `Listo
  para pruebas` continúa el flujo normal ya definido (§13–§14, §18).
* Observaciones del usuario sobre una tarea principal en `Listo para
  pruebas`: al retomar el trabajo, devolver esa tarjeta a `En curso`.
  Tras corregir las observaciones y pasar nuevamente todas las
  validaciones, la tarea principal vuelve a `Listo para pruebas`.
* Observaciones sobre una subtarea: al retomar el trabajo, devolverla
  a `En curso`. Corregir únicamente las observaciones correspondientes
  a esa subtarea. Cuando vuelva a terminarse y validarse, regresa a
  `Listo`.

Comentario obligatorio en Jira (ver operación en
[reference.md](reference.md)):

* Cada vez que una subtarea quede terminada y validada, agregar un
  comentario resumido en esa subtarea.
* Cuando la tarea principal quede terminada, agregar también un
  comentario resumido en ella.
* Tras corregir observaciones (de subtarea o principal) y validar de
  nuevo, agregar/actualizar el comentario con el resumen de la
  corrección y validación.
* El comentario debe indicar de forma breve: qué se realizó;
  resultado; validaciones ejecutadas; commit relacionado, cuando
  corresponda.

Antes de finalizar:

* [ ] Existe un worktree propio para la tarea.
* [ ] Existe un branch propio para la tarea.
* [ ] El branch se originó desde `origin/develop`.
* [ ] El branch actual es el correcto.
* [ ] El upstream apunta al branch remoto correspondiente.
* [ ] El diff fue revisado.
* [ ] La validación correspondiente fue ejecutada.
* [ ] Existe un commit de la tarea.
* [ ] El commit fue enviado a `origin`.
* [ ] El branch remoto está actualizado.
* [ ] El Pull Request apunta a `develop`.
* [ ] La tarjeta Jira quedó en el estado correspondiente (§17:
  subtarea → Listo; tarea principal → Listo para pruebas; o su
  ausencia de transición quedó reportada; N/A sin tarjeta Jira).
* [ ] El comentario obligatorio en Jira fue agregado/actualizado (§17;
  N/A sin tarjeta Jira).
* [ ] No se modificaron otros branches o worktrees.

---

## 18. Final Report

Al finalizar una tarea, informar:

```text
Branch:
Worktree:
Commit:
Remote:
Upstream:
Pull Request:
Validation:
Jira:
Status:
```

El reporte debe contener únicamente información relacionada con la tarea realizada.

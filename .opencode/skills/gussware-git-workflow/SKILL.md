---

name: gussware-git-workflow
description: Gestiona el flujo Git y Git Worktree de GussWare para ramas de tarea, worktrees, upstreams, fetch, pull, commits, push y Pull Requests. Usar cuando una tarea implique operaciones Git, branches, worktrees o Pull Requests.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

Las reglas generales de desarrollo del proyecto permanecen en `AGENTS.md`.

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
```

Para verificar el upstream actual:

```bash
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

como upstream, verificar:

```bash
git branch -vv
git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'
git remote -v
git worktree list
```

Comprobar si existe el branch remoto correcto:

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
Pull Request
      ↓
origin/develop
```

No comenzar una tarea independiente nueva hasta completar el commit de la tarea actual.

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
Status:
```

El reporte debe contener únicamente información relacionada con la tarea realizada.

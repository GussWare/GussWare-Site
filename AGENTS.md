# AGENTS.md

## Project

GussWare Site is a headless WordPress + Astro website.

* Frontend: Astro
* CMS: WordPress
* Styling: Tailwind CSS
* Content source: WordPress REST API
* Design source: Stitch / Penpot when explicitly referenced
* Repository integration branch: `origin/develop`

---

# Development Workflow

## Core Principle

Work only on the requested task.

Do not introduce additional refactors, cleanup, architectural changes, dependency changes, file removals, or behavior changes unless explicitly requested.

Reuse existing components, patterns, APIs, fields, taxonomies, and architecture whenever possible.

Do not create parallel implementations when an existing implementation can satisfy the requirement.

---

# Git and Worktree Strategy

This repository supports simultaneous work by the developer and multiple OpenCode sessions.

Each independent task must have its own Git worktree and branch.

An OpenCode session must never share a working tree with another active session.

## Branch Origin

New task branches must always originate from `origin/develop`.

Before creating a task branch:

```bash
git fetch origin
```

Never create a task branch from another OpenCode session's branch.

Never work directly on `develop`.

## Jira ID

When the task is associated with a Jira ticket, the **Jira ticket ID must be included in both the branch name and the worktree name**.

Use the Jira ID exactly as provided.

Example:

```text
RGW-225
```

Preferred branch format:

```text
feature/<jira-id>-<short-description>
```

Preferred worktree format:

```text
../gussware-<jira-id>-<short-description>
```

Example:

```text
Branch:
feature/RGW-225-expertise

Worktree:
../gussware-RGW-225-expertise
```

For bug fixes:

```text
Branch:
fix/RGW-227-polylang

Worktree:
../gussware-RGW-227-polylang
```

If there is no Jira ID associated with the task, use a clear short task identifier instead.

Do not invent a Jira ID.

## Worktree Rules

An OpenCode session must work exclusively inside its assigned worktree.

Never:

* switch to another session's branch;
* checkout another task branch;
* modify files belonging to another worktree;
* work directly on `develop`;
* reset, rebase, or merge another session's branch without explicit instruction.

Before modifying files, verify:

```bash
git branch --show-current
git status --short
git worktree list
```

The current branch must belong exclusively to the current task/session.

## Creating a New Task Worktree

When a new task requires an isolated workspace:

```bash
git fetch origin
git worktree add ../gussware-<jira-id>-<short-description> -b <type>/<jira-id>-<short-description> origin/develop
```

Example:

```bash
git fetch origin
git worktree add ../gussware-RGW-225-expertise -b feature/RGW-225-expertise origin/develop
```

Then work exclusively inside that worktree.

If the current session is already inside an assigned worktree, do not create another worktree unless explicitly requested.

---

# Task Execution

For implementation tasks, follow this sequence:

1. Understand the requirement and Jira ticket.
2. Inspect the existing architecture and implementation.
3. Identify reusable components and existing patterns.
4. Define the smallest required change.
5. Implement only the requested scope.
6. Run the relevant tests/build/validation.
7. Review the resulting diff.
8. Commit the completed task.
9. Push the task branch to `origin`.
10. Leave the branch ready for Pull Request → `origin/develop`.

Do not start the next unrelated task before the current task has been validated and committed.

---

# Git Safety

Never execute destructive Git operations unless explicitly requested.

Do not use:

```bash
git reset --hard
git clean -fd
git checkout .
git restore .
```

Do not discard existing user changes.

If the worktree contains modifications that were not created by the current task, preserve them and determine whether they affect the requested work before proceeding.

Never amend another developer/session's commit unless explicitly instructed.

Never force-push unless explicitly instructed.

Never merge directly into `develop` unless explicitly instructed.

---

# Commits

Create commits when the requested task is complete and validated.

Commits should:

* contain only changes related to the task;
* use a clear message;
* not include unrelated cleanup;
* leave the worktree clean when possible.

Preferred format:

```text
feat: <description>
fix: <description>
refactor: <description>
docs: <description>
test: <description>
```

If the repository uses a more specific commit convention, follow the existing convention.

---

# Pull Requests

The normal integration flow is:

```text
origin/develop
      │
      ├── feature/RGW-225-task-01
      │
      ├── feature/RGW-226-task-02
      │
      └── fix/RGW-227-task-03
             │
             ▼
       Pull Request
             │
             ▼
      origin/develop
```

Every Pull Request created for an OpenCode task must target:

```text
origin/develop
```

OpenCode must:

1. Commit the completed task.
2. Push the task branch to `origin`.
3. Create or prepare the Pull Request with base `origin/develop`.
4. Never merge the Pull Request unless explicitly instructed.

Before reporting the task as complete, provide:

* Jira ID;
* current branch;
* worktree;
* commit hash;
* push status;
* Pull Request target: `origin/develop`;
* validation performed;
* any remaining limitation.

---

# Architecture

Follow the existing project architecture before introducing new structures.

Prefer:

* reuse over duplication;
* existing components over new components;
* existing data models over new models;
* existing API clients over duplicated HTTP logic;
* existing design tokens over new arbitrary values;
* small, focused changes over structural churn.

Do not modify architecture merely to make an individual task easier.

---

# WordPress / Astro

WordPress is the content and semantic source.

Astro is responsible for presentation and frontend behavior.

When migrating or creating content in WordPress:

* use existing CPTs;
* use existing taxonomies;
* use existing ACF fields;
* preserve Polylang relationships;
* do not invent content;
* do not create fields merely to force a visual implementation unless explicitly requested.

When implementing the frontend:

* consume the existing WordPress data model;
* respect the project's existing design tokens;
* preserve existing responsive behavior;
* do not move presentation concerns into WordPress/Gutenberg unless explicitly requested.

---

# Design Fidelity

When a task references Stitch, Penpot, or another approved design source:

1. Inspect the complete referenced design.
2. Identify the actual content, structure, states, responsive behavior, and visual elements relevant to the task.
3. Reuse existing project components where possible.
4. Implement the requested design without inventing missing content.
5. Respect the existing GussWare design tokens and color system.

Do not replace a requested design with a simplified approximation unless explicitly instructed.

---

# WordPress Content Migration

When migrating content from Stitch to WordPress:

1. Audit the complete source before writing.
2. Inspect the existing WordPress data model.
3. Map every source datum to an existing destination field.
4. Do not invent missing information.
5. Do not create new ACF fields, taxonomies, or relationships unless explicitly requested.
6. Preserve language and Polylang relationships.
7. Validate the resulting WordPress data through REST after writing.

If source content has no existing destination field, report it instead of silently changing the data model.

---

# Visual Implementation & 1:1 Validation

For any task that creates, modifies, or reproduces a visual UI, page, section, component, layout, or design from a reference such as Stitch, Figma, Penpot, screenshot, or existing visual specification, visual fidelity validation is **mandatory**.

A visual implementation task is not complete until the rendered result has been compared against the authoritative reference.

## Required Workflow

After implementation:

1. Identify the authoritative visual reference before implementation.
2. Inspect the complete reference, including all visible elements and relevant responsive states.
3. Implement the requested UI using the project's existing architecture, components, design tokens, colors, typography, spacing, assets, and responsive conventions.
4. Render the implementation in a real browser at the relevant viewport sizes.
5. Compare the rendered implementation against the reference **element by element**.
6. Identify every relevant visual discrepancy.
7. Correct the discrepancies found.
8. Render the implementation again.
9. Repeat the comparison after corrections.
10. Perform a final 1:1 visual validation.
11. Only after visual validation passes, continue with functional validation, diff review, commit, and Pull Request workflow.

When browser automation or screenshot tooling is available in the project environment, use it for visual validation instead of relying only on source-code inspection.

Do not consider visual validation complete merely because the page builds successfully or the source code appears correct.

## Element-by-Element Checklist

Verify, when applicable:

* page/section structure and hierarchy;
* element presence and absence;
* element order;
* container widths and max-widths;
* columns and grid structure;
* horizontal and vertical alignment;
* margins;
* padding;
* gaps;
* section spacing;
* typography family/font;
* font loading;
* font size;
* font weight;
* line height;
* letter spacing;
* text wrapping;
* text color;
* background colors;
* borders;
* border radius;
* shadows;
* icons;
* images;
* image dimensions;
* image positioning;
* decorative elements;
* dividers;
* buttons;
* links;
* hover/focus states when represented by the reference;
* navigation elements;
* responsive behavior;
* desktop/tablet/mobile differences.

## Reference Fidelity Rules

The objective is not to create a visually similar interpretation.

The implementation must reproduce the reference as accurately as the project's architecture and available assets allow.

Prefer existing project design tokens, components, utilities, fonts, icons, and patterns over creating new equivalents.

Do not invent visual values when the reference or existing project system provides the correct value.

Do not simplify, omit, or rearrange visual elements from the reference without an explicit requirement.

Do not modify the WordPress editorial/content layer merely to reproduce visual styling when the project architecture defines Astro/Tailwind as the presentation layer.

If a reference element cannot be reproduced exactly because the required asset, font, browser capability, or technical information is unavailable, document the limitation instead of silently approximating it.

## Validation Evidence

For every visual implementation task, the final report must include:

* reference used;
* viewport(s) validated;
* browser/tool used for validation;
* main visual discrepancies found;
* corrections performed;
* final validation result;
* any remaining discrepancy and its documented reason.

A visual implementation task without a completed 1:1 comparison is **not considered complete**.

---

# Development Server

When starting the Astro development server, use background mode:

```bash
astro dev --background
```

Manage the background server with:

```bash
astro dev stop
astro dev status
astro dev logs
```

Do not start multiple unnecessary development servers.

---

# Validation

Before completing an implementation task, run the smallest relevant validation.

Depending on the task, this may include:

```bash
npm run build
```

Tests, linting, type checking, REST validation, or targeted browser verification may also be required depending on the affected functionality.

For visual implementation tasks, the Visual Implementation & 1:1 Validation workflow is mandatory in addition to normal technical validation.

Do not claim a task is complete without validating the relevant behavior.

---

# Documentation

Full Astro documentation:

https://docs.astro.build

Consult the relevant official documentation before implementing unfamiliar Astro functionality:

* Routing:
  https://docs.astro.build/en/guides/routing/

* Astro components:
  https://docs.astro.build/en/basics/astro-components/

* Framework components:
  https://docs.astro.build/en/guides/framework-components/

* Content:
  https://docs.astro.build/en/guides/content-collections/

* Styling / Tailwind:
  https://docs.astro.build/en/guides/styling/

* Internationalization:
  https://docs.astro.build/en/guides/internationalization/

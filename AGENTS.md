# GussWare Site — Agent Instructions

## Project

GussWare Site is a headless WordPress + Astro website.

* Frontend: Astro
* CMS: WordPress
* Styling: Tailwind CSS
* Content source: WordPress REST API
* Design sources: Stitch / Penpot when explicitly referenced
* Integration branch: `origin/develop`

---

## Core Development Rules

Work only on the requested task.

Do not introduce additional refactors, cleanup, architectural changes, dependency changes, file removals, or behavior changes unless explicitly requested.

Reuse existing components, patterns, APIs, fields, taxonomies, and architecture whenever possible.

Do not create parallel implementations when an existing implementation can satisfy the requirement.

Prefer the smallest change that completely satisfies the requested requirement.

---

## Git and Worktrees

Git and worktree operations must follow the project skill:

`gussware-git-workflow`

Before performing Git operations involving worktrees, branches, commits, push, pull, or Pull Requests, load and follow that skill.

Fundamental rules:

* Each independent task must have its own branch and worktree.
* Never work directly on `develop`.
* Task branches originate from `origin/develop`.
* A task branch must track its corresponding remote task branch.
* Pull Requests normally target `origin/develop`.
* Never perform destructive Git operations without explicit instruction.
* Never modify another task's worktree or branch.

---

## Architecture

Follow the existing project architecture before introducing new structures.

Prefer:

* reuse over duplication;
* existing components over new components;
* existing data models over new models;
* existing API clients over duplicated HTTP logic;
* existing design tokens over arbitrary values;
* focused changes over structural churn.

Do not modify architecture merely to make an individual task easier.

---

## WordPress / Astro

WordPress is the content and semantic source.

Astro is responsible for presentation and frontend behavior.

When working with WordPress content:

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
* keep presentation concerns in Astro/Tailwind unless explicitly requested otherwise.

---

## WordPress Content Migration

When migrating content from Stitch or another approved design source to WordPress:

1. Audit the complete source before writing.
2. Inspect the existing WordPress data model.
3. Map source data to existing destination fields.
4. Do not invent missing information.
5. Do not create new ACF fields, taxonomies, or relationships unless explicitly requested.
6. Preserve language and Polylang relationships.
7. Validate resulting WordPress data through REST after writing.

If source content has no existing destination field, report it instead of silently changing the data model.

---

## Design Fidelity

When a task explicitly references Stitch, Penpot, Figma, screenshots, or another visual reference:

1. Inspect the complete relevant reference.
2. Identify the required structure, content, states, responsive behavior, and visual elements.
3. Reuse existing project components where possible.
4. Reuse existing GussWare design tokens, typography, colors, spacing, assets, and patterns.
5. Implement the requested design without inventing missing content.
6. Validate the rendered result against the authoritative reference.

Do not replace a requested design with a simplified approximation unless explicitly instructed.

Do not create arbitrary visual values when the reference or existing design system provides the correct value.

---

## Visual Validation

For visual implementation tasks, validation must include the rendered result, not only source-code inspection.

When browser or screenshot tooling is available:

1. Render the implementation in a real browser.
2. Validate the relevant desktop, tablet, and mobile states.
3. Compare the implementation against the authoritative reference.
4. Check relevant layout, spacing, typography, colors, assets, alignment, states, and responsive behavior.
5. Correct discrepancies found.
6. Render again and perform the final comparison.

A successful build alone does not constitute visual validation.

The final report for a visual task must state:

* reference used;
* viewport(s) validated;
* browser/tool used;
* relevant discrepancies found;
* corrections performed;
* final validation result;
* remaining discrepancies, if any.

---

## Development Server

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

## Validation

Before completing an implementation task, run the smallest relevant validation.

Depending on the affected functionality, this may include:

```bash
npm run build
```

Tests, linting, type checking, REST validation, or browser verification should be performed when relevant to the task.

Do not claim a task is complete without validating the affected behavior.

---

## Documentation

When implementing unfamiliar Astro functionality, consult the relevant official Astro documentation.

* Astro: https://docs.astro.build
* Routing: https://docs.astro.build/en/guides/routing/
* Astro components: https://docs.astro.build/en/basics/astro-components/
* Framework components: https://docs.astro.build/en/guides/framework-components/
* Content: https://docs.astro.build/en/guides/content-collections/
* Styling / Tailwind: https://docs.astro.build/en/guides/styling/
* Internationalization: https://docs.astro.build/en/guides/internationalization/

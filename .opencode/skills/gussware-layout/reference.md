# Referencia operativa de maquetación (gussware-layout)

Catálogo verificado del sistema visual existente. Las reglas viven en
`SKILL.md`; aquí solo el qué existe y con qué props/tokens.

## Componentes UI (`src/components/ui/`)

| Componente        | Props principales                                                                 | Notas                                              |
|-------------------|-----------------------------------------------------------------------------------|----------------------------------------------------|
| `Container`       | `class?`                                                                          | 1280px, centrado, gutter `px-4` / `md:px-6`        |
| `Section`         | `id?`, `class?`                                                                   | `py` 64px mobile / 120px desktop; integra `Container` |
| `SectionHeading`  | `eyebrow?`, `title`, `level?` (1\|2\|3, defecto 2), `description?`, `align?` (left\|center) | eyebrow `label-bold` uppercase; título `headline-md` |
| `Card`            | `image?` {src, alt}, `imageHeight?`, `badge?`, `title`, `description?`, `date?`, `readingTime?`, `href?`, `linkLabel?` (=`Read more`), `class?` | `article`; imagen `4/3` o altura fija; sin sombras |
| `Button`          | `variant?` (primary\|secondary\|ghost\|outline-light), `href?`, `type?`, `class?` | `href` → `<a>`; si no → `<button>`; `px-6 py-3`, `rounded-none`; `outline-light` = outline claro para fondos oscuros (RGW-312) |
| `Badge`           | `class?` (slot)                                                                   | Variante única; `px-3 py-1`, `label-bold` uppercase |
| `Breadcrumbs`     | `items` [{label, href?}], `class?`                                                | Último ítem sin `href` = página actual (`aria-current`) |
| `CTA`             | `eyebrow?`, `title?`, `description?`, `align?`, `tone?` (light\|dark), `actions?` [{label, href, variant?, icon?, buttonClass?}], `class?`, `titleClass?` | Compone `SectionHeading` + `Button`; fila `mt-8 flex flex-wrap gap-4` |
| `Divider`         | `class?`                                                                          | `<hr>` sin márgenes propios; `border-gw-border-subtle` |
| `FormField`       | `id`, `label`, `type?`, `name?`, `required?`, `placeholder?`, `autocomplete?`, `error?`, `class?` | Label + input underline + error con `aria-describedby` |
| `Image`           | `src`, `alt`, `ratio?` (4/3\|16/9\|1/1), `fit?` (cover\|contain), `loading?` (lazy\|eager), `class?` | `<img>` nativo; URLs remotas (WordPress) |
| `Link`            | `href`, `target?`, `variant?` (nav\|body\|accent), `class?` (slot)                | Siempre `<a>`; focus visible con anillo |
| `Icon`            | `name` (catálogo cerrado), `size` (3/4/5/6/8/10), peso (standard\|emphasis)       | Trazados inline estilo Lucide; color `currentColor` |

Componentes de layout existentes: `Header`, `Footer`, `DesktopMenu*`,
`MobileMenu*`, `Seo` (`src/components/layout/`), `Layout`
(`src/layouts/`: `title`, `description?`, `localeUrls?`, `lang?`,
`seo?`). Componentes de dominio (no genéricos, no reutilizar fuera
de su contexto): `blog/*`, `contact/*`, `home/*`, `legal/*`,
`projects/*` (`ProjectListView`, `ProjectCard` del listado RGW-312),
`services/*`; utilidades puntuales: `Logo`, `LanguageSelector`,
`MenuButton`.

## Tokens (`src/styles/tokens/`)

Layout (`layout.css`): `--container-max: 1280px`;
`--section-padding-mobile: 64px`;
`--section-padding-desktop: 120px`; `--layout-gutter: 24px`.

Spacing (`spacing.css`, escala 0–120px): `0, 4, 8, 12, 16, 20, 24,
32, 40, 48, 64, 80, 96, 120`.

Tipografía (`typography.css`, familia `Source Sans 3`):
`display-lg` 64px/700 (mobile 40px), `headline-lg` 48px,
`headline-md` 32px/600, `body-lg` 20px, `body-md` 16px,
`label-bold` 14px/700, `navigation` 15px/600.

Color y forma (nombres de utilidades en uso): texto `text-gw-text-*`
(primary/secondary/muted); superficies `bg-gw-surface-*`;
bordes `border-gw-border-subtle`; marca `text-brand-*`
(secondary/accent/surface); acción `bg-gw-action-*`;
apoyo `supporting-blue-dark`; esquinas `rounded-none`.

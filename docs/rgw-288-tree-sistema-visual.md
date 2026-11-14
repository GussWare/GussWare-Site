# RGW-288 — Tree del sistema visual

## Fuente

Tree final de la estructura relacionada con tokens, estilos, tipografía, colores, layouts, páginas y componentes, basado exclusivamente en el código auditado (RGW-281 a RGW-287; hallazgos documentados en Jira como fuente de verdad). Refleja el estado real del código en `feature/RGW-280-auditoria-estilos` (commit `457a5db`), no un estado deseado.

## Alcance (archivos existentes no cubiertos por RGW-281 a RGW-287)

Existen en el árbol pero sin hallazgos documentados (no se afirma nada sobre ellos):
`src/pages/blog/`, `src/pages/[locale]/`, `src/pages/servicios/[slug].astro`,
`src/pages/navfixturetest.astro` (fixture de RGW-273), `src/components/layout/Seo.astro`,
`DesktopMenuNodes.astro`, `MobileMenuNode(s).astro`.

## 1. Árbol de definiciones (capas del sistema)

```
src/styles/
├── tokens/                          ← capa base (8 archivos, centralizados — RGW-281)
│   ├── brand.css                    --brand-primary #004a98 · --brand-secondary #2164a6 ·
│   │                                --brand-accent #ff5000 · --brand-surface #ffffff ·
│   │                                --brand-surface-secondary #f2f2f2 · --brand-highlight #ffd8d8
│   ├── supporting.css               --supporting-blue-* · --supporting-ink · --supporting-background ·
│   │                                --supporting-on-background · --supporting-surface-dim ·
│   │                                --supporting-outline · --supporting-outline-variant ·
│   │                                --supporting-neutral · --supporting-surface-tint · --supporting-tertiary-*
│   ├── state.css                    --state-error(-on/-container/-on-container)
│   ├── semantic.css                 roles semánticos --color-* (mapean brand + supporting + state):
│   │                                surface (primary/secondary/auxiliary/dim) · text (primary/secondary/muted) ·
│   │                                border (default/subtle) · action (primary/secondary + on) · state-error · highlight
│   ├── typography.css               --font-family-base 'Source Sans 3' ·
│   │                                escala: display-lg 64 · display-lg-mobile 40 · headline-lg 48 ·
│   │                                headline-md 32 · body-lg 20 · body-md 16 · navigation 15 ·
│   │                                label-bold 14 · pesos 400/600/700 · line-heights · letter-spacings
│   ├── spacing.css                  --space-0…30 → 0/4/8/12/16/20/24/32/40/48/64/80/96/120px
│   ├── shape.css                    --radius-none 0px · --stroke-width-default 1px · --stroke-width-strong 2px
│   └── layout.css                   --container-max 1280px · --layout-gutter 24px ·
│                                    --section-padding-desktop 120px · --section-padding-mobile 64px
├── theme.css                        exposición a Tailwind (@theme):
│   ├── capa cruda                   --color-brand-* · --color-supporting-* · --color-state-* → clases bg-brand-* / text-supporting-*
│   ├── capa semántica               --color-gw-* (gw-* evita colisiones en @theme) → clases bg-gw-* / text-gw-* / border-gw-*
│   ├── spacing                      --spacing-0…24 mapea a --space-0…24
│   ├── tipografía                   text-display-lg(-mobile) · text-headline-lg/md · text-body-lg/md ·
│   │                                text-label-bold · text-navigation · font-base (+leading/tracking/weight por token)
│   └── shape/layout                 --radius-gw-none (0 usos) · --container-gw (0 usos)
└── global.css                       importa los 8 tokens + theme.css; base mínima:
                                     font-family var(--font-family-base) · color/background con tokens ·
                                     resets img/svg/form/button · :root bg surface-primary / body bg surface-auxiliary
```

## 2. Árbol de componentes reutilizables (`src/components/ui/`)

```
src/components/ui/
├── Container.astro      RGW-98   mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6        → 6 usos
├── Section.astro        RGW-99   py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]
│                                 + Container integrado                                            → 14 usos
├── SectionHeading.astro RGW-100  eyebrow text-label-bold + text-headline-md + text-body-md        → 4 usos
├── Button.astro         RGW-104  primary bg-gw-action-primary · secondary border-gw-text-primary ·
│                                 ghost text-brand-secondary · text-label-bold · rounded-none      → 6 usos
├── Badge.astro                   rounded-none (alineado a --radius-none)                          → 3 usos
├── Card.astro                    border-gw-border-subtle rounded-none · Badge con rounded! (override) → 4 usos
├── CTA.astro                     tone dark/light                                                  → 2 usos
├── Breadcrumbs.astro                                                                              → 5 usos
├── Divider.astro                 (definido sin ningún uso en src)
├── Icon.astro                    currentColor · énfasis stroke 2/1.5 (literal, sin token)
├── Link.astro                    rounded-none
├── Image.astro
├── Logo.astro
├── MenuButton.astro              stroke-width="2" (literal)
├── LanguageSelector.astro
└── FormField.astro               focus:border-gw-action-secondary · text-gw-state-error
```

## 3. Árbol de uso (páginas y componentes consumidores)

```
src/
├── layouts/
│   └── Layout.astro                carga única de fuente Google Fonts Source+Sans+3 400/600/700/900
├── pages/
│   ├── index.astro                 Container + wrapper editorial max-w-[800px] (duplicado)
│   ├── [...uri].astro              páginas legales/dinámicas: LegalView + sección contacto duplicada (es/en)
│   ├── contact.astro               Section + sección contacto duplicada (es/en) + ContactForm
│   ├── servicios/index.astro       Section + SectionHeading + Card grid
│   ├── [locale]/servicios/index.astro
│   ├── 404.astro                   cabecera editorial py-16 sm:py-24 lg:py-32 (crudo) + font-black 900
│   └── 500.astro                   cabecera py crudo + patrón Container replicado en grid + font-black 900
├── components/
│   ├── home/
│   │   ├── Hero.astro              Section + Button primary · rounded-xl shadow-lg (sin token)
│   │   ├── Services.astro          Section
│   │   ├── Process.astro           Section · botón primario inline bg-brand-primary (azul, sin Button)
│   │   │                           · cards rounded-xl · label rounded (sin token)
│   │   ├── CommunityModel.astro    Section · rounded/rounded-xl/shadow ×18 sin token · border-l-4 acento
│   │   ├── Expertise.astro         Section
│   │   ├── Faq.astro               Section · eyebrow canónico inline
│   │   └── FinalCta.astro          Container + CTA · replica padding de Section inline (L36)
│   ├── services/
│   │   ├── ServiceHeader.astro     Section · eyebrow paralelo text-xs tracking-[0.2em] · marcador w-2.5
│   │   ├── ServiceApproach.astro   Section · eyebrow paralelo · font-mono · border-l-4 acento (estado activo)
│   │   ├── ServiceDetail.astro     Container replicado inline · eyebrow paralelo · marcadores w-2.5/w-2 ·
│   │   │                           text-white/border-white/10 (sin token) · CTA
│   │   └── ServiceFaq.astro        Section · eyebrow paralelo
│   ├── blog/
│   │   ├── BlogListView.astro      Container + SectionHeading + Card · cabecera py-16 md:py-24 (crudo) ·
│   │   │                           skeleton que replica Card a mano
│   │   ├── BlogArticleView.astro   Container + wrapper editorial max-w-[800px] · var(--font-size-*) correcto ·
│   │   │                           stack mono literal
│   │   └── RelatedArticles.astro   SectionHeading + Card · marcador h-2 w-2
│   ├── legal/
│   │   └── LegalView.astro         Container + wrapper editorial max-w-[800px] · <style is:global> para contenido WP:
│   │                               hex #e2e2e2 ×21 · #595c62 ×14 · 18 data-URIs SVG con %23 crudos ·
│   │                               tipografía cruda (0.75rem/0.875rem/1rem/títulos) · stack mono ×5
│   ├── layout/
│   │   ├── Header.astro            patrón Container replicado inline ×2 · Button
│   │   ├── Footer.astro            patrón Container replicado inline
│   │   └── DesktopMenuNode.astro   <style> con ámbito data-* (patrón deliberado, RGW-273)
│   ├── contact/
│   │   └── ContactForm.astro       border-l-4 acento conmutado por JS · tokens gw-state-error
│   └── ui/                         (ver árbol §2)
```

## 4. Rutas de acceso a los valores (color)

Tres rutas válidas convergen en los mismos tokens:

1. **Clases semánticas** `gw-*` (capa canónica): `border-gw-border-subtle` 72 usos · `text-gw-text-secondary` 71 · `text-gw-text-primary` 59 · `bg-gw-surface-secondary` 42 · `bg-gw-surface-primary` 26 · `text-gw-text-muted` 19 · `gw-highlight` 16 · `bg-gw-surface-auxiliary` 7 · `gw-state-error` 6.
2. **Clases crudas** `brand-*`/`supporting-*` (capa válida de marca): `text-supporting-blue-dark` 31 · `text-brand-surface` 26 · `bg-brand-primary` 19 · `text-brand-secondary` 19 · `bg-brand-surface` 13 · `bg-brand-accent` 12 · `text-brand-accent` 11 · `bg-supporting-neutral` 15.
3. **`var(--…)` directos** (en clases y CSS): `--color-brand-primary` 20 · `--color-text-primary` 13 · `--color-surface-primary` 9 · `--color-surface-auxiliary` 8 · `--container-max` 7 · `--section-padding-*` 6 · tipografía ~15.

## 5. Inconsistencias documentadas en el tree (basadas en RGW-282 a RGW-287)

| #   | Inconsistencia                                                                                                                                                            | Ubicación                                                                                                                                                                                                          | Definición relacionada                                        | Afecta a                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------- |
| 1   | Hex `#e2e2e2` ×21 (bordes)                                                                                                                                                | `legal/LegalView.astro` L270-1001                                                                                                                                                                                  | `--color-border-subtle` / `border-gw-border-subtle` (#c2c6d3) | páginas legales                        |
| 2   | Hex `#595c62` ×14 (texto meta)                                                                                                                                            | `legal/LegalView.astro` L346-1039                                                                                                                                                                                  | `--color-text-muted` / `text-gw-text-muted` (#737782)         | páginas legales                        |
| 3   | 18 data-URIs SVG con `%23` crudos (`#004a98` ×8, `#ff5000` ×6, `#2164a6` ×3, `#ffffff`, `#f9f9f9`)                                                                        | `legal/LegalView.astro` L520-1266                                                                                                                                                                                  | `ui/Icon.astro` / tokens de brand                             | iconos de páginas legales              |
| 4   | `text-white` / `border-white/10` sin token                                                                                                                                | `services/ServiceDetail.astro` L170/L265, `ServiceApproach.astro` L77                                                                                                                                              | `gw-surface-primary` (#ffffff)                                | catálogo de servicios                  |
| 5   | Botón primario inline con `bg-brand-primary` (azul) en vez del sistema de acción naranja                                                                                  | `home/Process.astro` L208                                                                                                                                                                                          | `--color-action-primary` (#ff5000) / `ui/Button.astro` L50    | home (Hero vs Process)                 |
| 6   | Tipografía cruda que duplica tokens (`0.875rem` ×12 ≡ label-bold, `0.75rem` ×15 sin token, `1rem` ×5 ≡ body-md, títulos 1.5-2.25rem fuera de escala, line-heights crudos) | `legal/LegalView.astro`                                                                                                                                                                                            | `text-label-bold` / `text-body-md` / escala tipográfica       | páginas legales                        |
| 7   | Stack mono por dos mecanismos (literal ×6 vs `font-mono` ×4), sin `--font-family-mono`                                                                                    | `LegalView.astro` ×5, `BlogArticleView.astro` L206 vs `ServiceDetail.astro` L83, `ServiceApproach.astro` L86, `404.astro` L71, `500.astro` L135                                                                    | ausencia de token de familia mono                             | legales, blog, servicios, error pages  |
| 8   | Escala por defecto de Tailwind conviviendo con la escala de tokens (`text-xs/sm/2xl/3xl/4xl`, 53 usos)                                                                    | `ServiceDetail` 19 · `500` 6 · `ServiceHeader` 6 · `ServiceApproach` 6 · `404` 5 · `ServiceFaq` 4 · `Process` 4 · `LanguageSelector` 2 · `CommunityModel` 1                                                        | `text-headline-md` / escala tipográfica                       | servicios, home, error pages           |
| 9   | Micro-etiquetas y overline sin token (`text-[9px]/[10px]/[12px]`, `tracking-[0.2em]` ×5, `font-black` 900)                                                                | `ServiceApproach.astro` L77, `CommunityModel.astro` ×5, `500.astro` L15/103, `ServiceHeader.astro` L44, `ServiceDetail.astro` L107/L205, `ServiceFaq.astro` L39, `404.astro` L44/48, `500.astro` L57               | ausencia de token para el patrón                              | servicios, home, error pages           |
| 10  | Patrón Container replicado inline ×5                                                                                                                                      | `layout/Header.astro` L59/L113, `layout/Footer.astro` L41, `services/ServiceDetail.astro` L68, `pages/500.astro` L36                                                                                               | `ui/Container.astro` L21                                      | header/footer globales, servicios, 500 |
| 11  | Wrapper editorial `max-w-[800px] pt-16 md:pt-24 pb-16 md:pb-24` duplicado ×4 (sin token de 800px)                                                                         | `legal/LegalView.astro` L203, `blog/BlogArticleView.astro` L71, `pages/[...uri].astro` L364, `pages/index.astro` L141                                                                                              | inexistente (vs `--container-max` 1280)                       | legales, blog, dinámicas, index        |
| 12  | Padding de Section replicado inline                                                                                                                                       | `home/FinalCta.astro` L36                                                                                                                                                                                          | `ui/Section.astro` L27 (`--section-padding-*`)                | FinalCta del home                      |
| 13  | Paddings de sección crudos (64/96/128)                                                                                                                                    | `blog/BlogListView.astro` L55, `404.astro` L32, `500.astro` L33                                                                                                                                                    | `--section-padding-*` (64/120)                                | cabeceras editoriales                  |
| 14  | Radios y sombras sin token (`rounded-xl` ×9, `rounded` ×6, `rounded-sm` ×3, `rounded-lg` ×1, `shadow-sm/md/lg` 11/3/7)                                                    | `home/Hero.astro`, `home/Process.astro`, `home/CommunityModel.astro` (×18), `pages/contact.astro` L86, `pages/[...uri].astro` L351                                                                                 | `--radius-none` (sistema cuadrado, `rounded-none` ×34)        | home y contacto                        |
| 15  | Override `rounded!` de Card sobre Badge (`rounded-none`) — única forma de `!important` en `src`                                                                           | `ui/Card.astro` L91 vs `ui/Badge.astro` L25                                                                                                                                                                        | `--radius-none` / `Badge`                                     | badges de cards (blog/servicios)       |
| 16  | Acento izquierdo `border-l-4 border-l-brand-primary` sin token (+ variante `border-l-2` en 500)                                                                           | `home/CommunityModel.astro` L210, `contact/ContactForm.astro` L58, `services/ServiceApproach.astro` L81, `500.astro` L131                                                                                          | `--stroke-width-strong` / ausencia de token de acento         | home, contacto, servicios, 500         |
| 17  | Eyebrow con 3 implementaciones (canónica `text-label-bold`, paralela `text-xs tracking-[0.2em]` ×5, cruda CSS en LegalView)                                               | `ui/SectionHeading.astro` L41, `pages/contact.astro` L45, `pages/[...uri].astro` L310 vs `services/*` vs `LegalView.astro` L289-310                                                                                | `text-label-bold` (14px)                                      | secciones de todo el sitio             |
| 18  | Botón primario / eyebrow / marcadores replicados inline                                                                                                                   | `home/Process.astro` L208, `services/ServiceHeader.astro` L41, `services/ServiceDetail.astro` L138/L157, barras `ServiceDetail.astro` L78, `404.astro` L40, `500.astro` L47/L67/L108, `RelatedArticles.astro` L217 | `ui/Button`, `ui/Badge`                                       | home, servicios, blog, error pages     |
| 19  | Sección de contacto duplicada es/en (~55 líneas)                                                                                                                          | `pages/contact.astro` L41-93 vs `pages/[...uri].astro` L306-355                                                                                                                                                    | inexistente (`ContactSection.astro` no existe)                | contacto es/en                         |
| 20  | Skeleton del blog replica la geometría de Card a mano                                                                                                                     | `blog/BlogListView.astro` L194-202                                                                                                                                                                                 | `ui/Card.astro`                                               | estados de carga del blog              |
| 21  | Contradicción interna: H1 legal con dos tokens de texto según rama                                                                                                        | `legal/LegalView.astro` L312-319 (`--color-text-secondary`) vs L205 (`text-gw-text-primary`)                                                                                                                       | `--color-text-primary` / `--color-text-secondary`             | páginas legales                        |
| 22  | Doble fondo base `:root` (#fff) vs `body` (#f9f9f9)                                                                                                                       | `styles/global.css` L18-24 vs L30-35                                                                                                                                                                               | `--color-surface-primary` / `--color-surface-auxiliary`       | fondo global                           |

## 6. Definiciones sin uso

| Definición                                  | Ubicación                         | Detalle                                                                                                                 |
| ------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `--color-gw-brand-primary/secondary/accent` | `theme.css` L70-72                | 0 usos de clases `gw-brand-*`; los componentes consumen `text-brand-*` de la capa cruda                                 |
| `--stroke-width-default/strong`             | `shape.css` L6-7                  | sin exposición en `theme.css` ni clase Tailwind; `Icon.astro` L151 y `MenuButton.astro` L49 usan literales equivalentes |
| `--container-gw` / `--radius-gw-none`       | `theme.css` L207 / L201           | 0 usos de `max-w-gw` / `rounded-gw`; los usos van por el built-in de Tailwind (valor coincidente)                       |
| `ui/Divider.astro`                          | `src/components/ui/Divider.astro` | componente sin ningún uso en `src`                                                                                      |

## 7. Patrones válidos confirmados (sin inconsistencia)

- Tokens centralizados en `src/styles/tokens/` (RGW-281): una sola estructura, sin paralela.
- `global.css`: base mínima con tokens, sin valores fuera de tokens.
- Familia base con carga única en `Layout.astro` y aplicación en `global.css`.
- Consumo de clases tipográficas de token en ~28 archivos (158 usos) y `var(--font-size-*)` en `BlogArticleView.astro`.
- `border-gw-border-subtle` como patrón de borde dominante (72 usos) y `rounded-none`/`rounded-full` como forma consistente del sistema.
- Spacing vía clases Tailwind mapeadas al espacio de tokens; `Container`/`Section` usados en 20 importaciones.
- `DesktopMenuNode.astro` con ámbito `data-*` (patrón deliberado, RGW-273) y `<style is:global>` de LegalView justificado para contenido WP.
- Estados hover/focus (`hover:opacity-90`, `hover:bg-gw-text-primary`, `hover:underline`, `ring-supporting-blue-dark`) y transiciones `transition-colors duration-200` consistentes en todo el sitio.

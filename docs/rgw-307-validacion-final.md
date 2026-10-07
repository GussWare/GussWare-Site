# RGW-307 — Validación final del sistema visual estandarizado

Evidencia del resultado final tras RGW-299 a RGW-306, validado contra
la auditoría RGW-280 y el tree RGW-288. Estado del código en la rama
`feature/RGW-298-sistema-visual`. Solo hallazgos documentados; el
archivo anterior (`rgw-288-tree-sistema-visual.md`) conserva el estado
de partida como referencia histórica.

## 1. Árbol de definiciones (capas del sistema) — post-corrección

```
src/styles/
├── tokens/
│   ├── brand.css                    --brand-* (primario/secundario/acento/superficies)
│   ├── supporting.css               --supporting-*
│   ├── state.css                    --state-error(-on/-container)
│   ├── semantic.css                 roles --color-*
│   ├── typography.css               --font-family-base + --font-family-mono (nuevo, RGW-306)
│   │                                + escala display/headline/body/label/navigation
│   ├── spacing.css                  --space-0…30
│   ├── shape.css                    --radius-none + --stroke-width-*
│   └── layout.css                   --container-max + --section-padding-*
├── theme.css                        @theme: capas cruda+semántica, spacing,
│                                    tipografía y shape. Strokes expuestos;
│                                    gw-brand-*/container-gw/radius-gw-none
│                                    ELIMINADAS como sin uso (RGW-305)
└── global.css                       base con tokens; fondo único en `body`
                                     (sin duplicado en :root, RGW-305)
```

## 2. Inconsistencias del tree (#1–#22) — estado final

| #   | Inconsistencia del tree                          | Estado final |
| --- | ------------------------------------------------ | ------------ |
| 1   | Hex `#e2e2e2` ×21 en LegalView                    | Resuelto → `var(--color-border-subtle)` (RGW-300) |
| 2   | Hex `#595c62` ×14                                | Resuelto → `var(--color-text-muted)` (RGW-300) |
| 3   | 18 data-URIs con hex crudos                      | Resuelto: verificados equivalentes a tokens; `#f9f9f9`→`#ffffff` (RGW-300); mecanismo justificado para CSS de contenido WP (RGW-304) |
| 4   | `text-white`/`border-white/10`                    | Resuelto → `brand-surface` (RGW-300) |
| 5   | Botón primario azul en Process                    | Resuelto → `bg-gw-action-primary` (RGW-300) |
| 6   | Tipografía cruda en LegalView                     | Resuelto → tokens por rol (RGW-306) |
| 7   | Stack mono por dos mecanismos                     | Resuelto → token `--font-family-mono` + `--font-mono` (RGW-306) |
| 8   | Escala Tailwind conviviendo (`xs/sm/2xl/3xl/4xl`) | Resuelto → tokens según rol (RGW-306); fuera: 2 glifos ("/", "+") |
| 9   | Micro-etiquetas 9/10/12px, tracking 0.2em         | Resuelto en labels/metas → label-bold (RGW-303/306); fuera intencional: indicadores 9–10px, numerales 900 (sin token, no clasificados como error por la auditoría) |
| 10  | Container replicado inline ×5                     | Resuelto → `Container` (RGW-301) |
| 11  | Wrapper editorial duplicado ×4                    | Resuelto → `EditorialWrapper` (RGW-301) |
| 12  | Padding de Section replicado (FinalCta)           | Resuelto → `Section` (RGW-301) |
| 13  | Paddings crudos 64/96/128                         | Resuelto → `--section-padding-*` (RGW-301) |
| 14  | Radios y sombras sin token                        | Resuelto → `rounded-none`, sin sombras (RGW-302) |
| 15  | Override `rounded!` de Card sobre Badge           | Resuelto → eliminado (RGW-302) |
| 16  | Acento izquierdo (4/2) sin token                  | Resuelto → `border-l-4` unificado (RGW-302) |
| 17  | Eyebrow con 3 implementaciones                    | Resuelto → `text-label-bold` canónico (RGW-303) |
| 18  | Botón/eyebrow/marcadores replicados inline        | Resuelto en parte: eyebrows/marcadores estandarizados; botones de Process documentados (props parceladas, no forzados a Button); enlace outline de ServiceDetail fuera de tabla |
| 19  | Sección contacto duplicada es/en                  | Resuelto → `ContactSection` (RGW-303) |
| 20  | Skeleton replicando Card                          | Resuelto → modo `skeleton` en `Card` (RGW-303) |
| 21  | H1 legal con dos tokens según rama                | Resuelto → ambos a `--color-text-primary` (RGW-302) |
| 22  | Doble fondo `:root` vs `body`                     | Resuelto → sin duplicado (RGW-305) |

Two unbounded patterns remain documented (not in findings): arbitrary
`leading-[...]` values; `text-base/lg/xl` usages not flagged by RGW-283.

## 3. Validación de consistencia y reutilización

* Cero valores hex crudos en `src` fuera de `tokens/` y comentarios.
* Cero clases color `white`/`black` sin token.
* Cero réplicas inline de `Container` (patrón del Container único).
* Cero `rounded-xl/lg/sm/md/rounded!` y cero `shadow-sm/md/lg` (solo
  `rounded-none`/`rounded-full` del sistema).
* Cero `tracking-[0.2em]` paralelo; eyebrow canónico único.
* Cero stacks monoespaciados literales.
* Cero data-URIs fuera del CSS global de contenido WP (LegalView,
  justificado RGW-304); cero SVG sueltos fuera de `Icon`/`MenuButton`.
* Cero breakpoints personalizados fuera de `min-[425px]`
  (deliberado del logo, documentado) y de los `md/lg/xl` del sistema.
* Container/Section usados en 22 componentes/páginas; EditorialWrapper
  en 4 vistas editoriales; ContactSection compartida es/en.

## 4. Validaciones ejecutadas en esta subtarea

* `npx astro check`: 21 errores, todos preexistentes (TS estricto en
  ContactForm/Header/contact/[...uri]), 0 nuevos tras las correcciones.
* `npm run build`: CSS de Tailwind genera (`✓ built`); falla SOLO por
  `WP_API_URL` ausente (limitación preexistente documentada desde
  RGW-299; no disponible ni en develop).
* Corrección adicional en esta validación: reglas de layout de LegalView
  que habían quedado fuera de la media `768px` por edición previa
  (balance de llaves restaurado 142/142, verificado con parser).
* Greps sistemáticos de los 8 grupos de hallazgos en estado final.

## 5. Regresiones

Ninguna detectada por las validaciones disponibles (estático; el
render E2E no es posible en este entorno por la limitación de
`WP_API_URL`). No se modificó ningún token de color ni estructura
responsive del sistema.

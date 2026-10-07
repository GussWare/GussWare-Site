# RGW-308 — Experimento tipográfico (rama independiente, no integrar)

## Método

Espécimen `src/pages/exp-tipografia.astro` (standalone, sin WordPress)
con 5 módulos representativos (display, encabezado, cuerpo+meta,
tarjeta, acciones), cada uno en variante A (sistema actual, tokens) y
variante B (valores exactos de `LegalView.astro`). Capturas desktop
(1440) y mobile (390): `rgw-308/rgw308-desktop.png`,
`rgw-308/rgw308-mobile.png`.

## Escalas comparadas

| Nivel   | A · Sistema actual      | B · LegalView            |
| ------- | ----------------------- | ------------------------ |
| Display | 64px/72px/700 (móvil 40) | 30px/36px/700 (móvil 40) |
| H2      | 32px/40px/600           | 24px/32px/700            |
| Lede    | 20px/32px/400           | 14px/600                 |
| Cuerpo  | 16px/24px/400           | 16px/26px (1.625)/400    |
| Meta    | 14px/20px/700           | 12px/16px/700            |
| Botones | label 14px/700          | sin escala propia (= A)  |

## Comparación (desktop; en mobile ambas coinciden a 40px)

* Legibilidad: B legible en cuerpo (incluso más aireado); meta 12px y
  lede 14px pierden presencia funcional.
* Jerarquía: B aplana tres niveles (display queda a nivel de título
  de sección; lede queda a nivel de meta).
* Tamaños/pesos: display B sin presencia de hero; h2 B más pequeño
  pero más pesado (más ruidoso).
* Coherencia: B nace de contenido legal denso; en Home/Servicios/Blog
  empobrece heroes y tarjetas.
* Consistencia: la propia LegalView invierte su curva responsive
  (móvil 40px > desktop 30px), incoherente como base global.

## Decisión: NO APROBADA como base global

La escala de LegalView no sustituye al sistema actual. La rama no se
integra (ni a `develop` ni a RGW-298).

## Entrada para RGW-306

Base aprobada = sistema actual de tokens. RGW-306 normaliza los
valores crudos de LegalView hacia tokens según RGW-283/RGW-287
(0.875rem→label/body según rol; 0.75rem meta→label-bold;
títulos→escala headline; mono stacks según decisión de familia).

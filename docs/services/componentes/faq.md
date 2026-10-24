# Componente: Preguntas frecuentes (FAQ)

Bloque de preguntas frecuentes **homologado** en las 6 pantallas de servicio. Es el primer
componente reutilizable del sistema: mismo markup, mismos tokens, mismo comportamiento; solo
cambia el contenido.

- **Estado:** aplicado en las 6 pantallas el 20 de octubre de 2026
- **Anterior:** cada servicio tenía su propio diseño (grid de 2 columnas en Integración,
  `details/summary` en Consultoría, tarjetas `max-w-4xl` en DevOps, ancho limitado a 840 px en
  Móviles…)
- **Referencia visual:** la pantalla *Desarrollo a medida* (`548788d70c974d7bb82de9c26dcc4083`)

---

## 1. Especificación

### 1.1 Tokens

La maqueta de Stitch y la implementación en el proyecto **no pueden usar los mismos nombres de
clase**: los HTML de Stitch son documentos aislados con su propio `tailwind.config` y no
comparten el sistema de tokens del sitio. La tabla muestra el valor en la maqueta y el token
equivalente en el proyecto, que es el destino real.

| Elemento | En la maqueta de Stitch | En el proyecto (destino) |
|---|---|---|
| Fondo de sección | `#F2F2F2` → `bg-[#F2F2F2]` | `bg-gw-surface-secondary` |
| Borde inferior de sección | `#DADADA` → `border-[#DADADA]` | `border-gw-border-subtle` |
| Separador de fila | `#DADADA` → `border-[#DADADA]` / `divide-y` | `border-gw-border-subtle` / `divide-gw-border-subtle` |
| Padding vertical | `120px` → `py-[120px]` | `py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]` |
| Ancho del contenedor | `1280px` → `max-w-[1280px]` | `max-w-[var(--container-max)]` |
| Padding horizontal | `24px` → `px-6` | `px-4 md:px-6` (`Container.astro`) |
| Eyebrow | `12px` / `700` / `uppercase` / `tracking-wider` / `#2164A6` | `text-label-bold uppercase text-brand-secondary` |
| H2 | `42px` / `700` / `leading-[1.15]` / `tracking-tight` | `text-gw-text-primary text-headline-lg tracking-tight` |
| Pregunta (H3) | `18→20px` / `700` / `#242126` | `text-gw-text-primary text-body-lg font-bold` |
| Icono abierto | `−` (menos matemático U+2212) / `24px` / `700` / `#004A98` | `−` en `text-headline-md text-brand-primary` |
| Icono cerrado | `+` / `24px` / `700` / `#5C6068` | `+` en `text-headline-md text-gw-text-muted` |
| Tarjeta de preguntas | `#FFFFFF` → `bg-white` | `bg-gw-surface-primary` |
| Respuesta | `16px` / `#5C6068` / `leading-relaxed` / máx. `70ch` | `text-gw-text-secondary text-body-md leading-relaxed max-w-[70ch]` |
| Microcopy | `14px` / `700` / `#004A98` → `#00346E` en hover | `text-label-bold text-brand-primary` |

Las diferencias de valor entre la maqueta y el sistema están en
[`../estructura.md`](../estructura.md) §1.7 (tabla de diferencias a aprobar).

### 1.2 Estructura

```
<section>                            bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]
  <div>                              max-w-[1280px] mx-auto px-6
    eyebrow                          05 — DUDAS FRECUENTES
    <h2>                             Lo que suele preguntarse antes de empezar
    <div>                            border-t border-[#DADADA] divide-y divide-[#DADADA]
      <div>                          bg-white border-b border-[#DADADA] mb-8
        fila 1 (ABIERTA)             p-6 lg:p-8
          <div>                      flex items-center justify-between gap-4
            <h3>                     pregunta
            <span>                   −   (abre, azul)
          </div>
          <div>                      mt-4 pt-4 border-t border-[#DADADA]
            <p>                      respuesta
          </div>
        filas 2..6 (CERRADAS)        misma caja, sin bloque de respuesta
          <div>                      flex items-center justify-between gap-4
            <h3>                     pregunta
            <span>                   +   (cerrado, gris)
          </div>
      </div>
    </div>
    microcopy                        ¿Te queda otra duda? Escríbenos →
  </div>
</section>
```

Reglas de contenido:

1. **6 filas** en todas las pantallas. La primera va **abierta**; las otras cinco **cerradas**.
2. Solo la primera fila lleva respuesta en el DOM (las demás se despliegan al hacer clic).
3. El microcopy va **después** de la lista, fuera de la tarjeta.
4. El H2 puede variar por servicio (ver §3); el resto del markup es idéntico.

### 1.3 Comportamiento

Las pantallas de Stitch son maquetas estáticas: el bloque **no tiene JS**. El `cursor-pointer`
y los iconos `+` / `−` son indications visuales del estado. En el sitio real (Astro) este
componente debe ser interactivo de verdad: la primera fila abierta por defecto, el resto
plegable, con animación de altura.

---

## 2. Markup de referencia

Extraído de `html/medida.html` (idéntico en las 6 salvo el H2 y el contenido):

```html
<section class="bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]">
    <div class="max-w-[1280px] mx-auto px-6">
      <div class="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-brand-secondary">
        <span>05</span>
        <span>—</span>
        <span>DUDAS FRECUENTES</span>
      </div>
      <h2 class="text-3xl lg:text-[42px] font-bold text-brand-ink leading-[1.15] tracking-tight mb-12">
        Lo que suele preguntarse antes de empezar
      </h2>
      <div class="border-t border-[#DADADA] divide-y divide-[#DADADA] bg-white border-b border-[#DADADA] mb-8">
        <!-- Row 1 (OPEN) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿Cómo sé si necesito software a medida?
            </h3>
            <span class="text-2xl font-bold text-brand-primary flex-shrink-0 leading-none">−</span>
          </div>
          <div class="mt-4 pt-4 border-t border-[#DADADA]">
            <p class="text-base text-brand-muted leading-relaxed max-w-[70ch]">
              Revisamos tu proceso y las herramientas que ya existen. Si una solución disponible cubre tus necesidades, te la recomendaremos; si tus procesos requieren funciones específicas, evaluaremos el desarrollo a medida.
            </p>
          </div>
        </div>
        <!-- Row 2 (CLOSED) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿Cuánto tiempo necesito dedicar al proyecto?
            </h3>
            <span class="text-2xl font-bold text-brand-muted flex-shrink-0 leading-none">+</span>
          </div>
        </div>
        <!-- Row 3 (CLOSED) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿El software será mío?
            </h3>
            <span class="text-2xl font-bold text-brand-muted flex-shrink-0 leading-none">+</span>
          </div>
        </div>
        <!-- Row 4 (CLOSED) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿Qué pasa si mi empresa cambia sus procesos?
            </h3>
            <span class="text-2xl font-bold text-brand-muted flex-shrink-0 leading-none">+</span>
          </div>
        </div>
        <!-- Row 5 (CLOSED) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿Se puede conectar con mis herramientas actuales?
            </h3>
            <span class="text-2xl font-bold text-brand-muted flex-shrink-0 leading-none">+</span>
          </div>
        </div>
        <!-- Row 6 (CLOSED) -->
        <div class="p-6 lg:p-8">
          <div class="flex items-center justify-between gap-4 cursor-pointer">
            <h3 class="text-lg lg:text-xl font-bold text-brand-ink">
              ¿Cuánto cuesta desarrollar software a medida?
            </h3>
            <span class="text-2xl font-bold text-brand-muted flex-shrink-0 leading-none">+</span>
          </div>
        </div>
      </div>
      <div>
        <a href="#cierre" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-deep transition-colors">
          ¿Te queda otra duda? Escríbenos →
        </a>
      </div>
    </div>
  </section>
```

---

## 3. Variantes de contenido

| Servicio | H2 | Filas | Destino del microcopy |
|---|---|---|---|
| Integración de APIs | Lo que suele preguntarse antes de conectar sistemas | 6 | `/contact` |
| Diseño de sitios web | Lo que suele preguntarse antes de empezar | 6 | `/contacto` |
| Aplicaciones Móviles | Lo que suele preguntarse antes de empezar | 6 | `/contacto` |
| Desarrollo a medida | Lo que suele preguntarse antes de empezar | 6 | `#cierre` |
| DevOps y Soporte Técnico | Lo que suele preguntarse antes de empezar | 6 | `/contact` |
| Consultoría Técnica | Lo que suele preguntarse antes de empezar | 6 | `/contact` |

> El destino del microcopy **no está unificado**: conviven `/contact`, `/contacto` y el ancla
> `#cierre`. Conviene parametrizarlo en el componente y resolver la ruta única en el sitio real.

Preguntas y respuestas: ver [`../contenido.md`](../contenido.md), sección `FAQ` de cada servicio.

---

## 4. Reglas para reutilizarlo

Al portar el componente a Astro/Tailwind:

1. Usar **los tokens del proyecto**, no valores literales: `bg-gw-surface-secondary`,
   `border-gw-border-subtle`, `max-w-[var(--container-max)]`,
   `py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]`,
   `text-label-bold`, `text-headline-lg`, `text-body-lg`, `text-body-md`,
   `text-brand-secondary`, `text-brand-primary`, `text-gw-text-primary`, `text-gw-text-muted`.
   Los literales de la maqueta de Stitch (columna izquierda de §1.1) solo aplican al HTML
   exportado, que es un documento aislado sin el tema del sitio.
2. Reutilizar `ui/Section.astro` y `ui/Container.astro` en lugar de replicar su marcado; el
   componente actual `src/components/services/ServiceFaq.astro` sirve de base y hay que
   adaptarlo al diseño de tarjeta blanca con primera fila abierta.
3. Mantener la retícula de **6 filas** como parámetro (`items`), con `openIndex = 0`.
4. Mantener el microcopy como enlace de texto (no como botón), tal como está en el diseño.
5. El separador de pregunta/respuesta es `border-t` sobre la respuesta abierta; no hay sombra
   ni radio (estilo rectilínea de marca).
6. Conservar el orden: eyebrow → H2 → lista → microcopy.

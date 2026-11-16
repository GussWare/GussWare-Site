# Componente: Cómo trabajamos

Bloque de proceso **homologado**. Es la versión oficial: la que quedó en la pantalla
*Diseño de sitios web y tiendas en línea (Tokens Oficiales)* y que se aplicó después a
*Integración de APIs y Servicios Externos (Tokens Oficiales)*.

- **Estado:** oficial desde el 20 de octubre de 2026
- **Pantalla de referencia:** `3570bdd8914b400590a34b1a1dd6a9f6` (Web)
- **Copia exacta aplicada a:** `3bb16c5fe8df47cba289c34cbe182390` (Integración)

---

## 1. Qué se homologó

Al comparar las dos primeras pantallas generadas con el mismo prompt, la sección de proceso
había salido de dos formas distintas. Se adoptó la de Web y se corrigió Integración:

| Elemento | Antes en Integración | **Oficial (Web)** |
|---|---|---|
| Etapa | texto suelto, sin caja | **tarjeta blanca con borde** `bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between` |
| Marcador | `bg-gw-surface-secondary` (gris, se fundía con la sección) | **`bg-gw-surface-primary`** (blanco, se recorta sobre la tarjeta) |
| Separación del encabezado | `max-w-3xl mb-16` | **`max-w-3xl mb-12`** |
| Rejilla | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10` | igual |
| Línea conectora | `hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0` | igual |
| Etapas | 4 | 4 |

El resto de la pantalla (hero, problema, soluciones, plataformas, ficha, FAQ, cierre y
relacionados) ya era consistente entre las dos: mismo orden de bloques, mismo patrón de
fondos por rol y misma numeración de eyebrows.

---

## 2. Especificación

| Elemento | Token / clase |
|---|---|
| Fondo de sección | `bg-gw-surface-secondary` |
| Borde inferior | `border-b border-gw-border-subtle` |
| Padding vertical | `py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]` |
| Contenedor | `mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6` |
| Encabezado | `max-w-3xl mb-12` |
| Eyebrow | `text-label-bold uppercase text-brand-primary` · `mb-3` |
| H2 | `text-gw-text-primary text-headline-lg font-bold leading-tight` · `mb-5` |
| Párrafo | `text-gw-text-secondary text-body-md leading-relaxed` |
| Rejilla | `relative` + `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10` |
| Línea conectora | `hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0` |
| Tarjeta de etapa | `bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between` |
| Marcador | `w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary` |
| H3 de etapa | `text-gw-text-primary text-headline-md font-bold` · `mb-3` |
| Descripción | `text-gw-text-secondary text-body-md leading-relaxed` |

**Reglas:**

1. Siempre **4 etapas**, en fila, con la línea conectora detrás de los marcadores en escritorio.
2. La etapa **siempre** es tarjeta blanca con borde. Si se degrada a texto sin caja, deja de
   coincidir con la plantilla.
3. El marcador **siempre** lleva fondo blanco (`bg-gw-surface-primary`): es lo que lo hace
   «flotar» sobre la tarjeta. Nunca usar el gris de la sección.
4. Solo cambian el **eyebrow (número)**, el **H2**, el **párrafo** y las **4 etapas** con su
   título y descripción.

---

## 3. Markup de referencia

Extraído de la pantalla oficial (Web). La numeración del eyebrow cambia según el servicio;
en Integración es `04 — CÓMO TRABAJAMOS` en lugar de `03 — CÓMO TRABAJAMOS`.

```html
<section class="bg-gw-surface-secondary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
    <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
      
      <!-- Encabezado max-w-3xl -->
      <div class="max-w-3xl mb-12">
        <p class="text-label-bold uppercase text-brand-primary mb-3">03 — CÓMO TRABAJAMOS</p>
        <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
          Del diseño a un sitio que cumple su propósito
        </h2>
        <p class="text-gw-text-secondary text-body-md leading-relaxed">
          Trabajamos por etapas para validar la propuesta, desarrollar las funciones y revisar el resultado antes de publicarlo.
        </p>
      </div>

      <!-- Rejilla de 4 etapas con línea conectora en desktop -->
      <div class="relative">
        <div class="hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          
          <!-- Etapa 01 -->
          <div class="bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary">
                01
              </div>
              <h3 class="text-gw-text-primary text-headline-md font-bold mb-3">
                Entender
              </h3>
              <p class="text-gw-text-secondary text-body-md leading-relaxed">
                Definimos qué quieres conseguir, quién visitará el sitio y qué necesita encontrar.
              </p>
            </div>
          </div>

          <!-- Etapa 02 -->
          <div class="bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary">
                02
              </div>
              <h3 class="text-gw-text-primary text-headline-md font-bold mb-3">
                Diseñar
              </h3>
              <p class="text-gw-text-secondary text-body-md leading-relaxed">
                Organizamos los contenidos y las pantallas, y revisamos contigo la propuesta visual.
              </p>
            </div>
          </div>

          <!-- Etapa 03 -->
          <div class="bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary">
                03
              </div>
              <h3 class="text-gw-text-primary text-headline-md font-bold mb-3">
                Desarrollar
              </h3>
              <p class="text-gw-text-secondary text-body-md leading-relaxed">
                Construimos el sitio, probamos sus funciones y verificamos su adaptación a diferentes dispositivos.
              </p>
            </div>
          </div>

          <!-- Etapa 04 -->
          <div class="bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary">
                04
              </div>
              <h3 class="text-gw-text-primary text-headline-md font-bold mb-3">
                Publicar y mejorar
              </h3>
              <p class="text-gw-text-secondary text-body-md leading-relaxed">
                Preparamos el lanzamiento y definimos oportunidades de mejora a partir de las necesidades del negocio.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
```

---

## 4. Contenido por servicio

| Servicio | Eyebrow | H2 | Etapas |
|---|---|---|---|
| Integración de APIs | `04 — CÓMO TRABAJAMOS` | Conexiones diseñadas para manejar los datos correctamente | Analizar · Diseñar · Conectar · Supervisar |
| Diseño de sitios web | `03 — CÓMO TRABAJAMOS` | Del diseño a un sitio que cumple su propósito | Entender · Diseñar · Desarrollar · Publicar y mejorar |
| Aplicaciones Móviles | `03 — CÓMO TRABAJAMOS` | De la idea a una aplicación que puedes probar | Entender · Diseñar · Desarrollar · Publicar y evolucionar |
| Desarrollo a medida | `03 — CÓMO TRABAJAMOS` | Primero entendemos tu operación; después construimos | Entender · Diseñar · Desarrollar · Evolucionar |
| DevOps y Soporte Técnico | `03 — CÓMO TRABAJAMOS` | Una operación técnica más controlada | Revisar · Automatizar · Implementar · Supervisar |
| Consultoría técnica | `03 — CÓMO TRABAJAMOS` | De la incertidumbre a las decisiones claras | Entender · Definir · Planificar · Documentar |

Descripciones completas: [`../contenido.md`](../contenido.md), sección `PROCESO` de cada servicio.

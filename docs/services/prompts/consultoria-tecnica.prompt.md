TAREA: diseña UNA pantalla de detalle de servicio para GussWare, en español de México.
Servicio: CONSULTORÍA TÉCNICA.

ALCANCE ESTRICTO
- Construye solo esta pantalla de servicio.
- NO generes ni modifiques Home, Proyectos, Blog, Comunidad, Login, Registro, errores 404/500,
  Términos y Condiciones, Aviso de Privacidad, Contacto, header global, footer global, imágenes
  de hero, logotipo, DESIGN.md ni el design system.
- Cabecera y pie NO se maquetan aquí: se usan los componentes reales del sitio.
- No inventes datos: sin cifras, precios, clientes, casos de éxito, testimonios, certificaciones,
  ubicaciones, plazos ni nombres de partners. Solo el copy que te doy abajo.

SISTEMA DE DISEÑO (obligatorio, no cambies ni inventes valores)
Usa el sistema de tokens del proyecto, con clases de token y NUNCA hex literales.

Colores:
  bg-brand-primary / text-brand-primary        azul primario
  text-brand-secondary                          azul secundario
  bg-supporting-blue-dark / text-supporting-blue-dark   azul profundo
  bg-gw-action-primary                          naranja del botón principal
  bg-brand-accent                               naranja de acento
  text-gw-text-primary                          texto de títulos
  text-gw-text-secondary                        texto de párrafos
  text-gw-text-muted                            texto terciario y separadores
  bg-gw-surface-primary                         superficie blanca
  bg-gw-surface-secondary                       superficie gris alterna
  bg-gw-surface-auxiliary                       superficie auxiliar
  border-gw-border-subtle                       bordes
  border-gw-border-default                      bordes fuertes
  text-supporting-blue-fixed                    texto claro sobre azul profundo
  text-supporting-blue-fixed-dim                texto claro atenuado
  bg-gw-highlight                               rosa de acento
  text-brand-surface                            texto blanco sobre azul profundo o naranja

Tipografía (escala de tokens):
  H1 hero      text-display-lg-mobile md:text-display-lg  (40 → 64 px) + font-bold leading-[1.08] tracking-tight
  H2 sección   text-headline-lg                            (48 px)
  H3 tarjeta   text-headline-md                            (32 px)
  Lead         text-body-lg                                (20 px)
  Párrafo      text-body-md                                (16 px)
  Etiqueta     text-label-bold uppercase                   (14 px, 700, tracking)
  Mono         font-mono                                   (números, marcas)

Rejilla y espaciado:
  Contenedor:  mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6
  Sección:     py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)]  (64 / 120 px)
  Rejilla de 12 columnas con gap-10 (40 px); gap-6 / gap-8 dentro de tarjetas.
  Separador de sección: border-b border-gw-border-subtle

Forma:
  rounded-none en TODO. Sin sombras (ningún shadow-*). La profundidad se marca solo con cambio
  de tono de superficie y bordes de 1px.

Patrón de fondos (en este orden, no lo alteres):
  Hero blanco · Problema blanco · Soluciones gris · Cómo trabajamos gris · Ficha técnica blanco ·
  FAQ gris · Cierre azul profundo · Relacionados blanco

Sin logotipos de terceros. Sin ilustraciones: los adornos son formas geométricas construidas
con divs y bordes.

ESTRUCTURA DE LA PÁGINA (en este orden, con esta numeración de eyebrow)
  0. Migas de pan
  1. Hero
  2. 01 — EL PROBLEMA
  3. 02 — NUESTRAS SOLUCIONES
  4. 03 — CÓMO TRABAJAMOS
  5. 04 — FICHA TÉCNICA
  6. 05 — DUDAS FRECUENTES
  7. 06 — INICIA TU PROYECTO
  8. Servicios relacionados
El hero, las migas y el bloque de servicios relacionados no llevan número.
Formato del eyebrow: `NN — ETIQUETA` en text-label-bold uppercase text-brand-primary, mb-3.
Categorías de los servicios relacionados: usa siempre una de estas seis —
`MÓVIL`, `WEB`, `SOFTWARE`, `SISTEMAS`, `INFRAESTRUCTURA`, `CONSULTORÍA`.

========================================================================
0. MIGAS DE PAN
<nav aria-label="Miga de pan" class="mb-8"> con <ol class="flex flex-wrap items-center gap-2">
Items: Inicio (/) · Servicios (/servicios) · Consultoría técnica (actual)
  Enlaces:   text-label-bold uppercase text-gw-text-secondary hover:text-brand-secondary transition-colors
  Separador: text-gw-text-muted text-xs
  Actual:    text-label-bold uppercase text-supporting-blue-dark

========================================================================
1. HERO
<section class="bg-gw-surface-primary border-b border-gw-border-subtle pt-10 pb-[var(--section-padding-mobile)] md:pb-[var(--section-padding-desktop)]">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    (migas de pan)
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

COLUMNA IZQUIERDA (lg:col-span-8)
  Eyebrow: <div class="flex items-center gap-2.5 mb-5">
              <span class="w-2.5 h-2.5 bg-brand-primary inline-block flex-shrink-0"></span>
              <span class="text-label-bold uppercase text-brand-primary">CONSULTORÍA TÉCNICA — ESTRATEGIA Y ARQUITECTURA</span>
            </div>
  H1: `Decide cómo construir tu proyecto antes de invertir en construirlo`
      class: text-gw-text-primary text-display-lg-mobile md:text-display-lg font-bold leading-[1.08] tracking-tight mb-8
  Lead: `No necesitas conocer todas las tecnologías para iniciar un proyecto. Te ayudamos a definir
      qué necesitas, elegir las herramientas adecuadas y establecer prioridades. Al terminar,
      tendrás una ruta técnica documentada que podrás utilizar con tu equipo de desarrollo.`
      class: text-gw-text-secondary text-body-lg leading-relaxed max-w-[68ch] mb-10
  CTAs en <div class="flex flex-wrap items-center gap-6 pt-2">:
    primaria: `Hablemos de tu idea` → /contact
      class: text-label-bold bg-gw-action-primary text-brand-surface px-6 py-3 rounded-none hover:opacity-90 transition-opacity
    secundaria: `Ver soluciones ↓` → #soluciones
      class: text-navigation text-brand-secondary hover:underline

COLUMNA DERECHA (lg:col-span-4)
  class: lg:col-span-4 border-l-0 lg:border-l border-gw-border-subtle lg:pl-10 space-y-8 pt-4 lg:pt-0
  Tres indicadores, cada uno:
    <div class="border-b border-gw-border-subtle pb-6 last:border-b-0 last:pb-0">
      número:  font-mono font-bold text-brand-primary text-headline-md block mb-1
      título:  text-gw-text-primary text-body-lg font-bold mb-1
      texto:   text-gw-text-muted text-body-md
    01  Menos improvisación     → Decisiones tomadas antes de programar
    02  Inversión mejor dirigida → Prioridades alineadas con tus objetivos
    03  Un plan ejecutable     → Tu equipo sabe qué construir y por qué

========================================================================
2. 01 — EL PROBLEMA
<section class="bg-gw-surface-primary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div class="lg:col-span-5">
        <p class="text-label-bold uppercase text-brand-primary mb-3">01 — EL PROBLEMA</p>
        <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-6">
          Evita decisiones que después cuestan tiempo y dinero
        </h2>
        <p class="text-gw-text-secondary text-body-md leading-relaxed">
          Empezar a desarrollar sin tener claro qué se necesita puede llevar a elegir herramientas
          inadecuadas, construir funciones que nadie utiliza o tener que rehacer partes del sistema.
        </p>
      </div>
      <div class="lg:col-span-7">
        <div class="divide-y divide-gw-border-subtle border-t border-b border-gw-border-subtle">
          cada fila: <div class="py-6 grid grid-cols-12 gap-4 items-baseline">
            número en col-span-2: col-span-2 font-mono font-bold text-brand-primary text-headline-md
            texto en col-span-10: col-span-10 text-gw-text-primary text-body-md font-medium leading-snug
            01  No sabes qué construir primero ni qué herramientas elegir.
            02  Eliges tecnología sin comparar alternativas y después cuesta cambiarla.
            03  Ya tienes un sistema y no sabes si conviene mejorarlo, cambiarlo o conservarlo.
        </div>
        <p class="pt-6 text-label-bold uppercase text-gw-text-muted">
          Estrategia técnica · Arquitectura · Elección de tecnología · Planificación · Documentación · Asesoría técnica
        </p>
      </div>
    </div>
  </div>
</section>

========================================================================
3. 02 — NUESTRAS SOLUCIONES
<section id="soluciones" class="bg-gw-surface-secondary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="max-w-3xl mb-12">
      <p class="text-label-bold uppercase text-brand-primary mb-3">02 — NUESTRAS SOLUCIONES</p>
      <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
        De una idea a un plan que puedes ejecutar
      </h2>
      <p class="text-gw-text-secondary text-body-md leading-relaxed">
        Definimos la estructura técnica de tu proyecto y te ayudamos a elegir cómo llevarlo a cabo,
        desde la primera decisión hasta la planificación del desarrollo.
      </p>
    </div>

    OJO: este servicio tiene SOLO DOS soluciones. La rejilla es de 2 columnas
    (md:grid-cols-2), no de 3, y no inventes una tercera tarjeta.
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">

    Tarjeta: <div class="bg-gw-surface-primary border border-gw-border-subtle rounded-none p-6 md:p-8 flex flex-col justify-between">
      <div>
        número: <span class="font-mono font-bold text-brand-primary text-headline-md block mb-4">01</span>
        H3: <h3 class="text-gw-text-primary text-headline-md tracking-tight font-bold mb-3">…</h3>
        descripción: <p class="text-gw-text-secondary text-body-md leading-relaxed mb-6">…</p>
        entregables:
          <div class="border-t border-gw-border-subtle pt-6 mb-6">
            <p class="text-label-bold uppercase text-brand-primary mb-4">QUÉ RECIBES</p>
            <ul class="space-y-3 text-gw-text-primary text-body-md">
              <li class="flex items-start gap-2">
                <span class="text-brand-primary font-bold select-none">—</span>
                <span>…</span>
              </li>
            </ul>
          </div>
      </div>
      beneficio:
        <div class="border-t border-gw-border-subtle pt-6">
          <p class="text-label-bold uppercase text-gw-text-muted mb-1">BENEFICIO</p>
          <p class="text-gw-text-primary text-body-md font-semibold">…</p>
        </div>
    </div>

  TARJETA 01 — Arquitectura y estructura del sistema
    Descripción: `Definimos cómo se organiza tu sistema antes de construirlo, para que cada
      componente tenga una función clara y las partes trabajen en conjunto.`
    Qué recibes (esta tarjeta tiene 4 entregables, no 5):
      — Documento de arquitectura explicado en términos claros
      — Mapa de componentes y sus relaciones
      — Decisiones técnicas justificadas y alternativas evaluadas
      — Recomendaciones para ampliar el sistema sin rediseñarlo por completo
    Beneficio: `Una estructura clara antes de escribir la primera línea.`

  TARJETA 02 — Elección de tecnología y plan de trabajo
    Descripción: `Comparamos las opciones disponibles y definimos una ruta de desarrollo que
      considere tus objetivos, presupuesto y equipo.`
    Qué recibes (5 entregables):
      — Comparativa de tecnologías con ventajas y desventajas
      — Recomendación de herramientas con argumentos claros
      — Plan por etapas con resultados esperados
      — Estimación de esfuerzo para organizar tiempo y presupuesto
      — Esquema de trabajo y seguimiento del proyecto
    Beneficio: `Decisiones justificadas y un plan que tu equipo puede ejecutar.`

  Cierre de sección: enlace de texto `Hablemos de tu idea →` → /contact
    (text-navigation text-brand-secondary hover:underline)

========================================================================
4. 03 — CÓMO TRABAJAMOS
<section class="bg-gw-surface-secondary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="max-w-3xl mb-12">
      <p class="text-label-bold uppercase text-brand-primary mb-3">03 — CÓMO TRABAJAMOS</p>
      <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
        De la incertidumbre a las decisiones claras
      </h2>
      <p class="text-gw-text-secondary text-body-md leading-relaxed">
        Primero entendemos el problema; después evaluamos las alternativas y documentamos una ruta
        de trabajo que puedas poner en marcha.
      </p>
    </div>

    <div class="relative">
      <div class="hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">

      Cada etapa es una TARJETA BLANCA CON BORDE. Es obligatorio, no lo simplifiques ni lo quites:
        <div class="bg-gw-surface-primary border border-gw-border-subtle p-6 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 border-2 border-brand-primary text-brand-primary font-mono font-bold text-headline-md flex items-center justify-center mb-6 bg-gw-surface-primary">
              01
            </div>
            <h3 class="text-gw-text-primary text-headline-md font-bold mb-3">Entender</h3>
            <p class="text-gw-text-secondary text-body-md leading-relaxed">Descripción de la etapa.</p>
          </div>
        </div>

      IMPORTANTE: la etapa SIEMPRE es tarjeta blanca con borde, y el marcador SIEMPRE lleva fondo
      blanco bg-gw-surface-primary (nunca el gris de la sección). Siempre 4 etapas, en fila.
        01  Entender     → Revisamos tus objetivos, necesidades, recursos y sistemas existentes.
        02  Definir      → Proponemos la estructura y las tecnologías, explicando las razones de cada decisión.
        03  Planificar   → Organizamos el desarrollo por etapas, con prioridades, entregables y estimaciones.
        04  Documentar   → Dejamos las decisiones por escrito para que tu equipo pueda consultarlas y ejecutarlas.

========================================================================
5. 04 — FICHA TÉCNICA
<section class="bg-gw-surface-primary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
      <div class="lg:col-span-5">
        <p class="text-label-bold uppercase text-brand-primary mb-3">04 — FICHA TÉCNICA</p>
        <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
          Cómo organizamos el proyecto
        </h2>
      </div>
      <div class="lg:col-span-7 lg:pt-8">
        <p class="text-gw-text-secondary text-body-md leading-relaxed">
          Elegimos las herramientas técnicas y la forma de trabajo según la complejidad del
          proyecto y las necesidades del equipo.
        </p>
      </div>
    </div>
    <div class="pt-8 border-t border-gw-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8">
      cada columna: <div class="border-l-0 md:border-l-2 border-brand-primary pl-0 md:pl-6">
        rótulo: <p class="text-label-bold uppercase text-brand-primary mb-2">…</p>
        valor:  <p class="text-gw-text-primary text-body-md font-semibold leading-relaxed">…</p>
      </div>
      `ORGANIZACIÓN DEL TRABAJO` → Scrum (trabajo por ciclos) · Kanban (tablero de tareas)
      `DISEÑO TÉCNICO`          → Arquitectura de software · Componentes del sistema · Tecnologías
      `PLANIFICACIÓN`           → Prioridades · Documentación técnica · Estimación
    </div>
  </div>
</section>

========================================================================
6. 05 — DUDAS FRECUENTES
<section class="bg-gw-surface-secondary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <p class="text-label-bold uppercase text-brand-secondary mb-4">05 — DUDAS FRECUENTES</p>
    <h2 class="text-gw-text-primary text-headline-lg font-bold tracking-tight mb-12">
      Lo que suele preguntarse antes de empezar
    </h2>
    <div class="border-t border-gw-border-subtle divide-y divide-gw-border-subtle bg-gw-surface-primary border-b border-gw-border-subtle mb-8">
      cada fila: <div class="p-6 lg:p-8">
        <div class="flex items-center justify-between gap-4 cursor-pointer">
          <h3 class="text-gw-text-primary text-body-lg font-bold">…</h3>
          icono abierto:  <span class="text-headline-md text-brand-primary flex-shrink-0 leading-none select-none">−</span>
          icono cerrado:  <span class="text-headline-md text-gw-text-muted flex-shrink-0 leading-none select-none">+</span>
        </div>
        respuesta (solo en la fila abierta):
          <div class="mt-4 pt-4 border-t border-gw-border-subtle">
            <p class="text-gw-text-secondary text-body-md leading-relaxed max-w-[70ch]">…</p>
          </div>
      </div>
      6 filas. La PRIMERA abierta, las otras 5 cerradas.

      01  ¿Qué recibo al terminar la consultoría?
          Una propuesta técnica documentada con la estructura recomendada, las tecnologías evaluadas,
          las decisiones principales y un plan de trabajo para orientar el desarrollo.
      02  ¿Puedo contratarla si solo tengo una idea?
      03  ¿Pueden trabajar con mi equipo de desarrollo?
      04  ¿Tengo que contratar el desarrollo con GussWare?
      05  ¿Cuánto cuesta una consultoría técnica?
      06  ¿Qué pasa si ya tengo un sistema y necesito mejorarlo?

    Microcopy debajo de la lista, como enlace de texto (no botón):
      `¿Te queda otra duda? Escríbenos →` → /contact
      (text-label-bold text-brand-primary)

========================================================================
7. 06 — INICIA TU PROYECTO
<section class="bg-supporting-blue-dark text-brand-surface py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] relative overflow-hidden">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-8">
        <p class="text-label-bold uppercase text-brand-accent mb-4">06 — INICIA TU PROYECTO</p>
        <h2 class="text-brand-surface text-headline-lg font-bold leading-tight mb-6">
          Antes de programar, define el camino correcto
        </h2>
        <p class="text-supporting-blue-fixed text-body-lg leading-relaxed max-w-2xl mb-10">
          Cuéntanos qué quieres construir o qué problema necesitas resolver. Te ayudaremos a
          convertirlo en un plan técnico claro.
        </p>
        <div class="flex flex-wrap items-center gap-6">
          botón: `Cuéntanos tu proyecto` → /contact
            class: text-label-bold bg-gw-action-primary text-brand-surface px-6 py-3 rounded-none hover:opacity-90 transition-opacity
          enlace: `Ver todos los servicios →` → /servicios
            class: text-label-bold border-2 border-brand-surface text-brand-surface px-6 py-3 rounded-none hover:bg-brand-surface hover:text-brand-primary transition-colors
        </div>
      </div>
      COLUMNA DERECHA (lg:col-span-4 hidden lg:flex justify-end) — adorno geométrico, no imagen:
        <div class="w-[256px] h-[256px] border border-supporting-blue-dark bg-[#002855]/70 p-6 flex flex-col justify-between relative">
          <div>
            <div class="w-12 h-12 bg-brand-primary mb-5"></div>
            <div class="space-y-2">
              <div class="w-full h-1 bg-supporting-blue-dark"></div>
              <div class="w-3/4 h-1 bg-supporting-blue-dark"></div>
              <div class="w-1/2 h-1 bg-brand-accent"></div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-white/10">
            <span class="font-mono text-label-bold uppercase text-supporting-blue-fixed-dim">GUSSWARE · CORE</span>
            <div class="w-10 h-10 border-2 border-brand-accent"></div>
          </div>
        </div>
    </div>
  </div>
</section>

========================================================================
8. SERVICIOS RELACIONADOS
<section class="bg-gw-surface-primary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="mb-12">
      <p class="text-label-bold uppercase text-brand-primary mb-3">SIGUE EXPLORANDO</p>
      <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight">
        Otros servicios que pueden ayudarte
      </h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      cada tarjeta: <div class="bg-gw-surface-primary border border-gw-border-subtle rounded-none p-8 flex flex-col justify-between hover:border-brand-primary transition-colors">
        <div>
          <p class="text-label-bold uppercase text-brand-primary mb-3">CATEGORÍA</p>
          <h3 class="text-gw-text-primary text-headline-md font-bold mb-4">…</h3>
          <p class="text-gw-text-secondary text-body-md leading-relaxed mb-8">…</p>
        </div>
        <div class="border-t border-gw-border-subtle pt-5">
          <a href="…" class="text-label-bold text-brand-primary hover:underline">Ver servicio →</a>
        </div>
      </div>
      `SOFTWARE` — Desarrollo a medida
          Tu empresa no debería tener que adaptarse a un software que no le funciona.
          → /servicios/desarrollo-a-medida
      `WEB` — Diseño de sitios web y tiendas en línea
          Tu sitio web debe conseguir algo más que verse bien.
          → /servicios/diseno-sitios-web-tiendas-en-linea
      `INFRAESTRUCTURA` — DevOps y Soporte Técnico
          Actualiza tus sistemas sin convertir cada cambio en un riesgo.
          → /servicios/devops-y-soporte-tecnico

RUTAS (usa solo estas, ninguna queda sin destino)
  /contact
  /servicios
  /servicios/integracion-de-apis-y-servicios-externos
  /servicios/desarrollo-a-medida
  /servicios/diseno-sitios-web-tiendas-en-linea
  /servicios/aplicaciones-moviles
  /servicios/devops-y-soporte-tecnico
  /servicios/consultoria-tecnica
  El enlace «Ver soluciones ↓» del hero apunta a #soluciones y la sección de soluciones lleva
  id="soluciones".

COMPROBACIÓN ANTES DE ENTREGAR
- Ningún hex literal: todo sale de clases de token.
- Ningún tamaño fuera de la escala tipográfica de tokens.
- rounded-none en todo y ningún shadow-*.
- Patrón de fondos blanco · blanco · gris · gris · blanco · gris · azul · blanco.
- Eyebrows numerados de forma continua, sin huecos, desde 01.
- 3 indicadores en el hero, 3 situaciones en el problema, 2 soluciones (la primera con 4
  entregables y la segunda con 5), 4 etapas en tarjeta blanca con borde, 3 grupos en la ficha
  técnica, 6 preguntas de FAQ con la primera abierta, 3 servicios relacionados.
- Todos los enlaces apuntan a rutas de la lista.
- Sin logotipos, sin cifras, sin precios, sin casos de éxito, sin testimonios, sin
  certificaciones, sin ubicaciones, sin nombres de clientes.

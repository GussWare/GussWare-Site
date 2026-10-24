TAREA: diseña UNA pantalla de detalle de servicio para GussWare, en español de México.
Servicio: DESARROLLO A MEDIDA.

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
Items: Inicio (/) · Servicios (/servicios) · Desarrollo a medida (actual)
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
              <span class="text-label-bold uppercase text-brand-primary">DESARROLLO DE SOFTWARE</span>
            </div>
  H1: `Tu empresa no debería tener que adaptarse a un software que no le funciona`
      class: text-gw-text-primary text-display-lg-mobile md:text-display-lg font-bold leading-[1.08] tracking-tight mb-8
  Lead: `Si tus procesos dependen de hojas de cálculo, capturas repetidas o herramientas que no se
      comunican, podemos desarrollar una solución a la medida. Primero revisamos si realmente
      necesitas software nuevo; si una herramienta existente resuelve el problema, también te lo
      diremos.`
      class: text-gw-text-secondary text-body-lg leading-relaxed max-w-[68ch] mb-10
  CTAs en <div class="flex flex-wrap items-center gap-6 pt-2">:
    primaria: `Hablemos de tu proceso` → /contact
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
    01  Menos trabajo manual    → Procesos adaptados a tu operación
    02  Información centralizada → Menos datos dispersos entre herramientas
    03  Control de tu operación → Funciones diseñadas para tu equipo

========================================================================
2. 01 — EL PROBLEMA
<section class="bg-gw-surface-primary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div class="lg:col-span-5">
        <p class="text-label-bold uppercase text-brand-primary mb-3">01 — EL PROBLEMA</p>
        <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-6">
          Resuelve con software lo que hoy frena a tu equipo
        </h2>
        <p class="text-gw-text-secondary text-body-md leading-relaxed">
          Cuando una herramienta no se adapta a tus procesos, tu equipo termina usando soluciones
          improvisadas, capturando la misma información varias veces o buscando datos en distintos
          lugares.
        </p>
      </div>
      <div class="lg:col-span-7">
        <div class="divide-y divide-gw-border-subtle border-t border-b border-gw-border-subtle">
          cada fila: <div class="py-6 grid grid-cols-12 gap-4 items-baseline">
            número en col-span-2: col-span-2 font-mono font-bold text-brand-primary text-headline-md
            texto en col-span-10: col-span-10 text-gw-text-primary text-body-md font-medium leading-snug
            01  Tu equipo usa hojas de cálculo, correos o registros separados para operar.
            02  La misma información se captura varias veces en distintas herramientas.
            03  Para dar seguimiento, hay que buscar datos en varios lugares.
        </div>
        <p class="pt-6 text-label-bold uppercase text-gw-text-muted">
          Software a medida · Sistemas internos · Aplicaciones de gestión · Automatización · Integraciones
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
        Software para resolver problemas concretos de tu empresa
      </h2>
      <p class="text-gw-text-secondary text-body-md leading-relaxed">
        Desarrollamos herramientas para organizar la operación, atender mejor a tus clientes y
        coordinar procesos que requieren funciones específicas.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">

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

  TARJETA 01 — Sistemas internos para tu operación
    Descripción: `Centraliza procesos que hoy administras con hojas de cálculo, correos o registros
      separados.`
    Qué recibes:
      — Módulos para pedidos, inventario, incidencias u otros procesos
      — Información organizada en un solo sistema
      — Automatización de tareas repetitivas
      — Usuarios y permisos según las responsabilidades del equipo
      — Avisos y recordatorios para dar seguimiento a las actividades
    Beneficio: `Menos trabajo manual y una operación más ordenada.`

  TARJETA 02 — Portales y aplicaciones para clientes
    Descripción: `Permite que tus clientes consulten información y realicen operaciones sin depender
      de llamadas o correos para cada solicitud.`
    Qué recibes:
      — Acceso a pedidos, documentos y datos autorizados
      — Formularios para registrar solicitudes y darles seguimiento
      — Consulta del estado de trámites u operaciones
      — Interfaz con la identidad de tu empresa
      — Acceso desde celulares y computadoras
    Beneficio: `Menos solicitudes repetidas y mejor atención.`

  TARJETA 03 — Soluciones para procesos complejos
    Descripción: `Conecta áreas, información y reglas de negocio en una solución diseñada para la
      forma en que trabaja tu empresa.`
    Qué recibes:
      — Procesos que involucran varias áreas o responsables
      — Integración con sistemas existentes
      — Reglas de negocio adaptadas a tu operación
      — Paneles para consultar información y dar seguimiento
      — Estructura documentada para facilitar futuras ampliaciones
    Beneficio: `Áreas coordinadas y reglas claras para operar.`

  Cierre de sección: enlace de texto `Hablemos de tu proceso →` → /contact
    (text-navigation text-brand-secondary hover:underline)

========================================================================
4. 03 — CÓMO TRABAJAMOS
<section class="bg-gw-surface-secondary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="max-w-3xl mb-12">
      <p class="text-label-bold uppercase text-brand-primary mb-3">03 — CÓMO TRABAJAMOS</p>
      <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
        Primero entendemos tu operación; después construimos
      </h2>
      <p class="text-gw-text-secondary text-body-md leading-relaxed">
        Desarrollamos a partir de tus procesos reales, validando las funciones prioritarias y
        revisando los avances contigo.
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
        01  Entender      → Identificamos dónde se pierde tiempo, qué información necesitas y qué tareas conviene simplificar.
        02  Diseñar       → Definimos los procesos, las funciones y la estructura del sistema.
        03  Desarrollar   → Construimos por etapas para revisar las funciones y ajustar lo necesario.
        04  Evolucionar   → Planificamos mejoras conforme cambien tus procesos y prioridades.

========================================================================
5. 04 — FICHA TÉCNICA
<section class="bg-gw-surface-primary py-[var(--section-padding-mobile)] md:py-[var(--section-padding-desktop)] border-b border-gw-border-subtle">
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 md:px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
      <div class="lg:col-span-5">
        <p class="text-label-bold uppercase text-brand-primary mb-3">04 — FICHA TÉCNICA</p>
        <h2 class="text-gw-text-primary text-headline-lg font-bold leading-tight mb-5">
          Qué puede resolver el software
        </h2>
      </div>
      <div class="lg:col-span-7 lg:pt-8">
        <p class="text-gw-text-secondary text-body-md leading-relaxed">
          Seleccionamos las herramientas técnicas según los procesos, la información y las
          condiciones de operación de tu empresa.
        </p>
      </div>
    </div>
    <div class="pt-8 border-t border-gw-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8">
      cada columna: <div class="border-l-0 md:border-l-2 border-brand-primary pl-0 md:pl-6">
        rótulo: <p class="text-label-bold uppercase text-brand-primary mb-2">…</p>
        valor:  <p class="text-gw-text-primary text-body-md font-semibold leading-relaxed">…</p>
      </div>
      `TIPO DE SOLUCIÓN`            → Sistemas internos · Portales de clientes · Aplicaciones de gestión
      `FUNCIONES`                   → Automatización · Gestión de información · Control de permisos
      `INTEGRACIÓN Y MANTENIMIENTO` → Conexión con otros sistemas · Documentación técnica · Ampliación por etapas
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

      01  ¿Cómo sé si necesito software a medida?
          Revisamos tu proceso y las herramientas que ya existen. Si una solución disponible cubre
          tus necesidades, te la recomendaremos; si tus procesos requieren funciones específicas,
          evaluaremos el desarrollo a medida.
      02  ¿Cuánto tiempo necesito dedicar al proyecto?
      03  ¿El software será mío?
      04  ¿Qué pasa si mi empresa cambia sus procesos?
      05  ¿Se puede conectar con mis herramientas actuales?
      06  ¿Cuánto cuesta desarrollar software a medida?

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
          Deja de adaptar tu operación a herramientas que se quedan cortas
        </h2>
        <p class="text-supporting-blue-fixed text-body-lg leading-relaxed max-w-2xl mb-10">
          Cuéntanos qué procesos quieres resolver y cómo trabaja tu equipo. Te ayudaremos a
          determinar si necesitas una solución a medida o si existe una alternativa más conveniente.
        </p>
        <div class="flex flex-wrap items-center gap-6">
          botón: `Cuéntanos qué necesitas resolver` → /contact
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
      `CONSULTORÍA` — Consultoría técnica
          Decide cómo construir tu proyecto antes de invertir en construirlo
          → /servicios/consultoria-tecnica
      `WEB` — Diseño de sitios web y tiendas en línea
          Tu sitio web debe conseguir algo más que verse bien
          → /servicios/diseno-sitios-web-tiendas-en-linea
      `SISTEMAS` — Integración de APIs y Servicios Externos
          Deja de copiar datos de un programa a otro
          → /servicios/integracion-de-apis-y-servicios-externos

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
- 3 indicadores en el hero, 3 situaciones en el problema, 3 soluciones con 5 entregables y
  beneficio cada una, 4 etapas en tarjeta blanca con borde, 3 grupos en la ficha técnica,
  6 preguntas de FAQ con la primera abierta, 3 servicios relacionados.
- Todos los enlaces apuntan a rutas de la lista.
- Sin logotipos, sin cifras, sin precios, sin casos de éxito, sin testimonios, sin
  certificaciones, sin ubicaciones, sin nombres de clientes.

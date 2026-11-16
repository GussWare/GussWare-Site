TAREA: diseña UNA pantalla de detalle de servicio para GussWare, en español de México.
Servicio: DISEÑO DE SITIOS WEB Y TIENDAS EN LÍNEA.

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

========================================================================
0. MIGAS DE PAN
nav[aria-label] con ol, flex-wrap, gap-2, mb-8.
Items: Inicio (/) · Servicios (/servicios) · Diseño de sitios web y tiendas en línea (actual)
Enlaces: text-label-bold uppercase text-gw-text-secondary, hover:text-brand-secondary.
Item actual: text-supporting-blue-dark. Separador: chevron.

========================================================================
1. HERO
Sección blanca con border-b border-gw-border-subtle.
Grid: grid grid-cols-1 lg:grid-cols-12 gap-10 items-start

COLUMNA IZQUIERDA (lg:col-span-8)
  Eyebrow: cuadro w-2.5 h-2.5 bg-brand-primary inline-block + texto
           `DISEÑO Y DESARROLLO WEB` en text-label-bold uppercase text-brand-primary, mb-5
  H1: `Tu sitio web debe conseguir algo más que verse bien`
      class: text-gw-text-primary text-display-lg-mobile md:text-display-lg font-bold leading-[1.08] tracking-tight, mb-8
  Lead: `Una página confusa puede hacer que un cliente se vaya antes de conocer tus servicios.
      Diseñamos sitios y tiendas que explican lo que ofreces, facilitan el contacto o la compra y
      ofrecen una experiencia clara desde el celular hasta la computadora.`
      class: text-gw-text-secondary text-body-lg leading-relaxed max-w-[68ch], mb-10
  CTA primario: `Cuéntanos tu proyecto` → /contact
      class: text-label-bold bg-gw-action-primary text-brand-surface px-6 py-3 rounded-none hover:opacity-90
  CTA secundario: `Ver soluciones ↓` → #soluciones
      class: text-navigation text-brand-secondary hover:underline

COLUMNA DERECHA (lg:col-span-4)
  border-l-0 lg:border-l border-gw-border-subtle lg:pl-10, tres indicadores separados por
  border-b border-gw-border-subtle:
    01  Más oportunidades           → Tus visitantes entienden qué ofreces
    02  Compra sin complicaciones  → Menos obstáculos para contactar o pagar
    03  Listo para evolucionar     → Agrega contenido y funciones conforme crezcas
  Número: font-mono font-bold text-brand-primary text-headline-md
  Título: text-gw-text-primary text-body-lg font-bold
  Descripción: text-gw-text-muted text-body-md

========================================================================
2. 01 — EL PROBLEMA
Sección blanca con border-b border-gw-border-subtle.
Grid: grid grid-cols-1 lg:grid-cols-12 gap-10

COLUMNA IZQUIERDA (lg:col-span-5)
  Eyebrow `01 — EL PROBLEMA` (text-label-bold uppercase text-brand-primary, mb-3)
  H2: `Que tus visitantes encuentren lo que necesitan y sepan qué hacer`
      class: text-gw-text-primary text-headline-lg, mb-6
  Párrafo: `Si una persona entra a tu sitio y no entiende qué vendes, cómo funciona tu servicio o
      dónde comprar, es probable que busque otra opción.`
      class: text-gw-text-secondary text-body-md leading-relaxed

COLUMNA DERECHA (lg:col-span-7)
  Contenedor: divide-y divide-gw-border-subtle border-t border-b border-gw-border-subtle
  Cada fila: py-6 grid grid-cols-12 gap-4 items-baseline
    número en col-span-2: font-mono font-bold text-brand-primary text-headline-md
    texto en col-span-10: text-gw-text-primary text-body-md font-medium leading-snug
    01  Tu visitante no entiende qué ofreces ni por qué elegirte.
    02  No encuentra cómo contactarte, cotizar o comprar.
    03  El sitio no se ve bien en el celular o es difícil de actualizar.
  Cierre de baja emphasis (pt-6, text-label-bold uppercase text-gw-text-muted):
    `Diseño web · Desarrollo web · Tiendas en línea · Experiencia de usuario · Diseño adaptable · Plataformas digitales`

========================================================================
3. 02 — NUESTRAS SOLUCIONES
Sección bg-gw-surface-secondary con border-b border-gw-border-subtle.
Encabezado en max-w-3xl:
  Eyebrow `02 — NUESTRAS SOLUCIONES` (text-label-bold uppercase text-brand-primary, mb-3)
  H2: `Una solución digital para cada objetivo`
      class: text-gw-text-primary text-headline-lg, mb-5
  Párrafo: `Desde presentar tu negocio hasta vender por internet o digitalizar procesos,
      desarrollamos la solución que necesitas para atender mejor a tus clientes.`
      class: text-gw-text-secondary text-body-md leading-relaxed

Rejilla: grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12
Tarjeta: bg-gw-surface-primary border border-gw-border-subtle rounded-none p-6 md:p-8
         flex flex-col justify-between
  Número: font-mono font-bold text-brand-primary text-headline-md (mb-4)
  H3: text-gw-text-primary text-headline-md tracking-tight
  Descripción: text-gw-text-secondary text-body-md leading-relaxed (mb-6)
  Rótulo entregables: `QUÉ RECIBES` (text-label-bold uppercase text-brand-primary, mb-4)
  Lista: text-gw-text-primary text-body-md, 5 ítems con guion largo `—` en text-brand-primary
  Separador: border-t border-gw-border-subtle
  Rótulo beneficio: `Beneficio` (text-label-bold uppercase text-gw-text-muted)
  Valor: text-gw-text-primary text-body-md font-semibold

  TARJETA 01 — Sitios web que presentan tu negocio
    Descripción: `Haz que tus visitantes entiendan qué haces, por qué elegirte y cómo ponerse en
      contacto contigo.`
    Qué recibes:
      — Diseño personalizado alineado con la identidad de tu marca
      — Secciones y contenidos organizados para facilitar la consulta
      — Diseño adaptable a celulares, tabletas y computadoras
      — Estructura y metadatos preparados para que los buscadores entiendan el sitio
      — Panel de administración para actualizar textos e imágenes
    Beneficio: `Una presencia clara que genera confianza y contactos.`

  TARJETA 02 — Tiendas en línea que facilitan la compra
    Descripción: `Permite que tus clientes consulten productos, elijan lo que necesitan y
      realicen sus pedidos desde tu tienda.`
    Qué recibes:
      — Catálogo de productos con categorías y búsqueda
      — Carrito y proceso de compra organizado en pasos claros
      — Integración de métodos de pago y opciones de envío
      — Experiencia de compra adaptada a celulares
      — Panel para administrar productos, precios y pedidos
    Beneficio: `Menos fricción para comprar y más control de tu operación.`

  TARJETA 03 — Plataformas digitales para tu operación
    Descripción: `Cuando necesitas más que una página, desarrollamos plataformas para administrar
      información, atender clientes o resolver procesos específicos.`
    Qué recibes:
      — Funciones adaptadas a los procesos de tu negocio
      — Usuarios y permisos para organizar el acceso
      — Integración con las herramientas que utilizas
      — Paneles para consultar y administrar información
      — Estructura preparada para incorporar nuevas funciones
    Beneficio: `Una herramienta propia para operar, no solo para presentar.`

Cierre de sección: enlace de texto `Hablemos de tu proyecto →` → /contact
  (text-navigation text-brand-secondary hover:underline)

========================================================================
4. 03 — CÓMO TRABAJAMOS
Sección bg-gw-surface-secondary con border-b border-gw-border-subtle.
Encabezado en max-w-3xl mb-12:
  Eyebrow `03 — CÓMO TRABAJAMOS` (text-label-bold uppercase text-brand-primary, mb-3)
  H2: `Del diseño a un sitio que cumple su propósito`
      class: text-gw-text-primary text-headline-lg, mb-5
  Párrafo: `Trabajamos por etapas para validar la propuesta, desarrollar las funciones y revisar el
      resultado antes de publicarlo.`
      class: text-gw-text-secondary text-body-md leading-relaxed

Rejilla: relative + grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10
Línea conectora detrás de los marcadores, solo en escritorio:
  hidden lg:block absolute top-6 left-6 right-6 h-px bg-gw-border-subtle z-0

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
    01  Entender             → Definimos qué quieres conseguir, quién visitará el sitio y qué necesita encontrar.
    02  Diseñar              → Organizamos los contenidos y las pantallas, y revisamos contigo la propuesta visual.
    03  Desarrollar          → Construimos el sitio, probamos sus funciones y verificamos su adaptación a diferentes dispositivos.
    04  Publicar y mejorar   → Preparamos el lanzamiento y definimos oportunidades de mejora a partir de las necesidades del negocio.

========================================================================
5. 04 — FICHA TÉCNICA
Sección bg-gw-surface-primary con border-b border-gw-border-subtle.
Grid: grid grid-cols-1 lg:grid-cols-12 gap-10

COLUMNA IZQUIERDA (lg:col-span-5)
  Eyebrow `04 — FICHA TÉCNICA` (text-label-bold uppercase text-brand-primary, mb-3)
  H2: `Qué incluye la solución web`
      class: text-gw-text-primary text-headline-lg, mb-5

COLUMNA DERECHA (lg:col-span-7)
  Párrafo: `Seleccionamos las herramientas según el tipo de sitio, las funciones necesarias y la
      forma en que administrarás los contenidos.`
      class: text-gw-text-secondary text-body-md leading-relaxed

TIRA DE TRES COLUMNAS (después del párrafo, con filete superior):
  pt-8 border-t border-gw-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8
  Cada columna:
    Rótulo: text-label-bold uppercase text-brand-primary (mb-2)
    Valor: text-gw-text-primary text-body-md font-semibold leading-relaxed
    `TIPO DE SOLUCIÓN`     → Sitios web · Tiendas en línea · Plataformas a medida
    `EXPERIENCIA DE USO`   → Diseño personalizado · Adaptación a celulares · Navegación clara
    `BASE TÉCNICA`         → Gestión de contenidos · Integraciones · Rendimiento y mantenimiento

========================================================================
6. 05 — DUDAS FRECUENTES
Sección bg-gw-surface-secondary con border-b border-gw-border-subtle.
  Eyebrow `05 — DUDAS FRECUENTES` (text-label-bold uppercase text-brand-secondary, mb-4)
  H2: `Lo que suele preguntarse antes de empezar`
      class: text-gw-text-primary text-headline-lg tracking-tight, mb-12
  Tarjeta: border-t border-gw-border-subtle divide-y divide-gw-border-subtle
           bg-gw-surface-primary border-b border-gw-border-subtle mb-8
  Cada fila: p-6 lg:p-8
    Fila: div flex items-center justify-between gap-4
      Pregunta: text-gw-text-primary text-body-lg font-bold
      Icono abierto:  `−` (menos matemático) en text-headline-md text-brand-primary
      Icono cerrado:  `+` en text-headline-md text-gw-text-muted
    Respuesta (solo en la fila abierta): div mt-4 pt-4 border-t border-gw-border-subtle
      p text-gw-text-secondary text-body-md leading-relaxed max-w-[70ch]
  6 filas. La PRIMERA abierta, las otras 5 cerradas.

    01  ¿Cuánto tarda el desarrollo de mi sitio web?
        Depende del tamaño, los contenidos y las funciones. Antes de iniciar definimos las
        etapas y los tiempos estimados con base en los requerimientos del proyecto.
    02  ¿Podré actualizar el sitio sin ayuda técnica?
    03  ¿Mi sitio aparecerá en Google?
    04  ¿Podré agregar funciones después?
    05  ¿Pueden conectar el sitio con mi sistema de facturación o inventario?
    06  ¿Cuánto cuesta desarrollar un sitio web o una tienda?

  Microcopy debajo de la lista, como enlace de texto (no botón):
    `¿Te queda otra duda? Escríbenos →` → /contact
    (text-label-bold text-brand-primary)

========================================================================
7. 06 — INICIA TU PROYECTO
Sección bg-supporting-blue-dark, texto text-brand-surface, relative overflow-hidden.
Grid: grid grid-cols-1 lg:grid-cols-12 gap-10 items-center

COLUMNA IZQUIERDA (lg:col-span-8)
  Eyebrow `06 — INICIA TU PROYECTO` (text-label-bold uppercase text-brand-accent, mb-4)
  H2: `Convierte tu presencia digital en una herramienta para tu negocio`
      class: text-brand-surface text-headline-lg, mb-6
  Párrafo: `Cuéntanos qué vendes, qué servicios ofreces y qué quieres que tus visitantes hagan en
      tu sitio. Definiremos contigo la mejor forma de llevarlo a internet.`
      class: text-supporting-blue-fixed text-body-lg leading-relaxed max-w-2xl, mb-10
  Botón: `Diseñemos tu sitio web` → /contact
      (text-label-bold bg-gw-action-primary text-brand-surface px-6 py-3 rounded-none hover:opacity-90)
  Enlace: `Ver todos los servicios →` → /servicios
      (text-label-bold border-2 border-brand-surface text-brand-surface hover:bg-brand-surface hover:text-brand-primary)

COLUMNA DERECHA (lg:col-span-4, hidden lg:flex) — adorno geométrico, no imagen:
  Cuadro de 256×256 con border border-supporting-blue-dark, padding 6, que contiene:
    - cuadrado 48×48 bg-brand-primary
    - tres barras horizontales: w-full h-1 bg-supporting-blue-dark, w-3/4 h-1 bg-supporting-blue-dark,
      w-1/2 h-1 bg-brand-accent
    - texto `GUSSWARE · CORE` en font-mono text-label-bold uppercase text-supporting-blue-fixed-dim
    - cuadro 40×40 con border-2 border-brand-accent

========================================================================
8. SERVICIOS RELACIONADOS
Sección bg-gw-surface-primary con border-b border-gw-border-subtle.
  Eyebrow `SIGUE EXPLORANDO` (text-label-bold uppercase text-brand-primary, mb-3)
  H2: `Otros servicios que pueden ayudarte` (text-gw-text-primary text-headline-lg)
Rejilla: grid grid-cols-1 md:grid-cols-3 gap-8
Tarjeta: bg-gw-surface-primary border border-gw-border-subtle rounded-none p-8
         flex flex-col justify-between hover:border-brand-primary
  Categoría: text-label-bold uppercase text-brand-primary (mb-3)
  H3: text-gw-text-primary text-headline-md (mb-4)
  Frase: text-gw-text-secondary text-body-md leading-relaxed (mb-8)
  Separador: border-t border-gw-border-subtle pt-5
  Enlace: `Ver servicio →` (text-label-bold text-brand-primary)
    `MÓVIL` — Aplicaciones móviles
        Una aplicación que resuelve una necesidad desde el celular
        → /servicios/aplicaciones-moviles
    `SOFTWARE` — Desarrollo a medida
        Tu empresa no debería tener que adaptarse a un software que no le funciona
        → /servicios/desarrollo-a-medida
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
  beneficio cada una, 4 etapas, 3 grupos en la ficha técnica, 6 preguntas de FAQ con la primera
  abierta, 3 servicios relacionados.
- Todos los enlaces apuntan a rutas de la lista.
- Sin logotipos, sin cifras, sin precios, sin casos de éxito, sin testimonios, sin
  certificaciones, sin ubicaciones, sin nombres de clientes.

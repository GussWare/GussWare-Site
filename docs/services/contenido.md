# Contenido de las pantallas de servicio (versión actual)

> Contenido extraído de las 6 pantallas vigentes en Stitch (proyecto *GussWare Design System*).
> Es una **fotografía del contenido actual**, para poder rediseñar sin perder el copy aprobado.
> Los textos no se han alterado; solo se reagrupan por sección y por servicio.

Cobertura: ES (español de México). Los campos `href` reflejan el destino que cada pantalla usa hoy (hay rutas `/contact` y `/contacto`, y enlaces internos `#soluciones` / `#cierre` / `#servicios`).

---


## Integración de APIs y Servicios Externos

**Pantalla Stitch:** `GussWare — Integración de APIs y Servicios Externos`  
**Archivo:** `html/integracion.html`

### HERO

- **Contenedor:** `bg-white py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`

  - Inicio
  - /
  - Servicios
  - /
  - Integración de APIs y Servicios Externos
- **H1** Deja de copiar datos de un programa a otro
- Si tu equipo registra un pedido en una herramienta, vuelve a capturarlo en otra y después verifica que todo coincida, hay trabajo que se puede automatizar. Conectamos tus sistemas para que intercambien información con reglas claras y puedas dedicar menos tiempo a tareas repetitivas.
- **Link** «Cuéntanos tu caso» → `/contact`
- **Link** «Ver soluciones ↓» → `#soluciones`

### PROBLEMA

- **Contenedor:** `bg-white py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16` · `py-6 grid grid-cols-12 gap-4 items-baseline`

- **H2** Tus programas, trabajando en equipo
- Cuando las herramientas de tu negocio están desconectadas, los pedidos, clientes, productos y facturas pueden terminar duplicados o desactualizados.
- 01
- Los pedidos, clientes, productos o facturas se duplican entre herramientas.
- 02
- Tu equipo vuelve a capturar la misma información en otro programa.
- 03
- Cuando algo falla, no queda claro qué se envió, cuándo ni a dónde.

### SOLUCIONES

- **Contenedor:** `bg-brand-alt py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12`

- **H2** Conecta tus herramientas y automatiza el intercambio de información
- Creamos conexiones entre las aplicaciones que ya utilizas para reducir capturas repetidas, coordinar procesos y mantener los datos actualizados.
- **H3** Conectar tus programas entre sí
- Haz que la información registrada en una herramienta pueda utilizarse en otra sin depender de transferencias manuales.
  - — Conexión entre tienda, facturación, CRM o inventario
  - — Transferencia automática de los datos definidos
  - — Validación de la información antes de procesarla
  - — Registro de operaciones para consultar qué se envió y cuándo
  - — Reintentos y alertas para atender transferencias fallidas
- Beneficio
- Menos capturas manuales y datos más consistentes.
- **H3** Automatizar tareas entre sistemas
- Define qué debe suceder cuando ocurre un evento para que tus herramientas ejecuten acciones sin intervención manual en cada paso.
  - — Generación o actualización de registros a partir de eventos
  - — Automatización de tareas como notificaciones y cambios de estado
  - — Reglas para determinar cuándo debe ejecutarse una acción
  - — Avisos cuando una operación requiere atención
  - — Historial de resultados para identificar errores y dar seguimiento
- Beneficio
- Menos pasos manuales y respuestas más rápidas.
- **H3** Mantener la información sincronizada
- Coordina los datos que utilizan diferentes áreas para reducir diferencias entre registros y evitar trabajar con información desactualizada.
  - — Sincronización de clientes, productos, precios u otros registros
  - — Reglas para definir qué sistema actualiza cada dato
  - — Validaciones para reducir duplicados e inconsistencias
  - — Actualización programada o basada en eventos
  - — Registro de errores y procedimientos para corregirlos
- Beneficio
- Un solo dato actualizado para todas las áreas.
- **Link** «Hablemos de tu caso →» → `/contact`

### PLATAFORMAS

- **Contenedor:** `bg-white py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12`

- **H2** ¿Qué plataformas podemos conectar?
- Estos son ejemplos de plataformas sobre las que puedes consultar una integración. No implican que todas las conexiones estén implementadas, probadas o disponibles de inmediato: revisamos tu caso y las condiciones de acceso de cada sistema.
- **H3** SAP
- EJEMPLO DE USO
- Sincronizar inventario o pedidos con un sistema empresarial.
- **H3** Zoho
- EJEMPLO DE USO
- Compartir clientes y oportunidades con tu sistema de facturación.
- **H3** Salesforce
- EJEMPLO DE USO
- Mantener actualizados clientes y oportunidades comerciales.
- **H3** Shopify
- EJEMPLO DE USO
- Enviar pedidos y niveles de inventario entre la tienda y tu operación.
- **H3** Microsoft 365
- EJEMPLO DE USO
- Conectar solicitudes, archivos o flujos de trabajo con tu CRM.
- **H3** WooCommerce
- EJEMPLO DE USO
- Sincronizar productos, pedidos y existencias de la tienda en línea.
- **H3** ¿Tienes otra plataforma en mente?
- ¿No sabes si podemos conectar el sistema que utilizas? Cuéntanos cuál es y qué necesitas hacer. Revisaremos tu caso y te orientaremos sobre las posibilidades de integración.
- **Link** «Consultar mi integración →» → `/contact`

### PROCESO

- **Contenedor:** `bg-brand-alt py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 relative z-10`

- **H2** Conexiones diseñadas para manejar los datos correctamente
- Antes de conectar los sistemas definimos qué información se mueve, cómo debe transformarse y qué hacer cuando ocurre un error.
- **H3** Analizar
- Identificamos las herramientas, los datos y las tareas que hoy se realizan manualmente.
- **H3** Diseñar
- Definimos el flujo de información, las reglas de validación y el tratamiento de errores.
- **H3** Conectar
- Implementamos la integración y probamos los escenarios de operación acordados.
- **H3** Supervisar
- Configuramos registros y mecanismos de seguimiento para detectar fallas y facilitar su diagnóstico.

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de conectar sistemas
- **H3** ¿Qué sistemas puedo conectar?
- −
- Podemos evaluar tiendas en línea, facturación, CRM, inventarios, hojas de cálculo y otras aplicaciones. La viabilidad depende de los accesos y mecanismos de integración que ofrezca cada sistema.
- **H3** ¿Se pueden conectar programas antiguos?
- +
- **H3** ¿Qué pasa si falla una transferencia de información?
- +
- **H3** ¿Qué ocurre si uno de los sistemas cambia?
- +
- **H3** ¿Puedo saber qué información se transfirió?
- +
- **H3** ¿Cuánto cuesta conectar mis sistemas?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `/contact`

### CTA

- **Contenedor:** `bg-brand-deep text-white py-[120px] relative overflow-hidden`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`

- **H2** Deja que tus sistemas hagan el trabajo repetitivo
- Cuéntanos qué programas utilizas y qué información tienes que pasar de uno a otro. Revisaremos cómo automatizar ese proceso.
- **Link** «Conectemos tus sistemas» → `/contact`
- **Link** «Ver todos los servicios →» → `/servicios`
- GUSSWARE · CORE

### RELACIONADOS

- **Contenedor:** `bg-white py-[120px] border-b border-[#E2E4E8]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- **H2** Otros servicios que pueden ayudarte
- SOFTWARE A MEDIDA
- **H3** Desarrollo a medida
- Tu empresa no debería tener que adaptarse a un software que no le funciona.
- **Link** «Ver servicio →» → `/servicios/desarrollo-a-medida`
- WEB & E-COMMERCE
- **H3** Diseño de sitios web y tiendas en línea
- Tu sitio web debe conseguir algo más que verse bien.
- **Link** «Ver servicio →» → `/servicios/web-ecommerce`
- INFRAESTRUCTURA
- **H3** DevOps y Soporte Técnico
- Actualiza tus sistemas sin convertir cada cambio en un riesgo.
- **Link** «Ver servicio →» → `/servicios/devops`


## Diseño de sitios web y tiendas en línea

**Pantalla Stitch:** `GussWare - Diseño de sitios web y tiendas en línea`  
**Archivo:** `html/web.html`

### HERO

- **Contenedor:** `bg-brand-surface pt-8 pb-24 border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`

  - Inicio
  - /
  - Servicios
  - /
  - Diseño de sitios web y tiendas en línea
- DISEÑO Y DESARROLLO WEB
- **H1** Tu sitio web debe conseguir algo más que verse bien
- Una página confusa puede hacer que un cliente se vaya antes de conocer tus servicios. Diseñamos sitios y tiendas que explican lo que ofreces, facilitan el contacto o la compra y ofrecen una experiencia clara desde el celular hasta la computadora.
- **Link** «Cuéntanos tu proyecto» → `/contacto`
- **Link** «Ver soluciones ↓» → `#soluciones`
- 01
- **H3** Más oportunidades
- Tus visitantes entienden qué ofreces
- 02
- **H3** Compra sin complicaciones
- Menos obstáculos para contactar o pagar
- 03
- **H3** Listo para evolucionar
- Agrega contenido y funciones conforme crezcas

### PROBLEMA

- **Contenedor:** `bg-brand-surface py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start` · `py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline`

- 01 — EL PROBLEMA
- **H2** Que tus visitantes encuentren lo que necesitan y sepan qué hacer
- Si una persona entra a tu sitio y no entiende qué vendes, cómo funciona tu servicio o dónde comprar, es probable que busque otra opción.
- 01
- Tu visitante no entiende qué ofreces ni por qué elegirte.
- 02
- No encuentra cómo contactarte, cotizar o comprar.
- 03
- El sitio no se ve bien en el celular o es difícil de actualizar.
- Diseño web · Desarrollo web · Tiendas en línea · Experiencia de usuario · Diseño adaptable · Plataformas digitales

### SOLUCIONES

- **Contenedor:** `bg-brand-alt py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12`

- 02 — QUÉ PUEDES CONTRATAR
- **H2** Una solución digital para cada objetivo
- Desde presentar tu negocio hasta vender por internet o digitalizar procesos, desarrollamos la solución que necesitas para atender mejor a tus clientes.
- 01
- **H3** Sitios web que presentan tu negocio
- Haz que tus visitantes entiendan qué haces, por qué elegirte y cómo ponerse en contacto contigo.
- QUÉ RECIBES
  - • Diseño personalizado alineado con la identidad de tu marca
  - • Secciones y contenidos organizados para facilitar la consulta
  - • Diseño adaptable a celulares, tabletas y computadoras
  - • Estructura y metadatos preparados para que los buscadores entiendan el sitio
  - • Panel de administración para actualizar textos e imágenes
- Beneficio: Una presencia clara que genera confianza y contactos.
- 02
- **H3** Tiendas en línea que facilitan la compra
- Permite que tus clientes consulten productos, elijan lo que necesitan y realicen sus pedidos desde tu tienda.
- QUÉ RECIBES
  - • Catálogo de productos con categorías y búsqueda
  - • Carrito y proceso de compra organizado en pasos claros
  - • Integración de métodos de pago y opciones de envío
  - • Experiencia de compra adaptada a celulares
  - • Panel para administrar productos, precios y pedidos
- Beneficio: Menos fricción para comprar y más control de tu operación.
- 03
- **H3** Plataformas digitales para tu operación
- Cuando necesitas más que una página, desarrollamos plataformas para administrar información, atender clientes o resolver procesos específicos.
- QUÉ RECIBES
  - • Funciones adaptadas a los procesos de tu negocio
  - • Usuarios y permisos para organizar el acceso
  - • Integración con las herramientas que utilizas
  - • Paneles para consultar y administrar información
  - • Estructura preparada para incorporar nuevas funciones
- Beneficio: Una herramienta propia para operar, no solo para presentar.
- **Link** «Hablemos de tu proyecto →» → `/contacto`

### PROCESO

- **Contenedor:** `bg-brand-alt py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative`

**Eyebrow:** `01 — ETAPA`

- 03 — CÓMO TRABAJAMOS
- **H2** Del diseño a un sitio que cumple su propósito
- Trabajamos por etapas para validar la propuesta, desarrollar las funciones y revisar el resultado antes de publicarlo.
- ETAPA
- **H3** Entender
- Definimos qué quieres conseguir, quién visitará el sitio y qué necesita encontrar.
- ETAPA
- **H3** Diseñar
- Organizamos los contenidos y las pantallas, y revisamos contigo la propuesta visual.
- ETAPA
- **H3** Desarrollar
- Construimos el sitio, probamos sus funciones y verificamos su adaptación a diferentes dispositivos.
- ETAPA
- **H3** Publicar y mejorar
- Preparamos el lanzamiento y definimos oportunidades de mejora a partir de las necesidades del negocio.

### FICHA

- **Contenedor:** `bg-brand-surface py-[90px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-baseline` · `pt-8 border-t border-[#dadada] grid grid-cols-1 md:grid-cols-3 gap-8`

- 04 — FICHA DEL PROYECTO
- **H2** Qué incluye la solución web
- Seleccionamos las herramientas según el tipo de sitio, las funciones necesarias y la forma en que administrarás los contenidos.
- TIPO DE SOLUCIÓN
- Sitios web · Tiendas en línea · Plataformas a medida
- EXPERIENCIA DE USO
- Diseño personalizado · Adaptación a celulares · Navegación clara
- BASE TÉCNICA
- Gestión de contenidos · Integraciones · Rendimiento y mantenimiento

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de empezar
- **H3** ¿Cuánto tarda el desarrollo de mi sitio web?
- −
- Depende del tamaño, los contenidos y las funciones. Antes de iniciar definimos las etapas y los tiempos estimados con base en los requerimientos del proyecto.
- **H3** ¿Podré actualizar el sitio sin ayuda técnica?
- +
- **H3** ¿Mi sitio aparecerá en Google?
- +
- **H3** ¿Podré agregar funciones después?
- +
- **H3** ¿Pueden conectar el sitio con mi sistema de facturación o inventario?
- +
- **H3** ¿Cuánto cuesta desarrollar un sitio web o una tienda?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `/contacto`

### CTA

- **Contenedor:** `bg-brand-deep text-white py-[120px]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`

- 06 — INICIA TU PROYECTO
- **H2** Convierte tu presencia digital en una herramienta para tu negocio
- Cuéntanos qué vendes, qué servicios ofreces y qué quieres que tus visitantes hagan en tu sitio. Definiremos contigo la mejor forma de llevarlo a internet.
- **Link** «Diseñemos tu sitio web» → `/contacto`
- **Link** «Ver todos los servicios →» → `/servicios`

### RELACIONADOS

- **Contenedor:** `bg-brand-surface py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- SIGUE EXPLORANDO
- **H2** Otros servicios que pueden ayudarte
- MÓVIL
- **H3** Aplicaciones móviles
- Una aplicación que resuelve una necesidad desde el celular
- **Link** «Ver servicio →» → `/servicios/aplicaciones-moviles`
- SOFTWARE
- **H3** Desarrollo a medida
- Tu empresa no debería tener que adaptarse a un software que no le funciona
- **Link** «Ver servicio →» → `/servicios/desarrollo-a-medida`
- SISTEMAS
- **H3** Integración de APIs y Servicios Externos
- Deja de copiar datos de un programa a otro
- **Link** «Ver servicio →» → `/servicios/integracion-de-apis`


## Aplicaciones Móviles

**Pantalla Stitch:** `GussWare - Aplicaciones móviles (Detalle de Servicio)`  
**Archivo:** `html/moviles.html`

### HERO

- **Contenedor:** `w-full bg-white pt-10 pb-20 border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-12 gap-8 items-start`

- **Link** «Inicio» → `/`
- /
- **Link** «Servicios» → `/servicios`
- /
- Aplicaciones móviles
- DESARROLLO DE APLICACIONES MÓVILES
- **H1** Una aplicación que resuelve una necesidad desde el celular
- Si tus clientes o colaboradores necesitan consultar información, realizar operaciones o acceder a tus servicios desde cualquier lugar, desarrollamos una aplicación pensada para esas tareas. Definimos contigo qué debe hacer y cómo llevarla a iPhone y Android.
- **Link** «Hablemos de tu app» → `/contacto`
- **Link** «Ver soluciones ↓» → `#soluciones`
- **H3** La plataforma adecuada
- iOS, Android o ambas según lo que necesitas
- **H3** Tareas más sencillas
- Funciones organizadas para el uso diario
- **H3** Base para crecer
- Preparada para nuevas funciones y actualizaciones

### PROBLEMA

- **Contenedor:** `w-full bg-white section-py border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-12 gap-8 mb-12`

- 01 · EL PROBLEMA
- **H2** Que la aplicación facilite las tareas de tus usuarios
- Una aplicación pierde valor si resulta complicada, tarda demasiado en responder o no resuelve el problema para el que fue creada.
- 01
- La aplicación es complicada y tus usuarios no encuentran cómo hacer lo que necesitan.
- 02
- Tarda en responder o falla en el momento en que más se usa.
- 03
- No resuelve la tarea concreta para la que se creó.
- Aplicaciones móviles · iOS y Android · Experiencia de usuario · Rendimiento · Notificaciones · Integraciones

### SOLUCIONES

- **Contenedor:** `w-full bg-[#F2F2F2] section-py border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12`

- 02 · QUÉ PUEDES CONTRATAR
- **H2** Dos caminos para llegar a tus usuarios
- Elegimos entre un desarrollo específico para una plataforma y una solución multiplataforma según las funciones, el rendimiento y los recursos del proyecto.
- **H3** Aplicaciones específicas para iPhone o Android
- Cuando necesitas aprovechar funciones particulares del dispositivo o desarrollar una experiencia enfocada en una plataforma.
- QUÉ RECIBES
  - Aplicación adaptada a iOS o Android
  - Integración con cámara, ubicación y notificaciones
  - Pantallas alineadas con la experiencia habitual de la plataforma
  - Pruebas de las funciones y el rendimiento requeridos
  - Proyecto preparado para recibir mantenimiento y actualizaciones
- BENEFICIO
- Aprovecha las funciones del dispositivo y una experiencia propia de la plataforma.
- **H3** Una aplicación para iPhone y Android
- Llega a usuarios de ambas plataformas con un desarrollo que comparte componentes y reduce la duplicación de trabajo cuando es viable.
- QUÉ RECIBES
  - Aplicación disponible para iOS y Android
  - Componentes y lógica compartidos para optimizar el desarrollo
  - Interfaz adaptada a cada plataforma
  - Funciones conectadas con los servicios y sistemas necesarios
  - Base común para mantener y ampliar la aplicación
- BENEFICIO
- Llega a ambas plataformas con una base común y menos duplicación.
- **Link** «Hablemos de tu app →» → `/contacto`

### PROCESO

- **Contenedor:** `w-full bg-[#F2F2F2] section-py border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative`

- 03 · CÓMO TRABAJAMOS
- **H2** De la idea a una aplicación que puedes probar
- Definimos las funciones, validamos la experiencia y desarrollamos por etapas para que puedas revisar el avance antes del lanzamiento.
- **H3** Entender
- Identificamos a los usuarios, las tareas y las necesidades que debe resolver la aplicación.
- Definición inicial
- **H3** Diseñar
- Creamos las pantallas y los recorridos para que puedas validar cómo funcionará.
- Validación UX/UI
- **H3** Desarrollar
- Implementamos las funciones y preparamos versiones de prueba para revisar el resultado.
- Entregas periódicas
- **H3** Publicar y evolucionar
- Preparamos la distribución en las tiendas y definimos las siguientes mejoras de acuerdo con las necesidades del proyecto.
- Lanzamiento

### FICHA

- **Contenedor:** `w-full bg-white section-py border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#E5E5E5] divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5] py-2`

- 04 · ENFOQUE TÉCNICO
- **H2** Cómo desarrollamos tu aplicación
- Elegimos el enfoque técnico según las funciones que necesitas y las plataformas en las que quieres estar presente.
- Plataformas
- iOS · Android
- Funciones del dispositivo
- Cámara · Ubicación · Notificaciones
- Enfoque de desarrollo
- Específico por plataforma · Multiplataforma

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de empezar
- **H3** ¿Necesito una aplicación diferente para iPhone y Android?
- −
- No siempre. Podemos desarrollar una aplicación específica para una plataforma o utilizar un enfoque multiplataforma. Evaluamos las funciones y los requisitos para recomendarte la opción adecuada.
- **H3** ¿Cuánto tarda desarrollar una aplicación?
- +
- **H3** ¿Puedo probarla antes de publicarla?
- +
- **H3** ¿Quién se encarga de publicarla en las tiendas?
- +
- **H3** ¿Qué pasa cuando necesite nuevas funciones?
- +
- **H3** ¿Cuánto cuesta desarrollar una aplicación?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `/contacto`

### CTA

- **Contenedor:** `w-full bg-brand-deep text-white section-py`

- 06 · INICIA TU APLICACIÓN
- **H2** Lleva tus servicios al celular de tus usuarios
- Cuéntanos qué necesitas que hagan tus usuarios desde una aplicación. Evaluaremos las opciones para convertir esa necesidad en un proyecto.
- **Link** «Cuéntanos tu idea» → `/contacto`
- **Link** «Ver todos los servicios →» → `/servicios`

### RELACIONADOS

- **Contenedor:** `w-full bg-white section-py border-b border-[#E5E5E5]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- SIGUE EXPLORANDO
- **H2** Otros servicios que pueden ayudarte
- WEB & E-COMMERCE
- **H3** Diseño de sitios web y tiendas en línea
- Tu sitio web debe conseguir algo más que verse bien
- **Link** «Ver servicio →» → `/servicios/web-ecommerce`
- SOFTWARE A MEDIDA
- **H3** Desarrollo a medida
- Tu empresa no debería tener que adaptarse a un software que no le funciona
- **Link** «Ver servicio →» → `/servicios/desarrollo-a-medida`
- INTEGRACIONES
- **H3** Integración de APIs y Servicios Externos
- Deja de copiar datos de un programa a otro
- **Link** «Ver servicio →» → `/servicios/integracion-de-apis`


## Desarrollo a medida

**Pantalla Stitch:** `GussWare - Servicio: Desarrollo a medida`  
**Archivo:** `html/medida.html`

### HERO

- **Contenedor:** `bg-white border-b border-brand-line pt-12 pb-24 lg:pt-16 lg:pb-28`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`

- **Link** «Inicio» → `/`
- /
- **Link** «Servicios» → `#servicios`
- /
- Desarrollo a medida
- DESARROLLO DE SOFTWARE
- **H1** Tu empresa no debería tener que adaptarse a un software que no le funciona
- Si tus procesos dependen de hojas de cálculo, capturas repetidas o herramientas que no se comunican, podemos desarrollar una solución a la medida. Primero revisamos si realmente necesitas software nuevo; si una herramienta existente resuelve el problema, también te lo diremos.
- **Link** «Hablemos de tu proceso» → `#cierre`
- **Link** «Ver soluciones ↓» → `#soluciones`
- 01
- **H2** Menos trabajo manual
- Procesos adaptados a tu operación
- 02
- **H2** Información centralizada
- Menos datos dispersos entre herramientas
- 03
- **H2** Control de tu operación
- Funciones diseñadas para tu equipo

### PROBLEMA

- **Contenedor:** `bg-white py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 items-start` · `py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline group hover:bg-[#fafafa] transition-colors px-2`

**Eyebrow:** `01 — EL PROBLEMA`

- EL PROBLEMA
- **H2** Resuelve con software lo que hoy frena a tu equipo
- Cuando una herramienta no se adapta a tus procesos, tu equipo termina usando soluciones improvisadas, capturando la misma información varias veces o buscando datos en distintos lugares.
- Tu equipo usa hojas de cálculo, correos o registros separados para operar.
- La misma información se captura varias veces en distintas herramientas.
- Para dar seguimiento, hay que buscar datos en varios lugares.
- Software a medida
- Sistemas internos
- Aplicaciones de gestión
- Automatización
- Integraciones

### SOLUCIONES

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-stretch`

**Eyebrow:** `02 — QUÉ PUEDES CONTRATAR`

- QUÉ PUEDES CONTRATAR
- **H2** Software para resolver problemas concretos de tu empresa
- Desarrollamos herramientas para organizar la operación, atender mejor a tus clientes y coordinar procesos que requieren funciones específicas.
- **H3** Sistemas internos para tu operación
- Centraliza procesos que hoy administras con hojas de cálculo, correos o registros separados.
- QUÉ RECIBES
  - Módulos para pedidos, inventario, incidencias u otros procesos
  - Información organizada en un solo sistema
  - Automatización de tareas repetitivas
  - Usuarios y permisos según las responsabilidades del equipo
  - Avisos y recordatorios para dar seguimiento a las actividades
- Beneficio: Menos trabajo manual y una operación más ordenada.
- **H3** Portales y aplicaciones para clientes
- Permite que tus clientes consulten información y realicen operaciones sin depender de llamadas o correos para cada solicitud.
- QUÉ RECIBES
  - Acceso a pedidos, documentos y datos autorizados
  - Formularios para registrar solicitudes y darles seguimiento
  - Consulta del estado de trámites u operaciones
  - Interfaz con la identidad de tu empresa
  - Acceso desde celulares y computadoras
- Beneficio: Menos solicitudes repetidas y mejor atención.
- **H3** Soluciones para procesos complejos
- Conecta áreas, información y reglas de negocio en una solución diseñada para la forma en que trabaja tu empresa.
- QUÉ RECIBES
  - Procesos que involucran varias áreas o responsables
  - Integración con sistemas existentes
  - Reglas de negocio adaptadas a tu operación
  - Paneles para consultar información y dar seguimiento
  - Estructura documentada para facilitar futuras ampliaciones
- Beneficio: Áreas coordinadas y reglas claras para operar.
- **Link** «Hablemos de tu proceso →» → `#cierre`

### PROCESO

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

**Eyebrow:** `03 — CÓMO TRABAJAMOS`

- CÓMO TRABAJAMOS
- **H2** Primero entendemos tu operación; después construimos
- Desarrollamos a partir de tus procesos reales, validando las funciones prioritarias y revisando los avances contigo.
- 01 ETAPA
- **H3** Entender
- Identificamos dónde se pierde tiempo, qué información necesitas y qué tareas conviene simplificar.
- 02 ETAPA
- **H3** Diseñar
- Definimos los procesos, las funciones y la estructura del sistema.
- 03 ETAPA
- **H3** Desarrollar
- Construimos por etapas para revisar las funciones y ajustar lo necesario.
- 04 ETAPA
- **H3** Evolucionar
- Planificamos mejoras conforme cambien tus procesos y prioridades.

### FICHA

- **Contenedor:** `bg-white py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 items-start` · `border-t border-b border-brand-line py-8 grid grid-cols-1 md:grid-cols-3 gap-8`

**Eyebrow:** `04 — CAPACIDADES DEL SISTEMA`

- CAPACIDADES DEL SISTEMA
- **H2** Qué puede resolver el software
- Seleccionamos las herramientas técnicas según los procesos, la información y las condiciones de operación de tu empresa.
- TIPO DE SOLUCIÓN
- Sistemas internos · Portales de clientes · Aplicaciones de gestión
- FUNCIONES
- Automatización · Gestión de información · Control de permisos
- INTEGRACIÓN Y MANTENIMIENTO
- Conexión con otros sistemas · Documentación técnica · Ampliación por etapas

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de empezar
- **H3** ¿Cómo sé si necesito software a medida?
- −
- Revisamos tu proceso y las herramientas que ya existen. Si una solución disponible cubre tus necesidades, te la recomendaremos; si tus procesos requieren funciones específicas, evaluaremos el desarrollo a medida.
- **H3** ¿Cuánto tiempo necesito dedicar al proyecto?
- +
- **H3** ¿El software será mío?
- +
- **H3** ¿Qué pasa si mi empresa cambia sus procesos?
- +
- **H3** ¿Se puede conectar con mis herramientas actuales?
- +
- **H3** ¿Cuánto cuesta desarrollar software a medida?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `#cierre`

### CTA

- **Contenedor:** `bg-brand-deep text-white py-[120px] relative overflow-hidden`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`

- 06 — INICIA TU PROYECTO
- **H2** Deja de adaptar tu operación a herramientas que se quedan cortas
- Cuéntanos qué procesos quieres resolver y cómo trabaja tu equipo. Te ayudaremos a determinar si necesitas una solución a medida o si existe una alternativa más conveniente.
- **Link** «Cuéntanos qué necesitas resolver» → `/contacto`
- **Link** «Ver todos los servicios →» → `#servicios`
- GUSSWARE
- ·
- CORE

### RELACIONADOS

- **Contenedor:** `bg-white py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- SIGUE EXPLORANDO
- **H2** Otros servicios que pueden ayudarte
- CONSULTORÍA
- **H3** Consultoría técnica
- Decide cómo construir tu proyecto antes de invertir en construirlo
- **Link** «Ver servicio →» → `/servicios/consultoria-tecnica`
- WEB Y E-COMMERCE
- **H3** Diseño de sitios web y tiendas en línea
- Tu sitio web debe conseguir algo más que verse bien
- **Link** «Ver servicio →» → `/servicios/diseno-web`
- SISTEMAS
- **H3** Integración de APIs y Servicios Externos
- Deja de copiar datos de un programa a otro
- **Link** «Ver servicio →» → `/servicios/integracion-apis`


## DevOps y Soporte Técnico

**Pantalla Stitch:** `GussWare - DevOps y Soporte Técnico`  
**Archivo:** `html/devops.html`

### HERO

- **Contenedor:** `bg-white pt-10 pb-24 border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`

  - Inicio
  - /
  - Servicios
  - /
  - DevOps y Soporte Técnico
- DEVOPS Y SOPORTE TÉCNICO
- **H1** Actualiza tus sistemas sin convertir cada cambio en un riesgo
- Una actualización mal aplicada o un servidor sin supervisión puede interrumpir tu operación. Automatizamos tareas, organizamos las publicaciones y damos seguimiento a la infraestructura para que puedas administrar tus sistemas con mayor control.
- **Link** «Hablemos de tu operación» → `/contact`
- **Link** «Ver soluciones ↓» → `#soluciones`
- 01
- **H3** Cambios controlados
- Publicaciones con validaciones y reversión cuando sea posible
- 02
- **H3** Menos tareas manuales
- Procesos técnicos automatizados
- 03
- **H3** Problemas visibles
- Alertas para detectar fallas a tiempo

### PROBLEMA

- **Contenedor:** `bg-white py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 items-start` · `py-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline`

- 01 — EL PROBLEMA
- **H2** Evita que un problema técnico se convierta en un problema para tu negocio
- Los sistemas pueden presentar fallas por actualizaciones, falta de recursos, errores de configuración o copias de seguridad que no funcionan como se esperaba.
- 01
- Una actualización mal aplicada interrumpe la operación.
- 02
- Nadie revisa los recursos, la configuración o las copias de seguridad hasta que algo falla.
- 03
- Cuando hay una incidencia, no existe un proceso claro para atenderla.
- Infraestructura · Despliegues · Copias de seguridad · Monitorización · Incidencias · Mantenimiento técnico

### SOLUCIONES

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch`

- 02 — QUÉ PUEDES CONTRATAR
- **H2** Controla las publicaciones, la infraestructura y las incidencias
- Organizamos los procesos necesarios para actualizar tus sistemas, mantener su infraestructura y detectar problemas antes de que se conviertan en interrupciones mayores.
- 01
- **H3** Publicaciones controladas
- Deja atrás las actualizaciones manuales y los cambios difíciles de revertir. Organizamos el proceso para publicar de forma consistente y reducir el riesgo de errores.
- QUÉ RECIBES
  - • Proceso automatizado para publicar nuevas versiones
  - • Pruebas antes de aplicar cambios en producción
  - • Procedimiento de reversión cuando la arquitectura lo permita
  - • Entornos separados para desarrollo, pruebas y producción
  - • Registro de las versiones publicadas y sus resultados
- Beneficio: Cambios más previsibles y menos riesgo de interrupción.
- 02
- **H3** Infraestructura y copias de seguridad
- Administra tus servidores y recursos técnicos con una configuración acorde con las necesidades de tus aplicaciones.
- QUÉ RECIBES
  - • Configuración y administración de servidores o infraestructura en la nube
  - • Revisión del consumo de recursos y la capacidad
  - • Copias de seguridad automáticas con pruebas de restauración
  - • Actualizaciones de seguridad y mantenimiento técnico
  - • Procedimientos documentados para la recuperación ante fallas
- Beneficio: Una base operativa más ordenada y recuperable.
- 03
- **H3** Supervisión y soporte técnico
- Identifica problemas de funcionamiento y cuenta con un proceso definido para atender las incidencias de tus sistemas.
- QUÉ RECIBES
  - • Alertas ante fallas o comportamientos fuera de los parámetros establecidos
  - • Supervisión de los servicios y recursos configurados
  - • Atención de incidencias con horarios y tiempos de respuesta acordados
  - • Revisiones preventivas de la infraestructura
  - • Reportes de problemas, acciones realizadas y recomendaciones
- Beneficio: Problemas detectados a tiempo y un proceso claro para atenderlos.
- **Link** «Hablemos de tu operación →» → `/contact`

### PROCESO

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 md:grid-cols-4 gap-6 relative`

- 03 — CÓMO TRABAJAMOS
- **H2** Una operación técnica más controlada
- Revisamos el estado de tus sistemas, priorizamos los riesgos y establecemos los procesos necesarios para mantenerlos y actualizarlos.
- **H3** Revisar
- Analizamos la infraestructura, los procesos de publicación y las necesidades de operación.
- **H3** Automatizar
- Identificamos tareas repetitivas que pueden ejecutarse con menos intervención manual.
- **H3** Implementar
- Configuramos los procesos, las copias de seguridad y las herramientas de supervisión acordadas.
- **H3** Supervisar
- Revisamos los indicadores definidos y atendemos las incidencias conforme al servicio establecido.

### FICHA

- **Contenedor:** `bg-white py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 items-start` · `grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#dadada] border-y border-[#dadada] py-8`

- 04 — QUÉ CUBRIMOS
- **H2** Qué utilizamos para operar tus sistemas
- Seleccionamos las herramientas de automatización, administración y supervisión según la infraestructura existente.
- **H4** Publicación
- Despliegues automatizados · Control de versiones · Entornos de prueba
- **H4** Infraestructura
- Servidores · Nube · Copias de seguridad · Administración de recursos
- **H4** Supervisión
- Monitorización · Alertas · Registros · Recuperación ante fallas

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de empezar
- **H3** ¿Qué incluye el servicio?
- −
- Podemos cubrir publicaciones, infraestructura, copias de seguridad, supervisión y atención de incidencias. Definimos las actividades, los sistemas incluidos y la cobertura antes de comenzar.
- **H3** ¿Necesito cambiar mis servidores actuales?
- +
- **H3** ¿El soporte incluye atención a los usuarios de mi empresa?
- +
- **H3** ¿Cómo sabré qué está pasando con mis sistemas?
- +
- **H3** ¿Atienden fallas fuera del horario laboral?
- +
- **H3** ¿Cuánto cuesta el servicio?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `/contact`

### CTA

- **Contenedor:** `bg-brand-deep py-[120px] text-white`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`

- 06 — INICIA TU PROYECTO
- **H2** Deja de resolver las fallas sobre la marcha
- Cuéntanos qué sistemas utilizas, cómo los administras y qué problemas te preocupan. Identificaremos las prioridades para mejorar su operación.
- **Link** «Revisemos tus sistemas» → `/contact`
- **Link** «Ver todos los servicios →» → `/services`
- Gussware
- Ops-Core

### RELACIONADOS

- **Contenedor:** `bg-white py-[120px] border-b border-[#dadada]`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- SIGUE EXPLORANDO
- **H2** Otros servicios que pueden ayudarte
- SISTEMAS
- **H3** Integración de APIs y Servicios Externos
- Deja de copiar datos de un programa a otro
- **Link** «Ver servicio →» → `/services/apis`
- SOFTWARE
- **H3** Desarrollo a medida
- Tu empresa no debería tener que adaptarse a un software que no le funciona
- **Link** «Ver servicio →» → `/services/custom-software`
- ESTRATEGIA
- **H3** Consultoría técnica
- Decide cómo construir tu proyecto antes de invertir en construirlo
- **Link** «Ver servicio →» → `/services/consulting`


## Consultoría Técnica

**Pantalla Stitch:** `GussWare - Servicio: Consultoría técnica`  
**Archivo:** `html/consultoria.html`

### HERO

- **Contenedor:** `bg-white pt-10 pb-24 border-b border-brand-line`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`

- **Link** «Inicio» → `/`
- /
- **Link** «Servicios» → `/services`
- /
- Consultoría técnica
- CONSULTORÍA TÉCNICA — ESTRATEGIA Y ARQUITECTURA
- **H1** Decide cómo construir tu proyecto antes de invertir en construirlo
- No necesitas conocer todas las tecnologías para iniciar un proyecto. Te ayudamos a definir qué necesitas, elegir las herramientas adecuadas y establecer prioridades. Al terminar, tendrás una ruta técnica documentada que podrás utilizar con tu equipo de desarrollo.
- **Link** «Hablemos de tu idea» → `/contact`
- **Link** «Ver soluciones ↓» → `#soluciones`
- 01
- **H2** Menos improvisación
- Decisiones tomadas antes de programar
- 02
- **H2** Inversión mejor dirigida
- Prioridades alineadas con tus objetivos
- 03
- **H2** Un plan ejecutable
- Tu equipo sabe qué construir y por qué

### PROBLEMA

- **Contenedor:** `bg-white py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16` · `grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-brand-line items-baseline`

- 01 — EL PROBLEMA
- **H2** Evita decisiones que después cuestan tiempo y dinero
- Empezar a desarrollar sin tener claro qué se necesita puede llevar a elegir herramientas inadecuadas, construir funciones que nadie utiliza o tener que rehacer partes del sistema.
- 01
- No sabes qué construir primero ni qué herramientas elegir.
- 02
- Eliges tecnología sin comparar alternativas y después cuesta cambiarla.
- 03
- Ya tienes un sistema y no sabes si conviene mejorarlo, cambiarlo o conservarlo.
- Estrategia técnica · Arquitectura · Elección de tecnología · Planificación · Documentación · Asesoría técnica

### SOLUCIONES

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 gap-8 mb-12`

- 02 — QUÉ PUEDES CONTRATAR
- **H2** De una idea a un plan que puedes ejecutar
- Definimos la estructura técnica de tu proyecto y te ayudamos a elegir cómo llevarlo a cabo, desde la primera decisión hasta la planificación del desarrollo.
- 01
- **H3** Arquitectura y estructura del sistema
- Definimos cómo se organiza tu sistema antes de construirlo, para que cada componente tenga una función clara y las partes trabajen en conjunto.
- QUÉ RECIBES
  - Documento de arquitectura explicado en términos claros
  - Mapa de componentes y sus relaciones
  - Decisiones técnicas justificadas y alternativas evaluadas
  - Recomendaciones para ampliar el sistema sin rediseñarlo por completo
- Beneficio
- Una estructura clara antes de escribir la primera línea.
- 02
- **H3** Elección de tecnología y plan de trabajo
- Comparamos las opciones disponibles y definimos una ruta de desarrollo que considere tus objetivos, presupuesto y equipo.
- QUÉ RECIBES
  - Comparativa de tecnologías con ventajas y desventajas
  - Recomendación de herramientas con argumentos claros
  - Plan por etapas con resultados esperados
  - Estimación de esfuerzo para organizar tiempo y presupuesto
  - Esquema de trabajo y seguimiento del proyecto
- Beneficio
- Decisiones justificadas y un plan que tu equipo puede ejecutar.
- **Link** «Hablemos de tu proyecto →» → `/contact`

### PROCESO

- **Contenedor:** `bg-brand-surfaceAlt py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`

- 03 — CÓMO TRABAJAMOS
- **H2** De la incertidumbre a las decisiones claras
- Primero entendemos el problema; después evaluamos las alternativas y documentamos una ruta de trabajo que puedas poner en marcha.
- 01 ETAPA
- **H3** Entender
- Revisamos tus objetivos, necesidades, recursos y sistemas existentes.
- 02 ETAPA
- **H3** Definir
- Proponemos la estructura y las tecnologías, explicando las razones de cada decisión.
- 03 ETAPA
- **H3** Planificar
- Organizamos el desarrollo por etapas, con prioridades, entregables y estimaciones.
- 04 ETAPA
- **H3** Documentar
- Dejamos las decisiones por escrito para que tu equipo pueda consultarlas y ejecutarlas.

### FICHA

- **Contenedor:** `bg-white py-[96px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-brand-line pt-8`

- 04 — MARCO DE TRABAJO
- **H2** Cómo organizamos el proyecto
- Elegimos las herramientas técnicas y la forma de trabajo según la complejidad del proyecto y las necesidades del equipo.
- **H4** Organización del trabajo
- Scrum (trabajo por ciclos) · Kanban (tablero de tareas)
- **H4** Diseño técnico
- Arquitectura de software · Componentes del sistema · Tecnologías
- **H4** Planificación
- Prioridades · Documentación técnica · Estimación

### FAQ

- **Contenedor:** `bg-[#F2F2F2] py-[120px] border-b border-[#DADADA]`

**Eyebrow:** `05 — DUDAS FRECUENTES`

- DUDAS FRECUENTES
- **H2** Lo que suele preguntarse antes de empezar
- **H3** ¿Qué recibo al terminar la consultoría?
- −
- Una propuesta técnica documentada con la estructura recomendada, las tecnologías evaluadas, las decisiones principales y un plan de trabajo para orientar el desarrollo.
- **H3** ¿Puedo contratarla si solo tengo una idea?
- +
- **H3** ¿Pueden trabajar con mi equipo de desarrollo?
- +
- **H3** ¿Tengo que contratar el desarrollo con GussWare?
- +
- **H3** ¿Cuánto cuesta una consultoría técnica?
- +
- **H3** ¿Qué pasa si ya tengo un sistema y necesito mejorarlo?
- +
- **Link** «¿Te queda otra duda? Escríbenos →» → `/contact`

### CTA

- **Contenedor:** `bg-brand-deep text-white py-[120px] border-b border-brand-line relative overflow-hidden`
- **Grids:** `grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`

- 06 — INICIA TU PROYECTO
- **H2** Antes de programar, define el camino correcto
- Cuéntanos qué quieres construir o qué problema necesitas resolver. Te ayudamos a convertirlo en un plan técnico claro.
- **Link** «Cuéntanos tu proyecto» → `/contact`
- **Link** «Ver todos los servicios →» → `/services`
- GUSSWARE · CORE
- ESTRATEGIA TÉCNICA

### RELACIONADOS

- **Contenedor:** `bg-white py-[120px] border-b border-brand-line`
- **Grids:** `grid grid-cols-1 md:grid-cols-3 gap-8`

- SIGUE EXPLORANDO
- **H2** Otros servicios que pueden ayudarte
- SOFTWARE
- **H3** Desarrollo a medida
- Tu empresa no debería tener que adaptarse a un software que no le funciona.
- **Link** «Ver servicio →» → `/services/custom-software`
- WEB & E-COMMERCE
- **H3** Diseño de sitios web y tiendas en línea
- Tu sitio web debe conseguir algo más que verse bien.
- **Link** «Ver servicio →» → `/services/web-development`
- INFRAESTRUCTURA
- **H3** DevOps y Soporte Técnico
- Actualiza tus sistemas sin convertir cada cambio en un riesgo.
- **Link** «Ver servicio →» → `/services/devops`

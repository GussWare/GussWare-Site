# Servicios de GussWare — Versión comercial y visual revisada

**Estado:** propuesta para revisión. No implementada en WordPress, ACF ni Astro.  
**Fecha:** 19 de octubre de 2026.  
**Fuente de contenido:** «Servicios de GussWare — Versión comercial revisada» (v3).  
**Propuesta visual:** proyecto Stitch `2794415955264565177`.  
**Alcance:** contenido comercial, arquitectura de página, auditoría y pendientes. No incluye migración, cambios de campos ni desarrollo.

---

## 0. Resumen para revisión

Este documento convierte la versión comercial v3 en una propuesta completa de contenido y de experiencia para las seis páginas de servicio. Incluye:

- Los textos completos de los seis servicios, ordenados por campo.
- Una propuesta visual en Stitch para las seis páginas, una vista móvil y una referencia en inglés.
- Los cambios editoriales aplicados respecto a v3 y el motivo de cada uno.
- La auditoría de contenido, las contradicciones detectadas y los datos que faltan.
- La matriz de cobertura y la lista de decisiones necesarias antes de implementar.

### Lo que está listo para revisar

1. **Arquitectura visual:** hero de decisión, problema, soluciones contratables, proceso, FAQ, cierre y servicios relacionados. La sección de plataformas se incluye solo en Integración.
2. **Contenido comercial:** las seis páginas tienen título, descripción, tres indicadores, situaciones, soluciones, entregables, proceso, FAQ y CTA.
3. **Propuesta visual:** seis pantallas de escritorio, una móvil y una de referencia en inglés, con el sistema de diseño existente.
4. **Auditoría:** cada servicio tiene un estado por sección y una lista de ajustes.

### Lo que no está listo para implementar

1. La sección de plataformas no existe en el modelo de contenido actual.
2. Los servicios relacionados no tienen criterios ni copy aprobados.
3. Los enlaces de los CTA no están unificados (`/contacto` en el CPT, `/contact` en el sitio).
4. Las traducciones al inglés no están aprobadas.
5. La propiedad del código, la cobertura de soporte y algunas condiciones comerciales siguen pendientes.
6. Las páginas nuevas son más largas que las actuales: entre 6.400 y 7.000 px de escritorio, frente a 5.765–5.880 px de las páginas anteriores. La simplificación es cognitiva, no de longitud.

### Hallazgo principal

La nueva arquitectura **ordena mejor la lectura**, pero **no acorta la página**. Al añadir el bloque de situación, la ficha técnica, las plataformas y los servicios relacionados, la página crece entre un 9 % y un 22 %. Si el objetivo es una página más corta, hay que decidir qué bloques se colapsan o se omiten por servicio. La recomendación está en la sección 3.5.

### Recomendación

Aprobar primero la arquitectura y los cambios editoriales; después resolver los cinco bloqueos P0 de la sección 8; finalmente decidir el modelo de datos de plataformas y servicios relacionados. No conviene importar la v3 a WordPress antes de cerrar esos puntos.

---

## 1. Cómo leer este documento

### 1.1 Leyenda

| Marca | Significado |
|---|---|
| **Completo** | Existe contenido suficiente para diseñar e implementar el bloque. |
| **Requiere ajuste** | Existe contenido, pero necesita una revisión editorial, técnica o comercial. |
| **Pendiente** | Falta información o una confirmación necesaria. |
| **No aplica** | El bloque no aporta valor en ese servicio. |
| **[Visual]** | Propuesta de diseño o de copy de interfaz; no es un campo del CPT. |
| **[Pendiente]** | Requiere aprobación o confirmación antes de implementar. |

### 1.2 Correspondencia con el CPT

Los nombres de campo se indican entre paréntesis para facilitar la futura importación:

- Identificación: `title`, `excerpt`, `content`.
- Intro: `intro_eyebrow`, `intro_eyebrow_suffix`, `intro_title`, `intro_description`.
- Hero: `hero_stats[]` con `label` y `value`.
- Desarrollo: `development_title`, `development_content`, `development_tags[]`.
- Soluciones: `solutions_eyebrow`, `solutions_title`, `solutions_description`, `solutions[]` con `title`, `description`, `features[]`, `link`.
- Proceso: `approach_title`, `approach_description`, `approach[]`.
- Tecnologías: `tech_title`, `tech_description`, `tech_groups[]`.
- FAQ: `faq_items[]`.
- CTA: `cta` con `title`, `description`, `button_text`, `button_url`.

### 1.3 Importante sobre el estado actual

El CPT contiene hoy la **versión anterior** (v1), no la v3. Por ejemplo: los `hero_stats`, los CTA y varias FAQ son distintos; hay servicios con 4 o 5 FAQ y con 2 soluciones. Este documento es la fuente para una futura importación; **no se ha ejecutado ninguna migración**. La comparación entre el CPT actual y esta propuesta está en la sección 6.

---

## 2. Propuesta visual en Stitch

### 2.1 Pantallas finales

Usar las pantallas de la columna «ID final». Las pantallas anteriores de Integración, Consultoría y Web fueron corregidas y quedaron reemplazadas.

| # | Servicio | ID final | Tamaño Stitch | CSS (ancho × alto) | Propósito |
|---|---|---|---|---|---|
| 01 | Integración de APIs y Servicios Externos | `301aaea6b79847dcb2fd70df9ff677dc` | 2560 × 14050 | 1280 × 7025 | Página completa con plataformas y bloque «¿No encuentras tu plataforma?». |
| 02 | Diseño de sitios web y tiendas en línea | `06bbfa957c6d496285c89e797f5aeb95` | 2560 × 13384 | 1280 × 6692 | Página completa con tres soluciones; logo corregido. |
| 03 | Aplicaciones móviles | `d80ea269aed94df9810882dbbd7ebd39` | 2560 × 12964 | 1280 × 6421 | Página completa con dos soluciones. |
| 04 | Desarrollo a medida | `e8314b8d5ac5485eadc9209453f15f0e` | 2560 × 13704 | 1280 × 6852 | Página completa con tres soluciones. |
| 05 | DevOps y Soporte Técnico | `0b0e3037b4294fa0a0a48f498b28e788` | 2560 × 13480 | 1280 × 6734 | Página completa con ficha de operación. |
| 06 | Consultoría técnica | `19c8bd0843254c43b7ecd7f43ff46ec4` | 2560 × 12884 | 1280 × 6422 | Página completa con dos soluciones; FAQ corregida. |
| 07 | Integración — móvil | `213eacb3651a47499c44226bd65c0888` | 2560 × 11830 | 390 × 7213 | Referencia móvil: acordeones, plataformas 3 + «Ver las 6» y CTA sticky. |
| 08 | Web — referencia en inglés | `646488d5e44c4e5684248453da4f65ff` | 2560 × 12610 | 1280 × 6265 | Prueba de longitudes en inglés; no es contenido aprobado. |

Pantallas reemplazadas que no deben usarse: `0c907b25b7374f80b007807d7fd86065`, `d4e42c5b039040b9bee9ed49a5427056` (Integración); `022fe1353654410281e81feedcb43ef0` (Consultoría); `5c0ad770cb8049809f22a370b7efe4d8` (Web).

### 2.2 Sistema visual

Se reutiliza el sistema **Human-Tech Professional** del proyecto:

- Source Sans 3 como única familia.
- Azul primario `#004A98`, azul profundo `#00346E`, azul secundario `#2164A6`.
- Naranja `#FF5000` reservado para los CTA principales.
- Superficies blanca y `#F2F2F2`; tinta `#242126`; texto secundario `#5C6068`.
- Radio 0, sin degradados, sin sombras y sin tarjetas redondeadas.
- Contenedor de 1280 px, padding vertical de 120 px, retícula asimétrica de 12 columnas.
- Numeración editorial y reglas de 1 px como recursos de orientación.

### 2.3 Qué demuestra la propuesta

- El mismo sistema funciona con dos o tres soluciones, con o sin plataformas y con o sin ficha técnica.
- La jerarquía de CTA es clara: un botón naranja en el hero y otro en el cierre; los CTA intermedios son enlaces de texto.
- La sección de plataformas se entiende como **ejemplos consultables**, no como alianzas ni integraciones ya disponibles.
- La vista móvil usa acordeones para soluciones, plataformas y FAQ, y una barra sticky.
- La referencia en inglés permite comprobar que la composición no depende de la longitud del español.

### 2.4 Qué no demuestra

- La unión real con WordPress, ACF, Polylang, rutas, analítica o rendimiento.
- La existencia de logotipos, casos, testimonios o alianzas.
- La versión móvil definitiva a 390 px: la pantalla de Stitch es fluida y se validó aparte con una captura a 390 px.
- El footer y la navegación definitivos: son un marcador de posición.

### 2.5 Correcciones y observaciones de la propuesta visual

| Observación | Acción |
|---|---|
| La FAQ de Consultoría había inventado respuestas para las preguntas cerradas, incluida una afirmación de propiedad del código. | Se reemplazaron por los textos exactos de v3. Usar la pantalla `19c8bd…`. |
| El footer de Integración incluía «Ciudad de México» y la página «Seguridad de la Información». | Se retiraron; los enlaces legales restantes son marcadores de posición. Usar la pantalla `301aaea…`. |
| El logo de Web se renderizaba diminuto por un `viewBox` incorrecto. | Se reemplazó por el logo estándar. Usar la pantalla `06bbfa…`. |
| El mock de Integración dice «Microsoft 365 … con tu CRM». | En el contenido se corrige a «con otros sistemas». |
| El mock de Integración usa «Nuestras soluciones»; las otras cinco usan «Qué puedes contratar». | Este documento propone «Qué puedes contratar» para las seis; el CPT actual dice «Nuestras soluciones». Unificar en la implementación. |
| Los breadcrumbs y el CTA del header alternan mayúsculas y sentence case entre pantallas. | Unificar con el componente real del sitio. |
| En Móviles y DevOps el paso 04 del proceso tiene acento naranja y puede parecer un estado activo. | Usar el mismo tratamiento para los cuatro pasos o acentuar la línea de secuencia, no un paso. No agregar hover ni clic. En las otras cuatro pantallas, el 04 usa el mismo azul que los pasos anteriores. |
| En la vista móvil, el CTA sticky aparece al mismo tiempo que el CTA del hero. | Mostrarlo solo cuando el CTA del hero salga del viewport. |
| El footer de los mocks usa «DevOps e infraestructura» y una línea en inglés. | No copiarlo: reutilizar el footer global de producción. |
| La referencia en inglés duplica el micro-copy «Still have a question?». | Es un defecto del mock; no afecta la prueba de longitudes. |

---

## 3. Arquitectura de página y variaciones

### 3.1 Secuencia de referencia

1. Header y navegación.
2. Hero con título, descripción, CTA principal y tres indicadores.
3. «¿Te pasa esto?» con situaciones concretas.
4. «Qué puedes contratar» con soluciones y entregables.
5. Plataformas, solo cuando aporta valor.
6. «Cómo trabajamos» con cuatro pasos.
7. Ficha técnica discreta, cuando aporta valor.
8. Preguntas frecuentes.
9. CTA final.
10. Servicios relacionados.
11. Footer.

### 3.2 Variaciones por servicio

| Servicio | Soluciones | Plataformas | Ficha técnica | Motivo |
|---|---:|---|---|---|
| Consultoría técnica | 2 | No | Sí: «Marco de trabajo» | Solo existen dos caminos de contratación; la ficha explica cómo se organiza el proyecto. |
| Diseño web y tiendas | 3 | No | Sí: «Ficha del proyecto» | Tres tipos de solución; la ficha técnica es secundaria y puede colapsarse. |
| Aplicaciones móviles | 2 | No | Sí: «Enfoque técnico» | Dos caminos reales (una plataforma o ambas); no se inventa un tercero. |
| Desarrollo a medida | 3 | No | Sí: «Capacidades del sistema» | Tres tipos de solución; la ficha ayuda al evaluador técnico. |
| DevOps y Soporte Técnico | 3 | No | Sí: «Qué cubrimos» | La ficha explica el alcance operativo; es más importante que en otros servicios. |
| Integración de APIs | 3 | Sí: 6 ejemplos + bloque de consulta | No | Las plataformas sustituyen al grupo técnico «Sistemas»; «Comunicación» y «Control de datos» se integran en soluciones y FAQ. |

### 3.3 Por qué las plataformas no se copian a los otros cinco servicios

- **Web:** el servicio diseña el sitio o la tienda; el catálogo de SAP, Salesforce o Zoho confunde la oferta. Si hay una necesidad de integración, se enlaza al servicio de Integración.
- **Móviles:** la conversación es sobre la app y el dispositivo, no sobre plataformas empresariales.
- **Desarrollo a medida:** la integración con sistemas existentes ya aparece en las soluciones; el catálogo se reserva para el servicio especializado.
- **DevOps:** las plataformas relevantes son infraestructura, no CRM o ERP; el bloque «Qué cubrimos» cumple esa función.
- **Consultoría:** el valor está en la decisión técnica, no en un catálogo de plataformas.

### 3.4 Longitud observada

| Página | Alto CSS | Comparación |
|---|---:|---|
| Integración | 7025 px | +21,8 % frente a la página anterior de API (5765 px) |
| Web | 6692 px | +13,8 % frente a la página anterior de Web (5880 px) |
| A medida | 6852 px | — |
| DevOps | 6734 px | — |
| Móviles | 6421 px | — |
| Consultoría | 6422 px | — |
| Integración móvil (390 px) | 7213 px | ≈ 8,5 pantallas de 844 px |
| Web en inglés | 6265 px | — |

La página anterior de API medía 5765 px y la de Web 5880 px. La propuesta actual es más clara, pero **más larga**. Los principales responsables son: el bloque de situación (≈ 600 px), la ficha técnica (≈ 350–450 px), las plataformas (≈ 1000 px en Integración) y los servicios relacionados (≈ 600 px).

### 3.5 Opciones para controlar la longitud

| Opción | Ahorro aproximado | Efecto |
|---|---:|---|
| Omitir la ficha técnica en Web y Móviles | 350–450 px | No se pierde contenido comercial; el detalle técnico queda en las soluciones. |
| Convertir la ficha técnica en `<details>` en Consultoría, A medida y DevOps | 250–350 px cerrada | Mantiene el detalle para el evaluador técnico sin dominar la lectura. |
| Mostrar 3 plataformas + «Ver las 6» en escritorio | 350–450 px | Ya se usa en móvil; reduce la carga visual y conserva el acceso. |
| Compactar servicios relacionados a una fila de enlaces | 250–350 px | Menos descubrimiento, pero cierre más rápido. |
| Acortar la introducción del problema y las descripciones de soluciones | 150–300 px | Requiere edición fina; no elimina información esencial. |

**Recomendación:** no forzar todos los bloques en todas las páginas. La ficha técnica es el primer candidato a colapsar u omitir en Web y Móviles; las plataformas se quedan solo en Integración y pueden mostrar 3 + «Ver las 6»; los relacionados se mantienen en tres tarjetas compactas. Si se busca una página cercana a 6.000 px, hay que aplicar al menos dos opciones en las páginas de 6.400 px y tres en Integración; el ahorro exacto depende del contenido.

---

## 4. Cambios editoriales respecto a v3

| Servicio | Campo | Texto v3 | Texto propuesto | Motivo | Estado |
|---|---|---|---|---|---|
| Móviles | Hero stat 1 | «Dos plataformas · Llega a usuarios de iPhone y Android» | «La plataforma adecuada · iOS, Android o ambas según lo que necesitas» | Contradice la Solución 01, que plantea una sola plataforma. La nueva frase cubre ambos caminos. | Requiere aprobación |
| Móviles | Hero stat 3 | «Prueba antes de publicar · Revisa la aplicación durante el desarrollo» | «Base para crecer · Preparada para nuevas funciones y actualizaciones» | Duplica la FAQ 3. La nueva frase aporta un beneficio distinto y verificable. | Requiere aprobación |
| DevOps | Hero stat 1 | «Cambios controlados · Publicaciones con validaciones y opción de reversión» | «Cambios controlados · Publicaciones con validaciones y reversión cuando sea posible» | No todas las arquitecturas permiten revertir; se evita una promesa absoluta. | Requiere aprobación |
| DevOps | Solución 01, entregable | «Procedimiento de reversión para recuperar una versión anterior» | «Procedimiento de reversión cuando la arquitectura lo permita» | Misma razón: la reversión depende de la configuración y del sistema. | Requiere aprobación |
| Web | Solución 01, entregable | «Configuración de títulos, descripciones y estructura para facilitar la indexación en Google» | «Estructura y metadatos preparados para que los buscadores entiendan el sitio» | Evita sugerir una garantía de indexación o posicionamiento; la FAQ ya aclara que no se garantiza. | Requiere aprobación |
| Web | FAQ 3 | «…para facilitar la indexación y configurar elementos básicos de SEO…» | «…para que los buscadores puedan encontrar y entender su contenido…» | Lenguaje más claro para compradores no técnicos; conserva la precisión. | Requiere aprobación |
| Consultoría | Technologies | «Diseño técnico: Arquitectura de software · Componentes del sistema»; «Planificación: Tecnologías · Prioridades · Documentación técnica» | «Diseño técnico: Arquitectura de software · Componentes del sistema · Tecnologías»; «Planificación: Prioridades · Documentación técnica · Estimación» | «Tecnologías» es una decisión de diseño, no de planificación; «Estimación» ya existe en la solución y en el proceso. | Requiere aprobación |
| DevOps | Tags y Technologies | «Monitorización» | «Monitoreo» | Español de México; el término anterior es más frecuente en España. | Requiere aprobación |
| Todos | Eyebrow de soluciones | «Nuestras soluciones» | «Qué puedes contratar» | Etiqueta más comercial y coherente con la arquitectura; la propuesta visual ya la usa en cinco páginas. | Requiere aprobación |
| Todos | Soluciones | La descripción no separa explícitamente el beneficio | Se conserva la descripción y se añade un **beneficio visual** derivado | Permite que la tarjeta distinga problema, oferta, entregables y beneficio sin inventar un problema nuevo. | [Visual] |
| Todos | Development | Un párrafo con varias ideas | Se conserva el párrafo y se proponen **tres situaciones** derivadas | Hace escaneable el bloque «¿Te pasa esto?» sin crear un campo nuevo. | [Visual] |
| Integración | Nueva sección | No existe | Seis plataformas de ejemplo + bloque «¿No encuentras tu plataforma?» | Responde a la necesidad comercial de mostrar ejemplos sin afirmar alianzas. | [Visual] / Pendiente |
| Todos | Servicios relacionados | No existe | Bloque de tres tarjetas + copy de interfaz | Cierra la página y ofrece el siguiente paso. | [Visual] / Pendiente |
| Todos | Hero CTA | No existe un CTA propio del hero | Etiqueta distinta del CTA final | Evita dos botones idénticos y mejora la jerarquía. | [Visual] |
| Todos | CTA URL | `/contacto` en el CPT | `/contact` (ES) y `/en/contact` (EN) | Es la ruta canónica del sitio; `/contacto` funciona por redirección. | Requiere unificación |

### 4.1 Corrección importante sobre v3

La nota «Criterios aplicados» de v3 dice que hay **tres soluciones para todos los servicios excepto Consultoría**. Sin embargo, **Aplicaciones móviles tiene dos soluciones** en el propio documento v3. La propuesta conserva dos porque el contenido define dos caminos reales; **no se inventa una tercera**.

### 4.2 Lo que no se añadió

No se añadieron testimonios, clientes, logotipos, certificaciones, cifras de resultados, años de experiencia, alianzas, precios ni casos de éxito. Las únicas cifras son las de la interfaz (01, 02, 03), no promesas comerciales.

---

## 5. Los seis servicios

> **Contrato de tarjeta de solución:** el título dice qué se ofrece; la descripción dice qué problema resuelve y qué se ofrece; «Qué recibes» contiene los entregables; «Beneficio» es una frase visual derivada del texto. El beneficio no es un campo del CPT: si se quiere separar, requiere un subcampo o una reescritura de la descripción. No se muestran botones por tarjeta porque no hay páginas de solución ni destinos confirmados.

---

## 5.1 Consultoría técnica

### Identificación

- **Nombre:** Consultoría técnica.
- **Título de WordPress:** Consultoría técnica.
- **Slug:** `consultoria-tecnica` (confirmado en el lote de importación; verificar en el CPT).
- **Categoría:** Consultoría (confirmada en el lote; verificar en REST).
- **Extracto:** Convierte tu idea en un plan técnico claro antes de invertir en desarrollo: qué construir, qué herramientas utilizar y qué resolver primero.
- **Contenido:** Te ayudamos a tomar las decisiones que definen el rumbo de tu proyecto antes de comenzar a programar. Analizamos tus necesidades, evaluamos las alternativas y organizamos el trabajo para que sepas qué necesitas, por qué y cómo avanzar sin gastar tiempo y dinero en decisiones equivocadas.

**Nota:** el extracto y el contenido son texto editorial para listado/SEO; la plantilla actual no los renderiza y el endpoint de servicio no los expone. Ver sección 6.3.

### Intro

- **Eyebrow:** Consultoría técnica.
- **Suffix:** Estrategia y arquitectura.
- **Título:** Decide cómo construir tu proyecto antes de invertir en construirlo.
- **Descripción:** No necesitas conocer todas las tecnologías para iniciar un proyecto. Te ayudamos a definir qué necesitas, elegir las herramientas adecuadas y establecer prioridades. Al terminar, tendrás una ruta técnica documentada que podrás utilizar con tu equipo de desarrollo.

### Hero Stats

1. **Menos improvisación** · Decisiones tomadas antes de programar.
2. **Inversión mejor dirigida** · Prioridades alineadas con tus objetivos.
3. **Un plan ejecutable** · Tu equipo sabe qué construir y por qué.

*El diseño añade 01/02/03 como recurso visual; no son parte del campo.*

### Development

- **Título:** Evita decisiones que después cuestan tiempo y dinero.
- **Contenido:** Empezar a desarrollar sin tener claro qué se necesita puede llevar a elegir herramientas inadecuadas, construir funciones que nadie utiliza o tener que rehacer partes del sistema. Analizamos tu proyecto antes de que esos problemas se conviertan en costos. Si ya tienes un sistema en funcionamiento, también podemos revisar su estructura y ayudarte a decidir qué conviene mejorar, cambiar o conservar.
- **Tags:** Estrategia técnica · Arquitectura · Elección de tecnología · Planificación · Documentación · Asesoría técnica.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **No sabes qué construir primero ni qué herramientas elegir.**  
   *Origen: «Empezar a desarrollar sin tener claro qué se necesita» + «elegir herramientas inadecuadas».*
2. **Eliges tecnología sin comparar alternativas y después cuesta cambiarla.**  
   *Origen: «elegir herramientas inadecuadas» + «tener que rehacer partes del sistema».*
3. **Ya tienes un sistema y no sabes si conviene mejorarlo, cambiarlo o conservarlo.**  
   *Origen: la última frase del contenido.*

No son problemas nuevos: son la división visual del contenido de Development. Si se aprueba, la implementación puede reescribir `development_content` en tres párrafos; la plantilla ya divide por saltos de línea. Requiere aprobación porque cambia el texto del campo.

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** De una idea a un plan que puedes ejecutar.
- **Descripción:** Definimos la estructura técnica de tu proyecto y te ayudamos a elegir cómo llevarlo a cabo, desde la primera decisión hasta la planificación del desarrollo.

#### Solución 01 — Arquitectura y estructura del sistema

- **Qué resuelve y qué ofrece:** Definimos cómo se organiza tu sistema antes de construirlo, para que cada componente tenga una función clara y las partes trabajen en conjunto.
- **Qué recibes:**
  - Documento de arquitectura explicado en términos claros.
  - Mapa de componentes y sus relaciones.
  - Decisiones técnicas justificadas y alternativas evaluadas.
  - Recomendaciones para ampliar el sistema sin rediseñarlo por completo.
- **Beneficio [Visual]:** Una estructura clara antes de escribir la primera línea.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Elección de tecnología y plan de trabajo

- **Qué resuelve y qué ofrece:** Comparamos las opciones disponibles y definimos una ruta de desarrollo que considere tus objetivos, presupuesto y equipo.
- **Qué recibes:**
  - Comparativa de tecnologías con ventajas y desventajas.
  - Recomendación de herramientas con argumentos claros.
  - Plan por etapas con resultados esperados.
  - Estimación de esfuerzo para organizar tiempo y presupuesto.
  - Esquema de trabajo y seguimiento del proyecto.
- **Beneficio [Visual]:** Decisiones justificadas y un plan que tu equipo puede ejecutar.
- **Enlace:** No definido. No se muestra botón.

**Nota:** solo hay dos soluciones. No se inventa una tercera para igualar a los demás servicios.

### Approach

- **Título:** De la incertidumbre a las decisiones claras.
- **Descripción:** Primero entendemos el problema; después evaluamos las alternativas y documentamos una ruta de trabajo que puedas poner en marcha.
- **Entender:** Revisamos tus objetivos, necesidades, recursos y sistemas existentes.
- **Definir:** Proponemos la estructura y las tecnologías, explicando las razones de cada decisión.
- **Planificar:** Organizamos el desarrollo por etapas, con prioridades, entregables y estimaciones.
- **Documentar:** Dejamos las decisiones por escrito para que tu equipo pueda consultarlas y ejecutarlas.

### Technologies

- **Título:** Cómo organizamos el proyecto.
- **Descripción:** Elegimos las herramientas técnicas y la forma de trabajo según la complejidad del proyecto y las necesidades del equipo.
- **Organización del trabajo:** Scrum (trabajo por ciclos) · Kanban (tablero de tareas).
- **Diseño técnico:** Arquitectura de software · Componentes del sistema · Tecnologías.
- **Planificación:** Prioridades · Documentación técnica · Estimación.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Organización del trabajo | Ficha secundaria de tres columnas, después de «Cómo trabajamos». | Explica el marco de trabajo sin competir con las soluciones. |
| Diseño técnico | Se conserva y se mueve «Tecnologías» aquí. | Es una decisión de diseño, no una tarea de planificación. |
| Planificación | Se conserva; se añade «Estimación» y se retira «Tecnologías». | Evita duplicación; la estimación ya aparece en la solución 02 y en el proceso. |

### FAQ

1. **¿Qué recibo al terminar la consultoría?**  
   Una propuesta técnica documentada con la estructura recomendada, las tecnologías evaluadas, las decisiones principales y un plan de trabajo para orientar el desarrollo.
2. **¿Puedo contratarla si solo tengo una idea?**  
   Sí. Partimos del problema que quieres resolver y te ayudamos a convertirlo en requerimientos, prioridades y una primera ruta de trabajo.
3. **¿Pueden trabajar con mi equipo de desarrollo?**  
   Sí. Podemos colaborar con tu equipo actual o con otro proveedor para orientar las decisiones técnicas y resolver dudas durante la planificación.
4. **¿Tengo que contratar el desarrollo con GussWare?**  
   No. Puedes utilizar el plan con el equipo que elijas. Si decides continuar con nosotros, ya contaremos con una base definida.
5. **¿Cuánto cuesta una consultoría técnica?**  
   Depende de la complejidad del proyecto y del análisis necesario. Revisamos tus necesidades y te presentamos una propuesta económica antes de iniciar.
6. **¿Qué pasa si ya tengo un sistema y necesito mejorarlo?**  
   Revisamos su situación actual, identificamos oportunidades de mejora y definimos qué conviene conservar, corregir o ampliar.

### CTA

- **Título:** Antes de programar, define el camino correcto.
- **Descripción:** Cuéntanos qué quieres construir o qué problema necesitas resolver. Te ayudamos a convertirlo en un plan técnico claro.
- **Botón:** Cuéntanos tu proyecto.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Hablemos de tu idea.
- **Enlaces intermedios [Visual]:** «Hablemos de tu proyecto →» después de soluciones; «¿Te queda otra duda? Escríbenos →» después de FAQ. Son enlaces de texto, no botones.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

**Servicios relacionados [Visual]**

- Eyebrow: Sigue explorando.
- Título: Otros servicios que pueden ayudarte.
- Descripción: Cada proyecto necesita una combinación distinta. Estos servicios pueden complementar lo que buscas.
- Tarjetas:
  - Desarrollo a medida — Tu empresa no debería tener que adaptarse a un software que no le funciona.
  - Diseño de sitios web y tiendas en línea — Tu sitio web debe conseguir algo más que verse bien.
  - DevOps y Soporte Técnico — Actualiza tus sistemas sin convertir cada cambio en un riesgo.
- CTA: Ver todos los servicios → (`/servicios`).

**Nota:** la selección y el copy son una propuesta; los criterios están pendientes (sección 6.3).

### Notas de contenido y auditoría

- **Completo:** identificación, intro, hero, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** la reorganización de Technologies; el cambio de «Monitorización» no aplica aquí; la implementación de las tres situaciones.
- **Pendiente:** en v3 el sufijo solo está definido para Consultoría; los otros cinco servicios no lo tienen. El CPT actual lo tiene vacío en los seis; la importación debe añadirlo aquí.
- **Contradicciones:** no se detectaron en el contenido comercial. La nota de v3 sobre «tres soluciones para los demás» no afecta a Consultoría, que tiene dos.
- **Estado en el CPT:** la versión actual tiene 2 soluciones, 4 FAQ y `hero_stats` distintos; la importación de v3 los actualizará.

---

## 5.2 Diseño de sitios web y tiendas en línea

### Identificación

- **Nombre:** Diseño de sitios web y tiendas en línea.
- **Título de WordPress:** Diseño de sitios web y tiendas en línea.  
  **Actual en el CPT:** «Diseño de sitios web y E-commerce». Unificar.
- **Slug:** `diseno-sitios-web-tiendas-en-linea` (confirmado en el lote).
- **Categoría:** Desarrollo web (confirmada en el lote).
- **Extracto:** Diseñamos sitios web y tiendas en línea para que tus clientes encuentren lo que buscan, entiendan lo que ofreces y puedan comprar o contactarte fácilmente.
- **Contenido:** Creamos sitios web, tiendas en línea y plataformas digitales que responden a los objetivos de tu negocio. Combinamos diseño, facilidad de uso y desarrollo técnico para que tu presencia digital sea clara para tus clientes, funcione en celulares y computadoras y pueda evolucionar conforme cambien tus necesidades.

### Intro

- **Eyebrow:** Diseño y desarrollo web.
- **Suffix:** No definido en v3; el campo está vacío. La propuesta visual no muestra sufijo.
- **Título:** Tu sitio web debe conseguir algo más que verse bien.
- **Descripción:** Una página confusa puede hacer que un cliente se vaya antes de conocer tus servicios. Diseñamos sitios y tiendas que explican lo que ofreces, facilitan el contacto o la compra y ofrecen una experiencia clara desde el celular hasta la computadora.

### Hero Stats

1. **Más oportunidades** · Tus visitantes entienden qué ofreces.
2. **Compra sin complicaciones** · Menos obstáculos para contactar o pagar.
3. **Listo para evolucionar** · Agrega contenido y funciones conforme crezcas.

### Development

- **Título:** Que tus visitantes encuentren lo que necesitan y sepan qué hacer.
- **Contenido:** Si una persona entra a tu sitio y no entiende qué vendes, cómo funciona tu servicio o dónde comprar, es probable que busque otra opción. Por eso organizamos los contenidos y las funciones a partir de lo que tus visitantes necesitan hacer. Diseñamos la experiencia, desarrollamos el sitio y cuidamos aspectos como la adaptación a celulares, el rendimiento y la facilidad de administración.
- **Tags:** Diseño web · Desarrollo web · Tiendas en línea · Experiencia de usuario · Diseño adaptable · Plataformas digitales.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **Tu visitante no entiende qué ofreces ni por qué elegirte.**  
   *Origen: «no entiende qué vendes, cómo funciona tu servicio».*
2. **No encuentra cómo contactarte, cotizar o comprar.**  
   *Origen: «dónde comprar» + «facilitan el contacto o la compra».*
3. **El sitio no se ve bien en el celular o es difícil de actualizar.**  
   *Origen: «adaptación a celulares, el rendimiento y la facilidad de administración».*

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** Una solución digital para cada objetivo.
- **Descripción:** Desde presentar tu negocio hasta vender por internet o digitalizar procesos, desarrollamos la solución que necesitas para atender mejor a tus clientes.

#### Solución 01 — Sitios web que presentan tu negocio

- **Qué resuelve y qué ofrece:** Haz que tus visitantes entiendan qué haces, por qué elegirte y cómo ponerse en contacto contigo.
- **Qué recibes:**
  - Diseño personalizado alineado con la identidad de tu marca.
  - Secciones y contenidos organizados para facilitar la consulta.
  - Diseño adaptable a celulares, tabletas y computadoras.
  - Estructura y metadatos preparados para que los buscadores entiendan el sitio.
  - Panel de administración para actualizar textos e imágenes.
- **Beneficio [Visual]:** Una presencia clara que genera confianza y contactos.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Tiendas en línea que facilitan la compra

- **Qué resuelve y qué ofrece:** Permite que tus clientes consulten productos, elijan lo que necesitan y realicen sus pedidos desde tu tienda.
- **Qué recibes:**
  - Catálogo de productos con categorías y búsqueda.
  - Carrito y proceso de compra organizado en pasos claros.
  - Integración de métodos de pago y opciones de envío.
  - Experiencia de compra adaptada a celulares.
  - Panel para administrar productos, precios y pedidos.
- **Beneficio [Visual]:** Menos fricción para comprar y más control de tu operación.
- **Enlace:** No definido. No se muestra botón.

#### Solución 03 — Plataformas digitales para tu operación

- **Qué resuelve y qué ofrece:** Cuando necesitas más que una página, desarrollamos plataformas para administrar información, atender clientes o resolver procesos específicos.
- **Qué recibes:**
  - Funciones adaptadas a los procesos de tu negocio.
  - Usuarios y permisos para organizar el acceso.
  - Integración con las herramientas que utilizas.
  - Paneles para consultar y administrar información.
  - Estructura preparada para incorporar nuevas funciones.
- **Beneficio [Visual]:** Una herramienta propia para operar, no solo para presentar.
- **Enlace:** No definido. No se muestra botón.

**Nota:** el CPT actual tiene dos soluciones y enlaces «Conoce más» que apuntan a `/contacto`. La v3 define tres soluciones; la importación debe añadir la tercera y **retirar los botones por tarjeta**, porque `/contacto` no es una página de solución.

### Approach

- **Título:** Del diseño a un sitio que cumple su propósito.
- **Descripción:** Trabajamos por etapas para validar la propuesta, desarrollar las funciones y revisar el resultado antes de publicarlo.
- **Entender:** Definimos qué quieres conseguir, quién visitará el sitio y qué necesita encontrar.
- **Diseñar:** Organizamos los contenidos y las pantallas, y revisamos contigo la propuesta visual.
- **Desarrollar:** Construimos el sitio, probamos sus funciones y verificamos su adaptación a diferentes dispositivos.
- **Publicar y mejorar:** Preparamos el lanzamiento y definimos oportunidades de mejora a partir de las necesidades del negocio.

### Technologies

- **Título:** Qué incluye la solución web.
- **Descripción:** Seleccionamos las herramientas según el tipo de sitio, las funciones necesarias y la forma en que administrarás los contenidos.
- **Tipo de solución:** Sitios web · Tiendas en línea · Plataformas a medida.
- **Experiencia de uso:** Diseño personalizado · Adaptación a celulares · Navegación clara.
- **Base técnica:** Gestión de contenidos · Integraciones · Rendimiento y mantenimiento.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Tipo de solución | Ficha secundaria «Ficha del proyecto», después de «Cómo trabajamos». | Es un resumen; las soluciones ya lo explican. Se puede omitir si se busca acortar. |
| Experiencia de uso | Ficha secundaria. | Refuerza el diseño y la adaptación; no necesita una sección propia. |
| Base técnica | Ficha secundaria; es el grupo que más aporta al evaluador técnico. | Da confianza sin convertir la página en una lista de tecnologías. |

**Recomendación:** si la página debe bajar de 6.000 px, convertir esta ficha en un `<details>` o dejar solo «Base técnica». No eliminar el contenido del CPT sin aprobación.

### FAQ

1. **¿Cuánto tarda el desarrollo de mi sitio web?**  
   Depende del tamaño, los contenidos y las funciones. Antes de iniciar definimos las etapas y los tiempos estimados con base en los requerimientos del proyecto.
2. **¿Podré actualizar el sitio sin ayuda técnica?**  
   Sí, podemos incluir un panel para que administres textos, imágenes, productos y otros contenidos sin modificar el código.
3. **¿Mi sitio aparecerá en Google?**  
   Podemos preparar la estructura técnica del sitio y configurar elementos básicos de SEO para que los buscadores puedan encontrar y entender su contenido. La posición en los resultados depende de distintos factores y no se puede garantizar.
4. **¿Podré agregar funciones después?**  
   Sí. Podemos planificar nuevas funciones conforme cambien tus necesidades, evaluando su costo y compatibilidad con la solución existente.
5. **¿Pueden conectar el sitio con mi sistema de facturación o inventario?**  
   Sí, si las herramientas ofrecen mecanismos compatibles. Revisamos los sistemas involucrados para definir cómo intercambiar la información.
6. **¿Cuánto cuesta desarrollar un sitio web o una tienda?**  
   Depende del diseño, la cantidad de contenidos, las funciones y las integraciones. Revisamos el alcance y te presentamos una propuesta económica antes de comenzar.

### CTA

- **Título:** Convierte tu presencia digital en una herramienta para tu negocio.
- **Descripción:** Cuéntanos qué vendes, qué servicios ofreces y qué quieres que tus visitantes hagan en tu sitio. Definiremos contigo la mejor forma de llevarlo a internet.
- **Botón:** Diseñemos tu sitio web.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Cuéntanos tu proyecto.
- **Enlaces intermedios [Visual]:** «Hablemos de tu proyecto →» después de soluciones; «¿Te queda otra duda? Escríbenos →» después de FAQ.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

**Servicios relacionados [Visual]**

- Aplicaciones móviles — Una aplicación que resuelve una necesidad desde el celular.
- Desarrollo a medida — Tu empresa no debería tener que adaptarse a un software que no le funciona.
- Integración de APIs y Servicios Externos — Deja de copiar datos de un programa a otro.

**Plataformas:** no aplica. El catálogo pertenece al servicio de Integración; si el sitio o la tienda necesita una conexión, se enlaza a ese servicio.

### Notas de contenido y auditoría

- **Completo:** identificación, intro, hero, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** el título del CPT («E-commerce» vs. «tiendas en línea»); la ficha técnica; el cambio de indexación; la importación de la tercera solución.
- **Pendiente:** el sufijo no existe en v3; no se muestra. Los enlaces de solución no están definidos.
- **Contradicción resuelta:** «facilitar la indexación» frente a la FAQ que dice que no se puede garantizar. Se suavizó la promesa.
- **Estado en el CPT:** 2 soluciones, 5 FAQ, enlaces «Conoce más» a `/contacto`, `hero_stats` distintos. La importación de v3 actualizará todo.

---

## 5.3 Aplicaciones móviles

### Identificación

- **Nombre:** Aplicaciones móviles.
- **Título de WordPress:** Aplicaciones móviles.
- **Slug:** `aplicaciones-moviles` (confirmado en el lote).
- **Categoría:** Desarrollo de aplicaciones (confirmada en el lote).
- **Extracto:** Creamos aplicaciones para iPhone y Android que permiten a tus usuarios realizar tareas, consultar información y utilizar tus servicios desde su celular.
- **Contenido:** Desarrollamos aplicaciones móviles a partir de las necesidades de tus usuarios y los objetivos de tu negocio. Definimos las funciones, diseñamos los recorridos de uso y elegimos el enfoque técnico adecuado para crear una aplicación que puedas probar, publicar y ampliar conforme evolucione el proyecto.

### Intro

- **Eyebrow:** Desarrollo de aplicaciones móviles.
- **Suffix:** No definido en v3; el campo está vacío. La propuesta visual no muestra sufijo.
- **Título:** Una aplicación que resuelve una necesidad desde el celular.
- **Descripción:** Si tus clientes o colaboradores necesitan consultar información, realizar operaciones o acceder a tus servicios desde cualquier lugar, desarrollamos una aplicación pensada para esas tareas. Definimos contigo qué debe hacer y cómo llevarla a iPhone y Android.

### Hero Stats

1. **La plataforma adecuada** · iOS, Android o ambas según lo que necesitas.
2. **Tareas más sencillas** · Funciones organizadas para el uso diario.
3. **Base para crecer** · Preparada para nuevas funciones y actualizaciones.

*Los indicadores 1 y 3 cambian respecto a v3; ver sección 4.*

### Development

- **Título:** Que la aplicación facilite las tareas de tus usuarios.
- **Contenido:** Una aplicación pierde valor si resulta complicada, tarda demasiado en responder o no resuelve el problema para el que fue creada. Por eso comenzamos por las tareas que necesitan realizar tus usuarios y las condiciones en que utilizarán la aplicación. A partir de ahí definimos las pantallas, las funciones y la tecnología, considerando el presupuesto, el rendimiento y el mantenimiento.
- **Tags:** Aplicaciones móviles · iOS y Android · Experiencia de usuario · Rendimiento · Notificaciones · Integraciones.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **La aplicación es complicada y tus usuarios no encuentran cómo hacer lo que necesitan.**  
   *Origen: «resulta complicada».*
2. **Tarda en responder o falla en el momento en que más se usa.**  
   *Origen: «tarda demasiado en responder».*
3. **No resuelve la tarea concreta para la que se creó.**  
   *Origen: la última frase del contenido.*

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** Dos caminos para llegar a tus usuarios.
- **Descripción:** Elegimos entre un desarrollo específico para una plataforma y una solución multiplataforma según las funciones, el rendimiento y los recursos del proyecto.

#### Solución 01 — Aplicaciones específicas para iPhone o Android

- **Qué resuelve y qué ofrece:** Cuando necesitas aprovechar funciones particulares del dispositivo o desarrollar una experiencia enfocada en una plataforma.
- **Qué recibes:**
  - Aplicación adaptada a iOS o Android.
  - Integración con cámara, ubicación y notificaciones.
  - Pantallas alineadas con la experiencia habitual de la plataforma.
  - Pruebas de las funciones y el rendimiento requeridos.
  - Proyecto preparado para recibir mantenimiento y actualizaciones.
- **Beneficio [Visual]:** Aprovecha las funciones del dispositivo y una experiencia propia de la plataforma.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Una aplicación para iPhone y Android

- **Qué resuelve y qué ofrece:** Llega a usuarios de ambas plataformas con un desarrollo que comparte componentes y reduce la duplicación de trabajo cuando es viable.
- **Qué recibes:**
  - Aplicación disponible para iOS y Android.
  - Componentes y lógica compartidos para optimizar el desarrollo.
  - Interfaz adaptada a cada plataforma.
  - Funciones conectadas con los servicios y sistemas necesarios.
  - Base común para mantener y ampliar la aplicación.
- **Beneficio [Visual]:** Llega a ambas plataformas con una base común y menos duplicación.
- **Enlace:** No definido. No se muestra botón.

**Nota:** solo hay dos soluciones. La nota de v3 que dice «tres para los demás» es incorrecta para este servicio; no se inventa una tercera.

### Approach

- **Título:** De la idea a una aplicación que puedes probar.
- **Descripción:** Definimos las funciones, validamos la experiencia y desarrollamos por etapas para que puedas revisar el avance antes del lanzamiento.
- **Entender:** Identificamos a los usuarios, las tareas y las necesidades que debe resolver la aplicación.
- **Diseñar:** Creamos las pantallas y los recorridos para que puedas validar cómo funcionará.
- **Desarrollar:** Implementamos las funciones y preparamos versiones de prueba para revisar el resultado.
- **Publicar y evolucionar:** Preparamos la distribución en las tiendas y definimos las siguientes mejoras de acuerdo con las necesidades del proyecto.

### Technologies

- **Título:** Cómo desarrollamos tu aplicación.
- **Descripción:** Elegimos el enfoque técnico según las funciones que necesitas y las plataformas en las que quieres estar presente.
- **Plataformas:** iOS · Android.
- **Funciones del dispositivo:** Cámara · Ubicación · Notificaciones.
- **Enfoque de desarrollo:** Específico por plataforma · Multiplataforma.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Plataformas | Se integra en la descripción de las soluciones; ficha secundaria opcional. | Ya está en «Dos caminos». |
| Funciones del dispositivo | Ficha secundaria «Enfoque técnico» o se omite. | La solución 01 ya menciona cámara, ubicación y notificaciones. |
| Enfoque de desarrollo | Ficha secundaria. | Ayuda al evaluador técnico; no es un argumento comercial principal. |

**Recomendación:** esta es la primera ficha que puede omitirse si se busca acortar la página. No se elimina del CPT sin aprobación.

### FAQ

1. **¿Necesito una aplicación diferente para iPhone y Android?**  
   No siempre. Podemos desarrollar una aplicación específica para una plataforma o utilizar un enfoque multiplataforma. Evaluamos las funciones y los requisitos para recomendarte la opción adecuada.
2. **¿Cuánto tarda desarrollar una aplicación?**  
   Depende de las funciones, el diseño y las integraciones. Definimos etapas y tiempos estimados después de establecer el alcance.
3. **¿Puedo probarla antes de publicarla?**  
   Sí. Preparamos versiones de prueba para que revises las funciones y nos compartas tus comentarios antes del lanzamiento.
4. **¿Quién se encarga de publicarla en las tiendas?**  
   Podemos preparar el proceso de publicación y gestionar los pasos acordados. Las cuentas, los permisos y los requisitos de cada tienda deben definirse desde el inicio.
5. **¿Qué pasa cuando necesite nuevas funciones?**  
   Podemos planificar mejoras y actualizaciones. El mantenimiento posterior y la atención a cambios de las plataformas se acuerdan como parte del servicio correspondiente.
6. **¿Cuánto cuesta desarrollar una aplicación?**  
   Depende de las plataformas, las funciones y las integraciones. Revisamos tus necesidades y te presentamos una propuesta económica antes de iniciar.

### CTA

- **Título:** Lleva tus servicios al celular de tus usuarios.
- **Descripción:** Cuéntanos qué necesitas que hagan tus usuarios desde una aplicación. Evaluaremos las opciones para convertir esa necesidad en un proyecto.
- **Botón:** Cuéntanos tu idea.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Hablemos de tu app.
- **Enlaces intermedios [Visual]:** «Hablemos de tu app →» después de soluciones; «¿Te queda otra duda? Escríbenos →» después de FAQ.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

**Servicios relacionados [Visual]**

- Diseño de sitios web y tiendas en línea — Tu sitio web debe conseguir algo más que verse bien.
- Desarrollo a medida — Tu empresa no debería tener que adaptarse a un software que no le funciona.
- Integración de APIs y Servicios Externos — Deja de copiar datos de un programa a otro.

**Plataformas:** no aplica. La conversación es sobre la app y el dispositivo.

### Notas de contenido y auditoría

- **Completo:** identificación, intro, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** los dos hero stats; la ficha técnica; la nota de «tres soluciones» de v3.
- **Pendiente:** sufijo no definido; enlaces de solución no definidos; condiciones de mantenimiento posterior (FAQ 5) sin detalle, pero correctamente delimitadas.
- **Contradicciones resueltas:** «Dos plataformas» vs. solución 01; «Prueba antes de publicar» vs. FAQ 3.
- **Estado en el CPT:** 2 soluciones, 5 FAQ, `hero_stats` distintos. La importación de v3 actualizará todo.

---

## 5.4 Desarrollo a medida

### Identificación

- **Nombre:** Desarrollo a medida.
- **Título de WordPress:** Desarrollo a medida.
- **Slug:** `desarrollo-a-medida` (confirmado en el lote).
- **Categoría:** Desarrollo de software (confirmada en el lote).
- **Extracto:** Desarrollamos software para los procesos de tu empresa cuando las herramientas existentes no resuelven lo que necesitas o te obligan a trabajar de una forma que no te conviene.
- **Contenido:** Creamos sistemas internos, aplicaciones de gestión y portales que responden a las necesidades específicas de tu operación. Analizamos cómo trabaja tu equipo y desarrollamos funciones para organizar la información, automatizar tareas y facilitar procesos que hoy requieren demasiado trabajo manual.

### Intro

- **Eyebrow:** Desarrollo de software.
- **Suffix:** No definido en v3; el campo está vacío. La propuesta visual no muestra sufijo.
- **Título:** Tu empresa no debería tener que adaptarse a un software que no le funciona.
- **Descripción:** Si tus procesos dependen de hojas de cálculo, capturas repetidas o herramientas que no se comunican, podemos desarrollar una solución a la medida. Primero revisamos si realmente necesitas software nuevo; si una herramienta existente resuelve el problema, también te lo diremos.

### Hero Stats

1. **Menos trabajo manual** · Procesos adaptados a tu operación.
2. **Información centralizada** · Menos datos dispersos entre herramientas.
3. **Control de tu operación** · Funciones diseñadas para tu equipo.

### Development

- **Título:** Resuelve con software lo que hoy frena a tu equipo.
- **Contenido:** Cuando una herramienta no se adapta a tus procesos, tu equipo termina usando soluciones improvisadas, capturando la misma información varias veces o buscando datos en distintos lugares. El desarrollo a medida permite construir funciones alrededor de las necesidades reales de tu operación. Analizamos qué conviene automatizar, qué información necesitas controlar y si desarrollar una solución propia tiene sentido frente a las alternativas existentes.
- **Tags:** Software a medida · Sistemas internos · Aplicaciones de gestión · Automatización · Integraciones.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **Tu equipo usa hojas de cálculo, correos o registros separados para operar.**  
   *Origen: «soluciones improvisadas».*
2. **La misma información se captura varias veces en distintas herramientas.**  
   *Origen: «capturando la misma información varias veces».*
3. **Para dar seguimiento, hay que buscar datos en varios lugares.**  
   *Origen: «buscando datos en distintos lugares».*

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** Software para resolver problemas concretos de tu empresa.
- **Descripción:** Desarrollamos herramientas para organizar la operación, atender mejor a tus clientes y coordinar procesos que requieren funciones específicas.

#### Solución 01 — Sistemas internos para tu operación

- **Qué resuelve y qué ofrece:** Centraliza procesos que hoy administras con hojas de cálculo, correos o registros separados.
- **Qué recibes:**
  - Módulos para pedidos, inventario, incidencias u otros procesos.
  - Información organizada en un solo sistema.
  - Automatización de tareas repetitivas.
  - Usuarios y permisos según las responsabilidades del equipo.
  - Avisos y recordatorios para dar seguimiento a las actividades.
- **Beneficio [Visual]:** Menos trabajo manual y una operación más ordenada.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Portales y aplicaciones para clientes

- **Qué resuelve y qué ofrece:** Permite que tus clientes consulten información y realicen operaciones sin depender de llamadas o correos para cada solicitud.
- **Qué recibes:**
  - Acceso a pedidos, documentos y datos autorizados.
  - Formularios para registrar solicitudes y darles seguimiento.
  - Consulta del estado de trámites u operaciones.
  - Interfaz con la identidad de tu empresa.
  - Acceso desde celulares y computadoras.
- **Beneficio [Visual]:** Menos solicitudes repetidas y mejor atención.
- **Enlace:** No definido. No se muestra botón.

#### Solución 03 — Soluciones para procesos complejos

- **Qué resuelve y qué ofrece:** Conecta áreas, información y reglas de negocio en una solución diseñada para la forma en que trabaja tu empresa.
- **Qué recibes:**
  - Procesos que involucran varias áreas o responsables.
  - Integración con sistemas existentes.
  - Reglas de negocio adaptadas a tu operación.
  - Paneles para consultar información y dar seguimiento.
  - Estructura documentada para facilitar futuras ampliaciones.
- **Beneficio [Visual]:** Áreas coordinadas y reglas claras para operar.
- **Enlace:** No definido. No se muestra botón.

### Approach

- **Título:** Primero entendemos tu operación; después construimos.
- **Descripción:** Desarrollamos a partir de tus procesos reales, validando las funciones prioritarias y revisando los avances contigo.
- **Entender:** Identificamos dónde se pierde tiempo, qué información necesitas y qué tareas conviene simplificar.
- **Diseñar:** Definimos los procesos, las funciones y la estructura del sistema.
- **Desarrollar:** Construimos por etapas para revisar las funciones y ajustar lo necesario.
- **Evolucionar:** Planificamos mejoras conforme cambien tus procesos y prioridades.

### Technologies

- **Título:** Qué puede resolver el software.
- **Descripción:** Seleccionamos las herramientas técnicas según los procesos, la información y las condiciones de operación de tu empresa.
- **Tipo de solución:** Sistemas internos · Portales de clientes · Aplicaciones de gestión.
- **Funciones:** Automatización · Gestión de información · Control de permisos.
- **Integración y mantenimiento:** Conexión con otros sistemas · Documentación técnica · Ampliación por etapas.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Tipo de solución | Ficha secundaria «Capacidades del sistema». | Resumen de las soluciones; se puede omitir si se acorta. |
| Funciones | Ficha secundaria. | Aporta al evaluador técnico; no necesita una sección propia. |
| Integración y mantenimiento | Ficha secundaria. | Explica continuidad y documentación, un argumento de confianza. |

**Recomendación:** mantener la ficha como resumen de tres columnas; si se acorta, conservar «Funciones» e «Integración y mantenimiento» y eliminar «Tipo de solución», que ya está en las tarjetas.

### FAQ

1. **¿Cómo sé si necesito software a medida?**  
   Revisamos tu proceso y las herramientas que ya existen. Si una solución disponible cubre tus necesidades, te la recomendaremos; si tus procesos requieren funciones específicas, evaluaremos el desarrollo a medida.
2. **¿Cuánto tiempo necesito dedicar al proyecto?**  
   Tu participación será necesaria para explicar los procesos, validar las funciones y revisar los avances. Organizamos esas actividades de acuerdo con las etapas del proyecto.
3. **¿El software será mío?**  
   Antes de comenzar, dejamos por escrito quién tendrá los derechos de uso, qué materiales se entregarán y si el código fuente está incluido. La titularidad del código debe quedar definida expresamente en el acuerdo.
4. **¿Qué pasa si mi empresa cambia sus procesos?**  
   Podemos ampliar o modificar el sistema conforme evolucionen tus necesidades. Revisamos cada cambio para determinar su alcance y la forma de implementarlo.
5. **¿Se puede conectar con mis herramientas actuales?**  
   Sí, cuando existen mecanismos compatibles. Evaluamos los sistemas y definimos cómo intercambiar información antes de implementar la integración.
6. **¿Cuánto cuesta desarrollar software a medida?**  
   Depende de los procesos, las funciones y las integraciones. Primero definimos el alcance para presentarte una propuesta económica.

### CTA

- **Título:** Deja de adaptar tu operación a herramientas que se quedan cortas.
- **Descripción:** Cuéntanos qué procesos quieres resolver y cómo trabaja tu equipo. Te ayudaremos a determinar si necesitas una solución a medida o si existe una alternativa más conveniente.
- **Botón:** Cuéntanos qué necesitas resolver.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Hablemos de tu proceso.
- **Enlaces intermedios [Visual]:** «Hablemos de tu proceso →» después de soluciones; «¿Te queda otra duda? Escríbenos →» después de FAQ.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

**Servicios relacionados [Visual]**

- Consultoría técnica — Decide cómo construir tu proyecto antes de invertir en construirlo.
- Diseño de sitios web y tiendas en línea — Tu sitio web debe conseguir algo más que verse bien.
- Integración de APIs y Servicios Externos — Deja de copiar datos de un programa a otro.

**Plataformas:** no aplica. La integración con sistemas existentes ya aparece en las soluciones; el catálogo se reserva al servicio de Integración.

### Notas de contenido y auditoría

- **Completo:** identificación, intro, hero, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** la ficha técnica; la respuesta de propiedad del código (FAQ 3) necesita aprobación comercial/legal, porque v3 la deja «por definir».
- **Pendiente:** sufijo no definido; enlaces de solución no definidos; condiciones de mantenimiento sin detalle.
- **Contradicciones:** no se detectaron. La FAQ 3 no promete propiedad; exige definirla por escrito.
- **Estado en el CPT:** 3 soluciones, 5 FAQ, `hero_stats` distintos. La importación de v3 actualizará todo.

---

## 5.5 DevOps y Soporte Técnico

### Identificación

- **Nombre:** DevOps y Soporte Técnico.
- **Título de WordPress:** DevOps y Soporte Técnico.
- **Slug:** `devops-y-soporte-tecnico` (confirmado en el lote).
- **Categoría:** Infraestructura y soporte tecnológico (confirmada en el lote).
- **Extracto:** Automatizamos publicaciones, administramos infraestructura y supervisamos tus sistemas para ayudarte a mantenerlos operativos y atender problemas técnicos de manera organizada.
- **Contenido:** Nos encargamos de tareas técnicas que requieren atención constante: preparar actualizaciones, administrar servidores, configurar copias de seguridad y supervisar el funcionamiento de tus sistemas. El objetivo es reducir el trabajo manual, detectar problemas y establecer procedimientos claros para atender incidencias.

### Intro

- **Eyebrow:** DevOps y soporte técnico.
- **Suffix:** No definido en v3; el campo está vacío. La propuesta visual no muestra sufijo.
- **Título:** Actualiza tus sistemas sin convertir cada cambio en un riesgo.
- **Descripción:** Una actualización mal aplicada o un servidor sin supervisión puede interrumpir tu operación. Automatizamos tareas, organizamos las publicaciones y damos seguimiento a la infraestructura para que puedas administrar tus sistemas con mayor control.

### Hero Stats

1. **Cambios controlados** · Publicaciones con validaciones y reversión cuando sea posible.
2. **Menos tareas manuales** · Procesos técnicos automatizados.
3. **Problemas visibles** · Alertas para detectar fallas a tiempo.

*El indicador 1 cambia respecto a v3; ver sección 4.*

### Development

- **Título:** Evita que un problema técnico se convierta en un problema para tu negocio.
- **Contenido:** Los sistemas pueden presentar fallas por actualizaciones, falta de recursos, errores de configuración o copias de seguridad que no funcionan como se esperaba. Cuando no existen procesos claros, resolver esos problemas toma más tiempo y aumenta el riesgo para la operación. Revisamos tu infraestructura, automatizamos las tareas repetitivas y establecemos mecanismos de supervisión, mantenimiento y atención de incidencias adecuados para tus sistemas.
- **Tags:** Infraestructura · Despliegues · Copias de seguridad · Monitoreo · Incidencias · Mantenimiento técnico.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **Una actualización mal aplicada interrumpe la operación.**  
   *Origen: «fallas por actualizaciones».*
2. **Nadie revisa los recursos, la configuración o las copias de seguridad hasta que algo falla.**  
   *Origen: «falta de recursos, errores de configuración o copias de seguridad que no funcionan».*
3. **Cuando hay una incidencia, no existe un proceso claro para atenderla.**  
   *Origen: «Cuando no existen procesos claros, resolver esos problemas toma más tiempo».*

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** Controla las publicaciones, la infraestructura y las incidencias.
- **Descripción:** Organizamos los procesos necesarios para actualizar tus sistemas, mantener su infraestructura y detectar problemas antes de que se conviertan en interrupciones mayores.

#### Solución 01 — Publicaciones controladas

- **Qué resuelve y qué ofrece:** Deja atrás las actualizaciones manuales y los cambios difíciles de revertir. Organizamos el proceso para publicar de forma consistente y reducir el riesgo de errores.
- **Qué recibes:**
  - Proceso automatizado para publicar nuevas versiones.
  - Pruebas antes de aplicar cambios en producción.
  - Procedimiento de reversión cuando la arquitectura lo permita.
  - Entornos separados para desarrollo, pruebas y producción.
  - Registro de las versiones publicadas y sus resultados.
- **Beneficio [Visual]:** Cambios más previsibles y menos riesgo de interrupción.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Infraestructura y copias de seguridad

- **Qué resuelve y qué ofrece:** Administra tus servidores y recursos técnicos con una configuración acorde con las necesidades de tus aplicaciones.
- **Qué recibes:**
  - Configuración y administración de servidores o infraestructura en la nube.
  - Revisión del consumo de recursos y la capacidad.
  - Copias de seguridad automáticas con pruebas de restauración.
  - Actualizaciones de seguridad y mantenimiento técnico.
  - Procedimientos documentados para la recuperación ante fallas.
- **Beneficio [Visual]:** Una base operativa más ordenada y recuperable.
- **Enlace:** No definido. No se muestra botón.

#### Solución 03 — Supervisión y soporte técnico

- **Qué resuelve y qué ofrece:** Identifica problemas de funcionamiento y cuenta con un proceso definido para atender las incidencias de tus sistemas.
- **Qué recibes:**
  - Alertas ante fallas o comportamientos fuera de los parámetros establecidos.
  - Supervisión de los servicios y recursos configurados.
  - Atención de incidencias con horarios y tiempos de respuesta acordados.
  - Revisiones preventivas de la infraestructura.
  - Reportes de problemas, acciones realizadas y recomendaciones.
- **Beneficio [Visual]:** Problemas detectados a tiempo y un proceso claro para atenderlos.
- **Enlace:** No definido. No se muestra botón.

### Approach

- **Título:** Una operación técnica más controlada.
- **Descripción:** Revisamos el estado de tus sistemas, priorizamos los riesgos y establecemos los procesos necesarios para mantenerlos y actualizarlos.
- **Revisar:** Analizamos la infraestructura, los procesos de publicación y las necesidades de operación.
- **Automatizar:** Identificamos tareas repetitivas que pueden ejecutarse con menos intervención manual.
- **Implementar:** Configuramos los procesos, las copias de seguridad y las herramientas de supervisión acordadas.
- **Supervisar:** Revisamos los indicadores definidos y atendemos las incidencias conforme al servicio establecido.

### Technologies

- **Título:** Qué utilizamos para operar tus sistemas.
- **Descripción:** Seleccionamos las herramientas de automatización, administración y supervisión según la infraestructura existente.
- **Publicación:** Despliegues automatizados · Control de versiones · Entornos de prueba.
- **Infraestructura:** Servidores · Nube · Copias de seguridad · Administración de recursos.
- **Supervisión:** Monitoreo · Alertas · Registros · Recuperación ante fallas.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Publicación | Ficha «Qué cubrimos» después de «Cómo trabajamos». | Explica el alcance operativo; es más que una lista de herramientas. |
| Infraestructura | Ficha «Qué cubrimos». | El comprador necesita saber qué se administra. |
| Supervisión | Ficha «Qué cubrimos». | Explica el seguimiento y la recuperación; sostiene la confianza. |

**Recomendación:** esta ficha es la más importante de las seis; no reducirla a una nota al pie. Mantenerla como tres columnas legibles, sin chips.

### FAQ

1. **¿Qué incluye el servicio?**  
   Podemos cubrir publicaciones, infraestructura, copias de seguridad, supervisión y atención de incidencias. Definimos las actividades, los sistemas incluidos y la cobertura antes de comenzar.
2. **¿Necesito cambiar mis servidores actuales?**  
   No necesariamente. Primero revisamos lo que tienes y proponemos cambios cuando ayuden a resolver un problema concreto o a mejorar la operación.
3. **¿El soporte incluye atención a los usuarios de mi empresa?**  
   Este servicio se enfoca en la infraestructura y la operación técnica. La atención directa a usuarios se puede evaluar como un servicio independiente.
4. **¿Cómo sabré qué está pasando con mis sistemas?**  
   Podemos establecer reportes con el estado de los servicios supervisados, las incidencias y las acciones realizadas.
5. **¿Atienden fallas fuera del horario laboral?**  
   La cobertura depende del esquema acordado. Antes de iniciar definimos horarios, canales de atención y tiempos de respuesta, incluida cualquier cobertura extraordinaria.
6. **¿Cuánto cuesta el servicio?**  
   Depende de la infraestructura, los sistemas que deben administrarse y la cobertura requerida. Revisamos esos factores para presentarte una propuesta económica.

### CTA

- **Título:** Deja de resolver las fallas sobre la marcha.
- **Descripción:** Cuéntanos qué sistemas utilizas, cómo los administras y qué problemas te preocupan. Identificaremos las prioridades para mejorar su operación.
- **Botón:** Revisemos tus sistemas.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Hablemos de tu operación.
- **Enlaces intermedios [Visual]:** «Hablemos de tu operación →» después de soluciones; «¿Te queda otra duda? Escríbenos →» después de FAQ.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

**Servicios relacionados [Visual]**

- Integración de APIs y Servicios Externos — Deja de copiar datos de un programa a otro.
- Desarrollo a medida — Tu empresa no debería tener que adaptarse a un software que no le funciona.
- Consultoría técnica — Decide cómo construir tu proyecto antes de invertir en construirlo.

**Plataformas:** no aplica. Las plataformas relevantes son infraestructura, no CRM/ERP; la ficha «Qué cubrimos» cumple esa función.

### Notas de contenido y auditoría

- **Completo:** identificación, intro, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** la condición de reversión en el hero y en la solución 01; «Monitorización» → «Monitoreo»; la ficha «Qué cubrimos».
- **Pendiente:** sufijo no definido; horarios, canales y tiempos de respuesta (FAQ 5) son condiciones comerciales que deben confirmarse; enlaces de solución no definidos.
- **Contradicciones resueltas:** la reversión ya no se promete como absoluta.
- **Estado en el CPT:** 3 soluciones, 4 FAQ, CTA distinto. La importación de v3 actualizará todo.

---

## 5.6 Integración de APIs y Servicios Externos

### Identificación

- **Nombre:** Integración de APIs y Servicios Externos.
- **Título de WordPress:** Integración de APIs y Servicios Externos.  
  **Actual en el CPT:** «Integracion de Apis y Servicios Externos» (sin acentos). Corregir.
- **Slug:** `integracion-de-apis-y-servicios-externos` (confirmado en el lote).
- **Categoría:** Integración y desarrollo de software (confirmada en el lote).
- **Extracto:** Conectamos tus sistemas para que compartan información automáticamente y tu equipo deje de capturar los mismos datos en varias herramientas.
- **Contenido:** Integramos tiendas en línea, sistemas de facturación, CRM, inventarios y otros servicios para automatizar el intercambio de información. Definimos qué datos deben compartirse, cómo deben actualizarse y qué hacer cuando una operación falla, para reducir tareas manuales y mejorar la coordinación entre tus herramientas.

### Intro

- **Eyebrow:** Integración de sistemas.
- **Suffix:** No definido en v3; el campo está vacío. La propuesta visual no muestra sufijo.
- **Título:** Deja de copiar datos de un programa a otro.
- **Descripción:** Si tu equipo registra un pedido en una herramienta, vuelve a capturarlo en otra y después verifica que todo coincida, hay trabajo que se puede automatizar. Conectamos tus sistemas para que intercambien información con reglas claras y puedas dedicar menos tiempo a tareas repetitivas.

### Hero Stats

1. **Menos captura manual** · Un dato puede actualizar varios sistemas.
2. **Información coordinada** · Reglas claras para compartir datos.
3. **Errores detectables** · Registro de operaciones y fallas.

### Development

- **Título:** Tus programas, trabajando en equipo.
- **Contenido:** Cuando las herramientas de tu negocio están desconectadas, los pedidos, clientes, productos y facturas pueden terminar duplicados o desactualizados. Cada transferencia manual consume tiempo y abre la posibilidad de errores. Desarrollamos integraciones para que los sistemas compartan información de forma automática, con reglas para validar los datos, registrar las operaciones y detectar problemas cuando el intercambio no se completa.
- **Tags:** Integración de sistemas · APIs · Sincronización de datos · Automatización · Webhooks · Servicios externos.

#### Situaciones para «¿Te pasa esto?» [Visual]

1. **Los pedidos, clientes, productos o facturas se duplican entre herramientas.**  
   *Origen: «pueden terminar duplicados o desactualizados».*
2. **Tu equipo vuelve a capturar la misma información en otro programa.**  
   *Origen: «Cada transferencia manual consume tiempo».*
3. **Cuando algo falla, no queda claro qué se envió, cuándo ni a dónde.**  
   *Origen: «registrar las operaciones y detectar problemas cuando el intercambio no se completa».*

### Solutions

- **Eyebrow:** Qué puedes contratar.
- **Título:** Conecta tus herramientas y automatiza el intercambio de información.
- **Descripción:** Creamos conexiones entre las aplicaciones que ya utilizas para reducir capturas repetidas, coordinar procesos y mantener los datos actualizados.

#### Solución 01 — Conectar tus programas entre sí

- **Qué resuelve y qué ofrece:** Haz que la información registrada en una herramienta pueda utilizarse en otra sin depender de transferencias manuales.
- **Qué recibes:**
  - Conexión entre tienda, facturación, CRM o inventario.
  - Transferencia automática de los datos definidos.
  - Validación de la información antes de procesarla.
  - Registro de operaciones para consultar qué se envió y cuándo.
  - Reintentos y alertas para atender transferencias fallidas.
- **Beneficio [Visual]:** Menos capturas manuales y datos más consistentes.
- **Enlace:** No definido. No se muestra botón.

#### Solución 02 — Automatizar tareas entre sistemas

- **Qué resuelve y qué ofrece:** Define qué debe suceder cuando ocurre un evento para que tus herramientas ejecuten acciones sin intervención manual en cada paso.
- **Qué recibes:**
  - Generación o actualización de registros a partir de eventos.
  - Automatización de tareas como notificaciones y cambios de estado.
  - Reglas para determinar cuándo debe ejecutarse una acción.
  - Avisos cuando una operación requiere atención.
  - Historial de resultados para identificar errores y dar seguimiento.
- **Beneficio [Visual]:** Menos pasos manuales y respuestas más rápidas.
- **Enlace:** No definido. No se muestra botón.

#### Solución 03 — Mantener la información sincronizada

- **Qué resuelve y qué ofrece:** Coordina los datos que utilizan diferentes áreas para reducir diferencias entre registros y evitar trabajar con información desactualizada.
- **Qué recibes:**
  - Sincronización de clientes, productos, precios u otros registros.
  - Reglas para definir qué sistema actualiza cada dato.
  - Validaciones para reducir duplicados e inconsistencias.
  - Actualización programada o basada en eventos.
  - Registro de errores y procedimientos para corregirlos.
- **Beneficio [Visual]:** Un solo dato actualizado para todas las áreas.
- **Enlace:** No definido. No se muestra botón.

### Approach

- **Título:** Conexiones diseñadas para manejar los datos correctamente.
- **Descripción:** Antes de conectar los sistemas definimos qué información se mueve, cómo debe transformarse y qué hacer cuando ocurre un error.
- **Analizar:** Identificamos las herramientas, los datos y las tareas que hoy se realizan manualmente.
- **Diseñar:** Definimos el flujo de información, las reglas de validación y el tratamiento de errores.
- **Conectar:** Implementamos la integración y probamos los escenarios de operación acordados.
- **Supervisar:** Configuramos registros y mecanismos de seguimiento para detectar fallas y facilitar su diagnóstico.

### Technologies

- **Título:** Cómo conectamos tus sistemas.
- **Descripción:** Utilizamos los mecanismos de integración disponibles en cada plataforma y definimos reglas para intercambiar información de forma controlada.
- **Comunicación:** APIs · Webhooks · Intercambio de datos.
- **Sistemas:** Tiendas en línea · Facturación · CRM · Inventarios y ERP.
- **Control de datos:** Validación · Registros · Reintentos · Alertas.

#### Tratamiento visual

| Grupo | Tratamiento | Motivo |
|---|---|---|
| Comunicación | Nota breve dentro de la solución 01 o detalle colapsado. | «APIs, webhooks o intercambio de datos» es útil para el evaluador técnico, no para el comprador no técnico. |
| Sistemas | Se sustituye por la sección de plataformas. | Evita duplicar el catálogo y permite mostrar ejemplos concretos. |
| Control de datos | Se integra en las soluciones 01/03 y en las FAQ 3/5. | Ya forma parte de la promesa de registro, validación y reintentos. |

**No se muestra una ficha técnica separada.** El detalle técnico queda en las soluciones y en la sección de plataformas. El CPT conserva los grupos; se decide su renderizado.

### FAQ

1. **¿Qué sistemas puedo conectar?**  
   Podemos evaluar tiendas en línea, facturación, CRM, inventarios, hojas de cálculo y otras aplicaciones. La viabilidad depende de los accesos y mecanismos de integración que ofrezca cada sistema.
2. **¿Se pueden conectar programas antiguos?**  
   En algunos casos, sí. Revisamos las interfaces disponibles y las alternativas técnicas antes de definir cómo realizar la conexión.
3. **¿Qué pasa si falla una transferencia de información?**  
   Podemos implementar validaciones, reintentos, registros y alertas para detectar el problema y facilitar su recuperación. El comportamiento depende de las capacidades de los sistemas involucrados.
4. **¿Qué ocurre si uno de los sistemas cambia?**  
   Una actualización puede requerir ajustes en la integración. Podemos revisar y adaptar las conexiones mediante un servicio de mantenimiento acordado.
5. **¿Puedo saber qué información se transfirió?**  
   Podemos incluir un historial de operaciones y errores para consultar qué datos se procesaron y detectar transferencias que requieren atención.
6. **¿Cuánto cuesta conectar mis sistemas?**  
   Depende del número de aplicaciones, la complejidad de los datos y las reglas de negocio. Revisamos el escenario para definir una propuesta económica.

### CTA

- **Título:** Deja que tus sistemas hagan el trabajo repetitivo.
- **Descripción:** Cuéntanos qué programas utilizas y qué información tienes que pasar de uno a otro. Revisaremos cómo automatizar ese proceso.
- **Botón:** Conectemos tus sistemas.
- **URL:** `/contact` (ES) / `/en/contact` (EN). El CPT tiene `/contacto`; unificar.
- **Hero CTA [Visual]:** Cuéntanos tu caso.
- **Enlaces intermedios [Visual]:** «Hablemos de tu caso →» después de soluciones; «Consultar mi integración →» en el bloque de plataformas; «¿Te queda otra duda? Escríbenos →» después de FAQ.
- **CTA secundario del cierre [UI]:** Ver todos los servicios → (`/servicios`).

### Bloques visuales adicionales

#### Plataformas [Visual] / [Pendiente]

- **Eyebrow:** Ejemplos de integración.
- **Título:** ¿Qué plataformas podemos conectar?
- **Introducción:** Estos son ejemplos de plataformas sobre las que puedes consultar una integración. No implican que todas las conexiones estén implementadas, probadas o disponibles de inmediato: revisamos tu caso y las condiciones de acceso de cada sistema.
- **Tarjetas (3 × 2 en escritorio, 2 en tablet, 1 en móvil):**
  - **SAP** — Ejemplo: sincronizar inventario o pedidos con un sistema empresarial.
  - **Zoho** — Ejemplo: compartir clientes y oportunidades con tu sistema de facturación.
  - **Salesforce** — Ejemplo: mantener actualizados clientes y oportunidades comerciales.
  - **Shopify** — Ejemplo: enviar pedidos y niveles de inventario entre la tienda y tu operación.
  - **Microsoft 365** — Ejemplo: conectar solicitudes, archivos o flujos de trabajo con otros sistemas.
  - **WooCommerce** — Ejemplo: sincronizar productos, pedidos y existencias de la tienda en línea.
- **Nota de la sección:** Nombres tipográficos, sin logotipos ni afirmaciones de alianza. Los escenarios son ilustrativos, no capacidades verificadas.
- **Bloque de consulta:**
  - Etiqueta: ¿NO ENCUENTRAS TU PLATAFORMA?
  - Título: ¿Tienes otra plataforma en mente?
  - Descripción: ¿No sabes si podemos conectar el sistema que utilizas? Cuéntanos cuál es y qué necesitas hacer. Revisaremos tu caso y te orientaremos sobre las posibilidades de integración.
  - CTA: Consultar mi integración → (`/contact`). Es un enlace de texto, no un botón naranja.
- **Modelo de datos:** no existe un campo ACF para plataformas. Opciones: arreglo estático en Astro (recomendado para la primera versión) o un campo nuevo (requiere aprobación). No se muestra como catálogo cerrado ni como promesa de integración.
- **Alcance:** solo este servicio. No se copia a los otros cinco.

**Servicios relacionados [Visual]**

- Desarrollo a medida — Tu empresa no debería tener que adaptarse a un software que no le funciona.
- Diseño de sitios web y tiendas en línea — Tu sitio web debe conseguir algo más que verse bien.
- DevOps y Soporte Técnico — Actualiza tus sistemas sin convertir cada cambio en un riesgo.

### Notas de contenido y auditoría

- **Completo:** identificación, intro, hero, desarrollo, soluciones, proceso, FAQ y CTA.
- **Requiere ajuste:** el título del CPT sin acentos; la sección de plataformas es nueva; el grupo «Sistemas» se sustituye por plataformas; «Comunicación» y «Control de datos» se integran.
- **Pendiente:** sufijo no definido; validación comercial de las seis plataformas; modelo de datos; destino del CTA de plataformas; enlaces de solución no definidos.
- **Contradicciones:** no se detectaron en el contenido comercial. La sección de plataformas debe mantener el disclaimer para no convertirse en una promesa.
- **Estado en el CPT:** 3 soluciones, 4 FAQ, título sin acentos, CTA distinto. La importación de v3 actualizará todo.

---

## 6. Auditoría de contenido

### 6.1 Estado por servicio

| Servicio | Identificación | Intro | Hero | Development | Solutions | Approach | Technologies | FAQ | CTA | Plataformas | Relacionados |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Consultoría técnica | Completo | Completo | Completo | Requiere ajuste¹ | Completo | Completo | Requiere ajuste² | Completo | Requiere ajuste³ | No aplica | Pendiente⁴ |
| Diseño web y tiendas | Requiere ajuste⁵ | Completo | Completo | Requiere ajuste¹ | Completo⁶ | Completo | Requiere ajuste⁷ | Completo | Requiere ajuste³ | No aplica | Pendiente⁴ |
| Aplicaciones móviles | Completo | Completo | Requiere ajuste⁸ | Requiere ajuste¹ | Completo⁹ | Completo | Requiere ajuste⁷ | Completo | Requiere ajuste³ | No aplica | Pendiente⁴ |
| Desarrollo a medida | Completo | Completo | Completo | Requiere ajuste¹ | Completo | Completo | Requiere ajuste⁷ | Requiere ajuste¹⁰ | Requiere ajuste³ | No aplica | Pendiente⁴ |
| DevOps y Soporte | Completo | Completo | Requiere ajuste¹¹ | Requiere ajuste¹ | Completo¹² | Completo | Completo¹³ | Requiere ajuste¹⁴ | Requiere ajuste³ | No aplica | Pendiente⁴ |
| Integración de APIs | Requiere ajuste¹⁵ | Completo | Completo | Requiere ajuste¹ | Completo | Completo | Requiere ajuste¹⁶ | Completo | Requiere ajuste³ | Pendiente¹⁷ | Pendiente⁴ |

**Notas de la matriz**

1. La división en tres situaciones es una propuesta visual; si se reescribe `development_content`, requiere aprobación.
2. La reorganización de los grupos técnicos está propuesta; requiere aprobación.
3. El CTA final está completo; la URL `/contacto` del CPT debe unificarse con `/contact`; la etiqueta del hero es una propuesta visual.
4. El bloque de servicios relacionados no existe en el contenido; faltan criterios y copy aprobados.
5. El título del CPT («E-commerce») no coincide con el nombre de la propuesta («tiendas en línea»).
6. La v3 define 3 soluciones; el CPT tiene 2. La importación debe añadir la tercera.
7. La ficha técnica es redundante con las soluciones; se propone compacta o colapsable.
8. Dos hero stats cambian; requieren aprobación.
9. La v3 tiene 2 soluciones; la nota «tres para los demás» es incorrecta. Se conservan 2.
10. La FAQ de propiedad del código requiere una definición comercial/legal.
11. La reversión se condiciona a la arquitectura; requiere aprobación.
12. La solución 01 incluye la condición de reversión; el resto está completo.
13. La ficha «Qué cubrimos» es el tratamiento propuesto; el contenido técnico está completo.
14. La cobertura de soporte (horarios, canales, tiempos) no está detallada; es una condición comercial pendiente.
15. El título del CPT no tiene acentos; corregir.
16. El grupo «Sistemas» se sustituye por plataformas; «Comunicación» y «Control de datos» se integran. Requiere aprobación.
17. La sección de plataformas no existe en el modelo; es la principal propuesta nueva.

### 6.2 Contradicciones y ambigüedades detectadas

| # | Dónde | Problema | Resolución propuesta | Estado |
|---|---|---|---|---|
| 1 | v3, «Criterios aplicados» | Dice «tres soluciones para los demás», pero Móviles tiene dos. | Conservar dos; no inventar una tercera. | Resuelto en este documento |
| 2 | Móviles, hero | «Dos plataformas» contradice la solución 01 (una plataforma). | Nuevo indicador: «La plataforma adecuada». | Requiere aprobación |
| 3 | Móviles, hero/FAQ | «Prueba antes de publicar» repite la FAQ 3. | Nuevo indicador: «Base para crecer». | Requiere aprobación |
| 4 | DevOps, hero/solución | «Opción de reversión» suena absoluto. | Condicionar a la arquitectura. | Requiere aprobación |
| 5 | Web, solución/FAQ | «Facilitar la indexación» puede leerse como garantía. | «Para que los buscadores entiendan el sitio»; la FAQ mantiene la no garantía. | Requiere aprobación |
| 6 | Consultoría, Technologies | «Tecnologías» está en Planificación y también es una decisión de diseño. | Mover a Diseño técnico; añadir «Estimación» a Planificación. | Requiere aprobación |
| 7 | Web, identificación | «E-commerce» vs. «tiendas en línea». | Unificar el título a «Diseño de sitios web y tiendas en línea». | Pendiente |
| 8 | Integración, identificación | Título sin acentos. | «Integración de APIs y Servicios Externos». | Pendiente |
| 9 | Todos, CTA | `/contacto` en el CPT vs. `/contact` en el sitio. | Unificar a `/contact` (ES) y `/en/contact` (EN). | Pendiente |
| 10 | Web, soluciones | «Conoce más» apunta a `/contacto`, no a una página de solución. | Retirar los botones por tarjeta; usar el enlace de sección. | Pendiente |
| 11 | Todos, hero/cierre | El CTA del hero y el final pueden competir si usan la misma etiqueta. | Etiquetas distintas; solo dos botones naranjas. | Propuesta visual |
| 12 | Todos, longitud | La página es más larga que la anterior. | Decidir qué fichas se colapsan u omiten. | Pendiente |
| 13 | Identificación | El extracto y el contenido existen en v3, pero no se renderizan ni se exponen. | Decidir si se usan para SEO/listado o se exponen en REST. | Pendiente |
| 14 | Plataformas | Los nombres son ejemplos, pero pueden leerse como alianzas. | Disclaimer visible; sin logotipos; validación comercial. | Pendiente |

### 6.3 Información que falta para la página completa

1. **Servicios relacionados:** copy introductorio, CTA y criterios de selección. Propuesta: mismo `service_category`, excluir el actual, máximo 3, respetar Polylang. Falta aprobación y, posiblemente, una consulta o un campo.
2. **Destinos de CTA:** `/contact` vs. `/contacto`; `/servicios`; `/en/contact`. Confirmar.
3. **Enlaces de solución:** no hay páginas de solución. Decidir si se muestran botones o no.
4. **Sufijo de intro:** solo Consultoría tiene sufijo en v3; los otros cinco no lo definen. El CPT actual lo tiene vacío en los seis. Decidir si se muestran sin sufijo o se completa el campo.
5. **Extracto y contenido:** no se renderizan en la plantilla actual y no se exponen en el endpoint. Decidir su uso (SEO, listado, metadatos).
6. **Plataformas:** validar los seis nombres, el alcance de cada ejemplo y la redacción legal; decidir si se implementan como arreglo estático o campo ACF.
7. **Propiedad del código (A medida):** la FAQ deja la titularidad «por definir». Confirmar la posición comercial.
8. **Cobertura de soporte (DevOps):** horarios, canales, tiempos de respuesta y cobertura extraordinaria. Confirmar.
9. **Precios:** no se publican cifras; las FAQ dicen «propuesta económica». Confirmar que se mantiene.
10. **Pruebas sociales:** no hay casos, testimonios, clientes ni cifras. Si se quieren, deben obtenerse y aprobarse; no se inventan.
11. **Imágenes y logotipos:** no hay `featured_media` ni activos de plataformas. La propuesta usa tipografía y geometría. Si se quieren imágenes, faltan activos y permisos.
12. **Inglés:** no hay traducciones aprobadas. La pantalla EN es una referencia de longitudes, no contenido final.
13. **Nombres y slugs:** unificar el título de Web y los acentos de Integración; verificar slugs y categorías en REST.
14. **Analítica:** no hay eventos ni métricas definidas para medir el CTA, el acordeón o las plataformas.
15. **Footer y navegación:** reutilizar el global; el mock no es la fuente.
16. **Datos de la empresa:** el mock no debe introducir ubicaciones, certificaciones ni páginas legales no confirmadas. El footer de producción manda.

### 6.4 Promesas y condiciones que requieren revisión

| Tema | Texto actual | Riesgo | Recomendación |
|---|---|---|---|
| Indexación / Google | «Estructura y metadatos preparados para que los buscadores entiendan el sitio» | Puede leerse como garantía de aparición o posición. | Mantener la FAQ que dice que no se garantiza; evitar «indexación garantizada». |
| Reversión DevOps | «Procedimiento de reversión cuando la arquitectura lo permita» | La condición es correcta, pero debe explicarse en la propuesta. | Mantener la condición; no prometer reversión universal. |
| Propiedad del código | «La titularidad del código debe quedar definida expresamente en el acuerdo» | Es una posición abierta, no una promesa. | Aprobación comercial/legal antes de publicar. |
| Soporte DevOps | «Horarios y tiempos de respuesta acordados» | No hay cifras; el comprador puede esperar un SLA. | Definir el esquema o aclarar que se acuerda caso a caso. |
| Plataformas | «Ejemplos de plataformas sobre las que puedes consultar una integración» | Puede confundirse con alianzas o integraciones listas. | Mantener el disclaimer, sin logotipos, y validar cada ejemplo. |
| Mantenimiento móvil | «El mantenimiento posterior… se acuerda como parte del servicio correspondiente» | Es una condición, no una promesa. | Mantener; aclarar que no está incluido por defecto. |
| Disponibilidad | No se promete «99,9 %» ni «sin caídas». | Correcto. | No añadir cifras sin evidencia. |

### 6.5 Lo que no se inventó

- No hay testimonios, casos de éxito, clientes ni logotipos.
- No hay cifras de resultados, años de experiencia ni porcentajes.
- No hay certificaciones, alianzas ni partnerships.
- No hay precios, rangos ni tiempos garantizados.
- No hay promesas de posicionamiento, disponibilidad absoluta ni ausencia de errores.
- No hay ubicaciones ni páginas legales nuevas en el contenido (el mock se corrigió).

---

## 7. Matriz final de cobertura

**Leyenda:** C = Completo; A = Requiere ajuste; P = Pendiente; N = No aplica.

| Servicio | Identificación | Intro | Hero | Development | Solutions | Approach | Technologies | FAQ | CTA | Plataformas | Relacionados |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Consultoría técnica | C | C | C | A | C | C | A | C | A | N | P |
| Diseño web y tiendas | A | C | C | A | C | C | A | C | A | N | P |
| Aplicaciones móviles | C | C | A | A | C | C | A | C | A | N | P |
| Desarrollo a medida | C | C | C | A | C | C | A | A | A | N | P |
| DevOps y Soporte Técnico | C | C | A | A | C | C | C | A | A | N | P |
| Integración de APIs | A | C | C | A | C | C | A | C | A | P | P |

### Lectura de la matriz

- **Contenido comercial:** los seis servicios tienen suficiente contenido para diseñar el hero, el problema, las soluciones, el proceso, la FAQ y el cierre.
- **Ajustes menores:** los cambios de Móviles, DevOps, Web y Consultoría son editoriales y están acotados.
- **Pendientes reales:** los servicios relacionados, las plataformas, los destinos de CTA, el sufijo, el extracto/contenido y el inglés.
- **No hay un servicio “vacío”**: ninguno necesita contenido inventado para completar la página. Las únicas secciones nuevas son las plataformas y los relacionados; su contenido está propuesto, pero requiere aprobación.
- **La página completa no está bloqueada por falta de copy comercial**, sino por decisiones de modelo de datos y de alcance.

---

## 8. Decisiones y pendientes

### P0 — Bloquean la implementación

1. **Aprobar la arquitectura visual** y las variaciones por servicio (2 o 3 soluciones, ficha técnica, plataformas solo en Integración).
2. **Decidir la longitud objetivo** y el tratamiento de la ficha técnica: mantener, colapsar u omitir en Web/Móviles. Sin esto, la página queda en 6.400–7.000 px.
3. **Aprobar las tres situaciones** y su implementación: reescribir `development_content` en tres párrafos (sin campo nuevo) o mantener el párrafo y renderizarlo como bloque único.
4. **Aprobar la sección de plataformas solo para Integración:** validar los seis nombres, el disclaimer, la ausencia de logotipos/alianzas y el modelo (arreglo estático vs. campo ACF).
5. **Definir los CTA:** etiquetas del hero, destino `/contact` vs. `/contacto`, y el CTA de plataformas.
6. **Definir los servicios relacionados:** copy, criterios de selección y cómo obtenerlos (taxonomía, REST o consulta).
7. **Aprobar los cambios editoriales:** hero de Móviles (2), condición de reversión de DevOps (2), indexación de Web (2), reorganización de Technologies de Consultoría (1), “Monitoreo” y el eyebrow «Qué puedes contratar».
8. **Resolver las condiciones comerciales:** propiedad del código (A medida) y cobertura de soporte (DevOps).
9. **Decidir el inglés:** quién traduce, si se reutiliza la estructura y si se publican las seis páginas o solo algunas.

### P1 — Contenido y modelo de datos

1. Unificar el título de Web («E-commerce» → «tiendas en línea») y los acentos de Integración.
2. Confirmar slugs y categorías en REST; el lote de importación es la referencia actual.
3. Decidir el sufijo de las cinco páginas sin suffix.
4. Decidir el uso del extracto y el contenido (SEO, listado o REST).
5. Retirar o definir los enlaces de solución; no usar `/contacto` como “Conocer más”.
6. Decidir si el “Beneficio” de cada tarjeta es la segunda frase de la descripción o un subcampo nuevo.
7. Decidir si las plataformas son un arreglo estático o un campo; no crear el campo sin aprobación.
8. Revisar `featured_media` y activos; si no hay imágenes, mantener la composición tipográfica.
9. Definir si se quiere una prueba social; si no, no añadir un bloque vacío.
10. Revisar el footer/nav global y no copiar el del mock.
11. Definir analítica: clics en CTA, apertura de FAQ, clics en plataformas, scroll.
12. Revisar el tono “español de México” en todo el sitio, no solo en servicios.

### P2 — Validación

1. Renderizar a 375, 390, 430, 768, 1024, 1280 y 1440 px.
2. Validar contraste, foco, teclado y ARIA de los acordeones.
3. Validar el comportamiento del CTA sticky: oculto hasta que el hero salga del viewport.
4. Validar la carga de fuentes y el CLS.
5. Probar con 5 usuarios no técnicos: ¿entienden qué se ofrece y qué recibirían?
6. Medir la longitud real y decidir recortes con datos.
7. Validar la versión EN con textos reales, no con la referencia.
8. Revisar SEO: títulos, metadescripciones, encabezados, enlaces internos.

---

## 9. Anexo A — Referencia en inglés

La pantalla `646488d5e44c4e5684248453da4f65ff` es una **referencia de longitud**, no contenido aprobado. Traduce el servicio de Web para comprobar que el hero, las tarjetas y la FAQ resisten textos más largos.

### Cadenas clave

- **H1:** Your website should do more than look good.
- **Lead:** A confusing page can make a customer leave before learning about your services. We design websites and online stores that explain what you offer, make contact or purchase easier, and deliver a clear experience from phone to desktop.
- **CTA hero:** Tell us about your project.
- **Stats:** More opportunities — Visitors understand what you offer; Smoother purchasing — Fewer obstacles to contact or pay; Ready to grow — Add content and features as you grow.
- **Solución 1:** Websites that present your business.
- **Solución 2:** Online stores that make buying easier.
- **Solución 3:** Digital platforms for your operation.
- **FAQ:** How long does it take to build my website? / Can I update the site without technical help? / Will my site appear on Google? / Can I add features later? / Can you connect the site to my billing or inventory system? / How much does it cost to build a website or online store?
- **CTA final:** Let's design your website.

### Observaciones de longitud

- El H1 en inglés es más corto que el español; no hay problema de altura.
- Los títulos de las tarjetas son más largos; las tarjetas crecen y deben mantener alturas iguales.
- Los botones son más largos («Tell us about your project»); el CTA del hero sigue cabiendo, pero en móvil debe ocupar el ancho completo.
- Las preguntas de FAQ son similares; el acordeón no cambia.
- La versión EN requiere traducción profesional y revisión de tono; no se debe publicar la referencia tal cual.

---

## 10. Anexo B — Mapa de campos CPT/ACF

| Elemento del documento | Campo / fuente | Tipo | Estado actual | Uso propuesto |
|---|---|---|---|---|
| Nombre y título | `title` | Texto | Existe | Título de la página y H1 de listado. |
| Extracto | `excerpt` | Texto | No expuesto en el endpoint de servicio | SEO/listado; decidir. |
| Contenido | `content` | Texto | No renderizado en la plantilla | SEO/listado; decidir. |
| Eyebrow | `intro_eyebrow` | Texto | Existe | Etiqueta superior del hero. |
| Suffix | `intro_eyebrow_suffix` | Texto | Existe; vacío en el CPT actual | v3 define uno para Consultoría; decidir los demás. |
| Título del hero | `intro_title` | Texto | Existe | H1. |
| Descripción del hero | `intro_description` | Texto | Existe | Lead. |
| Hero stats | `hero_stats[]` | Repeater (label, value) | Existe; contenido v1 | Tres indicadores; importar v3. |
| Título del problema | `development_title` | Texto | Existe | H2 del bloque «¿Te pasa esto?». |
| Contenido del problema | `development_content` | Textarea | Existe; contenido v1 | Párrafo; las tres situaciones son una división visual. |
| Tags | `development_tags[]` | Repeater/texto | Existe | Etiquetas de baja jerarquía. |
| Eyebrow de soluciones | `solutions_eyebrow` | Texto | «Nuestras soluciones» | Cambiar a «Qué puedes contratar» si se aprueba. |
| Título de soluciones | `solutions_title` | Texto | Existe | H2. |
| Descripción de soluciones | `solutions_description` | Texto | Existe | Intro. |
| Soluciones | `solutions[]` | Repeater (title, description, features, link) | Existe; 2/3 según servicio | Tarjetas; el “beneficio” es visual, no un campo. |
| Enlace de solución | `solutions[].link` | URL | Vacío en 5; `/contacto` en Web | No mostrar botón si no hay página. |
| Título del proceso | `approach_title` | Texto | Existe | H2. |
| Descripción del proceso | `approach_description` | Texto | Existe | Intro. |
| Pasos | `approach[]` | Repeater (title, description) | Existe; 4 | Stepper estático. |
| Título técnico | `tech_title` | Texto | Existe | Ficha secundaria o sección de plataformas. |
| Descripción técnica | `tech_description` | Texto | Existe | Intro de la ficha. |
| Grupos técnicos | `tech_groups[]` | Repeater (title, items) | Existe; 2/3 | Ficha compacta; Integración los integra. |
| FAQ | `faq_items[]` | Repeater (question, answer) | Existe; 4/5 | Seis en v3; importar. |
| CTA | `cta` | Group (title, description, button_text, button_url) | Existe; contenido v1 | Cierre; importar v3. |
| CTA del hero | No existe | — | — | Copy de interfaz o campo nuevo; decidir. |
| Enlaces intermedios | No existe | — | — | Copy de interfaz; enlaces de texto. |
| Plataformas | No existe | — | — | Arreglo estático o campo nuevo; decidir. |
| Servicios relacionados | No existe | — | — | Consulta + copy de interfaz; decidir. |
| Etiqueta “Beneficio” | No existe | — | — | Segunda frase de la descripción o subcampo; decidir. |
| Etiqueta “Qué recibes” | No existe | — | — | Copy de interfaz. |
| Numeración 01/02/03 | No existe | — | — | Recurso visual. |

**Regla:** no crear campos ACF nuevos sin aprobación. Las propuestas que requieren campo están marcadas como pendientes.

---

## 11. Anexo C — Evidencia visual y archivos

### 11.1 Archivos locales

Las pantallas y capturas están en:

`docs/servicios-v4/stitch/`

- `01-integracion.html` / `01-integracion-desktop.png`
- `02-web.html` / `02-web-desktop.png`
- `03-moviles.html` / `03-moviles-desktop.png`
- `04-desarrollo-medida.html` / `04-desarrollo-medida-desktop.png`
- `05-devops.html` / `05-devops-desktop.png`
- `06-consultoria.html` / `06-consultoria-desktop.png`
- `07-integracion-movil.html` / `07-integracion-movil-390-clean.png` / `07-integracion-movil-390-viewport.png`
- `08-web-en.html` / `08-web-en-desktop.png`

### 11.2 Validación realizada

- Renderizado con Chrome headless (Playwright) a 1280 px de escritorio y 390 px de móvil.
- Comprobación de las diez secciones en las seis páginas.
- Comprobación de la jerarquía de CTA, las tarjetas de solución, el acordeón de FAQ y el bloque de plataformas.
- Corrección de la FAQ inventada de Consultoría y del footer de Integración.
- Corrección del logo de Web.
- Comparación de longitudes con las páginas anteriores.

### 11.3 Lo que falta validar

- La versión real en Astro, con los componentes y tokens del proyecto.
- La versión móvil en 375/390/430 con el CTA sticky real.
- La versión EN con traducciones aprobadas.
- La accesibilidad completa (foco, teclado, ARIA, contraste).
- El rendimiento y el CLS.
- La analítica.

---

## 12. Cierre

La propuesta visual demuestra que el sistema de GussWare puede sostener las seis páginas con una estructura común y diferencias reales de contenido. También demuestra que la nueva arquitectura **no es más corta**: es más clara y más completa, pero exige decidir qué bloques se colapsan.

El contenido comercial está suficientemente completo para diseñar. Lo que falta no es copy de relleno: son decisiones de modelo de datos, destinos de CTA, condiciones comerciales y traducción. Si se aprueban los P0 de la sección 8, la implementación puede empezar sin inventar información ni cambiar el modelo de contenido a ciegas.

**Siguiente paso recomendado:** revisar las ocho pantallas y este documento; aprobar o corregir la arquitectura, los cambios editoriales y las condiciones comerciales; después decidir el modelo de plataformas y relacionados. No importar a WordPress hasta cerrar esos puntos.

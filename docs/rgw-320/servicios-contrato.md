# RGW-327 — Contrato JSON de importación masiva de Servicios

Derivado de `.opencode/skills/gussware-services-import/SKILL.md`,
`TEMPLATE.md`, `gussware-import-core` v1.0 y del modelo vivo verificado
el 2026-10-13 (CPT `service`, `rest_base: services`, grupo ACF
`Service Detail` con `show_in_rest: true`, taxonomía `service_category`
con `rest_base: service-categories`, Polylang `es`/`en`).

Lote de importación: `servicios.json` (mismo directorio, 6 servicios
reales; el par TEST 592/593 queda fuera del alcance).

## Estructura

```text
{
  "version": 1,            // entero, requerido, debe ser 1
  "type": "servicios",     // requerido, debe ser "servicios"
  "items": [ ... ]         // 1..N servicios lógicos, sin duplicados
}
```

Cada ítem:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `clave` | string no vacío | sí | Identificador estable: slug canónico ES. Ancla de resolución (paso 1: relación `translations`; paso 2: slug exacto normalizado). |
| `categoria` | string o null | no | Nombre exacto del término `service_category` (ES). Solo lado ES: no existen términos EN (verificado: `service-categories?lang=en` → `[]`). |
| `es.titulo` / `en.titulo` | string no vacío | sí | Título de WordPress por idioma. |
| `es.slug` | string no vacío | sí | Slug ES. |
| `en.slug` | string o null | no | Informativo: los EN vivos tienen slug vacío; la resolución EN usa el enlace `translations`, nunca el slug. |
| `es.acf` / `en.acf` | objeto | sí | Claves ACF exactas del grupo vivo (ver tabla). |
| `imagen_destacada_id` | entero o ausente | no | Attachment ID verificado. Ausente = preservar. Sin subidas. |

`hero_stats[]: {label, value}` (orden preservado),
`development_tags[]: {tag}`,
`solutions[]: {title, description, features[]: {feature}, link: {text, url}}`
(`link` con textos vacíos = ausente),
`approach[]: {title, description}`,
`tech_groups[]: {title, items[]: {name}}`,
`faq_items[]: {pregunta, respuesta}` (claves en español también en EN),
`cta: {title, description, button_text, button_url}`.

## Reglas de validación del lote

1. `version`/`type` exactos; `items` no vacío.
2. `clave` única en el lote (duplicado → ERROR, sin escrituras de ese ítem).
3. `titulo` ES/EN no vacíos; `slug` ES no vacío.
4. `categoria`, si presente, debe existir (comparación `norm`) o se crea
   solo si la fuente la declara explícitamente; en EN nunca se asigna
   categoría (sin términos EN).
5. Claves ACF exactas; tipos de cada subcampo según el grupo vivo.
6. Estados de publicación: el JSON no declara estado; el flujo preserva
   el estado vivo (publicados siguen publicados, borradores siguen
   borradores). La importación nunca publica ni despublica.
7. Resolución por ítem: relación `translations` → slug exacto → título
   normalizado mismo idioma; ambigüedad → AMBIGUOUS (detener ítem).
8. Repertibilidad: segunda ejecución resuelve los mismos registros
   (EXISTING/UPDATED), cero creados.

## Desviaciones verificadas respecto a la skill (no se inventa nada)

- `excerpt` y `content` nativos **no** están expuestos por el REST vivo
  (ausentes en `OPTIONS /wp/v2/services` y en las respuestas): no forman
  parte del JSON; todo el contenido vive en ACF.
- Sin términos `service-categories` en inglés: el lado EN no recibe
  taxonomía.
- `featured_media` vivo = 0: sin imágenes en esta fase.

## Ejemplo completo y válido (servicio `consultoria-tecnica`)

```json
{
  "clave": "consultoria-tecnica",
  "categoria": "Consultoría",
  "es": {
    "titulo": "Consultoría técnica",
    "slug": "consultoria-tecnica",
    "acf": {
      "approach": [
        {
          "title": "Entender",
          "description": "Identificamos las necesidades, objetivos y contexto técnico del proyecto."
        },
        {
          "title": "Definir",
          "description": "Establecemos la arquitectura y las decisiones tecnológicas necesarias para avanzar."
        },
        {
          "title": "Planificar",
          "description": "Organizamos el trabajo y definimos una estrategia de desarrollo utilizando metodologías ágiles como Scrum o Kanban."
        },
        {
          "title": "Documentar",
          "description": "Generamos la documentación técnica necesaria para mantener claras las decisiones y facilitar el desarrollo del proyecto."
        }
      ],
      "approach_description": "Trabajamos de forma estructurada para entender el proyecto, definir sus necesidades técnicas y establecer una base sólida para su desarrollo.",
      "approach_title": "Un enfoque técnico orientado a decisiones claras",
      "cta": {
        "title": "¿Tienes un proyecto y necesitas definir el camino técnico?",
        "description": "Hablemos sobre tus necesidades y definamos una estrategia técnica clara para llevar tu proyecto adelante.",
        "button_text": "Hablemos",
        "button_url": "/contacto"
      },
      "development_content": "Analizamos las necesidades del proyecto para definir una arquitectura adecuada, seleccionar las tecnologías que mejor se ajusten a sus objetivos y establecer una planificación clara para su desarrollo. Complementamos este proceso con documentación técnica y metodologías ágiles como Scrum o Kanban.",
      "development_tags": [
        {
          "tag": "Arquitectura de software"
        },
        {
          "tag": "Selección de tecnologías"
        },
        {
          "tag": "Planificación"
        },
        {
          "tag": "Documentación técnica"
        },
        {
          "tag": "Scrum"
        },
        {
          "tag": "Kanban"
        }
      ],
      "development_title": "Planificación técnica con una visión integral",
      "faq_items": [
        {
          "pregunta": "¿Qué incluye la consultoría técnica?",
          "respuesta": "La consultoría puede incluir definición de arquitectura, selección de tecnologías, planificación y documentación del proyecto, de acuerdo con sus necesidades."
        },
        {
          "pregunta": "¿Pueden ayudar a seleccionar las tecnologías para un proyecto?",
          "respuesta": "Sí. Evaluamos las necesidades y objetivos del proyecto para orientar la selección de tecnologías adecuadas."
        },
        {
          "pregunta": "¿Trabajan con Scrum y Kanban?",
          "respuesta": "Sí. Podemos utilizar metodologías ágiles como Scrum o Kanban para planificar y organizar el desarrollo del proyecto."
        },
        {
          "pregunta": "¿También realizan documentación técnica?",
          "respuesta": "Sí. La documentación forma parte del proceso de consultoría para dejar claras las decisiones técnicas y facilitar el desarrollo."
        }
      ],
      "hero_stats": [
        {
          "label": "Arquitectura",
          "value": "Diseño técnico"
        },
        {
          "label": "Tecnologías",
          "value": "Selección estratégica"
        },
        {
          "label": "Metodologías",
          "value": "Scrum / Kanban"
        }
      ],
      "intro_description": "Te ayudamos a tomar decisiones técnicas con una visión clara del proyecto, desde la definición de la arquitectura y la selección de tecnologías hasta la planificación y documentación del desarrollo.",
      "intro_eyebrow": "Consultoría técnica",
      "intro_eyebrow_suffix": "",
      "intro_title": "Arquitectura, tecnología y estrategia para construir proyectos sólidos",
      "solutions": [
        {
          "title": "Definición de arquitectura",
          "description": "Diseñamos y definimos la arquitectura técnica del proyecto considerando sus necesidades, objetivos y evolución esperada.",
          "features": [
            {
              "feature": "Diseño de arquitectura"
            },
            {
              "feature": "Definición de componentes"
            },
            {
              "feature": "Evaluación de necesidades técnicas"
            },
            {
              "feature": "Documentación de arquitectura"
            }
          ],
          "link": {
            "text": "",
            "url": ""
          }
        },
        {
          "title": "Selección y planificación tecnológica",
          "description": "Evaluamos alternativas tecnológicas y establecemos una planificación que permita organizar y documentar el desarrollo del proyecto mediante metodologías ágiles.",
          "features": [
            {
              "feature": "Selección de tecnologías"
            },
            {
              "feature": "Planificación del proyecto"
            },
            {
              "feature": "Documentación técnica"
            },
            {
              "feature": "Scrum"
            },
            {
              "feature": "Kanban"
            }
          ],
          "link": {
            "text": "",
            "url": ""
          }
        }
      ],
      "solutions_description": "Acompañamos cada etapa de definición para convertir las necesidades del proyecto en una estrategia técnica clara y ejecutable.",
      "solutions_eyebrow": "Nuestras soluciones",
      "solutions_title": "Decisiones técnicas que dan dirección al proyecto",
      "tech_description": "Seleccionamos las tecnologías y herramientas de acuerdo con las necesidades y objetivos específicos de cada proyecto.",
      "tech_groups": [
        {
          "title": "Metodologías",
          "items": [
            {
              "name": "Scrum"
            },
            {
              "name": "Kanban"
            }
          ]
        },
        {
          "title": "Arquitectura y desarrollo",
          "items": [
            {
              "name": "Arquitectura de software"
            },
            {
              "name": "Tecnologías de desarrollo"
            }
          ]
        }
      ],
      "tech_title": "Tecnologías y metodologías adecuadas para cada proyecto"
    }
  },
  "en": {
    "titulo": "Technical Consulting",
    "slug": null,
    "acf": {
      "approach": [
        {
          "title": "Understand",
          "description": "We identify the project's needs, objectives, and technical context."
        },
        {
          "title": "Define",
          "description": "We establish the architecture and technology decisions needed to move forward."
        },
        {
          "title": "Plan",
          "description": "We organize the work and define a development strategy using agile methodologies such as Scrum or Kanban."
        },
        {
          "title": "Document",
          "description": "We create the technical documentation needed to keep decisions clear and facilitate development."
        }
      ],
      "approach_description": "We work in a structured way to understand the project, define its technical needs, and establish a solid foundation for development.",
      "approach_title": "A technical approach focused on clear decisions",
      "cta": {
        "title": "Have a project and need to define the right technical path?",
        "description": "Let's talk about your needs and define a clear technical strategy to move your project forward.",
        "button_text": "Let's talk",
        "button_url": ""
      },
      "development_content": "We analyze project needs to define an appropriate architecture, select the technologies that best fit its objectives, and establish a clear development plan. We complement this process with technical documentation and agile methodologies such as Scrum or Kanban.",
      "development_tags": [
        {
          "tag": "Software architecture"
        },
        {
          "tag": "Technology selection"
        },
        {
          "tag": "Planning"
        },
        {
          "tag": "Technical documentation"
        },
        {
          "tag": "Scrum"
        },
        {
          "tag": "Kanban"
        }
      ],
      "development_title": "Technical planning with a comprehensive vision",
      "faq_items": [
        {
          "pregunta": "What does technical consulting include?",
          "respuesta": "Consulting may include architecture definition, technology selection, project planning, and documentation according to the project's needs."
        },
        {
          "pregunta": "Can you help select the technologies for a project?",
          "respuesta": "Yes. We evaluate the project's needs and objectives to guide the selection of appropriate technologies."
        },
        {
          "pregunta": "Do you work with Scrum and Kanban?",
          "respuesta": "Yes. We can use agile methodologies such as Scrum or Kanban to plan and organize project development."
        },
        {
          "pregunta": "Do you also provide technical documentation?",
          "respuesta": "Yes. Documentation is part of the consulting process to keep technical decisions clear and facilitate development."
        }
      ],
      "hero_stats": [
        {
          "label": "Architecture",
          "value": "Technical design"
        },
        {
          "label": "Technologies",
          "value": "Strategic selection"
        },
        {
          "label": "Methodologies",
          "value": "Scrum / Kanban"
        }
      ],
      "intro_description": "We help you make technical decisions with a clear vision of the project, from defining the architecture and selecting technologies to planning and documenting development.",
      "intro_eyebrow": "Technical Consulting",
      "intro_eyebrow_suffix": "",
      "intro_title": "Architecture, technology, and strategy for building solid projects",
      "solutions": [
        {
          "title": "Architecture definition",
          "description": "We design and define the project's technical architecture based on its needs, objectives, and expected evolution.",
          "features": [
            {
              "feature": "Architecture design"
            },
            {
              "feature": "Component definition"
            },
            {
              "feature": "Technical needs assessment"
            },
            {
              "feature": "Architecture documentation"
            }
          ],
          "link": {
            "text": "",
            "url": ""
          }
        },
        {
          "title": "Technology selection and planning",
          "description": "We evaluate technology alternatives and establish a plan to organize and document project development using agile methodologies.",
          "features": [
            {
              "feature": "Technology selection"
            },
            {
              "feature": "Project planning"
            },
            {
              "feature": "Technical documentation"
            },
            {
              "feature": "Scrum"
            },
            {
              "feature": "Kanban"
            }
          ],
          "link": {
            "text": "",
            "url": ""
          }
        }
      ],
      "solutions_description": "We support each definition stage to turn project needs into a clear and executable technical strategy.",
      "solutions_eyebrow": "Our solutions",
      "solutions_title": "Technical decisions that give your project direction",
      "tech_description": "We select technologies and tools according to each project's specific needs and objectives.",
      "tech_groups": [
        {
          "title": "Methodologies",
          "items": [
            {
              "name": "Scrum"
            },
            {
              "name": "Kanban"
            }
          ]
        },
        {
          "title": "Architecture and development",
          "items": [
            {
              "name": "Software architecture"
            },
            {
              "name": "Development technologies"
            }
          ]
        }
      ],
      "tech_title": "The right technologies and methodologies for each project"
    }
  }
}
```

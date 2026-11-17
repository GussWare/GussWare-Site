/**
 * RGW-357 — Anclas de las secciones del detalle de servicio.
 *
 * Las secciones del detalle de servicio se identifican con un `id` por
 * sección. Cada idioma usa los suyos: una página en inglés no puede
 * conservar `#soluciones`, `#metodologia`… (identificadores en
 * español), porque los CTA que apuntan a ellos (por ejemplo, el CTA
 * secundario del hero) deben funcionar en el idioma de la página.
 *
 * Esta tabla es la fuente única de esos identificadores: la usan las
 * secciones del detalle (`ServiceDetail` y sus bloques) y la
 * resolución de los CTA con ancla (`localizeCtaUrl`).
 *
 * Módulo puro (sin dependencias de Astro) para poder probarlo con
 * `node --test`.
 */

/** Identificadores de las secciones del detalle de servicio. */
export interface ServiceAnchors {
  /** Soluciones (S03). */
  solutions: string;
  /** Cómo trabajamos (S04). */
  methodology: string;
  /** Ficha técnica (S05). */
  technologies: string;
  /** Plataformas (S03b). */
  platforms: string;
  /** Preguntas frecuentes (S06). */
  faq: string;
  /** Cierre con los CTA (S07). */
  contact: string;
  /** Servicios relacionados (S08). */
  related: string;
}

const ANCHORS: Record<'es' | 'en', ServiceAnchors> = {
  es: {
    solutions: 'soluciones',
    methodology: 'metodologia',
    technologies: 'tecnologias',
    platforms: 'plataformas',
    faq: 'faq',
    contact: 'contacto',
    related: 'relacionados',
  },
  en: {
    solutions: 'solutions',
    methodology: 'methodology',
    technologies: 'technologies',
    platforms: 'platforms',
    faq: 'faq',
    contact: 'contact',
    related: 'related',
  },
};

/** Identificadores de las secciones del detalle de servicio en un idioma. */
export function serviceAnchors(locale: string): ServiceAnchors {
  return locale === 'en' ? ANCHORS.en : ANCHORS.es;
}

/**
 * Resuelve el destino de un CTA con ancla al identificador de la
 * sección en el idioma de la página.
 *
 * WordPress guarda la ancla en español (`#soluciones`) también en las
 * traducciones: en inglés debe apuntar a `#solutions`. La ancla se
 * reconoce por su identificador, esté en español o en inglés, para que
 * el CTA funcione en ambos sentidos.
 */
export function serviceAnchorHref(rawUrl: string, locale: string): string {
  const url = rawUrl.trim();

  if (!url.startsWith('#') || url.length < 2) {
    return rawUrl;
  }

  const id = url.slice(1);
  const anchors = serviceAnchors(locale);

  for (const key of Object.keys(ANCHORS.es) as (keyof ServiceAnchors)[]) {
    if (ANCHORS.es[key] === id || ANCHORS.en[key] === id) {
      return `#${anchors[key]}`;
    }
  }

  return rawUrl;
}

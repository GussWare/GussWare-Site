/**
 * Utilidades SEO genéricas (una sola implementación reutilizable).
 *
 * WordPress + Yoast son la fuente de verdad de los metadatos y Polylang
 * de idioma/traducciones (`lang`, `translations`, tabla de idiomas);
 * Astro solo renderiza. Nunca se usa `yoast_head` como HTML sin
 * procesar ni los campos de idioma de Yoast (`og_locale`,
 * `schema.inLanguage`) para determinar el idioma.
 */
import type {
  WpLanguage,
  WpPostYoastHeadJson,
  WpPostYoastRobots,
} from './wordpress/types';

/** Datos SEO resueltos para una página (los provee quien resuelve). */
export interface SeoData {
  /** Idioma Polylang de la página (`lang`). */
  lang: string;
  /** Metadatos Yoast (`yoast_head_json`), si existen. */
  yoast?: WpPostYoastHeadJson | null;
  /** URLs alternas por locale, solo traducciones existentes. */
  alternateUrls?: Record<string, string>;
  /** Tabla de idiomas Polylang (`/pll/v1/languages`). */
  languages?: WpLanguage[] | null;
}

/**
 * `og:locale` desde Polylang (`locale`, p. ej. `es_MX`); sin entrada,
 * el propio `lang` como degradación (sin inventar mapeos).
 */
export function resolveOgLocale(
  lang: string,
  languages?: WpLanguage[] | null,
): string {
  return languages?.find((item) => item.slug === lang)?.locale ?? lang;
}

/**
 * Código `hreflang` para un locale (`w3c`, p. ej. `es-MX`); sin
 * entrada, el slug como degradación.
 */
export function resolveHreflang(
  locale: string,
  languages?: WpLanguage[] | null,
): string {
  return languages?.find((item) => item.slug === locale)?.w3c ?? locale;
}

/**
 * Serializa `robots` de Yoast (`{index:'index', ...}` con valores ya
 * formateados) a contenido de `<meta name="robots">`. Tolera robots
 * parciales o ausentes.
 */
export function serializeRobots(
  robots?: WpPostYoastRobots | null,
): string | null {
  if (!robots || typeof robots !== 'object') {
    return null;
  }

  const content = Object.values(robots).filter(
    (value): value is string => typeof value === 'string' && value !== '',
  );

  return content.length > 0 ? content.join(', ') : null;
}

/**
 * Clona el Schema de Yoast corrigiendo únicamente los idiomas con el
 * de Polylang (`WebPage.inLanguage`, `WebSite.inLanguage`,
 * `Organization.logo.inLanguage`). Todo lo demás se conserva intacto.
 */
export function fixSchemaLocales(schema: unknown, lang: string): unknown {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const clone = JSON.parse(JSON.stringify(schema)) as {
    '@graph'?: unknown;
  };
  const graph = Array.isArray(clone['@graph']) ? clone['@graph'] : null;

  if (!graph) {
    return clone;
  }

  for (const node of graph) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      continue;
    }

    const record = node as Record<string, unknown>;
    const rawType = record['@type'];
    const types = Array.isArray(rawType) ? rawType : [rawType];

    if (types.includes('WebPage') || types.includes('WebSite')) {
      record['inLanguage'] = lang;
    }

    if (types.includes('Organization')) {
      const logo = record['logo'];

      if (logo && typeof logo === 'object' && !Array.isArray(logo)) {
        (logo as Record<string, unknown>)['inLanguage'] = lang;
      }
    }
  }

  return clone;
}

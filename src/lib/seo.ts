/**
 * Utilidades SEO genéricas (una sola implementación reutilizable).
 *
 * WordPress + Yoast son la fuente de verdad de los metadatos y Polylang
 * de idioma/traducciones (`lang`, `translations`, tabla de idiomas);
 * Astro solo renderiza. Nunca se usa `yoast_head` como HTML sin
 * procesar ni los campos de idioma de Yoast (`og_locale`,
 * `schema.inLanguage`) para determinar el idioma.
 *
 * También vive aquí la normalización de URLs entre el CMS
 * (`WORDPRESS_URL`) y el frontend público (`SITE_URL`): las referencias
 * internas que Yoast construye con el dominio del CMS deben apuntar al
 * dominio del sitio publicado.
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
 * URL canónica de la página en el sitio actual.
 *
 * Se construye con el dominio del sitio (`site` de la configuración) y
 * la ruta de la página: nunca con la URL que declara WordPress/Yoast,
 * que apunta al CMS y no al sitio publicado.
 */
export function canonicalUrl(
  site: URL | undefined,
  pathname: string,
): string | undefined {
  return site ? new URL(pathname, site).href : undefined;
}

/**
 * Origen de una URL (`scheme://host[:port]`), sin barra final, o `null`
 * si la URL no es válida.
 *
 * Es la parte que identifica al servidor: es lo que cambia entre el CMS
 * y el frontend público de cada entorno.
 */
export function originOf(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).origin.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

/**
 * Sustituye el origen de una URL por otro conservando intactos la ruta,
 * la query string y el fragmento.
 *
 * Es una operación sobre el origen, no sobre la URL completa: no toca
 * las URLs de otros orígenes (externas) y no reescribe parámetros como
 * `?s={search_term_string}`, que deben llegar tal cual.
 *
 * @param url URL absoluta a reescribir.
 * @param fromOrigin Origen de origen (por ejemplo, el del CMS).
 * @param toOrigin Origen de destino (por ejemplo, el del frontend).
 */
export function rewriteUrlOrigin(
  url: string,
  fromOrigin: string,
  toOrigin: string,
): string {
  const from = fromOrigin.replace(/\/+$/, '');
  const to = toOrigin.replace(/\/+$/, '');

  if (!from || !to || from === to) {
    return url;
  }

  if (url.slice(0, from.length).toLowerCase() !== from.toLowerCase()) {
    return url;
  }

  const rest = url.slice(from.length);

  // El origen debe coincidir completo: `https://cms.example.com.otro`
  // no pertenece a `https://cms.example.com`.
  if (rest && !/^[/?#]/.test(rest)) {
    return url;
  }

  return `${to}${rest}`;
}

/**
 * Ruta que sirve el CMS como archivos (biblioteca de medios y plugins).
 *
 * Las referencias a esos recursos siguen apuntando al CMS porque el
 * frontend no los sirve: reescribirlas rompería las imágenes.
 */
const CMS_ASSET_PATH = '/wp-content/';

/**
 * Reescribe en un JSON-LD las referencias internas que apuntan al CMS
 * para que apunten al frontend público del entorno.
 *
 * Solo se tocan los valores de texto que son URLs absolutas del origen
 * del CMS y que no son archivos servidos por el CMS (`/wp-content/`).
 * Se conservan intactos: la estructura del grafo, los tipos Schema.org,
 * las relaciones entre nodos, las URLs externas (imágenes externas,
 * redes sociales, `schema.org`) y los recursos del CMS.
 */
export function rewriteSchemaUrls(
  schema: unknown,
  fromOrigin: string,
  toOrigin: string,
): unknown {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const from = fromOrigin.replace(/\/+$/, '');
  const to = toOrigin.replace(/\/+$/, '');

  if (!from || !to || from === to) {
    return schema;
  }

  const clone = JSON.parse(JSON.stringify(schema)) as unknown;

  const visit = (node: unknown): unknown => {
    if (typeof node === 'string') {
      return rewriteSchemaUrl(node, from, to);
    }

    if (Array.isArray(node)) {
      return node.map(visit);
    }

    if (node && typeof node === 'object') {
      const result: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(node)) {
        result[key] = visit(value);
      }

      return result;
    }

    return node;
  };

  return visit(clone);
}

/**
 * Reescribe una URL del JSON-LD conservando ruta, query y fragmento.
 *
 * Los recursos servidos por el CMS (biblioteca de medios y plugins) se
 * mantienen: el frontend no sirve esos archivos.
 */
function rewriteSchemaUrl(url: string, from: string, to: string): string {
  if (url.slice(0, from.length).toLowerCase() !== from.toLowerCase()) {
    return url;
  }

  const rest = url.slice(from.length);

  if (rest && !/^[/?#]/.test(rest)) {
    return url;
  }

  if (rest.startsWith(CMS_ASSET_PATH)) {
    return url;
  }

  return `${to}${rest}`;
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

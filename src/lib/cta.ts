/**
 * RGW-357 — CTA de contacto y destinos de los CTA por idioma.
 *
 * WordPress guarda en ACF la ruta del destino de cada CTA (a veces en
 * español y a veces en inglés) y el endpoint del header
 * (`/gussware/v1/header`) ignora el parámetro `lang`: devuelve siempre
 * la etiqueta en español y la ruta `/contacto`. El frontend resuelve
 * aquí la etiqueta y el destino de cada idioma, de modo que un CTA
 * nunca cambie de idioma ni de destino al navegar.
 *
 * Módulo puro (sin dependencias de Astro) para poder probarlo con
 * `node --test`.
 */
import { serviceAnchorHref } from './services/anchors.ts';

/** Etiqueta del CTA de contacto en cada idioma. */
export const CONTACT_CTA_LABELS = {
  es: 'Iniciar Conversación',
  en: 'Start a Conversation',
} as const;

/**
 * Destino del CTA de contacto en cada idioma. La Page de contacto de
 * WordPress tiene un slug por idioma (`contacto` en español, `contact`
 * en inglés), por lo que la ruta no se deriva del slug del otro
 * idioma.
 */
export const CONTACT_CTA_ROUTES = {
  es: '/contacto',
  en: '/en/contact',
} as const;

/** Etiqueta del CTA de contacto según el idioma de la página. */
export function contactCtaLabel(locale: string): string {
  return locale === 'en' ? CONTACT_CTA_LABELS.en : CONTACT_CTA_LABELS.es;
}

/** Destino del CTA de contacto según el idioma de la página. */
export function contactCtaUrl(locale: string): string {
  return locale === 'en' ? CONTACT_CTA_ROUTES.en : CONTACT_CTA_ROUTES.es;
}

/**
 * Rutas de contacto que WordPress puede tener guardadas en un CTA
 * (las tres apuntan a la misma Page en cada idioma).
 */
const CONTACT_PATHS = new Set(['/contacto', '/contact', '/en/contact']);

/**
 * Resuelve el destino de un CTA de WordPress al idioma de la página.
 *
 * - Contacto: la Page tiene un slug por idioma, así que cualquiera de
 *   las rutas de contacto se resuelve a la del idioma de la página.
 * - Anclas: se resuelven al identificador de la sección en el idioma
 *   de la página (`serviceAnchorHref`).
 * - Otras rutas internas: se cambia el prefijo de idioma (el modelo de
 *   enrutado de Astro: el español no lleva prefijo y el inglés lleva
 *   `/en`). Los destinos cuyo slug cambia entre idiomas se configuran
 *   en WordPress con la ruta de su idioma, como hace el menú del pie.
 * - URLs externas, `mailto:` y `tel:`: intactas.
 */
export function localizeCtaUrl(rawUrl: string, locale: string): string {
  const url = rawUrl.trim();

  if (!url) {
    return rawUrl;
  }

  if (url.startsWith('#')) {
    return serviceAnchorHref(url, locale);
  }

  if (!url.startsWith('/')) {
    return rawUrl;
  }

  const [path, suffix] = splitSuffix(url);

  if (CONTACT_PATHS.has(path)) {
    return `${contactCtaUrl(locale)}${suffix}`;
  }

  return `${withLocalePrefix(path, locale)}${suffix}`;
}

/** Separa la ruta de la query string y el fragmento de una URL interna. */
function splitSuffix(url: string): [string, string] {
  const index = url.search(/[?#]/);

  if (index === -1) {
    return [url, ''];
  }

  return [url.slice(0, index), url.slice(index)];
}

/** Ruta interna con el prefijo del idioma de la página. */
function withLocalePrefix(path: string, locale: string): string {
  const withoutPrefix = path.replace(/^\/en(?=\/|$)/, '') || '/';

  return locale === 'en' ? `/en${withoutPrefix}` : withoutPrefix;
}

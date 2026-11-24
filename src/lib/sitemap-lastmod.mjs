/**
 * RGW-343 — `lastmod` del sitemap a partir de la fecha nativa `modified`
 * de WordPress.
 *
 * Expone una función de `serialize` para @astrojs/sitemap que, por cada
 * URL del sitemap, resuelve el slug de la ruta, consulta WordPress
 * (pages y CPT `service`) por ese slug e idioma y asigna el campo
 * nativo `modified` como `lastmod`. Cuando no existe o no es válida, no
 * se asigna fecha (el sitemap omite el atributo para esa URL).
 *
 * Es un módulo JavaScript puro para poder importarse desde
 * `astro.config.mjs` (ESM) sin depender de TypeScript ni del runtime de
 * Astro.
 */

const WP_BASE = (
  (typeof import.meta !== 'undefined' && import.meta.env?.WORDPRESS_URL) ||
  process.env.WORDPRESS_URL ||
  ''
).replace(/\/+$/, '');

/** Caché de módulo: url pública -> modified (string ISO) | null. */
const cache = new Map();

/**
 * Extrae el último segmento de ruta de una URL pública (el slug).
 * Devuelve '' cuando no hay segmento (p. ej. la portada `/` o `/en/`).
 */
function slugFromUrl(url) {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    return segments.pop() || '';
  } catch {
    return '';
  }
}

/**
 * Infiere el locale de Polylang a partir de la URL pública.
 * `/en/...` → 'en'; cualquier otra → 'es'.
 */
function localeFromUrl(url) {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    return segments[0] === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

async function wpFetch(path) {
  try {
    const response = await fetch(`${WP_BASE}/wp-json${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

/**
 * Devuelve el valor `modified` si es una fecha ISO 8601 válida, o null.
 * No se inventa ni se normaliza a otra fecha.
 */
function validModified(value) {
  if (typeof value !== 'string' || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : value;
}

/**
 * Resuelve el `modified` de WordPress para una URL pública del sitemap.
 * Consulta pages y servicios publicados del locale inferido.
 */
export async function lastmodForUrl(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const slug = slugFromUrl(url);
  let modified = null;

  if (slug) {
    const locale = localeFromUrl(url);
    const query = `slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(locale)}`;

    // Páginas de WordPress (/wp/v2/pages).
    const pages = await wpFetch(`/wp/v2/pages?${query}`);
    if (Array.isArray(pages)) {
      const page = pages.find(
        (item) =>
          item.slug === slug &&
          item.status === 'publish' &&
          item.lang === locale,
      );
      if (page) {
        modified = validModified(page.modified);
      }
    }

    // CPT `service` (/wp/v2/services) solo si no se encontró en pages.
    if (!modified) {
      const services = await wpFetch(`/wp/v2/services?${query}`);
      if (Array.isArray(services)) {
        const service = services.find(
          (item) =>
            item.slug === slug &&
            item.status === 'publish' &&
            item.lang === locale,
        );
        if (service) {
          modified = validModified(service.modified);
        }
      }
    }
  }

  cache.set(url, modified);
  return modified;
}

/**
 * Función de `serialize` para @astrojs/sitemap.
 * Inyecta `lastmod` desde el `modified` de WordPress cuando existe.
 */
export async function sitemapSerialize(item) {
  const modified = await lastmodForUrl(item.url);

  if (modified) {
    return { ...item, lastmod: modified };
  }

  return item;
}

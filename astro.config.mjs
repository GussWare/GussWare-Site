// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

// Variables de entorno (proceso gana sobre `.env`): única fuente para
// `site` y para el descubrimiento del sitemap en este archivo.
const env = {
  ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''),
  ...process.env,
};

// URL pública del sitio (sitemap, canonical, robots). En producción se
// define mediante `SITE_URL=https://DOMINIO_REAL` sin modificar código;
// en local, el valor por defecto apunta al entorno de desarrollo.
const site = env.SITE_URL ?? 'http://localhost:4321';

/**
 * Descubre las URLs públicas reales (ES/EN) desde WordPress/Polylang
 * para `customPages` del sitemap. Sin literales de URLs: slugs e
 * idiomas provienen de la API; las front pages se resuelven por
 * designación (PLL `page_on_front` → `show_on_front`/`page_on_front`)
 * con respaldo `inicio`/`home`; el resto usa su slug (`/` y `/en/`
 * para portadas, `/blog/<slug>` y `/en/blog/<slug>` para posts).
 * Ante cualquier fallo devuelve `[]` (el build nunca se rompe y el
 * sitemap conserva las rutas autodetectadas).
 */
async function discoverSitemapUrls() {
  /** @type {string[]} */
  const urls = [];

  try {
    const wpBase = (env.WP_API_URL ?? '').replace(/\/+$/, '');

    if (!wpBase) {
      return urls;
    }

    /** @type {Record<string, string>} */
    const headers = { Accept: 'application/json' };
    const { POSTMAN_APP_USERNAME, POSTMAN_APP_PASSWORD } = env;

    if (POSTMAN_APP_USERNAME && POSTMAN_APP_PASSWORD) {
      const credentials =
        typeof Buffer !== 'undefined'
          ? Buffer.from(
              `${POSTMAN_APP_USERNAME}:${POSTMAN_APP_PASSWORD}`,
            ).toString('base64')
          : btoa(`${POSTMAN_APP_USERNAME}:${POSTMAN_APP_PASSWORD}`);
      headers.Authorization = `Basic ${credentials}`;
    }

    /** @param {string} path */
    const get = async (path) => {
      const response = await fetch(`${wpBase}/wp-json${path}`, { headers });

      if (!response.ok) {
        throw new Error(`WordPress API respondió ${response.status}.`);
      }

      return response.json();
    };

    const [pages, posts, languages, settings] = await Promise.all([
      get('/wp/v2/pages?per_page=100&_fields=id,slug,status,lang').catch(
        () => null,
      ),
      get('/wp/v2/posts?per_page=100&_fields=id,slug,status,lang').catch(
        () => null,
      ),
      get('/pll/v1/languages').catch(() => null),
      get('/wp/v2/settings').catch(() => null),
    ]);

    if (!Array.isArray(pages) || !Array.isArray(posts)) {
      return urls;
    }

    const publishedPages = pages.filter((item) => item?.status === 'publish');
    const publishedPosts = posts.filter((item) => item?.status === 'publish');

    /** @param {string} locale */
    const frontPageId = (locale) => {
      const entry = Array.isArray(languages)
        ? languages.find((item) => item?.slug === locale)
        : null;

      if (Number.isInteger(entry?.page_on_front) && entry.page_on_front > 0) {
        return entry.page_on_front;
      }

      if (
        settings?.show_on_front === 'page' &&
        Number.isInteger(settings?.page_on_front) &&
        settings.page_on_front > 0
      ) {
        return settings.page_on_front;
      }

      return null;
    };

    /** @param {string} locale */
    const fallbackSlug = (locale) => (locale === 'en' ? 'home' : 'inicio');
    // Prefijo de locale según `i18n` (`es` sin prefijo, resto con `/<locale>`).
    /** @param {string} locale */
    const isDefaultLocale = (locale) => locale === 'es';
    /** @param {string} locale */
    const rootFor = (locale) => (isDefaultLocale(locale) ? '/' : `/${locale}/`);
    /** @param {string} locale @param {string[]} segments */
    const pathFor = (locale, ...segments) =>
      `${isDefaultLocale(locale) ? '' : `/${locale}`}/${segments.join('/')}/`;
    const frontIds = new Set();

    for (const locale of ['es', 'en']) {
      let front = null;
      const designatedId = frontPageId(locale);

      if (designatedId) {
        const candidate = publishedPages.find(
          (item) => item.id === designatedId && item.lang === locale,
        );

        if (candidate) {
          front = candidate;
        }
      }

      front ??= publishedPages.find(
        (item) => item.slug === fallbackSlug(locale) && item.lang === locale,
      );

      if (front) {
        frontIds.add(front.id);
        urls.push(rootFor(locale));
      }
    }

    for (const item of publishedPages) {
      if (!item?.slug || frontIds.has(item.id)) {
        continue;
      }

      urls.push(pathFor(item.lang ?? 'es', item.slug));
    }

    for (const item of publishedPosts) {
      if (!item?.slug) {
        continue;
      }

      urls.push(pathFor(item.lang ?? 'es', 'blog', item.slug));
    }

    // Listados del Blog por idioma con posts publicados (las rutas
    // `[locale]/blog` parametrizadas no son autodetectables).
    const postLocales = new Set(
      publishedPosts.map((item) => item.lang ?? 'es'),
    );

    for (const locale of postLocales) {
      urls.push(pathFor(locale, 'blog'));
    }
  } catch {
    return [];
  }

  return urls;
}

const sitemapUrls = await discoverSitemapUrls().catch(() => []);

// https://astro.build/config
export default defineConfig({
  site,

  adapter: node({
    mode: 'standalone',
  }),

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // URLs dinámicas (rutas con parámetros no autodetectables),
      // descubiertas desde WordPress/Polylang con `site` como base.
      customPages: sitemapUrls.map((path) => new URL(path, site).href),
    }),
  ],
});

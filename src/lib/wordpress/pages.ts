import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { WpPage } from './types';

/**
 * RGW-55 — Resuelve una Page de WordPress por slug e idioma.
 *
 * Utiliza el endpoint nativo `/wp/v2/pages` con los parámetros
 * `slug` + `lang` de Polylang como fuente de verdad: sin mapas
 * manuales de IDs, la relación entre traducciones (`translations`)
 * proviene de WordPress. No aplica fallback entre idiomas.
 */
export async function getPageBySlug(
  slug: string,
  lang: string,
): Promise<WpPage | null> {
  try {
    const data = await wpFetch<WpPage[]>(wpRoutes.pageBySlug(slug, lang));
    const page = Array.isArray(data)
      ? data.find(
          (item) =>
            item.slug === slug &&
            item.status === 'publish' &&
            item.lang === lang,
        )
      : undefined;
    return page ?? null;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { getLanguages } from './languages';
import type { WpPage, WpSettings } from './types';

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

/**
 * Obtiene una Page por ID (p. ej. el ID de una traducción indicada en
 * `translations`). Sin mapas manuales: el ID siempre proviene de
 * WordPress/Polylang.
 */
export async function getPageById(id: number): Promise<WpPage | null> {
  try {
    const data = await wpFetch<WpPage>(wpRoutes.page(id));
    return data && data.status === 'publish' ? data : null;
  } catch (error) {
    console.error('Error fetching page by ID:', error);
    return null;
  }
}

/**
 * ID de la Page configurada como portada para un locale, según
 * WordPress/Polylang: designación por idioma (`page_on_front` de
 * `/pll/v1/languages`) o portada global (`show_on_front`/`page_on_front`
 * de `/wp/v2/settings`). `null` si no hay designación válida.
 */
async function getFrontPageId(locale: string): Promise<number | null> {
  const languages = await getLanguages().catch(() => null);
  const entry = languages?.find((item) => item.slug === locale);

  if (
    entry &&
    Number.isInteger(entry.page_on_front) &&
    entry.page_on_front > 0
  ) {
    return entry.page_on_front;
  }

  try {
    const settings = await wpFetch<WpSettings>(wpRoutes.settings);

    if (
      settings?.show_on_front === 'page' &&
      Number.isInteger(settings.page_on_front) &&
      settings.page_on_front > 0
    ) {
      return settings.page_on_front;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Resuelve la Page configurada como portada para un locale.
 *
 * Utiliza el ID designado por WordPress/Polylang (vía `getPageById`,
 * verificando que el idioma coincida) y, solo como respaldo cuando no
 * hay designación válida, los slugs `inicio` (es) / `home` (en).
 * Sin IDs hardcodeados ni lógica específica por página.
 */
export async function getFrontPage(locale: string): Promise<WpPage | null> {
  const frontPageId = await getFrontPageId(locale).catch(() => null);

  if (frontPageId) {
    const page = await getPageById(frontPageId);

    if (page && page.lang === locale) {
      return page;
    }
  }

  // Respaldo: slugs de portada por locale (la designación de WordPress
  // es siempre la fuente primaria).
  const slug = locale === 'en' ? 'home' : 'inicio';
  return getPageBySlug(slug, locale);
}

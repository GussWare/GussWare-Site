/**
 * Rutas internas/publicadas por Astro (fuente única).
 *
 * Centraliza las URLs públicas del sitio para no hardcodearlas en
 * páginas y componentes. Las rutas de la API de WordPress viven en
 * `src/lib/wordpress/routes.ts` (`wpRoutes`) y no pertenecen aquí.
 */
import { getRelativeLocaleUrl } from 'astro:i18n';

export const routes = {
  home: '/',
  blog: '/blog',
  contact: '/contact',
  notFound: '/404',
  blogPost: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
} as const;

/** URLs de una misma página en cada locale (para el selector de idioma). */
export interface LocaleUrls {
  es: string;
  en: string;
}

/** Base del listado del Blog (`/blog`, `/en/blog`) según locale. */
export function blogBaseUrl(locale: string): string {
  return removeBlogTrailingSlash(getRelativeLocaleUrl(locale, 'blog'));
}

/** URL de una página del listado con sus parámetros de consulta. */
export function blogListUrl(
  locale: string,
  page: number,
  search: string,
  catId: number,
): string {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (catId) {
    params.set('category', String(catId));
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const base = blogBaseUrl(locale);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** URL del detalle de un artículo (`/blog/[slug]`, `/en/blog/[slug]`). */
export function blogPostUrl(locale: string, slug: string): string {
  return removeBlogTrailingSlash(getRelativeLocaleUrl(locale, `blog/${slug}`));
}

function removeBlogTrailingSlash(url: string): string {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

/** Raíz del breadcrumb (`Inicio`/`Home`) según el locale actual. */
export interface BreadcrumbRoot {
  label: string;
  href: string;
}

/**
 * Raíz localizada para breadcrumbs: texto (`Inicio`/`Home`) y URL
 * (`/`/`/en/`) según `Astro.currentLocale`. Única lógica de
 * localización de la raíz; el resto de niveles proviene del contenido.
 */
export function getBreadcrumbHome(locale: string): BreadcrumbRoot {
  return locale === 'en'
    ? { label: 'Home', href: getRelativeLocaleUrl('en', '/') }
    : { label: 'Inicio', href: routes.home };
}

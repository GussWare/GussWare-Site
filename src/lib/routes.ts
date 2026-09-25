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

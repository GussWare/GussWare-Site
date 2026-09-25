/**
 * Rutas internas/publicadas por Astro (fuente única).
 *
 * Centraliza las URLs públicas del sitio para no hardcodearlas en
 * páginas y componentes. Las rutas de la API de WordPress viven en
 * `src/lib/wordpress/routes.ts` (`wpRoutes`) y no pertenecen aquí.
 */
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

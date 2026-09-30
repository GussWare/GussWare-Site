import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { WpService, WpServiceSummary } from './types';

/**
 * RGW-EP09-05-02 — Listado de servicios publicados de un locale.
 *
 * Fuente única para el Home, `/servicios` y navegación. Sin mapas
 * manuales: idioma y slugs provienen de WordPress/Polylang.
 */
export async function getServices(locale: string): Promise<WpService[]> {
  try {
    const data = await wpFetch<WpService[]>(wpRoutes.services(locale));
    return Array.isArray(data)
      ? data.filter((item) => item.status === 'publish')
      : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * RGW-EP09-05-02 — Un servicio por slug e idioma (`/servicios/[slug]`).
 *
 * Sin fallback entre idiomas (igual que `getPageBySlug`).
 */
export async function getServiceBySlug(
  slug: string,
  lang: string,
): Promise<WpService | null> {
  try {
    const data = await wpFetch<WpService[]>(
      wpRoutes.serviceBySlug(slug, lang),
    );
    const service = Array.isArray(data)
      ? data.find(
          (item) =>
            item.slug === slug &&
            item.status === 'publish' &&
            item.lang === lang,
        )
      : undefined;
    return service ?? null;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

/** Resumen mínimo para listados a partir de un servicio completo. */
export function toServiceSummary(service: WpService): WpServiceSummary {
  return {
    id: service.id,
    slug: service.slug,
    status: service.status,
    title: service.title,
    excerpt: service.excerpt,
    lang: service.lang,
    translations: service.translations,
  };
}

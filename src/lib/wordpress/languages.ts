import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { WpLanguage } from './types';

/**
 * RGW-56 — Idiomas disponibles en WordPress/Polylang
 * (`/wp-json/pll/v1/languages`), fuente para la configuración de
 * idiomas (sin API alternativa).
 */
export async function getLanguages(): Promise<WpLanguage[] | null> {
  try {
    const data = await wpFetch<WpLanguage[]>(wpRoutes.languages);
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching languages:', error);
    return null;
  }
}

/**
 * Idioma predeterminado según WordPress/Polylang (`is_default`).
 * Solo acepta locales soportados (`es`, `en`); sin default válido,
 * respalda a `es` (único punto con este fallback).
 */
export async function getDefaultLocale(): Promise<string> {
  const languages = await getLanguages().catch(() => null);
  const entry = languages?.find((item) => item.is_default === true);

  if (entry && (entry.slug === 'es' || entry.slug === 'en')) {
    return entry.slug;
  }

  return 'es';
}

/**
 * RGW-335 — Obtención del favicon del Site Icon desde WordPress.
 *
 * Flujo dinámico (sin IDs hardcodeados):
 * 1. `GET /wp/v2/settings` → `site_icon` (ID del attachment).
 * 2. `GET /wp/v2/media/{site_icon}` → datos del attachment con `source_url`.
 *
 * Reutiliza el cliente y tipos existentes para mantener coherencia con
 * la arquitectura del proyecto.
 */

import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { WpMedia, WpSettings } from './types';

/**
 * Obtiene la URL del favicon configurado como Site Icon en WordPress.
 *
 * @returns La URL del favicon o null si no está configurado o falla.
 */
export async function getSiteIcon(): Promise<string | null> {
  try {
    const settings = await wpFetch<WpSettings>(wpRoutes.settings);

    if (!settings || !settings.site_icon || settings.site_icon === 0) {
      return null;
    }

    const media = await wpFetch<WpMedia>(wpRoutes.media(settings.site_icon));

    if (!media || !media.source_url) {
      return null;
    }

    return media.source_url;
  } catch {
    return null;
  }
}
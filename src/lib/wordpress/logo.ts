/**
 * Obtención del logo del Header desde WordPress.
 *
 * Flujo dinámico (sin IDs hardcodeados):
 * 1. `GET /wp/v2/settings` → `site_logo` (ID del attachment).
 * 2. `GET /wp/v2/media/{site_logo}` → datos del attachment.
 * 3. Si el attachment referencia al contenido original mediante el campo
 *    `post` (p. ej. `81 → post: 80`), se resuelve esa relación con
 *    `GET /wp/v2/media/{post}` y se usa el original.
 */

import { wpFetch } from './client';
import type { HeaderLogo, WpMedia, WpSettings } from './types';

async function getMediaById(id: number): Promise<WpMedia> {
  return wpFetch<WpMedia>(`/wp/v2/media/${id}`);
}

function toHeaderLogo(
  media: WpMedia,
  fallbackTitle: string,
): HeaderLogo | null {
  if (!media || !media.source_url) {
    return null;
  }

  return {
    src: media.source_url,
    alt: media.alt_text || media.title?.rendered || fallbackTitle,
  };
}

export async function getHeaderLogo(): Promise<HeaderLogo | null> {
  try {
    const settings = await wpFetch<WpSettings>('/wp/v2/settings');

    if (!settings || !settings.site_logo) {
      return null;
    }

    const media = await getMediaById(settings.site_logo);
    const relatedPostId = media.post;

    if (
      typeof relatedPostId === 'number' &&
      relatedPostId > 0 &&
      relatedPostId !== media.id
    ) {
      try {
        const original = await getMediaById(relatedPostId);
        const resolved = toHeaderLogo(original, settings.title);

        if (resolved) {
          return resolved;
        }
      } catch {
        // Si el original no se puede resolver, se usa el attachment de site_logo.
      }
    }

    return toHeaderLogo(media, settings.title);
  } catch {
    return null;
  }
}

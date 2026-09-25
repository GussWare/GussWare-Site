import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type {
  HeaderData,
  HeaderLogo,
  HeaderLogoMedia,
  HeaderResponse,
} from './types';

function toHeaderLogo(
  media: HeaderLogoMedia | null | undefined,
): HeaderLogo | null {
  if (!media?.url) {
    return null;
  }

  return { src: media.url, alt: media.alt ?? '' };
}

export async function getHeader(): Promise<HeaderData | null> {
  try {
    const data = await wpFetch<HeaderResponse>(wpRoutes.header);
    const button = data.button_section;

    if (!button) {
      return null;
    }

    return {
      ...button,
      logo: toHeaderLogo(data.logo_section?.logo),
      mobileLogo: toHeaderLogo(data.logo_section?.mobile_logo),
    };
  } catch (error) {
    console.error('Error fetching header:', error);
    return null;
  }
}

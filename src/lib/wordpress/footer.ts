import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { getDefaultLocale } from './languages';
import type { FooterDescription, FooterResponse } from './types';

export async function getFooterDescription(
  lang?: string,
): Promise<FooterDescription | null> {
  try {
    const locale = lang ?? (await getDefaultLocale());
    const settings = await wpFetch<FooterResponse>(wpRoutes.footer(locale));
    return settings.footer_section ?? null;
  } catch (error) {
    console.error('Error fetching footer description:', error);
    return null;
  }
}

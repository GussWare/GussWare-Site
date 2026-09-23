import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { FooterDescription, FooterResponse } from './types';

export async function getFooterDescription(): Promise<FooterDescription | null> {
  try {
    const settings = await wpFetch<FooterResponse>(wpRoutes.footer);
    return settings.footer_section ?? null;
  } catch (error) {
    console.error('Error fetching footer description:', error);
    return null;
  }
}

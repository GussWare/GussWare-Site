import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { Header, HeaderResponse } from './types';

export async function getHeader(): Promise<Header | null> {
  try {
    const data = await wpFetch<HeaderResponse>(wpRoutes.header);
    return data.button_section ?? null;
  } catch (error) {
    console.error('Error fetching header:', error);
    return null;
  }
}

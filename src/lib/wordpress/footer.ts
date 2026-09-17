import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { FooterDescription } from './types';

export async function getFooterDescription(): Promise<FooterDescription | null> {
    try {
        const settings = await wpFetch<FooterDescription>(wpRoutes.footer);
        return settings;
    } catch (error) {
        console.error('Error fetching footer description:', error);
        return null;
    }
}
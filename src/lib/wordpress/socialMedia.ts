import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { SocialMedia, SocialMediaItem } from './types';

export async function getSocialMedia(): Promise<SocialMediaItem[] | null> {
    try {
        const data = await wpFetch<SocialMedia>(wpRoutes.socialMedia);
        const result = (data.redes_sociales ?? [])
            .filter((social) => social.estado)
            .sort((a, b) => a.orden - b.orden);

        return result;
    } catch (error) {
        console.error('Error fetching redes sociales:', error);
        return null;
    }
}
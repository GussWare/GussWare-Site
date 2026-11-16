import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { SocialMedia, SocialMediaItem } from './types';

export async function getSocialMedia(): Promise<SocialMediaItem[] | null> {
  try {
    const data = await wpFetch<SocialMedia>(wpRoutes.socialMedia);
    const result = (data.social_media ?? [])
      .filter((social) => social.status)
      .sort((a, b) => Number(a.order) - Number(b.order));

    return result;
  } catch (error) {
    console.error('Error fetching social media:', error);
    return null;
  }
}

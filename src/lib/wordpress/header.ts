import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { Header } from './types';

export async function getHeader(): Promise<Header | null> {
    try {
        const data = await wpFetch<Header>(wpRoutes.header);
        return data;
    } catch (error) {
        console.error('Error fetching header:', error);
        return null;
    }
}
import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { Contact } from './types';

export async function getContact(): Promise<Contact | null> {
    try {
        const data = await wpFetch<Contact>(wpRoutes.contact);
        return data;
    } catch (error) {
        console.error('Error fetching contact information:', error);
        return null;
    }
}
import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { Contact, ContactResponse } from './types';

export async function getContact(): Promise<Contact | null> {
  try {
    const data = await wpFetch<ContactResponse>(wpRoutes.contact);
    return data.contact_information ?? null;
  } catch (error) {
    console.error('Error fetching contact information:', error);
    return null;
  }
}

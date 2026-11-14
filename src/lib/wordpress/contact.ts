import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { getDefaultLocale } from './languages';
import type { Contact, ContactResponse } from './types';

export async function getContact(lang?: string): Promise<Contact | null> {
  try {
    const locale = lang ?? (await getDefaultLocale());
    const data = await wpFetch<ContactResponse>(wpRoutes.contact(locale));
    return data.contact_information ?? null;
  } catch (error) {
    console.error('Error fetching contact information:', error);
    return null;
  }
}

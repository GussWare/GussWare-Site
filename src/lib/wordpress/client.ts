/**
 * Cliente HTTP de WordPress REST API.
 *
 * La URL base se lee de la variable de entorno `WP_API_URL` (sin hardcodear).
 * Si existen credenciales de aplicación (`POSTMAN_APP_USERNAME` /
 * `POSTMAN_APP_PASSWORD`), se envían como Basic Auth, necesario para
 * endpoints restringidos como `/wp/v2/settings`.
 */

function getWpApiUrl(): string {
  const baseUrl = import.meta.env.WP_API_URL as string | undefined;

  if (!baseUrl) {
    throw new Error('Falta la variable de entorno WP_API_URL.');
  }

  return baseUrl.replace(/\/+$/, '');
}

function getAuthHeaders(): Record<string, string> {
  const username = import.meta.env.POSTMAN_APP_USERNAME as string | undefined;
  const password = import.meta.env.POSTMAN_APP_PASSWORD as string | undefined;

  if (!username || !password) {
    return {};
  }

  const credentials =
    typeof Buffer !== 'undefined'
      ? Buffer.from(`${username}:${password}`).toString('base64')
      : btoa(`${username}:${password}`);

  return { Authorization: `Basic ${credentials}` };
}

export async function wpFetch<T>(path: string): Promise<T> {
  const url = `${getWpApiUrl()}/wp-json${path}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API respondió ${response.status} para ${path}.`);
  }

  return (await response.json()) as T;
}

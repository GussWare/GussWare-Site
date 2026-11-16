/**
 * Elimina las etiquetas HTML de un fragmento renderizado por WordPress
 * (títulos, extractos) y normaliza el espaciado, dejándolo listo para
 * mostrar como texto plano.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

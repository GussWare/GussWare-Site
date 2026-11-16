import type { APIContext } from 'astro';

/**
 * `robots.txt` dinámico: la URL del sitemap se construye con `site` de
 * la configuración de Astro (sin dominios hardcodeados).
 */
export function GET({ site }: APIContext): Response {
  const sitemapUrl = site
    ? new URL('sitemap-index.xml', site).href
    : '/sitemap-index.xml';
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

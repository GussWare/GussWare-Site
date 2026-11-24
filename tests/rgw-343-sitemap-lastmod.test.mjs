/**
 * RGW-343 — Fechas nativas de WordPress para el `lastmod` del sitemap.
 *
 * Verifica que el sitemap generado por @astrojs/sitemap inyecte el
 * atributo `lastmod` a partir del campo nativo `modified` de WordPress
 * para las URLs con contenido asociado, y que no invente fechas para
 * rutas estáticas sin contenido de WordPress.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const CONFIG = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf-8');

const { lastmodForUrl, sitemapSerialize } = await import(
  new URL('../src/lib/sitemap-lastmod.mjs', import.meta.url)
);

function fakeFetch(responder) {
  globalThis.fetch = async (url) => {
    const body = await responder(url);
    return {
      ok: true,
      status: 200,
      json: async () => body,
    };
  };
}

function restoreFetch() {
  delete globalThis.fetch;
}

describe('RGW-343 — configuración del sitemap', () => {
  test('el sitemap conserva su filtro actual (excluye navfixturetest)', () => {
    assert.ok(
      CONFIG.includes("!page.includes('/navfixturetest')"),
      'el filtro del sitemap debe seguir excluyendo navfixturetest',
    );
  });

  test('el sitemap se sigue generando con @astrojs/sitemap', () => {
    assert.ok(CONFIG.includes("sitemap("), 'debe usar la integración @astrojs/sitemap');
    assert.ok(
      CONFIG.includes("import sitemap from '@astrojs/sitemap'"),
      'debe importar @astrojs/sitemap',
    );
  });

  test('el sitemap define una función serialize para inyectar lastmod', () => {
    assert.ok(
      CONFIG.includes('serialize'),
      'astro.config.mjs debe definir serialize en el sitemap',
    );
  });

  test('no se usa una fecha de build/global como lastmod (sin `lastmod: Date` directo)', () => {
    assert.ok(
      !/lastmod:\s*new\s*Date/.test(CONFIG),
      'no debe asignar una fecha de build como lastmod global',
    );
  });
});

describe('RGW-343 — lastmodForUrl (WordPress `modified`)', () => {
  test('devuelve el `modified` de una page publicada', async () => {
    fakeFetch(() => [{ id: 1, slug: 'politica-de-privacidad', status: 'publish', lang: 'es', modified: '2026-11-20T10:00:00' }]);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/politica-de-privacidad/');
      assert.equal(modified, '2026-11-20T10:00:00');
    } finally {
      restoreFetch();
    }
  });

  test('devuelve el `modified` de un servicio publicado (CPT service)', async () => {
    fakeFetch(() => [
      { id: 5, slug: 'disenoweb', status: 'publish', lang: 'es', modified: '2026-11-19T08:30:00' },
    ]);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/servicios/disenoweb/');
      assert.equal(modified, '2026-11-19T08:30:00');
    } finally {
      restoreFetch();
    }
  });

  test('respeta el locale de Polylang (en)', async () => {
    fakeFetch(() => [
      { id: 9, slug: 'privacy-policy', status: 'publish', lang: 'en', modified: '2026-11-18T12:00:00' },
    ]);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/en/privacy-policy/');
      assert.equal(modified, '2026-11-18T12:00:00');
    } finally {
      restoreFetch();
    }
  });

  test('devuelve null cuando la fecha `modified` no es válida (no inventa fecha)', async () => {
    fakeFetch(() => [{ id: 2, slug: 'sin-fecha', status: 'publish', lang: 'es', modified: 'no-es-una-fecha' }]);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/sin-fecha/');
      assert.equal(modified, null);
    } finally {
      restoreFetch();
    }
  });

  test('devuelve null cuando `modified` falta en el contenido', async () => {
    fakeFetch(() => [{ id: 3, slug: 'sin-modified', status: 'publish', lang: 'es' }]);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/sin-modified/');
      assert.equal(modified, null);
    } finally {
      restoreFetch();
    }
  });

  test('devuelve null cuando WordPress no devuelve contenido para la URL', async () => {
    fakeFetch(() => []);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/servicios/inexistente/');
      assert.equal(modified, null);
    } finally {
      restoreFetch();
    }
  });

  test('devuelve null para rutas estáticas sin slug (p. ej. portada)', async () => {
    fakeFetch(() => []);
    try {
      const modified = await lastmodForUrl('https://gussware.dev/');
      assert.equal(modified, null);
    } finally {
      restoreFetch();
    }
  });

  test('usa el caché de módulo (no vuelve a consultar la misma URL)', async () => {
    let llamadas = 0;
    fakeFetch(() => {
      llamadas += 1;
      return [{ id: 1, slug: 'cache-test', status: 'publish', lang: 'es', modified: '2026-11-17T00:00:00' }];
    });
    try {
      const a = await lastmodForUrl('https://gussware.dev/cache-test/');
      const b = await lastmodForUrl('https://gussware.dev/cache-test/');
      assert.equal(a, '2026-11-17T00:00:00');
      assert.equal(b, '2026-11-17T00:00:00');
      assert.equal(llamadas, 1, 'debe consultar WordPress una sola vez por URL');
    } finally {
      restoreFetch();
    }
  });
});

describe('RGW-343 — sitemapSerialize', () => {
  test('inyecta `lastmod` cuando existe una fecha válida', async () => {
    fakeFetch(() => [{ id: 1, slug: 'contacto', status: 'publish', lang: 'es', modified: '2026-11-15T09:00:00' }]);
    try {
      const item = { url: 'https://gussware.dev/contacto/', lastmod: undefined };
      const resultado = await sitemapSerialize(item);
      assert.equal(resultado.lastmod, '2026-11-15T09:00:00');
      assert.equal(resultado.url, item.url);
    } finally {
      restoreFetch();
    }
  });

  test('no inyecta `lastmod` cuando no hay fecha válida', async () => {
    fakeFetch(() => []);
    try {
      const item = { url: 'https://gussware.dev/estatica/', lastmod: undefined };
      const resultado = await sitemapSerialize(item);
      assert.equal(resultado.lastmod, undefined);
      assert.equal(resultado.url, item.url);
    } finally {
      restoreFetch();
    }
  });
});

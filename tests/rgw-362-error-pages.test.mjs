/**
 * RGW-362 — Selector de idioma en 404 y canonical de 500.
 *
 * Verifica que:
 * - `Layout` acepta una URL canónica explícita (`canonical`) y la usa
 *   en lugar de la calculada desde la ruta lógica (que para las páginas
 *   de error apunta a rutas inexistentes: `/404/`, `/500/`).
 * - Las páginas 404 y 500 declaran un canonical válido (`404.html`,
 *   `500.html`) y su selector de idioma apunta a destinos existentes
 *   (es: la propia página de error; en: fallback al inicio en inglés).
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const F404 = readFileSync(new URL('../src/pages/404.astro', import.meta.url), 'utf-8');
const F500 = readFileSync(new URL('../src/pages/500.astro', import.meta.url), 'utf-8');
const LAYOUT = readFileSync(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf-8');

describe('RGW-362 — páginas de error', () => {
  test('Layout acepta una URL canónica explícita', () => {
    assert.ok(
      LAYOUT.includes('canonical?: string'),
      'Layout debe declarar la prop opcional canonical',
    );
    assert.ok(
      LAYOUT.includes('canonicalProp ?? canonicalUrl'),
      'Layout debe usar la prop canonical cuando se proporciona',
    );
  });

  test('la página 404 declara un canonical válido', () => {
    assert.ok(
      F404.includes('canonical="/404.html"'),
      '404.astro debe declarar canonical="/404.html"',
    );
    assert.ok(
      !F404.includes('canonical="/404/"'),
      '404.astro no debe declarar canonical="/404/"',
    );
  });

  test('la página 500 declara un canonical válido', () => {
    assert.ok(
      F500.includes('canonical="/500.html"'),
      '500.astro debe declarar canonical="/500.html"',
    );
    assert.ok(
      !F500.includes('canonical="/500/"'),
      '500.astro no debe declarar canonical="/500/"',
    );
  });

  test('el selector de idioma de 404 no genera destinos inexistentes', () => {
    assert.ok(
      F404.includes("es: '/404.html'"),
      '404.astro debe resolver el español a /404.html',
    );
    assert.ok(
      F404.includes("getRelativeLocaleUrl('en', '/')"),
      '404.astro debe resolver el inglés al inicio en inglés',
    );
    assert.ok(
      !F404.includes('/en/404'),
      '404.astro no debe apuntar a /en/404',
    );
  });

  test('el selector de idioma de 500 no genera destinos inexistentes', () => {
    assert.ok(
      F500.includes("es: '/500.html'"),
      '500.astro debe resolver el español a /500.html',
    );
    assert.ok(
      F500.includes("getRelativeLocaleUrl('en', '/')"),
      '500.astro debe resolver el inglés al inicio en inglés',
    );
    assert.ok(
      !F500.includes('/en/500'),
      '500.astro no debe apuntar a /en/500',
    );
  });
});

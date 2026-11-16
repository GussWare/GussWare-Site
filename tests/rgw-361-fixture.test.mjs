/**
 * RGW-361 — Fixture y rutas de prueba no se publican en producción.
 *
 * Verifica a nivel de configuración que el build de producción excluya la
 * página de fixture `/navfixturetest/` y que el mecanismo de exclusión
 * solo se active en modo `production` (se conserva en desarrollo y en
 * entornos de prueba).
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const CONFIG = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf-8');

describe('RGW-361 — exclusión de fixtures en producción', () => {
  test('el build excluye navfixturetest en modo producción', () => {
    assert.ok(
      CONFIG.includes('astro:build:done'),
      'astro.config.mjs debe declarar el hook astro:build:done',
    );
    assert.ok(
      CONFIG.includes("resolveMode() === 'production'"),
      'la exclusión debe activarse solo en modo producción',
    );
    assert.ok(
      CONFIG.includes("join(outDir, 'navfixturetest')") ||
        CONFIG.includes("join(outDir, \"navfixturetest\")"),
      'debe eliminar el directorio dist/navfixturetest',
    );
    assert.ok(
      CONFIG.includes('recursive: true'),
      'la eliminación debe ser recursiva',
    );
  });

  test('la exclusión no se activa en desarrollo ni en pruebas', () => {
    assert.ok(
      CONFIG.includes("resolveMode() === 'production'"),
      'el modo de desarrollo y pruebas no queda excluido',
    );
  });

  test('el sitemap ya no expone navfixturetest (defensa en profundidad)', () => {
    assert.ok(
      CONFIG.includes("!page.includes('/navfixturetest')"),
      'el filtro del sitemap debe seguir excluyendo navfixturetest',
    );
  });
});

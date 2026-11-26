/**
 * RGW-376 — El modo predeterminado de Astro debe ser development.
 *
 * Verifica que `resolveMode()` devuelva `development` cuando no se
 * especifica `--mode`, y que `--mode production` / `--mode staging`
 * sigan resolviendo explícitamente.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolveMode } from '../astro.config.mjs';

describe('RGW-376 — modo predeterminado de Astro', () => {
  test('sin --mode, resolveMode() devuelve development', () => {
    assert.equal(resolveMode([]), 'development');
  });

  test('npm run dev sin --mode resuelve development', () => {
    assert.equal(resolveMode(['dev']), 'development');
  });

  test('npm run build sin --mode resuelve development', () => {
    assert.equal(resolveMode(['build']), 'development');
  });

  test('--mode production resuelve producción explícitamente', () => {
    assert.equal(resolveMode(['build', '--mode', 'production']), 'production');
  });

  test('--mode staging resuelve staging explícitamente', () => {
    assert.equal(resolveMode(['build', '--mode', 'staging']), 'staging');
  });

  test('--mode development resuelve development explícitamente', () => {
    assert.equal(
      resolveMode(['build', '--mode', 'development']),
      'development',
    );
  });
});

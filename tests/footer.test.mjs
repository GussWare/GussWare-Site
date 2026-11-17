/**
 * RGW-359 — Footer en inglés y menú responsive móvil (P-07, P-10).
 *
 * P-07: el menú del footer desaparece por debajo de 768 px porque su
 * contenedor de columnas está oculto por defecto sin override de
 * visualización en móvil (`hidden … md:grid lg:hidden`). El menú debe
 * permanecer visible y apilado en móvil.
 *
 * P-10: el endpoint del footer ignora `lang` y devuelve el mismo texto
 * en español para ambos idiomas. Las páginas EN no deben mostrar
 * descripción ni copyright en español; se resuelven traducciones al
 * inglés como fallback en el frontend.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FOOTER_SOURCE = readFileSync(
  new URL('../src/components/layout/Footer.astro', import.meta.url),
  'utf-8',
);

// RGW-359 — Traducciones al inglés del footer (fallback cuando el CMS
// no devuelve valor en inglés).
import { getFooterTexts, FOOTER_TEXT_EN } from '../src/lib/footer-i18n.ts';

describe('RGW-359 — P-07: menú del footer visible en móvil (< 768 px)', () => {
  test('el contenedor de columnas no está oculto por defecto en móvil', () => {
    // Antes de la corrección: `hidden grid-cols-4 md:grid lg:hidden`
    // (oculto < 768 px). Después: visible en móvil (grid-cols-1),
    // 4 columnas en md, oculto en lg donde entra la segunda copia.
    assert.ok(
      !/hidden\s+grid-cols-4\s+md:grid\s+lg:hidden/.test(FOOTER_SOURCE),
      'El menú del footer no debe estar oculto por defecto sin override móvil',
    );
  });

  test('el menú apila columnas en móvil (grid-cols-1)', () => {
    assert.ok(
      /grid-cols-1/.test(FOOTER_SOURCE),
      'El menú del footer debe usar grid-cols-1 en móvil',
    );
  });

  test('el menú usa 4 columnas desde el breakpoint md', () => {
    assert.ok(
      /md:grid-cols-4/.test(FOOTER_SOURCE),
      'El menú del footer debe usar md:grid-cols-4',
    );
  });

  test('la primera copia se oculta en lg, donde entra la segunda copia', () => {
    assert.ok(
      /lg:hidden/.test(FOOTER_SOURCE),
      'La primera copia del menú debe ocultarse en lg',
    );
  });
});

describe('RGW-359 — P-10: footer en inglés', () => {
  test('existe una traducción al inglés de la descripción y copyright del footer', () => {
    assert.equal(typeof FOOTER_TEXT_EN.footer_description, 'string');
    assert.ok(FOOTER_TEXT_EN.footer_description.trim().length > 0);
    assert.equal(typeof FOOTER_TEXT_EN.footer_copyright, 'string');
    assert.ok(FOOTER_TEXT_EN.footer_copyright.trim().length > 0);
  });

  test('getFooterTexts devuelve inglés solo para el locale en', () => {
    const en = getFooterTexts('en');
    assert.equal(en.footer_description, FOOTER_TEXT_EN.footer_description);
    assert.equal(en.footer_copyright, FOOTER_TEXT_EN.footer_copyright);

    const es = getFooterTexts('es');
    assert.equal(es, null, 'Para español no hay fallback del frontend (viene del CMS)');
  });

  test('la traducción EN no contiene el texto en español', () => {
    const en = getFooterTexts('en');
    assert.ok(
      !/Tecnolog\u00eda construida/.test(en.footer_description),
      'La descripción EN no debe contener el texto en español',
    );
    assert.ok(/Technology built/.test(en.footer_description), 'La descripción EN debe estar en inglés');
    assert.ok(/All rights reserved/.test(en.footer_copyright), 'El copyright EN debe usar "All rights reserved"');
    assert.ok(
      !/Todos los derechos/.test(en.footer_copyright),
      'El copyright EN no debe contener el texto en español',
    );
  });
});

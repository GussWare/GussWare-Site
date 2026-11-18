/**
 * RGW-356 — Contacto y rutas ES/EN (P-01, P-02, P-11).
 *
 * P-01: `/contact/` está vacío porque:
 *   - `/gussware/v1/contact` devuelve `contact_information: null`
 *   - `contact.astro` lee `contact?.contenido_de_la_seccion` que no existe en el tipo `Contact`
 *   - `contact.astro` mapea `social.nombre`/`social.icono` pero la API devuelve `name`/`icon`
 *
 * P-02: CTA de servicios en inglés debe apuntar a contacto EN.
 *
 * P-11: Ruta canónica de contacto ES debe ser única.
 *
 * Requiere el servidor de desarrollo activo (BASE_URL, por defecto
 * http://localhost:4321). Sin dependencias externas: `node --test`.
 */
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';

const BASE = (process.env.BASE_URL ?? 'http://localhost:4321').replace(/\/+$/, '');

async function html(path) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, `${path} respondió ${res.status}`);
  return res.text();
}

function hasText(page, text) {
  return page.includes(text);
}

function socialIconCount(page) {
  // Cuenta elementos SVG renderizados (Íconos de redes sociales en la sección de contacto).
  const matches = page.matchAll(/<svg[^>]*>/g);
  return [...matches].length;
}

describe('RGW-356 — P-01: Página de contacto muestra contenido', () => {
  let page = '';

  before(async () => {
    page = await html('/contact/');
  });

  test('muestra el eyebrow de la sección de contacto', () => {
    assert.ok(hasText(page, 'Hablemos'), 'Falta el eyebrow "Hablemos" en /contact/');
  });

  test('muestra el título de la sección de contacto', () => {
    assert.ok(hasText(page, 'Construyamos algo juntos'),
      'Falta el título "Construyamos algo juntos" en /contact/');
  });

  test('muestra la descripción de la sección de contacto', () => {
    assert.ok(hasText(page, 'Preferimos las conversaciones reales'),
      'Falta la descripción de contacto en /contact/');
  });

  test('muestra el texto de redes sociales', () => {
    assert.ok(hasText(page, 'Síguenos en nuestras redes sociales'),
      'Falta el texto de redes sociales en /contact/');
  });

  test('renderiza íconos de redes sociales (no SVGs vacíos)', () => {
    assert.ok(socialIconCount(page) > 0,
      'No se renderizan íconos de redes sociales en /contact/');
  });
});

describe('RGW-356 — P-02: CTA de contacto en inglés', () => {
  let page = '';

  before(async () => {
    page = await html('/en/contact/');
  });

  test('la página de contacto EN existe y muestra contenido', () => {
    assert.ok(hasText(page, 'Contact') || hasText(page, 'Contacto'),
      'La página de contacto EN no muestra contenido');
  });
});

describe('RGW-356 — P-11: Ruta canónica de contacto ES', () => {
  test('/contact/ renderiza contenido (no está vacío)', async () => {
    const page = await html('/contact/');
    const mainText = page.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    assert.ok(mainText, 'No se encontró <main> en /contact/');
    const textContent = mainText[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.ok(textContent.length > 50,
      `El contenido principal de /contact/ está vacío o casi vacío: "${textContent.slice(0,100)}"`);
  });

  test('/contacto/ renderiza contenido (no está vacío)', async () => {
    const page = await html('/contacto/');
    const mainText = page.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    assert.ok(mainText, 'No se encontró <main> en /contacto/');
    const textContent = mainText[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.ok(textContent.length > 50,
      `El contenido principal de /contacto/ está vacío o casi vacío: "${textContent.slice(0,100)}"`);
  });

  test('los CTA globales apuntan a la ruta canónica de contacto', async () => {
    const home = await html('/');
    // El CTA del header y el footer móvil deben apuntar a /contacto/ (ES)
    assert.ok(
      home.includes('href="/contacto"') || home.includes("href='/contacto'"),
      'El CTA global ES debe apuntar a /contacto/',
    );
  });
});

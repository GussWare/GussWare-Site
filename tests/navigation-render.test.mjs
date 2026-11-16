/**
 * RGW-357 — CTA y anclas en el sitio generado.
 *
 * Verifica el HTML que publica el sitio: el CTA del header y el CTA
 * móvil del pie usan la etiqueta y el destino del idioma de la página,
 * los CTA de las páginas de servicio apuntan al contacto y al listado
 * de servicios de su idioma, y las anclas de las secciones del
 * detalle usan el identificador de su idioma.
 *
 * Requiere el sitio generado en ejecución (BASE_URL, por defecto
 * http://localhost:4321). Sin dependencias externas: `node --test`.
 */
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';

const BASE = (process.env.BASE_URL ?? 'http://localhost:4321').replace(/\/+$/, '');

/** Páginas de servicio en cada idioma. */
const PAGINAS = {
  es: '/servicios/diseno-sitios-web-tiendas-en-linea',
  en: '/en/servicios/website-and-online-store-design',
};

async function html(path) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, `${path} respondió ${res.status}`);
  return res.text();
}

/** Destinos de todos los enlaces cuyo texto es el indicado. */
function hrefsOfLinks(page, text) {
  const pattern = new RegExp(`<a[^>]*href="([^"]*)"[^>]*>\\s*${text}\\s*</a>`, 'gi');
  return [...page.matchAll(pattern)].map((match) => match[1]);
}

/**
 * Destino de un enlace sin barra final: el menú de WordPress
 * configura `/en/contact/` y el CTA del frontend `/en/contact`; ambos
 * apuntan a la misma página.
 */
function sinBarraFinal(href) {
  return href.length > 1 ? href.replace(/\/+$/, '') : href;
}

describe('RGW-357 — CTA del header y CTA móvil del pie', () => {
  let es = '';
  let en = '';

  before(async () => {
    es = await html('/');
    en = await html('/en/');
  });

  test('en español la etiqueta y el destino son los del idioma', () => {
    const hrefs = hrefsOfLinks(es, 'Iniciar Conversación');

    assert.ok(hrefs.length > 0, 'No se encontró el CTA de contacto en español');
    for (const href of hrefs) {
      assert.equal(
        sinBarraFinal(href),
        '/contacto',
        `El CTA en español apunta a ${href}`,
      );
    }
  });

  test('en inglés la etiqueta y el destino son los del idioma', () => {
    const hrefs = hrefsOfLinks(en, 'Start a Conversation');

    assert.ok(hrefs.length > 0, 'No se encontró el CTA de contacto en inglés');
    for (const href of hrefs) {
      assert.equal(
        sinBarraFinal(href),
        '/en/contact',
        `El CTA en inglés apunta a ${href}`,
      );
    }
  });

  test('ninguna página muestra el CTA del otro idioma', () => {
    assert.ok(
      !es.includes('Start a Conversation'),
      'La página en español muestra el CTA en inglés',
    );
    assert.ok(
      !en.includes('Iniciar Conversación'),
      'La página en inglés muestra el CTA en español',
    );
  });
});

describe('RGW-357 — CTA de las páginas de servicio', () => {
  let es = '';
  let en = '';

  before(async () => {
    es = await html(PAGINAS.es);
    en = await html(PAGINAS.en);
  });

  test('en español todos los CTA de contacto apuntan a la misma página', () => {
    assert.ok(
      es.includes('href="/contacto"'),
      'El CTA de contacto en español no apunta a /contacto',
    );
    assert.ok(
      !es.includes('href="/contact"'),
      'El CTA de contacto en español sigue apuntando a /contact',
    );
  });

  test('en español el CTA de servicios apunta al listado en español', () => {
    assert.ok(
      es.includes('href="/servicios"'),
      'El CTA de servicios en español no apunta a /servicios',
    );
  });

  test('en inglés los CTA apuntan al contacto y al listado en inglés', () => {
    assert.ok(
      en.includes('href="/en/contact"'),
      'El CTA de contacto en inglés no apunta a /en/contact',
    );
    assert.ok(
      en.includes('href="/en/servicios"'),
      'El CTA de servicios en inglés no apunta a /en/servicios',
    );
    assert.ok(
      !en.includes('href="/contact"'),
      'El CTA de contacto en inglés sigue apuntando a /contact',
    );
    assert.ok(
      !en.includes('href="/servicios"'),
      'El CTA de servicios en inglés sigue apuntando a /servicios',
    );
  });

  test('las anclas del detalle usan el identificador del idioma', () => {
    assert.ok(es.includes('href="#soluciones"'), 'El CTA de soluciones ES no apunta a #soluciones');
    assert.ok(es.includes('id="soluciones"'), 'La sección #soluciones no existe en español');

    assert.ok(en.includes('href="#solutions"'), 'El CTA de soluciones EN no apunta a #solutions');
    assert.ok(en.includes('id="solutions"'), 'La sección #solutions no existe en inglés');
    assert.ok(
      !en.includes('href="#soluciones"'),
      'El CTA de soluciones EN conserva el identificador en español',
    );
  });
});

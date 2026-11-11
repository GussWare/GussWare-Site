/**
 * Renderizado — detalle de servicio y tarjetas del Home.
 *
 * Verifica el HTML que produce Astro con los datos de WordPress:
 * que las secciones `plataformas` y `relacionados` aparezcan cuando hay
 * contenido, que no aparezcan cuando el interruptor está desactivado y
 * que el icono de cada servicio provenga del campo ACF `icono` (y no del
 * fallback por palabra clave del título).
 *
 * Requiere el servidor de desarrollo activo (BASE_URL, por defecto
 * http://localhost:4321). Sin dependencias externas: `node --test`.
 */
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';

const BASE = (process.env.BASE_URL ?? 'http://localhost:4321').replace(/\/+$/, '');

/** Ruta del glifo `arrow-right` del catálogo: el fallback genérico. */
const ARROW_RIGHT = 'M5 12h14';

/** Servicios con y sin el bloque de plataformas, en ES y EN. */
const CASES = {
  esConPlataformas: '/servicios/integracion-de-apis-y-servicios-externos',
  esSinPlataformas: '/servicios/diseno-sitios-web-tiendas-en-linea',
  enConRelacionados: '/en/servicios/website-and-online-store-design',
  enConPlataformas: '/en/servicios/api-and-external-service-integration',
};

async function html(path) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, `${path} respondió ${res.status}`);
  return res.text();
}

/** Extrae el contenido de un elemento `<section id="...">`. */
function section(page, id) {
  const start = page.indexOf(`id="${id}"`);
  if (start === -1) return null;
  const open = page.lastIndexOf('<section', start);
  const close = page.indexOf('</section>', start);
  return page.slice(open, close === -1 ? undefined : close);
}

/** Glifos SVG renderizados dentro de un fragmento. */
function svgPaths(fragment) {
  return [...fragment.matchAll(/<svg[^>]*>(.*?)<\/svg>/gs)].map((m) =>
    [...m[1].matchAll(/d="([^"]+)"/g)].map((d) => d[1]).join('|'),
  );
}

/** Grid de tarjetas de servicios del Home (solo la sección, sin el resto de la página). */
function expertiseCards(page) {
  const start = page.indexOf('data-expertise-grid');
  assert.notEqual(start, -1, 'No se encontró el grid de servicios del Home');
  const end = page.indexOf('data-fiability', start);
  return page.slice(start, end === -1 ? undefined : end);
}

describe('Detalle de servicio — sección `plataformas`', () => {
  let page = '';

  before(async () => {
    page = await html(CASES.esConPlataformas);
  });

  test('se renderiza la sección con id `plataformas`', () => {
    assert.ok(section(page, 'plataformas'), 'No se encontró la sección #plataformas');
  });

  test('muestra las plataformas recibidas de WordPress', () => {
    const block = section(page, 'plataformas');
    for (const name of ['SAP', 'Zoho', 'Salesforce', 'Shopify', 'Microsoft 365', 'WooCommerce']) {
      assert.ok(block.includes(name), `Falta la plataforma "${name}" en el render`);
    }
  });

  test('muestra el ejemplo de uso de cada plataforma', () => {
    const block = section(page, 'plataformas');
    assert.ok(
      block.includes('Sincronizar inventario o pedidos con un sistema empresarial.'),
      'Falta el ejemplo de uso de SAP en el render',
    );
  });

  test('muestra el bloque de consulta con el título, texto y enlace de ACF', () => {
    const block = section(page, 'plataformas');
    assert.ok(
      block.includes('¿Tienes otra plataforma en mente?'),
      'Falta el título del CTA de plataformas',
    );
    assert.ok(
      block.includes('Consultar mi integración'),
      'Falta la etiqueta del enlace del CTA de plataformas',
    );
  });
});

describe('Detalle de servicio — sección `relacionados`', () => {
  let page = '';

  before(async () => {
    page = await html(CASES.esSinPlataformas);
  });

  test('se renderiza la sección con id `relacionados`', () => {
    assert.ok(section(page, 'relacionados'), 'No se encontró la sección #relacionados');
  });

  test('muestra los servicios relacionados con su categoría, nombre y enlace', () => {
    const block = section(page, 'relacionados');
    assert.ok(block.includes('MÓVIL'), 'Falta la categoría del primer relacionado');
    assert.ok(block.includes('Aplicaciones móviles'), 'Falta el nombre del relacionado');
    assert.ok(
      block.includes('/servicios/aplicaciones-moviles'),
      'Falta el enlace del relacionado',
    );
  });

  test('la versión en inglés también renderiza la sección', async () => {
    const en = await html(CASES.enConRelacionados);
    assert.ok(section(en, 'relacionados'), 'La sección #relacionados no aparece en EN');
  });
});

describe('Detalle de servicio — interruptor `platforms_enabled`', () => {
  test('no se renderiza la sección cuando el interruptor está desactivado', async () => {
    const page = await html(CASES.esSinPlataformas);
    assert.equal(
      section(page, 'plataformas'),
      null,
      'La sección #plataformas no debe existir si platforms_enabled es false',
    );
  });

  test('no se renderiza la sección en la traducción EN sin plataformas configuradas', async () => {
    const page = await html(CASES.enConPlataformas);
    assert.equal(
      section(page, 'plataformas'),
      null,
      'La sección #plataformas no debe existir si el interruptor está desactivado',
    );
  });
});

describe('Icono del servicio — campo ACF `icono`', () => {
  test('el detalle renderiza el icono configurado en ACF', async () => {
    const page = await html(CASES.esSinPlataformas);
    const marker = page.indexOf('data-service-icon');
    assert.notEqual(marker, -1, 'El detalle no marca el icono del servicio (data-service-icon)');
    const around = page.slice(marker, marker + 300);
    assert.ok(around.includes('<svg'), 'El marcador del icono no contiene un SVG');
    assert.ok(
      !around.includes(ARROW_RIGHT),
      'El icono del detalle no debe caer en el glifo genérico arrow-right',
    );
  });

  test('las tarjetas del Home ES usan el icono de ACF, no el fallback genérico', async () => {
    const page = await html('/');
    const cards = svgPaths(expertiseCards(page));
    assert.equal(cards.length, 6, `Se esperaban 6 tarjetas, hay ${cards.length}`);
    for (const paths of cards) {
      assert.ok(!paths.includes(ARROW_RIGHT), 'Una tarjeta del Home usa el icono genérico');
    }
    assert.equal(new Set(cards).size, 6, 'Las 6 tarjetas del Home deberían usar iconos distintos');
  });

  test('las tarjetas del Home EN usan el icono de ACF, no el fallback genérico', async () => {
    const page = await html('/en/');
    const cards = svgPaths(expertiseCards(page));
    assert.equal(cards.length, 6, `Se esperaban 6 tarjetas EN, hay ${cards.length}`);
    for (const paths of cards) {
      assert.ok(!paths.includes(ARROW_RIGHT), 'Una tarjeta EN usa el icono genérico');
    }
    assert.equal(new Set(cards).size, 6, 'Las 6 tarjetas EN deberían usar iconos distintos');
  });
});

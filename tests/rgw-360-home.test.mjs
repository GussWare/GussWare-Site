/**
 * RGW-360 — Encabezados de servicios y coherencia Home ES/EN (P-08, F-09, F-12).
 *
 * P-08: los listados de servicios (`/servicios/`, `/en/servicios/`) no
 * tienen encabezado de sección ni `<h1>` porque `getFrontPage(locale).acf.services`
 * es null en las Pages de portada. Se debe renderizar un SectionHeading
 * visible en ambos listados.
 *
 * F-09: el orden de secciones del Home ES es servicios → cómo-trabajamos →
 * nuestro-modelo → preguntas, pero en EN el orden es services → our-model →
 * our-process → questions (Proceso y Modelo intercambiados). Se debe alinear
 * el orden EN al de ES.
 *
 * F-12: el `<title>` del home ES es "Inicio — GussWare" y el de EN es
 * "Home | GussWare" (separador distinto). Se debe unificar el formato.
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

/** Contenido del <title> de la página. */
function titleOf(page) {
  const match = page.match(/<title>([\s\S]*?)<\/title>/);
  return match ? match[1].trim() : null;
}

/** IDs de las secciones del Home, en orden de aparición. */
function homeSectionIds(page) {
  const ids = [];
  const re = /id="(servicios|como-trabajamos|nuestro-modelo|preguntas|services|our-process|our-model|questions)"/g;
  let match;
  while ((match = re.exec(page)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

describe('RGW-360 — P-08: encabezados de los listados de servicios', () => {
  let es = '';
  let en = '';

  before(async () => {
    es = await html('/servicios/');
    en = await html('/en/servicios/');
  });

  test('el listado ES renderiza un encabezado de sección', () => {
    assert.ok(/<h[1-6][^>]*>Servicios<\/h[1-6]/.test(es),
      'El listado de servicios ES debe tener un encabezado "Servicios"');
  });

  test('el listado EN renderiza un encabezado de sección', () => {
    assert.ok(/<h[1-6][^>]*>Services<\/h[1-6]/.test(en),
      'El listado de servicios EN debe tener un encabezado "Services"');
  });
});

describe('RGW-360 — F-09: orden de secciones del Home ES/EN', () => {
  let es = '';
  let en = '';

  before(async () => {
    es = await html('/');
    en = await html('/en/');
  });

  test('el Home ES tiene el orden: servicios → cómo-trabajamos → nuestro-modelo → preguntas', () => {
    const ids = homeSectionIds(es);
    const serviciosIdx = ids.indexOf('servicios');
    const procesoIdx = ids.indexOf('como-trabajamos');
    const modeloIdx = ids.indexOf('nuestro-modelo');
    const faqIdx = ids.indexOf('preguntas');

    assert.ok(serviciosIdx >= 0, 'Falta la sección servicios en el Home ES');
    assert.ok(procesoIdx >= 0, 'Falta la sección cómo-trabajamos en el Home ES');
    assert.ok(modeloIdx >= 0, 'Falta la sección nuestro-modelo en el Home ES');
    assert.ok(faqIdx >= 0, 'Falta la sección preguntas en el Home ES');

    assert.ok(
      serviciosIdx < procesoIdx && procesoIdx < modeloIdx && modeloIdx < faqIdx,
      `El orden ES de secciones es incorrecto: ${ids.join(' → ')}`,
    );
  });

  test('el Home EN tiene el orden: services → our-process → our-model → questions', () => {
    const ids = homeSectionIds(en);
    const servicesIdx = ids.indexOf('services');
    const processIdx = ids.indexOf('our-process');
    const modelIdx = ids.indexOf('our-model');
    const questionsIdx = ids.indexOf('questions');

    assert.ok(servicesIdx >= 0, 'Falta la sección services en el Home EN');
    assert.ok(processIdx >= 0, 'Falta la sección our-process en el Home EN');
    assert.ok(modelIdx >= 0, 'Falta la sección our-model en el Home EN');
    assert.ok(questionsIdx >= 0, 'Falta la sección questions en el Home EN');

    assert.ok(
      servicesIdx < processIdx && processIdx < modelIdx && modelIdx < questionsIdx,
      `El orden EN de secciones es incorrecto: ${ids.join(' → ')}`,
    );
  });
});

describe('RGW-360 — F-12: formato consistente del <title> del Home', () => {
  let es = '';
  let en = '';

  before(async () => {
    es = await html('/');
    en = await html('/en/');
  });

  test('ambos home pages usan el mismo separador en el <title>', () => {
    const esTitle = titleOf(es);
    const enTitle = titleOf(en);

    assert.ok(esTitle, 'El home ES no tiene <title>');
    assert.ok(enTitle, 'El home EN no tiene <title>');

    const esSeparator = esTitle.includes(' — ') ? 'em-dash' :
      esTitle.includes(' | ') ? 'pipe' : 'none';
    const enSeparator = enTitle.includes(' — ') ? 'em-dash' :
      enTitle.includes(' | ') ? 'pipe' : 'none';

    assert.equal(esSeparator, enSeparator,
      `Separador inconsistente: ES="${esSeparator}" (${esTitle}), EN="${enSeparator}" (${enTitle})`);
  });
});

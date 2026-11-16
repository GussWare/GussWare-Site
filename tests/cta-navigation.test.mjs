/**
 * RGW-357 — CTA y anclas por idioma.
 *
 * WordPress guarda en ACF la ruta del destino de cada CTA (a veces en
 * español y a veces en inglés) y el endpoint del header ignora el
 * parámetro `lang`. Estas pruebas fijan la resolución de destinos y
 * etiquetas en el frontend: el CTA de contacto y los CTA de las
 * páginas de servicio se resuelven en el idioma de la página, y las
 * anclas de las secciones del detalle de servicio usan el identificador
 * de su idioma.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  contactCtaLabel,
  contactCtaUrl,
  localizeCtaUrl,
} from '../src/lib/cta.ts';
import {
  serviceAnchorHref,
  serviceAnchors,
} from '../src/lib/services/anchors.ts';

describe('RGW-357 — CTA de contacto', () => {
  test('la etiqueta sigue el idioma de la página', () => {
    assert.equal(contactCtaLabel('es'), 'Iniciar Conversación');
    assert.equal(contactCtaLabel('en'), 'Start a Conversation');
  });

  test('el destino sigue el idioma de la página', () => {
    assert.equal(contactCtaUrl('es'), '/contacto');
    assert.equal(contactCtaUrl('en'), '/en/contact');
  });
});

describe('RGW-357 — destinos de los CTA de WordPress', () => {
  test('un CTA de contacto apunta al contacto del idioma', () => {
    assert.equal(localizeCtaUrl('/contact', 'es'), '/contacto');
    assert.equal(localizeCtaUrl('/contact', 'en'), '/en/contact');
    assert.equal(localizeCtaUrl('/contacto', 'es'), '/contacto');
    assert.equal(localizeCtaUrl('/contacto', 'en'), '/en/contact');
    assert.equal(localizeCtaUrl('/en/contact', 'es'), '/contacto');
    assert.equal(localizeCtaUrl('/en/contact', 'en'), '/en/contact');
  });

  test('el CTA de "ver todos los servicios" apunta al listado del idioma', () => {
    assert.equal(localizeCtaUrl('/servicios', 'es'), '/servicios');
    assert.equal(localizeCtaUrl('/servicios', 'en'), '/en/servicios');
    assert.equal(localizeCtaUrl('/en/servicios', 'es'), '/servicios');
    assert.equal(localizeCtaUrl('/en/servicios', 'en'), '/en/servicios');
  });

  test('una ruta interna conserva su slug y cambia de idioma', () => {
    assert.equal(
      localizeCtaUrl('/en/servicios/website-and-online-store-design', 'en'),
      '/en/servicios/website-and-online-store-design',
    );
  });

  test('las anclas apuntan a la sección del idioma', () => {
    assert.equal(localizeCtaUrl('#soluciones', 'es'), '#soluciones');
    assert.equal(localizeCtaUrl('#soluciones', 'en'), '#solutions');
  });

  test('las URLs externas y los correo no se modifican', () => {
    for (const url of [
      'https://www.facebook.com/enduser87',
      'mailto:privacidad@gmail.com',
      'tel:+525550000000',
    ]) {
      assert.equal(localizeCtaUrl(url, 'en'), url);
    }
  });

  test('un destino vacío se conserva', () => {
    assert.equal(localizeCtaUrl('', 'en'), '');
  });
});

describe('RGW-357 — anclas del detalle de servicio', () => {
  test('cada idioma usa sus propios identificadores', () => {
    assert.deepEqual(serviceAnchors('es'), {
      solutions: 'soluciones',
      methodology: 'metodologia',
      technologies: 'tecnologias',
      platforms: 'plataformas',
      faq: 'faq',
      contact: 'contacto',
      related: 'relacionados',
    });

    assert.deepEqual(serviceAnchors('en'), {
      solutions: 'solutions',
      methodology: 'methodology',
      technologies: 'technologies',
      platforms: 'platforms',
      faq: 'faq',
      contact: 'contact',
      related: 'related',
    });
  });

  test('el identificador se resuelve en el idioma de la página', () => {
    assert.equal(serviceAnchorHref('#soluciones', 'es'), '#soluciones');
    assert.equal(serviceAnchorHref('#soluciones', 'en'), '#solutions');
    assert.equal(serviceAnchorHref('#solutions', 'en'), '#solutions');
    assert.equal(serviceAnchorHref('#solutions', 'es'), '#soluciones');
    assert.equal(serviceAnchorHref('#metodologia', 'en'), '#methodology');
    assert.equal(serviceAnchorHref('#relacionados', 'en'), '#related');
  });

  test('una ancla desconocida se conserva', () => {
    assert.equal(serviceAnchorHref('#otra-seccion', 'en'), '#otra-seccion');
  });
});

/**
 * P5 — Etiquetas legales y URL pública del frontend.
 *
 * Verifica que `{{SITE_URL}}` se resuelve con la URL pública del
 * entorno (la del frontend que se publica), nunca con la del CMS, y que
 * el resto de etiquetas legales siguen funcionando.
 *
 * La configuración se controla por parámetro, de modo que los tres
 * entornos (Local, Staging y Producción) se comprueban sin depender de
 * ninguna variable del proceso ni de servicios externos.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getLegalSiteUrl,
  resolveLegalTokens,
} from '../src/lib/wordpress/legal.ts';

/** Configuración de cada entorno (controlada, sin red). */
const ENTORNOS = [
  {
    nombre: 'Local / DEV',
    siteUrl: 'http://localhost:4321',
    cmsUrl: 'http://gussware.local',
  },
  {
    nombre: 'Staging / TEST',
    siteUrl: 'https://staging.gussware.dev',
    cmsUrl: 'https://staging-cms.gussware.dev',
  },
  {
    nombre: 'Producción / PROD',
    siteUrl: 'https://gussware.dev',
    cmsUrl: 'https://cms.gussware.dev',
  },
];

/** Texto legal mínimo con la etiqueta `{{SITE_URL}}`. */
const CONTENIDO = '<p>Sitio Web Oficial: {{SITE_URL}}</p>';

describe('P5 — `{{SITE_URL}}` usa la URL pública del frontend', () => {
  for (const { nombre, siteUrl, cmsUrl } of ENTORNOS) {
    test(`${nombre}: la URL del sitio es la del entorno`, () => {
      assert.equal(getLegalSiteUrl(siteUrl), siteUrl);
    });

    test(`${nombre}: la etiqueta se resuelve con la URL del frontend`, () => {
      const urlPublica = getLegalSiteUrl(siteUrl);
      const html = resolveLegalTokens(CONTENIDO, {
        legalInfo: null,
        updatedLabel: null,
        siteUrl: urlPublica,
      });

      assert.ok(
        html.includes(urlPublica),
        `La etiqueta no se resolvió con ${urlPublica}: ${html}`,
      );
      assert.ok(
        !html.includes('{{SITE_URL}}'),
        'La etiqueta {{SITE_URL}} quedó sin resolver',
      );
    });

    test(`${nombre}: la URL del CMS no aparece en el texto legal`, () => {
      const html = resolveLegalTokens(CONTENIDO, {
        legalInfo: null,
        updatedLabel: null,
        siteUrl: getLegalSiteUrl(siteUrl),
      });

      assert.ok(
        !html.includes(cmsUrl),
        `El texto legal publica la URL del CMS (${cmsUrl}): ${html}`,
      );
    });
  }

  test('normaliza la barra final y descarta el valor vacío', () => {
    assert.equal(
      getLegalSiteUrl('https://staging.gussware.dev/'),
      'https://staging.gussware.dev',
    );
    assert.equal(getLegalSiteUrl('   '), null);
    assert.equal(getLegalSiteUrl(''), null);
  });

  test('sin configuración efectiva no inventa una URL', () => {
    // Sin `SITE_URL` del entorno no se usa ningún valor por defecto: la
    // etiqueta queda sin resolver en lugar de publicar otra URL.
    assert.equal(getLegalSiteUrl(), null);
  });
});

describe('P5 — el resto de etiquetas legales sigue funcionando', () => {
  const legalInfo = {
    siteName: 'GussWare',
    legalEntityName: 'GussWare',
    legalResponsibleName: 'Guss',
    legalAddress: 'Colonia Zona Centro',
    privacyEmail: 'privacidad@gmail.com',
    contactPhone: '+52 555 000 0000',
    personalDataNameLabel: 'Nombre',
    personalDataEmailLabel: 'Correo',
    personalDataPhoneLabel: 'Teléfono',
  };

  test('sustituye las etiquetas que vienen de `Información legal`', () => {
    const html = resolveLegalTokens(
      '<p>{{SITE_NAME}} · {{LEGAL_ENTITY_NAME}} · {{LEGAL_ADDRESS}} · {{PRIVACY_EMAIL}}</p>',
      {
        legalInfo,
        updatedLabel: null,
        siteUrl: null,
      },
    );

    assert.ok(html.includes('GussWare'));
    assert.ok(html.includes('Colonia Zona Centro'));
    assert.ok(html.includes('privacidad@gmail.com'));
    assert.ok(!html.includes('{{SITE_NAME}}'));
    assert.ok(!html.includes('{{LEGAL_ADDRESS}}'));
    assert.ok(!html.includes('{{PRIVACY_EMAIL}}'));
  });

  test('sustituye la fecha de actualización desde el Custom Field', () => {
    const html = resolveLegalTokens('<p>{{PRIVACY_LAST_UPDATED}}</p>', {
      legalInfo: null,
      updatedLabel: '12 de noviembre de 2026',
      siteUrl: null,
    });

    assert.ok(html.includes('12 de noviembre de 2026'));
    assert.ok(!html.includes('{{PRIVACY_LAST_UPDATED}}'));
  });

  test('deja intactas las etiquetas sin dato disponible', () => {
    const html = resolveLegalTokens(
      '<p>{{SITE_NAME}} · {{PRIVACY_LAST_UPDATED}} · {{SITE_URL}}</p>',
      { legalInfo: null, updatedLabel: null, siteUrl: null },
    );

    assert.ok(html.includes('{{SITE_NAME}}'));
    assert.ok(html.includes('{{PRIVACY_LAST_UPDATED}}'));
    assert.ok(html.includes('{{SITE_URL}}'));
  });
});

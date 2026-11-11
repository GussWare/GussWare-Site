/**
 * Contrato de datos — grupo ACF `Service Detail` del CPT `service`.
 *
 * Comprueba el estado REAL de WordPress (no la tipificación de Astro):
 * que el campo `icono` exista en el grupo `hero`, que viaje en la
 * respuesta REST de las publicaciones ES y EN, que su valor sea un icono
 * del catálogo de `Icon.astro` y que las traducci��ones ES/EN compartan
 * el mismo campo técnico.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Lee `WP_API_URL` del `.env` del proyecto (o del entorno). */
function wpBaseUrl() {
  if (process.env.WP_API_URL) return process.env.WP_API_URL.replace(/\/+$/, '');
  const env = readFileSync(resolve(ROOT, '.env'), 'utf-8');
  const match = env.match(/^WP_API_URL\s*=\s*"?([^"\n]+)"?/m);
  if (!match) throw new Error('No se encontró WP_API_URL');
  return match[1].trim().replace(/\/+$/, '');
}

/** Nombres del catálogo cerrado de iconos (fuente: `icon-catalog.ts`). */
function iconCatalogue() {
  const source = readFileSync(resolve(ROOT, 'src/components/ui/icon-catalog.ts'), 'utf-8');
  const block = source.slice(
    source.indexOf('export const ICON_PATHS'),
    source.indexOf('};', source.indexOf('export const ICON_PATHS')),
  );
  return new Set([...block.matchAll(/^\s*'?([a-z][a-z0-9-]*)'?\s*:/gm)].map((m) => m[1]));
}

/** `Icon.astro` debe dibujar con el catálogo compartido (fuente única). */
function iconComponentUsesCatalog() {
  const source = readFileSync(resolve(ROOT, 'src/components/ui/Icon.astro'), 'utf-8');
  return source.includes("from './icon-catalog'") && source.includes('ICON_PATHS[name]');
}

const BASE = wpBaseUrl();
const CATALOGUE = iconCatalogue();

/** Servicios publicados de un idioma, tal como los expone REST. */
async function services(lang) {
  const res = await fetch(`${BASE}/wp-json/wp/v2/services?per_page=100&lang=${lang}`);
  assert.equal(res.status, 200, `REST /services?lang=${lang} respondió ${res.status}`);
  const body = await res.json();
  assert.ok(Array.isArray(body), 'El REST de servicios no devolvió un array');
  return body;
}

describe('ACF `Service Detail` — campo `icono`', () => {
  let es = [];
  let en = [];

  before(async () => {
    es = await services('es');
    en = await services('en');
  });

  test('el CPT `service` expone 6 publicaciones en ES y 6 en EN', () => {
    assert.equal(es.length, 6, 'Se esperaban 6 servicios ES');
    assert.equal(en.length, 6, 'Se esperaban 6 servicios EN');
  });

  test('toda publicación publicada incluye `acf.hero.icono`', () => {
    for (const service of [...es, ...en]) {
      assert.ok(
        Object.hasOwn(service.acf?.hero ?? {}, 'icono'),
        `El servicio ${service.id} (${service.slug}) no expone acf.hero.icono`,
      );
    }
  });

  test('toda publicación publicada tiene `icono` con valor', () => {
    for (const service of [...es, ...en]) {
      const value = service.acf?.hero?.icono;
      assert.equal(
        typeof value,
        'string',
        `acf.hero.icono del servicio ${service.id} no es texto`,
      );
      assert.ok(
        value.trim().length > 0,
        `acf.hero.icono del servicio ${service.id} (${service.slug}) está vacío`,
      );
    }
  });

  test('`Icon.astro` dibuja con el catálogo compartido', () => {
    assert.ok(
      iconComponentUsesCatalog(),
      'Icon.astro debe usar ICON_PATHS de icon-catalog.ts (fuente única)',
    );
  });

  test('cada valor de `icono` pertenece al catálogo de iconos del proyecto', () => {
    for (const service of [...es, ...en]) {
      const value = service.acf?.hero?.icono ?? '';
      assert.ok(
        CATALOGUE.has(value),
        `El icono "${value}" del servicio ${service.id} no está en el catálogo de Icon.astro`,
      );
    }
  });

  test('ES y EN comparten el mismo campo técnico y el mismo icono por servicio', () => {
    const enById = new Map(en.map((s) => [s.id, s]));
    assert.equal(es.length, en.length);

    for (const service of es) {
      const translationId = service.translations?.en;
      assert.equal(
        typeof translationId,
        'number',
        `El servicio ES ${service.id} no declara traducción EN`,
      );
      const translation = enById.get(translationId);
      assert.ok(translation, `No existe la traducción EN ${translationId}`);
      assert.ok(
        Object.hasOwn(translation.acf?.hero ?? {}, 'icono'),
        `La traducción EN ${translation.id} no expone el campo icono`,
      );
      assert.equal(
        translation.acf.hero.icono,
        service.acf.hero.icono,
        `ES ${service.id} y EN ${translation.id} tienen iconos distintos`,
      );
    }
  });

  test('no existe un campo `icon`/`service_icon`/`icono_...` alterno en el grupo', () => {
    const forbidden = /(^|_)(icon|service_icon|icono_[a-z]+)$/;
    for (const service of [...es, ...en]) {
      const heroKeys = Object.keys(service.acf?.hero ?? {});
      for (const key of heroKeys) {
        assert.ok(
          !forbidden.test(key) || key === 'icono',
          `El grupo hero del servicio ${service.id} expone el campo inesperado "${key}"`,
        );
      }
    }
  });
});

describe('ACF `Service Detail` — grupos `plataformas` y `relacionados`', () => {
  let es = [];
  let en = [];

  before(async () => {
    es = await services('es');
    en = await services('en');
  });

  test('toda publicación expone los grupos `plataformas` y `relacionados`', () => {
    for (const service of [...es, ...en]) {
      assert.ok(
        Object.hasOwn(service.acf ?? {}, 'plataformas'),
        `El servicio ${service.id} no expone acf.plataformas`,
      );
      assert.ok(
        Object.hasOwn(service.acf ?? {}, 'relacionados'),
        `El servicio ${service.id} no expone acf.relacionados`,
      );
    }
  });

  test('`plataformas` trae la forma completa de ACF', () => {
    for (const service of [...es, ...en]) {
      const p = service.acf.plataformas;
      for (const key of [
        'platforms_enabled',
        'platforms_eyebrow',
        'platforms_title',
        'platforms_description',
        'platforms',
        'platforms_cta_title',
        'platforms_cta_text',
        'platforms_cta_label',
        'platforms_cta_url',
      ]) {
        assert.ok(
          Object.hasOwn(p, key),
          `acf.plataformas del servicio ${service.id} no expone "${key}"`,
        );
      }
    }
  });

  test('cada plataforma de `plataformas[]` trae `name` y `example`', () => {
    for (const service of [...es, ...en]) {
      const list = service.acf.plataformas.platforms ?? [];
      for (const platform of list) {
        assert.ok(
          Object.hasOwn(platform, 'name'),
          `Una plataforma del servicio ${service.id} no trae "name"`,
        );
        assert.ok(
          Object.hasOwn(platform, 'example'),
          `Una plataforma del servicio ${service.id} no trae "example"`,
        );
      }
    }
  });

  test('cada relacionado trae `category`, `name`, `description` y `url`', () => {
    for (const service of [...es, ...en]) {
      const list = service.acf.relacionados.related ?? [];
      for (const related of list) {
        for (const key of ['category', 'name', 'description', 'url']) {
          assert.ok(
            Object.hasOwn(related, key),
            `Un relacionado del servicio ${service.id} no trae "${key}"`,
          );
        }
      }
    }
  });

  test('al menos un servicio tiene `platforms_enabled` activo con plataformas', () => {
    const enabled = [...es, ...en].filter(
      (s) => s.acf.plataformas.platforms_enabled === true,
    );
    assert.ok(
      enabled.length >= 1,
      'Ningún servicio tiene el bloque de plataformas activado',
    );
    for (const service of enabled) {
      assert.ok(
        (service.acf.plataformas.platforms ?? []).length > 0,
        `El servicio ${service.id} tiene plataformas activadas pero sin lista`,
      );
    }
  });
});

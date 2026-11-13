/**
 * P6 — Normalización de las URLs del JSON-LD de Yoast.
 *
 * Yoast construye el JSON-LD con el dominio del CMS. Las referencias
 * internas (páginas, identificadores del grafo, plantillas de búsqueda)
 * deben apuntar al frontend público del entorno; los recursos que
 * sirve el CMS (medios) y las URLs externas deben quedar intactos.
 *
 * La transformación se prueba con configuraciones controladas (pares
 * de orígenes CMS/frontend de los tres entornos), sin red.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  originOf,
  rewriteSchemaUrls,
  rewriteUrlOrigin,
} from '../src/lib/seo.ts';

/** Pares de orígenes (CMS → frontend) de cada entorno. */
const ENTORNOS = [
  {
    nombre: 'Local / DEV',
    cms: 'http://gussware.local',
    site: 'http://localhost:4321',
  },
  {
    nombre: 'Staging / TEST',
    cms: 'https://staging-cms.gussware.dev',
    site: 'https://staging.gussware.dev',
  },
  {
    nombre: 'Producción / PROD',
    cms: 'https://cms.gussware.dev',
    site: 'https://gussware.dev',
  },
];

/**
 * JSON-LD real de Yoast (página legal ES), con las URLs del CMS.
 */
function schemaDeYoast(cms) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${cms}/terminos-y-condiciones/`,
        url: `${cms}/terminos-y-condiciones/`,
        isPartOf: { '@id': `${cms}/#website` },
        breadcrumb: { '@id': `${cms}/terminos-y-condiciones/#breadcrumb` },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: [`${cms}/terminos-y-condiciones/`],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${cms}/terminos-y-condiciones/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: `${cms}/`,
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${cms}/#website`,
        url: `${cms}/`,
        publisher: { '@id': `${cms}/#organization` },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${cms}/?s={search_term_string}`,
            },
          },
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${cms}/#organization`,
        url: `${cms}/`,
        logo: {
          '@type': 'ImageObject',
          '@id': `${cms}/#/schema/logo/image/`,
          url: `${cms}/wp-content/uploads/2026/11/logo.png`,
          contentUrl: `${cms}/wp-content/uploads/2026/11/logo.png`,
        },
        image: { '@id': `${cms}/#/schema/logo/image/` },
      },
    ],
  };
}

describe('P6 — `originOf`', () => {
  test('devuelve el origen sin barra final', () => {
    assert.equal(originOf('https://gussware.dev/'), 'https://gussware.dev');
    assert.equal(originOf('https://gussware.dev'), 'https://gussware.dev');
  });

  test('devuelve null para valores no utilizables', () => {
    assert.equal(originOf(''), null);
    assert.equal(originOf(null), null);
    assert.equal(originOf(undefined), null);
    assert.equal(originOf('no-es-una-url'), null);
  });
});

describe('P6 — `rewriteUrlOrigin`', () => {
  test('sustituye el origen conservando ruta, query y fragmento', () => {
    assert.equal(
      rewriteUrlOrigin(
        'https://cms.gussware.dev/servicios/web/?a=1#plataformas',
        'https://cms.gussware.dev',
        'https://gussware.dev',
      ),
      'https://gussware.dev/servicios/web/?a=1#plataformas',
    );
  });

  test('conserva literalmente los parámetros con llaves', () => {
    assert.equal(
      rewriteUrlOrigin(
        'https://cms.gussware.dev/?s={search_term_string}',
        'https://cms.gussware.dev',
        'https://gussware.dev',
      ),
      'https://gussware.dev/?s={search_term_string}',
    );
  });

  test('no modifica URLs de otros orígenes', () => {
    const externa = 'https://schema.org';
    assert.equal(
      rewriteUrlOrigin(
        externa,
        'https://cms.gussware.dev',
        'https://gussware.dev',
      ),
      externa,
    );
  });

  test('no modifica un host que solo empieza igual', () => {
    const otra = 'https://cms.gussware.dev.otro.example/x';
    assert.equal(
      rewriteUrlOrigin(
        otra,
        'https://cms.gussware.dev',
        'https://gussware.dev',
      ),
      otra,
    );
  });

  test('es idempotente con el mismo origen', () => {
    const url = 'https://cms.gussware.dev/x';
    assert.equal(
      rewriteUrlOrigin(url, 'https://cms.gussware.dev', 'https://cms.gussware.dev'),
      url,
    );
  });
});

describe('P6 — `rewriteSchemaUrls`', () => {
  for (const { nombre, cms, site } of ENTORNOS) {
    test(`${nombre}: las referencias internas apuntan al frontend`, () => {
      const original = schemaDeYoast(cms);
      const resultado = rewriteSchemaUrls(original, cms, site);
      const [webPage, breadcrumb, webSite, organization] = resultado['@graph'];

      assert.equal(webPage['@id'], `${site}/terminos-y-condiciones/`);
      assert.equal(webPage.url, `${site}/terminos-y-condiciones/`);
      assert.equal(webPage.isPartOf['@id'], `${site}/#website`);
      assert.equal(
        webPage.breadcrumb['@id'],
        `${site}/terminos-y-condiciones/#breadcrumb`,
      );
      assert.equal(
        webPage.potentialAction[0].target[0],
        `${site}/terminos-y-condiciones/`,
      );
      assert.equal(breadcrumb['@id'], `${site}/terminos-y-condiciones/#breadcrumb`);
      assert.equal(breadcrumb.itemListElement[0].item, `${site}/`);
      assert.equal(webSite['@id'], `${site}/#website`);
      assert.equal(webSite.url, `${site}/`);
      assert.equal(webSite.publisher['@id'], `${site}/#organization`);
      assert.equal(
        webSite.potentialAction[0].target.urlTemplate,
        `${site}/?s={search_term_string}`,
      );
      assert.equal(organization['@id'], `${site}/#organization`);
      assert.equal(organization.url, `${site}/`);
    });

    test(`${nombre}: los recursos del CMS y las URLs externas no cambian`, () => {
      const resultado = rewriteSchemaUrls(schemaDeYoast(cms), cms, site);
      const organization = resultado['@graph'][3];

      assert.equal(resultado['@context'], 'https://schema.org');
      assert.equal(
        organization.logo.url,
        `${cms}/wp-content/uploads/2026/11/logo.png`,
      );
      assert.equal(
        organization.logo.contentUrl,
        `${cms}/wp-content/uploads/2026/11/logo.png`,
      );
    });

    test(`${nombre}: conserva la estructura, los tipos y las relaciones`, () => {
      const original = schemaDeYoast(cms);
      const resultado = rewriteSchemaUrls(original, cms, site);

      assert.equal(resultado['@graph'].length, original['@graph'].length);
      assert.deepEqual(
        resultado['@graph'].map((nodo) => nodo['@type']),
        original['@graph'].map((nodo) => nodo['@type']),
      );
      // El identificador del nodo de imagen sigue siendo el mismo en
      // `logo` y en `image` (referencia interna coherente).
      assert.equal(
        resultado['@graph'][3].logo['@id'],
        resultado['@graph'][3].image['@id'],
      );
      // `isPartOf` sigue apuntando al nodo `WebSite` del grafo.
      assert.equal(
        resultado['@graph'][0].isPartOf['@id'],
        resultado['@graph'][2]['@id'],
      );
      // El breadcrumb sigue apuntando al nodo `BreadcrumbList`.
      assert.equal(
        resultado['@graph'][0].breadcrumb['@id'],
        resultado['@graph'][1]['@id'],
      );
    });

    test(`${nombre}: el JSON-LD resultante sigue siendo válido`, () => {
      const resultado = rewriteSchemaUrls(schemaDeYoast(cms), cms, site);
      const serializado = JSON.stringify(resultado);

      assert.ok(serializado.length > 0);
      const reparseado = JSON.parse(serializado);
      assert.equal(reparseado['@context'], 'https://schema.org');
      assert.equal(reparseado['@graph'].length, 4);
    });

    test(`${nombre}: no queda el dominio del CMS en las referencias internas`, () => {
      const resultado = rewriteSchemaUrls(schemaDeYoast(cms), cms, site);
      const [webPage, , webSite, organization] = resultado['@graph'];

      for (const referencia of [
        webPage['@id'],
        webPage.url,
        webPage.isPartOf['@id'],
        webPage.breadcrumb['@id'],
        webSite['@id'],
        webSite.url,
        webSite.publisher['@id'],
        organization['@id'],
        organization.logo['@id'],
        organization.image['@id'],
      ]) {
        assert.ok(
          !referencia.includes(cms),
          `La referencia interna ${referencia} conserva el dominio del CMS`,
        );
        assert.ok(
          referencia.startsWith(site),
          `La referencia interna ${referencia} no apunta a ${site}`,
        );
      }
    });
  }

  test('no modifica el esquema si falta algún origen', () => {
    const original = schemaDeYoast('https://cms.gussware.dev');
    assert.deepEqual(rewriteSchemaUrls(original, '', 'https://gussware.dev'), original);
    assert.deepEqual(
      rewriteSchemaUrls(original, 'https://cms.gussware.dev', ''),
      original,
    );
  });

  test('no modifica el origen de entrada', () => {
    const original = schemaDeYoast('https://cms.gussware.dev');
    rewriteSchemaUrls(original, 'https://cms.gussware.dev', 'https://gussware.dev');

    assert.equal(
      original['@graph'][0]['@id'],
      'https://cms.gussware.dev/terminos-y-condiciones/',
    );
  });
});

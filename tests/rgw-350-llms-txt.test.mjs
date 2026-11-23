/**
 * RGW-350 — Contrato de `llms.txt`.
 *
 * Verifica que el archivo se publique en `/llms.txt` y que siga el formato
 * de la propuesta `llms.txt` v2: título, un único resumen, secciones H2
 * formadas por listas de enlaces y URLs absolutas del dominio público.
 *
 * También contrasta el inventario con las páginas generadas y el sitemap
 * del preview, de modo que una publicación, retirada o cambio de slug
 * obligue a revisar `public/llms.txt`.
 *
 * Requiere el preview de Astro activo (BASE_URL, por defecto
 * http://localhost:4321). Sin dependencias externas: `node --test`.
 */
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';

const BASE = (process.env.BASE_URL ?? 'http://localhost:4321').replace(
  /\/+$/,
  '',
);

const LLMS_URL = `${BASE}/llms.txt`;

/** Páginas públicas incluidas en `llms.txt`, por URL canónica. */
const PAGINAS_ESPERADAS = [
  'https://gussware.dev/',
  'https://gussware.dev/en/',
  'https://gussware.dev/servicios/',
  'https://gussware.dev/en/servicios/',
  'https://gussware.dev/contacto/',
  'https://gussware.dev/en/contact/',
  'https://gussware.dev/servicios/diseno-sitios-web-tiendas-en-linea/',
  'https://gussware.dev/servicios/desarrollo-a-medida/',
  'https://gussware.dev/servicios/aplicaciones-moviles/',
  'https://gussware.dev/servicios/devops-y-soporte-tecnico/',
  'https://gussware.dev/servicios/consultoria-tecnica/',
  'https://gussware.dev/servicios/integracion-de-apis-y-servicios-externos/',
  'https://gussware.dev/en/servicios/website-and-online-store-design/',
  'https://gussware.dev/en/servicios/custom-software-development/',
  'https://gussware.dev/en/servicios/mobile-applications/',
  'https://gussware.dev/en/servicios/devops-technical-support/',
  'https://gussware.dev/en/servicios/technical-consulting/',
  'https://gussware.dev/en/servicios/api-and-external-service-integration/',
  'https://gussware.dev/politica-de-privacidad/',
  'https://gussware.dev/terminos-y-condiciones/',
  'https://gussware.dev/en/privacy-policy/',
  'https://gussware.dev/en/term-of-service/',
];

/** Recursos técnicos públicos incluidos en `llms.txt`. */
const RECURSOS_ESPERADOS = [
  'https://gussware.dev/sitemap-index.xml',
  'https://gussware.dev/robots.txt',
];

const ENLACES_ESPERADOS = new Set([
  ...PAGINAS_ESPERADAS,
  ...RECURSOS_ESPERADOS,
]);

const RUTAS_PAGINA_ESPERADAS = PAGINAS_ESPERADAS.map(
  (url) => new URL(url).pathname,
);

/** Encuentra todos los enlaces Markdown, incluidos los relativos. */
const LINK_RE = /\[[^\]]+\]\(([^)\s]+)\)/g;

/** Una entrada válida de una lista de archivos: enlace y descripción. */
const LIST_LINK_RE = /^-\s+\[[^\]]+\]\([^)]+\):\s+.+$/;

/**
 * Extrae las secciones H2 y su contenido.
 *
 * @param {string} texto
 */
function obtenerSecciones(texto) {
  const encabezados = [...texto.matchAll(/^##\s+(.+)$/gm)];

  return encabezados.map((encabezado, indice) => {
    const siguiente = encabezados[indice + 1];
    const fin = siguiente?.index ?? texto.length;

    return {
      titulo: encabezado[1].trim(),
      contenido: texto
        .slice(encabezado.index + encabezado[0].length, fin)
        .trim(),
    };
  });
}

let respuesta;
let cuerpo;

before(async () => {
  try {
    respuesta = await fetch(LLMS_URL);
    cuerpo = await respuesta.text();
  } catch (error) {
    throw new Error(
      `No se pudo leer ${LLMS_URL}. Ejecuta "npm run build" y levanta ` +
        '`astro preview` antes de ejecutar esta prueba.',
      { cause: error },
    );
  }
});

describe('RGW-350 — llms.txt publicado y con formato válido', () => {
  test('responde 200 y se sirve como texto plano', () => {
    assert.equal(respuesta.status, 200);
    assert.match(
      respuesta.headers.get('content-type') ?? '',
      /^text\/plain\b/i,
      'llms.txt debe servirse con Content-Type text/plain',
    );
  });

  test('tiene un título y un único resumen bilingüe', () => {
    const titulos = cuerpo.match(/^#\s+.+$/gm) ?? [];
    const citas = cuerpo.split('\n').filter((linea) => linea.startsWith('> '));

    assert.equal(titulos.length, 1, 'debe existir un único título H1');
    assert.equal(titulos[0], '# GussWare');
    assert.equal(citas.length, 1, 'debe existir un único resumen blockquote');
    assert.match(citas[0], /GussWare es una comunidad colaborativa/);
    assert.match(citas[0], /GussWare is a collaborative community/);
  });

  test('solo usa secciones H2 con listas de enlaces', () => {
    assert.doesNotMatch(
      cuerpo,
      /^#{3,6}\s+/m,
      'la propuesta no usa subtítulos H3 o posteriores',
    );

    const secciones = obtenerSecciones(cuerpo);
    const titulos = secciones.map((seccion) => seccion.titulo);

    assert.deepEqual(titulos, [
      'Páginas principales / Main pages',
      'Servicios (ES)',
      'Services (EN)',
      'Legal',
      'Recursos técnicos / Technical resources',
    ]);

    for (const seccion of secciones) {
      const entradas = seccion.contenido
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean);

      assert.ok(
        entradas.length > 0,
        `la sección "${seccion.titulo}" está vacía`,
      );
      for (const entrada of entradas) {
        assert.match(
          entrada,
          LIST_LINK_RE,
          `la sección "${seccion.titulo}" solo admite enlaces con descripción`,
        );
      }
    }
  });
});

describe('RGW-350 — inventario público, absoluto y canónico', () => {
  test('incluye exactamente las 24 URL públicas acordadas', () => {
    const enlaces = [...cuerpo.matchAll(LINK_RE)].map((match) => match[1]);

    assert.deepEqual(
      [...enlaces].sort(),
      [...ENLACES_ESPERADOS].sort(),
      'el inventario de llms.txt debe coincidir con el conjunto esperado',
    );
    assert.equal(enlaces.length, 24, 'llms.txt debe listar 24 enlaces');
    assert.equal(
      new Set(enlaces).size,
      enlaces.length,
      'llms.txt no debe contener URLs duplicadas',
    );
  });

  test('todos los enlaces son absolutos del dominio de producción', () => {
    const enlaces = [...cuerpo.matchAll(LINK_RE)].map((match) => match[1]);

    for (const enlace of enlaces) {
      const url = new URL(enlace);
      assert.equal(url.protocol, 'https:', `${enlace} debe usar HTTPS`);
      assert.equal(
        url.host,
        'gussware.dev',
        `${enlace} debe apuntar al dominio de producción`,
      );
      assert.equal(url.username, '', `${enlace} no debe incluir credenciales`);
      assert.equal(url.password, '', `${enlace} no debe incluir credenciales`);
      assert.equal(url.search, '', `${enlace} no debe incluir query strings`);
      assert.equal(url.hash, '', `${enlace} no debe incluir fragmentos`);
    }
  });

  test('las páginas usan la forma canónica con barra final', () => {
    for (const url of PAGINAS_ESPERADAS) {
      const { pathname } = new URL(url);
      assert.ok(
        pathname.endsWith('/'),
        `${url} debe terminar en barra (forma canónica)`,
      );
    }
  });

  test('no incluye rutas no publicadas, internas ni duplicadas', () => {
    const enlaces = [...cuerpo.matchAll(LINK_RE)].map((match) => match[1]);

    for (const enlace of enlaces) {
      const { pathname } = new URL(enlace);

      assert.ok(
        !/^\/blog\/|^\/proyectos\/|^\/en\/blog\/|^\/en\/proyectos\//.test(
          pathname,
        ),
        `no debe incluir rutas no publicadas: ${enlace}`,
      );
      assert.ok(
        !/^\/navfixturetest\/|^\/404\/|^\/500\//.test(pathname),
        `no debe incluir rutas internas o de error: ${enlace}`,
      );
      assert.notEqual(
        pathname,
        '/contact/',
        'debe usar /contacto/ y no la ruta duplicada /contact/',
      );
      assert.ok(
        !enlace.includes('staging') && !enlace.includes('cms.gussware.dev'),
        `no debe incluir entornos no públicos: ${enlace}`,
      );
    }
  });

  test('cada página existe y declara su propia ruta como canonical', async () => {
    const comprobaciones = await Promise.all(
      PAGINAS_ESPERADAS.map(async (url) => {
        const { pathname } = new URL(url);
        const pagina = await fetch(`${BASE}${pathname}`);
        const html = await pagina.text();
        const etiquetasLink = html.match(/<link\b[^>]*>/gi) ?? [];
        const etiquetaCanonical = etiquetasLink.find((etiqueta) =>
          /\brel=["']canonical["']/i.test(etiqueta),
        );
        const href = etiquetaCanonical?.match(/\bhref=["']([^"']+)["']/i)?.[1];

        return { pathname, status: pagina.status, href };
      }),
    );

    for (const { pathname, status, href } of comprobaciones) {
      assert.equal(status, 200, `${pathname} debe responder 200`);
      assert.ok(href, `${pathname} debe declarar un canonical`);
      assert.equal(
        new URL(href, BASE).pathname,
        pathname,
        `${pathname} debe ser su propia URL canónica`,
      );
    }
  });

  test('el sitemap y robots.txt se publican', async () => {
    for (const recurso of RECURSOS_ESPERADOS) {
      const { pathname } = new URL(recurso);
      const publicado = await fetch(`${BASE}${pathname}`);
      assert.equal(publicado.status, 200, `${pathname} debe responder 200`);
    }
  });

  test('el inventario coincide con las rutas públicas del sitemap', async () => {
    const sitemap = await fetch(`${BASE}/sitemap-0.xml`);
    assert.equal(sitemap.status, 200, 'sitemap-0.xml debe responder 200');

    const xml = await sitemap.text();
    const rutas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    );

    // `/contact/` es un duplicado público que se omite deliberadamente.
    const rutasSinContactoDuplicado = rutas.filter(
      (ruta) => ruta !== '/contact/',
    );

    assert.deepEqual(
      rutasSinContactoDuplicado.sort(),
      RUTAS_PAGINA_ESPERADAS.sort(),
      'una página pública nueva, retirada o renombrada exige revisar llms.txt',
    );
  });
});

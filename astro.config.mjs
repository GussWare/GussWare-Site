// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

/**
 * Modo de Astro (`development`, `staging`, `production`).
 *
 * Astro no expone el modo al archivo de configuración (solo lo recibe
 * en `astro:config:setup`), así que se toma del comando con el que se
 * invocó, igual que hace Vite:
 *   - `astro dev`                  → modo `development` → carga `.env`
 *   - `astro build --mode staging` → modo `staging`    → carga `.env.staging`
 *   - `astro build --mode production` → modo `production` → carga `.env.production`
 *
 * Los archivos por modo tienen prioridad sobre `.env`, que Astro/Vite
 * carga siempre y que aporta las variables comunes (credenciales).
 */
function resolveMode() {
  const args = process.argv.slice(2);
  const modeIndex = args.indexOf('--mode');

  if (modeIndex !== -1 && args[modeIndex + 1]) {
    return args[modeIndex + 1];
  }

  const command = args.find((arg) => !arg.startsWith('-'));

  return command === 'dev' ? 'development' : 'production';
}

// Variables de entorno (proceso gana sobre `.env`): única fuente para
// `site` y para la verificación del CMS en el build.
const env = {
  ...loadEnv(resolveMode(), process.cwd(), ''),
  ...process.env,
};

/** URL pública del entorno de desarrollo (valor por defecto de `site`). */
const DEV_SITE_URL = 'http://localhost:4321';

// URL pública del sitio (sitemap, canonical, robots). Cada entorno la
// define en su archivo (`SITE_URL`); el valor por defecto solo es válido
// en desarrollo. En un build, `verifySiteUrl()` impide publicar
// canonical, sitemap y robots con la URL del entorno de desarrollo.
const site = env.SITE_URL || DEV_SITE_URL;

/**
 * Verifica que la URL pública del sitio esté definida para el entorno
 * en el que se compila.
 *
 * El valor por defecto (`http://localhost:4321`) solo es válido en
 * desarrollo local. Si un build de staging o producción lo usara, el
 * sitio se publicaría con canonical, sitemap y robots apuntando al
 * entorno de desarrollo; es preferible detener el build con un mensaje
 * claro que publicar un sitio con URLs de otro entorno.
 */
function verifySiteUrl() {
  const mode = resolveMode();

  if (mode === 'development') {
    return;
  }

  if (env.SITE_URL && env.SITE_URL !== DEV_SITE_URL) {
    return;
  }

  throw new Error(
    `SITE_URL no está definida para el modo "${mode}": el sitio se publicaría con canonical, sitemap y robots apuntando a ${DEV_SITE_URL}. ` +
      'Defínela en el archivo de entorno del modo (.env.staging) o como variable de entorno del proceso.',
  );
}

/**
 * Verifica que el CMS de WordPress responda y entregue el contenido
 * mínimo del alcance antes de generar el sitio.
 *
 * El sitio se construye con el contenido de WordPress: si el CMS no
 * responde o no entrega ese contenido, el build se detiene con un
 * mensaje accionable en lugar de publicar un sitio estático vacío o
 * parcial sin dejar evidencia.
 *
 * `WP_BUILD_STRICT=false` degrada el fallo a advertencia. Ese modo es
 * exclusivo para builds offline: nunca debe usarse en CI ni en un
 * despliegue real.
 */
async function verifyWordPressReady() {
  const mode = resolveMode();
  const wpBase = (env.WORDPRESS_URL ?? '').replace(/\/+$/, '');

  if (!wpBase) {
    throw new Error(
      `Falta la variable de entorno WORDPRESS_URL (modo "${mode}"): el sitio se genera con el contenido de WordPress. ` +
        'Defínela en el archivo de entorno del modo correspondiente (.env para local, .env.staging o .env.production) ' +
        'o como variable de entorno del proceso.',
    );
  }

  /** @type {Record<string, string>} */
  const headers = { Accept: 'application/json' };
  const { POSTMAN_APP_USERNAME, POSTMAN_APP_PASSWORD } = env;

  if (POSTMAN_APP_USERNAME && POSTMAN_APP_PASSWORD) {
    const credentials =
      typeof Buffer !== 'undefined'
        ? Buffer.from(
            `${POSTMAN_APP_USERNAME}:${POSTMAN_APP_PASSWORD}`,
          ).toString('base64')
        : btoa(`${POSTMAN_APP_USERNAME}:${POSTMAN_APP_PASSWORD}`);
    headers.Authorization = `Basic ${credentials}`;
  }

  /**
   * @param {string} path
   * @returns {Promise<unknown>}
   */
  const get = async (path) => {
    const response = await fetch(`${wpBase}/wp-json${path}`, { headers });

    if (!response.ok) {
      throw new Error(`WordPress API respondió ${response.status} en ${path}.`);
    }

    return response.json();
  };

  /** @type {string[]} */
  const problems = [];

  try {
    const [servicesEs, servicesEn, pages] = await Promise.all([
      get('/wp/v2/services?per_page=1&status=publish&lang=es'),
      get('/wp/v2/services?per_page=1&status=publish&lang=en'),
      get('/wp/v2/pages?per_page=1&status=publish'),
    ]);

    /**
     * @param {unknown} list
     * @returns {boolean}
     */
    const hasServices = (list) => Array.isArray(list) && list.length > 0;

    if (!hasServices(servicesEs)) {
      problems.push('no se encontraron servicios publicados en español');
    }

    if (!hasServices(servicesEn)) {
      problems.push('no se encontraron servicios publicados en inglés');
    }

    if (!hasServices(pages)) {
      problems.push('no se encontraron páginas publicadas');
    }
  } catch (error) {
    problems.push(
      `WordPress no respondió en ${wpBase} (${
        error instanceof Error ? error.message : String(error)
      })`,
    );
  }

  if (problems.length === 0) {
    console.log(
      `[build] Contenido de WordPress verificado en ${wpBase} (modo "${mode}")`,
    );
    return;
  }

  const detail = problems.map((problem) => `  - ${problem}`).join('\n');
  const strict = String(env.WP_BUILD_STRICT ?? 'true').toLowerCase() !== 'false';

  if (!strict) {
    console.warn(
      `[build] ADVERTENCIA: WordPress no disponible o incompleto (modo "${mode}"):\n${detail}\n` +
        '[build] El sitio se genera con contenido vacío o parcial (WP_BUILD_STRICT=false).',
    );
    return;
  }

  throw new Error(
    `WordPress no está disponible o incompleto para generar el sitio estático (modo "${mode}"):\n${detail}\n` +
      'Si el build es offline, define WP_BUILD_STRICT=false para degradar el fallo a advertencia.',
  );
}

/**
 * Integración mínima: verifica el entorno y el CMS al inicio del build.
 *
 * `astro:build:start` solo se ejecuta en `astro build` (no en `dev` ni
 * en `preview`), de modo que el desarrollo local no queda bloqueado
 * cuando el CMS está caído, pero un despliegue nunca se construye con
 * contenido vacío ni con las URLs de otro entorno.
 */
function wordpressContentGuard() {
  return {
    name: 'gussware:wordpress-content-guard',
    hooks: {
      'astro:build:start': async () => {
        verifySiteUrl();
        await verifyWordPressReady();
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site,

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    // Verificación del CMS: el build no continúa con contenido vacío.
    wordpressContentGuard(),
    // El sitemap se arma con las rutas realmente construidas (las
    // generadas por `getStaticPaths` incluidas), así que no puede
    // publicar URLs que no existen en el sitio. `navfixturetest` es una
    // página de pruebas interna del Header: se construye, pero no se
    // publica en el sitemap.
    sitemap({
      filter: (page) => !page.includes('/navfixturetest'),
    }),
  ],
});

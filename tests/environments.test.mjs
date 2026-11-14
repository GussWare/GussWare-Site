/**
 * Contrato de configuración de entornos.
 *
 * Verifica que la URL del CMS WordPress headless se defina de forma
 * centralizada (`WORDPRESS_URL`), que solo existan los cuatro archivos
 * de entorno autorizados y que Git ignore los reales y versione la
 * plantilla.
 *
 * Sin dependencias externas: `node --test`.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Únicos archivos de entorno permitidos en el proyecto. */
const ARCHIVOS_AUTORIZADOS = [
  '.env',
  '.env.example',
  '.env.production',
  '.env.staging',
];

/** CMS y sitio público esperados por entorno. */
const ENTORNOS = {
  local: {
    archivo: '.env',
    cms: 'http://gussware.local',
    sitio: 'http://localhost:4321',
  },
  staging: {
    archivo: '.env.staging',
    cms: 'https://staging-cms.gussware.dev',
    sitio: 'https://staging.gussware.dev',
  },
  production: {
    archivo: '.env.production',
    cms: 'https://cms.gussware.dev',
    sitio: 'https://gussware.dev',
  },
};

/**
 * Los archivos reales (`.env`, `.env.staging`, `.env.production`) no
 * están versionados: solo existen en la máquina del desarrollador. En CI
 * se omiten las comprobaciones que dependen de ellos.
 */
const ENTORNO_LOCAL = existsSync(resolve(ROOT, '.env'));

/** Lee una variable de un archivo `.env`. */
function readEnvValue(file, key) {
  const content = readFileSync(resolve(ROOT, file), 'utf-8');
  const match = content.match(new RegExp(`^${key}\\s*=\\s*"?([^"\\n]*)"?`, 'm'));

  assert.ok(match, `${file} no define ${key}`);
  return match[1].trim();
}

/** Nombres de las variables declaradas en un archivo `.env`. */
function readEnvKeys(file) {
  const content = readFileSync(resolve(ROOT, file), 'utf-8');

  return content
    .split('\n')
    .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/))
    .filter(Boolean)
    .map((match) => match[1]);
}

/** Lista recursivamente los archivos de un directorio. */
function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }

  return files;
}

/** ¿Git ignora esta ruta? */
function isIgnored(path) {
  try {
    execFileSync('git', ['check-ignore', '-q', '--', path], {
      cwd: ROOT,
      stdio: 'ignore',
    });

    return true;
  } catch {
    return false;
  }
}

describe('Entornos — archivos de entorno', () => {
  test('no existe ningún archivo de entorno fuera de los cuatro autorizados', () => {
    const encontrados = readdirSync(ROOT).filter((nombre) =>
      nombre.startsWith('.env'),
    );
    const noAutorizados = encontrados.filter(
      (nombre) => !ARCHIVOS_AUTORIZADOS.includes(nombre),
    );

    assert.deepEqual(
      noAutorizados,
      [],
      `Archivos de entorno no autorizados: ${noAutorizados.join(', ')}`,
    );
  });

  test(
    'existen los cuatro archivos autorizados',
    { skip: !ENTORNO_LOCAL },
    () => {
      for (const archivo of ARCHIVOS_AUTORIZADOS) {
        assert.ok(
          existsSync(resolve(ROOT, archivo)),
          `Falta ${archivo}`,
        );
      }
    },
  );

  test(
    'cada entorno apunta a su CMS y a su sitio público',
    { skip: !ENTORNO_LOCAL },
    () => {
      for (const { archivo, cms, sitio } of Object.values(ENTORNOS)) {
        assert.equal(
          readEnvValue(archivo, 'WORDPRESS_URL'),
          cms,
          `${archivo} debe apuntar a ${cms}`,
        );
        assert.equal(
          readEnvValue(archivo, 'SITE_URL'),
          sitio,
          `${archivo} debe declarar ${sitio}`,
        );
      }
    },
  );

  test('.env.example declara las mismas variables que .env', () => {
    const claves = readEnvKeys('.env.example');

    for (const clave of [
      'WORDPRESS_URL',
      'SITE_URL',
      'POSTMAN_APP_USERNAME',
      'POSTMAN_APP_PASSWORD',
      'WP_BUILD_STRICT',
    ]) {
      assert.ok(claves.includes(clave), `.env.example no define ${clave}`);
    }
  });

  test(
    '.env y .env.example tienen exactamente las mismas variables',
    { skip: !ENTORNO_LOCAL },
    () => {
      assert.deepEqual(
        readEnvKeys('.env').sort(),
        readEnvKeys('.env.example').sort(),
      );
    },
  );

  test('.env.example no contiene credenciales reales', () => {
    const contenido = readFileSync(resolve(ROOT, '.env.example'), 'utf-8');

    for (const clave of [
      'POSTMAN_APP_USERNAME',
      'POSTMAN_APP_PASSWORD',
      'MCP_TOKEN',
    ]) {
      const valor = readEnvValue('.env.example', clave);

      assert.equal(valor, '', `.env.example debe dejar ${clave} vacía`);
    }

    assert.ok(
      !/postman\.user|GJWK|138T/.test(contenido),
      '.env.example no debe contener secretos reales',
    );
  });
});

describe('Entornos — versionado', () => {
  test('Git ignora los tres archivos reales', () => {
    for (const archivo of ['.env', '.env.staging', '.env.production']) {
      assert.ok(isIgnored(archivo), `${archivo} debe estar en .gitignore`);
    }
  });

  test('Git versiona .env.example', () => {
    assert.ok(
      !isIgnored('.env.example'),
      '.env.example no debe estar en .gitignore',
    );
  });

  test('no hay archivos de entorno reales en el índice de Git', () => {
    const versionados = execFileSync(
      'git',
      ['ls-files', '--', '.env', '.env.local', '.env.staging', '.env.production'],
      { cwd: ROOT, encoding: 'utf-8' },
    )
      .split('\n')
      .filter(Boolean);

    assert.deepEqual(versionados, []);
  });
});

describe('Entornos — variable centralizada', () => {
  test('ningún módulo usa la antigua `WP_API_URL`', () => {
    const archivos = [
      ...walk(resolve(ROOT, 'src')),
      ...walk(resolve(ROOT, 'tests')),
      ...walk(resolve(ROOT, '.github')),
    ];

    const ofensores = [];

    for (const archivo of archivos) {
      if (!/\.(ts|astro|mjs|js|yml)$/.test(archivo)) continue;
      // Este archivo nombra la variable antigua para poder detectarla.
      if (archivo.endsWith('environments.test.mjs')) continue;

      const contenido = readFileSync(archivo, 'utf-8');

      if (contenido.includes('WP_API_URL')) {
        ofensores.push(archivo.replace(`${ROOT}/`, ''));
      }
    }

    assert.deepEqual(
      ofensores,
      [],
      `Archivos que aún referencian WP_API_URL: ${ofensores.join(', ')}`,
    );
  });

  test('el cliente de WordPress lee `WORDPRESS_URL`', () => {
    const cliente = readFileSync(
      resolve(ROOT, 'src/lib/wordpress/client.ts'),
      'utf-8',
    );

    assert.ok(
      cliente.includes('import.meta.env.WORDPRESS_URL'),
      'client.ts debe leer WORDPRESS_URL',
    );
  });

  test('la configuración de Astro usa `WORDPRESS_URL`', () => {
    const config = readFileSync(resolve(ROOT, 'astro.config.mjs'), 'utf-8');

    assert.ok(
      config.includes('env.WORDPRESS_URL'),
      'astro.config.mjs debe usar WORDPRESS_URL',
    );
  });

  test('`astro.config.mjs` falla con un error claro si falta `WORDPRESS_URL`', () => {
    const config = readFileSync(resolve(ROOT, 'astro.config.mjs'), 'utf-8');

    assert.ok(
      /Falta la variable de entorno WORDPRESS_URL/.test(config),
      'astro.config.mjs debe explicar que falta WORDPRESS_URL',
    );
  });

  test('`astro.config.mjs` impide publicar con la URL de desarrollo', () => {
    const config = readFileSync(resolve(ROOT, 'astro.config.mjs'), 'utf-8');

    assert.ok(
      /SITE_URL no está definida para el modo/.test(config),
      'astro.config.mjs debe explicar que falta SITE_URL',
    );
    assert.ok(
      /DEV_SITE_URL/.test(config),
      'astro.config.mjs debe centralizar la URL de desarrollo',
    );
  });
});

describe('Entornos — scripts de package.json', () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));

  test('`dev` y `build` son los comandos de los tres entornos', () => {
    assert.equal(pkg.scripts.dev, 'astro dev');
    assert.equal(pkg.scripts.build, 'astro build');
  });

  test('no hay scripts alternativos por entorno', () => {
    const porEntorno = Object.keys(pkg.scripts).filter((script) =>
      /^(build|dev)[:.-]/.test(script),
    );

    assert.deepEqual(porEntorno, []);
  });

  test('se conservan el resto de scripts', () => {
    for (const script of ['preview', 'astro', 'test', 'lint', 'format']) {
      assert.ok(pkg.scripts[script], `Falta el script ${script}`);
    }
  });
});

describe('Entornos — GitHub Actions', () => {
  const workflows = {
    ci: readFileSync(resolve(ROOT, '.github/workflows/ci.yml'), 'utf-8'),
    staging: readFileSync(
      resolve(ROOT, '.github/workflows/deploy-staging.yml'),
      'utf-8',
    ),
  };

  test('cada workflow toma `WORDPRESS_URL` de su Environment', () => {
    for (const [nombre, contenido] of Object.entries(workflows)) {
      assert.ok(
        contenido.includes('WORDPRESS_URL: ${{ vars.WORDPRESS_URL }}'),
        `${nombre}.yml debe leer WORDPRESS_URL de vars.*`,
      );
    }
  });

  test('cada workflow usa exclusivamente el Environment `staging`', () => {
    for (const [nombre, contenido] of Object.entries(workflows)) {
      assert.ok(
        contenido.includes('environment: staging'),
        `${nombre}.yml debe usar el Environment staging`,
      );
      assert.ok(
        !contenido.includes('production'),
        `${nombre}.yml no debe seleccionar el Environment de producción`,
      );
    }
  });

  test('CI se ejecuta con push y pull request hacia `staging`', () => {
    assert.ok(
      workflows.ci.includes('push:\n    branches: [staging]'),
      'ci.yml debe ejecutarse con push a staging',
    );
    assert.ok(
      workflows.ci.includes('pull_request:\n    branches: [staging]'),
      'ci.yml debe ejecutarse con pull request hacia staging',
    );
    assert.ok(
      workflows.ci.includes('workflow_dispatch'),
      'ci.yml debe permitir la ejecución manual',
    );
  });

  test('CI compila en modo `staging` con el Environment `staging`', () => {
    assert.ok(
      workflows.ci.includes('ASTRO_MODE: staging'),
      'ci.yml debe usar el modo staging',
    );
    assert.ok(
      workflows.ci.includes('--mode ${{ env.ASTRO_MODE }}'),
      'ci.yml debe compilar con el modo de Astro',
    );
  });

  test('Deploy Staging se ejecuta con push a `staging` y no con pull requests', () => {
    assert.ok(
      workflows.staging.includes('push:\n    branches: [staging]'),
      'deploy-staging.yml debe desplegar con push a staging',
    );
    assert.ok(
      workflows.staging.includes('workflow_dispatch'),
      'deploy-staging.yml debe permitir la ejecución manual',
    );
    assert.ok(
      !/(^|\n)\s*pull_request:/.test(workflows.staging),
      'deploy-staging.yml no debe desplegar con pull requests',
    );
  });

  test('ningún workflow usa `develop` como rama de Staging', () => {
    for (const [nombre, contenido] of Object.entries(workflows)) {
      assert.ok(
        !contenido.includes('develop'),
        `${nombre}.yml no debe referenciar la rama develop`,
      );
    }
  });

  test('ningún workflow depende de archivos .env locales', () => {
    for (const [nombre, contenido] of Object.entries(workflows)) {
      assert.ok(
        !contenido.includes('.env.staging') &&
          !contenido.includes('.env.production'),
        `${nombre}.yml no debe depender de los archivos .env por entorno`,
      );
    }
  });

  test('ningún workflow elimina contenido remoto', () => {
    for (const [nombre, contenido] of Object.entries(workflows)) {
      assert.ok(
        !/rsync[^\n]*--delete/.test(contenido),
        `${nombre}.yml no debe usar rsync --delete`,
      );
    }
  });
});

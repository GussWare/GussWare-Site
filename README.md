# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🌍 Entornos

El sitio se genera como estático (SSG) a partir del contenido de
WordPress. La URL del CMS se define en una única variable,
`WORDPRESS_URL`, resuelta por entorno:

| Entorno | Comando                          | `WORDPRESS_URL`                     | Sitio público                    |
| :------- | :------------------------------- | :---------------------------------- | :------------------------------- |
| Local    | `npm run dev`                    | `http://gussware.local`             | `http://localhost:4321`          |
| Staging  | `astro build --mode staging`     | `https://staging-cms.gussware.dev` | `https://staging.gussware.dev`   |
| Producción | `astro build --mode production` | `https://cms.gussware.dev`          | `https://gussware.dev`           |

Archivos de entorno (los únicos permitidos):

| Archivo          | Entorno | Versionado | Contenido                                        |
| :--------------- | :------ | :--------- | :----------------------------------------------- |
| `.env`           | Local   | No         | Configuración real de desarrollo (con credenciales) |
| `.env.example`   | Local   | Sí         | Plantilla equivalente a `.env`, sin credenciales |
| `.env.staging`   | Staging | No         | URLs de staging                                  |
| `.env.production` | Producción | No      | URLs de producción                               |

En CI no interviene ningún archivo `.env`: el CI/CD usa el GitHub
Environment `staging` (rama `staging`), que aporta `WORDPRESS_URL` y
`SITE_URL` como variables y el resto como secretos.
Si falta `WORDPRESS_URL`, el build se detiene con un mensaje explícito.

El Environment debe incluir además `POSTMAN_APP_USERNAME` y
`POSTMAN_APP_PASSWORD` (Basic Auth del CMS): de `/wp/v2/settings` salen
el favicon (Ícono del sitio) y el logo del header y del footer. Sin esas
credenciales el endpoint responde 401 y el sitio se publicaría sin
favicon ni logo del footer; con `WP_BUILD_STRICT=true` (valor por
defecto) el build se detiene con un mensaje explícito.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

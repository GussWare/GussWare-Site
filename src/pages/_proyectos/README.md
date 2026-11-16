# Proyectos (fuera del alcance de la migración SSG)

Estas rutas se conservaron intactas para una etapa futura, pero **no
forman parte del build estático actual**: el prefijo `_` hace que Astro
no las registre como rutas (convención de Astro: todo archivo o carpeta
de `src/pages` que empieza por `_` se ignora).

Motivo: el listado de proyectos aplica búsqueda, filtros por tecnología
y tipo, orden y paginación sobre los parámetros de consulta de la URL
(`search`, `technology`, `type`, `sort`, `page`), es decir, de render en
servidor. En un sitio estático eso hay que resolverlo con
`getStaticPaths()` más Fetch en el navegador, que es trabajo de una etapa
posterior.

Para reactivarlas: renombrar la carpeta a `proyectos` (quitar el `_`) y
devolver `export const prerender = true;` a cada ruta con parámetros
añadiendo su `getStaticPaths()`.

El contenido y los componentes (`src/components/projects/**`,
`src/lib/wordpress/projects.ts`) siguen intactos y reutilizables.

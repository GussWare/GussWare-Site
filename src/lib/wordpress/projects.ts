import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { WpMedia, WpProject, WpTechnology } from './types';

/**
 * RGW-321 — Proyectos publicados de un locale.
 *
 * Fuente única para Home (destacados), listado y detalle. Sin mapas
 * manuales: idioma, slugs y publicación provienen de WordPress/Polylang
 * (`status=publish&lang=` en la ruta). Ante cualquier fallo devuelve
 * `[]` (la vista conserva su contenido de referencia sin romper).
 */
export async function getProjects(locale: string): Promise<WpProject[]> {
  try {
    const data = await wpFetch<WpProject[]>(wpRoutes.projects(locale));
    return Array.isArray(data)
      ? data.filter((item) => item.status === 'publish')
      : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * RGW-321 — Proyectos destacados (`acf.is_featured`) de un locale,
 * ordenados por `acf.display_order` ascendente.
 *
 * Orden estable documentado: sin `display_order` numérico, el proyecto
 * ordena por `id` ascendente (nunca aleatorio ni dependiente del orden
 * de la respuesta REST).
 */
export async function getFeaturedProjects(
  locale: string,
): Promise<WpProject[]> {
  const projects = await getProjects(locale);
  return projects
    .filter((item) => item.acf?.is_featured === true)
    .sort((a, b) => {
      const orderA =
        typeof a.acf?.display_order === 'number'
          ? a.acf.display_order
          : Number.MAX_SAFE_INTEGER;
      const orderB =
        typeof b.acf?.display_order === 'number'
          ? b.acf.display_order
          : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });
}

/**
 * RGW-321 — Un proyecto por slug e idioma.
 *
 * Sin fallback entre idiomas (igual que `getServiceBySlug`): un slug
 * inexistente o no publicado en el idioma devuelve `null`.
 */
export async function getProjectBySlug(
  slug: string,
  lang: string,
): Promise<WpProject | null> {
  try {
    const data = await wpFetch<WpProject[]>(
      wpRoutes.projectBySlug(slug, lang),
    );
    const project = Array.isArray(data)
      ? data.find(
          (item) =>
            item.slug === slug &&
            item.status === 'publish' &&
            item.lang === lang,
        )
      : undefined;
    return project ?? null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

/**
 * RGW-321 — Mapa `id -> nombre` de tecnologías para resolver las
 * capacidades sin recorrer el listado en la página (patrón de
 * `buildCategoryMap` en `post.ts`).
 */
export function buildTechnologyMap(
  technologies: WpTechnology[] | null | undefined,
): Record<number, string> {
  const map: Record<number, string> = {};

  for (const technology of technologies ?? []) {
    map[technology.id] = technology.name;
  }

  return map;
}

/** RGW-321 — Catálogo de tecnologías (`null` si la petición falla). */
export async function getTechnologies(): Promise<WpTechnology[] | null> {
  try {
    const data = await wpFetch<WpTechnology[]>(
      wpRoutes.projectTechnologies(),
    );
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching project technologies:', error);
    return null;
  }
}

/**
 * RGW-321 — Imagen destacada de un proyecto (`featured_media`).
 *
 * Patrón de `getServiceImage`: resuelve `source_url` + `alt`, `null`
 * si no hay imagen (la vista renderiza su bloque neutro).
 */
export async function getProjectImage(
  project: WpProject,
): Promise<{ src: string; alt: string } | null> {
  if (!project.featured_media) {
    return null;
  }

  try {
    const media = await wpFetch<WpMedia>(
      wpRoutes.media(project.featured_media),
    );

    if (media?.source_url) {
      return {
        src: media.source_url,
        alt: media.alt_text || project.title.rendered,
      };
    }
  } catch {
    // Sin imagen: la vista se renderiza con bloque neutro.
  }

  return null;
}

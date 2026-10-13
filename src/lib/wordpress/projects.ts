import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { WP_PROJECTS_PER_PAGE } from './constants';
import { projectDetailUrl } from '../routes';
import { stripHtml } from './text';
import type { WpMedia, WpProject, WpProjectType, WpTechnology } from './types';

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

/** RGW-322 — Catálogo de tipos de proyecto (`null` si falla). */
export async function getProjectTypes(): Promise<WpProjectType[] | null> {
  try {
    const data = await wpFetch<WpProjectType[]>(wpRoutes.projectTypes());
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching project types:', error);
    return null;
  }
}

/**
 * RGW-322 — Opciones de filtro para un locale desde el catálogo sin
 * filtrar: un término por nombre (normalizado sin tildes alteradas, solo
 * recorte + minúsculas), prefiriendo el término en el idioma activo
 * sobre el legado sin idioma; se descartan los de otros idiomas.
 * Evita duplicados como el `Php` legado (34) frente a su equivalente
 * `es` (71, creado por Polylang al asignar).
 */
export function buildTermOptions<T extends { name: string; lang: string | false }>(
  terms: T[] | null | undefined,
  locale: string,
): T[] {
  const byName = new Map<string, T>();

  for (const term of terms ?? []) {
    const key = term.name.trim().toLocaleLowerCase();
    const prev = byName.get(key);

    if (!prev) {
      byName.set(key, term);
    } else if (prev.lang !== locale && term.lang === locale) {
      byName.set(key, term);
    }
  }

  return [...byName.values()].filter(
    (term) => term.lang === locale || term.lang === false,
  );
}
/** RGW-322 — Tarjeta del listado lista para renderizar. */
export interface ProjectListCard {
  slug: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  code: string | null;
  href: string;
  image: { src: string; alt: string } | null;
}

/** RGW-322 — Orden del listado (valores del `select` de la vista). */
export type ProjectSort = 'recent' | 'az' | 'za';

export interface ProjectListingQuery {
  locale: string;
  searchParams: URLSearchParams;
}

export interface ProjectListingData {
  cards: ProjectListCard[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentTechId: number;
  currentTypeId: number;
  currentSort: ProjectSort;
  technologies: WpTechnology[];
  projectTypes: WpProjectType[];
  initialError: boolean;
}

/**
 * RGW-322 — Orquesta el listado de Proyectos para un locale: lee el
 * estado de consulta (`page`, `search`, `technology`, `type`, `sort`),
 * resuelve en WordPress con `lang` y devuelve tarjetas, paginación y
 * taxonomías normalizadas (patrón de `getBlogListing`).
 *
 * Filtros y orden se aplican en código sobre el catálogo publicado del
 * idioma (sin parámetros REST inventados); la paginación corta el
 * resultado filtrado. `initialError` solo cuando falla la petición del
 * catálogo (filtros/taxonomías nulos se tratan como vacíos).
 */
export async function getProjectListing(
  query: ProjectListingQuery,
): Promise<ProjectListingData> {
  const parsedPage = Number.parseInt(
    query.searchParams.get('page') ?? '1',
    10,
  );
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
  const currentSearch = (query.searchParams.get('search') ?? '').trim();
  const parsedTech = Number.parseInt(
    query.searchParams.get('technology') ?? '0',
    10,
  );
  const currentTechId =
    Number.isInteger(parsedTech) && parsedTech > 0 ? parsedTech : 0;
  const parsedType = Number.parseInt(
    query.searchParams.get('type') ?? '0',
    10,
  );
  const currentTypeId =
    Number.isInteger(parsedType) && parsedType > 0 ? parsedType : 0;
  const rawSort = query.searchParams.get('sort') ?? 'recent';
  const currentSort: ProjectSort =
    rawSort === 'az' || rawSort === 'za' ? rawSort : 'recent';

  const [catalog, technologies, projectTypes] = await Promise.all([
    wpFetch<WpProject[]>(wpRoutes.projects(query.locale)).catch(() => null),
    getTechnologies(),
    getProjectTypes(),
  ]);

  if (!Array.isArray(catalog)) {
    return {
      cards: [],
      total: 0,
      totalPages: 1,
      currentPage: 1,
      currentSearch,
      currentTechId,
      currentTypeId,
      currentSort,
      technologies: buildTermOptions(technologies, query.locale),
      projectTypes: buildTermOptions(projectTypes, query.locale),
      initialError: true,
    };
  }

  const techMap = buildTechnologyMap(technologies);
  const typeMap: Record<number, string> = {};

  for (const type of projectTypes ?? []) {
    typeMap[type.id] = type.name;
  }

  const needle = currentSearch.toLocaleLowerCase();
  const filtered = catalog.filter((item) => {
    if (item.status !== 'publish' || item.lang !== query.locale) {
      return false;
    }

    if (currentTechId > 0 && !(item.technologies ?? []).includes(currentTechId)) {
      return false;
    }

    if (
      currentTypeId > 0 &&
      !(item.projects_type ?? []).includes(currentTypeId)
    ) {
      return false;
    }

    if (needle) {
      const haystack = [
        stripHtml(item.title.rendered),
        stripHtml(
          item.acf?.short_description ?? item.excerpt?.rendered ?? '',
        ),
        item.acf?.project_code ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase();
      return haystack.includes(needle);
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const titleA = stripHtml(a.title.rendered);
    const titleB = stripHtml(b.title.rendered);

    if (currentSort === 'az') return titleA.localeCompare(titleB);
    if (currentSort === 'za') return titleB.localeCompare(titleA);
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / WP_PROJECTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = sorted.slice(
    (safePage - 1) * WP_PROJECTS_PER_PAGE,
    safePage * WP_PROJECTS_PER_PAGE,
  );

  const cards = await Promise.all(
    pageItems.map(async (item): Promise<ProjectListCard> => {
      const typeId = (item.projects_type ?? [])[0];
      return {
        slug: item.slug,
        title: stripHtml(item.title.rendered),
        description: stripHtml(
          item.acf?.short_description ?? item.excerpt?.rendered ?? '',
        ),
        category:
          typeId != null ? (typeMap[typeId] ?? null) : null,
        tags: (item.technologies ?? [])
          .map((id) => techMap[id])
          .filter((name): name is string => Boolean(name)),
        code: item.acf?.project_code
          ? `#${item.acf.project_code}`
          : null,
        href: projectDetailUrl(query.locale, item.slug),
        image: await getProjectImage(item),
      };
    }),
  );

  return {
    cards,
    total,
    totalPages,
    currentPage: safePage,
    currentSearch,
    currentTechId,
    currentTypeId,
    currentSort,
    technologies: buildTermOptions(technologies, query.locale),
    projectTypes: buildTermOptions(projectTypes, query.locale),
    initialError: false,
  };
}
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

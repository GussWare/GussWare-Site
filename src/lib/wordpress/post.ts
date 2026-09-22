import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { stripHtml } from './text';
import type {
  BlogCard,
  FeaturedPost,
  FeaturedPostImage,
  WpCategory,
  WpFeaturedPost,
  WpListPost,
  WpMedia,
  WpPost,
  WpTag,
  WpUser,
} from './types';

export async function getCategories(): Promise<WpCategory[] | null> {
  try {
    const data = await wpFetch<WpCategory[]>(wpRoutes.categories);
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

export function normalizeBlogCard(
  post: WpListPost,
  categories: Record<number, string>,
): BlogCard {
  const categoryId = post.categories?.[0];

  return {
    id: post.id,
    badge: categoryId != null ? (categories[categoryId] ?? null) : null,
    title: post.title.rendered,
    href: `/blog/${post.slug}`,
  };
}

/**
 * Mapa `id -> nombre` de categorías para resolver insignias sin recorrer
 * el listado en la página.
 */
export function buildCategoryMap(
  categories: WpCategory[] | null | undefined,
): Record<number, string> {
  const map: Record<number, string> = {};

  for (const category of categories ?? []) {
    map[category.id] = category.name;
  }

  return map;
}

export interface PostPageParams {
  baseUrl: string;
  page: number;
  perPage: number;
  query: string;
  catId: number;
}

export interface PostPage {
  items: WpListPost[];
  totalPages: number;
}

/**
 * Una página del listado para el navegador (lecturas públicas, sin
 * credenciales). Centraliza URL, respuesta y `X-WP-TotalPages` para que la
 * UI no conozca detalles de la API.
 *
 * Usa `fetch` propio en lugar de `wpFetch()`: el cliente existente resuelve
 * la URL desde entorno de servidor y devuelve solo el JSON, mientras que
 * aquí se necesita una URL pública en tiempo de ejecución y leer headers.
 */
export async function fetchPostPage(params: PostPageParams): Promise<PostPage> {
  const path = wpRoutes.posts(
    params.page,
    params.perPage,
    params.query,
    'publish',
    0,
    params.catId ? [params.catId] : [],
    [],
    'date',
    'desc',
  );
  const baseUrl = params.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/wp-json${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`WordPress API respondió ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Respuesta inesperada de WordPress.');
  }

  return {
    items: data as WpListPost[],
    totalPages: Number(response.headers.get('X-WP-TotalPages') ?? '1') || 1,
  };
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  try {
    const data = await wpFetch<WpPost[]>(wpRoutes.postBySlug(slug));
    const post = Array.isArray(data)
      ? data.find((item) => item.slug === slug && item.status === 'publish')
      : undefined;
    return post ?? null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function getUser(id: number): Promise<WpUser | null> {
  try {
    const data = await wpFetch<WpUser>(wpRoutes.user(id));
    return data ?? null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getTags(): Promise<WpTag[] | null> {
  try {
    const data = await wpFetch<WpTag[]>(wpRoutes.tags);
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return null;
  }
}

export async function getBlogFeatured(): Promise<WpFeaturedPost | null> {
  try {
    const data = await wpFetch<WpFeaturedPost>(wpRoutes.blogFeatured);
    return data;
  } catch (error) {
    console.error('Error fetching blog featured posts:', error);
    return null;
  }
}

/**
 * Normaliza el artículo destacado para el Blog: insignia por categoría,
 * título/descripción como texto plano, URL y tiempo de lectura consumido
 * directamente desde `acf.informacion_del_articulo.minutos_de_lectura`
 * (entero; `null` si el endpoint no lo proporciona).
 */
export function normalizeBlogFeatured(
  post: WpFeaturedPost | null | undefined,
  categories: Record<number, string>,
): FeaturedPost | null {
  if (!post) {
    return null;
  }

  const categoryId = post.categories?.[0];
  const rawMinutes = post.acf?.informacion_del_articulo?.minutos_de_lectura;

  return {
    badge: categoryId != null ? (categories[categoryId] ?? 'Blog') : 'Blog',
    readingTime:
      typeof rawMinutes === 'number' && Number.isInteger(rawMinutes)
        ? rawMinutes
        : null,
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    url: `/blog/${post.slug}`,
  };
}

/**
 * Imagen del artículo destacado (`null` = sin imagen: se conserva el
 * bloque de color existente y el listado sigue independiente).
 */
export async function getBlogFeaturedImage(
  post: WpFeaturedPost | null | undefined,
): Promise<FeaturedPostImage | null> {
  if (!post?.featured_media) {
    return null;
  }

  try {
    const media = await wpFetch<WpMedia>(wpRoutes.media(post.featured_media));

    if (!media?.source_url) {
      return null;
    }

    return {
      src: media.source_url,
      alt:
        media.alt_text ||
        media.title?.rendered ||
        stripHtml(post.title.rendered),
    };
  } catch (error) {
    console.error('Error fetching blog featured image:', error);
    return null;
  }
}

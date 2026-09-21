import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type {
  BlogCard,
  WpCategory,
  WpListPost,
  WpPost,
  WpTag,
  WpUser,
} from './types';

export async function getListPosts(
  page: number,
  per_page: number,
  search: string,
  status: string,
  author: number,
  categories: number[],
  tags: number[],
  orderby: string,
  order: string,
): Promise<WpListPost[] | null> {
  try {
    const data = await wpFetch<WpListPost[]>(
      wpRoutes.posts(
        page,
        per_page,
        search,
        status,
        author,
        categories,
        tags,
        orderby,
        order,
      ),
    );
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching list of posts:', error);
    return null;
  }
}

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

export async function getPostById(id: number): Promise<WpPost | null> {
  try {
    const data = await wpFetch<WpPost>(wpRoutes.post(id));
    return data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
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

export async function getBlogFeatured() {
  try {
    const data = await wpFetch<WpListPost>(wpRoutes.blogFeatured);
    return data;
  } catch (error) {
    console.error('Error fetching blog featured posts:', error);
    return null;
  }
}

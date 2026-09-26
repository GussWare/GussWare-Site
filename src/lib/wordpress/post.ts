import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { WP_BLOG_POSTS_PER_PAGE } from './constants';
import { blogPostUrl } from '../routes';
import type { LocaleUrls } from '../routes';
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

export async function getCategories(
  lang?: string,
): Promise<WpCategory[] | null> {
  try {
    const data = await wpFetch<WpCategory[]>(wpRoutes.categories(lang));
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

export function normalizeBlogCard(
  post: WpListPost,
  categories: Record<number, string>,
  locale: string,
): BlogCard {
  const categoryId = post.categories?.[0];

  return {
    id: post.id,
    badge: categoryId != null ? (categories[categoryId] ?? null) : null,
    title: post.title.rendered,
    href: blogPostUrl(locale, post.slug),
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
  lang?: string;
  context?: string;
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
    params.lang,
    params.context,
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
    return data && data.status === 'publish' ? data : null;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

export async function getPostBySlug(
  slug: string,
  lang?: string,
): Promise<WpPost | null> {
  try {
    const data = await wpFetch<WpPost[]>(wpRoutes.postBySlug(slug, lang));
    const post = Array.isArray(data)
      ? data.find(
          (item) =>
            item.slug === slug &&
            item.status === 'publish' &&
            (!lang || item.lang === lang),
        )
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

export async function getTags(lang?: string): Promise<WpTag[] | null> {
  try {
    const data = await wpFetch<WpTag[]>(wpRoutes.tags(lang));
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
  locale: string,
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
    url: blogPostUrl(locale, post.slug),
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

export interface BlogListingQuery {
  locale: string;
  baseUrl: string | undefined;
  searchParams: URLSearchParams;
}

export interface BlogListingData {
  initialCards: BlogCard[];
  initialTotalPages: number;
  initialError: boolean;
  initialCategories: WpCategory[] | null;
  currentPage: number;
  currentSearch: string;
  currentCatId: number;
  featuredPost: FeaturedPost | null;
  featuredImage: FeaturedPostImage | null;
}

/**
 * Orquesta el listado del Blog para un locale: lee el estado de consulta
 * (`page`, `search`, `category`), resuelve en WordPress con `lang` y
 * devuelve tarjetas, paginación, categorías y destacada normalizados.
 */
export async function getBlogListing(
  query: BlogListingQuery,
): Promise<BlogListingData> {
  const parsedPage = Number.parseInt(query.searchParams.get('page') ?? '1', 10);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
  const currentSearch = (query.searchParams.get('search') ?? '').trim();
  const parsedCategory = Number.parseInt(
    query.searchParams.get('category') ?? '0',
    10,
  );
  const currentCatId =
    Number.isInteger(parsedCategory) && parsedCategory >= 0
      ? parsedCategory
      : 0;

  const [initialPage, initialCategories, featuredRaw] = await Promise.all([
    query.baseUrl
      ? fetchPostPage({
          baseUrl: query.baseUrl,
          page: currentPage,
          perPage: WP_BLOG_POSTS_PER_PAGE,
          query: currentSearch,
          catId: currentCatId,
          lang: query.locale,
        }).catch(() => null)
      : null,
    getCategories(query.locale),
    getBlogFeatured().catch(() => null),
  ]);

  const catMap = buildCategoryMap(initialCategories);

  const initialCards: BlogCard[] = (initialPage?.items ?? []).map((post) =>
    normalizeBlogCard(post, catMap, query.locale),
  );

  return {
    initialCards,
    initialTotalPages: initialPage?.totalPages ?? 1,
    initialError: initialPage === null,
    initialCategories,
    currentPage,
    currentSearch,
    currentCatId,
    featuredPost: normalizeBlogFeatured(featuredRaw, catMap, query.locale),
    featuredImage: await getBlogFeaturedImage(featuredRaw),
  };
}

export interface BlogArticleData {
  post: WpPost;
  author: WpUser | null;
  tagNames: WpTag[];
  categoryName: string | null;
  featuredImage: { src: string; alt: string } | null;
  title: string;
  lede: string;
  description: string;
  readingTime: number | null;
  avatar: string | null;
  categories: WpCategory[] | null;
  catMap: Record<number, string>;
  localeUrls: LocaleUrls | undefined;
}

/**
 * Orquesta el detalle de un artículo para un locale: post, autor, tags,
 * categorías, imagen destacada y textos normalizados, más las URLs del
 * selector de idioma (traducción vía `translations`, o indefinidas para
 * la navegación genérica cuando no hay traducción).
 */
export async function getBlogArticle(
  slug: string,
  locale: string,
  pathname: string,
): Promise<BlogArticleData | null> {
  const post =
    typeof slug === 'string'
      ? await getPostBySlug(slug, locale).catch(() => null)
      : null;

  if (!post) {
    return null;
  }

  const [author, allTags, categories] = await Promise.all([
    getUser(post.author).catch(() => null),
    getTags(locale).catch(() => null),
    getCategories(locale).catch(() => null),
  ]);

  const catMap = buildCategoryMap(categories);
  const categoryId = post.categories?.[0];
  const categoryName = categoryId != null ? (catMap[categoryId] ?? null) : null;
  const tagNames = (allTags ?? []).filter((tag) => post.tags?.includes(tag.id));

  let featuredImage: BlogArticleData['featuredImage'] = null;

  if (post.featured_media) {
    try {
      const media = await wpFetch<WpMedia>(wpRoutes.media(post.featured_media));

      if (media?.source_url) {
        featuredImage = {
          src: media.source_url,
          alt: media.alt_text || media.title?.rendered || post.title.rendered,
        };
      }
    } catch {
      // Sin imagen destacada: el artículo se renderiza igual.
    }
  }

  const otherLocale = locale === 'es' ? 'en' : 'es';
  const translationId = post.translations?.[otherLocale];
  const translatedSlug =
    typeof translationId === 'number'
      ? ((await getPostById(translationId).catch(() => null))?.slug ?? null)
      : null;

  const localeUrls: LocaleUrls | undefined = translatedSlug
    ? {
        es: locale === 'es' ? pathname : blogPostUrl('es', translatedSlug),
        en: locale === 'en' ? pathname : blogPostUrl('en', translatedSlug),
      }
    : undefined;

  const rawMinutes = (
    post.acf as unknown as {
      informacion_del_articulo?: { minutos_de_lectura?: unknown };
    }
  )?.informacion_del_articulo?.minutos_de_lectura;

  return {
    post,
    author,
    tagNames,
    categoryName,
    featuredImage,
    title: stripHtml(post.title.rendered),
    lede: stripHtml(post.excerpt.rendered),
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
    readingTime:
      typeof rawMinutes === 'number' && Number.isInteger(rawMinutes)
        ? rawMinutes
        : null,
    avatar: author?.avatar_urls?.['96'] ?? author?.avatar_urls?.['48'] ?? null,
    categories,
    catMap,
    localeUrls,
  };
}

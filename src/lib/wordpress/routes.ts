export const wpRoutes = {
  menus: '/gussware/v1/menus',
  settings: '/wp/v2/settings',
  media: (mediaId: number) => `/wp/v2/media/${mediaId}`,
  footer: (lang: string) =>
    `/gussware/v1/footer?lang=${encodeURIComponent(lang)}`,
  socialMedia: '/gussware/v1/social-media',
  contact: (lang: string) =>
    `/gussware/v1/contact?lang=${encodeURIComponent(lang)}`,
  header: (lang: string) =>
    `/gussware/v1/header?lang=${encodeURIComponent(lang)}`,
  languages: '/pll/v1/languages',
  posts: (
    page: number,
    per_page: number,
    search: string,
    status: string,
    author: number,
    categories: number[],
    tags: number[],
    orderby: string,
    order: string,
    lang?: string,
    context?: string,
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
      orderby,
      order,
    });

    if (search) {
      params.set('search', search);
    }

    if (status) {
      params.set('status', status);
    }

    if (author) {
      params.set('author', String(author));
    }

    if (categories.length > 0) {
      params.set('categories', categories.join(','));
    }

    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    }

    if (lang) {
      params.set('lang', lang);
    }

    if (context) {
      params.set('context', context);
    }

    return `/wp/v2/posts?${params.toString()}`;
  },
  post: (postId: number) => `/wp/v2/posts/${postId}?context=view`,
  postBySlug: (slug: string, lang?: string) =>
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`,
  pageBySlug: (slug: string, lang: string) =>
    `/wp/v2/pages?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`,
  page: (pageId: number) => `/wp/v2/pages/${pageId}`,
  user: (userId: number) => `/wp/v2/users/${userId}`,
  tags: (lang?: string) =>
    `/wp/v2/tags?per_page=100${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`,
  categories: (lang?: string) =>
    `/wp/v2/categories?per_page=100${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`,
  blogFeatured: (lang?: string) =>
    `/gussware/v1/blog/featured${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`,
} as const;

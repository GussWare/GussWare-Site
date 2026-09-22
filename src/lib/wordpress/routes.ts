export const wpRoutes = {
  menus: '/wp/v2/menus',
  menuItems: (menuId: number, per_page: number, page = 1) =>
    `/wp/v2/menu-items?menus=${menuId}&per_page=${per_page}&page=${page}`,
  settings: '/wp/v2/settings',
  media: (mediaId: number) => `/wp/v2/media/${mediaId}`,
  footer: '/gussware/v1/footer',
  socialMedia: '/gussware/v1/redes-sociales',
  contact: '/gussware/v1/contacto',
  header: '/gussware/v1/header',
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

    return `/wp/v2/posts?${params.toString()}`;
  },
  post: (postId: number) => `/wp/v2/posts/${postId}?context=view`,
  postBySlug: (slug: string) => `/wp/v2/posts?slug=${encodeURIComponent(slug)}`,
  user: (userId: number) => `/wp/v2/users/${userId}`,
  tags: '/wp/v2/tags?per_page=100',
  categories: '/wp/v2/categories?per_page=100',
  blogFeatured: '/gussware/v1/blog/featured',
} as const;

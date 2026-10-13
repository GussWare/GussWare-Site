export const wpRoutes = {
  menus: '/gussware/v1/menus',
  settings: '/wp/v2/settings',
  media: (mediaId: number) => `/wp/v2/media/${mediaId}`,
  footer: (lang: string) =>
    `/gussware/v1/footer?lang=${encodeURIComponent(lang)}`,
  socialMedia: '/gussware/v1/social-media',
  contact: (lang: string) =>
    `/gussware/v1/contact?lang=${encodeURIComponent(lang)}`,
  legalInformation: (lang: string) =>
    `/gussware/v1/legal_information?lang=${encodeURIComponent(lang)}`,
  contactForms: '/pavelsilinskii-cf/v1/forms',
  contactForm: (id: number | string) =>
    `/pavelsilinskii-cf/v1/forms/${encodeURIComponent(String(id))}`,
  contactFormSubmit: (id: number | string) =>
    `/pavelsilinskii-cf/v1/forms/${encodeURIComponent(String(id))}/submit`,
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
  services: (lang: string) =>
    `/wp/v2/services?per_page=100&lang=${encodeURIComponent(lang)}`,
  serviceBySlug: (slug: string, lang: string) =>
    `/wp/v2/services?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`,
  service: (serviceId: number) => `/wp/v2/services/${serviceId}`,
  /**
   * RGW-321 — CPT `projects` (`rest_base: projects`, verificado en
   * `/wp/v2/types`). Solo registros publicados del idioma activo; los
   * borradores se excluyen por defecto.
   */
  projects: (lang: string) =>
    `/wp/v2/projects?per_page=100&status=publish&lang=${encodeURIComponent(lang)}`,
  projectBySlug: (slug: string, lang: string) =>
    `/wp/v2/projects?slug=${encodeURIComponent(slug)}&status=publish&lang=${encodeURIComponent(lang)}`,
  project: (projectId: number) => `/wp/v2/projects/${projectId}`,
  /**
   * RGW-321 — Taxonomía `technology` (`rest_base: technologies`,
   * verificado en `/wp/v2/taxonomies`). Nombres para las capacidades
   * del Home; sin términos inventados.
   */
  projectTechnologies: () => `/wp/v2/technologies?per_page=100`,
  /**
   * RGW-322 — Taxonomía `projects_type` (tipos de proyecto). Etiquetas
   * de filtro del listado; solo términos reales de WordPress.
   */
  projectTypes: () => `/wp/v2/projects_type?per_page=100`,
  /**
   * RGW-323 — Taxonomía `industry_sector`
   * (`rest_base: industries_sector`). Nombres para el detalle.
   */
  projectIndustries: () => `/wp/v2/industries_sector?per_page=100`,
  /**
   * RGW-323 — CPT relacionado `client_company` (nombre del cliente desde
   * su título nativo).
   */
  clientCompany: (companyId: number) =>
    `/wp/v2/client_company/${companyId}`,
  user: (userId: number) => `/wp/v2/users/${userId}`,
  tags: (lang?: string) =>
    `/wp/v2/tags?per_page=100${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`,
  categories: (lang?: string) =>
    `/wp/v2/categories?per_page=100${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`,
  blogFeatured: (lang?: string) =>
    `/gussware/v1/blog/featured${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`,
} as const;

/**
 * Tipos de las respuestas de WordPress REST API usadas por el Header
 * (logo y menú principal).
 */

export interface WpSettings {
  title: string;
  description: string;
  url: string;
  site_logo: number | null;
  site_icon: number;
}

export interface WpMedia {
  id: number;

  /** Relación al contenido original (p. ej. el SVG del que deriva el logo). */
  post?: number;
  parent?: number;

  source_url: string;
  alt_text: string;
  mime_type: string;

  title: {
    rendered: string;
  };
}

export interface WpMenu {
  id: number;
  name: string;
  slug: string;
  locations: string[];
}

export interface WpMenuItem {
  id: number;

  title: {
    rendered: string;
  };

  status: string;
  url: string;
  parent: number;
  menu_order: number;
  target: string;
  menus: number;
}

/** Logo del Header listo para renderizar. */
export interface HeaderLogo {
  src: string;
  alt: string;
}

/** Ítem del menú del Header listo para renderizar. */
export interface HeaderMenuItem {
  id: number;
  title: string;
  url: string;
  parent: number;
  menu_order: number;
  target: string;
}

export interface Header {
  texto_del_boton: string;
  url: string;
  estado: boolean;
}

export interface FooterDescription {
  footer_description: string;
  footer_copyright: string;
}

export interface SocialMedia {
  redes_sociales: SocialMediaItem[];
}

export interface SocialMediaItem {
  nombre: string;
  url: string;
  estado: boolean;
  icono: string;
  orden: number;
}

export interface Contact {
  contenido_de_la_seccion: ContactSection;
  informacion_de_contacto: ContactInformation;
}

export interface ContactSection {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  texto_de_redes_sociales: string;
}

export interface ContactInformation {
  telefono: string | null;
  email: string | null;
  horario_de_atencion: string | null;
}

export interface WpListPost {
  id: number;
  date: string;
  slug: string;
  link: string;

  title: WpPostRendered;
  excerpt: WpPostRendered;

  featured_media: number;
  categories: number[];
  tags: number[];
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpUser {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: Record<string, string>;
}

/** Tarjeta del listado del Blog lista para renderizar. */
export interface BlogCard {
  id: number;
  badge: string | null;
  title: string;
  href: string;
}

/** Grupo ACF `informacion_del_articulo` expuesto por la REST API. */
export interface WpArticleInfo {
  minutos_de_lectura: number;
}

/** Campo `acf` de la respuesta del endpoint destacado del Blog. */
export interface WpFeaturedAcf {
  informacion_del_articulo: WpArticleInfo;
}

/** Respuesta del endpoint destacado (`/gussware/v1/blog/featured`). */
export interface WpFeaturedPost extends WpListPost {
  acf: WpFeaturedAcf;
}

/** Artículo destacado del Blog listo para renderizar. */
export interface FeaturedPost {
  badge: string;
  /**
   * Minutos de lectura desde WordPress
   * (`acf.informacion_del_articulo.minutos_de_lectura`); `null` si el
   * endpoint no lo proporciona.
   */
  readingTime: number | null;
  title: string;
  description: string;
  url: string;
}

/** Imagen del artículo destacado lista para renderizar. */
export interface FeaturedPostImage {
  src: string;
  alt: string;
}

/** Page de WordPress con campos Polylang (`lang`, `translations`). */
export interface WpPage {
  id: number;
  slug: string;
  status: string;

  title: WpPostRendered;
  content: WpPostProtectedContent;
  excerpt: WpPostProtectedContent;

  lang: string;
  translations: Record<string, number>;
}

export interface WpPostRendered {
  rendered: string;
}

export interface WpPostProtectedContent extends WpPostRendered {
  protected: boolean;
}

export interface WpPostGuid extends WpPostRendered {}

export interface WpPostMeta {
  _acf_changed: boolean;
  inline_featured_image: boolean;
  footnotes: string;
}

export interface WpPostYoastRobots {
  index: string;
  follow: string;
  'max-snippet': string;
  'max-image-preview': string;
  'max-video-preview': string;
}

export interface WpPostYoastTwitterMisc {
  'Written by': string;
  'Est. reading time': string;
}

export interface WpPostYoastHeadJson {
  title: string;
  robots: WpPostYoastRobots;
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_published_time: string;
  article_modified_time: string;
  author: string;
  twitter_card: string;
  twitter_misc: WpPostYoastTwitterMisc;

  schema: {
    '@context': string;
    '@graph': unknown[];
  };
}

export interface WpPostLink {
  href: string;

  targetHints?: {
    allow: string[];
  };
}

export interface WpPostLinks {
  self: WpPostLink[];
  collection: WpPostLink[];
  about: WpPostLink[];
  author: WpPostLink[];
  replies: WpPostLink[];
  'version-history': WpPostLink[];
  'predecessor-version': WpPostLink[];
  'wp:attachment': WpPostLink[];

  'wp:term': Array<{
    taxonomy: string;
    embeddable: boolean;
    href: string;
  }>;

  curies: Array<{
    name: string;
    href: string;
    templated: boolean;
  }>;
}

export interface WpPost {
  id: number;
  date: string;
  date_gmt: string;

  guid: WpPostGuid;

  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;

  title: WpPostRendered;
  content: WpPostProtectedContent;
  excerpt: WpPostProtectedContent;

  author: number;
  featured_media: number;

  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;

  meta: WpPostMeta;

  categories: number[];
  tags: number[];
  class_list: string[];

  acf: unknown[];

  yoast_head: string;
  yoast_head_json: WpPostYoastHeadJson;

  lang: string;
  translations: Record<string, number>;
  pll_sync_post: unknown[];

  _links: WpPostLinks;
}

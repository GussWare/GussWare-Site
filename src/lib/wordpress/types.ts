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
  button_text: string;
  url: string;
  status: boolean;
}

/** Medio de logo de `logo_section` (`/gussware/v1/header`). */
export interface HeaderLogoMedia {
  id: number;
  url: string;
  alt: string | null;
  width: number;
  height: number;
  mime_type: string;
}

/** Sección de logos del Header (`logo_section`). */
export interface HeaderLogoSection {
  logo: HeaderLogoMedia | null;
  mobile_logo: HeaderLogoMedia | null;
}

/** Respuesta de `/gussware/v1/header`. */
export interface HeaderResponse {
  button_section: Header | null;
  logo_section: HeaderLogoSection | null;
}

/** Header listo para renderizar: CTA + logos. */
export interface HeaderData extends Header {
  logo: HeaderLogo | null;
  mobileLogo: HeaderLogo | null;
}

export interface FooterDescription {
  footer_description: string;
  footer_copyright: string;
}

/** Respuesta de `/gussware/v1/footer`. */
export interface FooterResponse {
  footer_section: FooterDescription | null;
}

export interface SocialMedia {
  social_media: SocialMediaItem[];
}

export interface SocialMediaItem {
  name: string;
  url: string;
  status: boolean;
  icon: string;
  order: string;
}

/**
 * Configuración global de Contact (`/gussware/v1/contact`).
 * No mezclar con el contenido editorial de la Page Contact, que vive
 * en `/wp/v2/pages` (`acf.section_content`).
 */
export interface Contact {
  phone: string | null;
  email: string | null;
  business_hours: string | null;
}

/** Respuesta de `/gussware/v1/contact` (`null` si no hay configuración). */
export interface ContactResponse {
  contact_information: Contact | null;
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
  acf?: WpFeaturedAcf;
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

  acf: WpPageAcf;

  lang: string;
  translations: Record<string, number>;
}

/** Contenido editorial de una Page (`acf.section_content`). */
export interface WpSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  social_media_text: string;
}

/** Campo `acf` de una Page de WordPress. */
export interface WpPageAcf {
  section_content: WpSectionContent;
}

/** Idioma de Polylang (`/pll/v1/languages`). */
export interface WpLanguage {
  slug: string;
  locale: string;
  name: string;
  w3c: string;
  home_url: string;
  is_default: boolean;
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

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
  show_on_front: string;
  page_on_front: number;
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

/** Menú de `/gussware/v1/menus` (ítems embebidos). */
export interface WpCustomMenu {
  id: number;
  name: string;
  slug: string;
  /** Idioma del menú (ACF `menu_language`), fuente de verdad. */
  language: string;
  items: WpCustomMenuItem[];
}

/** Ítem embebido de `/gussware/v1/menus`. */
export interface WpCustomMenuItem {
  ID: number;
  /** ID del ítem padre como cadena (`"0"` = nivel superior). */
  menu_item_parent: string;
  title: string;
  url: string;
  target: string;
  type: string;
  menu_order: number;
  post_status: string;
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

  yoast_head_json: WpPostYoastHeadJson;
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
  section_content?: WpSectionContent;
}

/** Botón opcional del Hero (`primary_button` / `secondary_button`). */
export interface WpHomeButton {
  button_text: string;
  button_url: string;
}

export interface WpHomeHero {
  eyebrow: string;
  title: string;
  description: string;
  image: number | null;
  primary_button?: WpHomeButton | null;
  secondary_button?: WpHomeButton | null;
}

export interface WpExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

export interface WpFiabilityItem {
  icon: string;
  text: string;
}

export interface WpFiability {
  title: string;
  description: string;
  fiability_items: WpFiabilityItem[];
}

export interface WpExpertise {
  eyebrow: string;
  title: string;
  description: string;
  expertice_items: WpExpertiseItem[];
  fiability: WpFiability;
}

export interface WpValuePoint {
  icon: string;
  title: string;
  description: string;
}

export interface WpTechnology {
  eyebrow: string;
  title: string;
  description: string;
  value_points: WpValuePoint[];
}

export interface WpServiceItem {
  title: string;
  description: string;
  /** URL opcional al detalle (RGW-EP09-07-03; ausente en ACF legacy). */
  url?: string;
}

export interface WpServices {
  eyebrow: string;
  title: string;
  description: string;
  items: WpServiceItem[];
}

export interface WpProcessStep {
  label: string;
  title: string;
  description: string;
  image: number | null;
}

export interface WpProcess {
  eyebrow: string;
  title: string;
  description: string;
  steps: WpProcessStep[];
  footnote?: string;
}

export interface WpFaqItem {
  pregunta: string;
  respuesta: string;
}

export interface WpFaq {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  preguntas: WpFaqItem[];
}

export interface WpFinalCta {
  title: string;
  description: string;
  button_text: string;
  button_url: string;
}

/** Campo `acf` de la Page portada del Home. */
export interface WpHomeAcf {
  hero: WpHomeHero;
  expertise: WpExpertise;
  technology: WpTechnology;
  services: WpServices;
  process: WpProcess;
  faq: WpFaq;
  final_cta: WpFinalCta;
}

/** Page portada del Home (mismos campos base que `WpPage`). */
export interface WpHomePage extends Omit<WpPage, 'acf'> {
  acf: WpHomeAcf;
}

/** Enlace opcional `{text, url}` (patrón `WpHomeButton`). */
export interface WpServiceLink {
  text: string;
  url: string;
}

/** Feature de una solución (`solutions[].features[]`). */
export interface WpSolutionFeature {
  feature: string;
}

/** Solución de un servicio (`solutions[]`). */
export interface WpSolutionItem {
  title: string;
  description: string;
  features: WpSolutionFeature[];
  link: WpServiceLink | null;
}

/** Elemento del acordeón de enfoque (`approach[]`). */
export interface WpApproachItem {
  title: string;
  description: string;
}

/** Grupo de tecnologías (`tech_groups[]`). */
export interface WpTechGroup {
  title: string;
  items: { name: string }[];
}

/** CTA del servicio (forma de `WpFinalCta`). */
export interface WpServiceCta {
  title: string;
  description: string;
  button_text: string;
  button_url: string;
}

/**
 * Campo `acf` del CPT `service` (grupo `Service Detail`, plano en REST).
 * Preguntas reutilizan `WpFaqItem` (`{pregunta, respuesta}`).
 */
export interface WpServiceAcf {
  intro_eyebrow: string;
  intro_title: string;
  intro_description: string;
  development_title: string;
  development_content: string;
  solutions_title: string;
  solutions_description: string;
  solutions: WpSolutionItem[];
  approach_title: string;
  approach_description: string;
  approach: WpApproachItem[];
  tech_title: string;
  tech_description: string;
  tech_groups: WpTechGroup[];
  faq_items: WpFaqItem[];
  cta: WpServiceCta;
}

/** Ítem del CPT `service` (`/wp/v2/services`). */
export interface WpService {
  id: number;
  slug: string;
  status: string;
  title: WpPostRendered;
  content: WpPostProtectedContent;
  excerpt: WpPostRendered;
  featured_media: number;
  acf: WpServiceAcf;
  lang: string;
  translations: Record<string, number>;
}

/** Idioma de Polylang (`/pll/v1/languages`). */
export interface WpLanguage {
  slug: string;
  locale: string;
  name: string;
  w3c: string;
  home_url: string;
  is_default: boolean;
  page_on_front: number;
}

export interface WpPostRendered {
  rendered: string;
}

export interface WpPostProtectedContent extends WpPostRendered {
  protected: boolean;
}

export interface WpPostGuid extends WpPostRendered {}

/** Ítem mínimo del CPT `service` para listados (RGW-EP09-04-03). */
export interface WpServiceSummary {
  id: number;
  slug: string;
  status: string;
  title: WpPostRendered;
  excerpt: WpPostRendered;
  lang: string;
  translations: Record<string, number>;
}

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
  description?: string;
  robots: WpPostYoastRobots;
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  og_image?: WpYoastImage[];
  article_published_time: string;
  article_modified_time: string;
  author: string;
  twitter_card: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_misc: WpPostYoastTwitterMisc;

  schema: {
    '@context': string;
    '@graph': unknown[];
  };
}

/** Imagen de `og_image` en `yoast_head_json`. */
export interface WpYoastImage {
  url: string;
  width: number;
  height: number;
  type: string;
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

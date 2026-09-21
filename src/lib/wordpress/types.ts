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
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
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

/** Tarjeta del listado del Blog lista para renderizar. */
export interface BlogCard {
  id: number;
  badge: string | null;
  title: string;
  href: string;
}

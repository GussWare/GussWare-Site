/**
 * Tipos de las respuestas de WordPress REST API usadas por el Header
 * (logo y menú principal).
 */

export interface WpSettings {
  title: string;
  description: string;
  url: string;
  site_logo: number;
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

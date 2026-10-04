/**
 * Obtención de los menús de navegación desde WordPress.
 *
 * Flujo dinámico (sin IDs hardcodeados):
 * - `GET /gussware/v1/menus` → menú por nombre + `language` (fuente de
 *   verdad del idioma), con ítems embebidos (sin segunda petición).
 * - Header: `Main` / `Main English` según locale.
 * - Footer: `Footer` / `Footer English` según locale.
 * - Legal: `Legal` / `Legal English` según locale.
 *
 * Se conservan `title`, `url`, jerarquía (`menu_item_parent`),
 * `menu_order` y `target`.
 */

import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { getDefaultLocale } from './languages';
import {
  WP_MENU_NAME_FOOTER,
  WP_MENU_NAME_FOOTER_ENGLISH,
  WP_MENU_NAME_LEGAL,
  WP_MENU_NAME_LEGAL_ENGLISH,
  WP_MENU_NAME_MAIN,
  WP_MENU_NAME_MAIN_ENGLISH,
} from './constants';
import type { HeaderMenuItem, WpCustomMenu, WpCustomMenuItem } from './types';

/**
 * RGW-273 — Normaliza un ítem crudo de WordPress conservando todas sus
 * propiedades configurables (`url`, `target`, `attr_title`, `classes`,
 * `description`, `xfn`, tipo/objeto). Exportada para pruebas.
 */
export function toHeaderMenuItem(item: WpCustomMenuItem): HeaderMenuItem | null {
  const id = item.ID;
  const parent = Number(item.menu_item_parent);

  if (
    !item ||
    !Number.isInteger(id) ||
    !Number.isInteger(parent) ||
    typeof item.title !== 'string' ||
    item.title === '' ||
    typeof item.url !== 'string' ||
    typeof item.menu_order !== 'number' ||
    typeof item.target !== 'string'
  ) {
    return null;
  }

  const classes = Array.isArray(item.classes)
    ? item.classes.filter(
        (cls): cls is string => typeof cls === 'string' && cls.trim() !== '',
      )
    : [];

  return {
    id,
    title: item.title,
    url: item.url,
    parent,
    menu_order: item.menu_order,
    target: item.target,
    attrTitle: typeof item.attr_title === 'string' ? item.attr_title : '',
    classes,
    description:
      typeof item.description === 'string' ? item.description : '',
    rel: typeof item.xfn === 'string' ? item.xfn : '',
    type: typeof item.type === 'string' ? item.type : '',
    object: typeof item.object === 'string' ? item.object : '',
    objectId: typeof item.object_id === 'string' ? item.object_id : '',
  };
}

function toHeaderMenuItems(items: WpCustomMenuItem[]): HeaderMenuItem[] {
  const normalized: HeaderMenuItem[] = [];

  for (const item of items ?? []) {
    if (item?.post_status !== 'publish') {
      continue;
    }

    const normalizedItem = toHeaderMenuItem(item);

    if (normalizedItem) {
      normalized.push(normalizedItem);
    }
  }

  return normalized.sort((a, b) => a.menu_order - b.menu_order);
}

async function getMenuItemsByName(
  name: string,
  locale: string,
  fallbackName: string,
): Promise<HeaderMenuItem[]> {
  const menus = await wpFetch<WpCustomMenu[]>(wpRoutes.menus);
  const menu =
    menus.find(
      (candidate) => candidate.name === name && candidate.language === locale,
    ) ??
    menus.find(
      (candidate) =>
        candidate.name === fallbackName && candidate.language === 'es',
    );

  if (!menu) {
    return [];
  }

  return toHeaderMenuItems(menu.items ?? []);
}

function menuName(baseName: string, englishName: string, locale: string) {
  return locale === 'en' ? englishName : baseName;
}

/**
 * RGW-273 — Nodo del menú con jerarquía padre → hijos desde WordPress
 * (`menu_item_parent`). Sin nombres ni relaciones hardcodeadas: la
 * jerarquía proviene íntegramente de los datos.
 */
export interface MenuTreeItem extends HeaderMenuItem {
  children: MenuTreeItem[];
}

/** Ítem con `href` ya resuelto (`resolveMenuHref`) y jerarquía. */
export interface ResolvedMenuTreeItem extends MenuTreeItem {
  href: string;
  children: ResolvedMenuTreeItem[];
}

/**
 * RGW-273 — Construye el árbol del menú desde la lista plana de
 * WordPress. Ordena por `menu_order` en cada nivel. Un ítem cuyo padre
 * no existe (huérfano) sube al nivel superior para no perder contenido.
 */
export function buildMenuTree(items: HeaderMenuItem[]): MenuTreeItem[] {
  const byId = new Map<number, MenuTreeItem>();

  for (const item of items) {
    byId.set(item.id, { ...item, children: [] });
  }

  const roots: MenuTreeItem[] = [];

  for (const node of byId.values()) {
    const parent = byId.get(node.parent);

    if (node.parent !== 0 && parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const byOrder = (a: MenuTreeItem, b: MenuTreeItem): number =>
    a.menu_order - b.menu_order;
  roots.sort(byOrder);

  for (const node of byId.values()) {
    node.children.sort(byOrder);
  }

  return roots;
}

/**
 * RGW-273 — Aplica `resolveMenuHref` a todo el árbol con el mismo
 * contexto de página/idioma. Recursivo: cubre cualquier profundidad
 * que WordPress configure.
 */
export function resolveMenuTreeHrefs(
  nodes: MenuTreeItem[],
  context: MenuHrefContext,
): ResolvedMenuTreeItem[] {
  return nodes.map((node) => ({
    ...node,
    href: resolveMenuHref(node.url, context),
    children: resolveMenuTreeHrefs(node.children, context),
  }));
}

/** Contexto de página para resolver el `href` de un ítem del menú. */
export interface MenuHrefContext {
  /** Ruta actual (`Astro.url.pathname`), p. ej. `/blog`. */
  currentPath: string;
  /** Ruta de la portada del locale (`/` / `/en/`). */
  homePath: string;
  /** Origen actual (`Astro.url.origin`), para detectar URLs propias. */
  currentOrigin?: string;
}

function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function siteOrigins(currentOrigin?: string): string[] {
  const origins: string[] = [];
  const wpApi = import.meta.env?.WP_API_URL as string | undefined;

  if (wpApi) {
    try {
      origins.push(new URL(wpApi.replace(/\/+$/, '')).origin);
    } catch {
      // URL base inválida: se ignora sin romper la resolución.
    }
  }

  if (currentOrigin) {
    origins.push(currentOrigin);
  }

  return origins;
}

/**
 * RGW-273 — Resuelve el `href` de un ítem del menú de WordPress según
 * su tipo, sin hardcodear destinos y sin cambiar el comportamiento
 * visual. Fuente de verdad: la URL configurada en WordPress.
 *
 * - Ancla (`#seccion`): comportamiento nativo si la página actual es la
 *   portada; desde otra página apunta a `portada + ancla` para que la
 *   sección siga siendo alcanzable. `#` solo se conserva tal cual.
 * - Ruta con ancla (`/pagina#seccion`, como configura WordPress):
 *   si es la página actual se reduce al ancla (scroll suave sin
 *   recargar); si no, se conserva para navegar y posicionar.
 * - Ruta interna (`/contacto`): se conserva tal cual.
 * - URL completa: si es del propio sitio se reduce a ruta interna
 *   (`path + search + hash`); si es externa se conserva intacta.
 * - Cualquier otro valor (`mailto:`, `tel:`, relativos): intacto.
 */
export function resolveMenuHref(
  rawUrl: string,
  context: MenuHrefContext,
): string {
  if (!rawUrl || rawUrl === '#') {
    return rawUrl;
  }

  if (rawUrl.startsWith('#')) {
    if (normalizePath(context.currentPath) === normalizePath(context.homePath)) {
      return rawUrl;
    }

    const base = context.homePath.endsWith('/')
      ? context.homePath
      : `${context.homePath}/`;
    return `${base}#${rawUrl.slice(1)}`;
  }

  if (/^https?:\/\//i.test(rawUrl)) {
    try {
      const parsed = new URL(rawUrl);

      if (siteOrigins(context.currentOrigin).includes(parsed.origin)) {
        return resolveRelative(
          `${parsed.pathname}${parsed.search}${parsed.hash}`,
          context,
        );
      }
    } catch {
      // URL no parseable: se conserva tal cual.
    }

    return rawUrl;
  }

  return resolveRelative(rawUrl, context);
}

/**
 * RGW-273 — Resuelve una ruta relativa (`/pagina#seccion`, `/ruta`).
 * Con ancla en la página actual se reduce al ancla; lo demás intacto.
 */
function resolveRelative(rawUrl: string, context: MenuHrefContext): string {
  const hashIndex = rawUrl.indexOf('#');

  if (hashIndex < 0) {
    return rawUrl;
  }

  const path = rawUrl.slice(0, hashIndex);
  const hash = rawUrl.slice(hashIndex);

  if (
    hash.length > 1 &&
    (path === '' || normalizePath(path) === normalizePath(context.currentPath))
  ) {
    return hash;
  }

  return rawUrl;
}

export async function getHeaderMenu(lang?: string): Promise<HeaderMenuItem[]> {
  try {
    const locale = lang ?? (await getDefaultLocale());
    return await getMenuItemsByName(
      menuName(WP_MENU_NAME_MAIN, WP_MENU_NAME_MAIN_ENGLISH, locale),
      locale,
      WP_MENU_NAME_MAIN,
    );
  } catch {
    return [];
  }
}

export async function getFooterMenu(lang?: string): Promise<HeaderMenuItem[]> {
  try {
    const locale = lang ?? (await getDefaultLocale());
    return await getMenuItemsByName(
      menuName(WP_MENU_NAME_FOOTER, WP_MENU_NAME_FOOTER_ENGLISH, locale),
      locale,
      WP_MENU_NAME_FOOTER,
    );
  } catch {
    return [];
  }
}

export async function getLegalMenu(lang?: string): Promise<HeaderMenuItem[]> {
  try {
    const locale = lang ?? (await getDefaultLocale());
    return await getMenuItemsByName(
      menuName(WP_MENU_NAME_LEGAL, WP_MENU_NAME_LEGAL_ENGLISH, locale),
      locale,
      WP_MENU_NAME_LEGAL,
    );
  } catch {
    return [];
  }
}

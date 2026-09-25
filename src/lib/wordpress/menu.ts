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

function toHeaderMenuItem(item: WpCustomMenuItem): HeaderMenuItem | null {
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

  return {
    id,
    title: item.title,
    url: item.url,
    parent,
    menu_order: item.menu_order,
    target: item.target,
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

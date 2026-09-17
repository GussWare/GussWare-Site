/**
 * Obtención de los menús de navegación desde WordPress.
 *
 * Flujo dinámico (sin IDs hardcodeados):
 * - Header: `GET /wp/v2/menus` → menú asignado a la ubicación `menu-1`.
 * - Footer: `GET /wp/v2/menus` → menú con `name === "Footer"`.
 * Después: `GET /wp/v2/menu-items?menus={menuId}` → ítems del menú.
 *
 * Se conservan `title.rendered`, `url`, `parent`, `menu_order` y `target`.
 */

import { wpFetch } from './client';
import { wpRoutes } from './routes';
import { wpConstants } from './constants';
import type { HeaderMenuItem, WpMenu, WpMenuItem } from './types';

function toHeaderMenuItem(item: WpMenuItem): HeaderMenuItem {
  return {
    id: item.id,
    title: item.title.rendered,
    url: item.url,
    parent: item.parent,
    menu_order: item.menu_order,
    target: item.target,
  };
}

function isValidMenuItem(item: WpMenuItem): boolean {
  return (
    !!item &&
    typeof item.id === 'number' &&
    typeof item.title?.rendered === 'string' &&
    item.title.rendered !== '' &&
    typeof item.url === 'string' &&
    typeof item.parent === 'number' &&
    typeof item.menu_order === 'number' &&
    typeof item.target === 'string'
  );
}

function toHeaderMenuItems(items: WpMenuItem[]): HeaderMenuItem[] {
  return items
    .filter(isValidMenuItem)
    .filter((item) => item.status === 'publish')
    .map(toHeaderMenuItem)
    .sort((a, b) => a.menu_order - b.menu_order);
}

async function getMenuItemsByMenuId(menuId: number): Promise<HeaderMenuItem[]> {
  const allItems: WpMenuItem[] = [];
  let page = 1;

  while (true) {
    const items = await wpFetch<WpMenuItem[]>(
      wpRoutes.menuItems(menuId, 100, page),
    );
    allItems.push(...items);

    if (items.length < 100) {
      break;
    }

    page += 1;
  }

  return toHeaderMenuItems(allItems);
}

export async function getHeaderMenu(): Promise<HeaderMenuItem[]> {
  try {
    const menus = await wpFetch<WpMenu[]>(wpRoutes.menus);
    const menu = menus.find((candidate) =>
      candidate.locations?.includes(wpConstants.menuLocations.header),
    );

    if (!menu) {
      return [];
    }

    return await getMenuItemsByMenuId(menu.id);
  } catch {
    return [];
  }
}

export async function getFooterMenu(): Promise<HeaderMenuItem[]> {
  try {
    const menus = await wpFetch<WpMenu[]>(wpRoutes.menus);
    const menu = menus.find(
      (candidate) => candidate.name === wpConstants.menuNames.footer,
    );

    if (!menu) {
      return [];
    }

    return await getMenuItemsByMenuId(menu.id);
  } catch {
    return [];
  }
}

export async function getLegalMenu(): Promise<HeaderMenuItem[]> {
  try {
    const menus = await wpFetch<WpMenu[]>(wpRoutes.menus);
    const menu = menus.find(
      (candidate) => candidate.name === wpConstants.menuNames.legal,
    );

    if (!menu) {
      return [];
    }

    return await getMenuItemsByMenuId(menu.id);
  } catch {
    return [];
  }
}

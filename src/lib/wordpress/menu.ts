/**
 * Obtención del menú del Header desde WordPress.
 *
 * Flujo dinámico (sin IDs hardcodeados):
 * 1. `GET /wp/v2/menus` → menú asignado a la ubicación `menu-1`.
 * 2. `GET /wp/v2/menu-items?menus={menuId}` → ítems del menú.
 *
 * Se conservan `title.rendered`, `url`, `parent`, `menu_order` y `target`.
 */

import { wpFetch } from './client';
import type { HeaderMenuItem, WpMenu, WpMenuItem } from './types';

const MENU_LOCATION = 'menu-1';

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

export async function getHeaderMenu(): Promise<HeaderMenuItem[]> {
  try {
    const menus = await wpFetch<WpMenu[]>('/wp/v2/menus');
    const menu = menus.find((candidate) =>
      candidate.locations?.includes(MENU_LOCATION),
    );

    if (!menu) {
      return [];
    }

    const items = await wpFetch<WpMenuItem[]>(
      `/wp/v2/menu-items?menus=${menu.id}&per_page=100`,
    );

    return items
      .filter((item) => item.status === 'publish')
      .map(toHeaderMenuItem)
      .sort((a, b) => a.menu_order - b.menu_order);
  } catch {
    return [];
  }
}

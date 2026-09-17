export const wpRoutes = {
    menus: '/wp/v2/menus',
    menuItems: (menuId: number, per_page: number) => `/wp/v2/menu-items?menus=${menuId}&per_page=${per_page}`,
    settings: '/wp/v2/settings',
    footer: '/gussware/v1/footer'
} as const;
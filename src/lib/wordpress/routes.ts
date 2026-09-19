export const wpRoutes = {
  menus: '/wp/v2/menus',
  menuItems: (menuId: number, per_page: number, page = 1) =>
    `/wp/v2/menu-items?menus=${menuId}&per_page=${per_page}&page=${page}`,
  settings: '/wp/v2/settings',
  media: (mediaId: number) => `/wp/v2/media/${mediaId}`,
  footer: '/gussware/v1/footer',
  socialMedia: '/gussware/v1/redes-sociales',
  contact: '/gussware/v1/contacto',
  header: '/gussware/v1/header',
} as const;

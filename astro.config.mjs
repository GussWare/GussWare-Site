/** Astro configuration, see https://astro.build/config */
import tailwindcss from '@tailwindcss/vite';

export default {
  // Modo SSG - por defecto y objetivo de RGW-016
  // No configurar SSR ni adapters (out of scope de esta tarea)
  
  // TypeScript está habilitado por defecto con la configuración existente
  
  // Integración de Tailwind CSS 4 mediante Vite
  vite: {
    plugins: [tailwindcss()],
  },
  
  // Configuración mínima - preparada para:
  // - RGW-017: Tailwind CSS (con Vite integration)
  // - RGW-018: React Integration / Islands  
  // - RGW-019: SSG modes
  
  // ssr: false,  // SSG mode is default
  
  // integrations: [],  // No add adapters yet
};
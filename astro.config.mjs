/** Astro configuration, see https://astro.build/config */
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default {
  // SSG - Estrategia de rendering explícita (RGW-19)
  // Astro generará un sitio estático durante el build.
  // No configurar SSR ni adapters de servidor (out of scope).
  
  // TypeScript está habilitado por defecto con la configuración existente.
  
  // Integración de React para Astro (RGW-18)
  // Permite utilizar React Islands cuando sea necesario.
  integrations: [react()],
  
  // Integración de Tailwind CSS 4 mediante Vite (RGW-17)
  vite: {
    plugins: [tailwindcss()],
  },
  
  // Configuración mínima - preparada para:
  // - RGW-017: Tailwind CSS (con Vite integration)
  // - RGW-018: React Integration / Islands  
  // - RGW-019: SSG modes
  
  // SSG modo explícito -output: "static" o equivalente.
  // Por defecto Astro genera SSG cuando no hay SSR adapter.
  // Este campo lo añadimos para hacerla explícita y documentada.
  output: "static",
  
  // ssr: false,  // SSG mode is default - commented per spec to avoid redundancy
  
  // integrations: [react()]  // React integration maintained for RGW-18
};
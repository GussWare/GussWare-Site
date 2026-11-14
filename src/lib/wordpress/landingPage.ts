import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { LandingPageVisibility } from './types';

/**
 * Valor por defecto de la configuración global de visibilidad:
 * todas las secciones de la Landing Page visibles.
 */
const defaultVisibility: LandingPageVisibility = {
  show_hero: true,
  show_expertise: true,
  show_technology: true,
  show_process: true,
  show_projects: true,
  show_faq: true,
  show_final_cta: true,
};

/**
 * Obtiene la visibilidad de las secciones de la Landing Page desde la
 * Options Page «Configuración del Sitio Web → Landing Page».
 * Ante un error de red/API, conserva el comportamiento visible por defecto.
 */
export async function getLandingPageVisibility(): Promise<LandingPageVisibility> {
  try {
    const data = await wpFetch<Partial<LandingPageVisibility>>(
      wpRoutes.landingPageVisibility,
    );
    return { ...defaultVisibility, ...data };
  } catch (error) {
    console.error('Error fetching landing page visibility:', error);
    return defaultVisibility;
  }
}

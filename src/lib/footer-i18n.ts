/**
 * RGW-359 — Textos del footer en inglés (P-10).
 *
 * El endpoint `/gussware/v1/footer` ignora el parámetro `lang` y devuelve
 * el mismo texto en español para ambos idiomas, por lo que WordPress no
 * provee valor en inglés para `footer_description` ni `footer_copyright`
 * (ver P-10 de la auditoría de navegación y enlaces).
 *
 * Como el CMS no provee el texto en inglés, este módulo expone las
 * traducciones al inglés como fallback del frontend, usado únicamente
 * para el locale `en`. El locale `es` sigue usando el valor del CMS.
 *
 * Módulo puro (sin dependencia del cliente de WordPress) para poder
 * probarlo con `node --test`.
 */

export interface FooterTexts {
  footer_description: string;
  footer_copyright: string;
}

/** Textos del footer en inglés (fallback del frontend para el locale `en`). */
export const FOOTER_TEXT_EN: FooterTexts = {
  footer_description:
    'Technology built by people. A collaborative community of independent professionals offering high-impact digital solutions with industrial precision and a human and close approach.',
  footer_copyright: '© 2024 GussWare. All rights reserved.',
};

/**
 * Devuelve los textos del footer para un locale.
 *
 * - `en`: traducciones al inglés definidas aquí (fallback del frontend).
 * - cualquier otro locale: `null` (el valor proviene del CMS).
 */
export function getFooterTexts(locale: string): FooterTexts | null {
  return locale === 'en' ? FOOTER_TEXT_EN : null;
}

/**
 * Numeración de las secciones del detalle de servicio.
 *
 * La serie es de presentación: se asigna en Astro según las secciones
 * que realmente se renderizan, no según valores almacenados en
 * WordPress. Cualquier prefijo numérico guardado en ACF (`"04 — "`) se
 * descarta antes de componer la etiqueta visible.
 */

const SECTION_NUMBER_PREFIX = /^\s*\d{1,2}\s*[—–-]\s*/;

/** Devuelve la etiqueta sin su prefijo numérico almacenado. */
export function stripSectionNumber(label?: string | null): string {
  return (label ?? '').replace(SECTION_NUMBER_PREFIX, '').trim();
}

/**
 * Compone la etiqueta visible con el número calculado.
 * Sin número devuelve solo la etiqueta; sin etiqueta, solo el número.
 */
export function formatSectionEyebrow(
  number: string | null | undefined,
  label?: string | null,
): string {
  const text = stripSectionNumber(label);

  if (!number) return text;

  return text ? `${number} — ${text}` : number;
}

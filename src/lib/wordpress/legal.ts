/**
 * RGW-268 — Datos legales de la página de Política de Privacidad.
 *
 * Origen de cada dato (sin mezclar fuentes, sin hardcodear, sin inventar):
 * - `PRIVACY_LAST_UPDATED` → Custom Field `privacy_last_updated` de la
 *   propia Page (`page.meta`, formato `YYYYMMDD`). Exclusivo de la página.
 * - Resto de etiquetas `{{TOKEN}}` → Configuración del sitio
 *   → `Información legal` (datos generales reutilizables en otras páginas
 *   legales). Se leen con `getLegalInfo()`; si la sección no expone un
 *   valor, la etiqueta se deja intacta y se reporta como dato faltante.
 */
import { wpFetch } from './client';
import { wpRoutes } from './routes';
import type { LegalInformationResponse } from './types';

/** Datos legales generales reutilizables (`Información legal`). */
export interface LegalInfo {
  siteName: string | null;
  legalEntityName: string | null;
  legalResponsibleName: string | null;
  legalAddress: string | null;
  privacyEmail: string | null;
  contactPhone: string | null;
  personalDataNameLabel: string | null;
  personalDataEmailLabel: string | null;
  personalDataPhoneLabel: string | null;
}

/**
 * Etiquetas del contenido WP que provienen de `Información legal`
 * (nunca de la página). `PRIVACY_LAST_UPDATED` no figura aquí: viene
 * del Custom Field de la página.
 */
export const LEGAL_SITE_TOKENS: Record<string, keyof LegalInfo> = {
  SITE_NAME: 'siteName',
  LEGAL_ENTITY_NAME: 'legalEntityName',
  LEGAL_RESPONSIBLE_NAME: 'legalResponsibleName',
  LEGAL_ADDRESS: 'legalAddress',
  PRIVACY_EMAIL: 'privacyEmail',
  CONTACT_PHONE: 'contactPhone',
  PERSONAL_DATA_NAME_LABEL: 'personalDataNameLabel',
  PERSONAL_DATA_EMAIL_LABEL: 'personalDataEmailLabel',
  PERSONAL_DATA_PHONE_LABEL: 'personalDataPhoneLabel',
};

/** Etiqueta que proviene del Custom Field de la página (nunca del sitio). */
export const PAGE_DATE_TOKEN = 'PRIVACY_LAST_UPDATED';

/** Custom Field `Fecha de actualización` de la Page (`page.meta`). */
export const PAGE_UPDATE_DATE_META_KEY = 'privacy_last_updated';

/**
 * Lee la configuración reutilizable del sitio para datos legales
 * (`{{baseUrl}}/gussware/v1/legal_information`, fuente de verdad de
 * `Información legal`). Mapea exactamente la estructura de la API, campo
 * por campo; los valores ausentes o vacíos quedan en `null` para que la
 * etiqueta correspondiente conserve su comportamiento actual en lugar
 * de inventarse.
 */
export async function getLegalInfo(
  lang?: string,
): Promise<LegalInfo | null> {
  const pick = (value: string | null | undefined): string | null =>
    typeof value === 'string' && value.trim() !== '' ? value : null;

  try {
    const data = await wpFetch<LegalInformationResponse>(
      wpRoutes.legalInformation(lang ?? 'es'),
    );
    const api = data.legal_information;

    if (!api) {
      return null;
    }

    const info: LegalInfo = {
      siteName: pick(api.site_name),
      legalEntityName: pick(api.legal_entity_name),
      legalResponsibleName: pick(api.legal_responsible_name),
      legalAddress: pick(api.legal_address),
      privacyEmail: pick(api.privacy_email),
      contactPhone: pick(api.contact_phone),
      personalDataNameLabel: pick(api.personal_data_name_label),
      personalDataEmailLabel: pick(api.personal_data_email_label),
      personalDataPhoneLabel: pick(api.personal_data_phone_label),
    };

    return Object.values(info).some((value) => value !== null) ? info : null;
  } catch (error) {
    console.error('Error fetching legal info:', error);
    return null;
  }
}

/**
 * Extrae la fecha del Custom Field de la página (`YYYYMMDD`).
 * Retorna `null` si la página no trae el campo.
 */
export function getPageUpdateDate(page: {
  meta?: Record<string, unknown> | null;
}): string | null {
  const raw = page.meta?.[PAGE_UPDATE_DATE_META_KEY];

  if (typeof raw !== 'string' || !/^\d{8}$/.test(raw)) {
    return null;
  }

  return raw;
}

/**
 * Formatea `YYYYMMDD` a fecha localizada (`es-MX` / `en-US`).
 * Retorna `null` con valores inválidos (no inventa fechas).
 */
export function formatLegalDate(
  yyyymmdd: string | null,
  locale: string,
): string | null {
  if (!yyyymmdd || !/^\d{8}$/.test(yyyymmdd)) {
    return null;
  }

  const year = Number(yyyymmdd.slice(0, 4));
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return null;
  }
}

export interface LegalTokenValues {
  legalInfo: LegalInfo | null;
  /** Fecha ya formateada desde el Custom Field de la página (o `null`). */
  updatedLabel: string | null;
}

/**
 * Resuelve las etiquetas `{{TOKEN}}` del HTML de WordPress con su fuente
 * correcta. Solo sustituye cuando existe un valor real; las etiquetas
 * sin fuente en WordPress se dejan intactas (dato faltante, no inventado).
 */
export function resolveLegalTokens(
  html: string,
  values: LegalTokenValues,
): string {
  let result = html;

  if (values.updatedLabel) {
    result = result.replaceAll(
      `{{${PAGE_DATE_TOKEN}}}`,
      values.updatedLabel,
    );
  }

  if (values.legalInfo) {
    for (const [token, key] of Object.entries(LEGAL_SITE_TOKENS)) {
      const value = values.legalInfo[key];

      if (value) {
        result = result.replaceAll(`{{${token}}}`, value);
      }
    }
  }

  return result;
}

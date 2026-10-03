/**
 * RGW-271 — Formularios de contacto Headless (Pavel Silinskii Contact Forms).
 *
 * Fuente de verdad: `GET /pavelsilinskii-cf/v1/forms`. Astro obtiene la
 * configuración, renderiza los campos dinámicamente y valida en el
 * frontend con las propiedades recibidas (`required`, `type`, ...).
 * Sin hardcodear campos: la respuesta de la API manda.
 *
 * Alcance RGW-271: solo lectura (GET). Sin POST ni envíos (otra tarea).
 */

import { wpFetch } from '../wordpress/client';
import { wpRoutes } from '../wordpress/routes';

/** Campo tal como lo define WordPress (`fields` del formulario). */
export interface ContactFormField {
  label: string;
  name: string;
  /** Tipo declarado en WP (`text`, `email`, `phone`, ...). */
  type: string;
  placeholder?: string;
  required?: boolean;
}

/** Formulario normalizado listo para renderizar. */
export interface ContactFormDefinition {
  id: string;
  name: string;
  fields: ContactFormField[];
}

/** Respuesta cruda del endpoint ( `fields` llega serializado como JSON ). */
interface ContactFormRaw {
  id?: string | number;
  name?: string;
  title?: string;
  fields?: string | ContactFormField[];
  is_active?: string | number | boolean;
}

/**
 * Interpreta `fields`, que actualmente llega como JSON serializado
 * dentro de la respuesta. Acepta también arreglo directo por robustez.
 */
export function parseContactFormFields(
  fields: string | ContactFormField[] | unknown,
): ContactFormField[] {
  try {
    const parsed =
      typeof fields === 'string' ? (JSON.parse(fields) as unknown) : fields;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null,
      )
      .map((item) => ({
        label: String(item.label ?? item.name ?? ''),
        name: String(item.name ?? ''),
        type: String(item.type ?? 'text'),
        placeholder:
          typeof item.placeholder === 'string' ? item.placeholder : undefined,
        required: item.required === true,
      }))
      .filter((field) => field.name !== '' && field.label !== '');
  } catch {
    return [];
  }
}

function isActive(value: ContactFormRaw['is_active']): boolean {
  return value === true || value === 1 || value === '1';
}

/**
 * Identifica el formulario de contacto: activo cuyo nombre menciona
 * "contact" (insensible a mayúsculas); si no hay coincidencia, el
 * primer formulario activo; en última instancia, el primero disponible.
 */
export function selectContactForm(
  forms: ContactFormRaw[],
): ContactFormRaw | null {
  if (forms.length === 0) {
    return null;
  }

  const active = forms.filter((form) => isActive(form.is_active));
  const candidates = active.length > 0 ? active : forms;

  return (
    candidates.find((form) =>
      String(form.name ?? form.title ?? '')
        .toLowerCase()
        .includes('contact'),
    ) ??
    candidates[0] ??
    null
  );
}

/** Respaldo visual idéntico al formulario actual (solo si la API falla). */
const FALLBACK_FIELDS: ContactFormField[] = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'hello@company.com',
    required: true,
  },
  {
    label: 'Phone Number',
    name: 'phone',
    type: 'phone',
    placeholder: '+1 (555) 000-0000',
    required: false,
  },
];

export function getFallbackContactForm(): ContactFormDefinition {
  return { id: 'fallback', name: 'Contact Form', fields: FALLBACK_FIELDS };
}

/**
 * Obtiene vía GET la configuración del formulario de contacto.
 * Nunca lanza: ante cualquier fallo devuelve el respaldo visual para
 * no romper el build ni la página (la API sigue siendo la fuente de
 * verdad cuando responde).
 */
export async function getContactForm(): Promise<ContactFormDefinition> {
  try {
    const forms = await wpFetch<ContactFormRaw[]>(wpRoutes.contactForms);

    if (!Array.isArray(forms)) {
      return getFallbackContactForm();
    }

    const selected = selectContactForm(forms);

    if (!selected) {
      return getFallbackContactForm();
    }

    const fields = parseContactFormFields(selected.fields);

    if (fields.length === 0) {
      return getFallbackContactForm();
    }

    return {
      id: String(selected.id ?? 'contact'),
      name: String(selected.name ?? selected.title ?? 'Contact Form'),
      fields,
    };
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return getFallbackContactForm();
  }
}

/**
 * Traduce el `type` de WordPress a un `type` HTML válido
 * (`phone` → `tel`; `text`/`email`/`tel` directos; resto → `text`).
 */
export function mapFieldTypeToInputType(
  type: string,
): 'text' | 'email' | 'tel' {
  const normalized = type.trim().toLowerCase();

  if (normalized === 'email') {
    return 'email';
  }

  if (normalized === 'tel' || normalized === 'phone') {
    return 'tel';
  }

  return 'text';
}

/** Autocomplete correspondiente al nombre del campo (sin inventar). */
export function autocompleteForField(name: string): string | undefined {
  const normalized = name.trim().toLowerCase();

  if (normalized === 'name') {
    return 'name';
  }

  if (normalized === 'email') {
    return 'email';
  }

  if (normalized === 'phone' || normalized.includes('phone')) {
    return 'tel';
  }

  return undefined;
}

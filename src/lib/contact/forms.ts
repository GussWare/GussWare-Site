/**
 * RGW-271 — Formularios de contacto Headless (Pavel Silinskii Contact Forms).
 *
 * Fuente de verdad: WordPress. Astro obtiene la configuración vía GET,
 * renderiza los campos dinámicamente, valida en el frontend con las
 * propiedades recibidas (`required`, `type`, ...) y envía vía POST al
 * endpoint `submit` del plugin. Sin hardcodear campos: la API manda.
 *
 * Contrato verificado en `RestApi::submitForm` del plugin:
 * - `POST .../forms/{id}/submit` con JSON plano `{ [name]: value }`
 *   (claves = `name` de cada campo definido en WP).
 * - Éxito: `201 { success: true, message, submission_id }`.
 * - Error de validación: `422 { code: 'validation_failed',
 *   data: { errors: { [name]: message } } }`.
 */

import { wpFetch } from '../wordpress/client';
import { wpRoutes } from '../wordpress/routes';

/** Id del formulario de contacto en WordPress. */
export const CONTACT_FORM_ID = 1;

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
  /** Mensaje de éxito configurado en WordPress (`success_message`). */
  successMessage: string;
}

/** Respuesta del endpoint público de un formulario (`GET /forms/{id}`). */
interface ContactFormSingleResponse {
  id?: string | number;
  name?: string;
  fields?: string | ContactFormField[];
  success_message?: string;
}

/** Respuesta cruda del listado ( `fields` llega serializado como JSON ). */
interface ContactFormRaw {
  id?: string | number;
  name?: string;
  title?: string;
  fields?: string | ContactFormField[];
  success_message?: string;
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
  return {
    id: 'fallback',
    name: 'Contact Form',
    fields: FALLBACK_FIELDS,
    successMessage: 'Thank you for your message!',
  };
}

function toDefinition(
  id: string | number | undefined,
  name: string | undefined,
  fields: ContactFormField[],
  successMessage: string | undefined,
): ContactFormDefinition | null {
  if (fields.length === 0) {
    return null;
  }

  return {
    id: String(id ?? 'contact'),
    name: name ?? 'Contact Form',
    fields,
    successMessage: successMessage || 'Thank you for your message!',
  };
}

/**
 * Obtiene vía GET la configuración del formulario de contacto
 * (`id: 1`). Usa el endpoint público del formulario y conserva el
 * listado como respaldo. Nunca lanza: ante cualquier fallo devuelve
 * el respaldo visual para no romper el build ni la página (la API
 * sigue siendo la fuente de verdad cuando responde).
 */
export async function getContactForm(
  formId: number = CONTACT_FORM_ID,
): Promise<ContactFormDefinition> {
  try {
    const single = await wpFetch<ContactFormSingleResponse>(
      wpRoutes.contactForm(formId),
    ).catch(() => null);

    if (single) {
      const definition = toDefinition(
        single.id,
        single.name,
        parseContactFormFields(single.fields),
        single.success_message,
      );

      if (definition) {
        return definition;
      }
    }

    const forms = await wpFetch<ContactFormRaw[]>(wpRoutes.contactForms);

    if (Array.isArray(forms)) {
      const selected =
        forms.find((form) => String(form.id ?? '') === String(formId)) ??
        selectContactForm(forms);

      if (selected) {
        const definition = toDefinition(
          selected.id,
          selected.name ?? selected.title,
          parseContactFormFields(selected.fields),
          selected.success_message,
        );

        if (definition) {
          return definition;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching contact forms:', error);
  }

  return getFallbackContactForm();
}

/**
 * URL absoluta del endpoint `submit` (solo servidor: se renderiza como
 * atributo `data-submit-url` para que el cliente no lea el entorno).
 */
export function getContactFormSubmitUrl(formId: number | string): string {
  const baseUrl = (
    import.meta.env.WP_API_URL as string | undefined
  )?.replace(/\/+$/, '');

  if (!baseUrl) {
    throw new Error('Falta la variable de entorno WP_API_URL.');
  }

  return `${baseUrl}/wp-json${wpRoutes.contactFormSubmit(formId)}`;
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

/**
 * RGW-271 — Envío del formulario de contacto (apta para cliente: sin
 * imports de servidor para no exponer el entorno en el bundle).
 *
 * Contrato verificado en `RestApi::submitForm` del plugin
 * (Pavel Silinskii Contact Forms):
 * - `POST .../forms/{id}/submit` con JSON plano `{ [name]: value }`.
 * - Éxito: `201 { success: true, message, submission_id }`.
 * - Error de validación: `422 { code: 'validation_failed',
 *   data: { errors: { [name]: message } } }`.
 */

/** Resultado normalizado del envío hacia WordPress. */
export interface ContactFormSubmitResult {
  ok: boolean;
  /** Mensaje de éxito de WP o mensaje de error a mostrar. */
  message: string;
  /** Errores por campo (`422 validation_failed`), clave = `name`. */
  fieldErrors: Record<string, string>;
}

/**
 * Envía los valores (claves = `name` de la API, sin hardcodear) como
 * JSON al endpoint `submit` del plugin. Nunca lanza: los fallos de red
 * o del endpoint se devuelven como resultado de error.
 */
export async function submitContactForm(
  submitUrl: string,
  data: Record<string, string>,
): Promise<ContactFormSubmitResult> {
  try {
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const payload = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
      data?: { errors?: Record<string, string> };
    } | null;

    if (response.ok && payload?.success) {
      return {
        ok: true,
        message: payload.message || 'Thank you for your message!',
        fieldErrors: {},
      };
    }

    const fieldErrors =
      response.status === 422 ? (payload?.data?.errors ?? {}) : {};

    return {
      ok: false,
      message:
        (typeof payload?.message === 'string' && payload.message) ||
        'Something went wrong. Please try again.',
      fieldErrors,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      ok: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}

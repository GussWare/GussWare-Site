/**
 * RGW-141 — Esquema Zod del formulario de Contacto (fuente de verdad de la
 * validación del lado del cliente; reutilizable luego en el servidor).
 *
 * - Name: obligatorio, sin valores vacíos.
 * - Email: obligatorio y con formato válido (mensajes distintos para vacío
 *   e inválido).
 * - Phone: opcional; vacío válido y sin restricciones adicionales.
 * Mensajes en español (idioma del sitio).
 */
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, { error: 'Por favor, ingresa tu nombre.' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Por favor, ingresa tu email.' })
    .pipe(z.email({ error: 'Ingresa un email válido.' })),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

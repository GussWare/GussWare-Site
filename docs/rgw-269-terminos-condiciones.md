# RGW-269 — Términos y Condiciones

## Análisis y decisión de arquitectura (antes de implementar)

Referencia Stitch: `GussWare - Términos y Condiciones (Oficial)` (pantalla de escritorio de 2560 px) y `GussWare - Aviso de Privacidad (Rediseño Editorial)` para verificar la estructura reutilizable.

La pantalla oficial de Términos tiene encabezado legal con eyebrow, título, resumen y metadatos; un índice lateral de 19 secciones; una ficha con cinco datos de la plataforma; las cláusulas 01–19; un enlace al Aviso de Privacidad; y un bloque final de contacto. La pantalla de Privacidad y `LegalView.astro` ya usan los mismos hooks `gw-legal-header`, `gw-legal-layout`, `gw-sidebar`, `gw-index`, `gw-main`, `gw-section` y la misma presentación legal editorial.

**Decisión: reutilizar `LegalView.astro`.** La estructura de página y navegación es compartida y el componente ya admite el contenido HTML de WordPress, las migas, la barra lateral, el scrollspy y las transformaciones tolerantes a contenido faltante. La diferencia principal es el contenido y el número de entradas del índice; se conservará la implementación de Privacidad y se ajustará únicamente el procesamiento común necesario para la página de Términos. No se creará un segundo template.

## Estado inicial de WordPress

- Página española encontrada: `terminos-y-condiciones` (ID 538, publicada).
- No se encontró traducción inglesa de Términos y Condiciones; la relación Polylang de la página contiene solo el idioma `es`.
- El contenido publicado coincidía con el contenido de Aviso de Privacidad, no con el diseño de Términos.
- La página ya tiene el campo `privacy_last_updated` (valor presente). El endpoint de Contacto general no expone un correo; `Información legal` sí contiene `privacy_email`.

## Contenido dinámico y límites de datos

Se reutilizarán las etiquetas `{{PRIVACY_LAST_UPDATED}}`, `{{SITE_NAME}}`, `{{LEGAL_RESPONSIBLE_NAME}}`, `{{LEGAL_ADDRESS}}` y `{{PRIVACY_EMAIL}}`, con los mismos orígenes WordPress de la vista de Privacidad. `{{SITE_URL}}` tomará su valor de `url` en `/wp/v2/settings`.

La respuesta de WordPress no expone valores para legislación ni jurisdicción aplicables. Se mantendrán como `{{APPLICABLE_LAW}}` y `{{GOVERNING_JURISDICTION}}`; no se asignarán valores legales ni se crearán campos nuevos.

## Implementación y validación

 - Se actualizó la página WordPress ID 538 (`terminos-y-condiciones`): se reemplazó el contenido duplicado de Privacidad por las 19 cláusulas y su índice tomados de la pantalla Stitch oficial. Se conservaron idioma, estado publicado y campo `privacy_last_updated`.
 - `LegalView.astro` se reutiliza para las dos páginas legales; el enrutado catch-all selecciona la variante por slug y los tokens mantienen WordPress como fuente. La URL proviene de `/wp/v2/settings`; no se añadió otra página ni campos.
 - Verificación REST posterior a la escritura: estado `publish`, 19 secciones, 19 enlaces del índice, tokens `{{PRIVACY_LAST_UPDATED}}` y `{{SITE_URL}}` disponibles y fecha existente preservada.
 - `npm run lint`: pasó. `npm run build`: pasó con variables locales de WordPress cargadas en el proceso. `git diff --check`: pasó.
 - Browser local (Codex in-app) abrió `/terminos-y-condiciones/` y el árbol de accesibilidad confirmó encabezado, 19 enlaces/secciones, enlace a Aviso de Privacidad y valores de los tokens resueltos. La sesión reportó viewport de 1280 px; los intentos de tamaño explícito no alteraron el viewport, así que tablet/móvil quedan pendientes de validar.

## Pendientes de contenido

WordPress no contiene valores para legislación ni jurisdicción aplicables, por lo que `{{APPLICABLE_LAW}}` y `{{GOVERNING_JURISDICTION}}` siguen visibles. Tampoco existe traducción inglesa de la página en Polylang; no se creó ni se inventó contenido. Deben proporcionarse estos datos antes de completar esos pasajes y la traducción.

# Sistema de Paletas de Colores Versionadas - GussWare-Site

## Estructura

```
src/styles/
├── global.css          # Archivo principal de estilos (importa palette.css)
├── palette.css         # Selector de versión (cambio manual)
├── theme.css           # Tokens para Tailwind 4
├── tokens/             # Tokens semánticos, tipografía, espaciado, etc.
│   ├── semantic.css    # Tokens semánticos (color-text-primary, etc.)
│   ├── typography.css  # Tokens tipográficos
│   ├── spacing.css     # Tokens de espaciado
│   ├── shape.css       # Tokens de forma
│   └── layout.css      # Tokens de layout
└── palettes/           # Paletas versionadas
    ├── v1/             # Paleta original (copia exacta)
    │   ├── brand.css
    │   ├── supporting.css
    │   └── state.css
    └── v2/             # Paleta experimental (consolidada)
        ├── brand.css
        ├── supporting.css
        └── state.css
```

## Cómo cambiar de paleta

### Para activar V2:

1. Abrir `src/styles/palette.css`
2. Comentar la sección V1 (líneas con `/* === V1 === */` hasta `}`)
3. Descomentar la sección V2 (quitar los `/*` y `*/` alrededor del bloque `:root`)
4. Guardar el archivo
5. Reiniciar el servidor de desarrollo (`npm run dev`)

### Para regresar a V1:

1. Abrir `src/styles/palette.css`
2. Comentar la sección V2 (añadir `/*` y `*/`)
3. Descomentar la sección V1 (quitar los `/*` y `*/`)
4. Guardar el archivo
5. Reiniciar el servidor de desarrollo

## Consolidaciones V2

| Función | V1 | V2 |
|---------|-----|-----|
| Fondos claros | #F9F9F9 | #F2F2F2 |
| Grises neutros | #D1D1D1 | #DADADA |
| Textos oscuros | #242126 | #1A1C1C |
| Fondos rosados error | #FFDAD6 | #FFD8D8 |

## Colores Corporativos Protegidos

Los siguientes colores NO pueden modificarse:

| Token | Valor |
|-------|-------|
| `--brand-primary` | #004A98 |
| `--brand-secondary` | #2164A6 |
| `--brand-accent` | #FF5000 |

## Colores Separados (No unificados)

Los siguientes colores mantienen valores distintos porque cumplen funciones diferentes:

| Función | Valor |
|---------|-------|
| Texto secundario | #737782 |
| Bordes | #C2C6D3 |
| Error principal | #BA1A1A |
| Texto sobre error | #93000A |

## Validación

Después de cambiar de versión:

1. Ejecutar `npm run build`
2. Verificar que no hay errores en la compilación
3. Inspeccionar en navegador para confirmar colores correctos
# Diseño UI — GESTIÓN H3GA

## Identidad visual (decisión de diseño del usuario; no atribuida a IS_26)
| Token | Color |
|---|---|
| black | `#011818` |
| white | `#FCFCFC` |
| accent | `#FFCC00` |
| secondary | `#4ECAD4` |
| primary | `#003D3D` |

Centralizar tokens en la configuración de tema Nuxt UI **compatible con la versión instalada**. Mantener las tipografías actuales del proyecto sin sustituirlas: los documentos autorizados no fijan una familia tipográfica concreta.

## Alertas y estados
Usar componentes oficiales Nuxt UI y sus colores semánticos reales: `success`, `warning`, `error` (alerta) e `info`. Mantener mensajes en español, legibles y accesibles. No usar amarillo de marca como único indicador de advertencia.

## Adaptabilidad
- **Móvil:** navegación plegable, filtros compactos, tablas con scroll interno o tarjetas, formularios de una columna.
- **Tablet:** columnas flexibles, modales adaptables.
- **Laptop y desktop:** navegación persistente cuando haya espacio, tablas y filtros visibles.
- Sin scroll horizontal de toda la página; tamaños táctiles, foco visible, etiquetas y contraste.

## Componentes base
Shell, navegación, encabezados, tablas/listados, filtros, formularios, alertas, modal de confirmación, estados de carga/error/vacío, carga de archivos, tarjetas de avance y seguimiento de etapas. Reutilizar componentes Nuxt UI en lugar de reinventarlos.

## Sustento
IS_26: RNF-03 usabilidad, RNF-01 rendimiento y matriz de roles. La elección exacta de colores y exigencia de cuatro tamaños son instrucciones visuales actuales del usuario.

## Actualización de alcance oficial
El PDF IS_26 actualizado incluye **RF-40–RF-51 de Gestión de Auxiliares** (Tabla 10). Toda referencia visual, arquitectura o integración de este módulo debe contemplar tareas, asignaciones, revisión, versiones y permisos; no supone que sus endpoints estén implementados. Los colores y las tipografías existentes permanecen sin cambios.

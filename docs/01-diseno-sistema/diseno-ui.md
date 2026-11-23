# Diseño UI — H3GA

## Fuentes
La presentación se define con esta guía, las capturas de `docs/05-modulos/` y los estilos reales. El código define componentes y tokens efectivos. Las capturas no autorizan endpoints, permisos ni reglas de negocio. Si contradicen comportamiento existente, preservar función y registrar diferencia; escalar contradicciones de negocio/seguridad.

## Identidad de marca
| Token | HEX |
|---|---|
| black | `#011818` |
| white | `#FCFCFC` |
| accent | `#FFCC00` |
| secondary | `#4ECAD4` |
| primary | `#003D3D` |

No alterar HEX sin autorización. No asumir que clases de marca están definidas ni que colores por defecto de Nuxt UI equivalen a H3GA.

## Reconciliación técnica
Antes de cambiar tema/CSS: revisar package y lockfile; inspeccionar `app/app.config.ts`, `main.css`, layouts y componentes; localizar clases sin definición y tokens efectivos; conservar tipografía actual; probar cambios pequeños y regresiones antes de extenderlos.

## Componentes y patrones
Preferir Nuxt UI 4 instalado (`UButton`, `UInput`, `UForm`, `UFormField`, `UModal`, `UAlert`, `UIcon`, tablas/selectores). Verificar API de la versión real. Personalizar para H3GA. Mantener hover, focus-visible, active, disabled, loading, invalid y readonly. Crear patrones reutilizables para notificaciones, alertas, vacíos, errores y confirmaciones. Mensajes en español, no depender solo del color/icono. Nunca usar `window.alert/confirm/prompt`.

## Responsive
| Ancho | Tratamiento |
|---:|---|
| 1920 | Figma desktop |
| 1440 | Figma laptop |
| 1024 | Adaptación Codex |
| 400 | Adaptación Codex |

Una sola interfaz fluida; probar tamaños intermedios y alturas reducidas. En móvil: navegación compacta/drawer, formularios a una columna, tablas con scroll interno o adaptación sin perder información, modales dentro del viewport, controles táctiles utilizables. Evitar scroll horizontal global, solapamientos y contenido cortado.

## Referencias
Ubicación: `docs/05-modulos/<modulo>/<interfaz>/`. Nombres recomendados: `desktop-1920.png`, `laptop-1440.png`; modales y secciones pueden tener nombres descriptivos. No renombrar/eliminar imágenes existentes sin revisar referencias. No mover capturas Figma a `public/`. Si no hay Figma, marcar «sin referencia» y registrar decisiones inferidas.

## Aceptación visual
Comprobar estructura, jerarquía, contenido, espaciado, tipografía, colores, iconos, estados, accesibilidad y responsive. Capturar 1920/1440/1024/400 cuando sea posible. No afirmar fidelidad visual si no se comparó.

# Diseño UI — H3GA (guía para adaptar el frontend existente)

## Fuentes
La identidad visual se define aquí y en las capturas exportadas de Figma ubicadas en `docs/05-modulos/<modulo>/`. La **implementación actual** debe inspeccionarse en `app/assets/css/main.css`, `app/app.config.ts`, layouts y componentes. Las capturas establecen presentación, no contratos HTTP ni permisos.

## Colores de marca — valores exactos
| Token H3GA | Hex | Propósito orientativo |
|---|---|---|
| `black` | `#011818` | Tono oscuro de marca |
| `white` | `#FCFCFC` | Superficies claras |
| `accent` | `#FFCC00` | Acento destacado |
| `secondary` | `#4ECAD4` | Acento secundario |
| `primary` | `#003D3D` | Color principal de marca |

No cambiar estos cinco valores sin autorización. El uso exacto por componente se decide a partir de Figma y los estilos existentes, no de suposiciones.

## Estado técnico observado en `main` (2026-11-23)
- `package.json`: Nuxt `^4.6.3`, `@nuxt/ui` `^4.12.0`, Tailwind CSS `^4.3.3`.
- `app/app.config.ts` configura `ui.colors.primary = 'green'` y `neutral = 'slate'`.
- `app/assets/css/main.css` define `--font-sans: 'Public Sans', sans-serif` y la escala `green-50` a `green-950`, que **no es la paleta H3GA**.
- Componentes existentes usan clases como `text-marca-*`, `bg-profundo-*`, `font-display` y clases `neutral-*`. **Verificar dónde se definen esas clases** antes de cambiarlas o asumir que funcionan: la hoja global inspeccionada no contiene sus definiciones.
- Estas diferencias son **pendientes de reconciliación técnica**, no autorización para sustituir los colores de marca ni la tipografía.

## Reglas para Codex
1. Inspeccionar la versión instalada y los tokens realmente resueltos por Nuxt UI/Tailwind.
2. Crear o ajustar un tema coherente con los cinco HEX **sin romper** clases y componentes existentes. Evitar cambios masivos de color antes de comparar con las capturas.
3. Reutilizar `UButton`, `UInput`, `UForm`, `UFormField`, `UModal`, `UAlert`, `UIcon` y otros componentes disponibles cuando correspondan al diseño; verificar sus APIs en la versión instalada.
4. No usar la apariencia por defecto de Nuxt UI cuando contradiga Figma. Preservar accesibilidad, estados hover/focus/disabled/loading, errores y contraste.
5. Conservar la fuente que utiliza efectivamente la aplicación; no introducir otra por preferencia personal.
6. Iconografía: comprobar los iconos `i-lucide-*` existentes antes de añadir nuevos.

## Responsividad y referencias
| Vista | Ancho de comprobación | Fuente visual |
|---|---:|---|
| Desktop | 1920 px | Figma proporcionado |
| Laptop | 1440 px | Figma proporcionado |
| Tablet | 1024 px | Adaptación a generar por Codex |
| Mobile | 400 px | Adaptación a cargo de Codex; **sin Figma móvil** |

Una única interfaz fluida; probar también tamaños intermedios. En móvil adaptar sidebar a navegación usable, formularios a una columna, tablas a scroll **interno** o tarjetas, y modales al viewport. No eliminar campos ni acciones por falta de espacio. No debe existir scroll horizontal global accidental.

## Convención de imágenes
- Ruta principal de diseño: `docs/05-modulos/<nombre-modulo>/<vista>-<desktop|laptop|tablet>.<png|jpg|webp>`; se admiten subcarpetas por vista y nombres diferentes si son claros.
- Modales y formularios son referencias independientes asociadas a una página; documentar qué abre cada modal y qué acción ejecuta.
- Recursos que sí se muestran en la app permanecen en `public/img/` u otra ruta ya usada por el código. No mover automáticamente capturas de Figma a `public/`.
- Cuando no exista captura para un tamaño, inferir adaptación desde las tres versiones disponibles y señalar cualquier ambigüedad importante.

## Convenciones Nuxt UI y operaciones destructivas
- Utilizar componentes de Nuxt UI 4 instalados para `success`, `warning`, `info` y `error`, con semántica y accesibilidad consistentes; respetar el sistema de marca H3GA en los demás elementos.
- Notificaciones transitorias: mecanismo de toast disponible en la versión instalada; avisos persistentes: componentes de alerta apropiados.
- Confirmar eliminaciones con diálogo modal de Nuxt UI que identifique el registro, permita cancelar, deshabilite doble envío y refleje carga, éxito o fallo. Nunca usar `window.confirm()`, `window.alert()` ni `window.prompt()`.
- El botón «Eliminar» en maquetación no debe ejecutar una operación real sin integración comprobada.
- Capturas esperadas: **1920 y 1440 px**. Codex genera **1024 y 400 px**; no solicitar Figma tablet o móvil.

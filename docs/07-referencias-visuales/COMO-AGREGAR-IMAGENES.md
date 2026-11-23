# Cómo agregar imágenes para que Codex construya interfaces en orden

## Ubicación en el repositorio frontend
```text
public/referencias/
  01-autenticacion/
  02-clientes/
  03-gestion-auxiliares/
  04-gestion-documental/
  05-formatos/
  06-biblioteca/
  07-dashboard/
  08-modalidades/
  09-proceso-final/
  10-servicios-complementarios/
```
Crea carpetas según las pantallas que tengas; no es necesario llenar todas desde el principio.

## Nombres y orden
- `01-listado-desktop.png`
- `02-formulario-desktop.png`
- `03-detalle-tablet.png`
- `04-detalle-mobile.png`

Usa números para indicar el orden de revisión y agrega una fila por imagen en `manifiesto-imagenes.md`.

## Qué escribir en el manifiesto
| Orden | Imagen | Pantalla | Elementos que conservar | Cambios solicitados |
|---|---|---|---|---|
| 1 | `public/referencias/03-gestion-auxiliares/01-listado-desktop.png` | Listado | Distribución | Paleta oficial y responsive |

## Instrucción para Codex
«Revisa `docs/07-referencias-visuales/manifiesto-imagenes.md` y abre las capturas de `public/referencias/` siguiendo el orden indicado. Usa su composición como referencia visual y crea interfaces responsivas en Nuxt UI. Conserva las tipografías actuales, aplica la paleta oficial y respeta los requerimientos de IS_26. No infieras permisos, campos ni endpoints a partir de imágenes».

## Distinción
- `public/referencias/`: capturas para Codex, no mostrarlas en la aplicación.
- `public/imagenes/`: recursos que sí aparecerán en la aplicación.
- `assets/`: estilos y recursos procesados por Nuxt, según configuración.

Anonimiza datos personales en las capturas.

## Actualización de alcance oficial
El PDF IS_26 actualizado incluye **RF-40–RF-51 de Gestión de Auxiliares** (Tabla 10). Toda referencia visual, arquitectura o integración de este módulo debe contemplar tareas, asignaciones, revisión, versiones y permisos; no supone que sus endpoints estén implementados. Los colores y las tipografías existentes permanecen sin cambios.

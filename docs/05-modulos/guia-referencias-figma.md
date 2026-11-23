# Guía de referencias Figma — H3GA

## Ubicación
Guardar imágenes en `docs/05-modulos/<modulo>/<interfaz>/`. Una interfaz puede ser página, detalle, sección, formulario, modal o estado.

```text
docs/05-modulos/
  modalidades/
    pagina-clientes/
      desktop-1920.png
      laptop-1440.png
    detalles-cliente/
      desktop-1920.png
      laptop-1440.png
    modales/
      subir-documento.png
```

## Tamaños
| Ancho | Fuente |
|---:|---|
| 1920 px | Figma desktop |
| 1440 px | Figma laptop |
| 1024 px | Adaptación Codex |
| 400 px | Adaptación Codex |

No solicitar Figma tablet/móvil. Una sola interfaz fluida cubre tamaños intermedios. Capturas antiguas de otros tamaños son auxiliares, no obligatorias si contradicen estándar actual.

## Nombres y conservación
Preferir PNG. Nombres recomendados: `desktop-1920.png`, `laptop-1440.png`; modales/secciones con nombre descriptivo. No renombrar/eliminar imágenes existentes ni romper referencias. Registrar nombres reales. No crear carpetas vacías. No mover Figma a `public/`; esa carpeta contiene recursos usados por la app.

## Interpretación e inventario
Las imágenes definen presentación, no requisitos, permisos ni contratos. Para comportamiento consultar RF, código y backend. Si algo no se lee, registrar duda. Por imagen registrar ruta exacta, módulo, tipo, resolución si se puede verificar, interfaz/ruta/componente relacionado, RF, tamaño y dudas.

## Comparación
Comparar 1920/1440 con Figma y probar 1024/400. Revisar anchos intermedios, scroll, sidebar, tablas, formularios, modales, teclado y foco. No declarar fidelidad sin comparación. Si no hay referencia o navegador, registrar limitación.

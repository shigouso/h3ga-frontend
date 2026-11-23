# Guía de referencias Figma — H3GA

## Ubicación única
Guardar las imágenes **dentro de `docs/05-modulos/`**, en una carpeta por módulo y una subcarpeta por interfaz (pantalla, formulario, modal o estado).

Ejemplo:

```text
docs/05-modulos/
  clientes/
    listado/
      desktop-1920.png
      laptop-1440.png
    formulario-cliente/
      desktop-1920.png
      laptop-1440.png
    modal-eliminar/
      desktop-1920.png
      laptop-1440.png
  dashboard/
    inicio/
      desktop-1920.png
      laptop-1440.png
```

Los nombres pueden variar, pero deben permitir identificar **módulo + interfaz + tamaño**. No es necesario crear carpetas vacías para interfaces sin imágenes.

## Tamaños y prioridad
| Ancho | Fuente |
|---|---|
| 1920 px (desktop) | Captura Figma proporcionada |
| 1440 px (laptop) | Captura Figma proporcionada |
| 1024 px (tablet) | Adaptación creada por Codex |
| 400 px (mobile) | Adaptación creada por Codex |

No solicitar capturas tablet ni móvil. Si hay capturas tablet antiguas de calidad insuficiente, **no tratarlas como referencia obligatoria**. Crear una sola implementación fluida para todos los tamaños, incluyendo intermedios.

## Qué exportar
- Captura completa de cada página.
- Formulario o modal en imagen separada cuando no sea claramente legible en la captura principal.
- Estados especiales importantes, si existen: `vacio`, `error`, `modal-abierto`, etc.
- PNG recomendado, sin necesidad de exportar cuatro versiones.

## Cómo interpretar las capturas
- Las imágenes definen presentación, no endpoints, permisos ni validaciones.
- Consultar `AGENTS.md`, `diseno-ui.md`, tabla de RF y código real.
- Reutilizar Nuxt UI 4 y componentes existentes; preservar la identidad H3GA.
- Para `success`, `warning`, `info`, `error` y confirmación de borrado, utilizar patrones Nuxt UI aunque el diseño no incluya capturas de esos estados.
- No inventar comportamientos destructivos ni simular guardados reales en la etapa visual.

## Comprobación por interfaz
- [ ] Correspondencia visual a 1920 px.
- [ ] Correspondencia visual a 1440 px.
- [ ] Adaptación utilizable a 1024 px.
- [ ] Adaptación utilizable a 400 px.
- [ ] Formularios, modales, tablas y navegación sin desbordamiento.
- [ ] Acciones pendientes de API identificadas sin simular éxito.

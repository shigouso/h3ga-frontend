# Prompt 2 — Etapa 1: maquetar todas las interfaces H3GA

Ejecuta el plan aprobado del Prompt 1, **solo en su etapa de maquetación**, sobre el frontend Nuxt actual.

Fuentes: `AGENTS.md`, código real, tabla de requerimientos, diccionario como apoyo, cuatro guías técnicas, inventario y capturas en `docs/05-modulos/`.

## Diseño y responsividad
- Reproduce las capturas **1920 desktop** y **1440 laptop** de cada pantalla, formulario y modal.
- Genera las adaptaciones **1024 tablet** y **400 mobile** sin solicitar diseños adicionales. Una sola implementación responsiva, no páginas duplicadas.
- Respeta los cinco HEX H3GA y los estilos definidos en `diseno-ui.md`. Revisa cuidadosamente la configuración real del tema.
- Prioriza componentes de **Nuxt UI 4** y reutiliza Vue existente. Construye componentes compartidos solo cuando aporten reutilización real.
- Alertas, notificaciones y estados `success`, `warning`, `info`, `error` con patrones Nuxt UI; confirmación destructiva con diálogo Nuxt UI, nunca `window.confirm()`.

## Módulos visuales
- Asesor: gestión auxiliar, modalidades, pensión final, servicios complementarios, biblioteca, dashboard y expediente del cliente con botón «Ver expediente».
- Auxiliar: biblioteca, gestión documental, dashboard.
- Supervisor: formatos institucionales, dashboard.
- Reutiliza biblioteca/dashboard y adapta visibilidad según rol. No suprimas otras rutas existentes sin autorización.

## Límites de esta etapa
- **Preserva** autenticación, composables, llamadas API, permisos y comportamiento ya implementado.
- Implementa navegación, estructura, formularios, modales y estados locales necesarios para probar visualmente las pantallas.
- **No agregues integraciones HTTP nuevas**, no inventes endpoints ni simules una operación guardada como si hubiera ocurrido.
- Si una acción depende de la segunda etapa, déjala claramente identificada como pendiente, sin botón que afirme éxito falso.
- No modifiques backend ni generes commits, pushes o PR.

Trabaja módulo por módulo y continúa con los demás mientras tengas contexto suficiente. Después de cada módulo, ejecuta las verificaciones disponibles y compara visualmente 1920/1440/1024/400 con navegador si existe. No declares pruebas que no ejecutaste.

Entrega módulos maquetados, archivos modificados, diferencias con Figma, resultados de pruebas y acciones pendientes de integración. **Detente al terminar la maquetación y espera aprobación antes de la etapa 2.**

# Prompt 3 — Auditar y corregir la maquetación H3GA

Audita la **Etapa 1 visual** antes de iniciar nuevas conexiones API.

1. Relee `AGENTS.md`, `diseno-ui.md`, `permisos-frontend.md`, `guia-referencias-figma.md` y el inventario.
2. Compara cada interfaz con sus capturas **1920 desktop** y **1440 laptop**.
3. Comprueba que las adaptaciones **1024 tablet** y **400 mobile** sean utilizables, sin desbordamiento horizontal accidental.
4. Revisa layout, sidebar, navegación por rol, botón «Ver expediente», tablas, filtros, formularios, modales, estados vacíos y carga.
5. Comprueba componentes Nuxt UI y variantes `success`, `warning`, `info`, `error`, más diálogos de confirmación de eliminación con cancelar/confirmar. No permitir borrados reales en la etapa visual.
6. Verifica que no se hayan eliminado conexiones existentes, rutas, controles de acceso ni lógica de negocio.
7. Ejecuta los comandos de tipado, lint, pruebas y build realmente disponibles. Si existe navegador, verifica capturas por tamaño; si no, indica que la revisión visual no se pudo completar.
8. Corrige los defectos introducidos por la maquetación sin rediseñar funcionalidades aprobadas ni añadir endpoints.

Entrega: lista de interfaces revisadas, diferencias detectadas y corregidas, comprobaciones ejecutadas, regresiones, y lista de acciones reservadas para la **Etapa 2 de integración funcional**.

No hagas commits, push, PR, reset ni stash. No comiences la Etapa 2 sin aprobación del usuario.

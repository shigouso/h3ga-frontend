# Arquitectura frontend — H3GA

## Stack y estructura
El proyecto declara Nuxt 4, Vue 3, TypeScript, Nuxt UI 4, Tailwind CSS 4, Pinia, Zod y date-fns. Confirmar versiones exactas en lockfile. Inspeccionar `app/pages/`, layouts, components, composables, stores, utils, tipos, `types/api.d.ts`, CSS, `app.config.ts` y `nuxt.config.ts`. Las rutas deben inventariarse desde el árbol real; una opción de menú no demuestra que exista una página.

## Principios
1. Mantener el Nuxt existente.
2. Reutilizar componentes, composables, stores y layouts funcionales.
3. Mantener páginas delgadas; lógica de dominio en composables/servicios existentes.
4. No duplicar componentes por rol o breakpoint.
5. Evitar abstracciones prematuras y dependencias nuevas sin justificación.
6. Preservar autenticación, navegación y permisos salvo cambio aprobado.

## Navegación y roles
Roles técnicos observados: `asesor`, `auxiliar`, `supervisor`. Revisar `menu.ts`, `permisos.ts` y middleware antes de tocar rutas. La distribución visual de la guía de permisos no equivale a autorización backend.

## Integración
Usar `useApi()` y composables según sus firmas reales. Revisar método, ruta, parámetros, request, response, tipos, errores y permisos antes de conectar. Una llamada frontend es expectativa, no prueba de soporte backend. No inventar endpoints ni adaptar DTO por conveniencia. Mantener cargas/descargas autenticadas.

## Módulos y rutas
Derivar páginas de RF, código y matriz de implementación. La matriz distingue existente, adaptar, crear y bloqueado. El expediente se abre desde «Ver expediente» y conserva el ID del cliente, reutilizando rutas existentes cuando corresponda. No eliminar rutas que no sean módulos principales sin autorización.

## Ejecución
Auditoría → inventario → shell/patrones compartidos → maquetación módulo por módulo → revisión visual → aprobación → integración de operaciones pendientes → auditoría funcional. Durante maquetación preservar APIs existentes y no agregar llamadas nuevas.

## Calidad
Ejecutar scripts realmente presentes en package.json. No asumir `api:types`, e2e u otros scripts sin verificarlos. Actualizar matriz y checklist con resultados reales. Una ruta o componente parcial no equivale a módulo terminado.

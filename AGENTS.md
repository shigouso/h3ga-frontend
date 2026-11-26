# AGENTS.md — Frontend H3GA

## Propósito
Implementar el frontend existente de H3GA sobre Nuxt 4. No reconstruir el proyecto, reemplazar lógica por maquetas ni modificar backend. Cubrir las interfaces aprobadas, preservar integraciones existentes y entregar una experiencia coherente, accesible y responsiva.

## Fuentes y precedencia
1. Código/configuración actuales: verdad sobre rutas, librerías, componentes, composables, tipos y comportamiento.
2. `docs/Tabla de requerimientos de los modulos.md`: alcance y numeración oficial RF-01 a RF-75; conservar RF-9 exactamente.
3. Backend vigente y Swagger/OpenAPI: única evidencia de endpoints, DTO, validaciones y permisos efectivos.
4. Matriz/inventario de `docs/05-modulos/`: desglose operativo, siempre respaldado por RF y código.
5. `diseno-ui.md` y capturas Figma: presentación, no contratos ni permisos.
6. Guías de arquitectura, API y roles: contrastar con código/backend.
7. `docs/08-prompts/`: procedimiento, nunca fuente autónoma de requisitos.

El diccionario de datos es apoyo conceptual, no prueba de API. Excluir H3GA Finanzas salvo alcance explícito. No usar documentos históricos ni rutas inexistentes como fuente superior. Si falta evidencia o hay contradicción de negocio/seguridad, registrar bloqueo y preguntar; no inventar.

## Stack y reutilización
Respetar `package.json`, lockfile y APIs de versiones instaladas. Stack observado: Nuxt 4, Vue 3, TypeScript, Nuxt UI 4, Tailwind CSS 4 y Pinia. Inspeccionar antes de crear `pages`, `components`, `layouts`, `composables`, `stores`, `utils`, tipos, CSS y configuración. Reutilizar componentes y `useApi()`; no agregar dependencias ni duplicar lógica sin justificación. No sustituir APIs reales por mocks.

## Diseño y responsive
Colores H3GA: black `#011818`, white `#FCFCFC`, accent `#FFCC00`, secondary `#4ECAD4`, primary `#003D3D`. No modificar HEX ni tipografía sin autorización. Contrastar tema Nuxt UI/Tailwind con CSS real antes de cambios globales. Interfaces en español. Figma esperado: 1920 y 1440; Codex adapta 1024, 400 y anchos intermedios. Una sola interfaz fluida, sin páginas duplicadas. Accesibilidad de teclado, foco, contraste y tacto; sin scroll horizontal global accidental.

## Roles y seguridad
Roles técnicos: `asesor`, `auxiliar`, `supervisor`. Inspeccionar `permisos.ts`, `menu.ts`, middleware y store antes de cambios. Visibilidad UI no equivale a autorización backend. No alterar roles, rutas, sesión ni permisos sin evidencia y aprobación. No exponer tokens ni datos sensibles.

## Distribución visual acordada
- Asesor: gestión auxiliar, modalidades, pensión final/proceso final, servicios complementarios, biblioteca, dashboard y expediente mediante «Ver expediente».
- Auxiliar: biblioteca, gestión documental y dashboard.
- Supervisor: formatos institucionales y dashboard.
Biblioteca y dashboard son compartidos. Esta distribución no elimina rutas existentes ni confirma permisos backend.

## Plan obligatorio
1. Auditar documentación, código, rutas, componentes, API, permisos e imágenes.
2. Completar inventario y matriz antes de programar.
3. Preparar shell y patrones globales.
4. Implementar módulo por módulo, cerrando sus interfaces y verificaciones antes de avanzar.
5. Preservar integraciones existentes; no añadir HTTP ni simular éxito durante maquetación.
6. Obtener aprobación visual antes de nuevas integraciones.
7. Actualizar matriz y checklist con evidencias.

## Estados y calidad
Representar carga, vacío, error, sin permisos, validación, éxito y advertencia. Usar patrones Nuxt UI 4 para notificaciones semánticas `success/warning/info/error`. Operaciones destructivas requieren diálogo accesible, cancelar, bloqueo de doble envío y resultado real. Nunca usar `window.alert/confirm/prompt` ni éxito ficticio.

Ejecutar solo scripts existentes: `pnpm typecheck`, `pnpm lint`, `pnpm build` y pruebas disponibles. Si hay navegador, comparar 1920/1440 y probar 1024/400; declarar limitaciones. Reportar archivos, interfaces, pruebas ejecutadas, diferencias, integraciones y bloqueos. No hacer commits, pushes, PR, reset, stash ni cambios destructivos automáticamente.

# Integración API y estados — H3GA

## Criterio de evidencia
Esta guía se basa en **llamadas presentes en el frontend `main`**, no en una auditoría completa del backend. Una ruta usada por un composable es una **expectativa del frontend**, no un endpoint confirmado. Para afirmar compatibilidad, contrastar con Swagger/OpenAPI, controladores, DTO, guards y respuestas del backend vigente.

## Cliente HTTP existente
- `nuxt.config.ts`: `runtimeConfig.public.apiBase` (valor vacío en configuración revisada; debe configurarse por entorno).
- `app/composables/useApi.ts`: `$fetch`, token `Bearer`, operaciones GET/POST/PUT/PATCH/DELETE, descarga y lectura de archivos, manejo de errores.
- `app/stores/session.ts`: `POST /auth/login` con `correo_electronico`, `contrasena`; respuesta esperada `access_token`, `usuario`, `expires_in`; sesión en Pinia y `sessionStorage`.
- `app/utils/api-error.ts`: `ApiError` con `status`, `mensaje`, posibles `campos` y `detalle`.
- `types/api.d.ts`: tipos generados presentes; el mecanismo de regeneración requiere revisión (el script `api:types` no aparece en `package.json` inspeccionado).

## Rutas observadas en composables (no verificadas contra backend en esta revisión)
| Área | Operaciones y rutas vistas | Archivo |
|---|---|---|
| Sesión | `POST /auth/login` | `stores/session.ts` |
| Clientes | `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PATCH /clientes/:id`, `PATCH /clientes/:id/asesor` | `useClientes.ts` |
| Catálogos cliente | `GET /catalogos/regimenes`, `/leyes-probables`, `/afores` | `useClientes.ts` |
| Usuarios | `GET/POST /usuarios`, `PATCH /usuarios/:id`, `PATCH /usuarios/:id/contrasena` | `useUsuarios.ts` |
| Catálogos usuario | `GET /catalogos/roles`, `/catalogos/tipos-asesor` | `useUsuarios.ts` |
| Agenda | `GET/POST /agenda`, `PATCH /agenda/:id` | `useAgenda.ts` |
| Dashboard | `GET /dashboard?limite=50` | `useDashboard.ts` |
| Documentos | `GET/POST /clientes/:id/documentos`, `PATCH /clientes/:id/documentos/:documentoId`, `GET .../descargar`, `GET /catalogos/tipos-documento` | `useDocumentos.ts` |
| Correcciones | `GET/POST /clientes/:id/correcciones`, `PATCH/DELETE /clientes/:id/correcciones/:correccionId`, `GET /catalogos/tipos-correccion` | `useCorrecciones.ts` |
| Expediente | `GET /clientes/:id/etapas`, `GET /catalogos/estatus`, `GET /avisos` | `useExpediente.ts` |

Los demás composables (F0/F1, reportes, trámites, auxiliares, avisos, etc.) deben inventariarse al implementar sus vistas, sin asumir que la tabla anterior es exhaustiva.

## Estados y errores
- `401`: sesión inválida; `useApi` cierra sesión cuando hay token.
- `403`: acceso denegado; `useApi` muestra aviso.
- `400`: puede exponer errores por campo cuando el backend envía arreglo de mensajes.
- `0`/red: aviso de conexión; `404`, `409`, `422`, `500`: tratar según contrato real y contexto, sin suponer una respuesta uniforme.
- Vistas: mostrar carga, vacío, error, permiso denegado, confirmación, validación y éxito cuando corresponda. Evitar doble envío.
- Archivos: `FormData` donde lo usa el composable, descarga autenticada mediante `useApi`, sin publicar URL privadas ni tokens.

## Protocolo para Codex
Antes de conectar un botón o formulario: identificar composable y tipos existentes → revisar ruta/método/cuerpo → cotejar contrato backend → implementar → comprobar errores y roles. Si falta confirmación del backend, dejarlo **pendiente de verificación** y no simular éxito. No modificar backend desde la tarea de interfaces.

## Separación de etapas
Durante la **maquetación** no agregar llamadas HTTP ni mocks que simulen guardados exitosos. Mantener intactas las integraciones existentes y marcar las acciones aún no conectadas. Después de la aprobación visual, contrastar cada nueva operación con backend/Swagger y con la tabla de requerimientos antes de conectar.

Para errores HTTP reales, usar los mecanismos existentes de `useApi()` y mostrar notificaciones/alertas Nuxt UI con variantes semánticas (`success`, `warning`, `info`, `error`) cuando corresponda. Las eliminaciones requieren confirmación modal previa y resultado verificable; no inventar endpoints `DELETE`.

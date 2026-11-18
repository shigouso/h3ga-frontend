# Seguridad y permisos — Frontend

## Fuentes
IS_26, matriz de roles y funciones (pp. 49–50); AGENTS vigente del backend; `jwt-auth.guard.ts`, `roles.decorator.ts` y `clientes.controller.ts`.

## Roles
- `asesor`
- `auxiliar administrativo`
- `administrador` (corresponde al perfil de supervisión operativa según AGENTS backend)

## Operaciones documentadas
| Función | Asesor | Auxiliar administrativo | Administrador/supervisor |
|---|---|---|---|
| Administrar expedientes de sus clientes | Sí | Apoyo documental autorizado | IS_26: consulta documental |
| Solicitar elaboración de documentos | Sí | Recibe solicitudes | No se documenta |
| Elaborar/cargar/corregir documentos solicitados | Revisa y valida | Sí | No se documenta |
| Aprobar u observar entregas de auxiliar | Sí | Atiende observaciones | No se documenta |
| Eliminar documentos generados por otros | No inferir | **No** | No inferir |
| Consultar avances/reportes | Seguimiento propio | Según alcance | Sí, supervisión |
| Agenda | Sí | Sí | Consulta según IS_26 |

**Decisión actual de producto:** no crear interfaz operativa de administrador para Gestión de Auxiliares o Gestión Documental. La memoria sí menciona consulta documental de supervisión; mantenerla como diferencia explícita y no inventar un permiso operativo.

## Advertencia sobre clientes.controller.ts
El auxiliar no está autorizado en las rutas de clientes mostradas. El rol `administrador financiero` aparece en lectura, pero no es equivalente a `auxiliar administrativo`. El frontend no debe resolverlo saltándose la API.

## Regla esencial
Ocultar o deshabilitar acciones no autorizadas mejora UX, pero **no es seguridad suficiente**. La API debe validar rol, propiedad del cliente y asignación activa.

## Trazabilidad de permisos de Gestión de Auxiliares

RF-40 y RF-42: asignación de auxiliares y creación de tareas a cargo del asesor. RF-41: consulta de asignaciones activas. RF-43–45: consulta de tareas y elaboración/actualización de documentos por auxiliar, respetando permisos. RF-46–47 y RF-49: revisión, validación y consulta del estado de documentos por asesor. RF-48: corrección con nuevas versiones e historial. RF-50: auxiliar solo elimina archivos propios, sujeto a conservación documental. RF-51: estados de tareas pendientes, completadas o canceladas. La UI no reemplaza validaciones del backend.

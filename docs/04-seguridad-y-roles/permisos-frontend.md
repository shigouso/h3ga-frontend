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

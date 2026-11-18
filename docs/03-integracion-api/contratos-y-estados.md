# Contratos HTTP y estados de interfaz

## Evidencia técnica disponible
`jwt-auth.guard.ts`: guard de Passport `jwt`.
`roles.decorator.ts`: `@Roles(...roles)` mediante metadatos `roles`.
`clientes.controller.ts`: controlador relativo `clientes`, protegido con `JwtAuthGuard` y `RolesGuard`.

| Acción | Método | Ruta relativa declarada | Roles declarados |
|---|---|---|---|
| Listar clientes | GET | `/clientes` | administrador, administrador financiero, asesor |
| Detalle cliente | GET | `/clientes/:id` | administrador, administrador financiero, asesor |
| Crear cliente | POST | `/clientes` | asesor |
| Actualizar cliente | PATCH | `/clientes/:id` | administrador, asesor |

**No se verificó prefijo global** ni cuerpos/respuestas del servicio. Los archivos disponibles no prueban endpoints documentales, de modalidades ni de auxiliares.

## Reglas de integración
- Obtener contrato vigente de Swagger o del backend antes de implementar cada conexión.
- No fabricar rutas, respuestas o permisos. Identificar pantallas como **pendientes de API** si no hay contrato.
- El auxiliar no figura autorizado en el controlador de clientes proporcionado: una vista de expediente auxiliar requiere una API autorizada que filtre por asignación.
- 401 → sesión; 403 → acceso denegado; 404 → no encontrado; 400/422 → errores de formulario; 500 → error recuperable.
- Documentos: `multipart/form-data` solo si así lo exige el endpoint real; no asumir almacenamiento ni URL pública.
- No exponer tokens, documentos privados ni información personal en consola.
- Usar loading/empty/error/success y evitar doble envío.

## Actualización de alcance oficial
El PDF IS_26 actualizado incluye **RF-40–RF-51 de Gestión de Auxiliares** (Tabla 10). Toda referencia visual, arquitectura o integración de este módulo debe contemplar tareas, asignaciones, revisión, versiones y permisos; no supone que sus endpoints estén implementados. Los colores y las tipografías existentes permanecen sin cambios.

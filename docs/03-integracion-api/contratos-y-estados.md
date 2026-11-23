# Integración API y estados — H3GA

## Evidencia
Este documento define el protocolo, no certifica contratos. Una llamada en composable solo indica expectativa frontend. Swagger/OpenAPI y backend vigente confirman ruta, método, DTO, respuesta, validaciones y autorización. Registrar evidencia y fecha.

## Inventario de cada acción
| Campo | Registrar |
|---|---|
| RF / interfaz | Requisito e interfaz que dispara acción |
| Composable | Archivo y función existente |
| Endpoint | Método y ruta exactos |
| Request/response | DTO, parámetros, tipos y respuesta real |
| Permiso | Rol, propiedad y asignación verificados |
| Estados | Loading, éxito, vacío, error, conflicto |
| Evidencia | Swagger, controlador/DTO/guard o prueba |
| Estado | Existente sin verificar / verificado / pendiente / bloqueado |

## Protocolo de conexión
1. Identificar RF, interfaz y acción.
2. Localizar composable, tipos y comportamiento actual.
3. Revisar método, ruta, request y response.
4. Verificar Swagger y controlador/DTO/guards backend.
5. Confirmar autorización, propiedad y validaciones.
6. Implementar con cliente/patrones existentes.
7. Manejar carga, éxito, vacío, error y conflicto.
8. Probar y registrar evidencia.

## Estados
- Loading: indicador y bloqueo de doble envío cuando aplique.
- Vacío: explicar qué falta; ofrecer acción solo si está autorizada.
- Red: mensaje recuperable y reintento seguro.
- 401: respetar gestión de sesión existente.
- 403: informar denegación; nunca eludir.
- 404: distinguir recurso inexistente según contrato.
- 409: explicar conflicto, no sobrescribir silenciosamente.
- 400/422: mostrar errores por campo solo con payload verificado.
- 500: mensaje general, sin stack ni datos sensibles.
- Éxito: únicamente tras confirmación real del servidor.
- Destructivas: confirmación previa, evitar doble envío y mostrar resultado real.

No asumir payloads uniformes ni semántica de códigos sin contrastar backend.

## Archivos
Usar FormData cuando lo exija contrato/composable. Confirmar MIME, extensión y tamaño admitidos. Una captura que muestra .doc/.pdf no prueba que backend los almacene. Descargas autenticadas mediante mecanismos existentes; no exponer URL privadas/token. No eliminar, reemplazar ni versionar sin validar propiedad y conservación.

## Separación de etapas
Maquetación: preservar integraciones actuales; no agregar HTTP ni mocks que simulen persistencia; señalar acciones pendientes. Tras aprobación visual: verificar contrato/permisos, conectar y actualizar matriz con evidencia.

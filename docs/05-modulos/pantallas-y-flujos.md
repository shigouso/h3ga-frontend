# Pantallas y flujos funcionales H3GA

## Fuente oficial
La numeración vigente es exclusivamente la de `docs/Tabla de requerimientos de los modulos.md`. Este resumen no sustituye la descripción literal de cada RF ni demuestra existencia de API.

## Correspondencia de módulos y RF
| Módulo | RF | Interfaces/flujo a inventariar |
|---|---|---|
| Autenticación | RF-01–02 | Login y acceso según sesión/rol |
| Gestión Documental | RF-03–07 | Clientes, expediente, consulta, carga, sustitución y validación documental |
| Formatos Institucionales | RF-08–12 | Catálogo, alta, nombre/enlace, carga .doc/.pdf, consulta, edición y eliminación |
| Biblioteca | RF-13–14 | Catálogo de recursos externos y descarga |
| Dashboard | RF-15–16 | Actividades/trámites próximos, etapa y avance por rol |
| Modalidades | RF-17–18 y RF-61–75 | Registro, fases, restricciones, agenda, alertas, filtros y documentos |
| Proceso Final | RF-19–32 | Etapas, solicitud, resoluciones, cobranza, compromisos, alertas, indicadores y documentos |
| Servicios Complementarios | RF-33–46 | Catálogo, formularios por servicio, requisitos, seguimiento, edición/eliminación y exportación |
| Migración | RF-47–48 | Proceso backend Excel; UI solo si hay alcance explícito/API autorizada |
| Gestión Auxiliar | RF-49–60 | Asignaciones, tareas, entregas, revisión, observaciones, versiones y estados |

RF-61–75 son complementarios de Modalidades. No reasignar. Conservar RF-9 tal como aparece en la fuente oficial.

## Flujos de alto nivel
### Gestión documental y auxiliares
Asesor asigna/autoriza auxiliar y solicita tarea/documento → auxiliar consulta y prepara/carga → asesor revisa y aprueba u observa → auxiliar corrige y carga versión nueva → asesor consulta estado. Eliminación auxiliar limitada a archivos propios y reglas de conservación backend.

### Modalidades
Asesor consulta clientes → entra al detalle → consulta/actualiza fases/datos de modalidad admitida → revisa agenda, compromisos y documentos. La regla de una o dos modalidades y combinaciones permitidas debe reflejarse en UI y validarse backend.

### Proceso Final
Asesor consulta clientes/etapas → revisa progreso y compromisos → registra/actualiza datos institucionales, acciones y fechas → consulta documentos, resoluciones y cobranza. No inventar etapas/campos.

### Servicios Complementarios
Asesor selecciona servicio → captura formulario específico → revisa requisitos/seguimiento → actualiza o elimina según permiso/contrato → exporta PDF/Word si está disponible y verificado.

## Desglose
Cada flujo se divide en páginas, formularios, modales, estados y acciones en `matriz-implementacion.md`. Para cada control documentar evento, datos, validaciones, destino, lógica existente, API/evidencia y estados de resultado.

## Límites
No deducir endpoints/permisos/campos desde Figma. RF-47–48 no obliga a pantalla si migración es exclusivamente backend. Una tabla del diccionario no implica UI. Excluir H3GA Finanzas salvo alcance explícito.

# Inventario de interfaces derivado de IS_26

Este inventario propone **pantallas para cubrir funciones documentadas**; no afirma que existan endpoints. Para el detalle literal, ver `docs/00-contexto-general/requerimientos-funcionales-referencia.md`.

| Módulo | RF oficiales | Interfaces necesarias |
|---|---|---|
| Autenticación | RF-01–02 | Inicio de sesión; acceso según rol |
| Gestión Documental | RF-03–07 | Expediente del cliente, lista de documentos, carga, consulta, sustitución, validación de faltantes/correcciones |
| Formatos Institucionales | RF-08–12 (PDF: RF-9) | Catálogo, alta de formato, enlace, carga .doc/.pdf, edición, eliminación |
| Biblioteca de Recursos | RF-13–14 | Catálogo de formatos externos, descarga .doc/.pdf |
| Dashboard Operativo | RF-15–16 | Actividades próximas, pendientes, etapa y avance por cliente, diferenciación por rol |
| Modalidades de Pensión | RF-17–18 | Registro de M10/M40/M40 retroactiva, consulta de etapas seleccionadas |
| Proceso Final y Cobranza | RF-19–23 | Seguimiento IMSS/ISSSTE, AFORE, solicitud de pensión, resoluciones, cobranza final |
| Servicios Complementarios | RF-24–37 | Solicitud, catálogo (Mejoravit, desempleo, préstamos, PPR), otro servicio, formularios por tipo, requisitos, seguimiento, edición/eliminación, exportación PDF/Word |
| Migración de datos | RF-38–39 | Estado de importación Excel solo si existe API autorizada; proceso principal es servicio backend NestJS/SheetJS |
| Gestión de Auxiliares | Matriz de roles IS_26 pp. 49–50; tabla `cliente_auxiliares` en diccionario | Asignación por cliente, solicitudes del asesor, tareas/entregas, revisión y observaciones. **Sin RF numérico oficial propio en el PDF inspeccionado** |

## Flujo documental (matriz de roles)
Asesor solicita documento → auxiliar elabora y carga → asesor valida, aprueba u observa → auxiliar corrige → aprobación. El auxiliar solo puede eliminar archivos generados por sí mismo.

## Prioridad de diseño
1. Shell, autenticación y clientes.
2. Gestión de Auxiliares y Gestión Documental.
3. Dashboard y Modalidades.
4. Formatos, Biblioteca, Proceso Final, Servicios Complementarios.
5. Integración, validación y pruebas.

## Nota sobre el diccionario auxiliar
`Diccionario de datos (1).md` contiene además **H3GA Finanzas**. No convertir sus tablas financieras en pantallas de Gestión; si el backend ofrece lectura autorizada, documentarla por separado.

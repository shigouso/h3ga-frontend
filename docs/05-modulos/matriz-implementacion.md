# Matriz de implementación y cobertura RF — H3GA

Auditoría documental del 2026-11-23. No se implementó código. El usuario aclara que las integraciones existentes fueron desarrolladas/probadas con otra versión del backend: no se clasifican como errores por diferir del repositorio local. Ver [comparación de contratos](comparacion-contratos-versiones.md), [inventario completo](inventario-interfaces.md) e [informe](informe-auditoria-frontend.md).

## Criterios de estado

- Parcial: existe código que contribuye al RF; no demuestra cobertura integral de las nuevas interfaces ni compatibilidad con el backend local.
- Pendiente: falta UI dedicada o parte sustancial del flujo. Puede existir backend local sin consumidor.
- Sin UI: requisito de proceso backend; no obliga a inventar una pantalla.
- API V: contrato comprobado estáticamente en el repositorio local, sin prueba runtime ni confirmación de vigencia.
- API E: consumidor existente de la versión anterior; compatibilidad pendiente. API P: contrato/operación faltante o insuficiente en el backend local.
- Ningún estado equivale a aprobación visual o funcional. «Bloqueo» no implica defecto confirmado del frontend; identifica una decisión o evidencia necesaria.

## Estado por interfaz principal

Las fichas del inventario contienen campos, secciones, modales, disparadores, roles, rutas y componentes. Sus subIDs forman parte de la fila principal correspondiente.

| ID | Estado visual y acción pendiente | Código/reutilización | API / bloqueos |
|---|---|---|---|
| AUT-01 | Adaptar login a referencias; conservar lógica | pages/login.vue, session, layout auth | E; B01/B02 |
| AUT-02 | Crear 3 modales, confirmar alcance | Sin consumidor recuperación | V parcial; sin verificar-código; B11 |
| GLOB-01 | Adaptar montaje shell/tema/navegación | app.vue, layouts, menu/permisos | E; B01/B02/B03 |
| GLOB-02 | Unificar estados y confirmaciones | useApi/UModal/toasts/componentes actuales | Transversal; pruebas pendientes |
| EXP-01 | Adaptar perfil/agrupaciones/documentos | páginas cliente/archivos, ClientePerfil/useExpediente | E + V diferentes; B01/B02/B06 |
| EXP-02 | Adaptar carga por contexto | DocumentoSubirFormulario/useDocumentos | E + V diferentes; B06 |
| EXP-03/04 | Adaptar visor/revisión existentes | archivos.vue | E; B06 |
| GD-01 | Crear listado | /gestion-documental sin página | V parcial; B01/B02 |
| GD-02 | Crear detalle contextual | Bases EXP | V parcial; B06/B07 |
| GD-03 | Crear subir/editar de auxiliar | Bases documentos; no sustituir integración previa | V/P; tarea/versión; B06 |
| GD-04/05/06 | Crear tareas/versiones/eliminación permitida | Sin UI dedicada | V para tareas/versiones; P DELETE |
| FI-01 | Crear listado | /formatos-institucionales sin página | V metadatos; B02/B05 |
| FI-02 | Crear estado vacío | Parte FI-01 | Misma fuente, sin ruta extra |
| FI-03 | Crear alta/editar/visor/enlace | Sin composable formatos actual | V metadatos/P archivos; B05 |
| FI-04 | Crear confirmación eliminación | Sin UI | V baja lógica; B02 |
| BIB-01/02/03 | Crear catálogo/vacío/visor | /biblioteca sin página; patrón FI | V listado/P descarga501; B02/B05 |
| AUX-01 | Crear principal | Sin ruta ni permiso dedicados | V; B02/B07 |
| AUX-02 | Crear sección, preservar autorización por cliente | AuxiliaresAutorizados/useAuxiliares | E + V rutas distintas |
| AUX-03/04 | Crear tareas/enviados/revisión | Sin consumidor de tareas/envíos | V; B07 |
| AUX-05 | Crear 4 modales | Asignación existente solo como base | V parcial; vínculo global no probado |
| AUX-06/07 | Crear estados/cancelación/historial | Sin UI dedicada | V transiciones/versiones; B07 |
| MOD-01/02 | Crear listado/detalle | /modalidades sin página, bases perfil | V; B08 |
| MOD-03 | Crear M10/M40/M40R, F1 solo lectura | Componentes F1 preservados | V modalidades/E F1; B01/B08 |
| MOD-04 | Crear carga por etapa | Base documental | V subida; B06 |
| MOD-05/06/07 | Crear selección/agenda/indicadores | Sin UI dedicada | V; B08 |
| MOD-08/09 | Diseñar editar/sustituir/eliminar autorizados | Sin UI específica | V metadatos/P reemplazo/DELETE |
| PF-01/02 | Crear listado/detalle | /pension-final sin página, bases perfil/etapas | V parcial; B09 |
| PF-03/04 | Crear etapas/resolución/institucionales | Bases seguimiento/documentos | V; diseño incompleto; B09 |
| PF-05 | Crear compromisos/alertas | Utilidades de fechas reutilizables | V |
| PF-06 | Crear modal, no integrar carga sin contrato | Base carga documental | P subida por etapa PF; B06 |
| PF-07/08/09 | Crear cobranza/porcentajes/progreso/KPI | Sin UI dedicada | V con límites/P KPI; B09 |
| SC-01/02 | Crear listado/detalle | /servicios-complementarios sin página | P; B10 |
| SC-03 | Crear 4 modales tras precisar datos | Sin consumidor | P; B10 |
| SC-04/05/06/07/08 | Crear formularios por tipo/requisitos/exportaciones/eliminar/alertas | Sin UI; no inferir desde Finanzas | P; B10 |
| DASH-01 | Crear por rol; diseño bloqueado | Inicio starter, useDashboard sin consumidor | E contrato esperado/P operativo local; B04 |
| LEG-01 a LEG-10 | Preservar páginas/funciones anteriores; revisar compatibilidad | Inventario de clientes/F0/F1/usuarios/configuración/avisos | E; pendiente comparación/prueba versión correcta |
| MIG-01/02 | Sin UI obligatoria | No se modificó backend | P evidencia de migración |

## Cobertura individual de los 75 RF

Descripciones resumidas: la fuente normativa es [tabla oficial](../Tabla%20de%20requerimientos%20de%20los%20modulos.md). Cada RF aparece exactamente una vez como fila principal. No se infieren nuevos permisos de una imagen ni se reenumeran RF-61–75. RF-47/48 permanece proceso backend.

| RF | Función oficial resumida | Interfaces relacionadas | Frontend comprobado | Contrato local y pendiente concreto |
|---|---|---|---|---|
| RF-01 | Inicio de sesión | AUT-01 | Parcial: formulario y store de versión anterior | E/V: login existe en ambas versiones; respuesta rol/expiración diferente, no modificar sin acuerdo |
| RF-02 | Acceso por rol | AUT-01, GLOB-01, LEG-07 | Parcial: middleware/permisos/menu | E/V: nombres/IDs distintos; B02, backend decide autorización |
| RF-03 | Documentos personales por cliente | EXP-01/02/03, GD-01/02/03 | Parcial: tabla/carga/visor existentes | E/V: rutas/proyección documental distintas; preservar consumidor previo |
| RF-04 | Documentos generados por asesor | EXP-01/02/03, GD-02 | Parcial: archivos del expediente | E/V: falta separación visual y confirmar origen/clasificación |
| RF-05 | Cliente, asesor y expediente autorizado | EXP-01, GD-01/02, LEG-01/03 | Parcial: ClientePerfil/useExpediente | E/V: GET clientes paginado y acceso auxiliar diferentes; proyección documental no incluye nombre asesor |
| RF-06 | Actualizar/sustituir documentos | EXP-02, GD-03.2 | Parcial: editar metadatos/revisión y carga previa | E/P: local PATCH no reemplaza binario; confirmar versión anterior y contrato de sustitución |
| RF-07 | Validación documental | EXP-04, GD-02, LEG-04 | Parcial: estatus/documentos requeridos | E/P: si/no/por_confirmar no equivale a revisión de envíos; criterios por trámite pendientes |
| RF-08 | Nombre y enlace de formato | FI-03.1/03.4 | Pendiente | V: POST gestión formatos; requiere dependencia y tipo no dibujados |
| RF-9 | Cargar .doc/.pdf de formato | FI-03.1/03.2 | Pendiente | P: no multipart; archivo_path no acredita carga; B05 |
| RF-10 | Consultar formatos | FI-01/02/03.3 | Pendiente | V: listado/detalle paginados; crear consumidor tras aprobación |
| RF-11 | Actualizar formato | FI-03.2/03.4 | Pendiente | V metadatos; archivo real pendiente; confirmar cambio archivo/enlace |
| RF-12 | Eliminar formato | FI-04 | Pendiente | V: DELETE lógico; confirmación/permiso supervisor-administrador pendientes |
| RF-13 | Biblioteca de formatos externos | BIB-01/02 | Pendiente | V: GET biblioteca; resolver biblioteca compartida/guard auxiliar y supervisor |
| RF-14 | Descargar Word/PDF biblioteca | BIB-03, FI-03.3 | Pendiente | P: descargar() local lanza 501; no simular descarga |
| RF-15 | Fechas y pendientes por rol | DASH-01, LEG-10 | Pendiente: dashboard no implementado | E useDashboard no consumido/P API operativo local; sin Figma |
| RF-16 | Etapa y avance en dashboard | DASH-01 | Pendiente | P: sin contrato operativo local/diseño; no sustituir por financiero |
| RF-17 | Registrar modalidad | MOD-05 | Pendiente | V: PUT selección por cliente; aprobar UI |
| RF-18 | Estructurar/consultar etapas modalidad | MOD-02/03 | Pendiente | V: fases/estados; cinco fases API frente a stepper6 |
| RF-19 | Actualizar estado/porcentaje/acción/fecha PF | PF-03/04/08 | Pendiente: patrón genérico reutilizable | V: PATCH etapa, reglas porcentaje/motivo; controles faltantes en Figma |
| RF-20 | Ingreso formal solicitud pensión | PF-04.1/04.4 | Pendiente | V: datos institucionales/etapa/documentos; alta archivo PF pendiente |
| RF-21 | Escenarios de resolución | PF-04.1/04.2/04.3 | Pendiente | V: etapas aplicables; referencias negativa/juicio solo tabs |
| RF-22 | Consulta cobranza final | PF-07 | Pendiente | V limitado: pagos no vinculados individualmente al cierre; mantener aviso; solo lectura |
| RF-23 | Listado clientes PF | PF-01 | Pendiente | V: GET clientes del asesor con etapas8–14 |
| RF-24 | Detalle PF y etapas independientes | PF-02/03/04 | Pendiente | V: GET cliente/etapa; imagen1440 incorrecta |
| RF-25 | Estado y porcentaje por etapa PF | PF-03/04/08 | Pendiente | V: estado/avance; falta porcentaje en referencia |
| RF-26 | Acciones y fechas compromiso PF | PF-03/04/05 | Pendiente | V: PATCH acción/fecha; no inferir plazos legales |
| RF-27 | Documentos por etapa PF | PF-03/04/06 | Pendiente | V consulta; carga de diseño no acreditada para etapa PF en API documental |
| RF-28 | Buscar/filtrar clientes PF | PF-01 | Pendiente | V parcial: q/estatus/orden; filtro etapa de RF/Figma no localizado |
| RF-29 | Indicadores PF | PF-01/09 | Pendiente | P: sin agregado específico; no contar solo página local |
| RF-30 | Compromisos próximos/vencidos PF | PF-05 | Pendiente | V: compromisos global/por cliente; confirmar zona horaria |
| RF-31 | Datos institucionales PF | PF-04.4 | Pendiente | V: GET/PUT institución/folio/expediente/fechas/resultado/observaciones |
| RF-32 | Progreso general PF | PF-08 | Pendiente | V parcial: media excluye no_aplica; revisar sesgo por filtro estatus y resumen detalle |
| RF-33 | Solicitud servicio independiente | SC-01/03.1 | Pendiente | P: sin API operacional localizada; no usar solicitud de tarea |
| RF-34 | Catálogo y selección servicios | SC-01/03.1 | Pendiente | P: Mejoravit/APD/préstamos/PPR desde RF; contrato catálogo faltante |
| RF-35 | Otro servicio nombre/descripción | SC-03.2 | Pendiente | P: Figma omite descripción; DTO faltante |
| RF-36 | Formulario propio de cada servicio | SC-04.1–4 | Pendiente | P: faltan cuatro formularios/campos/reglas; no inventar |
| RF-37 | Seguimiento detallado servicio | SC-02/08 | Pendiente | P: presentación parcial, sin contrato |
| RF-38 | Actualizar solicitud servicio | SC-02/03.3/04 | Pendiente | P: falta DTO y efecto de cambiar servicio |
| RF-39 | Eliminar solicitud servicio | SC-07 | Pendiente | P: falta contrato/restricciones/confirmación |
| RF-40 | Requisitos por servicio | SC-05 | Pendiente | P: listas/reglas oficiales sin referencia/API |
| RF-41 | Criterios cubiertos/pendientes | SC-05 | Pendiente | P: criterios y estados por servicio no definidos |
| RF-42 | Desglose para autorizar servicio | SC-05 | Pendiente | P: faltan contenido/regla y forma de emisión |
| RF-43 | Archivos generados al expediente | SC-03.4/06, EXP-01 | Pendiente | P: carga manual dibujada no acredita vinculación automática de generados |
| RF-44 | Exportación PDF servicio | SC-06 | Pendiente | P: sin endpoint/plantilla; F0/F1 PDF no cubre este RF |
| RF-45 | Exportación Word servicio | SC-06 | Pendiente | P: sin endpoint/plantilla; no añadir dependencia sin evidencia |
| RF-46 | Avance independiente servicio | SC-02/08 | Pendiente | P: stepper no define máquina de estados contractual |
| RF-47 | Consolidación Excel a base | MIG-01 | Sin UI obligatoria | P: falta evidencia de ejecución/servicio backend; no crear pantalla |
| RF-48 | ETL NestJS/SheetJS/PostgreSQL | MIG-02 | Sin UI obligatoria | P: verificar implementación y resultados backend; no es una migración de esquema Prisma |
| RF-49 | Asignar/autorizar auxiliares | AUX-02/05.1/05.4, LEG-03 | Parcial: AuxiliaresAutorizados | E/V: rutas distintas; no hay vínculo global auxiliar-asesor sin cliente probado |
| RF-50 | Consultar asignaciones activas | AUX-02, LEG-03 | Parcial: lista por cliente | E/V: GET asignaciones con filtros; principal global pendiente |
| RF-51 | Crear tarea con título/instrucciones | AUX-03/05.2 | Pendiente | V: POST tareas; instrucciones obligatorias vs descripción opcional Figma |
| RF-52 | Auxiliar consulta sus tareas | GD-04, AUX-03 | Pendiente | V: GET tareas con cliente/estado; UI auxiliar incompleta |
| RF-53 | Documento auxiliar ligado a tarea | GD-03.1/04 | Pendiente | V: POST envío exige tarea/título/tipo y POST versión; modal incompleto |
| RF-54 | Descargar/editar/actualizar archivos | GD-03.2/05, BIB-03 | Pendiente | V versiones/descarga documental; P formatos descarga501; editar no implica editor web |
| RF-55 | Asesor revisa envíos | AUX-04/07 | Pendiente | V: GET envíos por tarea y revisión autorizada |
| RF-56 | Aprobar/no validar con observación | AUX-04/05.3 | Pendiente | V: PATCH revisión; no_validado requiere comentario; respuesta tarea |
| RF-57 | Corregir conservando versiones | GD-05, AUX-07 | Pendiente | V: POST/GET versiones; revisar acceso e historial real |
| RF-58 | Estados revisión documentos | AUX-04/06/07 | Pendiente | V: estatus envío separados del estatus tarea; no equiparar si/no documental |
| RF-59 | Eliminar archivos propios auxiliar | GD-06 | Pendiente | P: no DELETE observado; propiedad/conservación no resueltas por icono |
| RF-60 | Actualizar estado tareas | AUX-06, GD-04 | Pendiente | V: transiciones por rol; confirmar completada frente a validada |
| RF-61 | Listado clientes modalidades | MOD-01 | Pendiente | V: listado asesor dueño; crear consumidor |
| RF-62 | Detalle independiente modalidades | MOD-02/03 | Pendiente | V: detalle por cliente/modalidad |
| RF-63 | Una/dos y combinaciones permitidas | MOD-05 | Pendiente | V: reglas M10/M40/M40R o M10+M40R/M40+M40R; UI faltante |
| RF-64 | Actualizar fases/estados modalidad | MOD-02/03 | Pendiente | V: PATCH modalidad; reconciliar fase y estado final |
| RF-65 | Mostrar datos diagnóstico en modalidad | MOD-03, LEG-05 | Parcial: F1 existe como origen, no vista modalidades | E F1 previo/V proyección modalidad; verificar campos uno a uno, lectura sin doble captura |
| RF-66 | Datos específicos seguimiento modalidad | MOD-03 | Pendiente | V: fecha IMSS/salario diario decimal en cadena/fase/estado; no editar campos F1 |
| RF-67 | Agenda clientes/modalidades | MOD-06, MOD-02 | Pendiente | V: agenda global/cliente; useAgenda anterior tiene otra finalidad/ruta |
| RF-68 | Alertas próximas/vencidas | MOD-06, MOD-02 | Pendiente | V: alertas; fecha/umbral por contrato, no ejemplo Figma |
| RF-69 | Documentos relacionados por etapa | MOD-02/03 | Pendiente | V: documental filtrado etapa; verificar cliente/modalidad seleccionada |
| RF-70 | Subir documento cliente/etapa | MOD-04 | Pendiente: formulario genérico reutilizable | V: subida documental asesor, etapa de modalidad; falta consumidor contextual |
| RF-71 | Filtros nombre/modalidad/estado/fecha | MOD-01 | Pendiente | V: query DTO; nombres/valores no copiables desde labels visuales |
| RF-72 | Indicadores modalidades | MOD-07, MOD-01 | Pendiente | V: indicadores; referencia incompleta, usar agregado real |
| RF-73 | Ver/descargar archivos propios | MOD-02/03 | Pendiente: visor genérico reutilizable | V: visualizar/descargar con propiedad; integrar tras aprobación |
| RF-74 | Actualizar/sustituir documento modalidad | MOD-08 | Pendiente | V metadatos/P reemplazo binario; conservar asociación |
| RF-75 | Eliminar documentos modalidad autorizados | MOD-09 | Pendiente | P: no DELETE documental local; reglas de integridad/conservación pendientes |

## Requisitos no funcionales

| RNF | Relación | Evidencia y pendiente |
|---|---|---|
| RNF-01 | Listados/documentos/calendario/PDF | Sin mediciones contra API; N+1 en diagnósticos y paginación local son riesgos, no incumplimiento medido |
| RNF-02 | Todos, almacenamiento | Lockfile no reproduce app; falta carga >100 clientes/usuarios y entorno real |
| RNF-03 | GLOB-01/02 y todas las interfaces | Referencias revisadas, tokens discrepantes; sin navegador/teclado/contraste medidos |
| RNF-04 | Etapas/documentos/revisión | Historial existente y auditoría parcial local; verificar actor/fecha/versiones runtime |
| RNF-05 | EXP/GD/FI/BIB/MOD/PF/SC | Descarga formatos local pendiente; respaldo PostgreSQL/Spaces no comprobado |

## Cierre de auditoría y puerta de aprobación

62 imágenes inventariadas; 75 RF relacionados individualmente; 2 RF justificados sin UI obligatoria. Cero RF se declara cerrado de extremo a extremo en esta fase. Eso no invalida las pruebas históricas de la versión anterior.

Typecheck pasó; lint falló con 388 errores/9 advertencias; build pasó al repetir fuera del sandbox después de EPERM. Sin navegador/API runtime. Evidencia y límites en informe/checklist. No se avanza a maquetación hasta autorización del usuario; nuevas integraciones requieren además aprobación visual y contratos confirmados.

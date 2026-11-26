# Inventario comprobado de interfaces H3GA

Auditoría: 2026-11-23. Análisis únicamente; no se crearon interfaces. Complementos: [matriz RF y estados](matriz-implementacion.md), [informe y contratos](informe-auditoria-frontend.md), [checklist](../06-pruebas/checklist-frontend.md).

## Convenciones y alcance

Se conservan los IDs principales anteriores. Los sufijos distinguen piezas del mismo flujo, no nuevas rutas. Adaptar significa código existente parcial respecto de las nuevas referencias; crear significa ausencia de interfaz dedicada; bloqueada señala falta de evidencia/decisión. Ninguno significa aceptación funcional.

El usuario confirma que el frontend procede de otra versión del backend y que login/autenticación y otras funciones ya fueron probadas. Las diferencias con el repositorio backend local son incompatibilidades pendientes de verificación entre versiones, no errores confirmados de esas integraciones.

«Base» identifica código reutilizable, no implementación del módulo completo. Los destinos de menú existen en configuración; nuevas rutas de detalle quedan por aprobar. Cada modal necesita disparador, cancelar/cerrar, foco y resultado real.

Estados transversales E: carga, vacío inicial, sin resultados, error/reintento, sin permiso, validación, enviando/doble envío, éxito real y advertencia. En páginas nuevas están pendientes; en existentes hay implementaciones parciales, sin verificación runtime en esta auditoría. D agrega confirmación/cancelación/resultado para destructivas. V agrega tipo no previsualizable, descarga fallida e historial cuando corresponda. Las capturas no acreditan todos estos estados.

Roles: A asesor, X auxiliar, S supervisor. Indican distribución visual o regla frontend, no autorización del backend local. Responsive pendiente de ejecución para todas las interfaces: 1920/1440 contra referencias; 1024/400 e intermedios por adaptación. Recortes de sección/modal no son páginas independientes.

## 1. Autenticación y base global

| ID / tipo | Ubicación y reutilización | Campos, secciones y acciones | Disparador, estados, rol y RF |
|---|---|---|---|
| AUT-01 / página | /login, pages/login.vue; layout auth, session, useApi | Correo, contraseña, mostrar/ocultar, iniciar; validación y error de credenciales. Adaptación visual pendiente | E; todos; RF-01/02. Preservar integración anterior; compatibilidad pendiente |
| AUT-02.1 / recuperación | Crear modal; sin composable específico | Correo, cancelar, enviar código; mensaje genérico sin revelar existencia de cuenta | Desde recuperar acceso del login, pendiente; E; todos. Derivado del diseño, apoyo RF-01 sin RF autónomo |
| AUT-02.2 / código | Crear modal | Seis dígitos, reenviar, cancelar, verificar | Desde envío de correo; E + reenvío/expiración por contrato. Backend local no ofrece verificación separada |
| AUT-02.3 / contraseña | Crear modal | Nueva contraseña/confirmación/visibilidad; cancelar/guardar; igualdad. Texto visual min8/mayúscula/número no equivale a DTO | Tras código; reset definitivo según contrato; E; alcance/secuencia B11 |
| GLOB-01 / shell | app.vue, layouts/default.vue y auth.vue, AppLogo, menu/permisos/session | Logo, sidebar/activo, header/título, perfil, campana, configuración, cerrar sesión; adaptar montaje/paleta/idioma | Logout abre confirmación existente; E/D; todos; RF-02, RNF-03 |
| GLOB-02 / patrones | useApi, ApiError, toasts, UModal, estados existentes | Unificar carga/vacío/error/403/validación/advertencia y confirmación; semántica success/warning/info/error | E/D/V; todos; RNF-03/04; sin aceptación visual |

AUT-02 agrupa tres modales, no tres endpoints ni nuevas páginas.

## 2. Expediente y gestión documental

| ID / tipo | Ruta/base y estado | Secciones/campos/acciones | RF, roles, estados y límites |
|---|---|---|---|
| EXP-01 / página | Adaptar /clientes/:id/archivos; preservar /clientes/:id. ClientePerfil, useExpediente, useDocumentos | Perfil, datos oficiales/previsionales/fechas; documentos personales/generados por asesor; buscar, filtros/orden, ver/descargar/subir. Código usa tabla unificada | RF-03/04/05/07; A desde Ver expediente; permiso real por contrato. E/V |
| EXP-01.1 / perfil | ClientePerfil | Nombre, edad derivada, teléfono/WhatsApp, correo, domicilio, nacimiento, asesor, etapas, objetivo; AFORE/NSS/CURP/RFC/INE y otros datos existentes; copiar | RF-05; no transcribir datos ficticios ni ocultar por CSS datos no autorizados |
| EXP-01.2 / pestañas | Datos/fechas existentes | Código muestra ingreso/nacimiento/próxima cita; Figma incluye subdelegación y no expande fechas | RF-05; reconciliar presentación, sin inferir fechas institucionales editables |
| EXP-02 / carga | Adaptar DocumentoSubirFormulario | Imagen: tipo/fase/archivo. Código: tipo/archivo/referencia/observaciones, PDF/JPEG/PNG, 10 MiB; cancelar/subir | Botón Subir documento; E; RF-03/04/06; etapa/reemplazo requieren contrato |
| EXP-03 / visor | Modal existente en archivos.vue | Nombre/preview según MIME, descargar/cerrar | Desde ver; V; RF-03/04/05; revisar ciclo de vida blob |
| EXP-04 / revisión | Modal existente en archivos.vue | Estatus si/no/por_confirmar, observaciones; guardar/cancelar | Desde revisar; E; RF-07. Diferente de validado/no validado de envíos |
| GD-01 / clientes | Crear /gestion-documental; bases useClientes/perfil solo tras compatibilidad | Buscar/filtro; tabs Diagnósticos/Correcciones/Modalidades/Retiros/Pensión final; cards cliente/asesor/fecha/etapas, datos/pendientes desplegables, detalle | RF-03/05/52; X; E. «Retiros» no autoriza módulo nuevo |
| GD-02 / detalle | Crear ruta por aprobar; bases EXP | Perfil + Archivos por revisar: documento/cliente/fecha/tipo/fase/estado; buscar/filtrar/subir/editar/borrar/descargar; acordeón tareas pendientes | RF-03–07/52–59; X; E/D/V. No perder columnas relevantes en 1440 |
| GD-03.1 / subir | Crear variante contextual | Tipo/fase/cliente/archivo, cancelar/subir. Faltan tarea/título que exige envío auxiliar local | Desde Subir; E; RF-53. No usar carga directa de asesor |
| GD-03.2 / editar | Crear modal con visor | Tipo/fase/cliente, archivo actual/preview, actualizar archivo, guardar/cancelar/cerrar | Desde editar fila; E/V; RF-06/54/57. No autoriza reasignar cliente ni destruir versiones |
| GD-04 / tareas propias | Crear sección | Cliente/título/instrucciones/estado/etapa, iniciar/enviar revisión según permiso | RF-52/53/60; X; E. Captura parcial; faltan controles completos |
| GD-05 / versiones | Crear sin imagen específica | Historial, resultado/observación, descarga anterior, nueva versión ligada a envío/tarea | RF-54/57/58; X y revisión A; E/V |
| GD-06 / eliminación propia | Bloqueada contrato | Archivo propio permitido, confirmar/cancelar/resultado | RF-59; X; D; DELETE no localizado en backend local |

GD-03 agrupa dos modales. Documento de asesor, envío auxiliar y formato institucional son contextos distintos, aunque compartan apariencia.

## 3. Formatos institucionales y biblioteca

| ID / tipo | Ubicación/base | Campos, acciones y disparadores | RF, rol, estados |
|---|---|---|---|
| FI-01 / listado | Crear /formatos-institucionales | Buscar/tipo/orden/fechas/limpiar, contador/paginación; nombre/fecha/descripción/tipo; ver/descargar/editar/eliminar/añadir | RF-10/11/12; S; E/D/V |
| FI-02 / vacío | Estado FI-01 | Mensaje y CTA añadir; filtros/conteos coherentes | RF-10; S; E |
| FI-03.1 / alta | Modal desde Añadir o CTA vacío | Nombre, descripción contador200, Archivo/Enlace, archivo doc/pdf, cancelar/guardar | RF-08/RF-9; S; E. API requiere dependencia ausente del dibujo; carga binaria bloqueada |
| FI-03.2 / edición | Modal desde lápiz | Nombre/descripción/modo, archivo actual/quitar/reemplazar o enlace; cancelar/guardar | RF-11; S; E; retirar archivo no equivale a borrar formato |
| FI-03.3 / visor | Modal desde ver; base EXP-03 | Nombre, PDF, descargar/cerrar; no prueba editor web | RF-10/14; rol autorizado; V; título de captura incorrecto |
| FI-03.4 / enlace | Variante alta/edición sin captura desplegada | Nombre/URL según RF/DTO, dependencia pendiente; abrir enlace en consulta | RF-08/11; S; E |
| FI-04 / eliminar | Crear confirmación sin imagen | Identificar formato, cancelar/confirmar, bloqueo doble envío; backend local desactiva | RF-12; S; D |
| BIB-01 / catálogo | Crear /biblioteca; comparte FI | Buscar/tipo/fechas/orden/solo nuevos, tabs Todos/Word/PDF/Enlace, conteos, refrescar, cards, ver/descargar/abrir enlace/cargar más | RF-13/14; A/X/S visual, S no permitido actualmente; E/V |
| BIB-02 / vacío | Estado BIB-01 | Mensaje/actualizar y conteos reales | RF-13; E |
| BIB-03 / visor/descarga | Reutilizar FI-03.3 | Preview MIME, descargar o abrir enlace, cerrar | RF-14; V; descargar local lanza 501 |

FI-03 agrupa cuatro piezas. RF-54 puede usar plantillas de biblioteca; editar documentos no exige incorporar un editor Word en el navegador.

## 4. Gestión auxiliar

| ID / tipo | Ubicación/base | Contenido, campos y acciones | RF, rol, estados |
|---|---|---|---|
| AUX-01 / principal | Crear, sin ruta/menú actual; base limitada AuxiliaresAutorizados/useAuxiliares | Lista lateral auxiliares, buscar/filtrar/conteos/seleccionar, resumen; tabs asignados/tareas/enviados | RF-49–60; A; E; no es CRUD usuarios |
| AUX-02 / asignados | Sección AUX-01 | Cliente/asesor/fecha/etapa; asignar, quitar asignación con confirmación, nunca borrar cliente | RF-49/50; A, lectura X según contrato; E/D |
| AUX-03 / tareas | Sección AUX-01 | Título/instrucciones/cliente/fase; nueva, editar/borrar dibujados, estados/transiciones por completar | RF-51/52/60; A; E/D. Edición sin contrato/modal probado |
| AUX-04 / enviados | Sección AUX-01 | Buscar/filtro estado; documento/descripción/observaciones/cliente/fase; ver/descargar/validar/no validar | RF-55/56/58; A; E/V; historial GD-05 |
| AUX-05.1 / asignar | Modal desde Asignar cliente | Selector cliente del asesor; auxiliar del contexto; cancelar/asignar | RF-49/50; A; E |
| AUX-05.2 / nueva tarea | Modal desde Nueva tarea | Cliente/título obligatorios visuales; descripción/fase opcionales visuales; cancelar/crear | RF-51; A; E; backend requiere instrucciones |
| AUX-05.3 / observaciones | Modal desde lápiz/no validado | Documento contextual, observaciones, cancelar/aceptar | RF-56/57; A; E; no validado exige comentario |
| AUX-05.4 / vincular | Modal sin disparador inequívoco | Selector auxiliar, cancelar/vincular | RF-49 relación candidata; A; bloqueado: API asigna por cliente, dibujo sin cliente |
| AUX-06 / estados/cancelación | Crear controles/confirmación | Pendiente/en proceso/en revisión/correcciones/validada/cancelada; revisión documental separada | RF-58/60; A/X por transición; E/D |
| AUX-07 / versión revisada | Reutiliza GD-05 | Historial/resultados/observaciones/descarga; subir nueva versión solo X autorizado | RF-55/57/58; A/X; E/V |

AUX-05 agrupa cuatro modales. Confirmar equivalencia de «completada» RF-60 y «validada» del contrato local; no cambiar automáticamente el enum.

## 5. Modalidades

| ID / tipo | Ubicación/base | Secciones/campos/acciones | RF, rol, estados |
|---|---|---|---|
| MOD-01 / listado | Crear /modalidades | Nombre/estado/rango cita/restablecer; tabs Todas/M10/M40/M40R/Mixto, total, cards fecha/modalidades/estatus/cita/detalle/archivos | RF-61/71/72; A; E; indicadores no derivados de página incompleta |
| MOD-02 / detalle | Crear; base ClientePerfil/etapas/docs | Perfil/estrategia/modalidades/fase/estado/cita/actualización/alertas, tabs y Ver expediente | RF-62/64/65/67/68/69/73; A; E/V |
| MOD-03.1 / M10 | Crear; lectura F1Conservacion/Objetivos | Stepper/estado/fechaIMSS/salario seguimiento; actividad/cuenta propia/ingreso, régimen/AFORE/semanas, objetivos/criterios/observaciones, documentos | RF-18/64/65/66/69; A; E/V |
| MOD-03.2 / M40 | Crear; lectura F1Regimen/Conservacion/Modalidad40/Escenarios | Stepper/seguimiento, baja/salario/meses, conservación/semanas/objetivos/criterios, escenario inversión/pensión/recuperación, documentos | RF-18/64/65/66/69; A; E/V; errores de valores de ejemplo |
| MOD-03.3 / M40R | Crear; lectura F1Retroactivo | Baja/tiempo/inicio/solicitud/meses/salario/cuotas/recargos/total/mora/reingreso/conveniencia, documentos y seguimiento | RF-18/64/65/66/69; A; E/V |
| MOD-04 / subir | Modal desde sección documental | Tipo/fase/archivo; cliente/modalidad contextual, cancelar/subir | RF-70; A; E; etapa real, no fase libre |
| MOD-05 / selección | Crear sin Figma específico | Una o dos modalidades válidas; guardar/cancelar; impedir M10+M40 y tres | RF-17/63; A; E; aprobar cambios con historial |
| MOD-06 / agenda/alertas | Crear sección | Cliente/fecha/modalidad/compromiso/próximo/vencido; filtros por contrato | RF-67/68; A; E; RF-67 no exige alta de citas |
| MOD-07 / indicadores | Crear sin referencia completa | Clientes por modalidad/estado, citas/compromisos; periodo/totales desde contrato | RF-72; A; E |
| MOD-08 / editar/sustituir | Bloqueada; sin imagen | Metadatos/nuevo archivo conservando asociación; cancelar/guardar | RF-74; A; E/V; PATCH local solo referencia/observaciones |
| MOD-09 / eliminar | Bloqueada; sin confirmación dibujada | Documento identificado/restricciones/propiedad/cancelar/confirmar | RF-75; A; D; DELETE no localizado |

MOD-03 agrupa tres secciones. Datos del diagnóstico son de consulta RF-65; solo seguimiento respaldado por contrato se editará. Resolver cinco fases API frente a seis elementos de stepper.

## 6. Proceso Final / Pensión final

| ID / tipo | Ubicación/base | Secciones/campos/acciones | RF, rol, estados |
|---|---|---|---|
| PF-01 / listado | Crear /pension-final | Cinco indicadores, buscar/orden, tabs IMSS/ISSSTE/AFORE/SAR92, cards estado/fecha/etapas/actualización/detalle/expediente | RF-23/28/29/30; A; E; KPI/filtro etapa no acreditados |
| PF-02 / detalle | Crear; base perfil/etapas/docs | Perfil, preparación/resolución/agenda, etapas independientes y resumen | RF-19–32; A; E; captura laptop incorrecta |
| PF-03.1 / validación/preparación | Sección preparación | Estado/acción/fecha/cancelar/guardar; documentos buscar/tipo/orden/ver/descargar/borrar/subir | RF-19/24/25/26/27; A; E/D/V; identidad etapa desde catálogo |
| PF-03.2 / retiro AFORE | Sección preparación | Mismo patrón, seguimiento y documentos propios de etapa | RF-19/24/25/26/27; A; E/D/V |
| PF-03.3 / SAR92 | Sección preparación | Seguimiento/documentos independientes | RF-19/24/25/26/27; A; E/D/V |
| PF-04.1 / solicitud | Sección resolución visible | Estado/acción/fecha/documentos; ingreso formal solicitud | RF-20/21/24/25/26/27; A; E/V |
| PF-04.2 / negativa | Tab sin contenido expandido | Escenario de resolución; campos específicos no inferidos | RF-21/24; A; diseño detallado pendiente |
| PF-04.3 / juicio | Tab sin contenido expandido | Seguimiento según etapa aplicable | RF-21/24; A; diseño detallado pendiente |
| PF-04.4 / institucionales | Crear sin referencia | Institución/folio/número expediente/fechas solicitud-resolución/resultado/observaciones; guardar/cancelar | RF-20/31; A; E; DTO local en informe |
| PF-05 / alertas | Crear sección | Compromisos próximos/vencidos, cliente/etapa/fecha; no inferir plazos legales del ejemplo | RF-26/30; A; E |
| PF-06 / subir | Crear modal; integración bloqueada | Tipo/archivo, cliente/etapa contextual, cancelar/subir | Apoyo RF-27; A; E; RF exige consulta, subida es diseño adicional |
| PF-07 / cobranza | Crear sin Figma | Pagos disponibles y límite de atribución al cierre, solo consulta | RF-22; A; E; no amplía Finanzas |
| PF-08 / porcentaje/progreso | Crear/adaptar patrón | Porcentaje por etapa/global, motivo excepción; control porcentaje ausente de imágenes | RF-19/25/32; A; E; confirmar agregación |
| PF-09 / indicadores | Parte PF-01 | Etapas en proceso/finalizadas/restringidas/vencidas y clientes con compromisos | RF-29; A; E; no fijar cifras Figma |

PF-03/04 son agrupaciones. No inventar etapa 15: servicio local consulta pasos 8–14; cobranza paso14.

## 7. Servicios complementarios

| ID / tipo | Ubicación/base | Secciones/campos/acciones | RF, rol, estados |
|---|---|---|---|
| SC-01 / listado | Crear /servicios-complementarios | Buscar/orden, APD/PPR/PP/Mejoravit/Otros, agregar cliente, cards fecha/servicio/estado/actualización/detalle | RF-33/34/37; A; E; API no localizada |
| SC-02 / detalle | Crear; base perfil/seguimiento/docs | Perfil/servicio/estado/acción/fecha/observaciones/cancelar/guardar; documentos buscar/tipo/orden/ver/descargar/editar/borrar/subir | RF-37/38/43/46; A; E/D/V; no cubre formulario específico |
| SC-03.1 / agregar | Modal desde Agregar cliente | Cliente existente y servicio; cancelar/registrar solicitud | RF-33/34; A; E; copy «Crear tarea» incorrecto |
| SC-03.2 / otro | Modal, disparador a confirmar | Imagen solo nombre; RF exige además descripción libre | RF-35; A; E; campo pendiente contrato/diseño |
| SC-03.3 / cambiar | Modal sin disparador inequívoco | Servicio, cancelar/guardar; decidir efecto en datos previos | RF-38 relación candidata; A; E |
| SC-03.4 / subir | Desde documentos detalle | Tipo/archivo, cliente/solicitud contextual, cancelar/subir | RF-43; A; E; no acredita vínculo automático de documentos generados |
| SC-04.1–4 / formularios | Crear Mejoravit/APD/préstamos a pensionados/PPR | Campos/reglas no definidos en capturas ni DTO localizado; no inventar un formulario único | RF-36/38; A; B10 |
| SC-05 / requisitos/criterios | Crear por servicio | Requisitos, cubiertos/pendientes, desglose documentación/información para autorizar | RF-40/41/42; A; E; necesita reglas |
| SC-06 / exportaciones | Crear acciones/estados | PDF/Word de datos capturados, descargar/error, vínculo expediente según contrato | RF-43/44/45; A; E/V |
| SC-07 / eliminar | Crear confirmación, contrato pendiente | Solicitud/efectos/restricciones/cancelar/confirmar | RF-39; A; D |
| SC-08 / alertas | Sección ilustrada | Fechas/avisos del servicio independiente; textos ejemplo PF deben corregirse | RF-37/46; A; E |

SC-03 agrupa cuatro modales; SC-04 cuatro formularios exigidos pero no especificados ni implementados.

## 8. Dashboard y procesos sin UI obligatoria

| ID | Estado/base | Contenido/faltante | Roles/estados |
|---|---|---|---|
| DASH-01 | Crear Inicio operativo, sin Figma; useDashboard no consumido; BarrasHorizontales/DonaGrafica disponibles | Fechas próximas/actividades/trámites pendientes/etapas/avances; propuesta y contrato operativo por confirmar | RF-15/16; A/X/S diferenciados; E |
| MIG-01 | Sin UI obligatoria | Consolidación Excel; requiere evidencia backend, no crear cargador desde diccionario | RF-47; pendiente backend |
| MIG-02 | Sin UI obligatoria | Extracción/transformación NestJS+SheetJS a PostgreSQL; implementación no comprobada | RF-48; pendiente backend |

## 9. Interfaces existentes a preservar, sin capturas específicas

No se omiten por ausencia de Figma. Son soporte existente y dependencias, sin asignarles un RF exclusivo inventado.

| ID / ruta | Secciones/formularios/acciones | Código y relación |
|---|---|---|
| LEG-01 /clientes | Lista/búsqueda/filtros/paginación local/nuevo/detalle; modal Reasignar cliente de supervisor con asesor/guardar/cancelar | useClientes/useUsuarios; apoyo RF-05; compatibilidad de reasignación pendiente |
| LEG-02 /clientes/nuevo | Personales: nombre/apellidos/nacimiento/sexo/estado civil/dependientes/CURP/RFC/NSS/INE. Contacto: teléfono/correo/ingreso/domicilio/estado/referido/ocupación. Previsionales: régimen/ley/AFORE/semanas/ISSSTE/subdelegación/cambio AFORE/contadora. Objetivo/observaciones | ClienteFormulario/useClientes; required/formatos del código anterior, no DTO local confirmado; apoyo RF-05 |
| LEG-03 /clientes/:id | Perfil, seguimiento, auxiliares autorizados, enlaces F0/F1/archivos; modales cambio estado/historial | useExpediente/useEtapas/useAuxiliares; apoyo RF-05/49/50 |
| LEG-04 /clientes/:id/f0 | Seis pasos: generales/documentación/objetivos/correcciones/historial laboral-ISSSTE/observaciones; guardar/continuar/retroceder/PDF | ClienteFormulario y cinco F0*, useHistorialLaboral/useObjetivos/useCorrecciones/useDocumentos; RF-03/05/07 y antecedente65 |
| LEG-05 /clientes/:id/f1 | Objetivos/documentos/régimen-semanas/recuperación-periodos/conservación-M10/M40/retroactivo/escenarios-patrimonio/recomendación-plan; fecha/guardar/navegar/PDF/faltantes409 | F1*, useContextoF1/useDiagnostico/useFormularioF1/useFilasF1; antecedente RF-65; preservar íntegro |
| LEG-06 /diagnosticos | Listado/acceso F0-F1/datos-etapas/búsqueda/filtros | useClientes/useEtapas; N+1 estático; sin Figma específico |
| LEG-07 /usuarios | Métricas/lista/filtros/nuevo/editar/revocar/restablecer; formulario nombre/apellidos/correo/contraseña/rol/tipo asesor; modal revocar | UsuarioFormulario/useUsuarios; apoyo RF-02, S; no equiparar con administrador |
| LEG-08 /configuracion | Perfil, sonido/movimiento, contraseña actual/nueva/confirmación | useCuenta/session/preferencias; apoyo RF-01/02 |
| LEG-09 seguimiento incrustado | Etapas/cambio estado/avance/acción/fecha/motivo/historial; corrección/recuperación/unificación NSS | SeguimientoTramite/CambioEstatusFormulario/HistorialEtapa/FaseCorreccion/FaseRecuperacion/FaseUnificacionNss/CorreccionesDatos |
| LEG-10 avisos/cita | Campana/lista/atender; formulario cliente/fecha/hora/motivo/estatus al editar, agendar/reagendar/cancelar | CampanaAvisos/AvisosBadge/useAvisos/useAgenda/EventoFormulario; sin páginas agenda/avisos; apoyo RF-15/67 |

Modales adicionales existentes: carga de DocumentoRequerido y F0Documentos; eliminar corrección de CorreccionesDatos; cambiar estado/historial de SeguimientoTramite; alta/edición/revocar usuario; reasignar cliente; logout; subir/ver/revisar en archivos. Las tablas F1Periodos/F1Plan/F1Escenarios tienen acciones por fila y validaciones que preservar.

Campos F1 comprobados por grupo: primera cotización/baja/conservación/edad objetivo/ley/semanas reconocidas-reintegradas-descontadas-efectivas-requeridas; recuperación (aplica/observaciones/periodos/patrón/semanas/evidencia/acción); conservación/reactivación/cuenta propia/ingreso/actividad; M40 baja/salarios/meses/retroactivo/conclusión; M40R fechas/meses/salario/cuotas/recargos/total/mora/plazo/comentarios; escenarios semanas/salario/inversión/pensión/incremento/beneficios; patrimonio/ingresos/seguros/salud/cónyuge/bienes/deudas; estrategia/justificación/siguiente paso/plan de acción-fecha-estado-observaciones. Son campos previos, no aprobación para editarlos en Modalidades ni ampliar Servicios.

## 10. Censo visual: las 62 imágenes

Cada archivo se abrió e inspeccionó individualmente. Dimensiones obtenidas del archivo. Rutas relativas a docs/05-modulos/. La interfaz enlaza con las fichas anteriores (ruta/código/RF/rol/campos/estados). Cada fila es una referencia distinta aunque comparta pantalla. Ninguna imagen fue movida, renombrada ni eliminada.

| Imagen | Ruta exacta | Dimensiones | Módulo | Tipo | Interfaz | Resultado de revisión visual |
|---|---|---|---|---|---|---|
| IMG-01 | [autenticacion/01-login.png](<autenticacion/01-login.png>) | 1920×1080 | autenticacion | Página | AUT-01 | Hero y formulario completos; base alternativa del login |
| IMG-02 | [autenticacion/login/desktop-1920.png](<autenticacion/login/desktop-1920.png>) | 1920×1080 | autenticacion | Página | AUT-01 | Hero izquierdo; lado derecho sin formulario, referencia incompleta |
| IMG-03 | [autenticacion/login/laptop-1440.png](<autenticacion/login/laptop-1440.png>) | 1440×1080 | autenticacion | Página | AUT-01 | Hero y formulario laptop; contraste con desktop incompleto |
| IMG-04 | [autenticacion/login/mobile-400.png](<autenticacion/login/mobile-400.png>) | 440×1080 | autenticacion | Página | AUT-01 | Nombre dice 400; ancho real 440, falta verificar 400 |
| IMG-05 | [autenticacion/login/tablet-1024.png](<autenticacion/login/tablet-1024.png>) | 1024×1080 | autenticacion | Página | AUT-01 | Distribución tablet, no valida otras pantallas a 1024 |
| IMG-06 | [autenticacion/recuperar-contrasena/Cambiar-contrasena.png](<autenticacion/recuperar-contrasena/Cambiar-contrasena.png>) | 522×533 | autenticacion | Modal | AUT-02.3 | Nueva contraseña y confirmación; reglas visuales no equivalen a DTO |
| IMG-07 | [autenticacion/recuperar-contrasena/recuperar-acceso.png](<autenticacion/recuperar-contrasena/recuperar-acceso.png>) | 522×413 | autenticacion | Modal | AUT-02.1 | Correo, cancelar/enviar código |
| IMG-08 | [autenticacion/recuperar-contrasena/Verificación-digitos.png](<autenticacion/recuperar-contrasena/Verificación-digitos.png>) | 522×467 | autenticacion | Modal | AUT-02.2 | Seis dígitos, reenviar/cancelar/verificar; endpoint separado no encontrado |
| IMG-09 | [biblioteca/pagina-principal/biblioteca-1440.png](<biblioteca/pagina-principal/biblioteca-1440.png>) | 1440×1080 | biblioteca | Página | BIB-01 | Cards y filtros; título Gestión Documental incorrecto |
| IMG-10 | [biblioteca/pagina-principal/desktop-1920.png](<biblioteca/pagina-principal/desktop-1920.png>) | 1920×1080 | biblioteca | Página | BIB-01 | Cuatro columnas, tabs/tipos/conteos; título incorrecto |
| IMG-11 | [biblioteca/pagina-sin-datos/desktop-1920.png](<biblioteca/pagina-sin-datos/desktop-1920.png>) | 1920×1080 | biblioteca | Vacío | BIB-02 | Sin recursos, actualizar; conteos de muestra permanecen |
| IMG-12 | [biblioteca/pagina-sin-datos/laptop-1440.png](<biblioteca/pagina-sin-datos/laptop-1440.png>) | 1440×1080 | biblioteca | Vacío | BIB-02 | Variante laptop del vacío; mismo título incorrecto |
| IMG-13 | [expediente-cliente/modales/subir-documento.png](<expediente-cliente/modales/subir-documento.png>) | 731×567 | expediente-cliente | Modal | EXP-02 | Tipo/fase/archivo; formatos visuales requieren reconciliar MIME |
| IMG-14 | [expediente-cliente/pagina-principal/desktop-1920.png](<expediente-cliente/pagina-principal/desktop-1920.png>) | 1923×1112 | expediente-cliente | Página | EXP-01 | Perfil y documentos; ancho 1923, no 1920 exacto |
| IMG-15 | [expediente-cliente/pagina-principal/laptop-1440.png](<expediente-cliente/pagina-principal/laptop-1440.png>) | 1443×1138 | expediente-cliente | Página | EXP-01 | Perfil/documentos; ancho 1443, no 1440 exacto |
| IMG-16 | [formatos-institucionales/modales/añadir-formato.png](<formatos-institucionales/modales/añadir-formato.png>) | 644×726 | formatos-institucionales | Modal | FI-03.1 | Nombre/descripción/Archivo-Enlace; falta dependencia contractual |
| IMG-17 | [formatos-institucionales/modales/Editar-formato.png](<formatos-institucionales/modales/Editar-formato.png>) | 644×618 | formatos-institucionales | Modal | FI-03.2 | Editar datos y archivo existente; variante enlace no desplegada |
| IMG-18 | [formatos-institucionales/modales/mostrar-documento.png](<formatos-institucionales/modales/mostrar-documento.png>) | 1431×893 | formatos-institucionales | Visor | FI-03.3 | PDF/descargar/cerrar; título archivos del asesor incongruente |
| IMG-19 | [formatos-institucionales/pagina-principal/desktop-1920.png](<formatos-institucionales/pagina-principal/desktop-1920.png>) | 1920×1080 | formatos-institucionales | Página | FI-01 | Tabla/filtros/acciones; badge asesor contradice rol visual supervisor |
| IMG-20 | [formatos-institucionales/pagina-principal/laptop-1440.png](<formatos-institucionales/pagina-principal/laptop-1440.png>) | 1440×1080 | formatos-institucionales | Página | FI-01 | Tabla laptop; mismos controles y conflicto de rol |
| IMG-21 | [formatos-institucionales/pagina-sin-datos/desktop-1920.png](<formatos-institucionales/pagina-sin-datos/desktop-1920.png>) | 1920×1080 | formatos-institucionales | Vacío | FI-02 | CTA añadir; no certifica carga/error/sin permiso |
| IMG-22 | [formatos-institucionales/pagina-sin-datos/laptop-1400.png](<formatos-institucionales/pagina-sin-datos/laptop-1400.png>) | 1440×1080 | formatos-institucionales | Vacío | FI-02 | Archivo dice laptop-1400; ancho real 1440 |
| IMG-23 | [gestion-auxiliar/modales/asignar-cliente.png](<gestion-auxiliar/modales/asignar-cliente.png>) | 624×302 | gestion-auxiliar | Modal | AUX-05.1 | Cliente seleccionado, auxiliar del contexto, cancelar/asignar |
| IMG-24 | [gestion-auxiliar/modales/Nueva-tarea.png](<gestion-auxiliar/modales/Nueva-tarea.png>) | 624×556 | gestion-auxiliar | Modal | AUX-05.2 | Cliente/título/descripción/fase; instrucciones visualmente opcionales |
| IMG-25 | [gestion-auxiliar/modales/observaciones.png](<gestion-auxiliar/modales/observaciones.png>) | 624×438 | gestion-auxiliar | Modal | AUX-05.3 | Documento/observación, cancelar/aceptar |
| IMG-26 | [gestion-auxiliar/modales/Vincular-auxiliar.png](<gestion-auxiliar/modales/Vincular-auxiliar.png>) | 624×312 | gestion-auxiliar | Modal | AUX-05.4 | Solo auxiliar; falta cliente para contrato de asignación |
| IMG-27 | [gestion-auxiliar/pagina-principal/desktop-1920.png](<gestion-auxiliar/pagina-principal/desktop-1920.png>) | 1923×1026 | gestion-auxiliar | Página | AUX-01, AUX-02 | Selector auxiliares y clientes asignados; ancho 1923 |
| IMG-28 | [gestion-auxiliar/pagina-principal/laptop-1440.png](<gestion-auxiliar/pagina-principal/laptop-1440.png>) | 1443×1025 | gestion-auxiliar | Página | AUX-01, AUX-02 | Variante 1443; no asumir 1440 exacto |
| IMG-29 | [gestion-auxiliar/secciones/clientes-asignados.png](<gestion-auxiliar/secciones/clientes-asignados.png>) | 1359×500 | gestion-auxiliar | Sección | AUX-02 | Tabla asignados, quitar asignación, asignar cliente |
| IMG-30 | [gestion-auxiliar/secciones/seccion-documentos-enviados.png](<gestion-auxiliar/secciones/seccion-documentos-enviados.png>) | 1208×712 | gestion-auxiliar | Sección | AUX-04 | Tabla enviados, filtro estado, observaciones y validación |
| IMG-31 | [gestion-auxiliar/secciones/seccion-tareas.png](<gestion-auxiliar/secciones/seccion-tareas.png>) | 1208×662 | gestion-auxiliar | Sección | AUX-03 | Tareas y acciones editar/borrar; no se dibujan controles de estado |
| IMG-32 | [gestion-documental/detalles-cliente/desktop-1920.png](<gestion-documental/detalles-cliente/desktop-1920.png>) | 1920×1209 | gestion-documental | Detalle | GD-02, GD-04 | Perfil/tabla/pendientes; badge asesor en módulo auxiliar |
| IMG-33 | [gestion-documental/detalles-cliente/laptop-1440.png](<gestion-documental/detalles-cliente/laptop-1440.png>) | 1440×1174 | gestion-documental | Detalle | GD-02, GD-04 | Menos columnas que desktop; preservar información al adaptar |
| IMG-34 | [gestion-documental/modales/editar-doc.png](<gestion-documental/modales/editar-doc.png>) | 1431×1165 | gestion-documental | Modal | GD-03.2 | Edición con visor; selector cliente no autoriza reasignación |
| IMG-35 | [gestion-documental/modales/subir-doc.png](<gestion-documental/modales/subir-doc.png>) | 731×642 | gestion-documental | Modal | GD-03.1 | Tipo/fase/cliente/archivo; faltan tarea/título del envío |
| IMG-36 | [gestion-documental/pagina-clientes/desktop-1920.png](<gestion-documental/pagina-clientes/desktop-1920.png>) | 1920×1080 | gestion-documental | Página | GD-01 | Tabs de etapa, cards de cliente y pendientes |
| IMG-37 | [gestion-documental/pagina-clientes/laptop-1440.png](<gestion-documental/pagina-clientes/laptop-1440.png>) | 1440×1080 | gestion-documental | Página | GD-01 | Variante laptop, tarjetas/datos desplegables |
| IMG-38 | [modalidades/detalles-cliente/desktop-1920.png](<modalidades/detalles-cliente/desktop-1920.png>) | 1920×1185 | modalidades | Detalle | MOD-02 | Perfil/estrategia/resumen; combinación de ejemplo inconsistente |
| IMG-39 | [modalidades/detalles-cliente/laptop-1440.png](<modalidades/detalles-cliente/laptop-1440.png>) | 1440×1184 | modalidades | Detalle | MOD-02 | Resumen laptop; fases/contador necesitan contrato |
| IMG-40 | [modalidades/modales/subir-doc.png](<modalidades/modales/subir-doc.png>) | 731×567 | modalidades | Modal | MOD-04 | Tipo/fase/archivo; MIME visual no coincide con todas las listas |
| IMG-41 | [modalidades/pagina-clientes/desktop-1920.png](<modalidades/pagina-clientes/desktop-1920.png>) | 1920×1080 | modalidades | Página | MOD-01 | Tabs y filtros, tarjetas/estado/cita; conteos de ejemplo inconsistentes |
| IMG-42 | [modalidades/pagina-clientes/laptop-1440.png](<modalidades/pagina-clientes/laptop-1440.png>) | 1440×1080 | modalidades | Página | MOD-01 | Badges más ajustados; verificar desborde a menor ancho |
| IMG-43 | [modalidades/secciones/modalidad-10.png](<modalidades/secciones/modalidad-10.png>) | 1208×2051 | modalidades | Sección | MOD-03.1 | M10: seguimiento, lectura diagnóstico, criterios/objetivos/documentos |
| IMG-44 | [modalidades/secciones/modalidad-40-retroactiva.png](<modalidades/secciones/modalidad-40-retroactiva.png>) | 1208×2013 | modalidades | Sección | MOD-03.3 | M40R: fechas/montos/mora/criterios/documentos |
| IMG-45 | [modalidades/secciones/modalidad-40.png](<modalidades/secciones/modalidad-40.png>) | 1208×2350 | modalidades | Sección | MOD-03.2 | M40: baja/salario con formatos de ejemplo erróneos, Cancelado duplicado |
| IMG-46 | [proceso-final/detalles-cliente/desktop-1920.png](<proceso-final/detalles-cliente/desktop-1920.png>) | 1920×1182 | proceso-final | Detalle | PF-02 | Perfil y tabs preparación/resolución/agenda |
| IMG-47 | [proceso-final/detalles-cliente/laptop-1440.png](<proceso-final/detalles-cliente/laptop-1440.png>) | 1440×1027 | proceso-final | Referencia mal ubicada | SC-01 (archivo en PF) | Muestra listado Servicios complementarios; NO sirve como detalle PF1440 |
| IMG-48 | [proceso-final/modales/subir-documentos.png](<proceso-final/modales/subir-documentos.png>) | 731×492 | proceso-final | Modal | PF-06 | Tipo/archivo sin etapa visible; asociación debe ser contextual |
| IMG-49 | [proceso-final/pagina-clientes/desktop-1920.png](<proceso-final/pagina-clientes/desktop-1920.png>) | 1920×1080 | proceso-final | Página | PF-01 | Indicadores y tarjetas; filtros no coinciden completamente con DTO |
| IMG-50 | [proceso-final/pagina-clientes/laptop-1440.png](<proceso-final/pagina-clientes/laptop-1440.png>) | 1440×1080 | proceso-final | Página | PF-01 | Variante laptop omite parte del estado mostrado en desktop |
| IMG-51 | [proceso-final/secciones/preparacion-expediente.png](<proceso-final/secciones/preparacion-expediente.png>) | 1208×2794 | proceso-final | Sección | PF-03.1–3 | Tres etapas, estado/acción/fecha/documentos; no campo porcentaje |
| IMG-52 | [proceso-final/secciones/resolucion-pension.png](<proceso-final/secciones/resolucion-pension.png>) | 1184×1150 | proceso-final | Sección | PF-04.1–3 | Solicitud visible; negativa/juicio solo tabs, no formularios expandidos |
| IMG-53 | [proceso-final/secciones/seguimiento-alertas.png](<proceso-final/secciones/seguimiento-alertas.png>) | 1208×419 | proceso-final | Sección | PF-05 | Tres avisos de fechas; no calendario ni reglas jurídicas |
| IMG-54 | [servicios-complementarios/detalles-cliente/desktop-1920.png](<servicios-complementarios/detalles-cliente/desktop-1920.png>) | 1920×1144 | servicios-complementarios | Detalle | SC-02 | Servicio/seguimiento/documentos; no formulario propio de cada tipo |
| IMG-55 | [servicios-complementarios/detalles-cliente/laptop-1440.png](<servicios-complementarios/detalles-cliente/laptop-1440.png>) | 1440×1170 | servicios-complementarios | Detalle | SC-02 | Stepper/texto recortados a 1440 |
| IMG-56 | [servicios-complementarios/modales/Agregar-cliente.png](<servicios-complementarios/modales/Agregar-cliente.png>) | 624×367 | servicios-complementarios | Modal | SC-03.1 | Cliente existente y servicio; botón Crear tarea incongruente |
| IMG-57 | [servicios-complementarios/modales/Agregar-otro-servicio.png](<servicios-complementarios/modales/Agregar-otro-servicio.png>) | 624×434 | servicios-complementarios | Modal | SC-03.2 | Solo nombre; falta descripción exigida por RF-35 |
| IMG-58 | [servicios-complementarios/modales/Cambiar-servicio.png](<servicios-complementarios/modales/Cambiar-servicio.png>) | 624×294 | servicios-complementarios | Modal | SC-03.3 | Cambiar servicio; disparador/efecto no definidos; copy Crear tarea |
| IMG-59 | [servicios-complementarios/modales/servicios complementarios - subir documento.png](<servicios-complementarios/modales/servicios complementarios - subir documento.png>) | 731×492 | servicios-complementarios | Modal | SC-03.4 | Tipo/archivo; no prueba vinculación automática de generados |
| IMG-60 | [servicios-complementarios/pagina-clientes/desktop-1920.png](<servicios-complementarios/pagina-clientes/desktop-1920.png>) | 1920×1080 | servicios-complementarios | Página | SC-01 | Listado con tabs de servicios y alta de solicitud |
| IMG-61 | [servicios-complementarios/pagina-clientes/laptop-1440.png](<servicios-complementarios/pagina-clientes/laptop-1440.png>) | 1440×1080 | servicios-complementarios | Página | SC-01 | Listado laptop; mismas acciones |
| IMG-62 | [servicios-complementarios/secciones/servicio-seguimiento.png](<servicios-complementarios/secciones/servicio-seguimiento.png>) | 1208×423 | servicios-complementarios | Sección | SC-08 | Alertas; textos de ejemplo ajenos al servicio, no reglas definitivas |

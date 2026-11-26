# Auditoría y plan maestro del frontend H3GA

Fecha: 2026-11-23. Fase: análisis exclusivamente. Estado: pendiente de aprobación del usuario; no autoriza maquetación ni nuevas integraciones.

## 1. Resultado y límites de la evidencia

El repositorio contiene una base funcional parcial, especialmente clientes, expediente y diagnósticos F0/F1. No es todavía la implementación integral de las interfaces aprobadas. Se localizaron 11 páginas, 38 componentes, 21 composables, 3 stores y 2 layouts. La raíz conserva el starter de Nuxt y no monta los layouts mediante `NuxtLayout`. Diez destinos del menú carecen de página. Los módulos nuevos requieren creación y los componentes existentes necesitan adaptación, sin reconstruir la aplicación.

Se revisaron visualmente **las 62 imágenes** de `docs/05-modulos/`, incluidos modales, secciones largas y variantes vacías. Sus rutas y dimensiones reales constan individualmente en [inventario](inventario-interfaces.md). Los **75 RF oficiales** están relacionados individualmente en [matriz](matriz-implementacion.md), preservando RF-9. Tener una relación documental no equivale a cumplir el requisito: no se declara ningún RF cerrado de extremo a extremo en esta auditoría.

Se leyeron AGENTS.md, el procedimiento 01, la tabla RF/RNF, el diccionario de datos, las cuatro guías de diseño/arquitectura/API/roles, los documentos de módulos y el checklist. Se inspeccionaron configuración, dependencias, rutas, layouts, componentes, composables, stores, utilidades, tipos, middleware y permisos. Las guías y los comentarios del código no sustituyen contratos ejecutables.

Se encontró y examinó, solo en lectura, `../h3ga_backend`: controladores, DTO, guards y servicios relevantes. **Su condición de backend vigente/desplegado sigue pendiente de confirmación del usuario.** Las referencias a API en estos documentos significan comprobación estática de ese código local, no llamadas exitosas, pruebas contra producción ni aceptación de sus diferencias de negocio. No se usaron credenciales, no se enviaron mutaciones HTTP, no se ejecutaron migraciones ni pruebas del backend. H3GA Finanzas queda excluido; la consulta de cobranza de RF-22 se analiza exclusivamente como lectura dentro del Proceso Final.

## 2. Estado técnico actual

### Configuración y aplicación

| Evidencia | Hallazgo | Consecuencia |
|---|---|---|
| `package.json`, paquetes instalados | Nuxt 4.6.3, Nuxt UI 4.12.0, Tailwind 4.3.3, TypeScript 6.0.3; Vue 3.5.44 transitivo | Respetar las APIs instaladas; no añadir librerías para resolver patrones ya cubiertos |
| `pnpm-lock.yaml` | Importador con `pnpm` 12.15.0; no representa el conjunto de dependencias declarado por la aplicación | La instalación actual no acredita una instalación limpia reproducible; reconciliar en una fase autorizada |
| `nuxt.config.ts` | UI, ESLint, Pinia; `runtimeConfig.public.apiBase` vacío por defecto; prerender `/` | Confirmar configuración de entorno y prefijo `/api`; no deducir URL privada ni cambiar prerender sin analizar sesión |
| `app/app.vue`, `app/pages/index.vue` | Header/footer/metadata y página del starter; idioma HTML `en`; `NuxtPage` sin `NuxtLayout` | El shell H3GA y layout auth existen pero no están montados por la raíz; Inicio no es dashboard |
| `app/app.config.ts`, `app/assets/css/main.css` | Primario verde, neutral slate, Public Sans; clases `marca-*`, `profundo-*`, `acento-*`, `font-display` usadas sin definición del tema | La presentación no puede reproducir la paleta aprobada de forma consistente |
| `app/layouts/default.vue` | Sidebar de 280/88 px, header, perfil, avisos, logout con modal | Base reutilizable; revisar adaptación a 400 y diferencias con sidebar estrecho de Figma |
| `app/layouts/auth.vue`, `public/img/` | Hero y logos existentes | Reutilizar recursos; conservar tipografía y HEX aprobados; no sustituir por aproximaciones |
| `README.md`, `.env.example`, `types/api.d.ts` | README starter, ejemplo de entorno vacío; tipos dicen generados por `pnpm api:types`, script inexistente | Falta documentación reproducible y procedencia comprobable del contrato tipado |

Paleta autorizada: black `#011818`, white `#FCFCFC`, accent `#FFCC00`, secondary `#4ECAD4`, primary `#003D3D`. Su alineación futura requiere revisar cómo expresarla en Nuxt UI/Tailwind sin introducir nuevas tonalidades o cambiar la tipografía sin aprobación.

### Páginas y navegación

| Ruta existente | Archivo en `app/pages/` | Estado comprobado |
|---|---|---|
| `/` | `index.vue` | Starter; dashboard pendiente |
| `/login` | `login.vue` | Formulario integrado a sesión; recuperación visual pendiente |
| `/clientes` | `clientes/index.vue` | Listado, búsqueda/filtros, alta y reasignación según permiso |
| `/clientes/nuevo` | `clientes/nuevo.vue` | Formulario con catálogos y validaciones |
| `/clientes/:id` | `clientes/[id]/index.vue` | Perfil, seguimiento de etapas y autorizaciones de auxiliares |
| `/clientes/:id/archivos` | `clientes/[id]/archivos.vue` | Tabla, filtros, paginación local y modales subir/ver/revisar |
| `/clientes/:id/f0` | `clientes/[id]/f0.vue` | Seis pasos del diagnóstico inicial y descarga PDF |
| `/clientes/:id/f1` | `clientes/[id]/f1.vue` | Diagnóstico especializado por secciones, guardado y descarga con faltantes |
| `/diagnosticos` | `diagnosticos.vue` | Listado enlazado a F0/F1; solicitudes de etapas por cliente |
| `/usuarios` | `usuarios/index.vue` | Administración, filtros, alta/edición, revocar/restablecer |
| `/configuracion` | `configuracion.vue` | Perfil, preferencias de avisos y cambio de contraseña |

Destinos presentes en `app/utils/menu.ts` **sin página**: `/agenda`, `/avisos`, `/reportes`, `/pension-final`, `/modalidades`, `/servicios-complementarios`, `/correcciones`, `/gestion-documental`, `/formatos-institucionales`, `/biblioteca`. `/usuarios` sí figura en el menú y sí existe. Gestión auxiliar no tiene entrada, ruta ni permiso dedicado. No se deben borrar las rutas existentes ni asumir que los destinos pendientes autorizan ampliar funciones ajenas a los RF.

Las futuras rutas de detalle de los nuevos módulos se definirán al aprobar navegación. En el inventario se señala el destino de módulo existente en menú, sin presentar rutas nuevas hipotéticas como implementadas.

### Sesión y permisos

`app/stores/session.ts`, middleware global y `app/utils/permisos.ts` centralizan la sesión y acceso. El token se conserva en memoria/sessionStorage, con vencimiento calculado a partir de `expires_in`. La hidratación al recargar y el acceso directo SSR requieren prueba real: el servidor no puede leer sessionStorage. El acceso por prefijo `/clientes` incluye subrutas; F0/F1 añaden controles de acción en página.

| Perfil técnico frontend | Acceso actual relevante | Distribución visual acordada y conflicto |
|---|---|---|
| `asesor` | Clientes, agenda, avisos, reportes, pensión final, modalidades, servicios, diagnósticos, correcciones, biblioteca, configuración | Falta gestión auxiliar; conservar rutas previas hasta decidir navegación |
| `auxiliar` | Clientes, agenda, avisos, gestión documental, biblioteca, configuración | Diseño concentra biblioteca, documental, dashboard; no equivale a revocar rutas previas |
| `supervisor` | Clientes, agenda, avisos, reportes, usuarios, formatos, configuración | Biblioteca compartida no está permitida actualmente; resolver expresamente |

Acciones actuales: asesor crea/edita cliente, cambia etapas y autoriza auxiliares; supervisor reasigna y administra usuarios; F0 asesor/supervisor, F1 asesor; subir/revisar documentos asesor/auxiliar. Estas reglas UI **no acreditan autorización backend**. `utils/roles.ts` fija IDs 1/2/3 y referencia una ruta backend ausente; no equiparar supervisor con administrador ni auxiliar con otros nombres mediante suposición.

## 3. Contratos e integraciones: evidencia y brechas

Todas las rutas de esta sección pertenecen al backend local candidato y llevan prefijo global `/api`. Las referencias de archivo se resuelven desde `../h3ga_backend/src/`. `main.ts` aplica validación con whitelist y rechazo de propiedades no permitidas. No añadir campos provenientes de Figma al body sin DTO.

| Familia | Evidencia local | Contraste con frontend / pendiente |
|---|---|---|
| Sesión | `auth/auth.controller.ts`, `auth/auth.service.ts`, DTO y estrategia JWT | Login recibe correo/contraseña y devuelve token + usuario con `rol_id`; frontend exige `usuario.rol` y `expires_in`, ausentes. Bloqueo transversal B01 |
| Recuperación | `POST auth/forgot-password`, `POST auth/reset-password` | Correo, código de seis dígitos y nueva contraseña; no endpoint separado para verificar código. La pantalla no debe afirmar verificación remota al pasar de paso |
| Roles | `roles/guards/roles.guard.ts`, decorators de controladores | Comparación exacta: administrador/asesor/auxiliar administrativo; formatos usa `auxiliar_administrativo` con guion bajo. No coincide con supervisor/auxiliar frontend |
| Clientes | `clientes/clientes.controller.ts`, service y DTO | GET devuelve paginación, no `Cliente[]` esperado por `useClientes`; auxiliar no está admitido en GET general. No se encontró PATCH `clientes/:id/asesor` ni los catálogos que consume el formulario |
| Diagnósticos y utilidades previas | Búsqueda de controladores en `src/` contrastada con composables | No se encontraron los contratos consumidos para F0/F1, etapas generales, historial laboral, objetivos, correcciones generales, agenda, avisos, reportes operativos y cambio propio de contraseña. No concluir que faltan en un despliegue distinto; confirmar fuente |
| Auxiliares | `gestion/gestion-auxiliares/*` | Disponibles/asignaciones/tareas/envíos/revisión bajo `gestion/auxiliares`; `useAuxiliares` llama otras rutas. Revisión requiere asesor asignador y observación para no validado |
| Documentos | `gestion/gestion-documental/*` | Ruta `gestion/documental`, no `/clientes/:id/documentos`; subida directa y PATCH solo asesor. PATCH modifica referencia/observaciones, no archivo ni estatus. Descarga/visualización con control de propiedad/asignación |
| Versiones auxiliares | POST envíos, POST versiones; GET historial y descarga | `tarea_id` obligatorio al crear envío; título y tipo documento. Se conservan versiones; la revisión cambia envío/tarea y no copia automáticamente el archivo a `documentos_clientes` en el servicio inspeccionado |
| Formatos y biblioteca | `gestion/formatos-institucionales/*` | GET listado/biblioteca, POST/PATCH/DELETE lógico; requiere dependencia y tipo. No hay recepción multipart; `archivo_path` no es una carga binaria. `descargar()` lanza `NotImplementedException` (501) |
| Modalidades | `gestion/modalidades/*` | Listado, catálogos, detalle, selección, seguimiento, agenda, alertas, indicadores. Hay controles de asesor dueño; todavía no hay consumidor frontend |
| Proceso Final | `gestion/proceso-final/*` | Listado, detalle, etapas, documentos, compromisos, datos institucionales y cobranza. No hay consumidor frontend; brechas de filtros/KPI/subida detalladas abajo |
| Servicios complementarios | Búsqueda de controladores operativos de `src/` | No se encontró API operacional del módulo. Tablas o catálogos financieros no autorizan inferir sus contratos |
| Dashboard y migración Excel | Búsqueda de controladores y archivos de `src/` | No se encontró dashboard operativo ni servicio de importación SheetJS comprobado. El dashboard financiero existente se excluye |

Detalles que condicionan formularios y comportamiento:

- **Auxiliares:** asignar exige cliente y auxiliar activo; tarea exige cliente, auxiliar, título hasta 250 e instrucciones, etapa opcional del mismo cliente. Figma presenta descripción opcional. Estados técnicos: pendiente, en_proceso, en_revision, correcciones, validada, cancelada. Auxiliar puede iniciar/enviar a revisión; asesor corregir/validar/cancelar. No hay edición de título/instrucciones ni DELETE de tareas/envíos/versiones observado. «Eliminar tarea» de la captura no se debe implementar como borrado. RF-59 sigue bloqueado.
- **Documentos:** multipart `archivo`, máximo 10 MiB; tipo obligatorio, etapa opcional, referencia hasta 200 y observaciones hasta 4000. La etapa de una subida directa debe corresponder a una modalidad seleccionada; por ello no se puede reutilizar sin más para subir a Proceso Final. La ruta de versiones auxiliares está ligada a tarea. La UI actual permite PDF/JPEG/PNG; las capturas alternan SVG/PNG/JPG con PDF/Word. Confirmar whitelist efectiva del almacenamiento antes de cada formulario. No hay DELETE ni sustitución binaria directa en el controlador inspeccionado (RF-06, RF-74, RF-75 pendientes).
- **Formatos:** nombre, descripción, `dependencia_id`, `tipo_formato` (pdf/word/enlace), enlace/ruta. La descripción de 200 caracteres es una restricción visual, no validación comprobada del DTO. Dependencia requerida no aparece en el modal. Biblioteca define «nuevo» como últimos siete días en su servicio; listados devuelven `datos` y `paginacion`, no la envoltura de clientes. Carga/descarga de archivos está bloqueada pese a existir CRUD de metadatos.
- **Modalidades:** una o dos; solo individuales o M10+M40R/M40+M40R. API usa modalidad_10, modalidad_40, modalidad_40_retroactiva. Tiene cinco fases; Concluido es estado final, no sexta fase contractual. Seguimiento acepta fase/estatus, fecha IMSS y salario diario como decimal en cadena. Los datos F1 son de consulta; no volver a guardar el diagnóstico desde las secciones de modalidad. Validar correspondencia de cada dato mostrado, no copiar rótulos de ejemplo defectuosos.
- **Proceso Final:** servicio incluye pasos 8 a 14; no inventar una etapa adicional a partir del diccionario. Actualización contempla estado, avance, acción, fecha, motivo; por iniciar fija 10, finalizado 100, en proceso 20–90 y excepción congela avance. Las capturas omiten el control de porcentaje y motivo. Datos institucionales: institución, folio, número de expediente (hasta 100), fechas de solicitud/resolución, resultado/observaciones (hasta 5000). Consulta paginada filtra `q`/estatus y ordena nombre/compromiso; no tiene filtro de etapa equivalente a pestañas Figma ni endpoint agregado de KPI observado.
- **Progreso general:** `toClienteCard()` calcula media redondeada de etapas que no sean `no_aplica`; al filtrar por estatus el servicio también restringe las etapas usadas en la tarjeta. Confirmar que RF-32 se cumple sobre todas las aplicables y no un subconjunto filtrado. El detalle no expone el mismo resumen directamente. No calcular una regla distinta en cliente.
- **Cobranza RF-22:** el servicio devuelve pagos existentes y advierte `identificacion_cobranza_final: false`: no están vinculados individualmente a esa etapa. Mostrar la limitación si se aprueba su uso, sin etiquetar todos los pagos como cobranza final ni crear pantallas de Finanzas.

## 4. Reutilización y arquitectura

El [inventario](inventario-interfaces.md) detalla secciones y modales; esta tabla señala la base que debe conservarse.

| Recurso existente | Uso futuro y límite |
|---|---|
| `useApi`, `ApiError`, `mensajeDeCampo` | Único acceso HTTP, manejo 401/403/red/validación y descargas autorizadas; adaptar contratos sin duplicar fetch |
| `useSessionStore`, permisos, menú, middleware | Sesión y navegación; reconciliación de contrato/roles requiere aprobación |
| `ClientePerfil`, `useExpediente` | Cabecera lateral, datos generales/previsionales, fechas, asesor; extraer presentación reutilizable sin cargar todas las API de expediente en cada módulo |
| `DocumentoSubirFormulario`, `DocumentoRequerido`, F0/F1Documentos | Base de validación y carga; parametrizar contexto solo después de resolver permisos, etapa/tarea y MIME |
| `SeguimientoTramite`, `CambioEstatusFormulario`, `HistorialEtapa` | Etapas, acciones, fechas, avance, historial; no copiar reglas de F0/correcciones sobre modalidad o PF |
| `AuxiliaresAutorizados` | Asignación por cliente; no cubre página global ni tareas/revisión/versiones |
| `ClienteFormulario`, `UsuarioFormulario`, `EventoFormulario` | Formularios ya conectados; mantener validación, cancelación y manejo de errores |
| F0Correcciones/Documentos/HistorialLaboral/Objetivos/Observaciones | Seis pasos F0 junto a ClienteFormulario; preservar diagnóstico inicial |
| F1Campo/Checks/Objetivos/Documentos/Regimen/Recuperacion/Conservacion/Modalidad40/Retroactivo/Escenarios/Recomendacion/Periodos/Plan | Diagnóstico, listas y formularios especializados existentes; usar lectura para RF-65, evitar duplicación editable |
| `FaseCorreccion`, `FaseRecuperacion`, `FaseUnificacionNss`, `CorreccionesDatos` | Seguimiento previo al proceso; conservar flujos y confirmaciones |
| `CampanaAvisos`, `AvisosBadge`, stores avisos/preferencias | Avisos, atendidos, sonido/movimiento; API no acreditada en backend candidato |
| `BarrasHorizontales`, `DonaGrafica` | Representación visual reutilizable para dashboard aprobado; aún no prueban RF-15/16 |
| `AppLogo`, layouts | Recursos y shell existentes; `TemplateMenu` pertenece al starter, no es navegación H3GA |
| Utilidades fechas/citas/etapas/roles/texto/errores | Reutilizar antes de añadir helpers; verificar zona horaria y reglas de negocio contra contrato |

Patrones que faltan como unidades compartidas coherentes: listado de tarjetas de cliente con filtros, tabla documental contextual, visor con ciclo de vida de blobs, panel de estado/acción/fecha con reglas por módulo, alertas por fecha, confirmación destructiva con bloqueo de doble envío, estado vacío/error/reintento/sin permiso, historial de versiones. Son propuestas de extracción; no nuevos componentes creados en esta fase.

Problemas de arquitectura comprobados o riesgos de lectura estática:

1. El shell no está conectado y las clases semánticas no tienen tokens; arreglar pantallas aisladas sin resolverlo produciría inconsistencias.
2. Tipos/interfaces frontend y backend candidato divergen. `Record<string, unknown>` en F1 facilita formularios genéricos pero no prueba DTO. Los IDs de rol y catálogos fijos necesitan procedencia confirmada.
3. `diagnosticos.vue` obtiene etapas por cada cliente (N+1); listas y documentos se filtran/paginan localmente. No acredita RNF-01/02 con más clientes.
4. `useExpediente` y F0 absorben fallos de algunas cargas opcionales; un fallo puede parecer ausencia de información. Distinguir vacío/error/sin permiso antes de permitir edición.
5. F0/F1 pueden mostrar «Cambios guardados» con retorno por defecto verdadero si el paso no expone operación; revisar no-op y doble envío. No se introdujo éxito ficticio en esta fase.
6. Roles y ruta general del cliente no reflejan acceso documental restringido del auxiliar; datos sensibles deben llegar desde una proyección autorizada, no ocultarse después en la UI.
7. El visor de archivos maneja revocación al cerrar; revisar desmontaje y cambio de ruta para liberar URLs. Descargas requieren 401/403/404 y MIME correcto, no enlaces directos privados.
8. Tabs manuales de ClientePerfil tienen roles/aria-selected pero necesitan revisar navegación de teclado y relación tab/panel. No se ha certificado accesibilidad con ejecución real.
9. Colisiones de autoimportación `Accion` y `Periodo` producen warnings reales. No renombradas en esta fase.

## 5. Diseño, referencias faltantes y responsive

- Login: referencia `01-login.png` contiene formulario, pero `login/desktop-1920.png` deja el lado derecho vacío. La supuesta captura 400 mide **440 px**. Usar ambas como evidencia del conflicto, no eliminar ninguna.
- Biblioteca: sus cuatro capturas llevan título «Gestión Documental»; el vacío conserva contadores de ejemplo. Corregir copy/contadores en una fase aprobada con datos reales.
- Formatos: avatar indica asesor aunque el módulo acordado es supervisor. El visor reutiliza título de archivos del asesor. Falta variante de formulario enlace, dependencia exigida por backend y confirmación de eliminación.
- Gestión auxiliar: existe modal Vincular auxiliar sin disparador inequívoco; asignación real requiere cliente. Tareas muestran editar/borrar sin referencias de edición/confirmación ni estados completos. Falta historia de versiones.
- Gestión documental: detalle muestra rol asesor aunque se destina al auxiliar; a 1440 desaparecen columnas relevantes respecto de 1920. El selector de cliente en editar archivo no autoriza reasignación. Datos de muestra entre perfil y filas no son evidencia de acceso entre clientes.
- Modalidades: stepper de seis pasos frente a cinco fases backend; M40 duplica Cancelado en estados; datos de baja/salario tienen valores con formatos incompatibles; estrategia en resumen no coincide con perfil. No reproducir estos errores. No hay imagen del selector de modalidades, agenda global, indicadores completos, sustitución ni eliminación.
- Proceso Final: **`detalles-cliente/laptop-1440.png` muestra un listado de servicios complementarios**, no su detalle. Falta referencia correcta. Preparación/resolución solo muestran parte de las etapas y omiten porcentajes, motivos y datos institucionales; cobranza y resumen global no están diseñados.
- Servicios: «Agregar cliente» selecciona un cliente existente y servicio; no es alta de persona. Botones «Crear tarea» en modales son copy incongruente. «Otro» solo muestra nombre, falta descripción de RF-35. No hay formularios propios de Mejoravit/APD/préstamos/PPR, criterios, requisitos ni exportaciones. El stepper se recorta a 1440.
- Dashboard: ninguna de las 62 imágenes es una referencia de dashboard operativo. Requiere propuesta y aprobación para los tres roles; no reutilizar el financiero.

Solo autenticación aporta tablet/móvil, y móvil no es 400 real. La mayor parte de referencias son 1920/1440; expediente y auxiliares usan 1923/1443. Las secciones largas son recortes, no otra página ni un breakpoint. Adaptar una única interfaz a 1024, 400 e intermedios sin ocultar datos o acciones necesarios. Tablas con desplazamiento interno cuando proceda; modales con altura contenida, foco, escape/cancelación, etiquetas y tamaños táctiles. Es un criterio futuro, **no una verificación realizada en navegador**.

## 6. Dependencias y orden propuesto

| Dependencia | Consumidores / efecto |
|---|---|
| Backend vigente, sesión, rol y propiedad | Todos; bloquean integración y aceptación funcional |
| Shell, tokens, estados, navegación | Todas las páginas; preservan una sola experiencia |
| Cliente + expediente + almacenamiento autorizado | Documental, auxiliares, modalidades, PF y servicios |
| Formatos institucionales | Biblioteca y descarga de plantillas para auxiliares |
| Asignaciones y tareas | Acceso documental auxiliar, envíos, revisión y versiones |
| Diagnóstico F1 y selección | Datos de consulta y seguimiento de modalidades |
| Etapas y documentos | Proceso Final; cobranza solo lectura con limitación explícita |
| Catálogo/DTO de servicios | Formularios específicos, requisitos, seguimiento y exportaciones |
| Fechas/avances por rol de módulos | Dashboard y avisos; evitar agregados calculados con páginas incompletas |

### Fase A — aprobación y preparación (sin implementación todavía)

1. Aprobar este plan y resolver B01/B02: fuente backend y roles/alcance de acceso.
2. Acordar referencias faltantes y propuestas acotadas de interfaz; no crear campos de negocio sin contrato.
3. Decidir corrección del lockfile y configuración de entorno en una fase técnica autorizada, sin actualizar versiones por iniciativa propia.

### Fase B — maquetación tras aprobación del plan

1. Shell y patrones globales: montar layouts, idioma/títulos, navegación aprobada, tokens exactos, foco, estados, confirmaciones, filtros/tabla/visor. Conservar sesión y operaciones existentes.
2. Autenticación: adaptar login; recuperación solo tras acordar alcance y secuencia compatible con contrato. Cerrar desktop/tablet/móvil y estados.
3. Expediente: adaptar perfil, agrupaciones documentales y subir/ver/revisar; preservar clientes y F0/F1. Cerrar ambas variantes de escritorio y responsive antes del siguiente módulo.
4. Formatos institucionales: listado, vacío, alta/edición/enlace/visor/eliminar. Resolver dependencia y almacenamiento para evitar diseñar un alta imposible.
5. Biblioteca: catálogo, filtros, tarjetas, vacío, visor y descargas; reutilizar formatos y distinguir enlaces.
6. Gestión auxiliar: selector, asignaciones, tareas, documentos enviados, revisión y estados. Aprobar significado de vincular/desasignar/cancelar.
7. Gestión documental auxiliar: listado/detalle, tareas, envíos, versiones/observaciones y acciones de propiedad. No reutilizar una carga directa de asesor como si fuera envío auxiliar.
8. Modalidades: listado, selección y combinaciones, detalle, secciones M10/M40/M40R, documentos, agenda/alertas/indicadores; F1 solo lectura.
9. Proceso Final: listado, etapas, resolución, porcentaje/motivo, datos institucionales, documentos, compromisos, progreso y cobranza de consulta. Resolver captura 1440 incorrecta.
10. Servicios complementarios: comenzar cuando existan campos, reglas y referencias aprobadas; cubrir los cuatro tipos y otro, no sustituirlos por un formulario genérico.
11. Dashboard por rol: propuesta explícita basada en RF-15/16 y contratos, con fechas/etapas/avances; cerrar diferencias por rol.
12. Regresión de rutas previas clientes/F0/F1/usuarios/configuración, revisión visual completa y actualización de evidencia.

Durante maquetación: ninguna nueva llamada HTTP, ningún mock que simule persistencia ni confirmación de éxito ficticia. Las integraciones existentes se preservan; las acciones nuevas sin contrato se documentan como pendientes. Cada módulo se revisa con 1920/1440/1024/400 e intermedios y estados antes de avanzar. No sumar pantallas independientes para cada ancho.

### Fase C — integración, solo después de aprobación visual

1. Verificar Swagger/backend vigente, DTO, roles, propiedad, códigos HTTP y almacenamiento por operación; resolver discrepancias de esta auditoría.
2. Adaptar `useApi`/tipos y los consumidores existentes con contratos confirmados; verificar sesión, cargas iniciales, expiración, 401/403 y acceso directo.
3. Integrar en el mismo orden de dependencias, cerrando módulo por módulo con datos autorizados, carga/vacío/error/validación/éxito real; verificar descarga, reemplazo, historial y restricciones destructivas.
4. Revisar integridad entre tarea/envío/versión/expediente y entre cliente/etapa/modalidad, sin inferir promoción documental automática.
5. Ejecutar scripts existentes y pruebas funcionales disponibles; medir RNF con entorno autorizado; actualizar matriz/checklist. RF-47/48 permanece trabajo backend sin UI salvo alcance explícito.

## 7. Decisiones y bloqueos para aprobación

| ID | Decisión / riesgo | Qué necesita confirmación | Bloquea |
|---|---|---|---|
| B01 | Backend candidato no confirmado y contrato de sesión incompatible | ¿Es `../h3ga_backend` la fuente vigente? Obtener versión/Swagger y contrato final de sesión | Toda integración |
| B02 | Roles distintos y guards inconsistentes | Mapeo explícito supervisor/administrador y auxiliar; biblioteca compartida y acciones documentales por rol | Permisos/navegación y aceptación |
| B03 | Shell/tema y lockfile | Aprobar reparación respetando HEX/tipografía y versiones; revisar instalación reproducible | Base visual/calidad |
| B04 | Dashboard sin Figma | Aprobar propuesta diferenciada por rol y su contrato operativo | Dashboard |
| B05 | Carga/descarga de formatos incompleta | Dependencia requerida, archivo vs enlace, almacenamiento y descargas reales | RF-9, RF-14 y RF-54 |
| B06 | Documentos: sustituir/eliminar/validar sin contrato suficiente | API autorizada y reglas de propiedad/conservación, MIME, asociación a etapa/tarea | RF-06/07/59/74/75; subida PF |
| B07 | Auxiliares: asignación frente a vínculo global | Definir Vincular auxiliar, campos obligatorios, estados, edición/cancelación y versiones | AUX/GD |
| B08 | Fases/estados y datos de modalidades no coinciden con Figma | Confirmar representación de cinco fases + finalización y lectura F1 | MOD |
| B09 | PF incompleto visual/contractualmente | Referencia 1440 correcta; porcentajes/motivos/institucionales, filtros/KPI, progreso sin sesgo y alcance de cobranza | PF |
| B10 | Servicios sin DTO ni formularios específicos | Definir contrato/campos por tipo, requisitos/criterios, PDF/Word y borrado; no inventar | RF-33 a RF-46 |
| B11 | Recuperación y rutas preexistentes | Aprobar alcance de recuperación (derivado del diseño), flujo de código y ubicación de rutas previas | AUT-02 y navegación |
| B12 | Persistencia y RNF no probados | Entorno/datos de prueba, almacenamiento, respaldo y métricas; evidencia de migración Excel | Aceptación funcional/RNF |

Resolver estos puntos no autoriza modificar backend dentro de este encargo. Si falta contrato, registrar la dependencia y esperar su resolución por el responsable.

## 8. Verificaciones ejecutadas

| Verificación | Resultado real |
|---|---|
| Lectura visual | 62/62 imágenes, dimensiones y relación registradas; no comparación con aplicación renderizada |
| `pnpm typecheck` | Exit 0; warnings de autoimports `Accion` y `Periodo` duplicados |
| `pnpm lint` | Exit 1; 397 problemas: 388 errores y 9 warnings. Incluye clases de tema desconocidas y estilo. Sin `--fix` |
| `pnpm build` en sandbox | Exit 1 por `spawn EPERM` de esbuild en plugin de fuentes; limitación del entorno |
| `pnpm build` repetido con escalación | Exit 0; compilación completa. No se cambiaron dependencias ni configuración |
| Pruebas unitarias/E2E frontend | No se localizaron archivos de prueba ni script test en este checkout; no se inventó un comando |
| Navegador / responsive / teclado | No ejecutados; no hay herramienta de navegador disponible en la sesión. No se certifica fidelidad ni accesibilidad |
| API en ejecución / backend tests | No ejecutados; inspección estática solamente |
| RNF-01/02/04/05 | Sin medición de tiempos/carga, auditoría runtime o restauración de backups; pendientes |

Los comandos generaron únicamente artefactos locales habituales de Nuxt; la entrega versionable es documental. No se modificó código, dependencias, permisos, rutas ni imágenes. El checklist registra comprobaciones realizadas sin marcar implementaciones pendientes como aceptadas.

**Punto de parada:** entregar inventario, matriz, informe y checklist; esperar aprobación. No avanzar a maquetación.

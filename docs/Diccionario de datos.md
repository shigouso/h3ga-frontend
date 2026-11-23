 **Diccionario de Datos Inicial**

### Fuente: hoja "Clientes" del archivo FORMATO\_CONTROL\_OPERATIVO.xlsx Stack destino: Supabase (PostgreSQL)

### **Tipos personalizados (ENUM)**

estado\_confirmacion \= ('si', 'no', 'por\_confirmar').  
estado\_civil \= ('soltero', 'casado', 'divorciado', 'viudo', 'concubinato').  
estatus\_tramite \= ('no\_aplica', 'por\_iniciar', 'en\_proceso\_cliente', 'en\_proceso\_asesor', 'en\_proceso\_instituto', 'finalizado', 'bloqueado', 'cancelado', 'detenido').  
categoria\_tramite \= ('no\_aplica', 'pendiente', 'en\_proceso', 'completado', 'excepcion');  
sexo\_cliente \= ('hombre', 'mujer');  
objetivo\_cliente \= ('pensionarse\_asap', 'mejorar\_monto\_pension', 'negativa\_pension');  
tipo\_pension \= ('cesantia', 'vejez', 'invalidez', 'viudez', 'otro').  
evaluacion\_modalidad \= ('aplica', 'no\_aplica', 'aplica\_con\_restricciones', 'requiere\_regularizacion', 'temporal', 'evaluar', 'requiere\_contabilidad')  
estatus\_inconsistencia \= ('pendiente', 'en\_tramite', 'recuperado', 'no\_procedente')  
validacion\_estado \= ('si', 'no', 'requiere\_validar') \-- usado también como 'requiere\_validar' en Sección 7  
conveniencia\_pension \= ('si', 'no', 'depende\_escenario')  
si\_no\_parcial        \= ('si', 'no', 'parcialmente')  
aplicabilidad\_recuperacion \= ('si', 'no', 'requiere\_mas\_evidencia')   
cumplimiento\_criterio \= ('cumple', 'no\_cumple', 'requiere\_validar')  
evaluacion\_retroactivo \= ('conviene', 'no\_conviene', 'conviene\_parcialmente', 'requiere\_calculo\_validacion')   
**estatus\_plan\_accion** \= ('pendiente', 'en\_proceso', 'hecho')  
**criterio\_seleccion\_nss** \= ('vinculo\_curp', 'antiguedad', 'credito\_infonavit', 'estatus\_pension');  
**etapa\_institucional\_nss** \= ('ingreso\_validacion', 'dictaminacion\_imss', 'migracion\_historial', 'notificacion\_consar\_infonavit');  
**tipo\_aviso** \= ('cita', 'tramite');  
**estatus\_evento\_agenda** \= ('pendiente', 'cumplido', 'reagendado', 'cancelado');  
**estado\_salud** \= ('bueno', 'regular', 'malo');  
**tipo\_modalidad** \= ('modalidad\_10','modalidad\_40','modalidad\_40\_retroactiva','mixto');

### **Tabla: clientes**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID(PK, default gen\_random\_uuid())  | Clave primaria, autogenerada por Supabase. |
| **grupo\_principal\_id** | SMALLINT, NULLABLE (FK \-\> grupos\_principales.id) | Clasificación formal y estandarizada ante el IMSS/gobierno. Especialmente requerida para Modalidad 10 y cálculos de riesgo; opcional en registros rápidos iniciales. |
| **nombre** | TEXT  | Nombre(s) del cliente . |
| **apellido\_paterno** | TEXT  | Apellido paterno del cliente. |
| **apellido\_materno** | TEXT  | Apellido materno del cliente. |
| **referido\_por** | TEXT | Persona que canalizó al cliente hacia H3GA. Puede ser un cliente o cualquier persona externa. |
| **telefono** | TEXT | Teléfono de contacto del cliente.  |
| **asesor\_id** | UUID(FK \-\> usuarios.id) | Asesor de H3GA asignado al cliente (ej. Lic. Marco Hernández, Lic. Ana Hernández).  |
| **fecha\_ingreso** | DATE | Fecha de registro del cliente.  |
| **correo\_electronico** | TEXT | Correo electrónico del cliente. |
| **curp** | VARCHAR(18) UNIQUE, NULLABLE  | Clave Única de Registro de Población.  |
| **rfc** | VARCHAR(13), NULLABLE  | Registro Federal de Contribuyentes.  |
| **fecha\_nacimiento** | DATE | Fecha de nacimiento del cliente.  |
| **estado\_civil** | ENUM | Casado(a), Soltero(a), Concubinato, Divorciado(a), Viudo(a). |
| **dependientes\_economicos** | INTEGER | Número de personas que dependen económicamente del cliente.  |
| **regimen\_id** | SMALLINT (FK \-\> regimen\_principal.id)  | IMSS, ISSSTE, Mixto (IMSS-ISSSTE), No determinado. |
| **nss** | VARCHAR(11), NULLABLE | Número de Seguro Social. |
| **ley\_probable\_id** | SMALLINT (FK \-\> ley\_probable.id)  | Ley 73, Ley 97, Décimo Transitorio ISSSTE, Cuenta Individual ISSSTE, Mixto/revisar, No determinado.  |
| **semanas\_imss\_reconocidas** | INTEGER | Semanas cotizadas reconocidas por el IMSS.  |
| **semanas\_a\_recuperar** | INTEGER, NULLABLE | Semanas que el cliente reclama como faltantes respecto a su Constancia de Semanas Cotizadas.  |
| **tiene\_issste** | ENUM  | Indica si el cliente también cotiza/cotizó en ISSSTE.  Sí, No, Por Confirmar. |
| **afore\_id** | SMALLINT (FK \-\> afore.id)  | Azteca, Profuturo, Citibanamex, Coppel, Inbursa, Invercap, PENSIONISSSTE, Principal, Sura, XXI Banorte.  |
| **observaciones\_generales** | TEXT | Notas libres sobre el cliente. |
| **requiere\_contadora** | ENUM | Indica si el trámite del cliente requiere apoyo de contadora. Sí, No, Por confirmar. |
| **sexo** | ENUM | Hombre / Mujer. |
| **ocupacion** | TEXT, NULLABLE | Ocupación del cliente.  |
| **domicilio** | TEXT | Domicilio completo del cliente. |
| **estado** | TEXT | Entidad federativa de residencia del cliente. |
| **subdelegacion\_imss\_probable**  | TEXT | Subdelegación del IMSS que probablemente le corresponde al cliente según su domicilio.  |
| **cambio\_afore** | ENUM | Indica si el cliente solicitó/solicitará cambio de AFORE.  Sí, No, Por Confirmar. |
| **ine** | VARCHAR(18), NULLABLE | Clave de elector (INE). |
| **objetivo\_cliente** | ENUM | Qué busca el cliente: pensionarse lo antes posible, mejorar el monto de su pensión, o resolver una negativa de pensión.  |

**Tabla: documentos\_clientes (Se relaciona con la tabla cliente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria.  |
| **cliente\_id** | UUID (FK \-\> clientes.id) | Cliente al que pertenece el documento.  |
| **tipo\_documento\_id**  | SMALLINT (FK \-\> tipo\_documento.id) | Tipo de documento. Acta de nacimiento, CURP, INE, Comprobante de domicilio, RFC, Semanas cotizadas.  |
| **archivo\_path** | TEXT | Ruta del archivo dentro del bucket de Supabase Storage (ej. clientes/{cliente\_id}/constancia\_semanas.pdf).  |
| **nombre\_archivo\_original**  | TEXT | Nombre con el que el usuario subió el archivo.  |
| **mime\_type**  | TEXT | Tipo de archivo (application/pdf, image/jpeg, etc.). |
| **estatus**  | ENUM | Estado de entrega/revisión del documento. Sí, No, Por confirmar.  |
| **numero\_referencia**  | TEXT, NULLABLE | Número de folio o referencia del documento, cuando aplica. |
| **fecha\_carga**  | TIMESTAMPTZ | Fecha y hora en que se subió el archivo.  |
| **subido\_por**  | UUID (FK \-\> usuarios.id) | Quién subió el documento.  |
| **observaciones** | TEXT, NULLABLE | Observaciones sobre la recepción o validación del documento (Sección 2 del F1). |
| **etapa\_tramite\_id** | UUID (FK \-\> etapas\_tramite.id) | Etapa afectada. |

### **Tabla: regimen\_principal** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador del régimen.  |
| **nombre** | TEXT  | Nombre del régimen de seguridad social.  |

Valores: IMSS, ISSSTE, Mixto IMSS-ISSSTE, Independiente, No determinado. 

**Tabla: ley\_probable**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador de la ley/modalidad.  |
| **nombre** | TEXT  | Nombre de la ley probable aplicable.  |

Valores: Ley 73, Ley 97, Décimo Transitorio ISSSTE, Cuenta Individual ISSSTE, Mixto/revisar, No determinado. 

**Tabla: afore**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador de la AFORE.  |
| **nombre** | TEXT  | Nombre de la administradora de fondos para el retiro.  |

Valores: Azteca, Profuturo, Citibanamex, Coppel, Inbursa, Invercap, PENSIONISSSTE, Principal, Sura, XXI Banorte. 

**Tabla: etapas\_proceso** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador de la etapa. |
| **numero\_paso**  | SMALLINT, NOT NULL UNIQUE  | Número de la etapa según el orden real del proceso de negocio (0 a 15). |
| **nombre** | TEXT  | Nombre de la etapa del trámite.  |

Valores (0 a 15): Diagnóstico inicial, Diagnóstico especializado, Corrección de datos personales, Unificación de NSS, Aclaración/recuperación de semanas, Estrategia Modalidad 10, Estrategia Modalidad 40, Modalidad 40 retroactiva, IMSS-ISSSTE/doble pensión, Unificación AFORE/cuentas, SAR 92, Solicitud de pensión, Negativa de pensión/recuperación de recursos, Juicio/Jurisdicción, Cobranza Final, Finalización. 

**Tabla: etapas\_tramite**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Identificador único del registro  |
| **cliente\_id**  | UUID(FK \-\> clientes.id) | Cliente al que pertenece esta etapa.  |
| **etapa\_id**  | smallint (FK \-\> etapas\_proceso.id) | Cuál de las 16 etapas es (0 a 15).  |
| **estatus\_id** | smallint  (FK \-\> estatus\_tramite.id) | Estatus actual. Default: Por iniciar, o No aplica si no corresponde a la estrategia del cliente |
| **avance\_porcentaje**  | smallint, NOT NULL, default 0  | % de avance de esta etapa. |
| **accion\_a\_realizar** | TEXT, NULLABLE | Acción pendiente para avanzar esta etapa. |
| **fecha\_compromiso**  | DATE, NULLABLE | Fecha comprometida para resolver la acción pendiente  |
| **fecha\_completada**  | DATE, NULLABLE | Se llena automáticamente cuando estatus\_id pasa a Finalizado. |
| **reactivado\_en**  | TIMESTAMPTZ, NULLABLE  | Se llena cuando la etapa regresa de Bloqueado/Cancelado/Detenido a un estatus activo. Sirve para que el asesor identifique rápido "esto se reactivó" y revise expediente/documentos antes de continuar. |
| **creado\_el** | TIMESTAMPTZ | Auditoría |
| **actualizado\_el** | TIMESTAMPTZ | Auditoría  |
| **motivo\_rechazo** | TEXT, NULLABLE  | Solo aplica cuando estatus\_id \= Bloqueado. Distingue un bloqueo por error de documentación de otros tipos de bloqueo institucional.  |

Restricción de integridad: UNIQUE (cliente\_id, etapa\_id) — evita registrar dos veces la misma etapa para un mismo cliente.

**Regla de negocio para avance\_porcentaje en etapas\_tramite** (se aplica en la capa de aplicación al cambiar estatus\_id):

* No aplica: avance\_porcentaje no se usa para el cálculo global, pero el checkbox se marca como resuelto.  
* Por iniciar: avance\_porcentaje se fuerza a 10\.  
* En proceso cliente / En proceso asesor / En proceso Instituto: el asesor edita avance\_porcentaje libremente entre 20 y 90\.  
* Finalizado: avance\_porcentaje se fuerza a 100, se llena fecha\_completada.  
* Bloqueado / Cancelado / Detenido: avance\_porcentaje no se modifica — se queda "congelado" en el último valor antes de la transición. La UI lo muestra en un color distinto o la barra se deshabilita, pero el número se conserva.  
* Reactivación (de excepcion a cualquier estatus activo): se llena reactivado\_en con la fecha/hora; avance\_porcentaje sigue partiendo del valor congelado — el asesor lo puede ajustar desde ahí, no desde 0, una vez que revisó que documentos/expediente sigan vigentes.

**Tabla: etapas\_tramite\_historial**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **etapa\_tramite\_id** | UUID (FK \-\> etapas\_tramite.id) | Etapa afectada. |
| **estatus\_anterior\_id** | SMALLINT, NULLABLE (FK \-\> estatus\_tramite.id) | NULL en el primer registro. |
| **estatus\_nuevo\_id** | SMALLINT (FK \-\> estatus\_tramite.id) | Nuevo estatus asignado. |
| **motivo\_rechazo** | TEXT, NULLABLE | Se llena cuando estatus\_nuevo \= Bloqueado. |
| **cambiado\_por** | UUID (FK \-\> usuarios.id) | Usuario que realizó el cambio. |
| **fecha\_cambio** | TIMESTAMPTZ, DEFAULT now() | Fecha y hora del cambio de estatus. |

Se llena con un trigger o desde NestJS cada vez que cambia estatus\_id. La tasa de rechazo se calcula contando filas de este historial con motivo\_rechazo no nulo. etapas\_tramite.motivo\_rechazo puede quedarse como "último motivo".

**Tabla: tipo\_documento** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT(PK, autoincrement)  | Identificador del tipo de documento.  |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre descriptivo del documento. |

**Valores del catálogo (Actualizados):**  
Acta de Nacimiento  
CURP  
INE  
Comprobante de Domicilio  
RFC  
Constancia de Semanas Cotizadas (IMSS)  
Reporte de semanas cotizadas  
Estado de Cuenta AFORE (Nuevo por F1)  
Historial Laboral / Reporte Detallado IMSS (Nuevo por F1)  
Comprobantes de pagos Modalidad 10 (Nuevo por F1 Actualizado)  
Comprobantes de pagos Modalidad 40 / 40 retroactivo (Nuevo por F1 Actualizado)  
Resoluciones, Negativas o Trámites Previos (Nuevo por F1)  
Recibos de Nómina / Constancias Laborales (Nuevo por F1)  
Semanas ISSSTE / Constancia de Portabilidad (Nuevo por F1)  
Diagnóstico   
Contratos  
Cotización  
Constancia  
Otro documento

**Tabla: roles**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT, (PK, autoincrement) | Identificador del rol.  |
| **nombre** | TEXT | Nombre del rol: Asesor, Auxiliar Administrativo, Supervisor Operativo(Admin) |
| **descripcion**  | TEXT, NULLABLE  | Alcance y permisos del rol dentro de la plataforma.  |

**Tabla: usuarios**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, FK \-\> auth.users.id) | Identificador de usuario (comparte el mismo UUID que auth.users.id para políticas RLS con auth.uid()). |
| **rol\_id** | SMALLINT, NOT NULL, (FK \-\> roles.id) | Nombre del rol: Asesor, Auxiliar Administrativo (Auxiliar), Supervisor Operativo (Admin). |
| **tipo\_asesor\_id**  | SMALLINT, NULLABLE (FK \-\> tipos\_asesor.id)  | Tipo de asesor. Solo aplica cuando el rol es Asesor; para Auxiliar y Supervisor queda en NULL.  |
| **nombre** | TEXT | Nombre del usuario.  |
| **apellido\_paterno**  | TEXT | Apellido paterno.  |
| **apellido\_materno**  | TEXT | Apellido materno.  |
| **correo\_electronico**  | TEXT, NOT NULL, UNIQUE | Correo de acceso.  |
| **contrasena\_hash** | VARCHAR(255)  | Contraseña del usuario. |
| **activo** | BOOLEAN, DEFAULT true  | Permite desactivar el acceso sin borrar el historial.  |
| **fecha\_creacion**  | TIMESTAMPTZ | Fecha en que se creó el usuario. |

**Tabla: estatus\_tramite**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK)  | Identificador del estatus. |
| **nombre** | TEXT | Nombre del estatus |
| **descripcion**  | TEXT | Descripción operativa (definida por H3GA).   |
| **categoria**  | ENUM (categoria\_tramite) | No aplica / Pendiente / En proceso / Completado / Excepcion |
| **avance\_porcentaje\_fijo**  | SMALLINT, NULLABLE  | Valor automático para pendiente y completado. NULL para en\_proceso (editable) y excepcion (congelado). |
| **avance\_editable**  | BOOLEAN | true solo para categoría en\_proceso — es cuando el asesor puede mover el % |
| **avance\_min / avance\_max** | SMALLINT, NULLABLE | Rango permitido cuando avance\_editable \= true. Actualmente 20–90. |

Datos:

| id | nombre | categoria | avance\_porcentaje\_fijo | editable | rango |
| ----- | ----- | ----- | ----- | ----- | ----- |
| 1 | No aplica | no\_aplica | — | no | — |
| 2 | Por iniciar | pendiente | 10 | no | — |
| 3 | En proceso cliente | en\_proceso | — | **sí** | 20–90 |
| 4 | En proceso asesor | en\_proceso | — | **sí** | 20–90 |
| 5 | En proceso Instituto | en\_proceso | — | **sí** | 20–90 |
| 6 | Finalizado | completado | 100 | no | — |
| 7 | Bloqueado | excepcion | — (congelado) | no | — |
| 8 | Cancelado | excepcion | — (congelado) | no | — |
| 9 | Detenido | excepcion | — (congelado) | no | — |

## **Etapa 0 — Diagnóstico Inicial**

Fuente: formulario Diagnóstico\_Inicial\_VF2.docx. Es el expediente que se llena cuando un cliente entra a H3GA; el software debe poder capturarlo y, según el usuario, también generar una versión en PDF para imprimir y entregar al cliente (nota de diseño para el frontend — no afecta el esquema).

### **Tabla: historial\_laboral**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria.  |
| **cliente\_id**  | UUID (FK \-\> clientes.id), UNIQUE | Cliente al que pertenece.  |
| **semanas\_issste**  | INTEGER  | Semanas cotizadas reconocidas por el ISSSTE. |
| **salario\_promedio**  | NUMERIC(10,2)  | Salario base promedio del cliente.  |
| **ultimo\_patron** | TEXT | Nombre del último patrón/empleador del cliente.  |
| **vigencia\_derechos** | ENUM | Si el cliente tiene vigentes sus derechos ante el instituto. Sí, No, Por confirmar. |
| **activo** | BOOLEAN, DEFAULT true  | Permite desactivar el acceso sin borrar el historial.  |

## **Tabla: tipo\_correccion**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK) | Identificador del tipo de corrección.  |
| **nombre** | TEXT  | Nombre del trámite de corrección.  |

Valores: Corrección CURP, Corrección RFC, Corrección Acta, Unificación NSS, Corrección AFORE, Actualización IMSS, Otro. 

## **Tabla: correcciones\_cliente**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria.  |
| **cliente\_id**  | UUID (FK \-\> clientes.id) | Cliente al que pertenece la corrección.  |
| **tipo\_correccion\_id**  | SMALLINT (FK → tipo\_correccion.id) | Qué tipo de corrección es.  |
| **observaciones**  | TEXT, NULLABLE | Notas sobre esta corrección específica.  |
| **tiempo\_promedio**  | TEXT, NULLABLE | Tiempo promedio estimado para resolver esta corrección. |
| **dato\_actual** | TEXT, NULLABLE  | Valor erróneo registrado actualmente ante el instituto ("Dice"), ej. nombre mal escrito, sexo, fecha o CURP.  |
| **dato\_correcto**  | TEXT, NULLABLE  | Valor correcto según documentos probatorios ("Debe decir") que se solicita corregir.  |

**Tabla: unificacion\_nss\_detalle**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **correccion\_id** | UUID (FK \-\> correcciones\_cliente.id), UNIQUE  | Corrección a la que pertenece el detalle de unificación. |
| **nss\_principal\_elegido** | VARCHAR(11) | Número de Seguro Social seleccionado como principal. |
| **criterio\_seleccion** | ENUM (vinculo\_curp, antiguedad, credito\_infonavit, estatus\_pension) | Criterio o justificación para elegir dicho NSS principal. |
| **etapa\_institucional\_actual** | ENUM(ingreso\_validacion, dictaminacion\_imss, migracion\_historial, notificacion\_consar\_infonavit) | Estado o avance actual del trámite ante el instituto. |

**Tabla: unificacion\_nss\_secundarios**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **unificacion\_id** | UUID (FK \-\> unificacion\_nss\_detalle.id) | Detalle de unificación al que pertenece este NSS secundario. |
| **nss** | VARCHAR(11) | NSS secundario detectado que se absorberá al principal. |
| **observaciones** | TEXT, NULLABLE | Observaciones o notas sobre este NSS secundario. |

**Tabla: divisiones** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador único de la división laboral/económica. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre oficial de la división. |
| **activo** | BOOLEAN, Default true | Indica si la división está disponible para selección. |

**Tabla: grupos\_principales**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador único del grupo principal de ocupación. |
| **division\_id** | SMALLINT, NOT NULL (FK \-\> divisiones.id) | División económica/laboral a la que pertenece este grupo. |
| **nombre** | TEXT, NOT NULL | Nombre descriptivo del grupo principal. |
| **activo** | BOOLEAN, DEFAULT true | Indica si el grupo principal está disponible para selección. |

**Restricciones de Integridad:**

UNIQUE (division\_id, nombre) — Evita que el mismo nombre de grupo se repita dentro de una misma división. Permite que divisiones distintas tengan grupos con nombres iguales (ej. "Gerentes" puede existir en Comercio y en Servicios sin conflicto).

## **Etapa 1 — Diagnóstico Especializado**

**Tabla: diagnostico\_especializado**  
Fuente: Formato F1. Diagnóstico Especializado.docx (Etapa 1 del proceso de H3GA). Almacena el dictamen técnico, conservación de derechos y estrategias evaluadas por el asesor.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **cliente\_id** | UUID (FK \-\> clientes.id), UNIQUE | Cliente al que pertenece el diagnóstico especializado. |
| **fecha\_analisis** | DATE, DEFAULT CURRENT\_DATE | Fecha en que se realizó el análisis técnico. |
| **asesor\_id** | UUID (FK \-\> usuarios.id) | Asesor que emitió el diagnóstico. |
| **fecha\_primera\_cotizacion** | DATE, NULLABLE | Fecha de primer alta en el IMSS (clave para confirmar Ley 73 vs 97). |
| **cotizo\_antes\_julio\_1997** | BOOLEAN | Indica si cotizó antes del 1° de julio de 1997\. |
| **tipo\_pension\_probable** | ENUM (tipo\_pension) | Cesantía, Vejez, Invalidez, Viudez, Otro. |
| **edad\_objetivo\_pension** | SMALLINT | Edad en la que el cliente planea pensionarse (ej. 60, 62, 65). |
| **comentarios\_cliente** | TEXT, NULLABLE | Comentarios del cliente sobre su objetivo. |
| **observaciones\_regimen** | TEXT, NULLABLE | Observaciones libres sobre el régimen determinado. |
| **fecha\_ultima\_baja** | DATE, NULLABLE | Fecha de baja más reciente en el régimen obligatorio del IMSS. |
| **ultimo\_salario\_cotizado** | NUMERIC(10,2), NULLABLE | Último Salario Base de Cotización (SBC) registrado. |
| **fecha\_vencimiento\_conservacion** | DATE, NULLABLE | Fecha límite estimada de la conservación de derechos ante el IMSS. |
| **tiene\_conservacion\_derechos** | ENUM (validacion\_estado) | Sí / No / Requiere validar. |
| **tiempo\_estimado\_conservacion\_meses** | INTEGER, NULLABLE | Duración estimada de la conservación de derechos, en meses. |
| **dentro\_de\_conservacion** | ENUM (validacion\_estado) | Reutiliza el mismo ENUM que tiene\_conservacion\_derechos (Sí/No/Requiere validar tienen los mismos 3 valores en la práctica). |
| **requiere\_reactivacion** | BOOLEAN, DEFAULT false | Indica si el cliente perdió vigencia y debe volver a cotizar antes de pensionarse. |
| **conviene\_pensionar\_ahora** | ENUM (conveniencia\_pension) | Sí / No / Depende del escenario. |
| **comentarios\_conservacion** | TEXT, NULLABLE | Comentarios específicos de la sección de conservación de derechos (distintos de observaciones\_regimen). |
| **semanas\_reconocidas\_al\_baja** | INTEGER, NULLABLE | Semanas reconocidas por el IMSS al momento de la baja más reciente. |
| **semanas\_descontadas** | INTEGER, DEFAULT 0 | Semanas descontadas por retiros parciales (desempleo/matrimonio). |
| **semanas\_reintegradas** | INTEGER, DEFAULT 0 | Semanas recuperadas o pagadas de vuelta a la AFORE. |
| **semanas\_efectivas\_pension** | INTEGER | Semanas netas útiles con las que se calculará la pensión. |
| **semanas\_requeridas\_pension** | INTEGER, NULLABLE | Semanas que exige la ley para tener derecho a pensión, contra la cual se compara semanas\_efectivas\_pension. |
| **trabaja\_cuenta\_propia** | ENUM (si\_no\_parcial) | Sí / No / Parcialmente. |
| **actividad\_economica** | TEXT, NULLABLE | Actividad económica del cliente si trabaja por cuenta propia. |
| **ingreso\_mensual\_aproximado** | NUMERIC(10,2), NULLABLE | Ingreso mensual aproximado reportado por el cliente. |
| **conclusion\_modalidad\_10** | ENUM (evaluacion\_modalidad) | Dictamen sobre la viabilidad de registrarlo como trabajador independiente. |
| **comentarios\_modalidad\_10** | TEXT, NULLABLE | Comentarios de cierre de la sección de Modalidad 10\. |
| **dado\_de\_baja\_regimen\_obligatorio** | ENUM (validacion\_estado) | Sí / No / Requiere validar. |
| **conclusion\_modalidad\_40** | ENUM (evaluacion\_modalidad) | Dictamen sobre la viabilidad de inscribirlo en Modalidad 40\. |
| **salario\_propuesto\_m40** | NUMERIC(10,2), NULLABLE | Salario diario propuesto para cotizar en Modalidad 40\. |
| **meses\_propuestos\_m40** | SMALLINT, NULLABLE | Número de meses proyectados a pagar en Modalidad 40\. |
| **evalua\_retroactivo\_m40** | BOOLEAN, DEFAULT false | Indica si la estrategia contempla pago retroactivo en una sola exhibición. |
| **comentarios\_modalidad\_40** | TEXT, NULLABLE | Comentarios de cierre de la sección de Modalidad 40\. |
| **justificacion\_estrategia** | TEXT | Argumentación técnica y legal de por qué conviene dicha estrategia. |
| **siguiente\_paso\_sugerido** | TEXT, NULLABLE | Siguiente paso sugerido por el asesor (distinto de justificacion\_estrategia, que ya tienes). |
| **conclusion\_financiera** | TEXT, NULLABLE | Conclusión del análisis financiero y retorno de inversión (Sección 11 del F1). |
| **firma\_cliente\_path**  | TEXT, NULLABLE | Ruta de la imagen de firma del cliente en Storage (si se firma digitalmente en pantalla). |
| **firma\_asesor\_path**  | TEXT, NULLABLE | Ruta de la imagen de firma del asesor en Storage (si se firma digitalmente en pantalla). |
| **fecha\_firma**  | TIMESTAMPTZ, NULLABLE | Fecha y hora de firma del diagnóstico (si se firma en pantalla). |
| **creado\_en** | TIMESTAMPTZ, DEFAULT now() | Fecha de registro en sistema. |
| **actualizado\_en** | TIMESTAMPTZ, DEFAULT now() | Fecha de última modificación del diagnóstico. |

**Tabla: estrategia\_recomendada\_tipo (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador de la estrategia. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Texto de la estrategia. |

**Valores del catálogo:** Pensionarse sin cambios \- Solicitar recuperación/aclaración de semanas \- Corregir datos personales o NSS \- Inscribirse a Modalidad 10 \- Inscribirse a Modalidad 40 \- Inscribirse a Modalidad 40 con pago retroactivo \- Reingresar o regularizar Modalidad 40 \- Inscribirse a Modalidad 40 y Modalidad 40 retroactiva \- Inscribirse a Modalidad 10 y Modalidad 40 retroactiva \- Esperar y seguir cotizando con patrón \- Estrategia mixta \- No se recomienda realizar aportación adicional \- Otro.

**Tabla: diagnostico\_estrategias\_recomendadas (puente, multi-select)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **diagnostico\_id** | UUID (FK → diagnostico\_especializado.id) | Diagnóstico al que pertenece la selección. |
| **estrategia\_id** | SMALLINT (FK → estrategia\_recomendada\_tipo.id) | Estrategia marcada. |
| **detalle\_otro** | TEXT, NULLABLE | Solo si estrategia\_id \= "Otro"  |

PK compuesta: (diagnostico\_id, estrategia\_id).

**Tabla: objetivo\_diagnostico (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador del objetivo. |
| **nombre**  | TEXT, NOT NULL, UNIQUE | Texto del objetivo. |

**Valores del catálogo:** Pensionarse lo antes posible · Maximizar pensión mensual · Negativa de pensión · Recuperar semanas no reconocidas · Reactivar conservación de derechos · Mejorar salario promedio · Evaluar Modalidad 40 · Evaluar Modalidad 10 / trabajador independiente · Evaluar pago retroactivo de Modalidad 40 · Regularizar historial IMSS · Determinar si conviene seguir trabajando · Otro

**Tabla: diagnostico\_objetivos (tabla intermedia, selección múltiple)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **diagnostico\_id**  | UUID (FK → diagnostico\_especializado.id)  | Diagnóstico al que pertenece la selección.  |
| **objetivo\_id**  | SMALLINT (FK → objetivo\_diagnostico.id)  | Objetivo marcado.  |
| **detalle\_otro**  | TEXT, NULLABLE  | Texto libre, solo se llena cuando objetivo\_id \= "Otro". |

PK compuesta: (diagnostico\_id, objetivo\_id).

Nota: esto es independiente de clientes.objetivo\_cliente (el ENUM de 3 valores que ya existe desde el Diagnóstico Inicial). Son objetivos de alcance distinto — uno es la intención general del cliente al entrar, el otro es el detalle multi-select que se levanta en el diagnóstico especializado. Se dejan ambos.

**Tabla: tipo\_inconsistencia\_detectada (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador. |
| **nombre** | TEXT, NOT NULL, UNIQUE  | Texto de la inconsistencia. |

**Valores del catálogo:** Hay periodos laborados no reconocidos, Hay duplicidad de NSS, Hay homonimia o datos personales incorrectos, Hay semanas descontadas sin explicación clara, Hay periodos con salario menor al real, Hay patrón desaparecido o sin registros completos, Hay posible portabilidad ISSSTE-IMSS, No se detectan inconsistencias relevantes, Otro.

**Tabla: diagnostico\_inconsistencias\_generales (puente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **diagnostico\_id** | UUID (FK → diagnostico\_especializado.id) | Diagnóstico. |
| **tipo\_id**  | SMALLINT (FK → tipo\_inconsistencia\_detectada.id)  | Tipo marcado.  |
| **detalle\_otro**  | TEXT, NULLABLE  | Solo si tipo\_id \= "Otro". |

PK compuesta: (diagnostico\_id, tipo\_id).

**Tabla: analisis\_recuperacion\_semanas (1:1 con el diagnóstico)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **diagnostico\_id** | UUID (FK → diagnostico\_especializado.id), UNIQUE | Diagnóstico al que pertenece. |
| **aplica** | ENUM (aplicabilidad\_recuperacion) | Sí / No / Requiere más evidencia. |
| **observaciones** | TEXT, NULLABLE | Observaciones de la sección. |

aplicabilidad\_recuperacion \= ('si', 'no', 'requiere\_mas\_evidencia') 

**Tabla: tipo\_gestion\_recuperacion (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre del tipo de gestión. |

**Valores del catálogo:** Aclaración de semanas cotizadas ante IMSS · Recuperación de semanas cotizadas ante PNT · Corrección de datos personales · Unificación de NSS · Revisión de semanas descontadas · Búsqueda de evidencia patronal · Portabilidad ISSSTE-IMSS · Otro

**Tabla: recuperacion\_gestiones (puente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **analisis\_id** | UUID (FK → analisis\_recuperacion\_semanas.id) | Análisis de recuperación. |
| **tipo\_gestion\_id** | SMALLINT (FK → tipo\_gestion\_recuperacion.id) | Tipo de gestión marcado. |
| **detalle\_otro** | TEXT, NULLABLE | Solo si tipo\_gestion\_id \= "Otro". |

PK compuesta: (analisis\_id, tipo\_gestion\_id).

**Tabla: tipo\_evidencia\_recuperacion (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre del tipo de evidencia. |

**Valores del catálogo:** Recibos de nómina · Constancias laborales · Hojas rosas / avisos afiliatorios · Estados de cuenta AFORE / SAR · Contratos laborales · Credenciales o documentos del patrón · Declaraciones fiscales o comprobantes de pago · Otro

**Tabla: recuperacion\_evidencias (puente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **analisis\_id** | UUID (FK → analisis\_recuperacion\_semanas.id) | Análisis de recuperación. |
| **tipo\_evidencia\_id** | SMALLINT (FK → tipo\_evidencia\_recuperacion.id) | Tipo de evidencia marcado. |
| **detalle\_otro** | TEXT, NULLABLE | Solo si tipo\_evidencia\_id \= "Otro". |

PK compuesta: (analisis\_id, tipo\_evidencia\_id).

**Tabla: objetivo\_modalidad\_10 (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK) | Identificador único del objetivo. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre del objetivo para Modalidad 10\. |

**Valores del catálogo:** Tener cobertura médica y prestaciones · Seguir generando semanas · Reactivar derechos · Mejorar continuidad de cotización · Evaluar transición posterior a Modalidad 40 · Otro

**Tabla: diagnostico\_objetivos\_m10 (puente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **diagnostico\_id** | UUID (FK → diagnostico\_especializado.id) | Diagnóstico al que pertenece. |
| **objetivo\_id** | SMALLINT (FK → objetivo\_modalidad\_10.id) | Objetivo marcado. |
| **detalle\_otro** | TEXT, NULLABLE | Solo si objetivo\_id \= "Otro". |

PK compuesta: (diagnostico\_id, objetivo\_id).

**Tabla: modalidad10\_criterios (evaluación de aplicabilidad, Sí/No por criterio fijo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK) | Clave primaria. |
| **diagnostico\_id** | UUID (FK \-\> diagnostico\_especializado.id) | Diagnóstico. |
| **criterio** | TEXT | Texto del criterio. |
| **cumple** | BOOLEAN, NULLABLE | Sí (true) / No (false). |
| **observaciones** | TEXT, NULLABLE | Observación puntual del criterio. |

**Criterios fijos**: Tiene actividad independiente real \- Tiene CURP, NSS y correo \- Puede comprobar ingreso/actividad \- Necesita servicios médicos IMSS \- Busca generar semanas adicionales \- Conviene frente a alta con patrón \- Conviene frente a Modalidad 40

**Tabla: objetivo\_modalidad\_40 (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador único del objetivo. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre del objetivo para Modalidad 40\. |

**Valores:** Aumentar salario promedio \- Completar semanas faltantes \- Mejorar pensión Ley 73 \- Mantener cotización para pensión \- Reingresar tras baja por mora · Otro 

**Tabla: diagnostico\_objetivos\_m40 (puente)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **diagnostico\_id** | UUID (FK \-\> diagnostico\_especializado.id) | Diagnóstico al que pertenece. |
| **objetivo\_id** | SMALLINT (FK → objetivo\_modalidad\_40.id) | Objetivo marcado. |
| **detalle\_otro** | TEXT, NULLABLE | Solo si objetivo\_id \= "Otro". |

PK compuesta: (diagnostico\_id, objetivo\_id).

**Tabla: modalidad40\_criterios (evaluación de requisitos, 3 estados)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK) | Clave primaria. |
| **diagnostico\_id** | UUID (FK \-\> diagnostico\_especializado.id) | Diagnóstico. |
| **criterio** | TEXT | Texto del criterio (lista fija de 7, ver abajo). |
| **cumplimiento** | ENUM (cumplimiento\_criterio) | Cumple / No cumple / Requiere validar. |
| **observaciones** | TEXT, NULLABLE | Observación puntual. |

cumplimiento\_criterio \= ('cumple', 'no\_cumple', 'requiere\_validar')

**Criterios fijos:** Cuenta con baja del régimen obligatorio \- Tiene al menos 52 semanas en los últimos 5 años previos a baja \- No han pasado más de 5 años desde la baja \- Salario elegido no es menor al último salario registrado \- Salario elegido no excede el tope permitido \- Entiende que Modalidad 40 no otorga servicio médico \- Puede cubrir pagos mensuales adelantados.

evalua\_retroactivo\_m40 (que ya tienes) queda como bandera rápida de sí/no se evaluó. Todo el detalle vive aquí:

**Tabla: analisis\_modalidad40\_retroactivo (1:1 con el diagnóstico)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **diagnostico\_id** | UUID (FK \-\> diagnostico\_especializado.id), UNIQUE | Diagnóstico al que pertenece. |
| **fecha\_propuesta\_inicio\_m40** | DATE, NULLABLE | Fecha propuesta de inicio de Modalidad 40 retroactiva. |
| **fecha\_solicitud** | DATE, NULLABLE | Fecha en que se solicitaría el trámite. |
| **meses\_retroactivos\_estimados** | SMALLINT, NULLABLE | Meses que se pagarían de forma retroactiva. |
| **salario\_diario\_propuesto** | NUMERIC(10,2), NULLABLE | Salario diario propuesto para el cálculo retroactivo. |
| **cuotas\_estimadas** | NUMERIC(12,2), NULLABLE | Cuotas estimadas a pagar. |
| **recargos\_actualizaciones\_estimadas** | NUMERIC(12,2), NULLABLE | Recargos y actualizaciones estimadas. |
| **total\_estimado\_pagar** | NUMERIC(12,2), NULLABLE | Total estimado (cuotas \+ recargos). |
| **baja\_por\_mora\_previa** | BOOLEAN, NULLABLE | ¿Existe baja por mora previa? |
| **dentro\_de\_plazo\_reingreso** | ENUM (validacion\_estado) | ¿Está dentro de plazo para reingreso, si aplica? |
| **conclusion\_retroactivo** | ENUM (evaluacion\_retroactivo) | Conviene / No conviene / Conviene parcialmente / Requiere cálculo y validación. |
| **comentarios** | TEXT, NULLABLE | Comentarios de cierre. |

evaluacion\_retroactivo \= ('conviene', 'no\_conviene', 'conviene\_parcialmente', 'requiere\_calculo\_validacion') 

**Tabla: retroactivo\_evaluacion\_conveniencia**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK) | Clave primaria. |
| **retroactivo\_id** | UUID (FK → analisis\_modalidad40\_retroactivo.id) | Análisis al que pertenece. |
| **pregunta** | TEXT | Texto de la pregunta (lista fija de 6). |
| **respuesta** | BOOLEAN, NULLABLE | Sí (true) / No (false). |

**Preguntas fijas:** ¿El retroactivo mejora salario promedio? \- ¿El retroactivo agrega semanas útiles? \- ¿Evita pérdida de conservación de derechos? \- ¿Reduce tiempo para pensionarse? \- ¿El costo se recupera con incremento de pensión? \- ¿Hay riesgo de rechazo o ajuste por IMSS?

**Tabla: escenario\_pension**  
Fuente: Sección 11 y 12 del F1 ("Cálculo de escenarios y retorno de inversión"). Guarda cada uno de los escenarios proyectados con la calculadora para que el cliente los compare.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Identificador único del escenario. |
| **diagnostico\_f1\_id** | UUID (FK \-\> diagnostico\_especializado.id) | Diagnóstico al que corresponden estos cálculos. |
| **nombre\_escenario** | TEXT | Nombre del escenario (ej. "Base sin estrategia", "Mod. 40 \- 2 años", "Mod. 40 topada", "Retroactivo"). |
| **orden** | SMALLINT | Orden del escenario (0 \= Escenario Base, 1, 2, 3...) para identificar la referencia contra la cual se calcula incremento\_mensual. |
| **semanas\_proyectadas** | INTEGER | Semanas acumuladas al llegar a la fecha de pensión. |
| **salario\_promedio\_proyectado** | NUMERIC(10,2) | Salario promedio de las últimas 250 semanas cotizadas. |
| **inversion\_total\_estimada** | NUMERIC(12,2), DEFAULT 0 | Costo total de pagos a realizar (cuotas M40, recargos o semanas). |
| **pension\_mensual\_estimada** | NUMERIC(12,2) | Monto mensual estimado de la pensión a recibir. |
| **incremento\_mensual** | NUMERIC(12,2) | Diferencia positiva frente a la pensión base sin estrategia. |
| **meses\_recuperacion\_inversion** | NUMERIC(6,1), NULLABLE | Meses estimados para recuperar lo invertido (Inversión ÷ Incremento). |
| **beneficio\_a\_5\_anios** | NUMERIC(12,2), NULLABLE | Total acumulado a cobrar en los primeros 5 años de pensión. |
| **beneficio\_a\_10\_anios** | NUMERIC(12,2), NULLABLE | Total acumulado a cobrar a los 10 años de pensión. |
| **beneficio\_a\_15\_anios** | NUMERIC(12,2), NULLABLE | Total acumulado a cobrar a los 15 años de pensión. |
| **salario\_modalidad\_40**  | NUMERIC(10,2), NULLABLE  | Salario propuesto en Modalidad 40 para este escenario específico.  |
| **meses\_modalidad\_40**  | SMALLINT, NULLABLE  | Meses de cotización en Modalidad 40 para este escenario.  |
| **costo\_mensual\_estimado**  | NUMERIC(12,2), NULLABLE  | Costo mensual (distinto de inversion\_total\_estimada, que es el total). |

**Tabla: periodos\_inconsistencias**

Fuente: Sección 5 del F1 ("Detalle de periodos a revisar"). Registra los patrones o lapsos donde el IMSS no le reconoció semanas al cliente y requieren aclaración o juicio.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Identificador único de la inconsistencia. |
| **cliente\_id** | UUID (FK \-\> clientes.id) | Cliente que tiene la discrepancia patronal. |
| **nombre\_patron** | TEXT | Nombre de la empresa o empleador no reconocido. |
| **periodo\_reclamado** | TEXT | Rango de fechas laboradas (ej. "1988 \- 1993" o "Ene 1995 \- Mar 1997"). |
| **semanas\_esperadas** | INTEGER | Semanas que el cliente asegura haber trabajado. |
| **semanas\_reconocidas** | INTEGER, DEFAULT 0 | Semanas que el IMSS actualmente le reconoce de ese patrón. |
| **evidencia\_disponible** | TEXT | Documentos físicos que tiene el cliente (ej. "Hojas rosas, contratos, recibos nómina"). |
| **accion\_sugerida** | TEXT | Vía de solución (ej. "Aclaración ante IMSS", "Búsqueda PNT", "Juicio laboral"). |
| **estatus** | ENUM (estatus\_inconsistencia), DEFAULT 'pendiente' | Estado de la revisión (pendiente, en\_tramite, recuperado, no\_procedente). |

**Tabla: plan\_accion**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria.  |
| **diagnostico\_id**  | UUID (FK → diagnostico\_especializado.id)  | Diagnóstico al que pertenece.  |
| **accion**  | TEXT | Acción a realizar.  |
| **fecha\_objetivo**  | DATE, NULLABLE  | Fecha objetivo para completarla. |
| **estatus**  | ENUM (estatus\_plan\_accion) | Pendiente / En proceso / Hecho. |
| **observaciones** | TEXT, NULLABLE  | Observaciones. |

estatus\_plan\_accion \= ('pendiente', 'en\_proceso', 'hecho')

### **Tabla: objetivo\_especifico\_inicial (catálogo)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Texto del objetivo específico. |

**Valores del catálogo (del F0, numeración original del formulario):**

2\. Corrección de datos personales · 3\. Unificación de NSS · 4\. Aclaración/Recuperación de Semanas · 5\. Modalidad 10 · 6\. Modalidad 40 · 7\. Modalidad 40 retroactiva · 8\. IMSS-ISSSTE/Portabilidad · 9\. Unificación AFORE/cuentas · 10\. SAR92/Recursos · 11\. Solicitud de pensión · 12\. Negativa de pensión/recuperación de recursos · 13\. Juicio y jurisdicción.

### **Tabla: cliente\_objetivos\_especificos (puente, multi-select)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **cliente\_id** | UUID (FK → clientes.id) | Cliente al que pertenece la selección. |
| **objetivo\_id** | SMALLINT (FK → objetivo\_especifico\_inicial.id) | Objetivo marcado. |

**PK compuesta:** (cliente\_id, objetivo\_id).

**Nota:** esto es independiente de objetivo\_diagnostico (el catálogo de 12 valores ya existente, ligado a diagnostico\_especializado/F1) — son dos secciones de objetivo distintas, en dos formularios distintos, con redacción distinta. Se dejan ambas, igual que ya se hizo con clientes.objetivo\_cliente vs. objetivo\_diagnostico.

## **Tabla: avisos**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **tipo** | ENUM (cita, tramite) | De qué se origina la alerta. |
| **etapa\_tramite\_id** | UUID, NULLABLE (FK \-\> etapas\_tramite.id) | Se llena si el aviso viene de una fase (F0-F4). |
| **evento\_id** | UUID, NULLABLE (FK \-\> eventos\_agenda.id) | Se llena si el aviso viene de una cita. |
| **fecha\_alerta** | TIMESTAMPTZ | fecha\_compromiso − 2 días (regla confirmada por Joyce). |
| **atendido** | BOOLEAN, DEFAULT false |  |
| **atendido\_por** | UUID, NULLABLE (FK \-\> usuarios.id) | Usuario que atendio el aviso |
| **fecha\_atencion** | TIMESTAMPTZ, NULLABLE | Dia que se le dio atencion |

**Restricción:** CHECK ((etapa\_tramite\_id IS NOT NULL) \<\> (evento\_id IS NOT NULL)) — exactamente uno de los dos debe estar lleno, nunca ambos ni ninguno.

## **Tabla: eventos\_agenda**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **asesor\_id** | UUID (FK \-\> usuarios.id) |  |
| **cliente\_id** | UUID (FK \-\> clientes.id) |  |
| **fecha** | DATE |  |
| **hora** | TIME |  |
| **motivo** | TEXT | Texto libre. |
| **estatus** | ENUM (pendiente, cumplido, reagendado, cancelado) |  |

# 

**Tabla: credenciales\_correo\_cliente** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **cliente\_id** | UUID FK UNIQUE | Cliente propietario de la cuenta. |
| **correo** | TEXT | Correo al que corresponde la credencial. |
| **contrasena\_encriptada** | TEXT | Contraseña almacenada cifrada. |
| **fecha\_actualizacion** | TIMESTAMPTZ | Última actualización. |
| **actualizado\_por** | UUID FK | Usuario que realizó la actualización. |
| **activo** | BOOLEAN | Indica si la credencial está vigente. |

**Tabla: informacion\_fiscal**

la empresa ofrece el servicio de contabilidad y solamente se requiere cuando: requiere\_contadora \= SÍ entonces tendría más sentido que esté asociada al expediente del cliente/Ruta o como módulo independiente. Y solamente se crea/activa cuando el cliente contrata ese servicio.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **cliente\_id** | UUID FK UNIQUE | Cliente al que pertenece. |
| **regimen\_fiscal** | TEXT |  Régimen fiscal del cliente. |
| **fecha\_registro** | TIMESTAMPTZ | Fecha de registro. |
| **activo**  | BOOLEAN | Indica si la información está vigente. |
| **observaciones** | TEXT NULL | Observaciones fiscales. |
| **fiel\_entregada**  | BOOLEAN, DEFAULT false | Confirma que el cliente entregó su e.firma por un canal externo al sistema.  |
| **sat\_contrasena\_entregada**  | BOOLEAN, DEFAULT false | Confirma que el cliente compartió su contraseña del SAT fuera del sistema (no se almacena).  |
| **fecha\_confirmacion**  | TIMESTAMPTZ, NULLABLE  | Fecha de Confirmación. |

# 

**Tabla: informacion\_issste (extensión 1:1 de historial\_laboral, solo para clientes con régimen ISSSTE)**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador |
| **historial\_laboral\_id**  | UUID FK UNIQUE (-\> historial\_laboral.id)  | Solo existe cuando el régimen del cliente (clientes.regimen\_id) es ISSSTE o Mixto IMSS-ISSSTE. |
| **nss\_issste** | VARCHAR(20) | Identificador ISSSTE — no existe en historial\_laboral. |
| **regimen\_pensionario** | TEXT | Décimo transitorio / cuentas individuales — tampoco existe en historial\_laboral.. |
| **anios\_laborados** | NUMERIC(5,2) NULL  | Complementa a las semanas, útil porque en ISSSTE a veces se reporta en años. |
| **activo** | BOOLEAN  | Indica si el registro está vigente |

# 

Tablas del módulo modalidades

**Tabla: modalidades\_aplicacion** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador |
| **cliente\_id**  | UUID FK → clientes.id  | Cliente al que pertenece esta aplicación.  |
| **diagnostico\_id** | UUID FK → diagnostico\_especializado.id  | Diagnóstico del cual se derivan los objetivos, criterios y análisis de cualquier modalidad asociada.  |
| **aplica\_m10**  | BOOLEAN, DEFAULT false  | Check que indica si Modalidad 10 se usará con este cliente. |
| **aplica\_m40** | BOOLEAN, DEFAULT false  | Check que indica si Modalidad 40 se usará con este cliente. |
| **aplica\_m40r**  | BOOLEAN, DEFAULT false  | Check que indica si Modalidad 40 retroactiva se usará con este cliente.  |
| **estatus\_m10\_id**  | SMALLINT FK → estatus\_tramite.id, NULLABLE  | Estatus del trámite de Modalidad 10, si aplica.  |
| **fase\_m10\_id**  | SMALLINT (FK → fase\_modalidad.id) NULLABLE  | Fase de Modalidad 10\. Vacío si no aplica.  |
| **estatus\_m40r\_id**  | SMALLINT (FK → estatus\_tramite.id), NULLABLE | Estatus del trámite de Modalidad 40 Retroactiva, si aplica.  |
| **fase\_m40r\_id**  | SMALLINT (FK → fase\_modalidad.id) NULLABLE  | Fase de Modalidad 40 retroactiva. Vacío si no aplica.  |
| **estatus\_m40\_id**  | SMALLINT (FK → estatus\_tramite.id), NULLABLE | Estatus del trámite de Modalidad 40, si aplica.  |
| **fase\_m40\_id**  | SMALLINT (FK → fase\_modalidad.id) NULLABLE  | Fase de Modalidad 40\. Vacío si no aplica.  |
| **tipo\_modalidad**  | ENUM(tipo\_modalidad)  | Indica la modalidad aplicada (‘modalidad\_10’,'modalidad\_40’,'modalidad\_40\_retroactiva’,'mixto’).   |
| **motivo\_cierre** | TEXT  | Razón por la que una modalidad quedó Cancelada o Detenida. Texto libre, por ejemplo “No cumple las 52 semanas previas a la baja” o “El cliente decidió no continuar”. |
| **fecha\_cita\_imss**  | DATE,  NULLABLE  | Fecha programada o realizada de la cita ante el IMSS relacionada a este trámite.  |
| **ultimo\_salario\_diario\_registrado**  | NUMERIC(10,2) , NULLABLE  | Último salario diario de cotización que el cliente tenía registrado antes de iniciar la estrategia.  |
| **creado\_el**  | TIMESTAMPTZ  | Fecha y hora de creación del registro (auditoría).  |
| **actualizado\_el** | TIMESTAMPTZ  | Fecha y hora del último cambio.  |

# De 1 a 2 modalidades, M10 \+ M40 prohibido, fase y estatus solo en las modalidades marcadas, y mixto solo con dos. 

**Tabla: fase\_modalidad**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK  | Identificador de la fase. |
| **nombre**  | TEXT UNIQUE NOT NULL  | Nombre de la fase que ve el usuario. Valores: Prospecto, Documentación, En análisis, Cotización y Autorizado.  |
| **orden** | SMALLINT NOT NULL  | Posición en el flujo (1 a 5). Sirve para dibujar el stepper y saber si una fase va antes o después.  |

Valores iniciales: 1 Prospecto, 2 Documentación, 3 En análisis, 4 Cotización, 5 Autorizado. “Autorizado”

# **Tabla: tareas\_auxiliar** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid ()) | Clave primaria. |
| **cliente\_id** | UUID (FK \-\> clientes.id)  | Cliente al que pertenece la tarea.  |
| **titulo**  | TEXT  | Nombre de la tarea (ej. modalidades).  |
| **instrucciones**  | TEXT | Indicaciones del asesor.  |
| **asignado\_por**  | UUID (FK \-\> usuarios.id)  | Asesor que deja la tarea.  |
| **auxiliar\_id** | UUID (FK \-\> usuarios.id)  | Auxiliar responsable. Debe tener una fila activa en cliente\_auxiliares para ese cliente.  |
| **estatus** | ENUM (estatus\_tarea\_auxiliar)  | Pendiente / Completada / Cancelada. Default: Pendiente.  |
| **creado\_en**  | TIMESTAMPTZ, DEFAULT now()  | Es la fecha “Enviado” que se ve en pantalla.  |
| **completado\_en**  | TIMESTAMPTZ, NULLABLE  | Se llena al completarse.  |

Nuevo ENUM: `estatus_tarea_auxiliar = ('pendiente', 'completada', 'cancelada')`. 

**Tabla: estatus\_envio\_documento (catálogo)** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Identificador de estatus. |
| **nombre** | TEXT, NOT NULL, UNIQUE  | Nombre del estatus.  |
| **orden**  | SMALLINT  | Posición en el flujo.  |
| **es\_final** | BOOLEAN  | True en validado y cancelado |

Valores: Pendiente, No validado, Validado, Cancelado. 

**Tabla: envios\_documento**   
Cada archivo que el auxiliar sube para revisión del asesor, con o sin tarea.   
Si el asesor marca observaciones, el auxiliar sube una versión nueva y la anterior se conserva. 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid())  | Clave primaria.  |
| **cliente\_id** | UUID (FK \-\> clientes.id)  | Cliente al que pertenece el documento.  |
| **tarea\_id** | UUID, NULLABLE (FK \-\> tareas\_auxiliar.id)  | Tarea a la que responde el envío. Queda vacío cuando el auxiliar sube un archivo por su cuenta con “Añadir documento”.  |
| **titulo** | TEXT  | Nombre corto del envío.  |
| **tipo\_documento\_id**  | SMALLINT (FK \-\> tipo\_documento.id)  | Tipo de documento enviado (cotización, constancia, contrato, etc.).  |
| **creado\_por** | UUID (FK \-\> usuarios.id)  | Auxiliar que hace el envío. Debe tener una fila activa en cliente\_auxiliares para ese cliente.  |
| **estatus\_id**  | SMALLINT (FK \-\> estatus\_envio\_documento.id)  | Estatus actual. Default: Pendiente.  |
| **documento\_cliente\_id**  | UUID, NULLABLE (FK \-\> documentos\_clientes.id)  | Se llena al validarse. Apunta al registro creado en el expediente.  |
| **creado\_en**  | TIMESTAMPTZ, DEFAULT now()  | Fecha y hora del envío.  |
| **actualizado\_en**  | TIMESTAMPTZ  | Fecha y hora del último cambio.  |
| **cerrado\_en**  | TIMESTAMPTZ, NULLABLE  | Se llena al quedar Validado o Cancelado.  |

Restricción: UNIQUE (envio\_id, numero\_version). Restricción (CHECK): si resultado está vacío, revisor\_id y fecha\_revision también. Si resultado tiene valor, esos dos son obligatorios. 

#### **Tabla: versiones\_documento**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **envio\_id**  | UUID (FK \-\> envios\_documento.id)  | Envío al que pertenece la versión.   |
| **numero\_version**  | SMALLINT  | 1, 2, 3… Cada corrección del auxiliar genera una nueva.  |
| **archivo\_path**  | TEXT  | Ruta del archivo en el almacenamiento (mismo criterio que documentos\_clientes.archivo\_path).  |
| **hash\_archivo** | VARCHAR(128), NULLABLE  | Detecta si se sube el mismo archivo dos veces.  |
| **subido\_por**  | UUID (FK \-\> usuarios.id)  | Auxiliar que sube la versión.  |
| **fecha\_carga**  | TIMESTAMPTZ, DEFAULT now()  | Fecha y hora en que se subió.  |
| **resultado**  | ENUM (resultado\_revision), NULLABLE  | Validado / No validado. Vacío mientras el asesor no la haya revisado.  |
| **comentario**  | TEXT, NULLABLE  | Observaciones para el auxiliar. Obligatorio cuando resultado \= no\_validado.  |
| **revisor\_id**  | UUID, NULLABLE (FK \-\> usuarios.id)  | Asesor (o Supervisor) que revisó.  |
| **fecha\_revision**  | TIMESTAMPTZ, NULLABLE  | Fecha y hora de la revisión.  |

estatus\_tarea\_auxiliar \= ('pendiente', 'completada', 'cancelada'); resultado\_revision \= ('validado', 'no\_validado'); tipo\_formato \= ('pdf', 'word', 'enlace'); 

Tablas de formatos institucionales

# **Tabla: dependencias\_formato**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Clave primaria. |
| **nombre**  | TEXT, NOT NULL, UNIQUE  | Nombre de la dependencia o institución.   |
| **activo**  | BOOLEAN, DEFAULT true  | Indica si se puede seleccionar al registrar un formato.  |

Valores iniciales: IMSS · SAT · las demás que defina la empresa.

#### **Tabla: formatos\_institucionales**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement)  | Clave primaria. |
| **nombre**  | TEXT, NOT NULL, UNIQUE  | Nombre del formato (ej. “Formato de solicitud de Modalidad 40”).  |
| **descripcion**  | TEXT, NULLABLE  | Para qué sirve el formato. Se muestra en la tarjeta de la biblioteca y en la columna Descripción.  |
| **dependencia\_id**  | SMALLINT, NOT NULL (FK \-\> dependencias\_formato.id)  | Dependencia a la que pertenece el formato (IMSS, SAT, etc.).  |
| **tipo\_formato**  | ENUM (tipo\_formato)  | PDF, Word o Enlace. Define qué botones se muestran (Descargar, Ver documento, Abrir enlace).  |
| **enlace\_url**  | TEXT, NULLABLE  | Dirección del trámite o página. Solo se llena cuando tipo\_formato \= enlace.  |
| **archivo\_path**  | TEXT, NULLABLE  | Ruta del archivo en el almacenamiento. Solo se llena cuando tipo\_formato \= pdf o word.  |
| **creado\_por**  | UUID (FK \-\> usuarios.id)  | Supervisor que registró el formato.  |
| **creado\_en**  | TIMESTAMPTZ, DEFAULT now()  | Fecha de creación del formato.  |
| **actualizado\_por**  | UUID, NULLABLE (FK \-\> usuarios.id)  | Último usuario que lo modificó.  |
| **actualizado\_en**  | TIMESTAMPTZ, NULLABLE  | Fecha y hora de la última modificación.  |
| **activo**  | BOOLEAN, DEFAULT true  | false \= formato eliminado. Deja de verse en la biblioteca, pero se conserva el registro.  |

Tablas de pension final

 

**Tabla pension\_final\_datos\_tramite**

**Descripción:** Datos institucionales adicionales para cada fase de Pensión Final.

| Campo | Tipo de Dato | Clave / Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK; DEFAULT gen\_random\_uuid() | Identificador único del registro. |
| **etapa\_tramite\_id** | UUID | FK → etapas\_tramite.id; UNIQUE | Fase del cliente a la que corresponden los datos. |
| **institucion** | VARCHAR(100) | NULLABLE | Institución o instituciones involucradas; IMSS-ISSSTE se mantiene como una sola fase. |
| **folio\_institucional** | VARCHAR(100) | NULLABLE | Folio o referencia emitida por la institución. |
| **numero\_expediente** | VARCHAR(100) | NULLABLE | Número de expediente administrativo o judicial. |
| **fecha\_solicitud** | DATE | NULLABLE | Fecha de presentación de la solicitud. |
| **fecha\_resolucion** | DATE | NULLABLE | Fecha de resolución institucional. |
| **resultado\_resolucion** | TEXT | NULLABLE | Resultado o descripción de la resolución. |
| **observaciones** | TEXT | NULLABLE | Comentarios adicionales de la gestión institucional. |
| **creado\_el** | TIMESTAMPTZ | DEFAULT now() | Fecha de creación. |
| **actualizado\_el** | TIMESTAMPTZ | DEFAULT now() | Última actualización. |

 

Tablas de servicios complementarios

# **Tabla servicios\_complementarios\_tramite**

# **Descripción:** Seguimiento operativo de solicitudes de APD, Mejoravit, PP, PPR y Otros.

| Campo | Tipo de Dato | Clave / Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK; DEFAULT gen\_random\_uuid() | Identificador de la solicitud. |
| **cliente\_id** | UUID | FK → clientes.id | Cliente que solicita el servicio. |
| **servicio\_id** | SMALLINT | FK → servicios.id | Servicio del catálogo existente. |
| **contrato\_id** | UUID | FK → contratos.id; NULLABLE | Contrato relacionado, si existe. |
| **estatus\_id** | SMALLINT | FK → estatus\_tramite.id | Estatus operativo del servicio. |
| **avance\_porcentaje** | SMALLINT | DEFAULT 0; CHECK 0–100 | Avance del trámite. |
| **accion\_a\_realizar** | TEXT | NULLABLE | Próxima acción pendiente. |
| **fecha\_compromiso** | DATE | NULLABLE | Fecha compromiso de la acción. |
| **fecha\_completada** | DATE | NULLABLE | Fecha de conclusión. |
| **reactivado\_en** | TIMESTAMPTZ | NULLABLE | Fecha de reactivación. |
| **motivo\_rechazo** | TEXT | NULLABLE | Motivo de rechazo o bloqueo. |
| **observaciones** | TEXT | NULLABLE | Notas del seguimiento. |
| **creado\_el** | TIMESTAMPTZ | DEFAULT now() | Fecha de creación. |
| **actualizado\_el** | TIMESTAMPTZ | DEFAULT now() | Última actualización. |

#  

# **Tabla servicios\_complementarios\_historial**

# **Descripción:** Historial de cambios de estatus del servicio.

| Campo | Tipo de Dato | Clave / Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK; DEFAULT gen\_random\_uuid() | Identificador del cambio. |
| **servicio\_tramite\_id** | UUID | FK → servicios\_complementarios\_tramite.id | Solicitud afectada. |
| **estatus\_anterior\_id** | SMALLINT | FK → estatus\_tramite.id; NULLABLE | Estado previo. |
| **estatus\_nuevo\_id** | SMALLINT | FK → estatus\_tramite.id | Nuevo estado. |
| **motivo\_rechazo** | TEXT | NULLABLE | Motivo asociado al cambio. |
| **cambiado\_por** | UUID | FK → usuarios.id | Usuario que realizó el cambio. |
| **fecha\_cambio** | TIMESTAMPTZ | DEFAULT now() | Fecha y hora del cambio. |

#  

# **Tabla servicios\_complementarios\_documentos**

# **Descripción:** Vinculación de documentos del expediente a cada solicitud.

| Campo | Tipo de Dato | Clave / Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK; DEFAULT gen\_random\_uuid() | Identificador de la relación. |
| **servicio\_tramite\_id** | UUID | FK → servicios\_complementarios\_tramite.id | Solicitud del servicio. |
| **documento\_id** | UUID | FK → documentos\_clientes.id | Documento del expediente. |
| **creado\_el** | TIMESTAMPTZ | DEFAULT now() | Fecha de vinculación. |

#  

# **Tabla servicios\_complementarios\_avisos**

# **Descripción:** Vinculación de citas de la agenda general a cada solicitud.

| Campo | Tipo de Dato | Clave / Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK; DEFAULT gen\_random\_uuid() | Identificador de la relación. |
| **servicio\_tramite\_id** | UUID | FK → servicios\_complementarios\_tramite.id | Solicitud del servicio. |
| **aviso\_id** | UUID | FK → eventos\_agenda.id | Cita o actividad asociada. |

#  

# 

# **Tabla: situacion\_patrimonial (extensión 1:1 de diagnostico\_especializado)**

# Captura los datos que alimentan las ayudas del simulador (esposa/hijos/padres) y el análisis financiero/ROI:

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **diagnostico\_f1\_id** | UUID (FK \-\> diagnostico\_especializado.id), UNIQUE | Diagnóstico F1 asociado. |
| **saldo\_cuenta\_individual** | NUMERIC(12,2) | Saldo de la cuenta individual. |
| **aportaciones\_voluntarias** | NUMERIC(12,2) | Monto de aportaciones voluntarias. |
| **ahorros\_inversiones\_adicionales** | NUMERIC(12,2) | Ahorros e inversiones adicionales. |
| **bienes\_patrimoniales** | TEXT | Descripción de bienes patrimoniales. |
| **creditos\_deudas\_vigentes** | TEXT | Detalle de créditos y deudas vigentes. |
| **ingreso\_mensual** | NUMERIC(12,2) | Ingreso mensual principal. |
| **otras\_fuentes\_ingreso** | TEXT | Otras fuentes de ingreso. |
| **ingreso\_conyuge** | NUMERIC(12,2) | Ingreso mensual del cónyuge. |
| **seguros** | TEXT | Seguros contratados. |
| **estado\_salud** | ENUM (bueno, regular, malo) | Estado general de salud. |
| **padecimientos** | TEXT | Detalle de padecimientos o enfermedades. |
| **estado\_civil** | ENUM (estado\_civil) | Estado civil del cliente. |
| **edad\_conyuge** | SMALLINT, NULLABLE | Edad del cónyuge. |
| **actividad\_economica\_conyuge** | TEXT, NULLABLE | Actividad económica del cónyuge. |

# **Tabla: situacion\_patrimonial\_hijos**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **situacion\_patrimonial\_id** | UUID (FK → situacion\_patrimonial.id) | Registro patrimonial al que pertenece. |
| **numero\_hijos** | SMALLINT, DEFAULT 0 | Número total de hijos. |
| **tiene\_discapacidad** | BOOLEAN, DEFAULT false | Indica si el hijo tiene discapacidad. |
| **edad** | SMALLINT | Edad del hijo. |

# **Tabla: cliente\_auxiliares**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID (PK, default gen\_random\_uuid()) | Clave primaria. |
| **cliente\_id** | UUID (FK → clientes.id) | Cliente al que se asigna el auxiliar. |
| **auxiliar\_id** | UUID (FK → usuarios.id) | Auxiliar asignado. |
| **autorizado\_por** | UUID, NULLABLE (FK → usuarios.id) | Usuario que autoriza la asignación. |
| **fecha\_autorizacion** | TIMESTAMPTZ, NULLABLE | Fecha y hora de autorización. |
| **activo** | BOOLEAN, DEFAULT true | Indica si la relación está activa. |

**Restricción:** UNIQUE (cliente\_id, auxiliar\_id)

# Diccionario de datos preliminar modulo financiero:

Versión definitiva.

Yo dejaría H3GA Finanzas con estas tablas:

**Núcleo**

1. SERVICIOS  
2. CONTRATOS  
3. ESTADOS\_CONTRATO

**Seguimiento\_pagos por modalidades**

4. SEGUIMIENTO\_M10  
5. SEGUIMIENTO\_M40  
6. SEGUIMIENTO\_M40\_RETROACTIVA  
7. SEGUIMIENTO\_APD

**APD**

8. TIPOS\_VENTA  
9. MODALIDADES\_APD  
10. TIPOS\_COBRO  
11. PROVEEDORES

**Pagos**

12. PAGOS\_PROGRAMADOS  
13. ESTADOS\_PAGO\_PROGRAMADO  
14. PAGOS  
15. FORMAS\_PAGO  
16. ESTADOS\_PAGO  
17. EVIDENCIAS\_PAGO  
18. TIPOS\_EVIDENCIA\_PAGO  
19. HISTORIAL\_ESTADOS\_PAGO

**Cortes**

20. CORTES\_FINANCIEROS  
21. ESTADOS\_CORTE  
22. DETALLE\_CORTE

**Comisiones**

23. TIPOS\_ASESOR  
24. CONFIGURACION\_COMISIONES  
25. COMISIONES  
26. ESTADOS\_COMISION

**Prenómina**

27. PRENOMINA  
28. ESTADOS\_PRENOMINA  
29. DETALLE\_PRENOMINA  
    

**Total: 29 tablas.**

Y las tablas compartidas de Ruta quedarían fuera de tu diccionario, pero documentadas como dependencias externas:

H3GA RUTA

   │

   ├── CLIENTES

   ├── USUARIOS

   └── ROLES

      	│

      	▼

 	H3GA FINANZAS

 

**Tabla: tipos\_asesor**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK) | Identificador único del asesor. |
| **nombre** | VARCHAR(50) UNIQUE | Nombre del asesor |
| **descripcion** | TEXT, NULLABLE | Descripción opcional del asesor. |
| **activo** | BOOLEAN, DEFAULT true | Indica si actualmente está activo ese asesor. |

 

asesor\_id → FK hacia H3GA\_RUTA.USUARIOS.id

**Valores iniciales:**

·   	Referidor  
·   	Asesor Junior  
·   	Asesor Especializado

**Y eventualmente:**

·   	Asesor Cambaceo  
·   	Asesor Marketing

 

 

**Tabla: servicios** 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT (PK, autoincrement) | Identificador único del servicio. |
| **nombre** | TEXT, NOT NULL, UNIQUE | Nombre del servicio  |
| **descripcion** | TEXT, NULLABLE | Descripción opcional del servicio. |
| **activo** | BOOLEAN, DEFAULT true | Indica si actualmente se ofrece el servicio. |

Valores iniciales del catálogo:

·   	Modalidad 10\.  
·   	Modalidad 40\.  
·   	Modalidad 40 retroactiva.   
·   	APD

Algo que **sí debe reflejarse en el modelo**:

La empresa todavía no tiene costos fijos y quiere poder establecer manualmente el costo/monto de un servicio o incluso de un microservicio.

No pondría simplemente costo en SERVICIOS, porque un mismo servicio puede tener diferentes condiciones para diferentes contratos.

Por ejemplo:

Modalidad 10  
·          └── Cliente A → \$2,500 mensual  
·          └── Cliente B → \$3,000 mensual  
Por eso el monto particular debería estar en el **contrato o seguimiento**, no en el catálogo general.

 

 

**Tabla: contratos**

 

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK |  Identificador  |
| **cliente\_id** | UUID FK \-\> clientes.id | Cliente propietario del contrato.  |
| **servicio\_id** | SMALLINT FK \-\> servicios.id | Servicio contratado. |
| **asesor\_id** | FK → usuarios.id  | Asesor responsable. |
| **folio** | VARCHAR(50) | Folio del contrato según el servicio. |
| **fecha\_contrato** | DATE | Fecha de formalización. |
| **estado\_contrato\_id** | SMALLINT FK | Estado actual del contrato. |
| **cantidad\_pagos** | SMALLINT NULL | Número de pagos o mensualidades contratadas. |
| **observaciones** | TEXT | Notas adicionales. |
| **creado\_en**  | TIMESTAMPTZ | Fecha de creación. |

 

Se agrego cantidad\_pagos porque ahora ya quedó confirmado que **M10 y M40 pueden tener diferentes cantidades de mensualidades dependiendo del cliente**: 6, 12, 15, 36, etc. Por ejemplo:

Modalidad 40 → 12 mensualidades.

Entonces PAGOS\_PROGRAMADOS puede generar las 12 obligaciones.

Para M40 retroactiva, al ser un solo pago, sería cantidad\_pagos \= 1\.

 

Recomendación para folio al pasarlo a PostgreSQL:

**NO se pondría simplemente:** folio UNIQUE

porque podría haber:

M10202600695

202600695

sin problema, pero la regla real es que cada servicio maneja su propia numeración.

En PostgreSQL recomendaría: UNIQUE (servicio\_id, folio) así un mismo folio podría existir en servicios diferentes si la empresa así lo determina, pero no se puede duplicar dentro del mismo servicio.

**Tabla: estados\_contratos**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK | Identificador único |
| **Nombre** | VARCHAR(50) UNIQUE | Nombre del estado. |
| **descripcion** | TEXT, NULLABLE | Descripción. |
| **Orden** | SMALLINT | Orden lógico |

 

**Valores iniciales:**

·   	Activo  
·   	Finalizado  
·   	Cancelado

 

**Tabla: seguimiento\_m10**

Esta tabla almacena **el seguimiento financiero/operativo de Modalidad 10**, no el diagnóstico que ya administra Ruta.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK |  Identificador  |
| **contrato\_id** | UUID FK UNIQUE | Contrato de Modalidad 10\. |
| **fecha\_inicio\_tramite** | DATE | Inicio del trámite |
| **fecha\_tramite\_pago** | DATE NULL | Fecha relacionada con el trámite de pago. |
| **monto\_pago\_inscripción** | NUMERIC(12,2) NULL | Importe de inscripción. |
| **monto\_mensual** | NUMERIC(12,2) NULL | Importe mensual correspondiente. |
| **periodo\_contrato** | TEXT NULL | Periodo contratado. |
| **observaciones** | TEXT NULL | Observaciones del seguimiento. |

                                                                                        	

**Propósito:**

No sustituye las tablas PAGOS y PAGOS\_PROGRAMADOS.

Simplemente almacena los datos particulares de M10 que no son comunes a todos los servicios.

 

**Tabla: seguimiento\_m40**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK |  Identificador  |
| **contrato\_id** | UUID FK UNIQUE | Contrato de Modalidad 40\. |
| **fecha\_inicio** | DATE NULL | Inicio previsto o real. |
| **fecha\_fin** | DATE NULL | Fin previsto o real. |
| **salario\_diario** | NUMERIC(10,2) NULL | Salario diario de cotización. |
| **cantidad\_meses** | SMALLINT NULL | Cantidad de meses prevista. |
| **monto\_mensual** | NUMERIC(12,2) NULL | Importe mensual |
| **observaciones** | TEXT NULL | Observaciones. |

 

Los pagos mensuales reales se controlan mediante PAGOS\_PROGRAMADOS.

 

**Tabla: seguimiento\_m40\_retroactiva**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK |  Identificador  |
| **contrato\_id** | UUID FK UNIQUE | Contrato relacionado. |
| **fecha\_solicitud** | DATE NULL | Fecha solicitud. |
| **fecha\_inicio\_retroactivo** | DATE NULL | Inicio del periodo retroactivo. |
| **fecha\_fin\_retroactivo** | DATE NULL | Fin del periodo retroactivo. |
| **meses\_retroactivos** | SMALLINT NULL | Cantidad de meses. |
| **salario\_diario** | NUMERIC(10,2) NULL | Salario diario considerado. |
| **monto\_estimado** | NUMERIC(12,2) NULL | Monto estimado. |
| **monto\_confirmado** | NUMERIC(12,2) NULL | Monto confirmado. |
| **observaciones** | TEXT NULL | Observaciones. |

 

No duplicar aquí el análisis de conveniencia o diagnóstico que ya existe en RUTA. Ruta ya tiene entidades como analisis\_modalidad40\_retroactivo, escenarios y evaluación de conveniencia.

 

**Tabla: seguimiento\_apd**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK |  Identificador  |
| **contrato\_id** | UUID FK UNIQUE | Contrato APD relacionado. |
| **tipo\_venta\_id** | SMALLINT FK | Tipo de venta. |
| **modalidad\_apd\_id** | SMALLINT FK | Modalidad A o B. |
| **proveedor\_id** | SMALLINT FK NULL | Proveedor relacionado con alta y baja. |
| **fecha\_alta** | DATE NULL | Fecha de alta. |
| **fecha\_baja** | DATE NULL | Fecha de baja. |
| **fecha\_reingreso** | DATE NULL | Fecha de reingreso si aplica. |
| **fecha\_alta\_reingreso** | DATE NULL | Alta posterior al reingreso. |
| **fecha\_baja\_reingreso** | DATE NULL | Baja posterior al reingreso. |
| **fecha\_solicitud\_recursos** | DATE NULL | Fecha de solicitud de recursos. |
| **fecha\_reflejo\_recursos** | DATE NULL | Fecha en que se reflejan los recursos. |
| **monto\_recurso\_cliente** | NUMERIC(12,2) NULL | Cantidad recibida por el cliente. |
| **porcentaje\_cobro** | NUMERIC(5,2) NULL | Porcentaje acordado para el cobro. |
| **monto\_cobro\_esperado** | NUMERIC(12,2) NULL | Monto esperado que debe pagar el cliente. |
| **fecha\_cobro\_cliente** | DATE NULL | Fecha del cobro principal. |
| **observaciones** | TEXT NULL | Observaciones. |

 

Se quita tipo\_cobro\_id porque un mismo APD podría tener: cobro principal \+ penalización y una penalización puede dividirse en varios pagos. Por tanto, el tipo de cobro corresponde mejor a la obligación de pago.

 

**Tabla: tipos\_venta**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK | Identificador único de venta. |
| **nombre** | VARCHAR(50) UNIQUE | Nombre de tipo de venta.  |
| **descripcion** | TEXT NULL | Descripción de tipo de venta. |
| **activo** | BOOLEAN | Indica si actualmente está activo o disponible ese tipo de venta. |

**Valores iniciales:**

·       CAMBACEO  
·       MARKETING

 

**Tabla: modalidades\_apd**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK | Identificador único de modalidades. |
| **nombre** | VARCHAR(50) UNIQUE | Nombre de tipo de modalidad. |
| **descripcion** | TEXT NULL | Descripción de tipo de modalidad. |
| **activo** | BOOLEAN | Indica si actualmente está activo o disponible ese tipo de modalidad. |

 

**Valores:**

·       Modalidad A  
·       Modalidad B

 

**Tabla: tipos\_cobro**                                                          	

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK | Identificador de tipo de cobro. |
| **nombre** | VARCHAR(50) UNIQUE | Nombre de tipo de cobro. |
| **descripcion** | TEXT NULL | Descripción de tipo de cobro. |
| **activo** | BOOLEAN | Indica si actualmente está activo el cobro. |

 

**Valores:**

·       PAGO TOPADO  
·       PAGO NO TOPADO  
·       PENALIZACIÓN

Se relaciona con: PAGOS\_PROGRAMADOS.tipo\_cobro\_id

**por ahora las penalizaciones solamente aplican a APD**, aunque posteriormente podrían utilizarse para otros servicios.

 

**Tabla: proveedores**

El Excel tiene PROVEEDOR DE ALTA Y BAJA, por lo que la tabla puede existir.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **Id** | SMALLINT PK | Identificador del proveedor. |
| **nombre** | VARCHAR(100) UNIQUE | Nombre del proveedor. |
| **descripcion** | TEXT NULL | Descripción del proveedor. |
| **activo** | BOOLEAN | Disponibilidad. |

 

**Tabla: pagos**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Clave primaria del pago. |
| **contrato\_id** | UUID FK \-\> contratos.id | Contrato relacionado. |
| **pago\_programado\_id** | UUID FK NULL | Obligación de pago a la que corresponde. |
| **forma\_pago\_id** | SMALLINT FK | Forma utilizada. |
| **estado\_pago\_id** | SMALLINT FK | Estado actual. |
| **monto** | NUMERIC(12,2) | Cantidad realmente pagada a H3GA. |
| **fecha\_pago** | TIMESTAMPTZ | Fecha y hora del pago. |
| **registrado\_por** | UUID FK \-\>usuarios.id | Usuario que registró. |
| **fecha\_registro**  | TIMESTAMPTZ | Fecha y hora del registro. |
| **observaciones** | TEXT | Notas del movimiento. |
| **referencia\_pago** | VARCHAR(100) NULL | Una transferencia, depósito o movimiento puede tener una referencia bancaria. |

 

**Tabla: formas\_pago**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | **SMALLINT** | **Identificador.** |
| **nombre** | **VARCHAR(50)** | **Forma de pago** |
| **activo** | **BOOLEAN** | **Disponible actualmente** |

Ejemplo:

·       Efectivo  
·       Transferencia

 

**Tabla: estados\_pago**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT | Identificador del estado. |
| **nombre** | VARCHAR(50) | Nombre del estado. |
| **orden** | SMALLINT | Orden dentro del proceso. |

 

En lugar de dejar únicamente "pendiente, validado, rechazado", conviene representar el flujo de dos niveles.

| ID | Estado |
| :---- | :---- |
| 1 | Pendiente de revisión financiera |
| 2 | Rechazado |
| 3 | Pendiente de autorización |
| 4 | Validado |
| 5 | Cancelado |

 

Asesor registra àPendiente de revisión financieraàAdministrador FinancieroàPendiente de autorizaciónàSupervisión OperativaàValidado

 

**Tabla: pagos\_programados**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **contrato\_id** | UUID FK | Contrato relacionado. |
| **tipo\_cobro\_id** | SMALLINT FK NULL | Tipo de obligación, principalmente para APD. |
| **numero\_pago** | INTEGER, NOT NULL | Número consecutivo para pagos mensuales identifica la mensualidad correspondiente (1, 2, 3, etc.). |
| **fecha\_esperada** | DATE NULL | Fecha esperada. |
| **fecha\_vencimiento** | DATE NULL | Fecha límite. |
| **monto\_esperado** | NUMERIC(12,2) NULL | Monto esperado. |
| **periodo** | DATE NULL | Periodo correspondiente. |
| **estado\_id** | SMALLINT FK | pendiente, cubierto, vencido, cancelado. |

 

**monto\_esperado → NULLABLE**

Porque para APD puede desconocerse el importe hasta que el cliente reciba los recursos.

Numero\_pago: hará muchísimo más fácil mostrar en la aplicación: **3 de 12 mensualidades pagadas,** y para M40 retroactiva: numero\_pago \= 1 porque solamente existe una obligación.

Ejemplo:

| numero\_pago | periodo | monto | estado |
| :---- | :---- | :---- | :---- |
| 1 | Enero | \$3,000 | Cubierto |
| 2 | Febrero | \$3,000 | Cubierto |
| 3 | Marzo | \$3,000 | Pendiente |
| 4 | Abril | \$3,000 | Pendiente |

 

 

**Tabla: estados\_pago\_programado**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK, NOT NULL | Identificador único del estado de la obligación programada. |
| **nombre** | VARCHAR(30) NOT NULL, UNIQUE | Nombre del estado (Pendiente, Cubierto, Vencido, Cancelado). |
| **descripcion** | TEXT NULL | Explicación del significado operativo del estado. |

 

**Tabla: evidencias\_pago**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **pago\_id** | UUID FK \-\> pagos.id | Pago relacionado |
| **tipo\_evidencia\_id** | SMALLINT FK | Pagaré, comprobante, recibo, línea de captura, etc. |
| **archivo\_path** | TEXT | Ruta o identificador del archivo almacenado en DigitalOcean Spaces. |
| **nombre\_original** | TEXT | Nombre del archivo. |
| **tipo\_archivo**  | TEXT | Tipo del archivo. |
| **subido\_por** | UUID FK \-\>usuarios.id | Usuario responsable. |
| **fecha\_carga** | TIMESTAMPTZ | Momento de carga |
| **hash\_archivo** | VARCHAR(128) NULL | Para evitar que se vuelva a registrar accidentalmente la misma evidencia. |

 

Se agrega hash\_archivo para poder detectar:

“Este documento ya fue cargado anteriormente.”

Y evitar **que se vuelva a registrar accidentalmente la misma evidencia.**

 

**Tabla: tipos\_evidencia\_pago**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK, NOT NULL | Identificador único del tipo de evidencia. |
| **nombre** | VARCHAR(50) NOT NULL, UNIQUE | Nombre del tipo de evidencia digital (Pagaré, Recibo etc.). |
| **descripcion** | TEXT NULL | Explicación sobre qué documento o captura se espera adjuntar. |

 

**Tabla: historial\_estados\_pago**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador |
| **pago\_id** | UUID FK | Pago. |
| **estado\_anterior\_id** | SMALLINT FK | Estado previo. |
| **estado\_nuevo\_id** | SMALLINT FK | Nuevo estado. |
| **cambiado\_por** |  UUID FK \-\> usuarios.id | Usuario que realizó el cambio. |
| **fecha\_cambio** | TIMESTAMPTZ | Fecha y hora. |
| **comentario** | TEXT | Motivo u observación. |

 

**Tabla: cortes\_financieros**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **numero\_corte** | INTEGER UNIQUE | Numero de corte financiero. |
| **fecha\_inicio** | TIMESTAMPTZ | Inicio del periodo. |
| **fecha\_fin** | TIMESTAMPTZ | Fin del periodo. |
| **estado\_id** | SMALLINT FK | Abierto, Cerrado, Cancelado etc. |
| **creado\_por** | UUID FK | Usuario que genera el corte. |
| **creado\_en**  | TIMESTAMPTZ | Fecha de creación. |
| **cerrado\_por**  | UUID FK | Usuario que cierra. |
| **cerrado\_en** | TIMESTAMPTZ | Fecha de cierre. |

 

**Regla:**

Viernes 00:00 à Jueves 23:59:59

La empresa definió el corte semanal de viernes a jueves.

 

**Tabla: estados\_corte**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK, NOT NULL | Identificador único del estado del corte. |
| **nombre** | VARCHAR(20) NOT NULL, UNIQUE | Nombre del estado (Abierto, Cerrado, Cancelado). |
| **descripcion** | TEXT NULL | Detalle del comportamiento operativo del corte. |

 

**Tabla: detalle\_corte:**

Restricción importante que se debe agregar UNIQUE(corte\_id, pago\_id).

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Clave primaria. |
| **corte\_id** | UUID FK | Corte financiero. |
| **pago\_id** | UUID FK | Pago incluido. |
| **monto** | NUMERIC(12,2) | Monto considerado. |

 

Se usa la restricción para impedir que el mismo pago aparezca dos veces dentro del mismo corte.

Y dependiendo de cómo confirme la empresa la regla de negocio, podría ser conveniente impedir que un pago validado aparezca en dos cortes diferentes.

Eso último sí lo implementaría como regla de negocio, no necesariamente como UNIQUE(pago\_id), porque primero hay que confirmar cómo manejan correcciones y cortes cancelados.

 

**La relación sigue siendo:**

CORTES\_FINANCIEROS 1:N DETALLE\_CORTE

DETALLE\_CORTE N:1 PAGOS

 

**Tabla: comisiones**

Registra la comisión que realmente se generó.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **pago\_id** | UUID FK | Pago que genera la comisión. |
| **asesor\_id** | UUID FK | Asesor que recibe la comisión. |
| **porcentaje** | NUMERIC(5,2) | Porcentaje aplicado. |
| **monto\_base** | NUMERIC(12,2) | Cantidad utilizada para calcular. |
| **monto\_comision** | NUMERIC(12,2) | Comisión generada. |
| **estado\_id** | SMALLINT FK | Estado de la comisión. |
| **fecha\_calculo** | TIMESTAMPTZ | Momento del cálculo. |
| **observaciones** | TEXT | Notas. |

 

**Tabla: configuracion\_comisiones**

Define cómo se le pagará comisión a una persona.

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador único de la configuración. |
| **asesor\_id** | UUID, NOT NULL, FK → H3GA\_RUTA.USUARIOS.id | Usuario al que se asigna el porcentaje de comisión. |
| **tipo\_asesor\_id** | SMALLINT, NULLABLE, FK → TIPOS\_ASESOR.id | Tipo de asesor al que corresponde la configuración. |
| **porcentaje** | NUMERIC(5,2), NOT NULL | Porcentaje de comisión asignado al asesor. |
| **vigencia\_desde** | DATE, NOT NULL | Fecha a partir de la cual aplica el porcentaje. |
| **vigencia\_hasta** | DATE, NULLABLE | Fecha hasta la cual aplica el porcentaje. |
| **activo** | BOOLEAN, DEFAULT true | Indica si la configuración está actualmente activa. |

 

 

**Tabla: estados\_comisiones**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK, NOT NULL | Identificador único del estado de la comisión. |
| **nombre** | VARCHAR(30) NOT NULL, UNIQUE | Nombre del estado (Pendiente, Calculada, Incluida en prenómina, Ajustada, Cancelada). |
| **descripcion** | TEXT NULL | Detalle operativo de la fase en la que se encuentra la comisión. |

 

**Tabla: prenomina**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **corte\_id** | UUID FK | Corte financiero relacionado. |
| **estado\_id** | SMALLINT FK | Estado de la prenómina. |
| **creado\_por** | UUID FK | Usuario que lo generó. |
| **creado\_en** | TIMESTAMPTZ | Fecha de creación. |
| **total\_referencial** | NUMERIC(12,2) | Total calculado. |
| **observaciones** | TEXT | Observaciones o notas para la prenomina. |

 

**Se cambio:** total\_comisiones

**por:** total\_referencial

porque Finanzas prepara información para prenómina, pero no pretende convertirse en un sistema completo de nómina.

 

**Tabla: estados\_prenomina**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | SMALLINT PK, NOT NULL | Identificador único del estado de la prenómina. |
| **nombre** | VARCHAR(30) NOT NULL, UNIQUE | Nombre del estado (Borrador, Generada, Autorizada, Pagada, Cancelada). |
| **descripcion** | TEXT NULL | Detalle operativo sobre la etapa en la que se encuentra el reporte. |

 

**Tabla: detalle\_prenomina**

| Campo | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| **id** | UUID PK | Identificador. |
| **prenomina\_id** | UUID FK | Prenómina. |
| **asesor\_id** | UUID FK | Asesor. |
| **monto\_referencial** | NUMERIC(12,2) | Comisión. |
| **observaciones** | TEXT | Observaciones de detalle prenomina. |

Una prenómina puede agrupar muchas comisiones de un mismo asesor, las comisiones detalladas seguirán estando en COMISIONES.

**Próximos a cobro**

Debe ser una **vista**, no una tabla:

El análisis identificó que esta información se puede obtener mediante consulta.

**Dashboard**

No necesita tabla.

Es información calculada a partir de:

·       PAGOS  
·       CONTRATOS  
·       PAGOS\_PROGRAMADOS  
·       CORTES  
·       COMISIONES

**Días transcurridos**

No necesita campo almacenado.

**Mes y año**

No necesitas:

·       mes\_pago  
·       año\_pago  
·       mes\_tramite  
·       año\_tramite

se obtienen de las fechas.

### **1\. Conexión del tipo de asesor a usuarios**

El tipo de asesor define principalmente la estructura de comisiones y cobranza. La conexión hacia la tabla usuarios se realiza mediante la tabla intermedia configuracion\_comisiones:

* tipos\_asesor $\rightarrow$ tiene los tipos de asesores (ej. *Referidor, Asesor Junior, Asesor Especializado*).  
* configuracion\_comisiones $\rightarrow$ actúa como tabla puente y contiene:  
  * asesor\_id (FK $\rightarrow$ usuarios.id): Identifica al usuario que actúa como asesor.  
  * tipo\_asesor\_id (FK $\rightarrow$ tipos\_asesor.id): Asigna la clasificación del tipo de asesor.  
  * porcentaje, vigencia\_desde, vigencia\_hasta y activo: Definen el porcentaje de comisión que le corresponde a ese usuario bajo ese tipo de asesor en un rango de tiempo específico.

### **2\. Conexiones generales del Asesor (Tabla usuarios)**

Un usuario con rol de Asesor se conecta con el resto del modelo mediante los siguientes puntos clave:

#### A. Vínculo por Rol

* roles: Un registro en usuarios se clasifica mediante rol\_id (FK $\rightarrow$ roles.id), identificando si es Asesor, Auxiliar Administrativo o Supervisor Operativo.

#### B. Vínculo Operativo / Clientes (Atención y Asignación)

* clientes: La columna clientes.asesor\_id (FK $\rightarrow$ usuarios.id) indica qué asesor está asignado a un cliente específico.  
* contratos: La columna contratos.asesor\_id (FK $\rightarrow$ usuarios.id) especifica el asesor responsable de formalizar el servicio o contrato del cliente.  
* diagnostico\_especializado: La columna diagnostico\_especializado.asesor\_id (FK $\rightarrow$ usuarios.id) guarda al asesor que emitió el dictamen técnico.  
* eventos\_agenda: La columna eventos\_agenda.asesor\_id (FK $\rightarrow$ usuarios.id) relaciona las citas programadas.

#### C. Vínculo Financiero (Comisiones y Prenómina)

* comisiones: Contiene asesor\_id (FK $\rightarrow$ usuarios.id) para registrar cada monto generado a favor del asesor por los pagos cobrados.  
* detalle\_prenomina: Contiene asesor\_id (FK $\rightarrow$ usuarios.id) para agrupar y liquidar el acumulado de comisiones por corte financiero.

#### **D. Vínculo de Auditoría y Trazabilidad**

* pagos, evidencias\_pago, historial\_estados\_pago, avisos, etapas\_tramite\_historial: Utilizan claves foráneas apuntando a usuarios.id (como registrado\_por, subido\_por, cambiado\_por, atendido\_por) para registrar las acciones realizadas por cada usuario dentro del sistema.

	
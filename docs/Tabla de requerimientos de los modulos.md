**Descripción de los requerimientos funcionales.** Los requerimientos funcionales se relacionaron con las actividades operativas de H3GA, particularmente con el registro de clientes, la administración de expedientes, el seguimiento de modalidades previsionales y el control de actividades. Su identificación permitió establecer las operaciones que debían estar disponibles para los diferentes perfiles de usuario.

Para facilitar su documentación, los requerimientos funcionales se organizaron mediante identificadores individuales y descripciones que permiten reconocer las funciones previstas para cada módulo del sistema. Como se muestra en las **Tablas 1 a 10**, esta clasificación permite identificar las funcionalidades correspondientes a cada módulo y facilita su consulta y seguimiento durante el desarrollo del proyecto.

**Tabla de requerimientos del Módulo de Autenticación**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-01** | El sistema debe permitir el inicio de sesión mediante credenciales de usuario. |
| **RF-02** | El sistema debe otorgar el acceso a las funciones según el rol del usuario autenticado (asesor, auxiliar administrativo, supervisión operativa). |

Tabla 1 Requerimientos funcionales del módulo de autenticación. Fuente: Elaboración propia

**Tabla de requerimientos del Módulo de Gestión Documental**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-03** | El sistema debe permitir almacenar, cargar y consultar los documentos personales de cada cliente, tales como CURP, acta de nacimiento, INE, comprobante de domicilio, RFC, manteniéndolos vinculados a su expediente digital. |
| **RF-04** | El sistema debe permitir almacenar y visualizar los documentos generados por el asesor durante el proceso de atención, asociándolos al expediente digital del cliente correspondiente. |
| **RF-05** | El sistema debe permitir consultar la información general de cada cliente, identificar a su asesor asignado y acceder a los documentos asociados a su expediente, de acuerdo con los permisos del usuario. |
| **RF-06** | El sistema debe permitir actualizar o sustituir los documentos almacenados en el expediente digital de un cliente cuando sea necesario, manteniendo la asociación con el cliente correspondiente. |
| **RF-07** | El sistema debe permitir validar la documentación incorporada al expediente digital de cada cliente, identificando si los documentos requeridos se encuentran completos, pendientes o requieren corrección, de acuerdo con los criterios establecidos para el trámite correspondiente. |

Tabla 2 Requerimientos funcionales del módulo de gestión documental. Fuente: Elaboración propia

**Tabla de requerimientos del Módulo de Administración de Formatos Institucionales**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-08** | El sistema debe permitir capturar el nombre y link de referencia de un formato institucional. |
| **RF-9** | El sistema debe permitir cargar archivos en formato .doc o .pdf asociados a un formato institucional. |
| **RF-10** | El sistema debe permitir consultar el listado de formatos institucionales registrados. |
| **RF-11** | El sistema debe permitir actualizar un formato institucional previamente registrado. |
| **RF-12** | El sistema debe permitir eliminar un formato institucional registrado. |

Tabla 3 Requerimientos funcionales del módulo de administración de formatos institucionales. Fuente: Elaboración propia.

**Tabla de requerimientos del Módulo de Biblioteca de Recursos**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-13** | El sistema debe permitir consultar el catálogo de formatos externos de dependencias gubernamentales cargados por Supervisión operativa. |
| **RF-14** | El sistema debe permitir descargar directamente los archivos del catálogo en formato .doc o .pdf. |

Tabla 4 Requerimientos funcionales del módulo de biblioteca de recursos. Fuente: Elaboración propia.

**Tabla de requerimientos del Módulo de Dashboard Operativo**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-15** | El sistema debe mostrar en el dashboard operativo las fechas próximas de actividades y trámites pendientes de los clientes, presentando la información de forma diferenciada según el rol del usuario autenticado. |
| **RF-16** | El sistema debe mostrar la etapa actual de cada cliente y el estado de avance de sus procesos previsionales, permitiendo identificar los trámites en seguimiento. |

Tabla 5 Requerimientos funcionales del módulo de dashboard operativo. Fuente: Elaboración propia.

**Tabla de requerimientos del Módulo de Modalidades de Pensión**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-17** | El sistema debe permitir registrar la modalidad de pensión aplicable al cliente (modalidad 40, modalidad 40 retroactiva, modalidad 10). |
| **RF-18** | El sistema debe permitir estructurar y consultar las etapas seleccionadas para la ejecución de la modalidad correspondiente. |

Tabla 6 Requerimientos funcionales del módulo de modalidades. Fuente: Elaboración propia.

**Tabla de requerimientos del Módulo de Proceso Final**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-19** | El sistema debe permitir al asesor registrar y actualizar el avance de las etapas correspondientes a los trámites ante instituciones de seguridad social, mediante la modificación de su estado, porcentaje de progreso, acciones pendientes y fechas de compromiso. |
| **RF-20** | El sistema debe permitir al asesor registrar y consultar la información correspondiente al ingreso formal de la solicitud de pensión, incluyendo los datos institucionales, fechas y documentos asociados al trámite. |
| **RF-21** | El sistema debe permitir al asesor registrar y dar seguimiento a los diferentes escenarios de resolución del trámite de pensión. |
| **RF-22** | El sistema debe permitir al asesor consultar la información de cobranza final asociada al cierre del proceso de pensión, mediante los registros disponibles en el sistema. |
| **RF-23** | El sistema debe permitir al asesor visualizar un listado de sus clientes que cuenten con etapas activas o registradas del Proceso Final, mostrando información general y el estado de seguimiento correspondiente. |
| **RF-24** | El sistema debe permitir al asesor consultar el detalle del Proceso Final de cada cliente, presentando de manera independiente las etapas que le correspondan y su información de seguimiento. |
| **RF-25** | El sistema debe permitir al asesor consultar el estado y porcentaje de avance de cada etapa del Proceso Final, conforme a las reglas de seguimiento establecidas. |
| **RF-26** | El sistema debe permitir al asesor registrar y actualizar las acciones pendientes y fechas compromiso de cada etapa, con la finalidad de facilitar la organización y continuidad del seguimiento de los trámites. |
| **RF-27** | El sistema debe permitir al asesor consultar los documentos asociados a cada etapa del Proceso Final, facilitando su identificación y acceso mediante la integración con el expediente documental del cliente. |
| **RF-28** | El sistema debe permitir al asesor buscar y filtrar clientes de acuerdo con su información general, las etapas aplicables y el estado de sus trámites, con la finalidad de agilizar su localización y seguimiento. |
| **RF-29** | El sistema debe permitir al asesor visualizar indicadores generales del Proceso Final, incluyendo la cantidad de etapas en proceso, finalizadas, restringidas y con acciones vencidas, así como los clientes que tengan compromisos programados. |
| **RF-30** | El sistema debe permitir al asesor consultar los compromisos próximos y vencidos de las etapas correspondientes a sus clientes, considerando las fechas registradas durante el seguimiento de cada trámite. |
| **RF-31** | El sistema debe permitir al asesor consultar y actualizar la información institucional asociada a las etapas del Proceso Final, incluyendo folios, fechas de solicitud, resoluciones y observaciones, según corresponda al trámite. |
| **RF-32** | El sistema debe permitir al asesor consultar el progreso general del Proceso Final de cada cliente, considerando únicamente las etapas que le correspondan y los avances registrados en cada una de ellas. |

Tabla 7 Requerimientos funcionales del módulo de proceso final. Fuente: Elaboración propia.

**Tabla de requerimientos del Módulo de Servicios Complementarios**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-33** | El sistema debe permitir registrar una solicitud de servicio complementario asociada a un cliente, independiente de su estrategia de pensión principal. |
| **RF-34** | El sistema debe permitir consultar el catálogo de servicios complementarios (Mejoravit, Apoyo por Desempleo, préstamos a pensionados y Plan Privado de Retiro) y seleccionar el servicio que el cliente requiere. |
| **RF-35** | El sistema debe permitir registrar un servicio distinto o menos común, capturando su nombre y una descripción libre. |
| **RF-36** | El sistema debe mostrar el formulario propio del servicio seleccionado, de modo que el asesor capture únicamente la información que ese servicio requiere. |
| **RF-37** | El sistema debe permitir consultar el seguimiento detallado de cada servicio complementario solicitado. |
| **RF-38** | El sistema debe permitir actualizar los datos de una solicitud de servicio complementario registrada. |
| **RF-39** | El sistema debe permitir eliminar una solicitud de servicio complementario registrada. |
| **RF-40** | El sistema debe mostrar la lista de requisitos específicos que el cliente debe cumplir para cada servicio complementario. |
| **RF-41** | El sistema debe permitir al asesor revisar de forma estructurada los criterios ya cubiertos y los pendientes de cada servicio. |
| **RF-42** | El sistema debe emitir un desglose detallado de la documentación o información que el cliente requiere para autorizar su solicitud. |
| **RF-43** | El sistema debe vincular automáticamente los archivos generados durante la gestión de un servicio complementario al expediente digital del cliente. |
| **RF-44** | El sistema debe permitir exportar en PDF los datos capturados de un servicio complementario. |
| **RF-45** | El sistema debe permitir exportar en Word los datos capturados de un servicio complementario. |
| **RF-46** | El sistema debe permitir actualizar el avance operativo de cada servicio complementario mediante un flujo de seguimiento independiente. |

Tabla 8 Requerimientos funcionales del módulo de servicios complementarios. Fuente: Elaboración propia.

**Tabla de requerimientos de la Migración y Consolidación de Datos**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-47** | El sistema debe permitir consolidar la información de clientes previamente almacenada en archivos de Excel hacia la base de datos del sistema. |
| **RF-48** | El proceso de migración debe permitir extraer y transformar la información de los archivos de Excel mediante un servicio desarrollado con NestJS y SheetJS, adaptando los datos a la estructura requerida por la base de datos PostgreSQL. |

Tabla 9 Requerimientos funcionales de migración y consolidación de información. Fuente: Elaboración propia.

**Tabla de requerimientos del módulo de Gestión de Auxiliares**

| Código | Descripción del Requisito Funcional |
| :---: | :---- |
| **RF-49** | El sistema debe permitir al asesor asignar y autorizar auxiliares administrativos a los clientes bajo su responsabilidad. |
| **RF-50** | El sistema debe permitir consultar las asignaciones de auxiliares administrativos por cliente, identificando cuáles se encuentran activas. |
| **RF-51** | El sistema debe permitir al asesor crear tareas dirigidas a un auxiliar administrativo asignado al cliente, especificando el título y las instrucciones correspondientes. |
| **RF-52** | El sistema debe permitir al auxiliar administrativo consultar las tareas que le han sido asignadas, identificando el cliente relacionado, las instrucciones y el estado de cada tarea. |
| **RF-53** | El sistema debe permitir al auxiliar elaborar y cargar documentos solicitados por el asesor, vinculándolos con el cliente y la tarea correspondiente. |
| **RF-54** | El sistema debe permitir al auxiliar descargar, editar y actualizar los archivos oficiales y técnicos relacionados con la gestión documental de los clientes, respetando sus permisos. |
| **RF-55** | El sistema debe permitir al asesor consultar los documentos enviados por el auxiliar y realizar su revisión. |
| **RF-56** | El sistema debe permitir al asesor aprobar un documento o marcarlo como no validado, registrando observaciones cuando requiera correcciones. |
| **RF-57** | El sistema debe permitir al auxiliar atender las observaciones del asesor mediante la carga de nuevas versiones del documento, conservando las versiones anteriores para mantener el historial de revisión. |
| **RF-58** | El sistema debe permitir al asesor consultar el estado de revisión de los documentos enviados por el auxiliar, identificando aquellos pendientes, no validados, validados o cancelados. |
| **RF-59** | El sistema debe permitir al auxiliar eliminar únicamente los archivos que haya generado, respetando las restricciones de propiedad y conservación documental. |
| **RF-60** | El sistema debe permitir actualizar el estado de las tareas asignadas, identificando aquellas pendientes, completadas o canceladas. |

Tabla 10 Requerimientos funcionales de gestión de auxiliares. Fuente: Elaboración propia

**2\. Requerimientos complementarios del módulo de modalidades**

| Código | Descripción del requerimiento funcional |
| ----- | ----- |
| **RF-61** | El sistema debe permitir al asesor visualizar un listado de sus clientes que tengan modalidades de pensión registradas, mostrando información general, modalidades aplicables y estados de seguimiento. |
| **RF-62** | El sistema debe permitir al asesor consultar el detalle de las modalidades de cada cliente, presentando de manera independiente su información, fases y estados. |
| **RF-63** | El sistema debe validar que cada cliente tenga una o dos modalidades como máximo, permitiendo únicamente M10, M40 o M40R de forma individual, o las combinaciones M40 \+ M40R y M10 \+ M40R. |
| **RF-64** | El sistema debe permitir al asesor consultar y actualizar las fases y estados de cada modalidad seleccionada, manteniendo su seguimiento independiente. |
| **RF-65** | El sistema debe permitir consultar los datos provenientes del diagnóstico especializado para mostrarlos automáticamente en los formularios de Modalidad 10, Modalidad 40 y Modalidad 40 retroactiva. |
| **RF-66** | El sistema debe permitir registrar y actualizar los datos específicos de seguimiento de cada modalidad, de acuerdo con los campos y validaciones disponibles en el modelo de datos. |
| **RF-67** | El sistema debe permitir al asesor consultar las citas y compromisos relacionados con sus clientes mediante una sección de agenda, identificando fechas y modalidades correspondientes cuando aplique. |
| **RF-68** | El sistema debe permitir identificar citas y compromisos próximos o vencidos, proporcionando la información necesaria para mostrar alertas de seguimiento. |
| **RF-69** | El sistema debe permitir consultar los documentos asociados a cada modalidad mediante la relación entre `clientes`, `etapas_tramite` y `documentos_clientes`. |
| **RF-70** | El sistema debe permitir al asesor subir documentos durante el seguimiento de una modalidad, vinculándolos al expediente del cliente y a la etapa correspondiente, reutilizando el almacenamiento documental existente. |
| **RF-71** | El sistema debe permitir buscar y filtrar clientes por nombre, modalidad seleccionada, estado de seguimiento y fechas relevantes. |
| **RF-72** | El sistema debe permitir consultar indicadores generales de las modalidades, incluyendo clientes por modalidad, estados, citas y compromisos próximos o vencidos. |
| **RF-73** | El sistema debe permitir al asesor visualizar y descargar los archivos asociados a las modalidades de sus propios clientes. |
| **RF-74** | El sistema debe permitir actualizar la información de un documento o sustituirlo por un nuevo archivo, manteniendo su asociación con el cliente y la modalidad correspondiente. |
| **RF-75** | El sistema debe permitir al asesor eliminar documentos autorizados de las modalidades de sus clientes, respetando las restricciones de propiedad, integridad y conservación documental. |

Descripción de los requerimientos no funcionales. Los requerimientos no funcionales se enfocaron en establecer las condiciones técnicas y de calidad necesarias para el funcionamiento de RUTA H3GA. Entre los aspectos considerados se encuentran la seguridad de la información, la disponibilidad del sistema, el rendimiento de las operaciones y la facilidad de uso de las interfaces.

Estas características resultan relevantes debido a que la plataforma está destinada a administrar información personal y documentos relacionados con los procesos previsionales de los clientes. Por ello, se contempló la necesidad de incorporar mecanismos de control de acceso, mantener la integridad de los registros y proporcionar una experiencia de uso adecuada para los perfiles operativos de la empresa.

En la **Tabla 11** se presentan los requerimientos no funcionales, organizados de acuerdo con las condiciones técnicas consideradas para el desarrollo del sistema.

| Código | Descripción de la Funcionalidad |
| :---: | :---- |
| **RNF-01** | Rendimiento: El sistema debe mostrar tiempos de respuesta no mayores a 3 segundos en operaciones de consulta (listado de clientes, documentos, calendario), y no mayores a 5 segundos en operaciones que impliquen generación de reportes en PDF. |
| **RNF-02** | Escalabilidad: El sistema debe estar diseñado para soportar el crecimiento en el número de clientes más allá de los 100 actuales, así como el incremento en la cantidad de usuarios del equipo (asesores, auxiliares administrativos, supervisor operativo), aprovechando la infraestructura escalable de Digital Ocean para el manejo de la base de datos y el almacenamiento de documentos, sin afectar el rendimiento del sistema. |
| **RNF-03** | Usabilidad: deberá contar con una interfaz intuitiva, clara y consistente que permita a los usuarios con roles de asesor, auxiliar administrativo y supervisor operativo realizar las tareas de registro, consulta y actualización de información de clientes, de acuerdo con sus permisos. |
| **RNF-04** | Trazabilidad: El sistema debe garantizar trazabilidad sobre las acciones relevantes realizadas por los usuarios (cambios de etapa y edición de documentos), permitiendo identificar quién las ejecuta y en qué momento, con el fin de mantener control y responsabilidad sobre la información gestionada. |
| **RNF-05** | Disponibilidad de documentos: El sistema deberá garantizar el almacenamiento centralizado de los documentos personales de los clientes y de los archivos generados por los asesores, manteniéndolos vinculados a sus respectivos expedientes digitales y disponibles para los usuarios autorizados durante el seguimiento de los trámites. Asimismo, deberá contemplar mecanismos de respaldo periódico de la información almacenada en PostgreSQL y DigitalOcean Spaces. |

Tabla 11 Requerimientos no funcionales. Fuente: Elaboración propia


# Requerimientos funcionales y no funcionales — transcripción de IS_26

**Fuente exclusiva:** `IS_26_CHAN_MARTIN_LUIS_GAEL_DESARROLLO_SISTEMA_GESTION.pdf`, sección de requerimientos, páginas impresas 41–48. Texto extraído del PDF, con saltos de línea originales; verificar visualmente las tablas si una fila queda partida.

**Fidelidad:** se conservan los códigos tal como aparecen, incluido `RF-9` (sin cero). No se incorporan RF propuestos en conversaciones previas ni se renombran requisitos. La matriz de roles de IS_26 se encuentra en las páginas 49–50.

```text
Tabla de requerimientos del Módulo de Autenticación

   Código         Descripción del Requisito Funcional


    RF-01         El sistema debe permitir el inicio de sesión mediante credenciales de
                  usuario.


    RF-02         El sistema debe otorgar el acceso a las funciones según el rol del usuario
                  autenticado (asesor, auxiliar administrativo, supervisión operativa).

Tabla 1 Requerimientos funcionales del módulo de autenticación. Fuente: Elaboración propia

Tabla de requerimientos del Módulo de Gestión Documental

   Código         Descripción del Requisito Funcional


    RF-03         El sistema debe permitir almacenar, cargar y consultar los documentos
                  personales de cada cliente, tales como CURP, acta de nacimiento, INE,
                  comprobante de domicilio, RFC, manteniéndolos vinculados a su
                  expediente digital.


    RF-04         El sistema debe permitir almacenar y visualizar los documentos
                  generados por el asesor durante el proceso de atención, asociándolos al
                  expediente digital del cliente correspondiente.


    RF-05         El sistema debe permitir consultar la información general de cada cliente,
                  identificar a su asesor asignado y acceder a los documentos asociados
                  a su expediente, de acuerdo con los permisos del usuario.
    RF-06         El sistema debe permitir actualizar o sustituir los documentos
                  almacenados en el expediente digital de un cliente cuando sea necesario,
                  manteniendo la asociación con el cliente correspondiente.


    RF-07         El sistema debe permitir validar la documentación incorporada al
                  expediente digital de cada cliente, identificando si los documentos
                  requeridos se encuentran completos, pendientes o requieren corrección,
                  de acuerdo con los criterios establecidos para el trámite correspondiente.

Tabla 2 Requerimientos funcionales del módulo de gestión documental. Fuente: Elaboración propia

Tabla de requerimientos del Módulo de Administración de Formatos
Institucionales

   Código         Descripción del Requisito Funcional


    RF-08         El sistema debe permitir capturar el nombre y link de referencia de un
                  formato institucional.


     RF-9         El sistema debe permitir cargar archivos en formato .doc o .pdf asociados
                  a un formato institucional.


    RF-10         El sistema debe permitir consultar el listado de formatos institucionales
                  registrados.


    RF-11         El sistema debe permitir actualizar un formato institucional previamente
                  registrado.


    RF-12         El sistema debe permitir eliminar un formato institucional registrado.

Tabla 3 Requerimientos funcionales del módulo de administración de formatos institucionales. Fuente:
Elaboración propia.

Tabla de requerimientos del Módulo de Biblioteca de Recursos
   Código          Descripción del Requisito Funcional


    RF-13          El sistema debe permitir consultar el catálogo de formatos externos de
                   dependencias gubernamentales cargados por Supervisión operativa.


    RF-14          El sistema debe permitir descargar directamente los archivos del
                   catálogo en formato .doc o .pdf.

Tabla 4 Requerimientos funcionales del módulo de biblioteca de recursos. Fuente: Elaboración propia.

Tabla de requerimientos del Módulo de Dashboard Operativo

   Código          Descripción del Requisito Funcional


    RF-15          El sistema debe mostrar en el dashboard operativo las fechas próximas
                   de actividades y trámites pendientes de los clientes, presentando la
                   información de forma diferenciada según el rol del usuario autenticado.


    RF-16          El sistema debe mostrar la etapa actual de cada cliente y el estado de
                   avance de sus procesos previsionales, permitiendo identificar los
                   trámites en seguimiento.

Tabla 5 Requerimientos funcionales del módulo de dashboard operativo. Fuente: Elaboración propia.

Tabla de requerimientos del Módulo de Modalidades de Pensión

   Código          Descripción del Requisito Funcional


    RF-17          El sistema debe permitir registrar la modalidad de pensión aplicable al
                   cliente (modalidad 40, modalidad 40 retroactiva, modalidad 10).


    RF-18          El sistema debe permitir estructurar y consultar las etapas seleccionadas
                   para la ejecución de la modalidad correspondiente.

Tabla 6 Requerimientos funcionales del módulo de modalidades. Fuente: Elaboración propia.

Tabla de requerimientos del Módulo de Proceso Final y Cobranza
   Código          Descripción del Requisito Funcional


    RF-19          El sistema debe permitir registrar el avance de los trámites ante
                   instituciones de seguridad social (IMSS-ISSSTE).


    RF-20          El sistema debe permitir registrar la unificación y manejo de cuentas de
                   AFORE.


    RF-21          El sistema debe permitir registrar el ingreso formal de la solicitud de
                   pensión.


    RF-22          El sistema debe permitir registrar escenarios de resolución (resolución
                   negativa, recuperación de recursos, seguimiento de proceso legal).


    RF-23          El sistema debe permitir registrar y controlar la cobranza final asociada
                   al cierre del proceso.

Tabla 7 Requerimientos funcionales del módulo de proceso final. Fuente: Elaboración propia.

Tabla de requerimientos del Módulo de Servicios Complementarios

   Código          Descripción del Requisito Funcional


    RF-24          El sistema debe permitir registrar una solicitud de servicio
                   complementario asociada a un cliente, independiente de su estrategia de
                   pensión principal.


    RF-25          El sistema debe permitir consultar el catálogo de servicios
                   complementarios (Mejoravit, Apoyo por Desempleo, préstamos a
                   pensionados y Plan Privado de Retiro) y seleccionar el servicio que el
                   cliente requiere.
RF-26   El sistema debe permitir registrar un servicio distinto o menos común,
        capturando su nombre y una descripción libre.


RF-27   El sistema debe mostrar el formulario propio del servicio seleccionado,
        de modo que el asesor capture únicamente la información que ese
        servicio requiere.


RF-28   El sistema debe permitir consultar el seguimiento detallado de cada
        servicio complementario solicitado.


RF-29   El sistema debe permitir actualizar los datos de una solicitud de servicio
        complementario registrada.


RF-30   El sistema debe permitir         eliminar   una   solicitud   de   servicio
        complementario registrada.


RF-31   El sistema debe mostrar la lista de requisitos específicos que el cliente
        debe cumplir para cada servicio complementario.


RF-32   El sistema debe permitir al asesor revisar de forma estructurada los
        criterios ya cubiertos y los pendientes de cada servicio.


RF-33   El sistema debe emitir un desglose detallado de la documentación o
        información que el cliente requiere para autorizar su solicitud.


RF-34   El sistema debe vincular automáticamente los archivos generados
        durante la gestión de un servicio complementario al expediente digital del
        cliente.


RF-35   El sistema debe permitir exportar en PDF los datos capturados de un
        servicio complementario.
    RF-36         El sistema debe permitir exportar en Word los datos capturados de un
                  servicio complementario.


    RF-37         El sistema debe permitir actualizar el avance operativo de cada servicio
                  complementario mediante un flujo de seguimiento independiente.

Tabla 8 Requerimientos funcionales del módulo de servicios complementarios. Fuente: Elaboración propia.

Tabla de requerimientos de la Migración y Consolidación de Datos

   Código         Descripción del Requisito Funcional


    RF-38         El sistema debe permitir consolidar la información de clientes
                  previamente almacenada en archivos de Excel hacia la base de datos del
                  sistema.


    RF-39         El proceso de migración debe permitir extraer y transformar la
                  información de los archivos de Excel mediante un servicio desarrollado
                  con NestJS y SheetJS, adaptando los datos a la estructura requerida por
                  la base de datos PostgreSQL.

Tabla 9 Requerimientos funcionales de migración y consolidación de información. Fuente: Elaboración propia.

Descripción de los requerimientos no funcionales. Los requerimientos no
funcionales se enfocaron en establecer las condiciones técnicas y de calidad
necesarias para el funcionamiento de GESTIÓN H3GA. Entre los aspectos
considerados se encuentran la seguridad de la información, la disponibilidad del
sistema, el rendimiento de las operaciones y la facilidad de uso de las interfaces.

Estas características resultan relevantes debido a que la plataforma está destinada
a administrar información personal y documentos relacionados con los procesos
previsionales de los clientes. Por ello, se contempló la necesidad de incorporar
mecanismos de control de acceso, mantener la integridad de los registros y
proporcionar una experiencia de uso adecuada para los perfiles operativos de la
empresa.

En la Tabla 2 se presentan los requerimientos no funcionales, organizados de
acuerdo con las condiciones técnicas consideradas para el desarrollo del sistema.
      Código           Descripción de la Funcionalidad

      RNF-01           Rendimiento: El sistema debe mostrar tiempos de respuesta no
                       mayores a 3 segundos en operaciones de consulta (listado de clientes,
                       documentos, calendario), y no mayores a 5 segundos en operaciones
                       que impliquen generación de reportes en PDF.

      RNF-02           Escalabilidad: El sistema debe estar diseñado para soportar el
                       crecimiento en el número de clientes más allá de los 100 actuales, así
                       como el incremento en la cantidad de usuarios del equipo (asesores,
                       auxiliares administrativos, supervisor operativo), aprovechando la
                       infraestructura escalable de Digital Ocean para el manejo de la base
                       de datos y el almacenamiento de documentos, sin afectar el
                       rendimiento del sistema.

      RNF-03           Usabilidad: deberá contar con una interfaz intuitiva, clara y consistente
                       que permita a los usuarios con roles de asesor, auxiliar administrativo
                       y supervisor operativo realizar las tareas de registro, consulta y
                       actualización de información de clientes, de acuerdo con sus
                       permisos.

      RNF-04           Trazabilidad: El sistema debe garantizar trazabilidad sobre las
                       acciones relevantes realizadas por los usuarios (cambios de etapa y
                       edición de documentos), permitiendo identificar quién las ejecuta y en
                       qué momento, con el fin de mantener control y responsabilidad sobre
                       la información gestionada.

      RNF-05           Disponibilidad de documentos: El sistema deberá garantizar el
                       almacenamiento centralizado de los documentos personales de los
                       clientes y de los archivos generados por los asesores, manteniéndolos
                       vinculados a sus respectivos expedientes digitales y disponibles para
                       los usuarios autorizados durante el seguimiento de los trámites.
                       Asimismo, deberá contemplar mecanismos de respaldo periódico de
                       la información almacenada en PostgreSQL y DigitalOcean Spaces.
Tabla 10 Requerimientos no funcionales. Fuente: Elaboración propia
```

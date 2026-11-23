# Inventario de interfaces H3GA

> Documento de control; no certifica implementación. Actualizar con evidencia del árbol real, capturas y componentes.

## Módulos y referencias encontradas
| Módulo | Rol diseño | Referencias identificadas | Interfaces |
|---|---|---|---|
| Autenticación | Compartido | `autenticacion/` | Login; recuperación/verificación/cambio de contraseña |
| Gestión auxiliar | Asesor | `gestion-auxiliar/` | Página, clientes asignados, tareas, documentos enviados y modales |
| Modalidades | Asesor | `modalidades/` | Página clientes, detalle, secciones M10/M40/M40R y modal documento |
| Proceso Final | Asesor | `proceso-final/` | Página clientes, detalle, preparación expediente, resolución, seguimiento/alertas |
| Servicios complementarios | Asesor | `servicios-complementarios/` | Página clientes, detalle, seguimiento y modales |
| Expediente cliente | Asesor desde «Ver expediente» | `expediente-cliente/` | Página principal y subir documento |
| Biblioteca | Compartido según permisos | `biblioteca/` | Página principal y estado sin datos |
| Gestión Documental | Auxiliar | `gestion-documental/` | Página clientes, detalle, subir/editar documento |
| Formatos institucionales | Supervisor | `formatos-institucionales/` | Página, estado sin datos, alta/edición/visualización |
| Dashboard | Compartido | No se localizó carpeta Figma en revisión inicial | Pendiente referencia/decisión |

Los nombres son agrupaciones de imágenes encontradas, no prueba de rutas o funcionalidad. Releer el árbol actual y registrar cada archivo exacto.

## Datos obligatorios por interfaz
| Campo | Contenido |
|---|---|
| ID | Identificador estable |
| Módulo/interfaz | Vista, sección, formulario/modal/estado |
| Referencia | Ruta exacta o «sin Figma» |
| RF | Códigos oficiales |
| Rol | Rol de diseño y permiso real por verificar |
| Ruta Nuxt | Existente/propuesta |
| Archivos | Página y componentes |
| Reutilización | Componentes/composables/stores |
| Formulario | Campos y validaciones conocidas |
| Modal | Disparador, cierre, acción |
| Estados | Carga, vacío, error, permiso, éxito, confirmación |
| Acciones | Control, comportamiento, API existente |
| Responsive | 1920/1440/1024/400 |
| Estado | No analizado/pendiente/en curso/implementado/revisado/bloqueado |
| Evidencia | Captura, archivo, prueba, contrato |

## Estados
No analizado; Pendiente; En curso; Implementado; Revisado; Bloqueado. Integración: Existente sin verificar; Verificado; Pendiente backend; No aplica. No marcar revisado por mera existencia de página/componente.

## Cobertura
Mapear RF-01 a RF-75 en `matriz-implementacion.md`. Para RF sin interfaz, explicar si corresponde a proceso backend o no requiere UI. No crear pantalla solo para forzar cobertura.

## Actualización
Al cerrar módulo: actualizar rutas/archivos, formularios, modales, estados, acciones, RF, permisos, pruebas, capturas y bloqueos. No borrar rutas fuera de módulos principales sin autorización.

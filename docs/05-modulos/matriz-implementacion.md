# Matriz de implementación de interfaces — H3GA

> Matriz viva. Estados iniciales no significan que una interfaz esté implementada. Completar rutas, componentes, acciones y evidencias desde el repositorio.

## Estados
Visual: No analizado → Pendiente → En curso → Implementado → Revisado; usar Bloqueado si falta decisión/referencia/definición. API: Existente sin verificar / Verificado / Pendiente backend / No aplica.

## Matriz inicial
| ID | Módulo | Interfaz/pieza | Referencia localizada | RF | Rol diseño | Estado |
|---|---|---|---|---|---|---|
| AUT-01 | Autenticación | Login | `autenticacion/login/`, `01-login.png` | RF-01–02 | Compartido | No analizado |
| AUT-02 | Autenticación | Recuperación/verificación/cambio contraseña | `autenticacion/recuperar-contrasena/` | RF-01–02; validar alcance | Compartido | No analizado |
| AUX-01 | Gestión auxiliar | Página principal | `gestion-auxiliar/pagina-principal/` | RF-49–60 | Asesor | No analizado |
| AUX-02 | Gestión auxiliar | Clientes asignados | `secciones/clientes-asignados.png` | RF-49–50 | Asesor/auxiliar | No analizado |
| AUX-03 | Gestión auxiliar | Tareas | `secciones/seccion-tareas.png` | RF-51–52, RF-60 | Asesor/auxiliar | No analizado |
| AUX-04 | Gestión auxiliar | Documentos enviados | `secciones/seccion-documentos-enviados.png` | RF-53–59 | Asesor/auxiliar | No analizado |
| AUX-05 | Gestión auxiliar | Modales nueva tarea/vincular auxiliar/asignar cliente/observaciones | `gestion-auxiliar/modales/` | RF-49–57 | Asesor/auxiliar | No analizado |
| MOD-01 | Modalidades | Página clientes | `modalidades/pagina-clientes/` | RF-61, RF-71–72 | Asesor | No analizado |
| MOD-02 | Modalidades | Detalle cliente | `modalidades/detalles-cliente/` | RF-62, RF-64–75 | Asesor | No analizado |
| MOD-03 | Modalidades | Secciones M10/M40/M40R | `modalidades/secciones/` | RF-17–18, RF-63–66 | Asesor | No analizado |
| MOD-04 | Modalidades | Subir documento | `modalidades/modales/subir-doc.png` | RF-69–75 | Asesor | No analizado |
| PF-01 | Proceso Final | Página clientes | `proceso-final/pagina-clientes/` | RF-23, RF-28–30 | Asesor | No analizado |
| PF-02 | Proceso Final | Detalle cliente | `proceso-final/detalles-cliente/` | RF-19–32 | Asesor | No analizado |
| PF-03 | Proceso Final | Preparación expediente | `secciones/preparacion-expediente.png` | RF-19–20, RF-27, RF-31 | Asesor | No analizado |
| PF-04 | Proceso Final | Resolución pensión | `secciones/resolucion-pension.png` | RF-21, RF-24–25, RF-31–32 | Asesor | No analizado |
| PF-05 | Proceso Final | Seguimiento/alertas | `secciones/seguimiento-alertas.png` | RF-25–30 | Asesor | No analizado |
| PF-06 | Proceso Final | Subir documentos | `modales/subir-documentos.png` | RF-27 | Asesor | No analizado |
| SC-01 | Servicios complementarios | Página clientes | `servicios-complementarios/pagina-clientes/` | RF-33–46 | Asesor | No analizado |
| SC-02 | Servicios complementarios | Detalle/seguimiento | `detalles-cliente/`, `secciones/servicio-seguimiento.png` | RF-36–46 | Asesor | No analizado |
| SC-03 | Servicios complementarios | Modales alta/cambio/otro servicio/subir documento | `servicios-complementarios/modales/` | RF-33–46 | Asesor | No analizado |
| EXP-01 | Expediente cliente | Página principal | `expediente-cliente/pagina-principal/` | RF-03–07 | Asesor desde «Ver expediente» | No analizado |
| EXP-02 | Expediente cliente | Subir documento | `expediente-cliente/modales/subir-documento.png` | RF-03–07 | Según permiso | No analizado |
| BIB-01 | Biblioteca | Página principal | `biblioteca/pagina-principal/` | RF-13–14 | Compartido | No analizado |
| BIB-02 | Biblioteca | Estado sin datos | `biblioteca/pagina-sin-datos/` | RF-13–14 | Compartido | No analizado |
| GD-01 | Gestión Documental | Página clientes | `gestion-documental/pagina-clientes/` | RF-03–07 | Auxiliar | No analizado |
| GD-02 | Gestión Documental | Detalle cliente | `gestion-documental/detalles-cliente/` | RF-03–07 | Auxiliar | No analizado |
| GD-03 | Gestión Documental | Modales subir/editar | `gestion-documental/modales/` | RF-03–07 | Auxiliar | No analizado |
| FI-01 | Formatos institucionales | Página principal | `formatos-institucionales/pagina-principal/` | RF-08–12 | Supervisor | No analizado |
| FI-02 | Formatos institucionales | Estado sin datos | `formatos-institucionales/pagina-sin-datos/` | RF-10 | Supervisor | No analizado |
| FI-03 | Formatos institucionales | Modales alta/edición/visualización | `formatos-institucionales/modales/` | RF-08–12 | Supervisor | No analizado |
| DASH-01 | Dashboard | Vista compartida con contenido por rol | Sin Figma localizado inicialmente | RF-15–16 | Compartido | Bloqueado por diseño |
| GLOB-01 | Shell global | Layout/sidebar/header/navegación | Verificar código y referencias | RNF-03 | Todos | No analizado |
| GLOB-02 | Estados globales | Loading/vacío/error/permisos/toast/confirmación | Definir patrón compartido | RNF-03–04 | Todos | No analizado |

## Cobertura RF
| RF | Módulo |
|---|---|
| RF-01–02 | Autenticación |
| RF-03–07 | Gestión Documental/expediente |
| RF-08–12 | Formatos institucionales |
| RF-13–14 | Biblioteca |
| RF-15–16 | Dashboard |
| RF-17–18 y RF-61–75 | Modalidades |
| RF-19–32 | Proceso Final |
| RF-33–46 | Servicios Complementarios |
| RF-47–48 | Migración (backend; UI solo con alcance explícito) |
| RF-49–60 | Gestión Auxiliar |

## Completar por cada ID
Añadir ruta Nuxt, archivo página/componentes, composable/store, campos/validaciones, modales/disparadores, botones/comportamientos, estados, permisos frontend/backend, endpoint/evidencia, breakpoints y pruebas. La matriz no autoriza inventar funcionalidades.

RF-61–75 pertenecen a Modalidades. RF-47–48 no obligan a crear UI si el proceso es exclusivamente backend. Dashboard queda bloqueado para fidelidad Figma hasta recibir referencia o aprobación de propuesta. No marcar módulo completo hasta revisar todas sus piezas.

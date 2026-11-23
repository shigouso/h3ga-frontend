# Permisos y seguridad del frontend — H3GA

## Fuente técnica principal
`app/types/sesion.ts`, `app/utils/permisos.ts`, `app/utils/menu.ts`, `app/middleware/auth.global.ts` y `app/stores/session.ts`, revisados en `main` (2026-11-23). Los nombres técnicos vigentes de rol en el frontend son **`asesor`, `auxiliar`, `supervisor`**. La tabla de requerimientos usa denominaciones narrativas «auxiliar administrativo» y «supervisión operativa»: no sustituir los valores del código por estas etiquetas sin comprobar el contrato.

## Navegación observada (`RUTAS_POR_ROL`)
| Rol | Rutas base habilitadas por el frontend |
|---|---|
| `asesor` | `/`, `/clientes`, `/agenda`, `/avisos`, `/reportes`, `/pension-final`, `/modalidades`, `/servicios-complementarios`, `/diagnosticos`, `/correcciones`, `/biblioteca`, `/configuracion` |
| `auxiliar` | `/`, `/clientes`, `/agenda`, `/avisos`, `/gestion-documental`, `/biblioteca`, `/configuracion` |
| `supervisor` | `/`, `/clientes`, `/agenda`, `/avisos`, `/reportes`, `/usuarios`, `/formatos-institucionales`, `/configuracion` |

**Importante:** una ruta autorizada en `permisos.ts` no implica que exista su archivo `app/pages/` ni que el backend permita la operación. `menu.ts` usa esas rutas para construir la navegación. El middleware redirige a `/login` sin sesión y a `/` si la ruta no está autorizada.

## Acciones observadas (`ACCIONES_POR_ROL`)
| Acción | Roles admitidos por el frontend |
|---|---|
| `clientes.crear`, `clientes.editar` | asesor |
| `clientes.reasignar` | supervisor |
| `f0.ver` | asesor, supervisor |
| `f1.ver` | asesor |
| `etapas.cambiarEstatus` | asesor |
| `auxiliares.autorizar` | asesor |
| `auxiliares.ver` | asesor, supervisor |
| `documentos.subir`, `documentos.revisar` | asesor, auxiliar |
| `agenda.escribir` | asesor |
| `reportes.ver` | asesor, supervisor |
| `usuarios.administrar` | supervisor |

Esta es una **transcripción de reglas UI existentes**, no una validación de permisos reales del backend. No inferir nuevas acciones a partir de las rutas ni de las capturas Figma. La tabla funcional de RF define el alcance; cada permiso efectivo se verifica con backend.

## Sesión y protección
- `session.ts` guarda token, usuario y vencimiento en Pinia + `sessionStorage`; no usar `localStorage` ni incluir token en URL o logs.
- `auth.global.ts` protege navegación; el backend debe validar JWT, rol, propiedad, asignación y acceso a documentos.
- No mostrar botones para operaciones no autorizadas; no intentar eludir un `403` desde el frontend.
- Evitar que el rediseño de layouts, sidebar, menús o modales rompa la lógica de sesión, el cierre de sesión o los controles por rol.

## Discrepancias que requieren revisión con backend
La documentación histórica menciona valores como `administrador` y `auxiliar administrativo`, mientras el código actual usa `supervisor` y `auxiliar`. Verificar mapeo real con Swagger/DTO/backend antes de cambiar roles o permisos. No equiparar `administrador financiero` a ninguno de estos perfiles.

## Alcance visual por rol acordado para Figma
| Rol | Módulos principales a maquetar |
|---|---|
| Asesor (`asesor`) | Gestión auxiliar, modalidades, pensión final, servicios complementarios, biblioteca, dashboard y vista expediente del cliente (acceso «Ver expediente») |
| Auxiliar (`auxiliar`) | Biblioteca, gestión documental, dashboard |
| Supervisión/administrador (`supervisor`) | Formatos institucionales, dashboard |

Esta distribución es una **decisión de navegación/diseño solicitada**, no una confirmación de autorización del backend. Actualmente `app/utils/permisos.ts` permite también otras rutas; no suprimir ni conceder accesos sin revisar requerimientos, comportamiento existente y backend. Las vistas compartidas se reutilizan y las operaciones se muestran según permisos efectivos.

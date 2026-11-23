# Permisos y seguridad del frontend — H3GA

## Fuente técnica
Inspeccionar `app/types/sesion.ts`, `app/utils/permisos.ts`, `app/utils/menu.ts`, `app/middleware/auth.global.ts` y `app/stores/session.ts`. Roles técnicos observados: `asesor`, `auxiliar`, `supervisor`. No renombrar valores por etiquetas narrativas de los RF.

## Distribución visual acordada
| Rol | Módulos principales |
|---|---|
| asesor | Gestión auxiliar, modalidades, pensión final/proceso final, servicios complementarios, biblioteca, dashboard y expediente desde «Ver expediente» |
| auxiliar | Biblioteca, gestión documental y dashboard |
| supervisor | Formatos institucionales y dashboard |

Biblioteca/dashboard son compartidos. Reutilizar estructura y adaptar contenido/acciones. Esta tabla guía el diseño; no sustituye permisos reales del código/backend.

## Tres conceptos distintos
1. Visibilidad: si aparece un control.
2. Autorización frontend: rutas/acciones permitidas por el cliente.
3. Autorización efectiva: validación backend de rol, propiedad, asignación y recurso.

Una ruta visible no autoriza operación; ocultar botón no protege endpoint.

## Reglas
- No cambiar roles, rutas, menú o permisos sin revisar código y contrato.
- No conceder permisos por capturas o texto narrativo.
- Ocultar/deshabilitar controles según reglas verificadas; tratar correctamente 403.
- No mostrar acciones administrativas a perfiles operativos por conveniencia visual.
- Preservar protección de rutas, logout y persistencia.
- No registrar tokens, credenciales ni datos personales.
- Documentos: validar asociación, autoría, asignación y conservación según backend.
- Confirmación destructiva no reemplaza autorización backend.

## Matriz de verificación
| Acción | Rol | Visible | Permitida frontend | Confirmada backend | Evidencia |
|---|---|---|---|---|---|
| Completar por acción | Por verificar | Por verificar | Por verificar | Por verificar | Archivo/endpoint/fecha |

No marcar «confirmada backend» sin evidencia. Extraer nombres y acciones del código actual durante auditoría.

## Discrepancias
Fuentes históricas pueden mencionar «administrador», «auxiliar administrativo» o «supervisión operativa». Verificar mapeo con DTO/guards antes de asociarlos a `supervisor` o `auxiliar`. No equiparar perfiles financieros con roles de Gestión.

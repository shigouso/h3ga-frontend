# Inventario de interfaces H3GA

> Estado inicial de planificación, no certificación de que cada módulo ya tenga una página implementada. Codex debe actualizar la columna «Estado real» después de inspeccionar `app/pages/`, componentes y capturas.

| Rol principal | Módulo / vista | Referencia Figma | Estado real |
|---|---|---|---|
| Compartido | Autenticación / login | `autenticacion/` | Verificar; existe `app/pages/login.vue` |
| Asesor | Gestión auxiliar | `gestion-auxiliar/` | Verificar |
| Asesor | Modalidades | `modalidades/` | Verificar |
| Asesor | Pensión final | `pension-final/` | Verificar |
| Asesor | Servicios complementarios | `servicios-complementarios/` | Verificar |
| Asesor, auxiliar | Biblioteca | `biblioteca/` | Verificar; componente compartido |
| Asesor, auxiliar, supervisor | Dashboard | `dashboard/` | Verificar; adaptar contenido por rol |
| Asesor | Expediente del cliente («Ver expediente») | `expediente-cliente/` | Verificar; existen rutas `/clientes/:id` y `/clientes/:id/archivos` |
| Auxiliar | Gestión documental | `gestion-documental/` | Verificar |
| Supervisor | Formatos institucionales | `formatos-institucionales/` | Verificar |

## Para cada módulo, Codex debe inventariar
- Pantallas, formularios, modales, estados y capturas de desktop/laptop.
- Ruta real, componente Vue y composable existente.
- Estado: existente / adaptar UI / crear / sin referencia visual.
- Integración: ya conectada / pendiente / no comprobada.
- Dependencias, restricciones de rol y RF de la tabla principal.

**Nota:** las rutas `/clientes`, `/usuarios`, `/configuracion`, `/diagnosticos`, `/agenda` y otras existentes no se deben borrar por no figurar como módulos principales de la nueva distribución visual. Identificar diferencias y pedir decisión antes de alterar permisos o navegación.

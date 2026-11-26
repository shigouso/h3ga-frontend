# Prompt 3 — Auditoría y corrección frontend H3GA

Auditar resultado contra matriz, RF, capturas y código. No iniciar integraciones nuevas sin aprobación explícita.

## Cobertura
1. Cada imagen de `docs/05-modulos/` corresponde a interfaz o tiene justificación.
2. RF-01 a RF-75 mapeados a UI, proceso backend o justificación.
3. Revisar páginas, secciones, formularios, campos, modales, estados, filtros, tablas y acciones.
4. Revisar roles, rutas, navegación y «Ver expediente» sin cambiar permisos.
5. Verificar reutilización de biblioteca/dashboard.
6. Confirmar que integraciones existentes no se rompieron y no se inventaron endpoints.

## Visual y responsive
Comparar 1920/1440 con Figma; probar 1024/400 e intermedios. Revisar shell, sidebar, tipografía, colores, iconos, tablas, formularios, modales, scroll y foco. Comprobar loading, vacío, error, sin permiso, validación, éxito y confirmación. Sin scroll global accidental ni controles cortados. Si no hay navegador/capturas, declarar limitación; no afirmar fidelidad comprobada.

## Calidad y seguridad
Ejecutar solo scripts presentes en package.json: typecheck, lint, build y pruebas existentes. Registrar comando y resultado. No declarar éxito si no se ejecutó. No exponer datos/tokens. UI no sustituye autorización backend. Destructivas requieren confirmación. No simular éxito ni conectar API no verificada.

## Entrega
Actualizar matriz, inventario y `docs/06-pruebas/checklist-frontend.md` con estado/evidencia. Reportar defectos, correcciones, interfaces revisadas, pruebas ejecutadas, regresiones, pendientes backend y bloqueos. No iniciar integración sin aprobación. No commits/push/PR/reset/stash.

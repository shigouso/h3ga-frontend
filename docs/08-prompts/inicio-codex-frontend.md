# Inicio de trabajo — Codex Frontend H3GA

Este documento es el punto de entrada; las etapas detalladas están separadas para evitar contradicciones.

## Lectura obligatoria
1. `AGENTS.md`
2. `docs/Tabla de requerimientos de los modulos.md`
3. `docs/Diccionario de datos.md`
4. Guías de `docs/01-diseno-sistema/` a `docs/04-seguridad-y-roles/`
5. `docs/05-modulos/guia-referencias-figma.md`, inventario, pantallas/flujos y matriz
6. `docs/06-pruebas/checklist-frontend.md`

## Ejecución
- Primero ejecutar `01-analizar-y-preparar.md`; no programar hasta presentar plan e inventario y recibir aprobación.
- Después ejecutar `02-implementar-interfaces.md`, módulo por módulo. Preservar integraciones existentes; no agregar HTTP nuevo durante maquetación.
- Luego ejecutar `03-revisar-y-corregir.md`. Completar checklist y solicitar aprobación visual.
- Solo con aprobación explícita, integrar operaciones pendientes contra contratos backend verificados y ejecutar auditoría final.

## Objetivo
Cubrir interfaces justificadas por RF-01 a RF-75 y capturas existentes, incluidos estados, formularios y modales. No duplicar componentes ni inventar permisos, endpoints, campos o pantallas.

## Distribución visual
Asesor: gestión auxiliar, modalidades, pensión final/proceso final, servicios complementarios, biblioteca, dashboard y expediente desde «Ver expediente». Auxiliar: biblioteca, gestión documental y dashboard. Supervisor: formatos institucionales y dashboard. Esta distribución no sustituye permisos reales.

## Límites
No modificar backend, base de datos ni almacenamiento. No usar mocks como éxito real. No commits, pushes, PR, reset, stash ni operaciones destructivas. Reportar evidencia y limitaciones.

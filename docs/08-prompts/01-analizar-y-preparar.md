# Prompt 1 — Auditoría, análisis y plan maestro H3GA

Esta etapa es de análisis: **no implementar ni modificar interfaces**.

## Fuentes
Leer `AGENTS.md`, tabla oficial de RF, diccionario, cuatro guías, todo `docs/05-modulos/`, matriz, checklist y código. La tabla RF es alcance; diccionario es apoyo; código define estado técnico. Backend/Swagger verifica contratos.

## Auditoría
1. Inspeccionar package/lockfile, Nuxt config, tema/CSS, layouts, páginas, componentes, composables, stores, utils, tipos, middleware y permisos.
2. Listar rutas existentes y destinos de menú sin página.
3. Inventariar **cada imagen** de `docs/05-modulos/`: ruta, módulo, tipo, interfaz, tamaño y relación con vista. Incluir modales, formularios, secciones y estados.
4. Para cada interfaz identificar página/componente, composable, formulario/campos, modal/disparador, acciones, estados, RF y rol.
5. Separar existente, adaptación, creación, integración existente, no verificada y bloqueada.
6. Detectar discrepancias de tema, recursos compartidos, nombres y resoluciones.
7. Revisar referencias del dashboard y diferencias por rol.
8. Verificar API/permisos con evidencia backend; no inventar.

## Entregables
- Inventario de interfaces actualizado.
- Matriz con IDs, cobertura RF-01 a RF-75 y estado por interfaz.
- Requisitos sin UI justificados.
- Componentes globales y módulos ordenados por dependencias.
- Riesgos, dudas, contratos y decisiones pendientes.
- Plan separado para maquetación e integración.

Distribución visual: asesor (gestión auxiliar, modalidades, pensión final, servicios complementarios, biblioteca, dashboard y expediente desde «Ver expediente»); auxiliar (biblioteca, gestión documental, dashboard); supervisor (formatos institucionales, dashboard). No modificar permisos.

Plan sugerido: auditoría → base compartida → módulo por módulo → auditoría visual → aprobación → integración → auditoría funcional. No programar hasta aprobación del plan. No commits/push/PR ni cambios destructivos. No declarar pruebas no ejecutadas.

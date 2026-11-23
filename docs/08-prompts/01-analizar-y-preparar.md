# Prompt 1 — Analizar y preparar H3GA

Trabaja sobre el repositorio Nuxt 4 existente. **En esta etapa no implementes ni modifiques interfaces**.

1. Lee `AGENTS.md`, `docs/Tabla de requerimientos de los modulos.md` (fuente funcional), `docs/Diccionario de datos.md` (apoyo) y las cuatro guías `diseno-ui.md`, `arquitectura-frontend.md`, `contratos-y-estados.md`, `permisos-frontend.md`.
2. Inspecciona el código real: `package.json`, Nuxt UI instalado, estilos, rutas, layouts, componentes, composables, stores, tipos, middleware y permisos.
3. Inventaría todas las imágenes en `docs/05-modulos/`: módulo, interfaz, formulario/modal/estado y referencias **desktop 1920** y **laptop 1440**. No solicites tablet ni móvil.
4. Contrasta el inventario de capturas con `docs/05-modulos/inventario-interfaces.md` y actualízalo solo con evidencia del repositorio.
5. Identifica componentes compartidos, discrepancias entre colores H3GA y tema actual, rutas faltantes, lógica ya conectada y acciones aún no integradas.
6. Respeta la distribución visual: asesor (gestión auxiliar, modalidades, pensión final, servicios complementarios, biblioteca, dashboard y expediente desde «Ver expediente»); auxiliar (biblioteca, gestión documental, dashboard); supervisor (formatos institucionales, dashboard). **No modifiques permisos efectivos sin verificar backend**.
7. Elabora un plan por módulos para **Etapa 1: maquetación** y un listado separado para **Etapa 2: integraciones**.
8. Define patrones compartidos Nuxt UI para `success`, `warning`, `info`, `error` y confirmación de borrado.

Entrega inventario, hallazgos, orden de implementación y riesgos. No hagas commits, push, PR ni cambios destructivos. No inventes pantallas, contratos ni requisitos ausentes.

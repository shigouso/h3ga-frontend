# AGENTS.md — Frontend GESTIÓN H3GA

## Fuentes autorizadas y precedencia
Utiliza exclusivamente las siguientes referencias para definir alcance y comportamiento:
1. `IS_26_CHAN_MARTIN_LUIS_GAEL_DESARROLLO_SISTEMA_GESTION.pdf` — **fuente oficial y prioritaria** de requerimientos, alcance, roles y modelo de Gestión.
2. `Diccionario de datos (1).md` — apoyo para entidades y campos; **contiene una sección de H3GA Finanzas que no debe trasladarse al frontend de Gestión**.
3. `Instructivo_Memoria_Unificado_V5.1.pdf` — criterios de elaboración y evidencia académica; no inventa funciones del software.
4. `AGENTS.md` vigente del backend — convenciones y límites de integración.
5. `jwt-auth.guard.ts`, `roles.decorator.ts` y `clientes.controller.ts` — evidencia parcial de autenticación y endpoints reales.

No usar documentos o prompts anteriores como fuentes de requisitos. Los documentos de `docs/` son una guía derivada de estas referencias, no una fuente superior. Si una referencia no está físicamente disponible en el repositorio frontend, usar su transcripción documentada y pedir el archivo cuando sea imprescindible.

## Nombre y alcance
El nombre vigente es **GESTIÓN H3GA**. No cambiar nombres de código existentes por simple estética. Implementar interfaces según los RF oficiales y los flujos de la matriz de roles de IS_26. No inventar funcionalidades, campos obligatorios, permisos ni endpoints.

## Stack
- Nuxt, Vue y TypeScript según las versiones efectivamente instaladas.
- Preferir **componentes oficiales de Nuxt UI** de la versión del proyecto: formularios, botones, tablas, modales, alertas, navegación y carga de archivos.
- Reutilizar componentes y composables, separar presentación y llamadas API.
- No introducir otra biblioteca de UI sin justificación.

## Identidad visual obligatoria
- `black: #011818`
- `white: #FCFCFC`
- `accent: #FFCC00`
- `secondary: #4ECAD4`
- `primary: #003D3D`
- **Tipografías:** conservar las ya elegidas o instaladas en el frontend; ninguna fuente específica se puede deducir de los siete archivos autorizados. No sustituirlas.
- Alertas semánticas de Nuxt UI: `success`, `warning`, `error`/alerta e `info`.
- Interfaces en español, responsivas en **desktop, laptop, tablet y móvil**.

## Roles y permisos
- Roles de implementación indicados en el `AGENTS.md` del backend: `asesor`, `auxiliar administrativo`, `administrador`.
- IS_26 denomina al tercer perfil **Supervisor Operativo**. No equiparar automáticamente permisos de supervisión con operaciones de asesor o auxiliar.
- **Decisión vigente de alcance de interfaces:** Gestión de Auxiliares y Gestión Documental son operativos para asesor/auxiliar; no ofrecer al administrador botones para asignar tareas, revisar/aprobar entregas ni modificar expedientes. IS_26 sí describe consulta de documentos para supervisión; cualquier pantalla de solo lectura para administrador debe verificarse con contrato backend antes de habilitarse.
- No confundir el rol observado `administrador financiero` en `ClientesController` con un permiso general de Gestión.
- Aplicar protección visual por rol y cliente; el backend siempre valida la autorización real.

## Módulos y trazabilidad
Autenticación RF-01–02; Gestión Documental RF-03–07; Formatos RF-08–12 (en PDF aparece `RF-9`); Biblioteca RF-13–14; Dashboard RF-15–16; Modalidades RF-17–18; Proceso Final RF-19–23; Servicios Complementarios RF-24–37; Migración RF-38–39. **Gestión de Auxiliares**: funcionalidad descrita en matriz de roles y en `cliente_auxiliares`; no atribuirle números RF inexistentes en el PDF oficial.

## Backend y datos
- Revisar rutas, DTO y respuestas reales antes de conectar acciones. `ClientesController` declara rutas relativas `/clientes` GET listado/detalle, POST alta y PATCH edición; prefijo global no verificado.
- El controlador proporcionado **no** autoriza `auxiliar administrativo` para `/clientes`; no mostrar acceso a expedientes como si ya estuviera implementado.
- Nunca consumir PostgreSQL directamente desde la interfaz ni construir operaciones sobre tablas financieras.
- Si falta API, dejar pantalla visual preparada y marcar explícitamente pendiente de integración; nunca presentar datos mock como datos reales.

## Imágenes de referencia
Seguir `docs/07-referencias-visuales/COMO-AGREGAR-IMAGENES.md`. Las capturas del usuario se ordenan en un manifiesto y guían únicamente el diseño visual, no la lógica ni los permisos.

## Forma de trabajo
1. Leer la transcripción de RF y matriz de roles; revisar proyecto y Nuxt UI instalado.
2. Inventariar rutas y componentes existentes; crear shell y sistema de diseño.
3. Implementar interfaces por módulo con estados carga/vacío/error/sin permiso.
4. Conectar solo endpoints reales; distinguir integrado de pendiente.
5. Verificar responsive, accesibilidad, typecheck/build y documentar resultados.
6. No modificar backend ni ejecutar migraciones desde el trabajo frontend.

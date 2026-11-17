# Prompt para Codex — Crear interfaces de GESTIÓN H3GA

Trabaja en el **repositorio frontend** de GESTIÓN H3GA. Lee primero `AGENTS.md` y los documentos de `docs/`.

## Fuentes obligatorias
La única fuente oficial de alcance y requisitos es `IS_26_CHAN_MARTIN_LUIS_GAEL_DESARROLLO_SISTEMA_GESTION.pdf`. Complementa exclusivamente con `Diccionario de datos (1).md`, `Instructivo_Memoria_Unificado_V5.1.pdf`, el `AGENTS.md` vigente del backend y los archivos `jwt-auth.guard.ts`, `roles.decorator.ts`, `clientes.controller.ts`. Si no están copiados al frontend, usa los extractos fieles incluidos en `docs/` y solicita el original para decisiones no verificables. **No uses documentación anterior como fuente adicional**.

## Objetivo
Crear las interfaces de los módulos documentados: autenticación, clientes/expedientes, Gestión de Auxiliares, Gestión Documental, Formatos Institucionales, Biblioteca, Dashboard, Modalidades de Pensión, Proceso Final y Cobranza, Servicios Complementarios y las funciones de migración que realmente requieran UI.

## Diseño
Nuxt + Vue + TypeScript y componentes **oficiales Nuxt UI** instalados. Responsivo para desktop, laptop, tablet y móvil. Colores: black `#011818`, white `#FCFCFC`, accent `#FFCC00`, secondary `#4ECAD4`, primary `#003D3D`. **No cambiar tipografías existentes.** Alertas semánticas success, warning, error/alert e info.

## Roles
Asesor y auxiliar son los perfiles operativos de Gestión de Auxiliares y Gestión Documental. No crear acciones operativas de administrador en esos módulos. Mantener la diferencia entre consulta de supervisión documentada en IS_26 y operaciones que no corresponden al administrador. El controlador de clientes aportado no concede acceso al auxiliar; no simular ese permiso.

## Referencias visuales
Lee `docs/07-referencias-visuales/manifiesto-imagenes.md`; abre las imágenes de `public/referencias/` en orden. Si faltan, crea un diseño coherente y adaptable que después se pueda ajustar.

## Ejecución
1. Revisar Nuxt UI y estructura reales; listar brevemente pantallas y componentes.
2. Crear layout, navegación, autenticación y componentes compartidos.
3. Construir las interfaces de cada módulo con sus estados de carga, error, vacío y permisos.
4. Conectar **solo** APIs reales verificadas. Si falta endpoint, dejar la pantalla preparada y registrar pendiente; no presentar mocks como reales.
5. Comprobar responsive, typecheck y build; reportar archivos modificados, páginas completas y pendientes.

Prioriza la funcionalidad documentada; evita mejoras opcionales, duplicaciones y cambios de backend/Finanzas.

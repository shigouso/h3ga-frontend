# AGENTS.md — Frontend H3GA

## Propósito
Trabajar **sobre el frontend existente** de H3GA, sin reconstruirlo ni sustituir su lógica por maquetas. La implementación debe ser fiel a los diseños Figma que el usuario coloque en `docs/05-modulos/`, funcionar en Nuxt y conservar las integraciones ya desarrolladas.

## Fuentes y precedencia
1. **Código actual del repositorio** (`app/`, `types/`, `nuxt.config.ts`, `package.json`, configuración y estilos): fuente de verdad sobre arquitectura, librerías instaladas, rutas, componentes, comportamiento y estado de implementación. Una llamada HTTP en el frontend no prueba por sí sola que el backend la soporte.
2. **`docs/Tabla de requerimientos de los modulos.md`**: fuente principal del alcance funcional y de los RF/RNF; respetar su numeración vigente (RF-01 a RF-75, incluido `RF-9`) y no reutilizar numeraciones históricas de documentos desactualizados. Si el archivo no está disponible en el entorno de Codex, solicitarlo o indicar la limitación; no inventar sus requisitos.
3. **`docs/Diccionario de datos.md`**: apoyo para terminología, entidades y relaciones; no implica que exista una API ni autoriza funcionalidades adicionales. Excluir el dominio H3GA Finanzas del frontend de Gestión salvo alcance explícito.
4. **`docs/01-diseno-sistema/diseno-ui.md`** y **capturas de `docs/05-modulos/`**: fuente de verdad de identidad visual, estructura de pantallas, modales y formularios. Las capturas no autorizan inventar permisos, endpoints ni reglas de negocio.
5. **`docs/02-arquitectura/arquitectura-frontend.md`, `docs/03-integracion-api/contratos-y-estados.md`, `docs/04-seguridad-y-roles/permisos-frontend.md`**: guías actualizadas, siempre contrastadas con código real y backend verificado.

Si hay contradicción entre el diseño y el código, preservar la funcionalidad y ajustar la presentación; si hay contradicción de negocio o seguridad, detener el cambio afectado y reportarla. Nunca usar los documentos históricos de `docs/00-contexto-general/` o `docs/08-prompts/` como fuente superior de requisitos.

## Tecnología y reutilización
- Nuxt 4, Vue 3, TypeScript, Nuxt UI 4, Tailwind CSS 4 y Pinia conforme a `package.json` real.
- Revisar antes de crear: `app/pages/`, `app/components/`, `app/layouts/`, `app/composables/`, `app/stores/`, `app/utils/`, `app/types/` y `types/api.d.ts`.
- Preferir componentes **Nuxt UI instalados**, personalizados según H3GA; mantener componentes Vue existentes si ya funcionan. No agregar bibliotecas por estética.
- No sustituir APIs reales por mocks ni inventar endpoints. Usar `useApi()` y composables existentes; cotejar con Swagger/backend cuando se requiera afirmar compatibilidad.

## Diseño H3GA
- Tokens de referencia: `black #011818`, `white #FCFCFC`, `accent #FFCC00`, `secondary #4ECAD4`, `primary #003D3D`.
- Respetar tipografía y tokens reales existentes; documentar y resolver antes de cambiar una discrepancia entre CSS/tema y la guía. El CSS actual contiene verde Nuxt UI predeterminado: **no confundirlo con la identidad de marca**.
- Interfaces en español. Conservar jerarquía, espaciado, estados, iconografía y distribución de las capturas.
- Capturas Figma por módulo en `docs/05-modulos/<modulo>/`, agrupadas por vista y dispositivo. Desktop **1920** y laptop **1440**: únicas referencias Figma esperadas. **Tablet 1024** y **móvil 400**: Codex debe diseñar las adaptaciones sin solicitar nuevas capturas. No tomar capturas tablet antiguas como referencia obligatoria. También comprobar tamaños intermedios.
- Una sola implementación responsiva por interfaz; no cuatro páginas duplicadas. Modales, formularios, tablas, navegación y controles deben ser utilizables con teclado y tacto.

## Seguridad e integración
- Roles **reales del frontend**: `asesor`, `auxiliar`, `supervisor` (ver `app/types/sesion.ts` y `app/utils/permisos.ts`); distinguirlos de los nombres narrativos de la tabla de RF. No renombrar valores técnicos por estética.
- `app/utils/permisos.ts`, `app/utils/menu.ts` y `app/middleware/auth.global.ts` definen navegación visible; **el backend impone autorización efectiva**. No inferir acceso por la sola presencia de una opción de menú.
- Sesión actual en Pinia + `sessionStorage`; autenticación y errores centralizados en `useApi()`.
- No modificar backend, esquema, migraciones ni almacenamiento de documentos sin instrucción explícita.

## Flujo de trabajo
1. Leer código, tabla de requerimientos, diccionario de apoyo y las cuatro guías actualizadas.
2. Inventariar capturas existentes de `docs/05-modulos/` y relacionarlas con rutas, componentes, modales y formularios reales.
3. Detectar qué ya existe y requiere únicamente adaptación visual; crear solo lo faltante.
4. **Etapa 1: maquetación visual** de todos los módulos con capturas: preservar conexiones y lógica existentes; no crear integraciones nuevas ni simular guardados reales. Implementar navegación, modales, estados locales y componentes responsivos. **Etapa 2: integración funcional**, únicamente tras aprobación visual del usuario y con contratos backend verificados.
5. Usar los patrones de **Nuxt UI 4** para alertas/notificaciones `success`, `warning`, `info`, `error` y diálogos de confirmación destructiva; no `window.alert/confirm/prompt`. Nunca ejecutar borrado sin confirmación.
6. Verificar `pnpm typecheck`, `pnpm build`, `pnpm lint` cuando sea viable; usar navegador para comparar 1920/1440/1024/400 si está disponible. No declarar comprobaciones no realizadas.
7. Reportar archivos modificados, módulos terminados, diferencias visuales, integraciones comprobadas y dependencias pendientes.

**No realizar commits, pushes, PR, reset, stash ni cambios destructivos automáticamente.**

## Distribución visual solicitada por el usuario
- **Asesor:** gestión auxiliar, modalidades, pensión final, servicios complementarios, biblioteca y dashboard; **expediente del cliente** es una vista a la que se llega desde «Ver expediente».
- **Auxiliar:** biblioteca, gestión documental y dashboard.
- **Supervisor (administrador):** formatos institucionales y dashboard.
- Esta es la distribución de **módulos principales para el diseño**; no borra por sí sola las rutas o permisos existentes. Contrastar diferencias con `app/utils/permisos.ts`, requerimientos y backend antes de modificar autorizaciones.
- Biblioteca y dashboard son módulos compartidos, no implementaciones duplicadas.
- Las referencias Figma están exclusivamente en `docs/05-modulos/<modulo>/<interfaz>/desktop-1920.png` y `laptop-1440.png`, con nombres descriptivos equivalentes admitidos. Revisar también capturas de formularios, modales y estados.

# Arquitectura frontend — H3GA

## Estado verificado en `main` (2026-11-23)
Stack declarado: Nuxt 4.6.3, Vue 3, TypeScript, Nuxt UI 4.12, Tailwind CSS 4.3, Pinia, Zod y date-fns (versiones expresadas con `^` en `package.json`; revisar lockfile para versiones exactas). `nuxt.config.ts` instala `@nuxt/ui`, `@pinia/nuxt`, `@nuxt/eslint`; `runtimeConfig.public.apiBase` define la base HTTP.

## Organización real
- `app/pages/`: rutas existentes `/`, `/login`, `/clientes`, `/clientes/nuevo`, `/clientes/:id`, `/clientes/:id/f0`, `/clientes/:id/f1`, `/clientes/:id/archivos`, `/diagnosticos`, `/usuarios`, `/configuracion`.
- `app/layouts/auth.vue`, `app/layouts/default.vue`: acceso público y shell autenticado. El layout principal ya contiene sidebar, navegación por rol, avisos y confirmación de salida.
- `app/components/`: formularios de clientes/usuarios/eventos, diagnóstico F0/F1, gestión documental, auxiliares, correcciones, gráficas y otros componentes.
- `app/composables/`: `useApi`, `useClientes`, `useUsuarios`, `useAgenda`, `useExpediente`, `useDocumentos`, `useDiagnostico`, `useDashboard`, `useReportes`, etc. Contienen operaciones API y estados compartidos.
- `app/stores/`: `session`, `avisos`, `preferencias` (Pinia).
- `app/middleware/auth.global.ts`: protección de navegación mediante `app/utils/permisos.ts`.
- `app/utils/`: permisos, menú, errores HTTP, fechas, formatos y reglas auxiliares.
- `app/types/` y `types/api.d.ts`: modelos locales y tipos derivados del contrato Swagger. El comentario de `app/types/sesion.ts` menciona generación `pnpm api:types`, pero **ese script no figura en el `package.json` revisado**: confirmar el procedimiento antes de regenerar.
- `app/assets/css/main.css` y `app/app.config.ts`: configuración visual actual, con discrepancias respecto a la paleta documentada.
- `public/img/`: recursos usados por las interfaces.

## Estado de pantallas y navegación
`app/utils/menu.ts` incluye destinos que **todavía no tienen página correspondiente** en el árbol de `app/pages/` revisado: `/agenda`, `/avisos`, `/reportes`, `/pension-final`, `/modalidades`, `/servicios-complementarios`, `/correcciones`, `/gestion-documental`, `/formatos-institucionales`, `/biblioteca`. Esto no prueba que no existan componentes o composables de apoyo: significa que falta verificar o implementar la ruta de página. No afirmar que esos módulos están completos por tener un composable.

## Reglas arquitectónicas
1. Mantener el proyecto existente: no crear un nuevo Nuxt ni duplicar páginas por breakpoint.
2. Reutilizar componentes y composables antes de escribir otros; separar vistas, reglas de presentación y acceso HTTP.
3. Usar `useApi()` para peticiones autenticadas, carga de archivos y normalización de errores; respetar su API real.
4. Mantener `session` y la autorización por rutas/acciones en `permisos.ts`, sin confundir filtrado visual con seguridad del backend.
5. No inventar endpoints ni cambiar contratos solo para que una maqueta funcione.
6. Construir vistas por módulo usando capturas de `docs/05-modulos/`, preservando lógica y estados existentes.
7. Cambiar código de tema solo tras cotejar `diseno-ui.md`, capturas y estilos efectivos.

## Fuente de alcance
`Tabla de requerimientos de los modulos.md` es la referencia funcional vigente; `Diccionario de datos.md` es apoyo conceptual, no prueba de API. `docs/03-integracion-api/contratos-y-estados.md` documenta rutas **usadas por el frontend**, no garantiza su implementación en backend.

## Estrategia de implementación visual
- **Etapa 1:** adaptar vistas y componentes existentes a Figma, crear rutas faltantes donde corresponda y construir navegación, formularios, modales y estados de presentación sin reemplazar llamadas API existentes ni inventar nuevas integraciones.
- **Etapa 2:** conectar operaciones pendientes únicamente después de aprobar las interfaces y verificar contratos.
- `docs/05-modulos/` es la ubicación de capturas por módulo/interfaz; solo se esperan desktop 1920 y laptop 1440. Tablet 1024 y móvil 400 se generan por CSS responsivo.
- Dashboard y biblioteca son vistas compartidas por roles; «Ver expediente» debe conducir al cliente seleccionado y preservar su identificador, sin inventar ruta distinta si ya existe una.

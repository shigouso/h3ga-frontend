import type { components } from '~~/types/api'

// Tipos generados desde el Swagger del backend (`pnpm api:types` -> types/api.d.ts).
export type SesionRespuesta = components['schemas']['SesionRespuesta']
export type UsuarioSesion = components['schemas']['UsuarioSesion']
export type Rol = UsuarioSesion['rol']

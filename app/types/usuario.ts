import type { components } from '~~/types/api'

// Contrato de usuarios y catálogos, generado desde el Swagger del backend.
export type Usuario = components['schemas']['UsuarioRespuesta']
export type CrearUsuario = components['schemas']['CrearUsuarioDto']
export type ActualizarUsuario = components['schemas']['ActualizarUsuarioDto']
export type RolCatalogo = components['schemas']['Rol']
export type TipoAsesor = components['schemas']['TipoAsesor']

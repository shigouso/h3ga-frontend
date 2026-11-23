import type { components } from '~~/types/api'

// Contrato de GET /correcciones (lista de trámites F2, F3 y F4), generado desde el Swagger del backend.
export type TramitesCorreccion
  = components['schemas']['CorreccionesListadoRespuesta']
export type ClienteCorrecciones = components['schemas']['ClienteCorrecciones']
export type FaseCorreccion = components['schemas']['FaseCorreccion']

// Unificación de NSS (F3): detalle de la corrección de tipo 7 y sus NSS secundarios.
export type UnificacionNss = components['schemas']['UnificacionNssDetalle']
export type GuardarUnificacionNss
  = components['schemas']['CreateUnificacionNssDetalleDto']
export type NssSecundario = components['schemas']['UnificacionNssSecundario']
export type NuevoNssSecundario
  = components['schemas']['CreateUnificacionNssSecundarioDto']

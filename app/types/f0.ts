import type { components } from '~~/types/api'

// Contratos del Diagnóstico inicial F0 (historial laboral, ISSSTE y objetivos), generados desde el Swagger del backend.
export type HistorialLaboral = components['schemas']['HistorialLaboral']
export type GuardarHistorialLaboral
  = components['schemas']['CreateHistorialLaboralDto']
export type InformacionIssste = components['schemas']['InformacionIssste']
export type ObjetivoEspecifico
  = components['schemas']['ObjetivoEspecificoInicial']
export type ObjetivoMarcado
  = components['schemas']['ClienteObjetivoEspecifico']
export type GuardarIssste = Omit<
  components['schemas']['CreateInformacionIsssteDto'],
  'id' | 'activo'
>
export type TipoCorreccion = components['schemas']['TipoCorreccion']
export type Correccion = components['schemas']['CorreccionCliente']
export type CrearCorreccion
  = components['schemas']['CreateCorreccionClienteDto']
export type ActualizarCorreccion
  = components['schemas']['UpdateCorreccionClienteDto']

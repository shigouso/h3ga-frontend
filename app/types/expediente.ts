import type { components } from '~~/types/api'

// Contratos del expediente del cliente, generados desde el Swagger del backend.
export type EtapasCliente = components['schemas']['EtapasClienteRespuesta']
export type EtapaCliente = components['schemas']['EtapaDelClienteRespuesta']
export type EstatusTramite = components['schemas']['EstatusTramite']
export type CambiarEstatus = components['schemas']['CambiarEstatusDto']
export type CambioEstatus = components['schemas']['EtapaTramiteHistorial']
export type DocumentoCliente = components['schemas']['DocumentoCliente']
export type TipoDocumento = components['schemas']['TipoDocumento']
export type EventoAgenda = components['schemas']['EventoAgenda']

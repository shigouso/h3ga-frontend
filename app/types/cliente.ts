import type { components } from '~~/types/api'

// Contrato de clientes y de sus catálogos, generado desde el Swagger del backend.
export type Cliente = components['schemas']['Cliente']
export type CrearCliente = components['schemas']['CreateClienteDto']
export type ActualizarCliente = components['schemas']['UpdateClienteDto']
export type CatalogoItem = components['schemas']['RegimenPrincipal']

export interface CatalogosCliente {
  regimenes: CatalogoItem[]
  leyesProbables: CatalogoItem[]
  afores: CatalogoItem[]
}

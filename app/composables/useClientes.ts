import type {
  ActualizarCliente,
  CatalogoItem,
  CatalogosCliente,
  Cliente,
  CrearCliente
} from '~/types/cliente'

// Clientes (el backend filtra el listado por rol) y los catálogos que necesita su formulario.
export function useClientes() {
  const api = useApi()

  return {
    listar: () => api.get<Cliente[]>('/clientes'),
    obtener: (id: string) => api.get<Cliente>(`/clientes/${id}`),
    crear: (datos: CrearCliente) => api.post<Cliente>('/clientes', datos),
    actualizar: (id: string, datos: ActualizarCliente) =>
      api.patch<Cliente>(`/clientes/${id}`, datos),
    // Solo el Supervisor.
    reasignar: (id: string, asesorId: string) =>
      api.patch<Cliente>(`/clientes/${id}/asesor`, { asesor_id: asesorId }),
    regimenes: () => api.get<CatalogoItem[]>('/catalogos/regimenes'),
    async catalogos(): Promise<CatalogosCliente> {
      const [regimenes, leyesProbables, afores] = await Promise.all([
        api.get<CatalogoItem[]>('/catalogos/regimenes'),
        api.get<CatalogoItem[]>('/catalogos/leyes-probables'),
        api.get<CatalogoItem[]>('/catalogos/afores')
      ])
      return { regimenes, leyesProbables, afores }
    }
  }
}

import type {
  CambiarEstatus,
  CambioEstatus,
  EtapaCliente,
  EtapasCliente
} from '~/types/expediente'

// Etapas de un cliente: lectura, cambio de estatus o avance (solo el Asesor) e historial de cambios.
export function useEtapas(clienteId: string) {
  const api = useApi()
  const avisos = useAvisosStore()

  return {
    listar: () => api.get<EtapasCliente>(`/clientes/${clienteId}/etapas`),
    // Mover el compromiso o cerrar la etapa cambia sus avisos: la campana y el contador vuelven a leer la bandeja.
    cambiarEstatus: async (etapaId: string, datos: CambiarEstatus) => {
      const etapa = await api.patch<EtapaCliente>(
        `/clientes/${clienteId}/etapas/${etapaId}`,
        datos
      )
      void avisos.cargar().catch(() => undefined)
      return etapa
    },
    historial: (etapaId: string) =>
      api.get<CambioEstatus[]>(
        `/clientes/${clienteId}/etapas/${etapaId}/historial`
      )
  }
}

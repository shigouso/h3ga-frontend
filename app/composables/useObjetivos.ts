import type { ObjetivoEspecifico, ObjetivoMarcado } from '~/types/f0'

// Objetivos específicos del F0 ("servicios / estrategias aplicables"): el catálogo y los que el cliente tiene marcados.
export function useObjetivos(clienteId: string) {
  const api = useApi()

  return {
    catalogo: () =>
      api.get<ObjetivoEspecifico[]>('/catalogos/objetivos-especificos'),
    marcados: () =>
      api.get<ObjetivoMarcado[]>(
        `/clientes/${clienteId}/objetivos-especificos`
      ),
    // Reemplaza la selección completa: una lista vacía deja al cliente sin objetivos marcados.
    reemplazar: (objetivoIds: number[]) =>
      api.put<ObjetivoMarcado[]>(
        `/clientes/${clienteId}/objetivos-especificos`,
        { objetivo_ids: objetivoIds }
      )
  }
}

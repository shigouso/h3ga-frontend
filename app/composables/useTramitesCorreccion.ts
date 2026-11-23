import type { TramitesCorreccion } from '~/types/correcciones'

// Lista de trámites de corrección del Asesor: una fila por cliente con el estatus de sus etapas 2, 3 y 4 (F2, F3 y F4)
// y los totales de trámites abiertos y registrados, todo calculado por el backend.
export function useTramitesCorreccion() {
  const api = useApi()

  return {
    listar: () => api.get<TramitesCorreccion>('/correcciones')
  }
}

import type { components } from '~~/types/api'

export type AsignacionAuxiliar = components['schemas']['ClienteAuxiliar']
// Usuario con rol Auxiliar que el Asesor puede autorizar (GET /auxiliares: sin datos sensibles).
export interface AuxiliarDisponible {
  id: string
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  correo_electronico: string
  activo: boolean
}

// Auxiliares autorizados a ayudar en el expediente de un cliente. Autorizar y activar o desactivar es del Asesor dueño.
export function useAuxiliares(clienteId: string) {
  const api = useApi()
  const ruta = `/clientes/${clienteId}/auxiliares`

  return {
    listar: () => api.get<AsignacionAuxiliar[]>(ruta),
    autorizar: (auxiliarId: string) =>
      api.post<AsignacionAuxiliar>(ruta, { auxiliar_id: auxiliarId }),
    cambiarActivo: (asignacionId: string, activo: boolean) =>
      api.patch<AsignacionAuxiliar>(`${ruta}/${asignacionId}`, { activo }),
    // Los nombres no vienen en la asignación: salen de la lista de auxiliares (GET /auxiliares).
    disponibles: () => api.get<AuxiliarDisponible[]>('/auxiliares')
  }
}

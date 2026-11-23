import type {
  GuardarUnificacionNss,
  NssSecundario,
  NuevoNssSecundario,
  UnificacionNss
} from '~/types/correcciones'

// Detalle de unificación de NSS de una corrección (tipo 7, F3). Solo el Asesor dueño. El detalle se crea o se reemplaza
// completo con PUT; sin detalle, el GET responde 404. Los NSS secundarios solo existen cuando ya hay detalle.
export function useUnificacionNss(clienteId: string, correccionId: string) {
  const api = useApi()
  const base = `/clientes/${clienteId}/correcciones/${correccionId}/unificacion-nss`

  return {
    obtener: () => api.get<UnificacionNss>(base),
    guardar: (datos: GuardarUnificacionNss) =>
      api.put<UnificacionNss>(base, datos),
    secundarios: () => api.get<NssSecundario[]>(`${base}/secundarios`),
    agregarSecundario: (datos: NuevoNssSecundario) =>
      api.post<NssSecundario>(`${base}/secundarios`, datos)
  }
}

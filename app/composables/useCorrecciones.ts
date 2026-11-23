import type {
  ActualizarCorreccion,
  Correccion,
  CrearCorreccion,
  TipoCorreccion
} from '~/types/f0'

// Correcciones de datos del cliente (tabla del paso "Correcciones y validaciones" del F0). Solo el Asesor.
export function useCorrecciones(clienteId: string) {
  const api = useApi()

  return {
    tipos: () => api.get<TipoCorreccion[]>('/catalogos/tipos-correccion'),
    listar: () => api.get<Correccion[]>(`/clientes/${clienteId}/correcciones`),
    crear: (datos: CrearCorreccion) =>
      api.post<Correccion>(`/clientes/${clienteId}/correcciones`, datos),
    // Parcial: no se puede cambiar el tipo; observaciones, tiempo y datos aceptan null para borrarse.
    actualizar: (id: string, datos: ActualizarCorreccion) =>
      api.patch<Correccion>(`/clientes/${clienteId}/correcciones/${id}`, datos),
    // Quita una corrección ya resuelta (borrado definitivo).
    eliminar: (id: string) =>
      api.delete(`/clientes/${clienteId}/correcciones/${id}`)
  }
}

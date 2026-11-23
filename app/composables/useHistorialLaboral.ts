import type {
  GuardarHistorialLaboral,
  GuardarIssste,
  HistorialLaboral,
  InformacionIssste
} from '~/types/f0'

// Historial laboral e información ISSSTE de un cliente. Un cliente que aún no los tiene recibe un cuerpo vacío
// (no un error): las lecturas pueden devolver undefined.
export function useHistorialLaboral(clienteId: string) {
  const api = useApi()

  return {
    obtener: () =>
      api.get<HistorialLaboral | undefined>(
        `/clientes/${clienteId}/historial-laboral`
      ),
    // PUT crea o reemplaza (un solo historial por cliente).
    guardar: (datos: GuardarHistorialLaboral) =>
      api.put<HistorialLaboral>(
        `/clientes/${clienteId}/historial-laboral`,
        datos
      ),
    obtenerIssste: () =>
      api.get<InformacionIssste | undefined>(
        `/clientes/${clienteId}/historial-laboral/issste`
      ),
    // PUT crea o reemplaza; responde 409 si el cliente aún no tiene historial laboral.
    guardarIssste: (datos: GuardarIssste) =>
      api.put<InformacionIssste>(
        `/clientes/${clienteId}/historial-laboral/issste`,
        datos
      )
  }
}

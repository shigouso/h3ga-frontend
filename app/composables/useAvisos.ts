import type { Aviso } from '~/types/aviso'

// Avisos del usuario. El backend los genera al consultar (2 días antes de cada compromiso o cita) y entrega a cada rol
// solo los de sus clientes: el Asesor los suyos, el Auxiliar los de sus clientes autorizados y el Supervisor todos.
export function useAvisos() {
  const api = useApi()

  return {
    listar: () => api.get<Aviso[]>('/avisos'),
    atender: (id: string) => api.patch<Aviso>(`/avisos/${id}/atender`)
  }
}

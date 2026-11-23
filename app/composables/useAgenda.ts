import type { EventoAgenda } from '~/types/expediente'

export type NuevoEvento = Pick<
  EventoAgenda,
  'cliente_id' | 'fecha' | 'hora' | 'motivo' | 'estatus'
>

// Agenda de citas. El backend filtra por rol (el Asesor ve las de sus clientes, el Auxiliar las de sus clientes
// autorizados y el Supervisor todas); solo el Asesor agenda, reagenda, cumple o cancela.
export function useAgenda() {
  const api = useApi()

  const avisos = useAvisosStore()
  // Agenda y avisos están conectados: al agendar o reagendar, la campana y el contador vuelven a leer la bandeja,
  // donde el backend genera el aviso del nuevo día.
  const refrescarAvisos = () => {
    void avisos.cargar().catch(() => undefined)
  }

  return {
    listar: () => api.get<EventoAgenda[]>('/agenda'),
    agendar: async (datos: NuevoEvento) => {
      const evento = await api.post<EventoAgenda>('/agenda', datos)
      refrescarAvisos()
      return evento
    },
    actualizar: async (id: string, datos: Partial<NuevoEvento>) => {
      const evento = await api.patch<EventoAgenda>(`/agenda/${id}`, datos)
      refrescarAvisos()
      return evento
    }
  }
}

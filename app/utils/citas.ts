import type { EventoAgenda } from '~/types/expediente'
import { hoyISO } from '~/utils/fechas'

// La cita pendiente más cercana (de hoy en adelante) de un cliente, o null si no tiene.
export function proximaCita(
  eventos: EventoAgenda[],
  clienteId: string,
  hoy: string = hoyISO()
): EventoAgenda | null {
  const futuras = eventos
    .filter(
      e =>
        e.cliente_id === clienteId
        && e.estatus === 'pendiente'
        && e.fecha.slice(0, 10) >= hoy
    )
    .sort((a, b) =>
      `${a.fecha.slice(0, 10)} ${a.hora}`.localeCompare(
        `${b.fecha.slice(0, 10)} ${b.hora}`
      )
    )
  return futuras[0] ?? null
}

// "10:30:00" -> "10:30"
export const horaCorta = (hora: string) => hora.slice(0, 5)

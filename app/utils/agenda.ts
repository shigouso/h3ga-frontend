import type { EventoAgenda } from '~/types/expediente'
import { formatearFechaIngreso } from '~/utils/fechas'

export type Periodo = 'hoy' | 'manana' | 'semana' | 'mes'
export type EstatusEvento = EventoAgenda['estatus']

export const ESTATUS_EVENTO: Record<
  EstatusEvento,
  { texto: string, clase: string }
> = {
  pendiente: { texto: 'Pendiente', clase: 'bg-amber-100 text-amber-800' },
  cumplido: { texto: 'Cumplido', clase: 'bg-green-100 text-green-800' },
  reagendado: { texto: 'Reagendado', clase: 'bg-marca-100 text-marca-800' },
  cancelado: { texto: 'Cancelado', clase: 'bg-neutral-200 text-neutral-600' }
}

const aFecha = (iso: string) => {
  const [a, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(a!, m! - 1, d)
}
const aISO = (f: Date) =>
  `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`

export function sumarDias(fecha: string, n: number): string {
  const f = aFecha(fecha)
  f.setDate(f.getDate() + n)
  return aISO(f)
}

// Rango de fechas ("AAAA-MM-DD") de cada botón de período. La semana va de lunes a domingo.
export function rangoPeriodo(
  periodo: Periodo,
  hoy: string
): { desde: string, hasta: string } {
  if (periodo === 'hoy') return { desde: hoy, hasta: hoy }
  if (periodo === 'manana')
    return { desde: sumarDias(hoy, 1), hasta: sumarDias(hoy, 1) }
  const f = aFecha(hoy)
  if (periodo === 'semana') {
    const desdeLunes = (f.getDay() + 6) % 7
    const desde = sumarDias(hoy, -desdeLunes)
    return { desde, hasta: sumarDias(desde, 6) }
  }
  return {
    desde: aISO(new Date(f.getFullYear(), f.getMonth(), 1)),
    hasta: aISO(new Date(f.getFullYear(), f.getMonth() + 1, 0))
  }
}

// "13:15:00" -> "01:15 PM"
export function hora12(hora: string): string {
  const [h, m] = hora.split(':').map(Number)
  const sufijo = h! >= 12 ? 'PM' : 'AM'
  return `${String(h! % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${sufijo}`
}

// "Hoy, 01:15 PM", "Mañana, 10:30 AM", "20 nov 2026, 10:30 AM"
export function formatearCita(
  fecha: string,
  hora: string,
  hoy: string
): string {
  const dia = fecha.slice(0, 10)
  const nombre
    = dia === hoy
      ? 'Hoy'
      : dia === sumarDias(hoy, 1)
        ? 'Mañana'
        : dia === sumarDias(hoy, -1)
          ? 'Ayer'
          : formatearFechaIngreso(dia)
  return `${nombre}, ${hora12(hora)}`
}

// Números de las tarjetas de la agenda.
export function resumenAgenda(eventos: EventoAgenda[], hoy: string) {
  const semana = rangoPeriodo('semana', hoy)
  const dia = (e: EventoAgenda) => e.fecha.slice(0, 10)
  return {
    hoy: eventos.filter(e => dia(e) === hoy && e.estatus !== 'cancelado')
      .length,
    hoyPendientes: eventos.filter(
      e => dia(e) === hoy && e.estatus === 'pendiente'
    ).length,
    pendientesProximas: eventos.filter(
      e => e.estatus === 'pendiente' && dia(e) >= hoy
    ).length,
    reagendadas: eventos.filter(e => e.estatus === 'reagendado').length,
    cumplidasSemana: eventos.filter(
      e =>
        e.estatus === 'cumplido'
        && dia(e) >= semana.desde
        && dia(e) <= semana.hasta
    ).length
  }
}

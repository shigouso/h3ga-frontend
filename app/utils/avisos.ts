import { rangoPeriodo, sumarDias } from '~/utils/agenda'

// Cuánto falta (o cuánto lleva vencido) el compromiso al que se refiere un aviso.
export function textoVencimientoAviso(fecha: string, hoy: string): string {
  if (fecha === hoy) return 'Vence hoy'
  if (fecha === sumarDias(hoy, 1)) return 'Mañana'
  if (fecha === sumarDias(hoy, -1)) return 'Venció ayer'
  const dias = Math.round(
    (new Date(`${fecha}T00:00:00`).getTime()
      - new Date(`${hoy}T00:00:00`).getTime())
    / 86_400_000
  )
  return dias > 0 ? `En ${dias} días` : `Vencido hace ${-dias} días`
}

// Los avisos de la campana: "Hoy" trae los vencidos y los que vencen hoy; "Esta semana" suma los que vencen hasta el
// domingo. Ambos van de lo más urgente a lo menos (por fecha del compromiso y luego por hora).
export function agruparAvisosCampana<
  T extends { fecha_compromiso: string, hora?: string | null, id: string }
>(avisos: T[], hoy: string): { hoy: T[], semana: T[] } {
  const finDeSemana = rangoPeriodo('semana', hoy).hasta
  const dia = (a: T) => a.fecha_compromiso.slice(0, 10)
  const orden = (a: T, b: T) =>
    dia(a).localeCompare(dia(b))
    || (a.hora ?? '').localeCompare(b.hora ?? '')
    || a.id.localeCompare(b.id)
  const ordenados = [...avisos].sort(orden)
  return {
    hoy: ordenados.filter(a => dia(a) <= hoy),
    semana: ordenados.filter(a => dia(a) <= finDeSemana)
  }
}

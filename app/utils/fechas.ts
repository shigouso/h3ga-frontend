const MESES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic'
]

// "2026-01-12" -> "12 ene 2026". Se arma a mano: new Date('2026-01-12') se interpreta en UTC y en México
// mostraría el día anterior.
export function formatearFechaIngreso(fecha: string): string {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number)
  if (!anio || !mes || !dia) return fecha
  return `${dia} ${MESES[mes - 1]} ${anio}`
}

// Fecha de hoy como "AAAA-MM-DD" en la hora local del navegador (para <input type="date">).
export function hoyISO(): string {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

function aFechaLocal(fecha: string): Date {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number)
  return new Date(anio!, mes! - 1, dia)
}

// Años cumplidos a la fecha indicada.
export function edadDesde(
  fechaNacimiento: string,
  hoy: Date = new Date()
): number {
  const nacimiento = aFechaLocal(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const todavia
    = hoy.getMonth() < nacimiento.getMonth()
      || (hoy.getMonth() === nacimiento.getMonth()
        && hoy.getDate() < nacimiento.getDate())
  if (todavia) edad--
  return edad
}

// Días de calendario desde hoy hasta la fecha ("AAAA-MM-DD"): negativo si ya pasó.
export function diasHasta(fecha: string, hoy: Date = new Date()): number {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return Math.round(
    (aFechaLocal(fecha).getTime() - inicioHoy.getTime()) / 86_400_000
  )
}

export function textoDias(dias: number): string {
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Mañana'
  if (dias === -1) return 'Ayer'
  return dias > 0 ? `En ${dias} días` : `Hace ${-dias} días`
}

// "2026-10-24" -> "24/10/2026"
export function formatearFechaCorta(fecha: string): string {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}

// Un instante (con zona horaria, como lo guarda la base) en la hora local: "21/10/2026 16:45".
export function formatearFechaHora(instante: string): string {
  const d = new Date(instante)
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`
}

// El día local ("AAAA-MM-DD") de un instante con zona horaria; sirve para mostrarlo y para filtrar por fecha.
export function fechaLocalISO(instante: string): string {
  const d = new Date(instante)
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}

import type { FilaCartera } from '~/types/reporte'

// Color de cada estatus en las gráficas del reporte (los nombres vienen de `cartera.estatus`).
export const COLOR_ESTATUS: Record<string, string> = {
  'No aplica': '#d4d4d4',
  'Por iniciar': '#a3a3a3',
  'En proceso cliente': '#4dc9d6',
  'En proceso asesor': '#55b0d4',
  'En proceso Instituto': '#043f43',
  'Finalizado': '#16a34a',
  'Bloqueado': '#e5a50a',
  'Cancelado': '#737373',
  'Detenido': '#e11d48'
}
export const colorEstatus = (nombre: string) =>
  COLOR_ESTATUS[nombre] ?? '#a3a3a3'

// Tramos de una barra de cartera: solo los estatus con clientes, en el orden del catálogo.
export function tramos(fila: FilaCartera, estatus: string[]) {
  return estatus
    .map(nombre => ({ nombre, valor: fila.por_estatus[nombre] ?? 0 }))
    .filter(t => t.valor > 0)
}

// Suma de cada estatus en todas las etapas (para la dona), sin los que valen 0.
export function totalesPorEstatus(etapas: FilaCartera[], estatus: string[]) {
  return estatus
    .map(nombre => ({
      nombre,
      valor: etapas.reduce((a, e) => a + (e.por_estatus[nombre] ?? 0), 0),
      color: colorEstatus(nombre)
    }))
    .filter(t => t.valor > 0)
}

// 0.25 -> "25%"
export const porcentaje = (fraccion: number) =>
  `${Math.round(fraccion * 1000) / 10}%`
// 44.5 -> "44.5%", 20 -> "20%"
export const porcentajeDe = (valor: number) =>
  `${Math.round(valor * 10) / 10}%`

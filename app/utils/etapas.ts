// Los id de estatus son los de la semilla de la tabla de estatus de trámite del backend.
export const ESTATUS_ID = {
  noAplica: 1,
  porIniciar: 2,
  enProceso: [3, 4, 5],
  finalizado: 6,
  bloqueado: 7,
  cancelado: 8,
  detenido: 9
} as const

const esEnProceso = (id: number) =>
  (ESTATUS_ID.enProceso as readonly number[]).includes(id)

// "Etapas actuales": las que se están trabajando o necesitan atención.
export function esEtapaActual(estatusId: number): boolean {
  return (
    esEnProceso(estatusId)
    || estatusId === ESTATUS_ID.bloqueado
    || estatusId === ESTATUS_ID.detenido
  )
}

// Colores de la etiqueta de estatus.
export function claseEstatus(estatusId: number): string {
  if (esEnProceso(estatusId)) return 'bg-marca-100 text-marca-800'
  if (estatusId === ESTATUS_ID.finalizado) return 'bg-green-100 text-green-800'
  if (estatusId === ESTATUS_ID.bloqueado) return 'bg-red-100 text-red-700'
  if (estatusId === ESTATUS_ID.detenido) return 'bg-orange-100 text-orange-700'
  return 'bg-neutral-100 text-neutral-600'
}

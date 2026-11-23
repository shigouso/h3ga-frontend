import { ESTATUS_ID } from '~/utils/etapas'

export type EstadoFormato = 'capturado' | 'pendiente' | 'sin_iniciar'

export const ETIQUETA_FORMATO: Record<EstadoFormato, string> = {
  capturado: 'Capturado',
  pendiente: 'Pendiente',
  sin_iniciar: 'Sin iniciar'
}

// El Formato F0 es la etapa 0 del expediente y el F1 la etapa 1: su estado sale del estatus de esa etapa.
// Finalizado = capturado; en proceso, bloqueado o detenido = pendiente; lo demás = sin iniciar.
export function estadoFormato(estatusId: number | undefined): EstadoFormato {
  if (estatusId === undefined) return 'sin_iniciar'
  if (estatusId === ESTATUS_ID.finalizado) return 'capturado'
  if (
    (ESTATUS_ID.enProceso as readonly number[]).includes(estatusId)
    || estatusId === ESTATUS_ID.bloqueado
    || estatusId === ESTATUS_ID.detenido
  )
    return 'pendiente'
  return 'sin_iniciar'
}

export function claseFormato(estado: EstadoFormato): string {
  if (estado === 'capturado') return 'border-green-600 text-green-700'
  if (estado === 'pendiente') return 'border-amber-500 text-amber-600'
  return 'border-neutral-400 text-neutral-500'
}

export function clasePunto(estado: EstadoFormato): string {
  if (estado === 'capturado') return 'bg-green-600'
  if (estado === 'pendiente') return 'bg-amber-500'
  return 'bg-neutral-400'
}

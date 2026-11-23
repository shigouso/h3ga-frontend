import { hora12 } from '~/utils/agenda'
import { normalizarTexto } from '~/utils/texto'
import { formatearFechaCorta, fechaLocalISO } from '~/utils/fechas'

// Las tres fases de Correcciones son las etapas 2, 3 y 4 del expediente (tabla etapas_tramite).
export const FASES = [
  { clave: 'f2', paso: 2, titulo: 'F2 Corrección de datos', corto: 'F2' },
  { clave: 'f3', paso: 3, titulo: 'F3 Unificación de NSS', corto: 'F3' },
  { clave: 'f4', paso: 4, titulo: 'F4 Recuperación de semanas', corto: 'F4' }
] as const
export type ClaveFase = (typeof FASES)[number]['clave']

// Tipo de corrección "Unificación de NSS": es el F3 (se respalda con un documento del IMSS), no una corrección manual del F2.
export const TIPO_CORRECCION_NSS = 7
// Tipos que modifican el expediente (CURP, RFC, nombre, nacimiento, sexo): el backend exige el dato correcto.
export const TIPOS_CON_DATO_CORRECTO = [1, 2, 4, 5, 6]
// "Otro": dato_actual guarda el nombre del trámite que se especifica.
export const TIPO_CORRECCION_OTRO = 12

// Documentos que respaldan F3 y F4. El catálogo de tipos de documento del backend los trae por nombre; se buscan por un
// fragmento (sin acentos ni mayúsculas) para no depender del número de id.
export const DOCUMENTOS_FASE = {
  f3: [
    {
      clave: 'certificacion',
      fragmento: 'regularizacion y/o correccion de datos personales',
      titulo:
        'Certificación de regularización y/o corrección de datos personales del asegurado',
      origen: 'Lo emite el IMSS',
      ayuda:
        'Solo si el cliente tiene más de un NSS: el IMSS la entrega o la empresa lo ayuda a tramitarla.'
    }
  ],
  f4: [
    {
      clave: 'constancia',
      fragmento: 'constancia de aclaracion de semanas',
      titulo: 'Constancia de Aclaración de Semanas Cotizadas',
      origen: 'Ante el IMSS',
      ayuda:
        'Se sube si la recuperación se gestiona con una aclaración de semanas.'
    },
    {
      clave: 'reintegro',
      fragmento: 'reintegro de recursos',
      titulo: 'Solicitud de Reintegro de Recursos',
      origen: 'Ante la AFORE',
      ayuda:
        'Se sube si la recuperación se gestiona con un reintegro de recursos.'
    }
  ]
} as const

// "Hoy, 01:15 PM", "Ayer, 10:30 AM" o "05/10/2026" (en hora local).
export function formatearActualizado(
  instante: string,
  ahora: Date = new Date()
): string {
  const fecha = new Date(instante)
  const dia = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diferencia = Math.round((dia(ahora) - dia(fecha)) / 86_400_000)
  const hora = hora12(`${fecha.getHours()}:${fecha.getMinutes()}`)
  if (diferencia === 0) return `Hoy, ${hora}`
  if (diferencia === 1) return `Ayer, ${hora}`
  return formatearFechaCorta(fechaLocalISO(instante))
}

// El tipo de documento del catálogo cuyo nombre contiene el fragmento (o null si el backend aún no lo tiene).
export function tipoPorFragmento<T extends { nombre: string }>(
  tipos: T[],
  fragmento: string
): T | null {
  return (
    tipos.find(t => normalizarTexto(t.nombre).includes(fragmento)) ?? null
  )
}

import type { ItemCatalogo, Registro, Seleccion } from '~/types/f1'

export const PASOS_F1 = [
  {
    titulo: 'Objetivo del cliente',
    subtitulo: 'Indique los objetivos para su cliente'
  },
  {
    titulo: 'Documentos requeridos',
    subtitulo: 'Indica si se recibió cada documento'
  },
  {
    titulo: 'Régimen y semanas cotizadas',
    subtitulo:
      'Determinación del régimen y revisión del historial ante el IMSS'
  },
  { titulo: 'Recuperación y aclaración de semanas', subtitulo: '' },
  {
    titulo: 'Conservación y Modalidad 10',
    subtitulo: 'Conservación de derechos y persona trabajadora independiente'
  },
  { titulo: 'Modalidad 40', subtitulo: '' },
  {
    titulo: 'Modalidad 40 con pago retroactivo',
    subtitulo:
      'Pagar meses omitidos, regularizar o reingresar tras una baja por falta de pago'
  },
  {
    titulo: 'Escenarios y análisis financiero',
    subtitulo: 'Elige hasta 3 escenarios y compara su retorno'
  },
  { titulo: 'Recomendación y plan de acción', subtitulo: '' }
]

export interface Opcion {
  valor: string
  etiqueta: string
}
export const SI_NO: Opcion[] = [
  { valor: 'true', etiqueta: 'Sí' },
  { valor: 'false', etiqueta: 'No' }
]
export const SI_NO_VALIDAR: Opcion[] = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
  { valor: 'requiere_validar', etiqueta: 'Requiere validar' }
]
export const TIPOS_PENSION: Opcion[] = [
  { valor: 'cesantia', etiqueta: 'Cesantía' },
  { valor: 'vejez', etiqueta: 'Vejez' },
  { valor: 'invalidez', etiqueta: 'Invalidez' },
  { valor: 'viudez', etiqueta: 'Viudez' },
  { valor: 'otro', etiqueta: 'Otro' }
]
export const ESTADOS_SALUD: Opcion[] = [
  { valor: 'bueno', etiqueta: 'Bueno' },
  { valor: 'regular', etiqueta: 'Regular' },
  { valor: 'malo', etiqueta: 'Malo' }
]
export const ESTADOS_CIVILES: Opcion[] = [
  { valor: 'soltero', etiqueta: 'Soltero' },
  { valor: 'casado', etiqueta: 'Casado' },
  { valor: 'divorciado', etiqueta: 'Divorciado' },
  { valor: 'viudo', etiqueta: 'Viudo' },
  { valor: 'concubinato', etiqueta: 'Concubinato' }
]
export const ESTATUS_PLAN: Opcion[] = [
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'en_proceso', etiqueta: 'En proceso' },
  { valor: 'hecho', etiqueta: 'Hecho' }
]

// Conclusiones preliminares (formato oficial): las de Modalidad 10 y 40 comparten el enum del backend.
export const CONCLUSIONES_M10: Opcion[] = [
  { valor: 'aplica', etiqueta: 'Aplica' },
  { valor: 'no_aplica', etiqueta: 'No aplica' },
  { valor: 'temporal', etiqueta: 'Aplica como estrategia temporal' },
  { valor: 'evaluar', etiqueta: 'Requiere validación adicional' },
  { valor: 'requiere_contabilidad', etiqueta: 'Requiere contabilidad' }
]
export const CONCLUSIONES_M40: Opcion[] = [
  { valor: 'aplica', etiqueta: 'Aplica' },
  { valor: 'no_aplica', etiqueta: 'No aplica' },
  { valor: 'aplica_con_restricciones', etiqueta: 'Aplica con restricciones' },
  {
    valor: 'requiere_regularizacion',
    etiqueta: 'Requiere regularización previa'
  }
]
export const CONCLUSIONES_RETROACTIVO: Opcion[] = [
  { valor: 'conviene', etiqueta: 'Conviene' },
  { valor: 'no_conviene', etiqueta: 'No conviene' },
  { valor: 'conviene_parcialmente', etiqueta: 'Conviene parcialmente' },
  {
    valor: 'requiere_calculo_validacion',
    etiqueta: 'Requiere cálculo financiero y validación IMSS'
  }
]

export const CRITERIOS_M10 = [
  'Tiene actividad independiente real',
  'Tiene CURP, NSS y correo',
  'Puede comprobar ingreso / actividad',
  'Necesita servicios médicos IMSS',
  'Busca generar semanas adicionales',
  'Conviene frente a alta con patrón',
  'Conviene frente a Modalidad 40'
]
export const CRITERIOS_M40 = [
  'Cuenta con baja del régimen obligatorio',
  'Tiene al menos 52 semanas en los últimos 5 años previos a baja',
  'No han pasado más de 5 años desde la baja',
  'El salario elegido no es menor al último salario registrado',
  'El salario elegido no excede el tope permitido',
  'Entiende que Modalidad 40 no otorga servicio médico',
  'Puede cubrir pagos mensuales adelantados'
]
export const PREGUNTAS_RETROACTIVO = [
  '¿El retroactivo mejora salario promedio?',
  '¿Reduce tiempo para pensionarse?',
  '¿El retroactivo agrega semanas útiles?',
  '¿El costo se recupera con incremento de pensión?',
  '¿Evita pérdida de conservación de derechos?',
  '¿Hay riesgo de rechazo o ajuste por IMSS?'
]

// Escenarios sugeridos (sección 10). El nombre es lo que se guarda en `nombre_escenario`.
export const ESCENARIOS_SUGERIDOS = [
  { clave: 'base', nombre: 'Base: pensionarse sin estrategia adicional' },
  { clave: 'm10', nombre: 'Modalidad 10' },
  { clave: 'm40-minima', nombre: 'Modalidad 40 mínima' },
  { clave: 'm40-media', nombre: 'Modalidad 40 media' },
  { clave: 'm40-topada', nombre: 'Modalidad 40 topada' },
  { clave: 'm40-retroactiva', nombre: 'Modalidad 40 retroactiva' },
  { clave: 'recuperacion', nombre: 'Recuperación de semanas' },
  { clave: 'mixto', nombre: 'Mixto: M10 + M40 + recuperación de semanas' }
]
export const MAX_ESCENARIOS = 3

export const ENTERO = /^\d+$/
export const MONTO = /^\d+(\.\d{1,2})?$/

export function errorEntero(texto: string): string | undefined {
  const t = texto.trim()
  return !t || ENTERO.test(t)
    ? undefined
    : 'Debe ser un número entero de 0 o más'
}
export function errorMonto(texto: string): string | undefined {
  const t = texto.trim()
  if (!t) return undefined
  if (!/^\d+(\.\d+)?$/.test(t))
    return 'Ingresa un monto válido (máximo 2 decimales)'
  return MONTO.test(t)
    ? undefined
    : 'Ingresa un monto válido (máximo 2 decimales)'
}
export function errorFecha(texto: string): string | undefined {
  const t = texto.trim()
  return !t || /^\d{4}-\d{2}-\d{2}$/.test(t) ? undefined : 'Fecha no válida'
}

// "50" -> "4 años 2 meses"
export function textoMeses(meses: number): string {
  const anios = Math.floor(meses / 12)
  const resto = meses % 12
  const partes = [
    anios ? `${anios} ${anios === 1 ? 'año' : 'años'}` : '',
    resto ? `${resto} ${resto === 1 ? 'mes' : 'meses'}` : ''
  ]
  return partes.filter(Boolean).join(' ') || '0 meses'
}

export const formatoNumero = (n: number) =>
  new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 }).format(n)

// Listas con "Otro: detalle": de lo que devuelve el backend a lo que se marca en pantalla y de vuelta.
export function aSelecciones(
  items: Registro[] | undefined,
  columna: string
): Seleccion[] {
  return (items ?? []).map(i => ({
    id: Number(i[columna]),
    detalle: typeof i.detalle_otro === 'string' ? i.detalle_otro : ''
  }))
}
export function aItems(
  selecciones: Seleccion[],
  catalogo: ItemCatalogo[],
  columna: string
): Registro[] {
  const marcadas = new Map(selecciones.map(s => [s.id, s]))
  return catalogo
    .filter(c => marcadas.has(c.id))
    .map((c) => {
      const detalle = marcadas.get(c.id)!.detalle.trim()
      return {
        [columna]: c.id,
        ...(c.nombre === 'Otro' && detalle ? { detalle_otro: detalle } : {})
      }
    })
}

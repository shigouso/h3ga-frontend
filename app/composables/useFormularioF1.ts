import type { Ref } from 'vue'
import type { Registro } from '~/types/f1'
import { ApiError } from '~/utils/api-error'
import { errorEntero, errorFecha, errorMonto, type Opcion } from '~/utils/f1'

export type TipoCampoF1
  = | 'texto'
    | 'area'
    | 'entero'
    | 'monto'
    | 'fecha'
    | 'booleano'
    | 'opcion'
    | 'select'
export interface CampoF1 {
  nombre: string
  etiqueta: string
  tipo: TipoCampoF1
  opciones?: Opcion[]
  soloLectura?: boolean
  placeholder?: string
  ayuda?: string
}

function comoTexto(campo: CampoF1, valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  if (campo.tipo === 'booleano') return valor ? 'true' : 'false'
  return String(valor)
}

function convertir(campo: CampoF1, texto: string): unknown {
  const t = texto.trim()
  if (!t) return null
  if (campo.tipo === 'entero' || campo.tipo === 'monto') return Number(t)
  if (campo.tipo === 'booleano') return t === 'true'
  return t
}

// Un error de guardado: los 400 y 409 del backend se muestran tal cual; sin conexión useApi ya avisó. Devuelve false.
export function manejarErrorF1(
  e: unknown,
  errorGeneral: Ref<string | null>
): false {
  if (!(e instanceof ApiError)) throw e
  if (e.status !== 0)
    errorGeneral.value
      = e.status === 400 || e.status === 409
        ? e.mensaje
        : 'No se pudo guardar. Inténtalo de nuevo.'
  return false
}

// Estado de un grupo de campos del diagnóstico: valores como texto (lo que escribe el asesor), validación y un
// cuerpo con solo lo que cambió desde la última vez que se guardó (guardado parcial por paso).
export function useFormularioF1(
  campos: CampoF1[],
  origen: Registro | null | undefined
) {
  const valores = reactive<Record<string, string>>({})
  const errores = reactive<Record<string, string | undefined>>({})
  const errorGeneral = ref<string | null>(null)
  let guardado: Record<string, string> = {}

  for (const c of campos) valores[c.nombre] = comoTexto(c, origen?.[c.nombre])
  guardado = { ...valores }

  function validar(): boolean {
    for (const c of campos) {
      const v = valores[c.nombre] ?? ''
      errores[c.nombre]
        = c.tipo === 'entero'
          ? errorEntero(v)
          : c.tipo === 'monto'
            ? errorMonto(v)
            : c.tipo === 'fecha'
              ? errorFecha(v)
              : undefined
    }
    return campos.every(c => !errores[c.nombre])
  }

  function cuerpo(): Registro {
    const salida: Registro = {}
    for (const c of campos) {
      if (c.soloLectura || valores[c.nombre] === guardado[c.nombre]) continue
      salida[c.nombre] = convertir(c, valores[c.nombre] ?? '')
    }
    return salida
  }

  // Todos los campos con valor (para los PUT que reemplazan un registro completo).
  function completo(): Registro {
    const salida: Registro = {}
    for (const c of campos) {
      if (c.soloLectura) continue
      const v = convertir(c, valores[c.nombre] ?? '')
      if (v !== null) salida[c.nombre] = v
    }
    return salida
  }

  const confirmar = () => {
    guardado = { ...valores }
  }

  async function ejecutar(accion: () => Promise<void>): Promise<boolean> {
    errorGeneral.value = null
    try {
      await accion()
      return true
    } catch (e) {
      return manejarErrorF1(e, errorGeneral)
    }
  }

  return {
    valores,
    errores,
    errorGeneral,
    validar,
    cuerpo,
    completo,
    confirmar,
    ejecutar
  }
}

import type { Registro } from '~/types/f1'
import { errorEntero, errorFecha } from '~/utils/f1'

export interface ColumnaF1 {
  nombre: string
  etiqueta: string
  tipo: 'texto' | 'entero' | 'fecha' | 'select'
  obligatoria?: boolean
  opciones?: { valor: string, etiqueta: string }[]
}
export interface FilaF1 {
  clave: number
  id?: string
  valores: Record<string, string>
  original: Record<string, string>
}

interface Opciones {
  columnas: ColumnaF1[]
  inicial: Registro[]
  porDefecto?: Record<string, string>
  crear: (datos: Registro) => Promise<Registro>
  actualizar: (id: string, datos: Registro) => Promise<Registro>
  eliminar: (id: string) => Promise<unknown>
  mensajeObligatorio: (columna: ColumnaF1) => string
}

// Tabla de filas editables (periodos a revisar, plan de acción): alta, cambio parcial y baja de filas.
export function useFilasF1({
  columnas,
  inicial,
  porDefecto = {},
  crear,
  actualizar,
  eliminar,
  mensajeObligatorio
}: Opciones) {
  let siguiente = 0
  const aTexto = (r: Registro) =>
    Object.fromEntries(
      columnas.map(c => [
        c.nombre,
        r[c.nombre] === null || r[c.nombre] === undefined
          ? ''
          : String(r[c.nombre])
      ])
    )
  const filas = reactive<FilaF1[]>(
    inicial.map((r) => {
      const v = aTexto(r)
      return {
        clave: siguiente++,
        id: String(r.id),
        valores: v,
        original: { ...v }
      }
    })
  )
  const eliminadas = ref<string[]>([])
  const errores = reactive<Record<number, Record<string, string>>>({})

  function agregar() {
    const v = Object.fromEntries(
      columnas.map(c => [c.nombre, porDefecto[c.nombre] ?? ''])
    )
    filas.push({
      clave: siguiente++,
      valores: v,
      original: Object.fromEntries(columnas.map(c => [c.nombre, '']))
    })
  }
  function quitar(i: number) {
    const [fila] = filas.splice(i, 1)
    if (fila?.id) eliminadas.value.push(fila.id)
  }

  // Una fila nueva sin nada escrito se ignora; una con datos debe traer sus campos obligatorios.
  const vacia = (f: FilaF1) =>
    columnas.every(
      c =>
        !(f.valores[c.nombre] ?? '').trim()
        || (c.nombre in porDefecto
          && f.valores[c.nombre] === porDefecto[c.nombre])
    )

  function validar(): boolean {
    for (const f of filas) {
      const e: Record<string, string> = {}
      if (f.id || !vacia(f)) {
        for (const c of columnas) {
          const v = f.valores[c.nombre] ?? ''
          if (c.obligatoria && !v.trim()) e[c.nombre] = mensajeObligatorio(c)
          else if (c.tipo === 'entero' && errorEntero(v))
            e[c.nombre] = errorEntero(v)!
          else if (c.tipo === 'fecha' && errorFecha(v))
            e[c.nombre] = errorFecha(v)!
        }
      }
      errores[f.clave] = e
    }
    return filas.every(f => Object.keys(errores[f.clave] ?? {}).length === 0)
  }

  const convertir = (c: ColumnaF1, v: string) =>
    c.tipo === 'entero' ? Number(v) : v.trim()

  async function enviar() {
    for (const id of eliminadas.value) await eliminar(id)
    eliminadas.value = []
    for (const f of filas) {
      if (!f.id) {
        if (vacia(f)) continue
        const datos: Registro = {}
        for (const c of columnas)
          if ((f.valores[c.nombre] ?? '').trim())
            datos[c.nombre] = convertir(c, f.valores[c.nombre]!)
        f.id = String((await crear(datos)).id)
      } else {
        const cambios: Registro = {}
        for (const c of columnas) {
          if (f.valores[c.nombre] === f.original[c.nombre]) continue
          cambios[c.nombre] = (f.valores[c.nombre] ?? '').trim()
            ? convertir(c, f.valores[c.nombre]!)
            : null
        }
        if (Object.keys(cambios).length === 0) continue
        await actualizar(f.id, cambios)
      }
      f.original = { ...f.valores }
    }
  }

  const hayCambios = () =>
    eliminadas.value.length > 0
    || filas.some(f =>
      !f.id
        ? !vacia(f)
        : columnas.some(c => f.valores[c.nombre] !== f.original[c.nombre])
    )

  return { filas, errores, agregar, quitar, validar, enviar, hayCambios }
}

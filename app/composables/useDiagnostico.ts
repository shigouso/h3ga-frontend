import type {
  Accion,
  ActualizarDiagnostico,
  Diagnostico,
  Escenario,
  Periodo,
  Registro
} from '~/types/f1'

// Diagnóstico Especializado (F1) de un cliente. Solo el Asesor dueño. El diagnóstico es un borrador que se guarda por
// secciones: las listas con "Otro: detalle" se reemplazan completas con PUT; análisis, escenarios, plan y periodos
// tienen sus propias rutas. Un cliente sin diagnóstico recibe un cuerpo vacío (undefined), no un error.
export function useDiagnostico(clienteId: string) {
  const api = useApi()
  const base = `/clientes/${clienteId}`
  const D = `${base}/diagnostico`

  function coleccion<T>(ruta: string) {
    return {
      listar: () => api.get<T[]>(ruta),
      crear: (datos: Registro) => api.post<T>(ruta, datos),
      actualizar: (id: string, datos: Registro) =>
        api.patch<T>(`${ruta}/${id}`, datos)
    }
  }

  return {
    obtener: () => api.get<Diagnostico | undefined>(D),
    crear: (datos: ActualizarDiagnostico = {}) =>
      api.post<Diagnostico>(D, datos),
    actualizar: (datos: ActualizarDiagnostico) =>
      api.patch<Diagnostico>(D, datos),
    leerLista: (clave: string) => api.get<Registro[]>(`${D}/${clave}`),
    reemplazarLista: (clave: string, items: Registro[]) =>
      api.put<Registro[]>(`${D}/${clave}`, { items }),
    obtenerRecuperacion: () =>
      api.get<Registro | undefined>(`${D}/recuperacion-semanas`),
    guardarRecuperacion: (datos: Registro) =>
      api.put<Registro>(`${D}/recuperacion-semanas`, datos),
    obtenerRetroactivo: () =>
      api.get<Registro | undefined>(`${D}/modalidad-40-retroactivo`),
    guardarRetroactivo: (datos: Registro) =>
      api.put<Registro>(`${D}/modalidad-40-retroactivo`, datos),
    obtenerPatrimonial: () =>
      api.get<Registro | undefined>(`${D}/situacion-patrimonial`),
    guardarPatrimonial: (datos: Registro) =>
      api.put<Registro>(`${D}/situacion-patrimonial`, datos),
    escenarios: {
      ...coleccion<Escenario>(`${D}/escenarios`),
      eliminar: (id: string) => api.delete(`${D}/escenarios/${id}`)
    },
    plan: {
      ...coleccion<Accion>(`${D}/plan-accion`),
      eliminar: (id: string) => api.delete(`${D}/plan-accion/${id}`)
    },
    periodos: {
      ...coleccion<Periodo>(`${base}/periodos-inconsistencias`),
      eliminar: (id: string) =>
        api.delete(`${base}/periodos-inconsistencias/${id}`)
    },
    descargarPdf: () => api.descargar(`${D}/pdf`, `F1-${clienteId}.pdf`)
  }
}

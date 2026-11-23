import type { InjectionKey, Ref } from 'vue'
import type { Cliente } from '~/types/cliente'
import type {
  Accion,
  ActualizarDiagnostico,
  Diagnostico,
  Escenario,
  ItemCatalogo,
  Periodo,
  Registro
} from '~/types/f1'

// Claves de las listas con PUT (ruta bajo /clientes/:id/diagnostico/).
export const LISTAS_F1 = [
  'objetivos',
  'estrategias-recomendadas',
  'inconsistencias-generales',
  'objetivos-modalidad-10',
  'objetivos-modalidad-40',
  'recuperacion-gestiones',
  'recuperacion-evidencias',
  'documentos',
  'criterios-modalidad-10',
  'criterios-modalidad-40',
  'conveniencia-retroactivo',
  'situacion-patrimonial/hijos'
]
const CATALOGOS_F1: Record<string, string> = {
  objetivos: 'objetivos-diagnostico',
  estrategias: 'estrategias-recomendadas',
  inconsistencias: 'tipos-inconsistencia',
  gestiones: 'tipos-gestion-recuperacion',
  evidencias: 'tipos-evidencia-recuperacion',
  m10: 'objetivos-modalidad-10',
  m40: 'objetivos-modalidad-40',
  documentos: 'documentos-diagnostico',
  leyes: 'leyes-probables'
}

// Estado y operaciones compartidas por los pasos del F1: la pantalla lo crea y cada paso lo recibe con useF1().
export function crearContextoF1(clienteId: string, cliente: Ref<Cliente>) {
  const api = useDiagnostico(clienteId)
  const apiCatalogos = useApi()

  const diagnostico = ref<Diagnostico | null>(null)
  const catalogos = reactive<Record<string, ItemCatalogo[]>>({})
  const listas = reactive<Record<string, Registro[]>>({})
  const recuperacion = ref<Registro | null>(null)
  const retroactivo = ref<Registro | null>(null)
  const patrimonial = ref<Registro | null>(null)
  const escenarios = ref<Escenario[]>([])
  const plan = ref<Accion[]>([])
  const periodos = ref<Periodo[]>([])
  const ultimoPatron = ref('')
  // Si no se pudo leer el diagnóstico no se ofrece guardar: crearía un segundo borrador.
  const disponible = ref(true)
  const cargando = ref(true)

  async function cargar() {
    const quieta = <T>(p: Promise<T>, asignar: (v: T) => void) =>
      p.then(asignar).catch(() => undefined)
    await Promise.all([
      ...Object.entries(CATALOGOS_F1).map(([clave, ruta]) =>
        quieta(apiCatalogos.get<ItemCatalogo[]>(`/catalogos/${ruta}`), (v) => {
          catalogos[clave] = v
        })
      ),
      quieta(useHistorialLaboral(clienteId).obtener(), (v) => {
        ultimoPatron.value = v?.ultimo_patron ?? ''
      }),
      api
        .obtener()
        .then(async (d) => {
          diagnostico.value = d ?? null
          if (!d) return
          await Promise.all([
            ...LISTAS_F1.map(clave =>
              quieta(api.leerLista(clave), (v) => {
                listas[clave] = v
              })
            ),
            quieta(api.obtenerRecuperacion(), (v) => {
              recuperacion.value = v ?? null
            }),
            quieta(api.obtenerRetroactivo(), (v) => {
              retroactivo.value = v ?? null
            }),
            quieta(api.obtenerPatrimonial(), (v) => {
              patrimonial.value = v ?? null
            }),
            quieta(api.escenarios.listar(), (v) => {
              escenarios.value = v
            }),
            quieta(api.plan.listar(), (v) => {
              plan.value = v
            }),
            quieta(api.periodos.listar(), (v) => {
              periodos.value = v
            })
          ])
        })
        .catch(() => {
          disponible.value = false
        })
    ])
    cargando.value = false
  }

  // El primer guardado crea el borrador; los siguientes lo reutilizan.
  async function asegurar(): Promise<Diagnostico> {
    if (!diagnostico.value) diagnostico.value = await api.crear({})
    return diagnostico.value
  }
  async function guardarCampos(cuerpo: ActualizarDiagnostico) {
    await asegurar()
    if (Object.keys(cuerpo).length > 0)
      diagnostico.value = await api.actualizar(cuerpo)
  }
  async function guardarLista(clave: string, items: Registro[]) {
    await asegurar()
    listas[clave] = await api.reemplazarLista(clave, items)
  }
  async function guardarRecuperacion(datos: Registro) {
    await asegurar()
    recuperacion.value = await api.guardarRecuperacion(datos)
  }
  async function guardarRetroactivo(datos: Registro) {
    await asegurar()
    retroactivo.value = await api.guardarRetroactivo(datos)
  }
  async function guardarPatrimonial(datos: Registro) {
    await asegurar()
    patrimonial.value = await api.guardarPatrimonial(datos)
  }

  return {
    api,
    cliente,
    diagnostico,
    catalogos,
    listas,
    recuperacion,
    retroactivo,
    patrimonial,
    escenarios,
    plan,
    periodos,
    ultimoPatron,
    disponible,
    cargando,
    cargar,
    asegurar,
    guardarCampos,
    guardarLista,
    guardarRecuperacion,
    guardarRetroactivo,
    guardarPatrimonial
  }
}

export type ContextoF1 = ReturnType<typeof crearContextoF1>
const CLAVE: InjectionKey<ContextoF1> = Symbol('contexto-f1')
export const proveerF1 = (contexto: ContextoF1) => provide(CLAVE, contexto)
export function useF1(): ContextoF1 {
  const contexto = inject(CLAVE)
  if (!contexto)
    throw new Error('useF1() solo se usa dentro de la pantalla del F1')
  return contexto
}

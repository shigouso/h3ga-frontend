import type { Aviso } from '~/types/aviso'
import type { CatalogosCliente, Cliente } from '~/types/cliente'
import type {
  DocumentoCliente,
  EstatusTramite,
  EtapasCliente,
  EventoAgenda
} from '~/types/expediente'
import type { Usuario } from '~/types/usuario'
import { ApiError } from '~/utils/api-error'
import { puede } from '~/utils/permisos'

// Todo lo que muestran el expediente y la pantalla de archivos de un cliente. El cliente es lo único
// indispensable; lo demás (etapas, catálogos, documentos, citas, avisos) se carga aparte y, si falla,
// la pantalla sigue funcionando sin ello (useApi ya avisó los 403 y los errores de red).
export function useExpediente(clienteId: string) {
  const sesion = useSessionStore()
  const clientes = useClientes()
  const apiUsuarios = useUsuarios()
  const apiDocumentos = useDocumentos()
  const api = useApi()

  const cliente = ref<Cliente | null>(null)
  const etapas = ref<EtapasCliente | null>(null)
  const estatus = ref<EstatusTramite[]>([])
  const catalogos = ref<CatalogosCliente | null>(null)
  const usuarios = ref<Usuario[]>([])
  const documentos = ref<DocumentoCliente[]>([])
  const eventos = ref<EventoAgenda[] | null>(null)
  const avisos = ref<Aviso[]>([])
  const cargando = ref(true)
  const estado = ref<'ok' | 'no-encontrado' | 'fallo'>('ok')
  const documentosFallo = ref(false)

  async function cargarDocumentos() {
    documentosFallo.value = false
    try {
      documentos.value = await apiDocumentos.listar(clienteId)
    } catch {
      documentosFallo.value = true
    }
  }

  async function cargar() {
    cargando.value = true
    estado.value = 'ok'
    try {
      cliente.value = await clientes.obtener(clienteId)
    } catch (error) {
      estado.value
        = error instanceof ApiError && error.status === 404
          ? 'no-encontrado'
          : 'fallo'
      cargando.value = false
      return
    }

    const rol = sesion.usuario?.rol
    const leer = <T>(promesa: Promise<T>, asignar: (valor: T) => void) =>
      promesa.then(asignar).catch(() => undefined)
    await Promise.all([
      leer(api.get<EtapasCliente>(`/clientes/${clienteId}/etapas`), (v) => {
        etapas.value = v
      }),
      leer(api.get<EstatusTramite[]>('/catalogos/estatus'), (v) => {
        estatus.value = v
      }),
      leer(clientes.catalogos(), (v) => {
        catalogos.value = v
      }),
      leer(api.get<EventoAgenda[]>('/agenda'), (v) => {
        eventos.value = v
      }),
      leer(api.get<Aviso[]>('/avisos', { query: { atendido: false } }), (v) => {
        avisos.value = v
      }),
      cargarDocumentos(),
      // Solo el Supervisor puede leer los usuarios: de ahí sale el nombre del asesor.
      rol && puede(rol, 'usuarios.administrar')
        ? leer(apiUsuarios.listar(), (v) => {
            usuarios.value = v
          })
        : Promise.resolve()
    ])
    cargando.value = false
  }

  // Tras un cambio de estatus (o si el backend lo rechazó) las etapas y el avance global se vuelven a pedir.
  async function recargarEtapas() {
    try {
      etapas.value = await api.get<EtapasCliente>(
        `/clientes/${clienteId}/etapas`
      )
    } catch {
      // useApi ya avisó los 403 y los errores de red; se conservan las etapas que ya había.
    }
  }

  const nombreEstatus = (id: number) =>
    estatus.value.find(e => e.id === id)?.nombre ?? ''

  // El Supervisor lo toma de los usuarios; el Asesor ve su propio nombre en sus clientes; el Auxiliar no lo ve.
  const asesorNombre = computed(() => {
    if (!cliente.value || !sesion.usuario) return null
    if (sesion.usuario.rol === 'supervisor') {
      const asesor = usuarios.value.find(
        u => u.id === cliente.value!.asesor_id
      )
      return asesor
        ? `${asesor.nombre} ${asesor.apellido_paterno}`.trim()
        : null
    }
    return sesion.usuario.rol === 'asesor'
      && sesion.usuario.id === cliente.value.asesor_id
      ? sesion.usuario.nombre
      : null
  })

  onMounted(cargar)

  return {
    cliente,
    etapas,
    estatus,
    catalogos,
    usuarios,
    documentos,
    eventos,
    avisos,
    cargando,
    estado,
    documentosFallo,
    asesorNombre,
    nombreEstatus,
    cargar,
    cargarDocumentos,
    recargarEtapas
  }
}

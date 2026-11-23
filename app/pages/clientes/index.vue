<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import type { Usuario } from '~/types/usuario'
import { formatearFechaIngreso } from '~/utils/fechas'
import { puede } from '~/utils/permisos'
import { ROL_ID } from '~/utils/roles'
import { normalizarTexto } from '~/utils/texto'

definePageMeta({ titulo: 'Clientes' })

const sesion = useSessionStore()
const api = useClientes()
const apiUsuarios = useUsuarios()
const toast = useToast()

const clientes = ref<Cliente[]>([])
const usuarios = ref<Usuario[]>([])
const cargando = ref(true)
const falloCarga = ref(false)

const busqueda = ref('')
const filtroAsesor = ref('')
const ingresoDesde = ref('')

const puedeCrear = computed(() => (sesion.usuario ? puede(sesion.usuario.rol, 'clientes.crear') : false))
const puedeReasignar = computed(() => (sesion.usuario ? puede(sesion.usuario.rol, 'clientes.reasignar') : false))

async function cargar() {
  cargando.value = true
  falloCarga.value = false
  try {
    clientes.value = await api.listar()
  }
  catch {
    // useApi ya avisó los 403 y los errores de red; aquí solo se deja de mostrar "cargando".
    falloCarga.value = true
    cargando.value = false
    return
  }
  cargando.value = false
  // Solo el Supervisor puede leer los usuarios: de ahí salen los nombres de los asesores. Si falla,
  // el listado sigue funcionando sin ellos.
  if (puedeReasignar.value) {
    try {
      usuarios.value = await apiUsuarios.listar()
    }
    catch {
      usuarios.value = []
    }
  }
}
onMounted(cargar)

const nombreCompleto = (c: Cliente) => [c.nombre, c.apellido_paterno, c.apellido_materno].filter(Boolean).join(' ')
const iniciales = (c: Cliente) => `${c.nombre.charAt(0)}${c.apellido_paterno.charAt(0)}`.toUpperCase()
const nombreUsuario = (u: Usuario) => `${u.nombre} ${u.apellido_paterno}`.trim()
const nombreAsesor = (id: string) => {
  const asesor = usuarios.value.find(u => u.id === id)
  return asesor ? nombreUsuario(asesor) : null
}

const asesoresDelFiltro = computed(() => usuarios.value.filter(u => u.rol_id === ROL_ID.asesor))

const filtrados = computed(() => {
  const texto = normalizarTexto(busqueda.value)
  return clientes.value.filter((c) => {
    if (filtroAsesor.value && c.asesor_id !== filtroAsesor.value) return false
    if (ingresoDesde.value && c.fecha_ingreso.slice(0, 10) < ingresoDesde.value) return false
    return !texto || normalizarTexto(`${nombreCompleto(c)} ${c.curp ?? ''}`).includes(texto)
  })
})
const hayFiltros = computed(() => Boolean(busqueda.value || filtroAsesor.value || ingresoDesde.value))

function limpiarFiltros() {
  busqueda.value = ''
  filtroAsesor.value = ''
  ingresoDesde.value = ''
}

// Reasignar el expediente a otro asesor (solo Supervisor).
const reasignarAbierto = ref(false)
const clienteAReasignar = ref<Cliente | null>(null)
const nuevoAsesor = ref('')
const reasignando = ref(false)
const asesoresDisponibles = computed(() =>
  usuarios.value.filter(u => u.rol_id === ROL_ID.asesor && u.activo && u.id !== clienteAReasignar.value?.asesor_id),
)

function pedirReasignar(cliente: Cliente) {
  clienteAReasignar.value = cliente
  nuevoAsesor.value = ''
  reasignarAbierto.value = true
}

async function confirmarReasignar() {
  if (!clienteAReasignar.value || !nuevoAsesor.value) return
  reasignando.value = true
  try {
    const actualizado = await api.reasignar(clienteAReasignar.value.id, nuevoAsesor.value)
    const i = clientes.value.findIndex(c => c.id === actualizado.id)
    if (i >= 0) clientes.value[i] = actualizado
    toast.add({ title: 'Cliente reasignado', description: `${nombreCompleto(actualizado)} → ${nombreAsesor(actualizado.asesor_id) ?? 'nuevo asesor'}`, color: 'success' })
    reasignarAbierto.value = false
  }
  catch {
    // useApi ya avisó los 403 y los errores de red; los demás se muestran aquí.
    toast.add({ title: 'No se pudo reasignar', description: 'Inténtalo de nuevo.', color: 'error' })
  }
  finally {
    reasignando.value = false
  }
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl font-semibold text-profundo-700">
          Clientes
        </h2>
        <p class="text-neutral-700">
          Consulta y da seguimiento a los expedientes de tus clientes.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <div
          data-total-clientes
          class="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 shadow-sm"
        >
          <span class="flex size-8 items-center justify-center rounded-lg bg-acento-100 text-base font-semibold text-acento-700">{{ clientes.length }}</span>
          <span class="pr-2 text-sm text-neutral-700">{{ clientes.length === 1 ? 'Cliente' : 'Clientes' }}</span>
        </div>
        <UButton
          v-if="puedeCrear"
          to="/clientes/nuevo"
          data-accion="nuevo"
          icon="i-lucide-plus"
          size="lg"
          class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
        >
          Nuevo cliente
        </UButton>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <UInput
        v-model="busqueda"
        type="search"
        name="buscar"
        icon="i-lucide-search"
        placeholder="Buscar por nombre o CURP"
        aria-label="Buscar cliente por nombre o CURP"
        class="min-w-64 flex-1"
      />
      <select
        v-if="puedeReasignar && asesoresDelFiltro.length"
        v-model="filtroAsesor"
        name="filtro-asesor"
        aria-label="Filtrar por asesor"
        class="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">
          Todos los asesores
        </option>
        <option
          v-for="asesor in asesoresDelFiltro"
          :key="asesor.id"
          :value="asesor.id"
        >
          {{ nombreUsuario(asesor) }}
        </option>
      </select>
      <label class="flex items-center gap-2 text-sm text-neutral-700">
        Ingreso desde
        <input
          v-model="ingresoDesde"
          type="date"
          name="ingreso-desde"
          class="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
      </label>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-filter-x"
        data-accion="limpiar-filtros"
        :disabled="!hayFiltros"
        @click="limpiarFiltros"
      >
        Limpiar filtros
      </UButton>
    </div>

    <p
      v-if="cargando"
      class="py-10 text-center text-neutral-500"
      role="status"
    >
      Cargando clientes…
    </p>

    <div
      v-else-if="falloCarga"
      class="py-10 text-center"
      role="alert"
    >
      <p class="text-red-700">
        No se pudieron cargar los clientes.
      </p>
      <UButton
        class="mt-3"
        color="neutral"
        variant="outline"
        data-accion="reintentar"
        @click="cargar"
      >
        Reintentar
      </UButton>
    </div>

    <template v-else>
      <p class="font-medium text-marca-800">
        {{ filtrados.length }} {{ filtrados.length === 1 ? 'cliente encontrado' : 'clientes encontrados' }}
      </p>

      <p
        v-if="clientes.length === 0"
        class="rounded-xl border border-dashed border-neutral-300 bg-white py-10 text-center text-neutral-500"
      >
        Aún no hay clientes registrados.
      </p>
      <p
        v-else-if="filtrados.length === 0"
        class="rounded-xl border border-dashed border-neutral-300 bg-white py-10 text-center text-neutral-500"
      >
        No hay clientes que coincidan con la búsqueda.
      </p>

      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="cliente in filtrados"
          :key="cliente.id"
          data-cliente
          class="flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm ring-1 ring-white"
        >
          <div class="flex items-center gap-3">
            <span class="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-marca-300 bg-marca-100 text-lg font-semibold text-marca-800 shadow-inner">{{ iniciales(cliente) }}</span>
            <div class="min-w-0">
              <h3 class="font-semibold text-neutral-900">
                {{ nombreCompleto(cliente) }}
              </h3>
              <span
                v-if="puedeReasignar && nombreAsesor(cliente.asesor_id)"
                data-asesor
                class="mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded border border-neutral-400 bg-white px-2 py-0.5 text-xs text-neutral-800"
              >
                <UIcon
                  name="i-lucide-user-round"
                  class="size-3.5"
                />
                Asesor(a) {{ nombreAsesor(cliente.asesor_id) }}
              </span>
            </div>
          </div>

          <dl class="mt-4 flex items-center justify-between border-y border-neutral-200 py-3 text-sm">
            <dt class="flex items-center gap-2 text-neutral-500">
              <UIcon
                name="i-lucide-calendar-days"
                class="size-4"
              />
              Fecha de ingreso
            </dt>
            <dd class="text-neutral-800">
              {{ formatearFechaIngreso(cliente.fecha_ingreso) }}
            </dd>
          </dl>

          <div class="mt-auto flex flex-wrap gap-2 pt-4">
            <UButton
              :to="`/clientes/${cliente.id}`"
              data-accion="ver-detalles"
              trailing-icon="i-lucide-chevron-right"
              size="lg"
              class="min-w-0 flex-1 justify-center whitespace-nowrap bg-acento-500 font-semibold text-profundo-900 shadow-md hover:bg-acento-400"
            >
              Ver detalles
            </UButton>
            <UButton
              :to="`/clientes/${cliente.id}/archivos`"
              data-accion="ver-archivos"
              color="neutral"
              variant="outline"
              icon="i-lucide-folder"
              size="lg"
              class="min-w-0 flex-1 justify-center whitespace-nowrap bg-white font-medium shadow-md"
            >
              Ver archivos
            </UButton>
          </div>
          <UButton
            v-if="puedeReasignar"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-user-round-cog"
            class="mt-2 self-start"
            data-accion="reasignar"
            @click="pedirReasignar(cliente)"
          >
            Reasignar asesor
          </UButton>
        </article>
      </div>
    </template>

    <UModal
      v-model:open="reasignarAbierto"
      title="Reasignar cliente"
      description="Elige al asesor que llevará el expediente."
    >
      <template #body>
        <p
          v-if="clienteAReasignar"
          class="mb-4"
        >
          <strong>{{ nombreCompleto(clienteAReasignar) }}</strong>
        </p>
        <label class="block text-sm font-medium text-neutral-800">
          Nuevo asesor
          <select
            v-model="nuevoAsesor"
            name="nuevo-asesor"
            class="mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900"
          >
            <option value="">
              Selecciona un asesor
            </option>
            <option
              v-for="asesor in asesoresDisponibles"
              :key="asesor.id"
              :value="asesor.id"
            >
              {{ nombreUsuario(asesor) }}
            </option>
          </select>
        </label>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            color="neutral"
            variant="outline"
            data-accion="cancelar-reasignar"
            @click="reasignarAbierto = false"
          >
            Cancelar
          </UButton>
          <UButton
            data-accion="confirmar-reasignar"
            :disabled="!nuevoAsesor"
            :loading="reasignando"
            class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
            @click="confirmarReasignar"
          >
            Reasignar
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

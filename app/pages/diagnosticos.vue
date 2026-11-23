<script setup lang="ts">
import type { CatalogoItem, Cliente } from '~/types/cliente'
import {
  claseFormato,
  clasePunto,
  estadoFormato,
  ETIQUETA_FORMATO,
  type EstadoFormato
} from '~/utils/diagnosticos'
import { formatearFechaIngreso } from '~/utils/fechas'
import { normalizarTexto } from '~/utils/texto'

definePageMeta({ titulo: 'Diagnósticos y expedientes' })

const TAM_PAGINA = 10
const DIAS_RECIENTES = 90

const api = useClientes()

const clientes = ref<Cliente[]>([])
const regimenes = ref<CatalogoItem[]>([])
const cargando = ref(true)
const falloCarga = ref(false)
// Estado de los formatos de cada cliente: null = no se pudo leer; sin entrada = aún se está leyendo.
const formatos = reactive<
  Record<string, { f0: EstadoFormato, f1: EstadoFormato } | null>
>({})
const formatosCargados = ref(false)

async function cargar() {
  cargando.value = true
  falloCarga.value = false
  formatosCargados.value = false
  try {
    clientes.value = await api.listar()
  } catch {
    // useApi ya avisó los 403 y los errores de red.
    falloCarga.value = true
    cargando.value = false
    return
  }
  cargando.value = false
  // Los nombres de régimen son un adorno: si el catálogo falla, la lista sigue sin ellos.
  try {
    regimenes.value = await api.regimenes()
  } catch {
    regimenes.value = []
  }
  // No hay un dato "F0 capturado" en la API: se deduce del estatus de las etapas 0 y 1 de cada cliente.
  await Promise.all(
    clientes.value.map(async (c) => {
      try {
        const { etapas } = await useEtapas(c.id).listar()
        formatos[c.id] = {
          f0: estadoFormato(
            etapas.find(e => e.numero_paso === 0)?.estatus_id
          ),
          f1: estadoFormato(
            etapas.find(e => e.numero_paso === 1)?.estatus_id
          )
        }
      } catch {
        formatos[c.id] = null
      }
    })
  )
  formatosCargados.value = true
}
onMounted(cargar)

const nombreCompleto = (c: Cliente) =>
  [c.nombre, c.apellido_paterno, c.apellido_materno].filter(Boolean).join(' ')
const iniciales = (c: Cliente) =>
  `${c.nombre.charAt(0)}${c.apellido_paterno.charAt(0)}`.toUpperCase()
const nombreRegimen = (c: Cliente) =>
  regimenes.value.find(r => r.id === c.regimen_id)?.nombre ?? '—'

const busqueda = ref('')
const filtroEstatus = ref('')
const filtroRegimen = ref('')
const orden = ref<'reciente' | 'antiguo'>('reciente')
const registroDesde = ref('')
const pagina = ref(1)

const filtrados = computed(() => {
  const texto = normalizarTexto(busqueda.value)
  const lista = clientes.value.filter((c) => {
    if (filtroRegimen.value && String(c.regimen_id) !== filtroRegimen.value)
      return false
    if (
      registroDesde.value
      && c.fecha_ingreso.slice(0, 10) < registroDesde.value
    )
      return false
    if (filtroEstatus.value) {
      const f = formatos[c.id]
      if (!f || (f.f0 !== filtroEstatus.value && f.f1 !== filtroEstatus.value))
        return false
    }
    return (
      !texto
      || normalizarTexto(`${nombreCompleto(c)} ${c.nss ?? ''}`).includes(texto)
    )
  })
  const signo = orden.value === 'reciente' ? -1 : 1
  return lista.toSorted(
    (a, b) => signo * a.fecha_ingreso.localeCompare(b.fecha_ingreso)
  )
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(filtrados.value.length / TAM_PAGINA))
)
const visibles = computed(() =>
  filtrados.value.slice(
    (pagina.value - 1) * TAM_PAGINA,
    pagina.value * TAM_PAGINA
  )
)
watch([busqueda, filtroEstatus, filtroRegimen, orden, registroDesde], () => {
  pagina.value = 1
})

// Números de página con "…" cuando son muchas: 1 … 4 5 6 … 10.
const paginas = computed<(number | null)[]>(() => {
  const total = totalPaginas.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const cerca = [pagina.value - 1, pagina.value, pagina.value + 1].filter(
    n => n > 1 && n < total
  )
  const lista: (number | null)[] = [1]
  if (cerca[0]! > 2) lista.push(null)
  lista.push(...cerca)
  if (cerca.at(-1)! < total - 1) lista.push(null)
  lista.push(total)
  return lista
})

const conPendientes = computed(
  () =>
    clientes.value.filter((c) => {
      const f = formatos[c.id]
      return f && (f.f0 !== 'capturado' || f.f1 !== 'capturado')
    }).length
)

const hayFiltros = computed(() =>
  Boolean(
    busqueda.value
    || filtroEstatus.value
    || filtroRegimen.value
    || registroDesde.value
    || orden.value !== 'reciente'
  )
)
function limpiarFiltros() {
  busqueda.value = ''
  filtroEstatus.value = ''
  filtroRegimen.value = ''
  registroDesde.value = ''
  orden.value = 'reciente'
}

function fechaUltimosDias() {
  const d = new Date()
  d.setDate(d.getDate() - DIAS_RECIENTES)
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}
// El botón se resalta mientras el filtro de fecha sea justo el de los últimos días.
const ultimosDiasActivo = computed(
  () => registroDesde.value === fechaUltimosDias()
)
function ultimosDias() {
  registroDesde.value = fechaUltimosDias()
}

const claseCampo
  = 'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm'
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="font-display text-3xl font-semibold text-profundo-700">
          ¡Empieza por tus primeros diagnósticos!
        </h2>
        <p class="text-neutral-700">
          Captura el Formato F0, genera el diagnóstico F1 y entrega el dictamen
          técnico.
        </p>
      </div>
      <div
        data-pendientes
        class="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 shadow-sm"
      >
        <span
          class="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-base font-semibold text-amber-700"
        >{{ conPendientes }}</span>
        <span class="pr-2 text-sm text-neutral-700">Expedientes con pendientes</span>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <UInput
        v-model="busqueda"
        type="search"
        name="buscar"
        icon="i-lucide-search"
        placeholder="Buscar por nombre o NSS"
        aria-label="Buscar cliente por nombre o NSS"
        class="min-w-56 flex-1"
      />
      <select
        v-model="filtroEstatus"
        name="filtro-estatus"
        aria-label="Filtrar por estatus"
        :class="claseCampo"
      >
        <option value="">
          Todos los estatus
        </option>
        <option value="capturado">
          Capturado
        </option>
        <option value="pendiente">
          Pendiente
        </option>
        <option value="sin_iniciar">
          Sin iniciar
        </option>
      </select>
      <select
        v-model="filtroRegimen"
        name="filtro-regimen"
        aria-label="Filtrar por régimen"
        :class="claseCampo"
      >
        <option value="">
          Todos los regímenes
        </option>
        <option
          v-for="r in regimenes"
          :key="r.id"
          :value="String(r.id)"
        >
          {{ r.nombre }}
        </option>
      </select>
      <select
        v-model="orden"
        name="orden"
        aria-label="Ordenar por registro"
        :class="claseCampo"
      >
        <option value="reciente">
          Registro más reciente
        </option>
        <option value="antiguo">
          Registro más antiguo
        </option>
      </select>
      <label class="flex items-center gap-2 text-sm text-neutral-700">
        <UIcon
          name="i-lucide-calendar-days"
          class="size-4"
        />
        <input
          v-model="registroDesde"
          type="date"
          name="registro-desde"
          aria-label="Registro desde"
          :class="claseCampo"
        >
      </label>
      <UButton
        color="neutral"
        variant="outline"
        data-accion="ultimos-dias"
        :aria-pressed="ultimosDiasActivo"
        :class="
          ultimosDiasActivo
            ? 'border-acento-500 bg-acento-100 font-semibold text-profundo-900 ring-1 ring-acento-500 hover:bg-acento-100'
            : ''
        "
        @click="ultimosDias"
      >
        Últimos {{ DIAS_RECIENTES }} días
      </UButton>
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
      Cargando diagnósticos…
    </p>

    <div
      v-else-if="falloCarga"
      class="py-10 text-center"
      role="alert"
    >
      <p class="text-red-700">
        No se pudieron cargar los diagnósticos.
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

    <div
      v-else
      :data-formatos-cargados="formatosCargados ? '' : undefined"
      class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
    >
      <p
        v-if="clientes.length === 0"
        class="py-10 text-center text-neutral-500"
      >
        Aún no hay clientes registrados.
      </p>
      <p
        v-else-if="filtrados.length === 0"
        class="py-10 text-center text-neutral-500"
      >
        No hay expedientes que coincidan con los filtros.
      </p>

      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="w-full min-w-[56rem] text-left text-sm">
          <thead class="border-b border-neutral-200 text-neutral-700">
            <tr>
              <th class="px-5 py-4 font-medium">
                Cliente
              </th>
              <th class="px-5 py-4 text-center font-medium">
                NSS
              </th>
              <th class="px-5 py-4 text-center font-medium">
                Régimen
              </th>
              <th class="px-5 py-4 text-center font-medium">
                Registro
              </th>
              <th class="px-5 py-4 text-center font-medium">
                Formato F0
              </th>
              <th class="px-5 py-4 text-center font-medium">
                Formato F1
              </th>
              <th class="w-10 px-3 py-4">
                <span class="sr-only">Abrir</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in visibles"
              :key="c.id"
              data-diagnostico
              class="border-b border-neutral-100 last:border-0 hover:bg-marca-50"
            >
              <td class="px-5 py-4">
                <span class="flex items-center gap-2">
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-md bg-marca-100 text-xs font-medium text-marca-800"
                  >{{ iniciales(c) }}</span>
                  <span
                    data-nombre
                    class="font-medium text-neutral-900"
                  >{{
                    nombreCompleto(c)
                  }}</span>
                </span>
              </td>
              <td class="px-5 py-4 text-center text-neutral-600">
                {{ c.nss ?? "Sin NSS" }}
              </td>
              <td class="px-5 py-4 text-center text-neutral-600">
                {{ nombreRegimen(c) }}
              </td>
              <td class="px-5 py-4 text-center text-neutral-600">
                {{ formatearFechaIngreso(c.fecha_ingreso) }}
              </td>
              <td
                v-for="formato in ['f0', 'f1'] as const"
                :key="formato"
                :data-f0="formato === 'f0' ? '' : undefined"
                :data-f1="formato === 'f1' ? '' : undefined"
                class="px-5 py-4 text-center"
              >
                <span
                  v-if="formatos[c.id]"
                  class="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs"
                  :class="claseFormato(formatos[c.id]![formato])"
                >
                  <span
                    class="size-1.5 rounded-full"
                    :class="clasePunto(formatos[c.id]![formato])"
                  />
                  {{ ETIQUETA_FORMATO[formatos[c.id]![formato]] }}
                </span>
                <span
                  v-else
                  class="text-neutral-400"
                >{{
                  formatos[c.id] === null ? "—" : "…"
                }}</span>
              </td>
              <td class="px-3 py-4 text-right">
                <a
                  :href="`/clientes/${c.id}/f0`"
                  data-accion="abrir-f0"
                  :aria-label="`Abrir el diagnóstico de ${nombreCompleto(c)}`"
                  class="inline-flex text-neutral-500 hover:text-profundo-700"
                  @click.prevent="navigateTo(`/clientes/${c.id}/f0`)"
                >
                  <UIcon
                    name="i-lucide-chevron-right"
                    class="size-5"
                  />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav
        v-if="filtrados.length > TAM_PAGINA"
        aria-label="Páginas"
        class="flex items-center justify-center gap-1.5 border-t border-neutral-100 py-4"
      >
        <button
          type="button"
          data-accion="pagina-anterior"
          aria-label="Página anterior"
          :disabled="pagina === 1"
          class="flex size-9 items-center justify-center rounded-md border border-neutral-300 disabled:opacity-40"
          @click="pagina--"
        >
          <UIcon
            name="i-lucide-chevron-left"
            class="size-4"
          />
        </button>
        <template
          v-for="(n, i) in paginas"
          :key="i"
        >
          <span
            v-if="n === null"
            class="px-1 text-neutral-500"
          >…</span>
          <button
            v-else
            type="button"
            data-pagina
            :aria-current="n === pagina ? 'page' : undefined"
            class="size-9 rounded-md border text-sm"
            :class="
              n === pagina
                ? 'border-marca-500 bg-marca-500 text-white'
                : 'border-neutral-300'
            "
            @click="pagina = n"
          >
            {{ n }}
          </button>
        </template>
        <button
          type="button"
          data-accion="pagina-siguiente"
          aria-label="Página siguiente"
          :disabled="pagina === totalPaginas"
          class="flex size-9 items-center justify-center rounded-md border border-neutral-300 disabled:opacity-40"
          @click="pagina++"
        >
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4"
          />
        </button>
      </nav>
    </div>
  </section>
</template>

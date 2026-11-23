<script setup lang="ts">
import { ApiError } from '~/utils/api-error'
import { hora12 } from '~/utils/agenda'
import { agruparAvisosCampana, textoVencimientoAviso } from '~/utils/avisos'
import { hoyISO } from '~/utils/fechas'
import { reproducirCampana } from '~/utils/sonido'

// Campana del encabezado: los avisos sin atender del día o de la semana, con aviso cada hora mientras haya pendientes.
const HORA_MS = 60 * 60 * 1000
const DURACION_MOVIMIENTO_MS = 1800

const route = useRoute()
const toast = useToast()
const avisos = useAvisosStore()
const preferencias = usePreferenciasStore()

const raiz = useTemplateRef<HTMLElement>('raiz')
const abierta = ref(false)
const pestana = ref<'hoy' | 'semana'>('hoy')
const moviendo = ref(false)
const atendiendo = ref<string | null>(null)

// "Hoy" se recalcula al abrir la campana (la sesión puede durar abierta de un día para otro).
const hoy = ref(hoyISO())
const grupos = computed(() => agruparAvisosCampana(avisos.lista, hoy.value))
const visibles = computed(() => grupos.value[pestana.value])
const PESTANAS = [
  { clave: 'hoy', texto: 'Hoy' },
  { clave: 'semana', texto: 'Esta semana' }
] as const

function mover() {
  moviendo.value = true
  setTimeout(() => {
    moviendo.value = false
  }, DURACION_MOVIMIENTO_MS)
}

// Cada hora: si sigue habiendo avisos sin atender, la campana se mueve y suena (según las preferencias).
async function recordar() {
  await avisos.cargar()
  if (avisos.pendientes === 0) return
  if (preferencias.movimientoCampana) mover()
  if (preferencias.sonidoCampana) reproducirCampana()
}

function alPulsarFuera(evento: MouseEvent) {
  if (
    abierta.value
    && raiz.value
    && !raiz.value.contains(evento.target as Node)
  )
    abierta.value = false
}
function alTeclear(evento: KeyboardEvent) {
  if (evento.key === 'Escape') abierta.value = false
}

let temporizador: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  void avisos.cargar()
  temporizador = setInterval(() => {
    void recordar()
  }, HORA_MS)
  document.addEventListener('click', alPulsarFuera)
  document.addEventListener('keydown', alTeclear)
})
onBeforeUnmount(() => {
  if (temporizador) clearInterval(temporizador)
  document.removeEventListener('click', alPulsarFuera)
  document.removeEventListener('keydown', alTeclear)
})
watch(
  () => route.path,
  () => {
    abierta.value = false
    void avisos.cargar()
  }
)

function alternar() {
  hoy.value = hoyISO()
  abierta.value = !abierta.value
}

async function atender(id: string) {
  atendiendo.value = id
  try {
    await avisos.atender(id)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    // Sin conexión o sin permiso: useApi ya avisó. Un 404 es un aviso que ya no existe.
    if (error.status === 404) void avisos.cargar()
    else if (error.status !== 0 && error.status !== 403)
      toast.add({ title: 'No se pudo atender el aviso', color: 'error' })
  }
  atendiendo.value = null
}

const fechaDe = (a: { fecha_compromiso: string }) =>
  a.fecha_compromiso.slice(0, 10)
const claseVencimiento = (fecha: string) =>
  fecha < hoy.value
    ? 'bg-red-100 text-red-700'
    : fecha === hoy.value
      ? 'bg-amber-100 text-amber-800'
      : 'bg-neutral-100 text-neutral-700'
const etiqueta = computed(() =>
  avisos.pendientes === 0
    ? 'Avisos'
    : `${avisos.pendientes} ${avisos.pendientes === 1 ? 'aviso pendiente' : 'avisos pendientes'}`
)
</script>

<template>
  <div
    ref="raiz"
    class="relative"
  >
    <button
      type="button"
      data-campana
      :data-moviendo="moviendo ? 'true' : 'false'"
      :aria-label="etiqueta"
      :aria-expanded="abierta"
      aria-haspopup="true"
      class="relative inline-flex size-10 items-center justify-center rounded-full text-profundo-500 transition-colors hover:bg-neutral-100"
      @click="alternar"
    >
      <UIcon
        name="i-lucide-bell"
        class="size-6"
        :class="moviendo ? 'campana-sacudir' : ''"
      />
      <span
        v-if="avisos.pendientes > 0"
        data-campana-contador
        class="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold leading-5 text-white"
      >{{ avisos.pendientes }}</span>
    </button>

    <div
      v-if="abierta"
      data-panel-campana
      role="dialog"
      aria-label="Avisos pendientes"
      class="absolute right-0 top-12 z-40 w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
    >
      <div class="border-b border-neutral-100 px-4 pb-0 pt-4">
        <h2 class="font-display text-lg font-semibold text-profundo-900">
          Avisos pendientes
        </h2>
        <div
          role="tablist"
          class="mt-2 flex"
        >
          <button
            v-for="p in PESTANAS"
            :key="p.clave"
            type="button"
            role="tab"
            :data-pestana-campana="p.clave"
            :aria-selected="pestana === p.clave"
            class="border-b-2 px-3 py-2 text-sm font-medium transition-colors"
            :class="
              pestana === p.clave
                ? 'border-acento-500 text-profundo-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            "
            @click="pestana = p.clave"
          >
            {{ p.texto }}
            <span class="ml-1 rounded-full bg-neutral-100 px-1.5 text-xs">{{
              grupos[p.clave].length
            }}</span>
          </button>
        </div>
      </div>

      <p
        v-if="visibles.length === 0"
        class="px-4 py-8 text-center text-sm text-neutral-500"
      >
        {{
          pestana === "hoy"
            ? "No tienes avisos para hoy."
            : "No tienes avisos para esta semana."
        }}
      </p>
      <ul
        v-else
        class="max-h-80 divide-y divide-neutral-100 overflow-y-auto"
      >
        <li
          v-for="a in visibles"
          :key="a.id"
          data-aviso-campana
          class="flex items-start gap-3 px-4 py-3"
        >
          <span
            class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-marca-100"
          >
            <UIcon
              :name="
                a.tipo === 'cita'
                  ? 'i-lucide-calendar-clock'
                  : 'i-lucide-file-clock'
              "
              class="size-4 text-marca-700"
            />
          </span>
          <div class="min-w-0 flex-1">
            <p
              data-titulo
              class="truncate text-sm font-semibold text-neutral-900"
            >
              {{ a.titulo }}
            </p>
            <p class="truncate text-xs text-neutral-600">
              {{ a.cliente_nombre
              }}<template v-if="a.hora">
                · {{ hora12(a.hora) }}
              </template>
            </p>
            <span
              data-vencimiento
              class="mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium"
              :class="claseVencimiento(fechaDe(a))"
            >{{ textoVencimientoAviso(fechaDe(a), hoy) }}</span>
          </div>
          <UButton
            data-accion="atender-aviso"
            size="xs"
            color="neutral"
            variant="outline"
            :loading="atendiendo === a.id"
            :aria-label="`Atender el aviso de ${a.cliente_nombre}`"
            @click="atender(a.id)"
          >
            Atender
          </UButton>
        </li>
      </ul>

      <div
        class="border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-center"
      >
        <NuxtLink
          to="/avisos"
          data-accion="ver-todos"
          class="text-sm font-semibold text-profundo-700 hover:underline"
        >
          Ver todos los avisos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

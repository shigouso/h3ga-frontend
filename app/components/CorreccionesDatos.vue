<script setup lang="ts">
import type { Correccion, TipoCorreccion } from '~/types/f0'
import { ApiError } from '~/utils/api-error'
import {
  TIPO_CORRECCION_NSS,
  TIPO_CORRECCION_OTRO,
  TIPOS_CON_DATO_CORRECTO
} from '~/utils/correcciones'

// F2 Corrección de datos: las correcciones que se hacen a mano (CURP, RFC, acta, AFORE, SINDO…), con lo que dice el dato
// hoy y lo que debe decir. La unificación de NSS es el F3 y no se captura aquí.
const props = defineProps<{
  clienteId: string
  tipos: TipoCorreccion[]
  correcciones: Correccion[]
}>()
const emit = defineEmits<{ correcciones: [correcciones: Correccion[]] }>()

const api = useCorrecciones(props.clienteId)

interface Fila {
  id: string
  tipoId: number
  observaciones: string
  tiempo: string
  dato_actual: string
  dato_correcto: string
  guardado: Record<string, string>
  error?: string
  guardando: boolean
}

const texto = (v: string | null | undefined) => v ?? ''
const campos = (
  f: Pick<Fila, 'observaciones' | 'tiempo' | 'dato_actual' | 'dato_correcto'>
) => ({
  observaciones: f.observaciones.trim(),
  tiempo: f.tiempo.trim(),
  dato_actual: f.dato_actual.trim(),
  dato_correcto: f.dato_correcto.trim()
})

function aFila(c: Correccion): Fila {
  const fila = {
    observaciones: texto(c.observaciones),
    tiempo: texto(c.tiempo_promedio),
    dato_actual: texto(c.dato_actual),
    dato_correcto: texto(c.dato_correcto)
  }
  return {
    id: c.id,
    tipoId: c.tipo_correccion_id,
    ...fila,
    guardado: campos(fila),
    guardando: false
  }
}

// Solo las manuales: la unificación de NSS (tipo 7) se atiende en F3.
const filas = reactive<Fila[]>(
  props.correcciones
    .filter(c => c.tipo_correccion_id !== TIPO_CORRECCION_NSS)
    .map(aFila)
)
const registros = ref<Correccion[]>([...props.correcciones])

const nombreTipo = (id: number) =>
  props.tipos.find(t => t.id === id)?.nombre ?? 'Otra corrección'
const tiposNuevos = computed(() =>
  props.tipos.filter(t => t.id !== TIPO_CORRECCION_NSS)
)
const pideDatoCorrecto = (tipoId: number) =>
  TIPOS_CON_DATO_CORRECTO.includes(tipoId)
const muestraDatos = (f: Fila) =>
  pideDatoCorrecto(f.tipoId)
  || f.tipoId === TIPO_CORRECCION_OTRO
  || Boolean(f.dato_actual || f.dato_correcto)
const sucia = (f: Fila) =>
  JSON.stringify(campos(f)) !== JSON.stringify(f.guardado)

function validarDatos(
  tipoId: number,
  c: { dato_actual: string, dato_correcto: string }
): string | undefined {
  if (pideDatoCorrecto(tipoId) && !c.dato_correcto.trim())
    return 'El dato correcto es obligatorio'
  if (tipoId === TIPO_CORRECCION_OTRO && !c.dato_actual.trim())
    return 'Especifica el trámite'
  return undefined
}

const mensajeError = (e: ApiError) =>
  e.status === 400 || e.status === 409
    ? e.mensaje
    : 'No se pudo guardar. Inténtalo de nuevo.'

async function guardar(f: Fila) {
  f.error = validarDatos(f.tipoId, f)
  if (f.error) return
  const ahora = campos(f)
  const cambios: Record<string, string | null> = {}
  if (ahora.observaciones !== f.guardado.observaciones)
    cambios.observaciones = ahora.observaciones || null
  if (ahora.tiempo !== f.guardado.tiempo)
    cambios.tiempo_promedio = ahora.tiempo || null
  if (ahora.dato_actual !== f.guardado.dato_actual)
    cambios.dato_actual = ahora.dato_actual || null
  if (ahora.dato_correcto !== f.guardado.dato_correcto)
    cambios.dato_correcto = ahora.dato_correcto || null
  f.guardando = true
  try {
    const actualizada = await api.actualizar(f.id, cambios)
    registros.value = registros.value.map(r =>
      r.id === actualizada.id ? actualizada : r
    )
    f.guardado = ahora
    emit('correcciones', registros.value)
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    // Sin conexión: useApi ya mostró el aviso.
    if (e.status !== 0) f.error = mensajeError(e)
  }
  f.guardando = false
}

// Quitar una corrección ya arreglada: pide confirmación porque el borrado es definitivo.
const porQuitar = ref<Fila | null>(null)
const quitarAbierto = computed({
  get: () => porQuitar.value !== null,
  set: (abierto: boolean) => {
    if (!abierto) porQuitar.value = null
  }
})
const errorQuitar = ref<string | null>(null)
const quitando = ref(false)

function pedirQuitar(f: Fila) {
  errorQuitar.value = null
  porQuitar.value = f
}

async function quitar() {
  const f = porQuitar.value
  if (!f) return
  errorQuitar.value = null
  quitando.value = true
  try {
    await api.eliminar(f.id)
    filas.splice(
      filas.findIndex(x => x.id === f.id),
      1
    )
    registros.value = registros.value.filter(r => r.id !== f.id)
    emit('correcciones', registros.value)
    porQuitar.value = null
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    // Sin conexión: useApi ya mostró el aviso.
    if (e.status !== 0)
      errorQuitar.value
        = e.status === 400 || e.status === 404 || e.status === 409
          ? e.mensaje
          : 'No se pudo quitar la corrección. Inténtalo de nuevo.'
  }
  quitando.value = false
}

const nueva = reactive({
  tipo: '',
  observaciones: '',
  tiempo: '',
  dato_actual: '',
  dato_correcto: ''
})
const errorNueva = ref<string | undefined>()
const agregando = ref(false)
const tipoNuevo = computed(() => (nueva.tipo ? Number(nueva.tipo) : null))

async function agregar() {
  errorNueva.value = undefined
  if (tipoNuevo.value === null) {
    errorNueva.value = 'Elige el tipo de corrección'
    return
  }
  errorNueva.value = validarDatos(tipoNuevo.value, nueva)
  if (errorNueva.value) return
  const datos = Object.fromEntries(
    Object.entries({
      observaciones: nueva.observaciones.trim(),
      tiempo_promedio: nueva.tiempo.trim(),
      dato_actual: nueva.dato_actual.trim(),
      dato_correcto: nueva.dato_correcto.trim()
    }).filter(([, v]) => v)
  )
  agregando.value = true
  try {
    const creada = await api.crear({
      tipo_correccion_id: tipoNuevo.value,
      ...datos
    })
    filas.push(aFila(creada))
    registros.value = [...registros.value, creada]
    emit('correcciones', registros.value)
    Object.assign(nueva, {
      tipo: '',
      observaciones: '',
      tiempo: '',
      dato_actual: '',
      dato_correcto: ''
    })
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    if (e.status !== 0) errorNueva.value = mensajeError(e)
  }
  agregando.value = false
}

const claseCampo
  = 'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-normal text-neutral-900'
</script>

<template>
  <div class="space-y-4">
    <p
      v-if="filas.length === 0"
      class="rounded-xl border border-dashed border-neutral-300 py-5 text-center text-sm text-neutral-600"
    >
      Aún no hay correcciones de datos registradas para este cliente.
    </p>

    <div
      v-for="f in filas"
      :key="f.id"
      data-correccion-fila
      :data-tipo="f.tipoId"
      class="rounded-xl border border-neutral-200 p-4"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="font-semibold text-neutral-900">
          {{ nombreTipo(f.tipoId) }}
        </p>
        <span class="flex items-center gap-2">
          <UButton
            size="sm"
            data-accion="quitar-correccion"
            color="neutral"
            variant="ghost"
            icon="i-lucide-trash-2"
            :aria-label="`Quitar la corrección de ${nombreTipo(f.tipoId)}`"
            @click="pedirQuitar(f)"
          >
            Quitar
          </UButton>
          <UButton
            size="sm"
            data-accion="guardar-correccion"
            :loading="f.guardando"
            :disabled="!sucia(f)"
            class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
            @click="guardar(f)"
          >
            Guardar
          </UButton>
        </span>
      </div>
      <div
        v-if="muestraDatos(f)"
        class="mt-3 grid gap-3 md:grid-cols-2"
      >
        <label class="block text-sm font-medium text-neutral-700">
          {{
            f.tipoId === TIPO_CORRECCION_OTRO ? "Trámite" : "Dice (dato actual)"
          }}
          <input
            v-model="f.dato_actual"
            :name="`dato_actual-${f.id}`"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
        <label
          v-if="f.tipoId !== TIPO_CORRECCION_OTRO"
          class="block text-sm font-medium text-neutral-700"
        >
          Debe decir (dato correcto)
          <input
            v-model="f.dato_correcto"
            :name="`dato_correcto-${f.id}`"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
      </div>
      <div class="mt-3 grid gap-3 md:grid-cols-[2fr_1fr]">
        <label class="block text-sm font-medium text-neutral-700">
          Observaciones
          <input
            v-model="f.observaciones"
            :name="`observaciones-${f.id}`"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
        <label class="block text-sm font-medium text-neutral-700">
          Tiempo promedio
          <input
            v-model="f.tiempo"
            :name="`tiempo-${f.id}`"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
      </div>
      <p
        v-if="f.error"
        role="alert"
        class="mt-2 text-sm font-medium text-red-700"
      >
        {{ f.error }}
      </p>
    </div>

    <div class="rounded-xl border border-dashed border-neutral-300 p-4">
      <p class="mb-3 font-medium text-profundo-700">
        Agregar una corrección
      </p>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="block text-sm font-medium text-neutral-700">
          Tipo de corrección
          <select
            v-model="nueva.tipo"
            name="nueva-tipo"
            :class="`${claseCampo} mt-1`"
          >
            <option value="">Elige una opción</option>
            <option
              v-for="t in tiposNuevos"
              :key="t.id"
              :value="String(t.id)"
            >
              {{ t.nombre }}
            </option>
          </select>
        </label>
        <label class="block text-sm font-medium text-neutral-700">
          Observaciones
          <input
            v-model="nueva.observaciones"
            name="nueva-observaciones"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
        <template
          v-if="
            tipoNuevo !== null
              && (pideDatoCorrecto(tipoNuevo) || tipoNuevo === TIPO_CORRECCION_OTRO)
          "
        >
          <label class="block text-sm font-medium text-neutral-700">
            {{
              tipoNuevo === TIPO_CORRECCION_OTRO
                ? "Trámite"
                : "Dice (dato actual)"
            }}
            <input
              v-model="nueva.dato_actual"
              name="nuevo-dato_actual"
              autocomplete="off"
              :class="`${claseCampo} mt-1`"
            >
          </label>
          <label
            v-if="tipoNuevo !== TIPO_CORRECCION_OTRO"
            class="block text-sm font-medium text-neutral-700"
          >
            Debe decir (dato correcto)
            <input
              v-model="nueva.dato_correcto"
              name="nuevo-dato_correcto"
              autocomplete="off"
              :class="`${claseCampo} mt-1`"
            >
          </label>
        </template>
        <label class="block text-sm font-medium text-neutral-700">
          Tiempo promedio
          <input
            v-model="nueva.tiempo"
            name="nueva-tiempo"
            autocomplete="off"
            :class="`${claseCampo} mt-1`"
          >
        </label>
      </div>
      <p
        v-if="errorNueva"
        role="alert"
        class="mt-2 text-sm font-medium text-red-700"
      >
        {{ errorNueva }}
      </p>
      <div class="mt-3 flex justify-end">
        <UButton
          data-accion="agregar-correccion"
          :loading="agregando"
          color="neutral"
          variant="outline"
          @click="agregar"
        >
          Agregar corrección
        </UButton>
      </div>
    </div>

    <UModal
      v-model:open="quitarAbierto"
      title="Quitar corrección"
      :description="porQuitar ? nombreTipo(porQuitar.tipoId) : undefined"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-neutral-700">
            ¿Ya quedó arreglada? Al quitarla se borra de la lista del cliente y
            no se puede deshacer. Si era la última, el cliente deja de requerir
            F2.
          </p>
          <p
            v-if="errorQuitar"
            role="alert"
            class="text-sm font-medium text-red-700"
          >
            {{ errorQuitar }}
          </p>
          <div class="flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <UButton
              color="neutral"
              variant="outline"
              data-accion="cancelar-quitar"
              @click="quitarAbierto = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="error"
              data-accion="confirmar-quitar"
              :loading="quitando"
              @click="quitar"
            >
              Quitar corrección
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

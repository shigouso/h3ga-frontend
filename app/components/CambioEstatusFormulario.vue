<script setup lang="ts">
import type {
  CambiarEstatus,
  EstatusTramite,
  EtapaCliente
} from '~/types/expediente'
import { ApiError } from '~/utils/api-error'
import { ESTATUS_ID } from '~/utils/etapas'

const props = defineProps<{
  clienteId: string
  etapa: EtapaCliente
  estatus: EstatusTramite[]
}>()
const emit = defineEmits<{
  cambiado: [etapa: EtapaCliente]
  recargar: []
  cancelar: []
}>()

const api = useEtapas(props.clienteId)

const estatusId = ref<number>(props.etapa.estatus_id)
const avance = ref(String(props.etapa.avance_porcentaje))
const motivo = ref(props.etapa.motivo_rechazo ?? '')
const accion = ref(props.etapa.accion_a_realizar ?? '')
const fecha = ref(props.etapa.fecha_compromiso?.slice(0, 10) ?? '')
const errores = reactive<{
  estatus?: string
  avance?: string
  motivo?: string
}>({})
const errorGeneral = ref<string | null>(null)
const enviando = ref(false)

// Todo sale del catálogo de estatus del backend: qué estatus deja editar el avance y en qué rango.
const seleccionado = computed(() =>
  props.estatus.find(e => e.id === estatusId.value)
)
const editable = computed(() => Boolean(seleccionado.value?.avance_editable))
const minimo = computed(() => seleccionado.value?.avance_min ?? 20)
const maximo = computed(() => seleccionado.value?.avance_max ?? 90)
const pideMotivo = computed(() => estatusId.value === ESTATUS_ID.bloqueado)

const textoAvance = computed(() => {
  const fijo = seleccionado.value?.avance_porcentaje_fijo
  return fijo == null
    ? `Conserva el avance actual (${props.etapa.avance_porcentaje}%).`
    : `El avance quedará en ${fijo}%.`
})

// Al pasar a un "En proceso" con un avance fuera de rango, se propone el mínimo.
watch(estatusId, () => {
  if (!editable.value) return
  const n = Number(avance.value)
  if (!/^\d+$/.test(avance.value) || n < minimo.value || n > maximo.value)
    avance.value = String(minimo.value)
})

function validar(): boolean {
  errores.estatus = seleccionado.value ? undefined : 'Elige el estatus'
  const n = Number(avance.value)
  errores.avance
    = editable.value
      && !(/^\d+$/.test(avance.value) && n >= minimo.value && n <= maximo.value)
      ? `El avance debe ser un entero entre ${minimo.value} y ${maximo.value}`
      : undefined
  errores.motivo
    = pideMotivo.value && !motivo.value.trim()
      ? 'Indica el motivo del bloqueo'
      : undefined
  return !errores.estatus && !errores.avance && !errores.motivo
}

async function guardar() {
  errorGeneral.value = null
  if (!validar()) return
  const datos: CambiarEstatus = { estatus_id: estatusId.value }
  if (editable.value) datos.avance_porcentaje = Number(avance.value)
  if (pideMotivo.value) datos.motivo_rechazo = motivo.value.trim()
  if (accion.value.trim()) datos.accion_a_realizar = accion.value.trim()
  if (fecha.value) datos.fecha_compromiso = fecha.value

  enviando.value = true
  try {
    emit('cambiado', await api.cambiarEstatus(props.etapa.id, datos))
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    // Sin conexión: useApi ya mostró el aviso y no hay nada nuevo que recargar.
    if (error.status !== 0) {
      errorGeneral.value
        = error.status === 400 || error.status === 404
          ? error.mensaje
          : 'No se pudo guardar el cambio. Inténtalo de nuevo.'
      // La pantalla no debe quedarse con datos viejos si el backend rechazó el cambio.
      emit('recargar')
    }
  } finally {
    enviando.value = false
  }
}

const claseCampo
  = 'mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900'
</script>

<template>
  <form
    class="space-y-4"
    novalidate
    @submit.prevent="guardar"
  >
    <label class="block text-sm font-medium text-neutral-800">
      Estatus
      <select
        v-model.number="estatusId"
        name="estatus_id"
        :class="claseCampo"
      >
        <option
          v-for="e in estatus"
          :key="e.id"
          :value="e.id"
        >
          {{ e.nombre }}
        </option>
      </select>
      <span
        v-if="errores.estatus"
        class="mt-1 block text-sm text-red-700"
      >{{
        errores.estatus
      }}</span>
    </label>

    <label
      v-if="editable"
      class="block text-sm font-medium text-neutral-800"
    >
      Avance (%)
      <input
        v-model="avance"
        type="text"
        inputmode="numeric"
        name="avance_porcentaje"
        autocomplete="off"
        :class="claseCampo"
      >
      <span class="mt-1 block text-xs font-normal text-neutral-500">Entre {{ minimo }} y {{ maximo }}.</span>
      <span
        v-if="errores.avance"
        class="mt-1 block text-sm text-red-700"
      >{{
        errores.avance
      }}</span>
    </label>
    <p
      v-else-if="seleccionado"
      class="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-700"
    >
      {{ textoAvance }}
    </p>

    <label
      v-if="pideMotivo"
      class="block text-sm font-medium text-neutral-800"
    >
      Motivo del bloqueo
      <textarea
        v-model="motivo"
        name="motivo_rechazo"
        rows="3"
        :class="claseCampo"
      />
      <span
        v-if="errores.motivo"
        class="mt-1 block text-sm text-red-700"
      >{{
        errores.motivo
      }}</span>
    </label>

    <label class="block text-sm font-medium text-neutral-800">
      Acción a realizar (opcional)
      <input
        v-model="accion"
        type="text"
        name="accion_a_realizar"
        autocomplete="off"
        :class="claseCampo"
      >
    </label>
    <label class="block text-sm font-medium text-neutral-800">
      Fecha compromiso (opcional)
      <input
        v-model="fecha"
        type="date"
        name="fecha_compromiso"
        :class="claseCampo"
      >
    </label>

    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>

    <div class="flex justify-end gap-3 border-t border-neutral-200 pt-4">
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        data-accion="cancelar"
        @click="emit('cancelar')"
      >
        Cancelar
      </UButton>
      <UButton
        type="submit"
        :loading="enviando"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
      >
        Guardar cambio
      </UButton>
    </div>
  </form>
</template>

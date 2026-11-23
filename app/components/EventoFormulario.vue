<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import type { EventoAgenda } from '~/types/expediente'
import { ApiError } from '~/utils/api-error'
import { ESTATUS_EVENTO, type EstatusEvento } from '~/utils/agenda'

// Agendar una cita nueva (sin `evento`) o reagendar una existente (con `evento`).
const props = defineProps<{
  clientes: Cliente[]
  evento?: EventoAgenda | null
}>()
const emit = defineEmits<{ guardado: [evento: EventoAgenda], cancelar: [] }>()

const api = useAgenda()
const edita = Boolean(props.evento)

const estado = reactive({
  cliente_id: props.evento?.cliente_id ?? '',
  fecha: props.evento?.fecha.slice(0, 10) ?? '',
  hora: props.evento?.hora.slice(0, 5) ?? '',
  motivo: props.evento?.motivo ?? '',
  estatus: (props.evento?.estatus ?? 'pendiente') as EstatusEvento
})
const estatusTocado = ref(false)
const errores = reactive<Record<string, string | undefined>>({})
const errorGeneral = ref<string | null>(null)
const enviando = ref(false)

const nombre = (c: Cliente) =>
  [c.nombre, c.apellido_paterno, c.apellido_materno].filter(Boolean).join(' ')

function validar(): boolean {
  errores.cliente_id = estado.cliente_id ? undefined : 'Elige al cliente'
  errores.fecha = /^\d{4}-\d{2}-\d{2}$/.test(estado.fecha)
    ? undefined
    : 'Indica la fecha'
  errores.hora = /^\d{2}:\d{2}$/.test(estado.hora)
    ? undefined
    : 'Indica la hora'
  errores.motivo = estado.motivo.trim() ? undefined : 'Describe el motivo'
  return Object.values(errores).every(e => !e)
}

// Solo lo que cambió. Si cambia la fecha u hora y el asesor no eligió un estatus, la cita queda "reagendada".
function cambios() {
  const e = props.evento!
  const c: Record<string, string> = {}
  if (estado.cliente_id !== e.cliente_id) c.cliente_id = estado.cliente_id
  if (estado.fecha !== e.fecha.slice(0, 10)) c.fecha = estado.fecha
  if (estado.hora !== e.hora.slice(0, 5)) c.hora = estado.hora
  if (estado.motivo.trim() !== e.motivo) c.motivo = estado.motivo.trim()
  if (estatusTocado.value && estado.estatus !== e.estatus)
    c.estatus = estado.estatus
  else if (
    !estatusTocado.value
    && (c.fecha || c.hora)
    && e.estatus !== 'reagendado'
  )
    c.estatus = 'reagendado'
  return c
}

async function guardar() {
  errorGeneral.value = null
  if (!validar()) return
  enviando.value = true
  try {
    if (!edita) {
      emit(
        'guardado',
        await api.agendar({
          cliente_id: estado.cliente_id,
          fecha: estado.fecha,
          hora: estado.hora,
          motivo: estado.motivo.trim(),
          estatus: 'pendiente'
        })
      )
      return
    }
    const c = cambios()
    if (Object.keys(c).length === 0) {
      emit('cancelar')
      return
    }
    emit('guardado', await api.actualizar(props.evento!.id, c))
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    // Sin conexión y sin permiso ya los avisó useApi.
    if (e.status !== 0 && e.status !== 403)
      errorGeneral.value
        = e.status === 400 || e.status === 404
          ? e.mensaje
          : 'No se pudo guardar la cita. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}

const claseCampo
  = 'mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base font-normal text-neutral-900'
const claseEtiqueta = 'block text-sm font-semibold text-profundo-700'
</script>

<template>
  <form
    class="space-y-4"
    novalidate
    @submit.prevent="guardar"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <label :class="[claseEtiqueta, edita ? '' : 'md:col-span-2']">
        Cliente
        <select
          v-model="estado.cliente_id"
          name="cliente_id"
          :class="claseCampo"
        >
          <option value="">Selecciona al cliente</option>
          <option
            v-for="c in clientes"
            :key="c.id"
            :value="c.id"
          >
            {{ nombre(c) }}
          </option>
        </select>
        <span
          v-if="errores.cliente_id"
          class="mt-1 block font-normal text-red-700"
        >{{ errores.cliente_id }}</span>
      </label>
      <label
        v-if="edita"
        :class="claseEtiqueta"
      >
        Estatus de la cita
        <select
          v-model="estado.estatus"
          name="estatus"
          :class="claseCampo"
          @change="estatusTocado = true"
        >
          <option
            v-for="(e, clave) in ESTATUS_EVENTO"
            :key="clave"
            :value="clave"
          >
            {{ e.texto }}
          </option>
        </select>
      </label>
      <label :class="claseEtiqueta">
        Fecha
        <input
          v-model="estado.fecha"
          type="date"
          name="fecha"
          :class="claseCampo"
        >
        <span
          v-if="errores.fecha"
          class="mt-1 block font-normal text-red-700"
        >{{ errores.fecha }}</span>
      </label>
      <label :class="claseEtiqueta">
        Hora
        <input
          v-model="estado.hora"
          type="time"
          name="hora"
          :class="claseCampo"
        >
        <span
          v-if="errores.hora"
          class="mt-1 block font-normal text-red-700"
        >{{
          errores.hora
        }}</span>
      </label>
    </div>
    <label :class="claseEtiqueta">
      Motivo
      <textarea
        v-model="estado.motivo"
        name="motivo"
        rows="3"
        placeholder="Ej. Revisión de documentos para Modalidad 40"
        :class="claseCampo"
      />
      <span
        v-if="errores.motivo"
        class="mt-1 block font-normal text-red-700"
      >{{
        errores.motivo
      }}</span>
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
        color="neutral"
        variant="outline"
        data-accion="cancelar-cita"
        @click="emit('cancelar')"
      >
        Cancelar
      </UButton>
      <UButton
        data-accion="guardar-cita"
        :loading="enviando"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
        @click="guardar"
      >
        {{ edita ? "Reagendar cita" : "Agendar cita" }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { NssSecundario, UnificacionNss } from '~/types/correcciones'
import type { Correccion } from '~/types/f0'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{
  clienteId: string
  correccion: Correccion | null
}>()
const emit = defineEmits<{ correccion: [correccion: Correccion] }>()

const TIPO_UNIFICACION_NSS = 7
const toast = useToast()

const CRITERIOS = [
  { valor: 'vinculo_curp', etiqueta: 'Vínculo con la CURP' },
  { valor: 'antiguedad', etiqueta: 'Mayor antigüedad' },
  { valor: 'credito_infonavit', etiqueta: 'Crédito Infonavit' },
  { valor: 'estatus_pension', etiqueta: 'Estatus de pensión' }
] as const
const ETAPAS_INSTITUCIONALES = [
  { valor: 'ingreso_validacion', etiqueta: 'Ingreso y validación' },
  { valor: 'dictaminacion_imss', etiqueta: 'Dictaminación IMSS' },
  { valor: 'migracion_historial', etiqueta: 'Migración de historial' },
  {
    valor: 'notificacion_consar_infonavit',
    etiqueta: 'Notificación CONSAR / Infonavit'
  }
] as const

const correccionActual = ref<Correccion | null>(props.correccion)
watch(
  () => props.correccion,
  (c) => {
    correccionActual.value = c
  }
)

const detalle = ref<UnificacionNss | null>(null)
const secundarios = ref<NssSecundario[]>([])
const cargando = ref(Boolean(props.correccion))
const fallo = ref(false)

const nss = ref('')
const criterio = ref('')
const etapa = ref('')
const errores = reactive<{ nss?: string, criterio?: string, etapa?: string }>(
  {}
)
const errorGeneral = ref<string | null>(null)
const guardando = ref(false)

const nssSecundario = ref('')
const observacionesSecundario = ref('')
const errorSecundario = ref<string | undefined>()
const agregando = ref(false)
const registrando = ref(false)

const es11Digitos = (v: string) => /^\d{11}$/.test(v.trim())

function llenar(d: UnificacionNss | null) {
  detalle.value = d
  nss.value = d?.nss_principal_elegido ?? ''
  criterio.value = d?.criterio_seleccion ?? ''
  etapa.value = d?.etapa_institucional_actual ?? ''
}

async function cargar() {
  const c = correccionActual.value
  if (!c) {
    cargando.value = false
    return
  }
  cargando.value = true
  fallo.value = false
  const api = useUnificacionNss(props.clienteId, c.id)
  try {
    llenar(await api.obtener())
    secundarios.value = await api.secundarios()
  } catch (error) {
    // Sin detalle guardado el backend responde 404: es el formulario vacío, no un error.
    if (error instanceof ApiError && error.status === 404) llenar(null)
    else fallo.value = true
  }
  cargando.value = false
}
onMounted(cargar)

async function registrar() {
  registrando.value = true
  try {
    const creada = await useCorrecciones(props.clienteId).crear({
      tipo_correccion_id: TIPO_UNIFICACION_NSS
    })
    correccionActual.value = creada
    emit('correccion', creada)
    llenar(null)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status !== 0)
      toast.add({
        title: 'No se pudo registrar la unificación de NSS',
        color: 'error'
      })
  }
  registrando.value = false
}

async function guardar() {
  const c = correccionActual.value
  if (!c) return
  errorGeneral.value = null
  errores.nss = es11Digitos(nss.value)
    ? undefined
    : 'El NSS debe tener 11 dígitos'
  errores.criterio = criterio.value
    ? undefined
    : 'Elige el criterio de selección'
  errores.etapa = etapa.value ? undefined : 'Elige la etapa institucional'
  if (errores.nss || errores.criterio || errores.etapa) return
  guardando.value = true
  try {
    const guardado = await useUnificacionNss(props.clienteId, c.id).guardar({
      nss_principal_elegido: nss.value.trim(),
      criterio_seleccion: criterio.value as (typeof CRITERIOS)[number]['valor'],
      etapa_institucional_actual:
        etapa.value as (typeof ETAPAS_INSTITUCIONALES)[number]['valor']
    })
    llenar(guardado)
    toast.add({ title: 'Unificación de NSS guardada', color: 'success' })
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status !== 0)
      errorGeneral.value
        = error.status === 400 || error.status === 409
          ? error.mensaje
          : 'No se pudo guardar. Inténtalo de nuevo.'
  }
  guardando.value = false
}

async function agregarSecundario() {
  const c = correccionActual.value
  if (!c || !detalle.value) return
  errorSecundario.value = es11Digitos(nssSecundario.value)
    ? undefined
    : 'El NSS debe tener 11 dígitos'
  if (errorSecundario.value) return
  agregando.value = true
  try {
    const observaciones = observacionesSecundario.value.trim()
    const nuevo = await useUnificacionNss(
      props.clienteId,
      c.id
    ).agregarSecundario({
      nss: nssSecundario.value.trim(),
      ...(observaciones ? { observaciones } : {})
    })
    secundarios.value = [...secundarios.value, nuevo]
    nssSecundario.value = ''
    observacionesSecundario.value = ''
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status !== 0)
      errorSecundario.value
        = error.status === 400 || error.status === 409
          ? error.mensaje
          : 'No se pudo agregar el NSS. Inténtalo de nuevo.'
  }
  agregando.value = false
}

const claseCampo
  = 'mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900'
</script>

<template>
  <div
    data-seccion="unificacion"
    class="rounded-2xl border border-neutral-200 p-5"
  >
    <h4 class="mb-3 font-medium text-profundo-900">
      Unificación de NSS
    </h4>

    <div
      v-if="!correccionActual"
      class="rounded-xl border border-dashed border-neutral-300 p-6 text-center"
    >
      <p class="text-neutral-700">
        Aún no se registra la unificación de NSS de este cliente.
      </p>
      <UButton
        class="mt-3 bg-profundo-500 text-white hover:bg-profundo-600"
        data-accion="registrar-unificacion"
        :loading="registrando"
        @click="registrar"
      >
        Registrar unificación de NSS
      </UButton>
    </div>

    <p
      v-else-if="cargando"
      class="py-6 text-center text-sm text-neutral-500"
      role="status"
    >
      Cargando la unificación de NSS…
    </p>

    <div
      v-else-if="fallo"
      class="py-6 text-center"
      role="alert"
    >
      <p class="text-red-700">
        No se pudo cargar la unificación de NSS.
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
      <form
        class="grid gap-4 md:grid-cols-3"
        novalidate
        @submit.prevent="guardar"
      >
        <label class="block text-sm font-medium text-neutral-800">
          NSS principal elegido
          <input
            v-model="nss"
            name="nss_principal_elegido"
            inputmode="numeric"
            maxlength="11"
            autocomplete="off"
            :class="claseCampo"
          >
          <span
            v-if="errores.nss"
            class="mt-1 block text-sm text-red-700"
          >{{
            errores.nss
          }}</span>
        </label>
        <label class="block text-sm font-medium text-neutral-800">
          Criterio de selección
          <select
            v-model="criterio"
            name="criterio_seleccion"
            :class="claseCampo"
          >
            <option value="">Elige una opción</option>
            <option
              v-for="c in CRITERIOS"
              :key="c.valor"
              :value="c.valor"
            >
              {{ c.etiqueta }}
            </option>
          </select>
          <span
            v-if="errores.criterio"
            class="mt-1 block text-sm text-red-700"
          >{{ errores.criterio }}</span>
        </label>
        <label class="block text-sm font-medium text-neutral-800">
          Etapa institucional actual
          <select
            v-model="etapa"
            name="etapa_institucional_actual"
            :class="claseCampo"
          >
            <option value="">Elige una opción</option>
            <option
              v-for="e in ETAPAS_INSTITUCIONALES"
              :key="e.valor"
              :value="e.valor"
            >
              {{ e.etiqueta }}
            </option>
          </select>
          <span
            v-if="errores.etapa"
            class="mt-1 block text-sm text-red-700"
          >{{
            errores.etapa
          }}</span>
        </label>
        <p
          v-if="errorGeneral"
          role="alert"
          class="text-sm font-medium text-red-700 md:col-span-3"
        >
          {{ errorGeneral }}
        </p>
        <div class="flex justify-end md:col-span-3">
          <UButton
            type="button"
            data-accion="guardar-unificacion"
            :loading="guardando"
            class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
            @click="guardar"
          >
            Guardar unificación
          </UButton>
        </div>
      </form>

      <div
        data-seccion="secundarios"
        class="mt-5 border-t border-neutral-200 pt-4"
      >
        <h5 class="font-semibold text-profundo-700">
          NSS secundarios por absorber
        </h5>
        <p
          v-if="!detalle"
          class="mt-2 text-sm text-neutral-600"
        >
          Guarda primero el NSS principal para poder agregar los secundarios.
        </p>
        <template v-else>
          <p
            v-if="secundarios.length === 0"
            class="mt-2 text-sm text-neutral-600"
          >
            Aún no hay NSS secundarios.
          </p>
          <ul
            v-else
            class="mt-2 divide-y divide-neutral-100 rounded-xl border border-neutral-200"
          >
            <li
              v-for="s in secundarios"
              :key="s.id"
              data-secundario
              class="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 text-sm"
            >
              <span class="font-medium text-neutral-900">{{ s.nss }}</span>
              <span class="text-neutral-600">{{
                s.observaciones || "Sin observaciones"
              }}</span>
            </li>
          </ul>
          <form
            class="mt-3 grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end"
            novalidate
            @submit.prevent="agregarSecundario"
          >
            <label class="block text-sm font-medium text-neutral-800">
              NSS secundario
              <input
                v-model="nssSecundario"
                name="nss_secundario"
                inputmode="numeric"
                maxlength="11"
                autocomplete="off"
                :class="claseCampo"
              >
            </label>
            <label class="block text-sm font-medium text-neutral-800">
              Observaciones (opcional)
              <input
                v-model="observacionesSecundario"
                name="observaciones_secundario"
                autocomplete="off"
                :class="claseCampo"
              >
            </label>
            <UButton
              type="button"
              data-accion="agregar-secundario"
              :loading="agregando"
              color="neutral"
              variant="outline"
              @click="agregarSecundario"
            >
              Agregar
            </UButton>
            <p
              v-if="errorSecundario"
              role="alert"
              class="text-sm font-medium text-red-700 md:col-span-3"
            >
              {{ errorSecundario }}
            </p>
          </form>
        </template>
      </div>
    </template>
  </div>
</template>

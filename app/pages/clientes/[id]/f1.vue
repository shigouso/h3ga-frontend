<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import type { CampoFaltante } from '~/types/f1'
import { ApiError } from '~/utils/api-error'
import { hoyISO } from '~/utils/fechas'
import { PASOS_F1 as PASOS } from '~/utils/f1'
import { puede } from '~/utils/permisos'

definePageMeta({ titulo: 'Diagnósticos y expedientes' })

const ruta = useRoute()
const id = String(ruta.params.id)
const sesion = useSessionStore()
const toast = useToast()

// Solo el Asesor del cliente captura el F1: los demás roles no pueden leerlo y vuelven al expediente.
const permitido = sesion.usuario ? puede(sesion.usuario.rol, 'f1.ver') : false
if (!permitido) await navigateTo(`/clientes/${id}`)

const { cliente, etapas, cargando, estado, asesorNombre, cargar } = useExpediente(id)
const f1 = crearContextoF1(id, cliente as Ref<Cliente>)
proveerF1(f1)

const fecha = ref('')
const fechaInicial = ref('')
async function cargarF1() {
  await f1.cargar()
  fechaInicial.value = f1.diagnostico.value?.fecha_analisis?.slice(0, 10) ?? hoyISO()
  fecha.value = fechaInicial.value
}
if (permitido) onMounted(cargarF1)

const cargandoTodo = computed(() => cargando.value || (permitido && f1.cargando.value))

const paso = ref(Math.min(Math.max(Number(ruta.query.paso) || 1, 1), PASOS.length))
const pasoActual = useTemplateRef<{ enviar: () => Promise<boolean> }>('pasoActual')
const avance = computed(() => etapas.value?.etapas.find(e => e.numero_paso === 1)?.avance_porcentaje ?? 0)

// Guardado parcial: cada paso guarda lo suyo, la fecha del diagnóstico va en la cabecera y el avance lo calcula el backend.
async function guardar(): Promise<boolean> {
  if (fecha.value !== fechaInicial.value && /^\d{4}-\d{2}-\d{2}$/.test(fecha.value)) {
    try {
      await f1.guardarCampos({ fecha_analisis: fecha.value })
      fechaInicial.value = fecha.value
    }
    catch {
      toast.add({ title: 'No se pudo guardar la fecha del diagnóstico', color: 'error' })
      return false
    }
  }
  const guardado = (await pasoActual.value?.enviar()) ?? true
  if (guardado) {
    toast.add({ title: 'Cambios guardados', color: 'success' })
    try {
      etapas.value = await useEtapas(id).listar()
    }
    catch {
      // El avance se actualiza en la próxima carga.
    }
  }
  return guardado
}
async function continuar() {
  if (await guardar()) paso.value++
}

const faltantes = ref<{ mensaje: string, lista: CampoFaltante[] } | null>(null)
async function descargar() {
  faltantes.value = null
  try {
    await f1.api.descargarPdf()
  }
  catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      faltantes.value = { mensaje: e.mensaje, lista: Array.isArray(e.detalle?.faltantes) ? e.detalle.faltantes as CampoFaltante[] : [] }
    }
    else if (!(e instanceof ApiError) || (e.status !== 0 && e.status !== 403)) {
      toast.add({ title: 'No se pudo descargar el formato F1', color: 'error' })
    }
  }
}
</script>

<template>
  <section
    v-if="permitido"
    class="space-y-5"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        :to="`/clientes/${id}`"
        data-accion="regresar"
        class="inline-flex items-center gap-2 font-medium text-profundo-700 hover:underline"
      >
        <UIcon
          name="i-lucide-undo-2"
          class="size-5"
        />
        Regresar
      </NuxtLink>
      <div class="flex flex-wrap items-center gap-3">
        <UButton
          :to="`/clientes/${id}`"
          data-accion="ver-expediente"
          color="neutral"
          variant="outline"
          icon="i-lucide-eye"
          class="bg-white shadow-md"
        >
          Ver expediente
        </UButton>
        <UButton
          :to="`/clientes/${id}/f0`"
          data-accion="diagnostico-inicial"
          icon="i-lucide-clipboard-pen-line"
          class="bg-marca-500 text-white"
        >
          Diagnóstico inicial
        </UButton>
      </div>
    </div>

    <p
      v-if="cargandoTodo"
      class="py-16 text-center text-neutral-500"
      role="status"
    >
      Cargando el diagnóstico…
    </p>

    <div
      v-else-if="estado === 'no-encontrado'"
      class="rounded-2xl bg-white p-10 text-center shadow-sm"
    >
      <h2 class="font-display text-2xl font-semibold text-profundo-900">
        Cliente no encontrado
      </h2>
    </div>

    <div
      v-else-if="estado === 'fallo' || !cliente || !f1.disponible.value"
      class="rounded-2xl bg-white p-10 text-center shadow-sm"
      role="alert"
    >
      <p class="text-red-700">
        No se pudo cargar el diagnóstico. Recarga la página para intentarlo de nuevo.
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
      <div class="max-w-3xl rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <h2
            data-f1-titulo
            class="rounded-lg bg-marca-50 px-3 py-1 font-display text-3xl font-semibold text-profundo-700"
          >
            F1 → Diagnóstico Especializado
          </h2>
          <p
            data-f1-avance
            class="font-display text-2xl text-marca-700"
          >
            {{ avance }}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Avance del diagnóstico especializado"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="avance"
          class="mt-3 h-2.5 overflow-hidden rounded-full bg-neutral-200"
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-marca-400 to-profundo-500"
            :style="{ width: `${avance}%` }"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-800">
          <label class="flex items-center gap-2">
            Fecha del diagnóstico:
            <input
              v-model="fecha"
              type="date"
              name="fecha_analisis"
              class="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm"
            >
          </label>
          <span
            v-if="asesorNombre"
            class="flex items-center gap-2"
          >
            Asesor responsable:
            <span
              data-f1-asesor
              class="inline-flex items-center gap-2 rounded-full border border-profundo-500 bg-marca-50 px-3 py-1 text-sm"
            >
              <UIcon
                name="i-lucide-user-round"
                class="size-4"
              />{{ asesorNombre }}
            </span>
          </span>
        </div>
        <UButton
          data-accion="guardar"
          color="neutral"
          variant="outline"
          icon="i-lucide-save"
          size="lg"
          class="bg-white shadow-md"
          @click="guardar"
        >
          Guardar
        </UButton>
      </div>

      <ol
        class="flex flex-wrap gap-2"
        aria-label="Pasos del diagnóstico"
      >
        <li
          v-for="(p, i) in PASOS"
          :key="p.titulo"
          data-paso
          :aria-current="paso === i + 1 ? 'step' : undefined"
          class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
          :class="paso === i + 1 ? 'border-profundo-500 bg-profundo-500 text-white' : 'border-neutral-300 bg-white text-neutral-600'"
        >
          <span class="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">{{ i + 1 }}</span>
          {{ p.titulo }}
        </li>
      </ol>

      <div class="rounded-2xl bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-neutral-200 p-5">
          <span class="flex size-9 items-center justify-center rounded-full bg-profundo-500 font-semibold text-white">{{ paso }}</span>
          <div>
            <h3 class="text-lg font-semibold text-profundo-900">
              {{ PASOS[paso - 1]!.titulo }}
            </h3>
            <p
              v-if="PASOS[paso - 1]!.subtitulo"
              class="text-sm text-neutral-600"
            >
              {{ PASOS[paso - 1]!.subtitulo }}
            </p>
          </div>
        </div>

        <div class="min-w-0 p-5">
          <F1Objetivos
            v-if="paso === 1"
            ref="pasoActual"
          />
          <F1Documentos
            v-else-if="paso === 2"
            ref="pasoActual"
          />
          <F1Regimen
            v-else-if="paso === 3"
            ref="pasoActual"
          />
          <F1Recuperacion
            v-else-if="paso === 4"
            ref="pasoActual"
          />
          <F1Conservacion
            v-else-if="paso === 5"
            ref="pasoActual"
          />
          <F1Modalidad40
            v-else-if="paso === 6"
            ref="pasoActual"
          />
          <F1Retroactivo
            v-else-if="paso === 7"
            ref="pasoActual"
          />
          <F1Escenarios
            v-else-if="paso === 8"
            ref="pasoActual"
          />
          <F1Recomendacion
            v-else
            ref="pasoActual"
          />
        </div>
      </div>

      <div
        v-if="faltantes"
        data-faltantes
        role="alert"
        class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
      >
        <p class="font-semibold">
          {{ faltantes.mensaje }}
        </p>
        <ul class="mt-2 list-disc pl-5">
          <li
            v-for="f in faltantes.lista"
            :key="`${f.seccion}-${f.campo}`"
          >
            {{ f.etiqueta }}
          </li>
        </ul>
      </div>

      <div class="flex justify-end gap-3">
        <UButton
          v-if="paso > 1"
          data-accion="retroceder"
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
          size="lg"
          class="bg-white shadow-md"
          @click="paso--"
        >
          Retroceder
        </UButton>
        <UButton
          v-if="paso < PASOS.length"
          data-accion="continuar"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          class="bg-acento-500 font-semibold text-profundo-900 shadow-md hover:bg-acento-400"
          @click="continuar"
        >
          Continuar
        </UButton>
        <UButton
          v-else
          data-accion="descargar-f1"
          icon="i-lucide-file-down"
          size="lg"
          class="bg-acento-500 font-semibold text-profundo-900 shadow-md hover:bg-acento-400"
          @click="descargar"
        >
          Descargar
        </UButton>
      </div>
    </template>
  </section>
</template>

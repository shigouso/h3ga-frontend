<script setup lang="ts">
import type { Aviso } from '~/types/aviso'
import type {
  DocumentoCliente,
  EstatusTramite,
  EtapaCliente,
  EtapasCliente,
  EventoAgenda
} from '~/types/expediente'
import type { Usuario } from '~/types/usuario'
import { proximaCita, horaCorta } from '~/utils/citas'
import { claseEstatus, esEtapaActual } from '~/utils/etapas'
import {
  diasHasta,
  formatearFechaCorta,
  formatearFechaHora,
  textoDias
} from '~/utils/fechas'
import { puede } from '~/utils/permisos'

const props = defineProps<{
  clienteId: string
  etapas: EtapasCliente | null
  estatus: EstatusTramite[]
  eventos: EventoAgenda[] | null
  avisos: Aviso[]
  documentos: DocumentoCliente[]
  usuarios: Usuario[]
}>()
const emit = defineEmits<{ actualizar: [] }>()

const sesion = useSessionStore()
const toast = useToast()

// Solo el Asesor cambia estatus y avance; los demás roles ven las etapas y su historial.
const puedeCambiar = computed(() =>
  sesion.usuario ? puede(sesion.usuario.rol, 'etapas.cambiarEstatus') : false
)

const etapaACambiar = ref<EtapaCliente | null>(null)
const cambioAbierto = ref(false)
const etapaHistorial = ref<EtapaCliente | null>(null)
const historialAbierto = ref(false)

function abrirCambio(etapa: EtapaCliente) {
  etapaACambiar.value = etapa
  cambioAbierto.value = true
}
function abrirHistorial(etapa: EtapaCliente) {
  etapaHistorial.value = etapa
  historialAbierto.value = true
}
function alCambiar(etapa: EtapaCliente) {
  cambioAbierto.value = false
  emit('actualizar')
  toast.add({
    title: 'Estatus actualizado',
    description: etapa.nombre,
    color: 'success'
  })
}

const pestana = ref<'resumen' | 'todas'>('resumen')
const nombreEstatus = (id: number) =>
  props.estatus.find(e => e.id === id)?.nombre ?? ''

const lista = computed(() => props.etapas?.etapas ?? [])
const actuales = computed(() =>
  lista.value.filter(e => esEtapaActual(e.estatus_id))
)
const cita = computed(() =>
  props.eventos ? proximaCita(props.eventos, props.clienteId) : null
)
const ultimaActualizacion = computed(
  () =>
    lista.value
      .map(e => e.actualizado_el)
      .sort()
      .at(-1) ?? null
)

// Lo que requiere atención de este cliente: avisos pendientes de sus etapas o citas, y documentos por confirmar.
const alertas = computed(() => {
  const textos: string[] = []
  for (const aviso of props.avisos) {
    const etapa = lista.value.find(e => e.id === aviso.etapa_tramite_id)
    const evento = props.eventos?.find(
      e => e.id === aviso.evento_id && e.cliente_id === props.clienteId
    )
    if (etapa) textos.push(`Aviso pendiente de la etapa “${etapa.nombre}”.`)
    else if (evento)
      textos.push(
        `Aviso de cita: ${evento.motivo} el ${formatearFechaCorta(evento.fecha)}.`
      )
  }
  const porConfirmar = props.documentos.filter(
    d => d.estatus === 'por_confirmar'
  ).length
  if (porConfirmar)
    textos.push(
      `${porConfirmar} ${porConfirmar === 1 ? 'documento pendiente' : 'documentos pendientes'} de confirmar.`
    )
  return textos
})

const clasePestana = (activa: boolean) => [
  'border-b-2 px-4 py-3 font-medium transition-colors',
  activa
    ? 'border-acento-500 text-profundo-900'
    : 'border-transparent text-neutral-500 hover:text-neutral-700'
]
</script>

<template>
  <section
    data-seguimiento
    class="rounded-2xl bg-white p-6 shadow-sm"
  >
    <p class="text-xs font-medium uppercase tracking-wide text-marca-700">
      Seguimiento de trámite
    </p>
    <h2 class="font-display text-2xl font-semibold text-profundo-900">
      Resumen de las etapas
    </h2>

    <p
      v-if="!etapas"
      class="mt-6 rounded-xl border border-dashed border-neutral-300 p-6 text-center text-neutral-600"
    >
      No se pudo cargar el seguimiento del trámite.
    </p>

    <template v-else>
      <div
        role="tablist"
        class="mt-4 flex border-b border-neutral-200"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="pestana === 'resumen'"
          :class="clasePestana(pestana === 'resumen')"
          @click="pestana = 'resumen'"
        >
          Resumen
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="pestana === 'todas'"
          :class="clasePestana(pestana === 'todas')"
          @click="pestana = 'todas'"
        >
          Todas las etapas
        </button>
      </div>

      <div
        v-if="pestana === 'resumen'"
        class="mt-5 space-y-5"
      >
        <div
          data-avance-global
          class="rounded-xl border border-neutral-200 p-5"
        >
          <div class="flex items-end justify-between">
            <p
              class="text-xs font-medium uppercase tracking-wide text-neutral-500"
            >
              Avance global del trámite
            </p>
            <p class="font-display text-3xl font-semibold text-profundo-700">
              {{ etapas.avance_global }}%
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Avance global"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="etapas.avance_global"
            class="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200"
          >
            <div
              class="h-full rounded-full bg-acento-500"
              :style="{ width: `${etapas.avance_global}%` }"
            />
          </div>
        </div>

        <div
          v-if="actuales.length"
          class="grid gap-4 md:grid-cols-2"
        >
          <article
            v-for="etapa in actuales"
            :key="etapa.id"
            data-etapa-card
            class="rounded-xl border border-neutral-200 p-5"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="rounded bg-marca-100 px-2 py-0.5 text-sm font-semibold text-marca-800"
              >Paso {{ etapa.numero_paso }}</span>
              <span
                class="whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium"
                :class="claseEstatus(etapa.estatus_id)"
              >{{ nombreEstatus(etapa.estatus_id) }}</span>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-profundo-900">
              {{ etapa.nombre }}
            </h3>
            <p
              class="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-500"
            >
              Avance actual
            </p>
            <p class="font-semibold text-profundo-700">
              {{ etapa.avance_porcentaje }}%
            </p>
            <div
              role="progressbar"
              :aria-label="`Avance de ${etapa.nombre}`"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="etapa.avance_porcentaje"
              class="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200"
            >
              <div
                class="h-full rounded-full bg-acento-500"
                :style="{ width: `${etapa.avance_porcentaje}%` }"
              />
            </div>
            <p
              v-if="etapa.motivo_rechazo"
              class="mt-3 text-sm text-red-700"
            >
              Motivo: {{ etapa.motivo_rechazo }}
            </p>
            <p
              v-if="etapa.accion_a_realizar"
              class="mt-2 text-sm text-neutral-700"
            >
              Acción: {{ etapa.accion_a_realizar }}
            </p>
            <p
              v-if="etapa.fecha_compromiso"
              class="mt-2 text-sm text-neutral-600"
            >
              Fecha compromiso:
              {{ formatearFechaCorta(etapa.fecha_compromiso) }}
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <UButton
                v-if="puedeCambiar"
                size="sm"
                icon="i-lucide-refresh-cw"
                data-accion="cambiar-estatus"
                class="bg-acento-500 font-medium text-profundo-900 hover:bg-acento-400"
                @click="abrirCambio(etapa)"
              >
                Cambiar estatus
              </UButton>
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-history"
                data-accion="historial"
                @click="abrirHistorial(etapa)"
              >
                Historial
              </UButton>
            </div>
          </article>
        </div>
        <p
          v-else
          class="rounded-xl border border-dashed border-neutral-300 p-5 text-center text-neutral-600"
        >
          Aún no hay etapas en proceso: todas están por iniciar o finalizadas.
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <div
            data-proxima-cita
            class="rounded-xl border border-neutral-200 p-5"
          >
            <p
              class="text-xs font-medium uppercase tracking-wide text-neutral-500"
            >
              Próxima cita
            </p>
            <template v-if="eventos === null">
              <p class="mt-2 text-neutral-600">
                No disponible
              </p>
            </template>
            <template v-else-if="cita">
              <p
                class="mt-2 font-display text-2xl font-semibold text-profundo-900"
              >
                {{ formatearFechaCorta(cita.fecha) }} ·
                {{ horaCorta(cita.hora) }}
              </p>
              <p class="text-sm text-neutral-600">
                {{ cita.motivo }} · {{ textoDias(diasHasta(cita.fecha)) }}
              </p>
            </template>
            <p
              v-else
              class="mt-2 text-neutral-600"
            >
              Sin citas programadas
            </p>
          </div>
          <div
            data-ultima-actualizacion
            class="rounded-xl border border-neutral-200 p-5"
          >
            <p
              class="text-xs font-medium uppercase tracking-wide text-neutral-500"
            >
              Última actualización
            </p>
            <p
              class="mt-2 font-display text-2xl font-semibold text-profundo-900"
            >
              {{
                ultimaActualizacion
                  ? formatearFechaHora(ultimaActualizacion)
                  : "—"
              }}
            </p>
          </div>
        </div>

        <div>
          <h3 class="mb-3 text-lg text-profundo-700">
            Alertas
          </h3>
          <ul
            v-if="alertas.length"
            class="space-y-3"
          >
            <li
              v-for="alerta in alertas"
              :key="alerta"
              data-alerta
              class="flex items-center gap-3 rounded-lg border-l-4 border-acento-500 bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-100"
            >
              <UIcon
                name="i-lucide-triangle-alert"
                class="size-5 shrink-0 text-acento-700"
              />
              {{ alerta }}
            </li>
          </ul>
          <p
            v-else
            class="text-neutral-600"
          >
            Sin alertas por ahora.
          </p>
        </div>
      </div>

      <ol
        v-else
        class="mt-5 divide-y divide-neutral-200 rounded-xl border border-neutral-200"
      >
        <li
          v-for="etapa in lista"
          :key="etapa.id"
          data-etapa-fila
          class="flex items-center gap-4 px-4 py-3"
        >
          <span
            class="w-8 shrink-0 text-center font-semibold text-neutral-500"
          >{{ etapa.numero_paso }}</span>
          <span class="flex-1 text-neutral-900">{{ etapa.nombre }}</span>
          <span class="w-12 text-right text-sm text-neutral-600">{{ etapa.avance_porcentaje }}%</span>
          <span
            class="w-44 whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-sm font-medium"
            :class="claseEstatus(etapa.estatus_id)"
          >{{ nombreEstatus(etapa.estatus_id) }}</span>
          <span class="flex w-20 shrink-0 justify-end gap-1">
            <UButton
              v-if="puedeCambiar"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-refresh-cw"
              data-accion="cambiar-estatus"
              :aria-label="`Cambiar estatus de ${etapa.nombre}`"
              @click="abrirCambio(etapa)"
            />
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-history"
              data-accion="historial"
              :aria-label="`Historial de ${etapa.nombre}`"
              @click="abrirHistorial(etapa)"
            />
          </span>
        </li>
      </ol>
    </template>

    <UModal
      v-model:open="cambioAbierto"
      title="Cambiar estatus"
      :description="etapaACambiar?.nombre"
    >
      <template #body>
        <CambioEstatusFormulario
          v-if="etapaACambiar"
          :key="etapaACambiar.id"
          :cliente-id="clienteId"
          :etapa="etapaACambiar"
          :estatus="estatus"
          @cambiado="alCambiar"
          @recargar="emit('actualizar')"
          @cancelar="cambioAbierto = false"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="historialAbierto"
      title="Historial de cambios"
      :description="etapaHistorial?.nombre"
    >
      <template #body>
        <HistorialEtapa
          v-if="etapaHistorial"
          :key="etapaHistorial.id"
          :cliente-id="clienteId"
          :etapa="etapaHistorial"
          :estatus="estatus"
          :usuarios="usuarios"
        />
      </template>
    </UModal>
  </section>
</template>

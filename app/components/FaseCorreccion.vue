<script setup lang="ts">
import type { EstatusTramite, EtapaCliente } from '~/types/expediente'

const props = defineProps<{
  clave: string
  titulo: string
  clienteId: string
  requiere: boolean
  etapa: EtapaCliente | null
  estatus: EstatusTramite[]
  // Qué decir cuando el cliente no requiere esta fase.
  sinRequerir: string
}>()

// Una fase que el cliente no requiere se muestra plegada, pero se puede abrir por si hace falta registrarla.
const abierta = ref(props.requiere)
watch(
  () => props.requiere,
  (r) => {
    if (r) abierta.value = true
  }
)

const nombreEstatus = computed(() =>
  props.etapa
    ? (props.estatus.find(e => e.id === props.etapa!.estatus_id)?.nombre
      ?? '')
    : ''
)
</script>

<template>
  <article
    :data-fase-correccion="clave"
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
  >
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <h3 class="font-display text-lg font-semibold text-profundo-900">
          {{ titulo }}
        </h3>
        <span
          data-requiere-etiqueta
          :data-requiere="requiere ? 'si' : 'no'"
          class="rounded-full px-2.5 py-0.5 text-xs font-medium"
          :class="
            requiere
              ? 'bg-amber-100 text-amber-800'
              : 'bg-neutral-100 text-neutral-600'
          "
        >{{ requiere ? "Requiere" : "No requiere" }}</span>
      </div>
      <p
        v-if="etapa"
        class="flex flex-wrap items-center gap-2 text-xs text-neutral-600"
      >
        Estatus de la etapa:
        <span
          data-estatus-etapa
          class="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-800"
        >{{ nombreEstatus }}</span>
        <NuxtLink
          :to="`/clientes/${clienteId}`"
          data-accion="cambiar-en-expediente"
          class="font-medium text-profundo-700 underline hover:text-profundo-900"
        >Cambiar en el expediente</NuxtLink>
      </p>
    </header>

    <div
      v-if="abierta"
      data-contenido-fase
      class="mt-4 space-y-4"
    >
      <slot />
    </div>
    <div
      v-else
      class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600"
    >
      <span>{{ sinRequerir }}</span>
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        data-accion="mostrar-fase"
        @click="abierta = true"
      >
        Abrir de todos modos
      </UButton>
    </div>
  </article>
</template>

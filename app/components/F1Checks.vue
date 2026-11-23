<script setup lang="ts">
import type { ItemCatalogo, Seleccion } from '~/types/f1'

// Casillas de un catálogo con el detalle de "Otro". `nombre` es el prefijo de los name (p. ej. "objetivos-3").
const props = defineProps<{
  nombre: string
  titulo?: string
  catalogo: ItemCatalogo[]
  maximoColumnas?: number
}>()
const modelo = defineModel<Seleccion[]>({ default: () => [] })

const marcada = (id: number) => modelo.value.some(s => s.id === id)
const detalle = (id: number) =>
  modelo.value.find(s => s.id === id)?.detalle ?? ''
function alternar(id: number, marcar: boolean) {
  modelo.value = marcar
    ? [...modelo.value, { id, detalle: '' }]
    : modelo.value.filter(s => s.id !== id)
}
function cambiarDetalle(id: number, texto: string) {
  modelo.value = modelo.value.map(s =>
    s.id === id ? { ...s, detalle: texto } : s
  )
}
const columnas = computed(() =>
  props.maximoColumnas === 2
    ? 'md:grid-cols-2'
    : 'md:grid-cols-2 xl:grid-cols-3'
)
</script>

<template>
  <fieldset class="min-w-0 border-0 p-0">
    <legend
      v-if="titulo"
      class="mb-2 text-sm font-semibold text-profundo-700"
    >
      {{ titulo }}
    </legend>
    <div
      class="grid gap-2"
      :class="columnas"
    >
      <div
        v-for="c in catalogo"
        :key="c.id"
        class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2"
      >
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-neutral-900"
        >
          <input
            type="checkbox"
            :name="`${nombre}-${c.id}`"
            :checked="marcada(c.id)"
            @change="
              alternar(c.id, ($event.target as HTMLInputElement).checked)
            "
          >
          {{ c.nombre }}
        </label>
        <input
          v-if="c.nombre === 'Otro' && marcada(c.id)"
          :name="`${nombre}-detalle-${c.id}`"
          :value="detalle(c.id)"
          placeholder="Especifica"
          aria-label="Detalle de Otro"
          autocomplete="off"
          class="min-w-0 flex-1 rounded-md border border-marca-200 px-2 py-1 text-sm"
          @input="
            cambiarDetalle(c.id, ($event.target as HTMLInputElement).value)
          "
        >
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
// Barras horizontales dibujadas a mano: una fila por etiqueta, con su valor al final.
const props = defineProps<{ filas: { etiqueta: string, valor: number }[] }>()

const maximo = computed(() => Math.max(1, ...props.filas.map(f => f.valor)))
const ancho = (n: number) => `${(n / maximo.value) * 100}%`
</script>

<template>
  <ul class="space-y-1.5">
    <li
      v-for="f in filas"
      :key="f.etiqueta"
      data-barra
      class="grid grid-cols-[minmax(8rem,14rem)_1fr] items-center gap-3 text-sm"
    >
      <span class="text-right text-neutral-600">{{ f.etiqueta }}</span>
      <span class="flex items-center gap-2">
        <span
          class="h-4 rounded-full bg-profundo-500"
          :style="{ width: ancho(f.valor), minWidth: f.valor ? '0.5rem' : '0' }"
        />
        <span
          data-valor-barra
          class="font-semibold text-neutral-900"
        >{{
          f.valor
        }}</span>
      </span>
    </li>
  </ul>
</template>

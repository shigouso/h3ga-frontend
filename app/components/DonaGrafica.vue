<script setup lang="ts">
// Dona dibujada a mano con SVG (sin librerías de gráficas): un arco por segmento y el total al centro.
const props = defineProps<{
  segmentos: { nombre: string, valor: number, color: string }[]
  total: number
  etiqueta: string
}>()

const R = 70
const LARGO = 2 * Math.PI * R
const arcos = computed(() => {
  let acumulado = 0
  const suma = props.segmentos.reduce((a, s) => a + s.valor, 0)
  return props.segmentos.map((s) => {
    const largo = suma ? (s.valor / suma) * LARGO : 0
    const arco = { color: s.color, largo, desfase: -acumulado }
    acumulado += largo
    return arco
  })
})
const porcentaje = (valor: number) =>
  props.total ? Math.round((valor / props.total) * 100) : 0
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <div class="relative size-52">
      <svg
        viewBox="0 0 180 180"
        class="size-full -rotate-90"
        role="img"
        :aria-label="`${total} ${etiqueta}`"
      >
        <circle
          cx="90"
          cy="90"
          :r="R"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="22"
        />
        <circle
          v-for="(a, i) in arcos"
          :key="i"
          cx="90"
          cy="90"
          :r="R"
          fill="none"
          :stroke="a.color"
          stroke-width="22"
          :stroke-dasharray="`${Math.max(a.largo - 2, 0)} ${LARGO}`"
          :stroke-dashoffset="a.desfase"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-display text-4xl font-semibold text-profundo-900">{{
          total
        }}</span>
        <span
          class="text-xs font-semibold uppercase tracking-wide text-neutral-500"
        >{{ etiqueta }}</span>
      </div>
    </div>
    <ul class="w-full max-w-sm space-y-1.5 text-sm">
      <li
        v-for="s in segmentos"
        :key="s.nombre"
        data-leyenda
        class="flex items-center gap-2"
      >
        <span
          class="size-3 shrink-0 rounded-full"
          :style="{ backgroundColor: s.color }"
        />
        <span class="flex-1 text-neutral-800">{{ s.nombre }}</span>
        <span class="w-8 text-right font-semibold">{{ s.valor }}</span>
        <span class="w-12 text-right text-neutral-500">{{ porcentaje(s.valor) }}%</span>
      </li>
    </ul>
  </div>
</template>

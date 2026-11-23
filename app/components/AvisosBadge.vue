<script setup lang="ts">
const route = useRoute()
const avisos = useAvisosStore()

// Los pide al cargar y cada vez que cambia de pantalla; el Centro de avisos lo refresca al atender un aviso.
onMounted(avisos.cargar)
watch(() => route.path, avisos.cargar)
</script>

<template>
  <span
    v-if="avisos.pendientes > 0"
    class="inline-flex min-w-6 items-center justify-center rounded-full bg-marca-50 px-1.5 text-sm font-semibold text-profundo-500"
    :aria-label="`${avisos.pendientes} ${avisos.pendientes === 1 ? 'aviso pendiente' : 'avisos pendientes'}`"
  >{{ avisos.pendientes }}</span>
</template>

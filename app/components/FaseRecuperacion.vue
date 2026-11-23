<script setup lang="ts">
import type { CatalogoItem } from '~/types/cliente'
import type { Registro } from '~/types/f1'

const props = defineProps<{ clienteId: string }>()

// El análisis de recuperación de semanas se captura en el Diagnóstico Especializado (F1); aquí solo se resume.
const APLICA: Record<string, string> = {
  si: 'Sí',
  no: 'No',
  requiere_mas_evidencia: 'Requiere más evidencia'
}
const TIPO_OTRO = 8

const api = useDiagnostico(props.clienteId)
const catalogos = useApi()

const analisis = ref<Registro | null>(null)
const gestiones = ref<{ nombre: string, detalle: string | null }[]>([])
const evidencias = ref<{ nombre: string, detalle: string | null }[]>([])
const cargando = ref(true)
const fallo = ref(false)

function etiqueta(catalogo: CatalogoItem[], id: number, detalle: unknown) {
  const nombre = catalogo.find(c => c.id === id)?.nombre ?? 'Otro'
  return {
    nombre,
    detalle: id === TIPO_OTRO && detalle ? String(detalle) : null
  }
}

async function cargar() {
  cargando.value = true
  fallo.value = false
  try {
    const [resumen, g, e, catGestiones, catEvidencias] = await Promise.all([
      api.obtenerRecuperacion(),
      api.leerLista('recuperacion-gestiones'),
      api.leerLista('recuperacion-evidencias'),
      catalogos.get<CatalogoItem[]>('/catalogos/tipos-gestion-recuperacion'),
      catalogos.get<CatalogoItem[]>('/catalogos/tipos-evidencia-recuperacion')
    ])
    analisis.value = resumen ?? null
    gestiones.value = g.map(x =>
      etiqueta(catGestiones, Number(x.tipo_gestion_id), x.detalle_otro)
    )
    evidencias.value = e.map(x =>
      etiqueta(catEvidencias, Number(x.tipo_evidencia_id), x.detalle_otro)
    )
  } catch {
    // useApi ya avisó los 403 y los errores de red.
    fallo.value = true
  }
  cargando.value = false
}
onMounted(cargar)

const texto = (n: { nombre: string, detalle: string | null }) =>
  n.detalle ? `${n.nombre}: ${n.detalle}` : n.nombre
</script>

<template>
  <div
    data-seccion="recuperacion"
    class="rounded-2xl border border-neutral-200 p-5"
  >
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h4 class="font-medium text-profundo-900">
        Análisis de recuperación de semanas
      </h4>
      <UButton
        :to="`/clientes/${clienteId}/f1`"
        data-accion="abrir-f1"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-arrow-right"
      >
        Abrir en el diagnóstico (F1)
      </UButton>
    </div>

    <p
      v-if="cargando"
      class="py-6 text-center text-sm text-neutral-500"
      role="status"
    >
      Cargando la recuperación de semanas…
    </p>

    <div
      v-else-if="fallo"
      class="py-6 text-center"
      role="alert"
    >
      <p class="text-red-700">
        No se pudo cargar la recuperación de semanas.
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

    <p
      v-else-if="!analisis"
      class="rounded-xl border border-dashed border-neutral-300 py-6 text-center text-sm text-neutral-600"
    >
      Aún no se captura el análisis de recuperación de semanas en el diagnóstico
      especializado.
    </p>

    <div
      v-else
      class="space-y-4 text-sm"
    >
      <p>
        <span class="text-neutral-600">¿Aplica recuperación o aclaración?</span>
        <strong
          data-aplica
          class="ml-2 text-neutral-900"
        >{{
          APLICA[String(analisis.aplica)] ?? analisis.aplica
        }}</strong>
      </p>
      <p v-if="analisis.observaciones">
        <span class="block text-neutral-600">Observaciones</span>
        {{ analisis.observaciones }}
      </p>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <p class="mb-2 text-neutral-600">
            Gestión sugerida
          </p>
          <p
            v-if="gestiones.length === 0"
            class="text-neutral-500"
          >
            Sin gestiones sugeridas.
          </p>
          <ul
            v-else
            class="flex flex-wrap gap-2"
          >
            <li
              v-for="(g, i) in gestiones"
              :key="i"
              data-gestion
              class="rounded-full bg-marca-100 px-3 py-1 text-xs font-medium text-marca-800"
            >
              {{ texto(g) }}
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-2 text-neutral-600">
            Evidencia mínima sugerida
          </p>
          <p
            v-if="evidencias.length === 0"
            class="text-neutral-500"
          >
            Sin evidencia sugerida.
          </p>
          <ul
            v-else
            class="flex flex-wrap gap-2"
          >
            <li
              v-for="(e, i) in evidencias"
              :key="i"
              data-evidencia
              class="rounded-full bg-acento-100 px-3 py-1 text-xs font-medium text-acento-800"
            >
              {{ texto(e) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

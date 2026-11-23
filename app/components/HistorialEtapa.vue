<script setup lang="ts">
import type {
  CambioEstatus,
  EstatusTramite,
  EtapaCliente
} from '~/types/expediente'
import type { Usuario } from '~/types/usuario'
import { formatearFechaHora } from '~/utils/fechas'

const props = withDefaults(
  defineProps<{
    clienteId: string
    etapa: EtapaCliente
    estatus: EstatusTramite[]
    usuarios?: Usuario[]
  }>(),
  { usuarios: () => [] }
)

const sesion = useSessionStore()
const api = useEtapas(props.clienteId)

const cambios = ref<CambioEstatus[]>([])
const cargando = ref(true)
const fallo = ref(false)

async function cargar() {
  cargando.value = true
  fallo.value = false
  try {
    const lista = await api.historial(props.etapa.id)
    cambios.value = [...lista].sort((a, b) =>
      b.fecha_cambio.localeCompare(a.fecha_cambio)
    )
  } catch {
    // useApi ya avisó los 403 y los errores de red.
    fallo.value = true
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)

const nombreEstatus = (id: number | null) =>
  id === null
    ? 'Sin estatus previo'
    : (props.estatus.find(e => e.id === id)?.nombre ?? `Estatus ${id}`)

// Quien cambió: uno mismo, un usuario conocido (el Supervisor puede leerlos) o "Otro usuario".
function quien(id: string): string {
  if (sesion.usuario?.id === id) return sesion.usuario.nombre
  const usuario = props.usuarios.find(u => u.id === id)
  return usuario
    ? `${usuario.nombre} ${usuario.apellido_paterno}`.trim()
    : 'Otro usuario'
}
</script>

<template>
  <div>
    <p
      v-if="cargando"
      class="py-6 text-center text-neutral-500"
      role="status"
    >
      Cargando historial…
    </p>
    <div
      v-else-if="fallo"
      class="py-6 text-center"
      role="alert"
    >
      <p class="text-red-700">
        No se pudo cargar el historial.
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
      v-else-if="cambios.length === 0"
      class="py-6 text-center text-neutral-500"
    >
      Sin cambios registrados.
    </p>
    <ol
      v-else
      class="space-y-3"
    >
      <li
        v-for="cambio in cambios"
        :key="cambio.id"
        data-cambio
        class="rounded-lg border border-neutral-200 p-3"
      >
        <p class="font-medium text-profundo-900">
          {{ nombreEstatus(cambio.estatus_anterior_id) }} →
          {{ nombreEstatus(cambio.estatus_nuevo_id) }}
        </p>
        <p
          v-if="cambio.motivo_rechazo"
          class="mt-1 text-sm text-red-700"
        >
          Motivo: {{ cambio.motivo_rechazo }}
        </p>
        <p class="mt-1 text-sm text-neutral-600">
          {{ quien(cambio.cambiado_por) }} ·
          {{ formatearFechaHora(cambio.fecha_cambio) }}
        </p>
      </li>
    </ol>
  </div>
</template>

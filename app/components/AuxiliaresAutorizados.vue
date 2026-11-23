<script setup lang="ts">
import type {
  AsignacionAuxiliar,
  AuxiliarDisponible
} from '~/composables/useAuxiliares'
import { ApiError } from '~/utils/api-error'
import { formatearFechaHora } from '~/utils/fechas'
import { puede } from '~/utils/permisos'

const props = defineProps<{ clienteId: string }>()

const sesion = useSessionStore()
const toast = useToast()
const api = useAuxiliares(props.clienteId)

const puedeAutorizar = computed(() =>
  sesion.usuario ? puede(sesion.usuario.rol, 'auxiliares.autorizar') : false
)

const asignaciones = ref<AsignacionAuxiliar[]>([])
const disponibles = ref<AuxiliarDisponible[]>([])
const cargando = ref(true)
const falloLista = ref(false)
const falloDisponibles = ref(false)

onMounted(async () => {
  await Promise.all([
    api
      .listar()
      .then((v) => {
        asignaciones.value = v
      })
      .catch(() => {
        falloLista.value = true
      }),
    api
      .disponibles()
      .then((v) => {
        disponibles.value = v
      })
      .catch(() => {
        falloDisponibles.value = true
      })
  ])
  cargando.value = false
})

const datos = (id: string) => disponibles.value.find(a => a.id === id)
const nombre = (id: string) => {
  const a = datos(id)
  return a
    ? [a.nombre, a.apellido_paterno, a.apellido_materno]
        .filter(Boolean)
        .join(' ')
    : 'Auxiliar'
}
const iniciales = (id: string) => {
  const a = datos(id)
  return a
    ? `${a.nombre.charAt(0)}${a.apellido_paterno.charAt(0)}`.toUpperCase()
    : 'AU'
}
// Solo auxiliares activos que no tengan ya una asignación (activa o no: para volver a activarla está el botón de la fila).
const elegibles = computed(() =>
  disponibles.value.filter(
    a => a.activo && !asignaciones.value.some(x => x.auxiliar_id === a.id)
  )
)

const elegido = ref('')
const trabajando = ref(false)
const errorGeneral = ref<string | null>(null)

function mostrarError(e: unknown) {
  if (!(e instanceof ApiError)) throw e
  // Sin conexión y sin permiso ya los avisó useApi.
  if (e.status !== 0 && e.status !== 403)
    errorGeneral.value
      = e.status === 409 || e.status === 400
        ? e.mensaje
        : 'No se pudo completar la acción. Inténtalo de nuevo.'
}

async function autorizar() {
  if (!elegido.value) return
  errorGeneral.value = null
  trabajando.value = true
  try {
    const nueva = await api.autorizar(elegido.value)
    asignaciones.value = [...asignaciones.value, nueva]
    toast.add({
      title: 'Auxiliar autorizado',
      description: nombre(nueva.auxiliar_id),
      color: 'success'
    })
    elegido.value = ''
  } catch (e) {
    mostrarError(e)
  } finally {
    trabajando.value = false
  }
}

async function alternar(a: AsignacionAuxiliar) {
  errorGeneral.value = null
  trabajando.value = true
  try {
    const actualizada = await api.cambiarActivo(a.id, !a.activo)
    asignaciones.value = asignaciones.value.map(x =>
      x.id === actualizada.id ? actualizada : x
    )
    toast.add({
      title: actualizada.activo ? 'Auxiliar activado' : 'Auxiliar desactivado',
      description: nombre(actualizada.auxiliar_id),
      color: 'success'
    })
  } catch (e) {
    mostrarError(e)
  } finally {
    trabajando.value = false
  }
}
</script>

<template>
  <section
    data-auxiliares
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
  >
    <h3
      class="flex items-center gap-2 font-display text-lg font-semibold text-profundo-700"
    >
      <UIcon
        name="i-lucide-users-round"
        class="size-5"
      />
      Auxiliares autorizados
    </h3>
    <p class="mt-1 text-sm text-neutral-600">
      Un auxiliar autorizado puede ver este expediente, subir documentos y
      revisarlos.
    </p>

    <p
      v-if="cargando"
      class="py-4 text-sm text-neutral-500"
      role="status"
    >
      Cargando auxiliares…
    </p>

    <p
      v-else-if="falloLista"
      role="alert"
      class="py-4 text-sm text-red-700"
    >
      No se pudieron cargar los auxiliares de este cliente.
    </p>

    <template v-else>
      <p
        v-if="asignaciones.length === 0"
        class="mt-4 rounded-xl border border-dashed border-neutral-300 py-5 text-center text-sm text-neutral-500"
      >
        Aún no hay auxiliares autorizados.
      </p>

      <ul
        v-else
        class="mt-4 space-y-2"
      >
        <li
          v-for="a in asignaciones"
          :key="a.id"
          data-auxiliar
          class="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-marca-100 text-sm font-semibold text-marca-800"
          >{{ iniciales(a.auxiliar_id) }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-neutral-900">
              {{ nombre(a.auxiliar_id) }}
            </p>
            <p
              v-if="datos(a.auxiliar_id)"
              class="truncate text-xs text-neutral-500"
            >
              {{ datos(a.auxiliar_id)!.correo_electronico }}
            </p>
            <p class="text-xs text-neutral-500">
              Autorizado el {{ formatearFechaHora(a.fecha_autorizacion) }}
            </p>
          </div>
          <span
            data-estado
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            :class="
              a.activo
                ? 'bg-green-100 text-green-800'
                : 'bg-neutral-200 text-neutral-600'
            "
          >{{ a.activo ? "Activo" : "Inactivo" }}</span>
          <UButton
            v-if="puedeAutorizar"
            data-accion="alternar-auxiliar"
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="trabajando"
            @click="alternar(a)"
          >
            {{ a.activo ? "Desactivar" : "Activar" }}
          </UButton>
        </li>
      </ul>

      <div
        v-if="puedeAutorizar"
        class="mt-4 flex flex-wrap items-end gap-3 border-t border-neutral-200 pt-4"
      >
        <label class="min-w-56 flex-1 text-sm font-medium text-neutral-800">
          Autorizar a un auxiliar
          <select
            v-model="elegido"
            name="auxiliar_id"
            :disabled="falloDisponibles || trabajando"
            class="mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900"
          >
            <option value="">Selecciona un auxiliar</option>
            <option
              v-for="a in elegibles"
              :key="a.id"
              :value="a.id"
            >
              {{
                [a.nombre, a.apellido_paterno, a.apellido_materno]
                  .filter(Boolean)
                  .join(" ")
              }}
            </option>
          </select>
        </label>
        <UButton
          data-accion="autorizar-auxiliar"
          icon="i-lucide-user-round-plus"
          :disabled="!elegido || trabajando"
          :loading="trabajando"
          class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
          @click="autorizar"
        >
          Autorizar
        </UButton>
        <p
          v-if="falloDisponibles"
          class="w-full text-sm text-amber-700"
        >
          No se pudo cargar la lista de auxiliares disponibles.
        </p>
        <p
          v-else-if="elegibles.length === 0"
          class="w-full text-sm text-neutral-500"
        >
          No hay más auxiliares disponibles para autorizar.
        </p>
      </div>

      <p
        v-if="errorGeneral"
        role="alert"
        class="mt-3 text-sm font-medium text-red-700"
      >
        {{ errorGeneral }}
      </p>
    </template>
  </section>
</template>

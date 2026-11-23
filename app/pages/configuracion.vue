<script setup lang="ts">
import { hora12 } from '~/utils/agenda'
import { ApiError } from '~/utils/api-error'
import { puede } from '~/utils/permisos'
import { reproducirCampana } from '~/utils/sonido'

definePageMeta({ titulo: 'Configuración del Sistema' })

const ROLES = {
  asesor: 'Asesor',
  auxiliar: 'Auxiliar',
  supervisor: 'Supervisor'
} as const

const sesion = useSessionStore()
const preferencias = usePreferenciasStore()
const toast = useToast()
const api = useCuenta()

const rol = computed(() => (sesion.usuario ? ROLES[sesion.usuario.rol] : ''))
const administraUsuarios = computed(() =>
  sesion.usuario ? puede(sesion.usuario.rol, 'usuarios.administrar') : false
)
const venceSesion = computed(() => {
  if (sesion.expiraEn === null) return null
  const f = new Date(sesion.expiraEn)
  return hora12(`${f.getHours()}:${f.getMinutes()}`)
})

// ---------- Cambiar contraseña ----------
const MINIMO = 8
const MAXIMO = 72

const actual = ref('')
const nueva = ref('')
const confirmacion = ref('')
const errores = reactive<{
  actual?: string
  nueva?: string
  confirmacion?: string
}>({})
const errorGeneral = ref<string | null>(null)
const enviando = ref(false)

function validar(): boolean {
  errores.actual = actual.value ? undefined : 'Ingresa tu contraseña actual'
  if (!nueva.value) errores.nueva = 'Ingresa la nueva contraseña'
  else if (nueva.value.length < MINIMO)
    errores.nueva = `La contraseña debe tener al menos ${MINIMO} caracteres`
  else if (nueva.value.length > MAXIMO)
    errores.nueva = `La contraseña no debe pasar de ${MAXIMO} caracteres`
  else if (nueva.value === actual.value)
    errores.nueva = 'La nueva contraseña debe ser distinta a la actual'
  else errores.nueva = undefined
  errores.confirmacion
    = confirmacion.value === nueva.value
      ? undefined
      : 'Las contraseñas no coinciden'
  return !errores.actual && !errores.nueva && !errores.confirmacion
}

async function cambiarContrasena() {
  errorGeneral.value = null
  if (!validar()) return
  enviando.value = true
  try {
    await api.cambiarContrasena(actual.value, nueva.value)
    actual.value = ''
    nueva.value = ''
    confirmacion.value = ''
    toast.add({
      title: 'Contraseña actualizada',
      description: 'Úsala la próxima vez que inicies sesión.',
      color: 'success'
    })
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    // Un 401 ya cerró la sesión y sin conexión useApi avisó; un 400 trae el motivo.
    if (error.status === 400) {
      if (/incorrecta/i.test(error.mensaje)) errores.actual = error.mensaje
      else errores.nueva = error.mensaje
    } else if (error.status !== 0 && error.status !== 401) {
      errorGeneral.value
        = 'No se pudo cambiar la contraseña. Inténtalo de nuevo.'
    }
  } finally {
    enviando.value = false
  }
}

const claseCampo
  = 'mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900'
const claseSeccion = 'rounded-2xl bg-white p-6 shadow-sm'
</script>

<template>
  <section class="space-y-5">
    <div>
      <h2 class="font-display text-3xl font-semibold text-profundo-900">
        Configuración del Sistema
      </h2>
      <p class="text-neutral-700">
        Tu cuenta, tu contraseña y cómo quieres que te avise la campana.
      </p>
    </div>

    <div class="grid items-start gap-5 xl:grid-cols-2">
      <div class="space-y-5">
        <!-- Mi cuenta -->
        <article
          data-seccion="cuenta"
          :class="claseSeccion"
        >
          <h3 class="font-display text-lg font-semibold text-profundo-700">
            Mi cuenta
          </h3>
          <dl class="mt-4 space-y-3 text-sm">
            <div
              class="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3"
            >
              <dt class="text-neutral-600">
                Nombre
              </dt>
              <dd class="font-medium text-neutral-900">
                {{ sesion.usuario?.nombre }}
              </dd>
            </div>
            <div
              class="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3"
            >
              <dt class="text-neutral-600">
                Rol
              </dt>
              <dd>
                <span
                  data-rol
                  class="rounded border border-profundo-500 px-2 py-0.5 text-xs font-medium text-profundo-500"
                >{{ rol }}</span>
              </dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-neutral-600">
                Sesión
              </dt>
              <dd
                v-if="venceSesion"
                data-sesion-vence
                class="text-neutral-900"
              >
                Vence a las {{ venceSesion }}
              </dd>
            </div>
          </dl>
          <UButton
            v-if="administraUsuarios"
            to="/usuarios"
            data-accion="administrar-usuarios"
            class="mt-5 bg-profundo-500 text-white hover:bg-profundo-600"
            icon="i-lucide-users"
          >
            Administrar usuarios y roles
          </UButton>
        </article>

        <!-- Avisos y campana -->
        <article
          data-seccion="campana"
          :class="claseSeccion"
        >
          <h3 class="font-display text-lg font-semibold text-profundo-700">
            Avisos y campana
          </h3>
          <p class="mt-1 text-sm text-neutral-600">
            La campana del encabezado te recuerda cada hora los avisos que no
            has atendido.
          </p>
          <div class="mt-4 space-y-3">
            <label
              class="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
            >
              <span>
                <span class="block font-medium text-neutral-900">Sonido de la campana</span>
                <span class="block text-xs text-neutral-600">Una campanita suave cuando te recuerde.</span>
              </span>
              <input
                v-model="preferencias.sonidoCampana"
                type="checkbox"
                name="sonido-campana"
                class="size-5 accent-marca-600"
              >
            </label>
            <label
              class="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
            >
              <span>
                <span class="block font-medium text-neutral-900">Movimiento de la campana</span>
                <span class="block text-xs text-neutral-600">La campana se sacude un momento cada hora.</span>
              </span>
              <input
                v-model="preferencias.movimientoCampana"
                type="checkbox"
                name="movimiento-campana"
                class="size-5 accent-marca-600"
              >
            </label>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p class="text-xs text-neutral-500">
              Estas preferencias se guardan en este navegador.
            </p>
            <UButton
              data-accion="probar-sonido"
              color="neutral"
              variant="outline"
              icon="i-lucide-volume-2"
              @click="reproducirCampana()"
            >
              Probar sonido
            </UButton>
          </div>
        </article>
      </div>

      <!-- Cambiar contraseña -->
      <article
        data-seccion="contrasena"
        :class="claseSeccion"
      >
        <h3 class="font-display text-lg font-semibold text-profundo-700">
          Cambiar contraseña
        </h3>
        <p class="mt-1 text-sm text-neutral-600">
          Usa de 8 a 72 caracteres. Tu sesión actual sigue abierta.
        </p>
        <form
          class="mt-4 space-y-4"
          novalidate
          @submit.prevent="cambiarContrasena"
        >
          <label
            class="block text-sm font-medium text-neutral-800"
            data-campo="contrasena_actual"
          >
            Contraseña actual
            <input
              v-model="actual"
              type="password"
              name="contrasena_actual"
              autocomplete="current-password"
              :class="claseCampo"
            >
            <span
              v-if="errores.actual"
              class="mt-1 block text-sm text-red-700"
            >{{ errores.actual }}</span>
          </label>
          <label
            class="block text-sm font-medium text-neutral-800"
            data-campo="contrasena_nueva"
          >
            Nueva contraseña
            <input
              v-model="nueva"
              type="password"
              name="contrasena_nueva"
              autocomplete="new-password"
              :class="claseCampo"
            >
            <span
              v-if="errores.nueva"
              class="mt-1 block text-sm text-red-700"
            >{{ errores.nueva }}</span>
          </label>
          <label
            class="block text-sm font-medium text-neutral-800"
            data-campo="confirmacion"
          >
            Confirma la nueva contraseña
            <input
              v-model="confirmacion"
              type="password"
              name="confirmacion"
              autocomplete="new-password"
              :class="claseCampo"
            >
            <span
              v-if="errores.confirmacion"
              class="mt-1 block text-sm text-red-700"
            >{{ errores.confirmacion }}</span>
          </label>
          <p
            v-if="errorGeneral"
            role="alert"
            class="text-sm font-medium text-red-700"
          >
            {{ errorGeneral }}
          </p>
          <div class="flex justify-end border-t border-neutral-200 pt-4">
            <UButton
              type="button"
              data-accion="cambiar-contrasena"
              :loading="enviando"
              class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
              @click="cambiarContrasena"
            >
              Cambiar contraseña
            </UButton>
          </div>
        </form>
      </article>
    </div>
  </section>
</template>

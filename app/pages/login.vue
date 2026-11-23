<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { ApiError } from '~/utils/api-error'

definePageMeta({ layout: 'auth' })

// Texto negro; línea gris que se vuelve azul solo en el campo enfocado.
const inputBase
  = 'rounded-none border-b-2 border-neutral-500 px-1 !text-black caret-black placeholder:text-neutral-500 focus:border-marca-600 focus:outline-none focus-visible:border-marca-600 focus-visible:outline-none focus-visible:ring-0'

const MENSAJE_CREDENCIALES = 'Correo o contraseña incorrectos.'

const sesion = useSessionStore()
const estado = reactive({ correo: '', contrasena: '' })
const verContrasena = ref(false)
const enviando = ref(false)
const errorGeneral = ref<string | null>(null)

function validar(datos: typeof estado): FormError[] {
  const errores: FormError[] = []
  const correo = datos.correo.trim()
  if (!correo) errores.push({ name: 'correo', message: 'Ingresa tu correo' })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    errores.push({ name: 'correo', message: 'Ingresa un correo válido' })
  if (!datos.contrasena)
    errores.push({ name: 'contrasena', message: 'Ingresa tu contraseña' })
  return errores
}

async function entrar() {
  errorGeneral.value = null
  enviando.value = true
  try {
    await sesion.iniciarSesion(estado.correo.trim(), estado.contrasena)
    await navigateTo('/')
  } catch (error) {
    // 401 siempre muestra el mismo mensaje (correo inexistente, contraseña incorrecta o usuario inactivo).
    if (error instanceof ApiError && error.status === 401)
      errorGeneral.value = MENSAJE_CREDENCIALES
    // Sin conexión: useApi ya mostró el aviso.
    else if (!(error instanceof ApiError && error.status === 0))
      errorGeneral.value = 'No se pudo iniciar sesión. Inténtalo de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[400px]">
    <img
      src="/img/logo-circular.png"
      alt="H3GA Seguros y Pensiones"
      class="mx-auto mb-6 size-20 shrink-0 object-contain sm:mb-10 [@media(max-height:820px)]:mb-4 [@media(max-height:620px)]:mb-2"
    >

    <h1
      class="text-center font-display text-3xl font-semibold leading-tight text-profundo-900 sm:text-4xl [@media(max-height:820px)]:text-3xl [@media(max-height:620px)]:text-2xl"
    >
      Bienvenido a H3GA.
    </h1>
    <p
      class="mt-4 text-center text-base text-neutral-600 [@media(max-height:820px)]:mt-2 [@media(max-height:820px)]:text-sm"
    >
      Inicie sesión para gestionar los expedientes y estrategias de pensión de
      sus clientes
    </p>

    <UAlert
      v-if="sesion.mensaje"
      class="mt-6"
      color="warning"
      variant="subtle"
      icon="i-lucide-info"
      :description="sesion.mensaje"
    />

    <UForm
      :state="estado"
      :validate="validar"
      novalidate
      class="mt-8 space-y-6 [@media(max-height:820px)]:mt-5 [@media(max-height:820px)]:space-y-4 [@media(max-height:620px)]:mt-3 [@media(max-height:620px)]:space-y-2"
      @submit="entrar"
    >
      <UFormField
        label="Correo"
        name="correo"
        class="group"
        :ui="{
          label:
            'text-neutral-700 font-medium transition-colors group-focus-within:text-marca-700'
        }"
      >
        <UInput
          v-model="estado.correo"
          type="email"
          autocomplete="username"
          placeholder="Ingresa tu correo"
          leading-icon="i-lucide-user"
          variant="none"
          class="w-full"
          :ui="{
            base: inputBase,
            leadingIcon: 'text-neutral-600 group-focus-within:text-marca-700'
          }"
        />
      </UFormField>

      <UFormField
        label="Contraseña"
        name="contrasena"
        class="group"
        :ui="{
          label:
            'text-neutral-700 font-medium transition-colors group-focus-within:text-marca-700'
        }"
      >
        <UInput
          v-model="estado.contrasena"
          name="contrasena"
          :type="verContrasena ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Ingresa tu contraseña"
          leading-icon="i-lucide-lock"
          variant="none"
          class="w-full"
          :ui="{
            base: inputBase,
            leadingIcon: 'text-neutral-600 group-focus-within:text-marca-700'
          }"
        >
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="link"
              size="sm"
              :icon="verContrasena ? 'i-lucide-eye' : 'i-lucide-eye-off'"
              :aria-label="
                verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'
              "
              @click="verContrasena = !verContrasena"
            />
          </template>
        </UInput>
      </UFormField>

      <p
        v-if="errorGeneral"
        role="alert"
        class="text-center text-sm font-medium text-red-700"
      >
        {{ errorGeneral }}
      </p>

      <UButton
        type="submit"
        block
        size="xl"
        :loading="enviando"
        class="bg-marca-600 text-white hover:bg-marca-700 [@media(max-height:820px)]:!py-2"
      >
        Iniciar sesión
      </UButton>

      <p class="text-center text-sm text-marca-700">
        ¿Olvidaste tu contraseña? Contacta a tu supervisor.
      </p>
    </UForm>
  </div>
</template>

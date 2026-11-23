<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type {
  ActualizarUsuario,
  RolCatalogo,
  TipoAsesor,
  Usuario
} from '~/types/usuario'
import { ApiError } from '~/utils/api-error'
import { mensajeDeCampo } from '~/utils/errores-api'
import { nombreRolVisible, ROL_ID } from '~/utils/roles'

const props = defineProps<{
  usuario: Usuario | null
  roles: RolCatalogo[]
  tiposAsesor: TipoAsesor[]
}>()
const emit = defineEmits<{ guardado: [usuario: Usuario], cancelar: [] }>()

const api = useUsuarios()
const formulario = useTemplateRef('formulario')
const enviando = ref(false)
const errorGeneral = ref<string | null>(null)

const editando = computed(() => props.usuario !== null)
const CAMPOS = [
  'nombre',
  'apellido_paterno',
  'apellido_materno',
  'correo_electronico',
  'contrasena',
  'rol_id',
  'tipo_asesor_id'
]

const estado = reactive({
  nombre: props.usuario?.nombre ?? '',
  apellido_paterno: props.usuario?.apellido_paterno ?? '',
  apellido_materno: props.usuario?.apellido_materno ?? '',
  correo_electronico: props.usuario?.correo_electronico ?? '',
  contrasena: '',
  rol_id: (props.usuario?.rol_id ?? props.roles[0]?.id ?? '') as number | '',
  tipo_asesor_id: (props.usuario?.tipo_asesor_id ?? '') as number | ''
})

// El tipo de asesor solo aplica a asesores, y solo se ofrece si el catálogo tiene tipos.
const pedirTipoAsesor = computed(
  () => estado.rol_id === ROL_ID.asesor && props.tiposAsesor.length > 0
)

function validar(datos: typeof estado): FormError[] {
  const errores: FormError[] = []
  if (!datos.nombre.trim())
    errores.push({ name: 'nombre', message: 'Ingresa el nombre' })
  if (!datos.apellido_paterno.trim())
    errores.push({
      name: 'apellido_paterno',
      message: 'Ingresa el apellido paterno'
    })
  const correo = datos.correo_electronico.trim()
  if (!correo)
    errores.push({ name: 'correo_electronico', message: 'Ingresa el correo' })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    errores.push({
      name: 'correo_electronico',
      message: 'Ingresa un correo válido'
    })
  if (datos.rol_id === '')
    errores.push({ name: 'rol_id', message: 'Elige un rol' })
  if (!editando.value) {
    if (!datos.contrasena)
      errores.push({ name: 'contrasena', message: 'Ingresa una contraseña' })
    else if (datos.contrasena.length < 8)
      errores.push({
        name: 'contrasena',
        message: 'La contraseña debe tener al menos 8 caracteres'
      })
    else if (datos.contrasena.length > 72)
      errores.push({
        name: 'contrasena',
        message: 'La contraseña no debe pasar de 72 caracteres'
      })
  }
  return errores
}

function datosBase(): ActualizarUsuario {
  const datos: ActualizarUsuario = {
    rol_id: estado.rol_id as number,
    nombre: estado.nombre.trim(),
    apellido_paterno: estado.apellido_paterno.trim(),
    apellido_materno: estado.apellido_materno.trim(),
    correo_electronico: estado.correo_electronico.trim()
  }
  if (pedirTipoAsesor.value && estado.tipo_asesor_id !== '')
    datos.tipo_asesor_id = estado.tipo_asesor_id
  // Si deja de ser asesor, el backend exige quitar el tipo de asesor que tuviera.
  else if (
    estado.rol_id !== ROL_ID.asesor
    && props.usuario?.tipo_asesor_id != null
  )
    datos.tipo_asesor_id = null
  return datos
}

async function guardar() {
  errorGeneral.value = null
  enviando.value = true
  try {
    const guardado = props.usuario
      ? await api.actualizar(props.usuario.id, datosBase())
      : await api.crear({
          ...datosBase(),
          contrasena: estado.contrasena
        } as Parameters<typeof api.crear>[0])
    emit('guardado', guardado)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status === 409) {
      formulario.value?.setErrors([
        { name: 'correo_electronico', message: error.mensaje }
      ])
    } else if (
      error.status === 400
      && error.campos
      && Object.keys(error.campos).some(c => CAMPOS.includes(c))
    ) {
      formulario.value?.setErrors(
        Object.entries(error.campos)
          .filter(([campo]) => CAMPOS.includes(campo))
          .map(([campo, texto]) => ({
            name: campo,
            message: mensajeDeCampo(texto)
          }))
      )
    }
    // Sin conexión: useApi ya mostró el aviso.
    else if (error.status !== 0) {
      errorGeneral.value
        = error.status === 400
          ? error.mensaje
          : 'No se pudo guardar. Inténtalo de nuevo.'
    }
  } finally {
    enviando.value = false
  }
}

// Restablecer la contraseña de otro usuario (solo al editar). Va aparte de los datos: tiene su propia ruta.
const toast = useToast()
const reiniciando = ref(false)
const nuevaContrasena = ref('')
const errorNuevaContrasena = ref<string | undefined>()
const errorReinicio = ref<string | null>(null)
const mensajeReinicio = ref<string | null>(null)
const enviandoReinicio = ref(false)

function iniciarReinicio() {
  mensajeReinicio.value = null
  errorNuevaContrasena.value = undefined
  errorReinicio.value = null
  nuevaContrasena.value = ''
  reiniciando.value = true
}
function cancelarReinicio() {
  reiniciando.value = false
  nuevaContrasena.value = ''
  errorNuevaContrasena.value = undefined
  errorReinicio.value = null
}

async function guardarContrasena() {
  errorNuevaContrasena.value = undefined
  errorReinicio.value = null
  if (!props.usuario) return
  if (!nuevaContrasena.value) {
    errorNuevaContrasena.value = 'Ingresa la nueva contraseña'
    return
  }
  if (nuevaContrasena.value.length < 8) {
    errorNuevaContrasena.value
      = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (nuevaContrasena.value.length > 72) {
    errorNuevaContrasena.value = 'La contraseña no debe pasar de 72 caracteres'
    return
  }

  enviandoReinicio.value = true
  try {
    await api.restablecerContrasena(props.usuario.id, nuevaContrasena.value)
    cancelarReinicio()
    mensajeReinicio.value
      = 'Contraseña restablecida. Entrégasela al usuario por un medio seguro.'
    toast.add({
      title: 'Contraseña restablecida',
      description: `${props.usuario.nombre} ${props.usuario.apellido_paterno}`,
      color: 'success'
    })
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status === 400 && error.campos?.contrasena)
      errorNuevaContrasena.value = mensajeDeCampo(error.campos.contrasena)
    // Sin conexión: useApi ya mostró el aviso.
    else if (error.status !== 0)
      errorReinicio.value
        = error.status === 404 || error.status === 400
          ? error.mensaje
          : 'No se pudo restablecer la contraseña. Inténtalo de nuevo.'
  } finally {
    enviandoReinicio.value = false
  }
}

const claseSelect
  = 'w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900 focus:outline-2 focus:outline-marca-600'
</script>

<template>
  <UForm
    ref="formulario"
    :state="estado"
    :validate="validar"
    novalidate
    class="space-y-4"
    @submit="guardar"
  >
    <UFormField
      label="Nombre(s)"
      name="nombre"
      data-campo="nombre"
    >
      <UInput
        v-model="estado.nombre"
        name="nombre"
        autocomplete="off"
        class="w-full"
      />
    </UFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Apellido paterno"
        name="apellido_paterno"
        data-campo="apellido_paterno"
      >
        <UInput
          v-model="estado.apellido_paterno"
          name="apellido_paterno"
          autocomplete="off"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Apellido materno"
        name="apellido_materno"
        data-campo="apellido_materno"
      >
        <UInput
          v-model="estado.apellido_materno"
          name="apellido_materno"
          autocomplete="off"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      label="Correo electrónico"
      name="correo_electronico"
      data-campo="correo_electronico"
    >
      <UInput
        v-model="estado.correo_electronico"
        name="correo_electronico"
        type="email"
        autocomplete="off"
        placeholder="nombre.apellido@h3ga.mx"
        class="w-full"
      />
    </UFormField>

    <UFormField
      v-if="!editando"
      label="Contraseña inicial"
      name="contrasena"
      data-campo="contrasena"
      hint="Mínimo 8 caracteres"
    >
      <UInput
        v-model="estado.contrasena"
        name="contrasena"
        type="password"
        autocomplete="new-password"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Rol"
      name="rol_id"
      data-campo="rol_id"
    >
      <select
        v-model.number="estado.rol_id"
        name="rol_id"
        :class="claseSelect"
      >
        <option
          v-for="rol in roles"
          :key="rol.id"
          :value="rol.id"
        >
          {{ nombreRolVisible(rol.nombre) }}
        </option>
      </select>
    </UFormField>

    <UFormField
      v-if="pedirTipoAsesor"
      label="Tipo de asesor"
      name="tipo_asesor_id"
      data-campo="tipo_asesor_id"
    >
      <select
        v-model.number="estado.tipo_asesor_id"
        name="tipo_asesor_id"
        :class="claseSelect"
      >
        <option value="">
          Sin especificar
        </option>
        <option
          v-for="tipo in tiposAsesor"
          :key="tipo.id"
          :value="tipo.id"
        >
          {{ tipo.nombre }}
        </option>
      </select>
    </UFormField>

    <section
      v-if="editando"
      class="rounded-lg border border-marca-100 bg-marca-50/40 p-4"
    >
      <p class="font-medium text-profundo-900">
        Contraseña
      </p>
      <template v-if="!reiniciando">
        <p class="mt-1 text-sm text-neutral-600">
          La contraseña actual no se puede ver. Puedes asignarle una nueva.
        </p>
        <p
          v-if="mensajeReinicio"
          role="status"
          class="mt-2 text-sm font-medium text-green-700"
        >
          {{ mensajeReinicio }}
        </p>
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-key-round"
          class="mt-3"
          data-accion="restablecer-contrasena"
          @click="iniciarReinicio"
        >
          Restablecer contraseña
        </UButton>
      </template>
      <template v-else>
        <UFormField
          label="Nueva contraseña"
          hint="Mínimo 8 caracteres"
          :error="errorNuevaContrasena"
          data-campo="nueva_contrasena"
          class="mt-2"
        >
          <UInput
            v-model="nuevaContrasena"
            name="nueva_contrasena"
            type="password"
            autocomplete="new-password"
            class="w-full"
            @keydown.enter.prevent="guardarContrasena"
          />
        </UFormField>
        <p
          v-if="errorReinicio"
          role="alert"
          class="mt-2 text-sm font-medium text-red-700"
        >
          {{ errorReinicio }}
        </p>
        <div class="mt-3 flex gap-2">
          <UButton
            type="button"
            size="sm"
            class="bg-profundo-500 text-white hover:bg-profundo-600"
            data-accion="guardar-contrasena"
            :loading="enviandoReinicio"
            @click="guardarContrasena"
          >
            Guardar contraseña
          </UButton>
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            size="sm"
            data-accion="cancelar-contrasena"
            @click="cancelarReinicio"
          >
            Cancelar
          </UButton>
        </div>
      </template>
    </section>

    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>

    <div class="flex justify-end gap-3 border-t border-marca-100 pt-4">
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        data-accion="cancelar"
        @click="emit('cancelar')"
      >
        Cancelar
      </UButton>
      <UButton
        type="submit"
        :loading="enviando"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
      >
        {{ editando ? "Guardar cambios" : "Registrar usuario" }}
      </UButton>
    </div>
  </UForm>
</template>

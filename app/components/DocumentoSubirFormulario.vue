<script setup lang="ts">
import type { DocumentoCliente, TipoDocumento } from '~/types/expediente'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{ clienteId: string, tipos: TipoDocumento[] }>()
const emit = defineEmits<{
  subido: [documento: DocumentoCliente]
  cancelar: []
}>()

const MAXIMO_BYTES = 10 * 1024 * 1024
const MIMES_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png']

const docs = useDocumentos()
const toast = useToast()

// Con un solo tipo disponible (por ejemplo desde un documento requerido) ya viene elegido.
const tipoElegido = ref<number | ''>(
  props.tipos.length === 1 ? props.tipos[0]!.id : ''
)
const archivo = ref<File | null>(null)
const referencia = ref('')
const observaciones = ref('')
const errores = reactive<{ tipo?: string, archivo?: string }>({})
const errorSubida = ref<string | null>(null)
const subiendo = ref(false)

function alElegirArchivo(evento: Event) {
  archivo.value = (evento.target as HTMLInputElement).files?.[0] ?? null
  errores.archivo = undefined
}

// Mismas reglas que el backend (PDF, JPG o PNG de hasta 10 MB), validadas antes de enviar.
function validar(): boolean {
  errores.tipo
    = tipoElegido.value === '' ? 'Elige el tipo de documento' : undefined
  if (!archivo.value) errores.archivo = 'Elige un archivo'
  else if (!MIMES_PERMITIDOS.includes(archivo.value.type))
    errores.archivo = 'Solo se aceptan PDF, JPG o PNG.'
  else if (archivo.value.size > MAXIMO_BYTES)
    errores.archivo = 'El archivo no debe pesar más de 10 MB.'
  else errores.archivo = undefined
  return !errores.tipo && !errores.archivo
}

async function subir() {
  errorSubida.value = null
  if (!validar()) return
  const datos = new FormData()
  datos.append('tipo_documento_id', String(tipoElegido.value))
  datos.append('archivo', archivo.value!)
  if (referencia.value.trim())
    datos.append('numero_referencia', referencia.value.trim())
  if (observaciones.value.trim())
    datos.append('observaciones', observaciones.value.trim())

  subiendo.value = true
  try {
    const nuevo = await docs.subir(props.clienteId, datos)
    toast.add({
      title: 'Documento agregado',
      description: nuevo.nombre_archivo_original,
      color: 'success'
    })
    emit('subido', nuevo)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    // Sin conexión: useApi ya mostró el aviso.
    if (error.status !== 0)
      errorSubida.value
        = error.status === 400 || error.status === 404
          ? error.mensaje
          : 'No se pudo subir el documento. Inténtalo de nuevo.'
  } finally {
    subiendo.value = false
  }
}

const claseCampo
  = 'mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900'
</script>

<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-neutral-800">
      Tipo de documento
      <select
        v-model.number="tipoElegido"
        name="tipo_documento_id"
        :class="claseCampo"
      >
        <option value="">Selecciona…</option>
        <option
          v-for="tipo in tipos"
          :key="tipo.id"
          :value="tipo.id"
        >
          {{ tipo.nombre }}
        </option>
      </select>
      <span
        v-if="errores.tipo"
        class="mt-1 block text-sm text-red-700"
      >{{
        errores.tipo
      }}</span>
    </label>
    <label class="block text-sm font-medium text-neutral-800">
      Archivo
      <span class="font-normal text-neutral-500">(PDF, JPG o PNG de hasta 10 MB)</span>
      <input
        type="file"
        name="archivo"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        :class="claseCampo"
        @change="alElegirArchivo"
      >
      <span
        v-if="errores.archivo"
        class="mt-1 block text-sm text-red-700"
      >{{
        errores.archivo
      }}</span>
    </label>
    <label class="block text-sm font-medium text-neutral-800">
      Número de referencia (opcional)
      <input
        v-model="referencia"
        type="text"
        name="numero_referencia"
        autocomplete="off"
        :class="claseCampo"
      >
    </label>
    <label class="block text-sm font-medium text-neutral-800">
      Observaciones (opcional)
      <textarea
        v-model="observaciones"
        name="observaciones"
        rows="3"
        :class="claseCampo"
      />
    </label>
    <p
      v-if="errorSubida"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorSubida }}
    </p>
    <div class="flex justify-end gap-3 border-t border-neutral-200 pt-4">
      <UButton
        color="neutral"
        variant="outline"
        data-accion="cancelar-subir"
        @click="emit('cancelar')"
      >
        Cancelar
      </UButton>
      <UButton
        data-accion="confirmar-subir"
        :loading="subiendo"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
        @click="subir"
      >
        Subir documento
      </UButton>
    </div>
  </div>
</template>

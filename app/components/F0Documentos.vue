<script setup lang="ts">
import type { DocumentoCliente, TipoDocumento } from '~/types/expediente'
import { fechaLocalISO, formatearFechaCorta } from '~/utils/fechas'
import { puede } from '~/utils/permisos'
import { normalizarTexto } from '~/utils/texto'

const props = defineProps<{
  clienteId: string
  documentos: DocumentoCliente[]
  tipos: TipoDocumento[]
}>()
const emit = defineEmits<{ subido: [documento: DocumentoCliente] }>()

const sesion = useSessionStore()
const subirAbierto = ref(false)
const puedeSubir = computed(() =>
  sesion.usuario ? puede(sesion.usuario.rol, 'documentos.subir') : false
)

// Los seis documentos que se piden al iniciar el expediente (nombres del catálogo de tipos de documento).
const INICIALES = [
  'Acta de Nacimiento',
  'CURP',
  'INE',
  'Comprobante de Domicilio',
  'RFC',
  'Constancia de Semanas Cotizadas'
]
const requeridos = computed(() =>
  INICIALES.flatMap((nombre) => {
    const tipo = props.tipos.find(t =>
      normalizarTexto(t.nombre).startsWith(normalizarTexto(nombre))
    )
    return tipo ? [tipo] : []
  })
)
const recibido = (tipoId: number) =>
  props.documentos.some(d => d.tipo_documento_id === tipoId)
const nombreTipo = (tipoId: number) =>
  props.tipos.find(t => t.id === tipoId)?.nombre ?? 'Documento'

// El folio de la constancia de semanas se captura al subirla (número de referencia).
const folioConstancia = computed(() => {
  const constancia = requeridos.value.find(t =>
    normalizarTexto(t.nombre).startsWith('constancia')
  )
  return constancia
    ? (props.documentos.find(d => d.tipo_documento_id === constancia.id)
        ?.numero_referencia ?? null)
    : null
})

// Este paso no guarda datos propios: los documentos se guardan al subirlos.
defineExpose({ enviar: async () => true })

function alSubirse(nuevo: DocumentoCliente) {
  subirAbierto.value = false
  emit('subido', nuevo)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h4 class="mb-3 font-semibold text-profundo-700">
        Documentos recibidos
      </h4>
      <div class="grid gap-3 md:grid-cols-2">
        <label
          v-for="tipo in requeridos"
          :key="tipo.id"
          data-documento-tipo
          class="flex items-center gap-3 rounded-lg border px-4 py-3"
          :class="
            recibido(tipo.id)
              ? 'border-marca-300 bg-marca-100/60'
              : 'border-neutral-200 bg-white'
          "
        >
          <input
            type="checkbox"
            :checked="recibido(tipo.id)"
            disabled
            class="size-5 accent-profundo-500"
            :aria-label="`${tipo.nombre}: ${recibido(tipo.id) ? 'recibido' : 'pendiente'}`"
          >
          <span class="text-neutral-800">{{ tipo.nombre }}</span>
        </label>
      </div>
      <p class="mt-2 text-sm text-neutral-500">
        Se marcan solos cuando subes el archivo de cada documento.
      </p>
    </div>

    <p
      v-if="folioConstancia"
      class="text-neutral-800"
    >
      <span class="font-semibold text-profundo-700">Folio de la constancia de semanas:</span>
      {{ folioConstancia }}
    </p>

    <div>
      <div class="mb-3 flex items-center justify-between gap-3">
        <h4 class="font-semibold text-profundo-700">
          Archivos del expediente
        </h4>
        <UButton
          v-if="puedeSubir"
          data-accion="anadir"
          icon="i-lucide-upload"
          color="neutral"
          variant="outline"
          @click="subirAbierto = true"
        >
          Seleccionar archivos
        </UButton>
      </div>
      <p
        v-if="documentos.length === 0"
        class="rounded-xl border border-dashed border-marca-300 bg-marca-50 py-8 text-center text-neutral-600"
      >
        Aún no hay documentos cargados para este cliente.
      </p>
      <ul
        v-else
        class="divide-y divide-neutral-200 rounded-xl border border-neutral-200"
      >
        <li
          v-for="documento in documentos"
          :key="documento.id"
          class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3"
        >
          <UIcon
            name="i-lucide-file-text"
            class="size-5 shrink-0 text-neutral-500"
          />
          <span class="min-w-0 flex-1 break-words">{{
            documento.nombre_archivo_original
          }}</span>
          <span class="text-sm text-neutral-600">{{
            nombreTipo(documento.tipo_documento_id)
          }}</span>
          <span class="text-sm text-neutral-500">{{
            formatearFechaCorta(fechaLocalISO(documento.fecha_carga))
          }}</span>
        </li>
      </ul>
    </div>

    <UModal
      v-model:open="subirAbierto"
      title="Añadir documento"
      description="PDF, JPG o PNG de hasta 10 MB."
    >
      <template #body>
        <DocumentoSubirFormulario
          :cliente-id="clienteId"
          :tipos="tipos"
          @subido="alSubirse"
          @cancelar="subirAbierto = false"
        />
      </template>
    </UModal>
  </div>
</template>

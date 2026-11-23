<script setup lang="ts">
import type { DocumentoCliente, TipoDocumento } from '~/types/expediente'
import { fechaLocalISO, formatearFechaCorta } from '~/utils/fechas'

const props = defineProps<{
  clienteId: string
  clave: string
  titulo: string
  origen: string
  ayuda: string
  // Tipo del catálogo de documentos (null si el backend aún no lo tiene) y los documentos del cliente de ese tipo.
  tipo: TipoDocumento | null
  documentos: DocumentoCliente[]
}>()
const emit = defineEmits<{ subido: [] }>()

const api = useDocumentos()
const toast = useToast()
const subirAbierto = ref(false)

const cargado = computed(() => props.documentos.length > 0)

async function descargar(documento: DocumentoCliente) {
  try {
    await api.descargar(props.clienteId, documento)
  } catch {
    // useApi ya avisó los 403 y los errores de red; los demás se muestran aquí.
    toast.add({ title: 'No se pudo descargar el documento', color: 'error' })
  }
}

function alSubir() {
  subirAbierto.value = false
  emit('subido')
}
</script>

<template>
  <div
    :data-documento-requerido="clave"
    class="rounded-xl border border-neutral-200 p-4"
  >
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p
          class="flex flex-wrap items-center gap-2 font-medium text-neutral-900"
        >
          <UIcon
            name="i-lucide-file-text"
            class="size-5 text-acento-700"
          />
          {{ titulo }}
          <span
            class="rounded bg-marca-100 px-2 py-0.5 text-xs font-medium text-marca-800"
          >{{ origen }}</span>
        </p>
        <p class="mt-1 text-sm text-neutral-600">
          {{ ayuda }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span
          data-estado-documento
          :data-estado="cargado ? 'cargado' : 'falta'"
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :class="
            cargado
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          "
        >{{
          cargado
            ? `${documentos.length} ${documentos.length === 1 ? "documento cargado" : "documentos cargados"}`
            : "Falta documento"
        }}</span>
        <UButton
          data-accion="subir-documento"
          icon="i-lucide-upload"
          size="sm"
          class="bg-profundo-500 text-white hover:bg-profundo-600"
          :disabled="!tipo"
          @click="subirAbierto = true"
        >
          Subir documento
        </UButton>
      </div>
    </div>

    <p
      v-if="!tipo"
      class="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600"
    >
      Este tipo de documento aún no está disponible en el catálogo, por eso no
      se puede subir.
    </p>

    <ul
      v-if="documentos.length > 0"
      class="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-100"
    >
      <li
        v-for="d in documentos"
        :key="d.id"
        data-documento-fila
        class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
      >
        <span class="font-medium text-neutral-900">{{
          d.nombre_archivo_original
        }}</span>
        <span class="flex items-center gap-1">
          <span class="mr-2 text-neutral-600">{{
            formatearFechaCorta(fechaLocalISO(d.fecha_carga))
          }}</span>
          <UButton
            :to="`/clientes/${clienteId}/archivos`"
            data-accion="ver-documento"
            icon="i-lucide-eye"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Ver en archivos"
          />
          <UButton
            data-accion="descargar-documento"
            icon="i-lucide-download"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="`Descargar ${d.nombre_archivo_original}`"
            @click="descargar(d)"
          />
        </span>
      </li>
    </ul>

    <UModal
      v-model:open="subirAbierto"
      :title="`Subir: ${titulo}`"
      :description="origen"
    >
      <template #body>
        <DocumentoSubirFormulario
          v-if="tipo"
          :cliente-id="clienteId"
          :tipos="[tipo]"
          @subido="alSubir"
          @cancelar="subirAbierto = false"
        />
      </template>
    </UModal>
  </div>
</template>

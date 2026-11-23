<script setup lang="ts">
import type { Registro } from '~/types/f1'

const f1 = useF1()

interface Fila {
  id: number
  nombre: string
  recibido: string
  observaciones: string
}
const guardados = new Map(
  (f1.listas.documentos ?? []).map(d => [Number(d.tipo_documento_id), d])
)
const filas = reactive<Fila[]>(
  (f1.catalogos.documentos ?? []).map((c) => {
    const d = guardados.get(c.id)
    return {
      id: c.id,
      nombre: c.nombre,
      recibido:
        d?.recibido === true ? 'true' : d?.recibido === false ? 'false' : '',
      observaciones:
        typeof d?.observaciones === 'string' ? d.observaciones : ''
    }
  })
)
const errorGeneral = ref<string | null>(null)

async function enviar(): Promise<boolean> {
  errorGeneral.value = null
  // Solo se guardan los documentos contestados o con observaciones.
  const items: Registro[] = filas
    .filter(f => f.recibido || f.observaciones.trim())
    .map(f => ({
      tipo_documento_id: f.id,
      ...(f.recibido ? { recibido: f.recibido === 'true' } : {}),
      ...(f.observaciones.trim()
        ? { observaciones: f.observaciones.trim() }
        : {})
    }))
  try {
    await f1.guardarLista('documentos', items)
    return true
  } catch (e) {
    return manejarErrorF1(e, errorGeneral)
  }
}
defineExpose({ enviar })
</script>

<template>
  <form
    class="space-y-3"
    novalidate
    @submit.prevent
  >
    <h4 class="font-semibold text-profundo-700">
      Control de documentos
    </h4>
    <div class="overflow-x-auto rounded-xl border border-marca-100">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="bg-neutral-100 text-profundo-700">
          <tr>
            <th class="px-4 py-3 font-semibold">
              Documento
            </th>
            <th class="px-4 py-3 font-semibold">
              Recibido
            </th>
            <th class="px-4 py-3 font-semibold">
              Observaciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="f in filas"
            :key="f.id"
            :data-documento="f.id"
            class="border-t border-marca-100 align-middle odd:bg-white even:bg-marca-50/60"
          >
            <td class="px-4 py-3 font-semibold text-neutral-900">
              {{ f.nombre }}
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <label
                  v-for="o in [
                    { v: 'true', t: 'Sí' },
                    { v: 'false', t: 'No' }
                  ]"
                  :key="o.v"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 has-[:checked]:border-marca-500 has-[:checked]:bg-marca-50"
                >
                  <input
                    v-model="f.recibido"
                    type="radio"
                    :name="`recibido-${f.id}`"
                    :value="o.v"
                  >
                  {{ o.t }}
                </label>
              </div>
            </td>
            <td class="px-4 py-3">
              <input
                v-model="f.observaciones"
                :name="`observaciones-doc-${f.id}`"
                :aria-label="`Observaciones de ${f.nombre}`"
                autocomplete="off"
                class="w-full rounded-lg border border-neutral-300 px-3 py-2"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>
  </form>
</template>

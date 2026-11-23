<script setup lang="ts">
import type { ColumnaF1 } from '~/composables/useFilasF1'

const f1 = useF1()

const COLUMNAS: ColumnaF1[] = [
  {
    nombre: 'periodo_reclamado',
    etiqueta: 'Periodo',
    tipo: 'texto',
    obligatoria: true
  },
  {
    nombre: 'nombre_patron',
    etiqueta: 'Patrón',
    tipo: 'texto',
    obligatoria: true
  },
  {
    nombre: 'semanas_esperadas',
    etiqueta: 'Semanas esperadas',
    tipo: 'entero',
    obligatoria: true
  },
  {
    nombre: 'semanas_reconocidas',
    etiqueta: 'Semanas reconocidas',
    tipo: 'entero'
  },
  {
    nombre: 'evidencia_disponible',
    etiqueta: 'Evidencia disponible',
    tipo: 'texto',
    obligatoria: true
  },
  {
    nombre: 'accion_sugerida',
    etiqueta: 'Acción sugerida',
    tipo: 'texto',
    obligatoria: true
  }
]

const tabla = useFilasF1({
  columnas: COLUMNAS,
  inicial: f1.periodos.value as unknown as Record<string, unknown>[],
  crear: datos =>
    f1.api.periodos.crear(datos) as Promise<Record<string, unknown>>,
  actualizar: (id, datos) =>
    f1.api.periodos.actualizar(id, datos) as Promise<Record<string, unknown>>,
  eliminar: id => f1.api.periodos.eliminar(id),
  mensajeObligatorio: c => `${c.etiqueta} es obligatorio`
})
defineExpose({ validar: tabla.validar, enviar: tabla.enviar })
</script>

<template>
  <section class="space-y-2">
    <h4 class="text-sm font-semibold text-profundo-700">
      Detalle de periodos a revisar
    </h4>
    <div class="overflow-x-auto rounded-xl border border-marca-100">
      <table class="w-full min-w-[56rem] text-left text-sm">
        <thead class="bg-neutral-100 text-profundo-700">
          <tr>
            <th
              v-for="c in COLUMNAS"
              :key="c.nombre"
              class="px-3 py-2 font-semibold"
            >
              {{ c.etiqueta }}
            </th>
            <th class="w-10" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, i) in tabla.filas"
            :key="fila.clave"
            data-periodo
            class="border-t border-marca-100 align-top"
          >
            <td
              v-for="c in COLUMNAS"
              :key="c.nombre"
              class="px-3 py-2"
            >
              <input
                v-model="fila.valores[c.nombre]"
                :name="c.nombre"
                :aria-label="c.etiqueta"
                autocomplete="off"
                class="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              >
              <span
                v-if="tabla.errores[fila.clave]?.[c.nombre]"
                class="block text-xs text-red-700"
              >{{ tabla.errores[fila.clave]![c.nombre] }}</span>
            </td>
            <td class="px-2 py-2">
              <button
                type="button"
                data-accion="quitar-periodo"
                aria-label="Quitar periodo"
                class="text-neutral-500 hover:text-red-700"
                @click="tabla.quitar(i)"
              >
                <UIcon
                  name="i-lucide-x"
                  class="size-4"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <UButton
      data-accion="agregar-periodo"
      color="neutral"
      variant="outline"
      icon="i-lucide-plus"
      size="sm"
      @click="tabla.agregar"
    >
      Agregar periodo
    </UButton>
  </section>
</template>

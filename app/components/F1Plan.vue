<script setup lang="ts">
import type { ColumnaF1 } from '~/composables/useFilasF1'
import { ESTATUS_PLAN } from '~/utils/f1'

const f1 = useF1()

const COLUMNAS: ColumnaF1[] = [
  { nombre: 'accion', etiqueta: 'Acción', tipo: 'texto', obligatoria: true },
  { nombre: 'fecha_objetivo', etiqueta: 'Fecha objetivo', tipo: 'fecha' },
  {
    nombre: 'estatus',
    etiqueta: 'Estatus',
    tipo: 'select',
    opciones: ESTATUS_PLAN
  },
  { nombre: 'observaciones', etiqueta: 'Observaciones', tipo: 'texto' }
]

const tabla = useFilasF1({
  columnas: COLUMNAS,
  inicial: f1.plan.value as unknown as Record<string, unknown>[],
  porDefecto: { estatus: 'pendiente' },
  crear: datos =>
    f1.api.plan.crear(datos) as Promise<Record<string, unknown>>,
  actualizar: (id, datos) =>
    f1.api.plan.actualizar(id, datos) as Promise<Record<string, unknown>>,
  eliminar: id => f1.api.plan.eliminar(id),
  mensajeObligatorio: c =>
    c.nombre === 'accion'
      ? 'La acción es obligatoria'
      : `${c.etiqueta} es obligatorio`
})
defineExpose({ validar: tabla.validar, enviar: tabla.enviar })
</script>

<template>
  <section class="space-y-2">
    <h4 class="text-sm font-semibold text-profundo-700">
      Acciones comprometidas
    </h4>
    <div class="overflow-x-auto rounded-xl border border-marca-100">
      <table class="w-full min-w-[44rem] text-left text-sm">
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
            data-plan
            class="border-t border-marca-100 align-top odd:bg-white even:bg-marca-50/60"
          >
            <td
              v-for="c in COLUMNAS"
              :key="c.nombre"
              class="px-3 py-2"
            >
              <select
                v-if="c.tipo === 'select'"
                v-model="fila.valores[c.nombre]"
                :name="c.nombre"
                :aria-label="c.etiqueta"
                class="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              >
                <option
                  v-for="o in c.opciones"
                  :key="o.valor"
                  :value="o.valor"
                >
                  {{ o.etiqueta }}
                </option>
              </select>
              <input
                v-else
                v-model="fila.valores[c.nombre]"
                :type="c.tipo === 'fecha' ? 'date' : 'text'"
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
                data-accion="quitar-accion"
                aria-label="Quitar acción"
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
      data-accion="agregar-accion"
      color="neutral"
      variant="outline"
      icon="i-lucide-plus"
      size="sm"
      @click="tabla.agregar"
    >
      Agregar acción
    </UButton>
  </section>
</template>

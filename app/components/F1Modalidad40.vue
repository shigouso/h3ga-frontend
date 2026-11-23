<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import type { Registro } from '~/types/f1'
import {
  aItems,
  aSelecciones,
  CONCLUSIONES_M40,
  CRITERIOS_M40,
  SI_NO_VALIDAR
} from '~/utils/f1'

const f1 = useF1()

const CAMPOS: CampoF1[] = [
  {
    nombre: 'dado_de_baja_regimen_obligatorio',
    etiqueta: '¿Fue dado de baja del régimen obligatorio?',
    tipo: 'opcion',
    opciones: SI_NO_VALIDAR
  },
  {
    nombre: 'ultimo_salario_cotizado',
    etiqueta: 'Último salario base de cotización',
    tipo: 'monto'
  },
  {
    nombre: 'meses_propuestos_m40',
    etiqueta: 'Meses propuestos de cotización',
    tipo: 'entero'
  },
  { nombre: 'fecha_ultima_baja', etiqueta: 'Fecha de baja', tipo: 'fecha' },
  {
    nombre: 'salario_propuesto_m40',
    etiqueta: 'Salario propuesto M40 (diario)',
    tipo: 'monto'
  },
  {
    nombre: 'evalua_retroactivo_m40',
    etiqueta: '¿Se evaluará con pago retroactivo? (paso 7)',
    tipo: 'booleano'
  },
  {
    nombre: 'conclusion_modalidad_40',
    etiqueta: 'Conclusión preliminar Modalidad 40',
    tipo: 'opcion',
    opciones: CONCLUSIONES_M40
  },
  { nombre: 'comentarios_modalidad_40', etiqueta: 'Comentarios', tipo: 'area' }
]

const form = useFormularioF1(CAMPOS, f1.diagnostico.value)
const objetivos = ref(
  aSelecciones(f1.listas['objetivos-modalidad-40'], 'objetivo_id')
)

interface Requisito {
  criterio: string
  cumplimiento: string
  observaciones: string
}
const guardados = new Map(
  (f1.listas['criterios-modalidad-40'] ?? []).map(c => [
    String(c.criterio),
    c
  ])
)
const requisitos = reactive<Requisito[]>(
  CRITERIOS_M40.map((criterio) => {
    const g = guardados.get(criterio)
    return {
      criterio,
      cumplimiento: typeof g?.cumplimiento === 'string' ? g.cumplimiento : '',
      observaciones:
        typeof g?.observaciones === 'string' ? g.observaciones : ''
    }
  })
)

async function enviar(): Promise<boolean> {
  if (!form.validar()) return false
  return form.ejecutar(async () => {
    await f1.guardarCampos(form.cuerpo())
    await f1.guardarLista(
      'objetivos-modalidad-40',
      aItems(objetivos.value, f1.catalogos.m40 ?? [], 'objetivo_id')
    )
    // El backend exige el resultado de cada requisito: solo se envían los contestados.
    const items: Registro[] = requisitos
      .filter(r => r.cumplimiento)
      .map(r => ({
        criterio: r.criterio,
        cumplimiento: r.cumplimiento,
        ...(r.observaciones.trim()
          ? { observaciones: r.observaciones.trim() }
          : {})
      }))
    await f1.guardarLista('criterios-modalidad-40', items)
    form.confirmar()
  })
}
defineExpose({ enviar })

const RESULTADOS = [
  { v: 'cumple', t: 'Cumple' },
  { v: 'no_cumple', t: 'No cumple' },
  { v: 'requiere_validar', t: 'Requiere validar' }
]
</script>

<template>
  <form
    class="space-y-6"
    novalidate
    @submit.prevent
  >
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <F1Campo
        v-model="form.valores.dado_de_baja_regimen_obligatorio!"
        :campo="CAMPOS[0]!"
      />
      <F1Campo
        v-model="form.valores.ultimo_salario_cotizado!"
        :campo="CAMPOS[1]!"
        :error="form.errores.ultimo_salario_cotizado"
      />
      <F1Campo
        v-model="form.valores.meses_propuestos_m40!"
        :campo="CAMPOS[2]!"
        :error="form.errores.meses_propuestos_m40"
      />
      <F1Campo
        v-model="form.valores.fecha_ultima_baja!"
        :campo="CAMPOS[3]!"
        :error="form.errores.fecha_ultima_baja"
      />
      <F1Campo
        v-model="form.valores.salario_propuesto_m40!"
        :campo="CAMPOS[4]!"
        :error="form.errores.salario_propuesto_m40"
      />
    </div>
    <F1Campo
      v-model="form.valores.evalua_retroactivo_m40!"
      :campo="CAMPOS[5]!"
    />
    <F1Checks
      v-model="objetivos"
      nombre="m40"
      titulo="Objetivo de Modalidad 40"
      :catalogo="f1.catalogos.m40 ?? []"
      :maximo-columnas="2"
    />

    <div class="space-y-2">
      <h4 class="text-sm font-semibold text-profundo-700">
        Evaluación de requisitos
      </h4>
      <div class="overflow-x-auto rounded-xl border border-marca-100">
        <table class="w-full min-w-[48rem] text-left text-sm">
          <thead class="bg-neutral-100 text-profundo-700">
            <tr>
              <th class="px-4 py-2 font-semibold">
                Criterio
              </th>
              <th class="px-4 py-2 font-semibold">
                Resultado
              </th>
              <th class="px-4 py-2 font-semibold">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, i) in requisitos"
              :key="r.criterio"
              data-requisito
              class="border-t border-marca-100 odd:bg-white even:bg-marca-50/60"
            >
              <td
                data-criterio
                class="px-4 py-2 font-semibold text-neutral-900"
              >
                {{ r.criterio }}
              </td>
              <td class="px-4 py-2">
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="o in RESULTADOS"
                    :key="o.v"
                    class="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 has-[:checked]:border-marca-500 has-[:checked]:bg-marca-50"
                  >
                    <input
                      v-model="r.cumplimiento"
                      type="radio"
                      :name="`m40-criterio-${i}`"
                      :value="o.v"
                    >
                    {{ o.t }}
                  </label>
                </div>
              </td>
              <td class="px-4 py-2">
                <input
                  v-model="r.observaciones"
                  :name="`m40-obs-${i}`"
                  :aria-label="`Observaciones de ${r.criterio}`"
                  autocomplete="off"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-1.5"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <F1Campo
      v-model="form.valores.conclusion_modalidad_40!"
      :campo="CAMPOS[6]!"
    />
    <F1Campo
      v-model="form.valores.comentarios_modalidad_40!"
      :campo="CAMPOS[7]!"
    />
    <p
      v-if="form.errorGeneral.value"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ form.errorGeneral.value }}
    </p>
  </form>
</template>

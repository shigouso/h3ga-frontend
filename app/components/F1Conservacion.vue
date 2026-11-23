<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import type { Registro } from '~/types/f1'
import {
  aItems,
  aSelecciones,
  CONCLUSIONES_M10,
  CRITERIOS_M10,
  textoMeses
} from '~/utils/f1'

const f1 = useF1()

const CONSERVACION: CampoF1[] = [
  {
    nombre: 'fecha_ultima_baja',
    etiqueta: 'Fecha de baja más reciente',
    tipo: 'fecha'
  },
  {
    nombre: 'fecha_vencimiento_conservacion',
    etiqueta: 'Fecha estimada de vencimiento',
    tipo: 'fecha'
  },
  {
    nombre: 'tiempo_estimado_conservacion_meses',
    etiqueta: 'Tiempo estimado de conservación (meses)',
    tipo: 'entero',
    placeholder: 'Ej. 50'
  },
  {
    nombre: 'semanas_reconocidas_al_baja',
    etiqueta: 'Semanas reconocidas al momento de la baja',
    tipo: 'entero'
  },
  {
    nombre: 'dentro_de_conservacion',
    etiqueta: '¿Está dentro de conservación?',
    tipo: 'opcion',
    opciones: [
      { valor: 'si', etiqueta: 'Sí' },
      { valor: 'no', etiqueta: 'No' },
      { valor: 'requiere_validar', etiqueta: 'Requiere validar' }
    ]
  },
  {
    nombre: 'requiere_reactivacion',
    etiqueta: '¿Requiere reactivación mediante cotización?',
    tipo: 'booleano'
  },
  {
    nombre: 'conviene_pensionar_ahora',
    etiqueta: '¿Conviene pensionar ahora?',
    tipo: 'opcion',
    opciones: [
      { valor: 'si', etiqueta: 'Sí' },
      { valor: 'no', etiqueta: 'No' },
      { valor: 'depende_escenario', etiqueta: 'Depende del escenario' }
    ]
  },
  { nombre: 'comentarios_conservacion', etiqueta: 'Comentarios', tipo: 'area' }
]
const M10: CampoF1[] = [
  {
    nombre: 'trabaja_cuenta_propia',
    etiqueta: '¿Trabaja por cuenta propia?',
    tipo: 'opcion',
    opciones: [
      { valor: 'si', etiqueta: 'Sí' },
      { valor: 'no', etiqueta: 'No' },
      { valor: 'parcialmente', etiqueta: 'Parcialmente' }
    ]
  },
  {
    nombre: 'ingreso_mensual_aproximado',
    etiqueta: 'Ingreso mensual aproximado',
    tipo: 'monto'
  },
  {
    nombre: 'actividad_economica',
    etiqueta: 'Actividad económica',
    tipo: 'texto'
  },
  {
    nombre: 'conclusion_modalidad_10',
    etiqueta: 'Conclusión preliminar Modalidad 10',
    tipo: 'opcion',
    opciones: CONCLUSIONES_M10
  },
  { nombre: 'comentarios_modalidad_10', etiqueta: 'Comentarios', tipo: 'area' }
]

const form = useFormularioF1([...CONSERVACION, ...M10], f1.diagnostico.value)
const objetivos = ref(
  aSelecciones(f1.listas['objetivos-modalidad-10'], 'objetivo_id')
)

interface Criterio {
  criterio: string
  cumple: string
  observaciones: string
}
const guardados = new Map(
  (f1.listas['criterios-modalidad-10'] ?? []).map(c => [
    String(c.criterio),
    c
  ])
)
const criterios = reactive<Criterio[]>(
  CRITERIOS_M10.map((criterio) => {
    const g = guardados.get(criterio)
    return {
      criterio,
      cumple: g?.cumple === true ? 'true' : g?.cumple === false ? 'false' : '',
      observaciones:
        typeof g?.observaciones === 'string' ? g.observaciones : ''
    }
  })
)

const meses = computed(() =>
  /^\d+$/.test(form.valores.tiempo_estimado_conservacion_meses ?? '')
    ? Number(form.valores.tiempo_estimado_conservacion_meses)
    : null
)

async function enviar(): Promise<boolean> {
  if (!form.validar()) return false
  return form.ejecutar(async () => {
    await f1.guardarCampos(form.cuerpo())
    await f1.guardarLista(
      'objetivos-modalidad-10',
      aItems(objetivos.value, f1.catalogos.m10 ?? [], 'objetivo_id')
    )
    // Los 7 criterios se guardan siempre: el resultado Sí/No es opcional.
    const items: Registro[] = criterios.map(c => ({
      criterio: c.criterio,
      ...(c.cumple ? { cumple: c.cumple === 'true' } : {}),
      ...(c.observaciones.trim()
        ? { observaciones: c.observaciones.trim() }
        : {})
    }))
    await f1.guardarLista('criterios-modalidad-10', items)
    form.confirmar()
  })
}
defineExpose({ enviar })
</script>

<template>
  <form
    class="space-y-10"
    novalidate
    @submit.prevent
  >
    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        6. Conservación de derechos
      </h4>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <F1Campo
          v-model="form.valores.fecha_ultima_baja!"
          :campo="CONSERVACION[0]!"
          :error="form.errores.fecha_ultima_baja"
        />
        <F1Campo
          v-model="form.valores.fecha_vencimiento_conservacion!"
          :campo="CONSERVACION[1]!"
          :error="form.errores.fecha_vencimiento_conservacion"
        />
        <div>
          <F1Campo
            v-model="form.valores.tiempo_estimado_conservacion_meses!"
            :campo="CONSERVACION[2]!"
            :error="form.errores.tiempo_estimado_conservacion_meses"
          />
          <p
            v-if="meses !== null"
            data-conservacion-texto
            class="mt-1 text-xs text-neutral-500"
          >
            Equivale a {{ textoMeses(meses) }}
          </p>
        </div>
        <F1Campo
          v-model="form.valores.semanas_reconocidas_al_baja!"
          :campo="CONSERVACION[3]!"
          :error="form.errores.semanas_reconocidas_al_baja"
        />
      </div>
      <div class="flex flex-wrap gap-x-8 gap-y-4">
        <F1Campo
          v-model="form.valores.dentro_de_conservacion!"
          :campo="CONSERVACION[4]!"
        />
        <F1Campo
          v-model="form.valores.requiere_reactivacion!"
          :campo="CONSERVACION[5]!"
        />
        <F1Campo
          v-model="form.valores.conviene_pensionar_ahora!"
          :campo="CONSERVACION[6]!"
        />
      </div>
      <F1Campo
        v-model="form.valores.comentarios_conservacion!"
        :campo="CONSERVACION[7]!"
      />
    </section>

    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        7. Modalidad 10
        <span class="font-normal text-neutral-500">· Persona trabajadora independiente</span>
      </h4>
      <div class="grid gap-4 md:grid-cols-3">
        <F1Campo
          v-model="form.valores.trabaja_cuenta_propia!"
          :campo="M10[0]!"
        />
        <F1Campo
          v-model="form.valores.ingreso_mensual_aproximado!"
          :campo="M10[1]!"
          :error="form.errores.ingreso_mensual_aproximado"
        />
        <F1Campo
          v-model="form.valores.actividad_economica!"
          :campo="M10[2]!"
        />
      </div>
      <F1Checks
        v-model="objetivos"
        nombre="m10"
        titulo="Objetivo al evaluar Modalidad 10"
        :catalogo="f1.catalogos.m10 ?? []"
        :maximo-columnas="2"
      />
      <div class="space-y-2">
        <h5 class="text-sm font-semibold text-profundo-700">
          Evaluación de aplicabilidad
        </h5>
        <div class="overflow-x-auto rounded-xl border border-marca-100">
          <table class="w-full min-w-[40rem] text-left text-sm">
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
                v-for="(c, i) in criterios"
                :key="c.criterio"
                class="border-t border-marca-100 odd:bg-white even:bg-marca-50/60"
              >
                <td class="px-4 py-2 font-semibold text-neutral-900">
                  {{ c.criterio }}
                </td>
                <td class="px-4 py-2">
                  <div class="flex gap-2">
                    <label
                      v-for="o in [
                        { v: 'true', t: 'Sí' },
                        { v: 'false', t: 'No' }
                      ]"
                      :key="o.v"
                      class="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 has-[:checked]:border-marca-500 has-[:checked]:bg-marca-50"
                    >
                      <input
                        v-model="c.cumple"
                        type="radio"
                        :name="`m10-criterio-${i}`"
                        :value="o.v"
                      >
                      {{ o.t }}
                    </label>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="c.observaciones"
                    :name="`m10-obs-${i}`"
                    :aria-label="`Observaciones de ${c.criterio}`"
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
        v-model="form.valores.conclusion_modalidad_10!"
        :campo="M10[3]!"
      />
      <F1Campo
        v-model="form.valores.comentarios_modalidad_10!"
        :campo="M10[4]!"
      />
    </section>

    <p
      v-if="form.errorGeneral.value"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ form.errorGeneral.value }}
    </p>
  </form>
</template>

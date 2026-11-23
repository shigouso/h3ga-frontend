<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import { edadDesde } from '~/utils/fechas'
import { aItems, aSelecciones, TIPOS_PENSION } from '~/utils/f1'

const f1 = useF1()
const clientes = useClientes()

const CONSERVACION = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
  { valor: 'requiere_validar', etiqueta: 'Requiere cálculo' }
]

const REGIMEN: CampoF1[] = [
  {
    nombre: 'fecha_primera_cotizacion',
    etiqueta: 'Fecha de primera cotización IMSS',
    tipo: 'fecha'
  },
  {
    nombre: 'edad_objetivo_pension',
    etiqueta: 'Edad objetivo de pensión',
    tipo: 'entero'
  },
  {
    nombre: 'requiere_reactivacion',
    etiqueta: '¿Requiere reactivación?',
    tipo: 'booleano'
  },
  {
    nombre: 'tiene_conservacion_derechos',
    etiqueta: '¿Conservación de derechos?',
    tipo: 'opcion',
    opciones: CONSERVACION
  },
  {
    nombre: 'fecha_vencimiento_conservacion',
    etiqueta: 'Fecha estimada de vencimiento de conservación',
    tipo: 'fecha'
  },
  {
    nombre: 'tipo_pension_probable',
    etiqueta: 'Tipo de pensión probable',
    tipo: 'select',
    opciones: TIPOS_PENSION
  },
  {
    nombre: 'cotizo_antes_julio_1997',
    etiqueta: '¿Cotizó antes del 1 de julio de 1997?',
    tipo: 'booleano'
  },
  {
    nombre: 'observaciones_regimen',
    etiqueta: 'Observaciones del régimen',
    tipo: 'area'
  }
]
const SEMANAS: CampoF1[] = [
  {
    nombre: 'semanas_reintegradas',
    etiqueta: 'Semanas reintegradas',
    tipo: 'entero'
  },
  {
    nombre: 'semanas_descontadas',
    etiqueta: 'Semanas descontadas',
    tipo: 'entero'
  },
  {
    nombre: 'semanas_efectivas_pension',
    etiqueta: 'Semanas efectivas para pensión',
    tipo: 'entero'
  },
  {
    nombre: 'semanas_requeridas_pension',
    etiqueta: 'Semanas requeridas para pensión',
    tipo: 'entero'
  },
  {
    nombre: 'fecha_ultima_baja',
    etiqueta: 'Fecha de última baja IMSS',
    tipo: 'fecha'
  },
  {
    nombre: 'ultimo_salario_cotizado',
    etiqueta: 'Último salario base de cotización',
    tipo: 'monto'
  }
]
const SOLO_LECTURA = [
  {
    nombre: 'semanas_imss_reconocidas',
    etiqueta: 'Semanas reconocidas IMSS',
    tipo: 'entero' as const,
    soloLectura: true,
    ayuda: 'Se captura en el F0'
  },
  {
    nombre: 'ultimo_patron',
    etiqueta: 'Último patrón registrado',
    tipo: 'texto' as const,
    soloLectura: true,
    ayuda: 'Se captura en el F0'
  }
]

const form = useFormularioF1([...REGIMEN, ...SEMANAS], f1.diagnostico.value)
const inconsistencias = ref(
  aSelecciones(f1.listas['inconsistencias-generales'], 'tipo_id')
)
const periodos = useTemplateRef<{
  validar: () => boolean
  enviar: () => Promise<void>
}>('periodos')

// Régimen probable: es un dato del cliente (ley probable), no del diagnóstico. "Requiere validación" es "No determinado".
const leyActual = ref(String(f1.cliente.value.ley_probable_id ?? ''))
const leyInicial = leyActual.value
const opcionesLey = computed(() => {
  const catalogo = f1.catalogos.leyes ?? []
  const ids = new Set([1, 2, 6, Number(leyInicial)])
  return catalogo
    .filter(l => ids.has(l.id))
    .map(l => ({
      valor: String(l.id),
      etiqueta: l.id === 6 ? 'Requiere validación' : l.nombre
    }))
})
const campoLey = computed<CampoF1>(() => ({
  nombre: 'ley_probable_id',
  etiqueta: 'Régimen probable',
  tipo: 'opcion',
  opciones: opcionesLey.value
}))

const edadActual = computed(() => {
  const nacimiento = f1.cliente.value.fecha_nacimiento
  return nacimiento
    ? `${edadDesde(nacimiento)} años`
    : 'Sin fecha de nacimiento'
})

async function enviar(): Promise<boolean> {
  const validos = form.validar()
  const tablaValida = periodos.value?.validar() ?? true
  if (!validos || !tablaValida) return false
  return form.ejecutar(async () => {
    await f1.guardarCampos(form.cuerpo())
    if (leyActual.value !== leyInicial && leyActual.value)
      f1.cliente.value = await clientes.actualizar(f1.cliente.value.id, {
        ley_probable_id: Number(leyActual.value)
      })
    await f1.guardarLista(
      'inconsistencias-generales',
      aItems(
        inconsistencias.value,
        f1.catalogos.inconsistencias ?? [],
        'tipo_id'
      )
    )
    await periodos.value?.enviar()
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
        3. Determinación del régimen
      </h4>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <F1Campo
          v-model="form.valores.fecha_primera_cotizacion!"
          :campo="REGIMEN[0]!"
          :error="form.errores.fecha_primera_cotizacion"
        />
        <F1Campo
          v-model="form.valores.edad_objetivo_pension!"
          :campo="REGIMEN[1]!"
          :error="form.errores.edad_objetivo_pension"
        />
        <div class="text-sm font-semibold text-profundo-700">
          Edad actual
          <p
            data-edad-actual
            class="mt-1 rounded-lg bg-neutral-100 px-3 py-2.5 text-base font-normal text-neutral-900"
          >
            {{ edadActual }}
          </p>
          <span class="mt-1 block text-xs font-normal text-neutral-500">Calculada con la fecha de nacimiento</span>
        </div>
        <F1Campo
          v-model="form.valores.requiere_reactivacion!"
          :campo="REGIMEN[2]!"
        />
        <F1Campo
          v-model="form.valores.tiene_conservacion_derechos!"
          :campo="REGIMEN[3]!"
        />
        <F1Campo
          v-model="form.valores.fecha_vencimiento_conservacion!"
          :campo="REGIMEN[4]!"
          :error="form.errores.fecha_vencimiento_conservacion"
        />
        <F1Campo
          v-model="form.valores.tipo_pension_probable!"
          :campo="REGIMEN[5]!"
        />
        <F1Campo
          v-model="form.valores.cotizo_antes_julio_1997!"
          :campo="REGIMEN[6]!"
        />
        <F1Campo
          v-model="leyActual"
          :campo="campoLey"
        />
      </div>
      <F1Campo
        v-model="form.valores.observaciones_regimen!"
        :campo="REGIMEN[7]!"
      />
    </section>

    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        4. Semanas cotizadas
      </h4>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <F1Campo
          :model-value="String(f1.cliente.value.semanas_imss_reconocidas)"
          :campo="SOLO_LECTURA[0]!"
        />
        <F1Campo
          v-for="c in SEMANAS.slice(0, 4)"
          :key="c.nombre"
          v-model="form.valores[c.nombre]!"
          :campo="c"
          :error="form.errores[c.nombre]"
        />
        <F1Campo
          v-model="form.valores.fecha_ultima_baja!"
          :campo="SEMANAS[4]!"
          :error="form.errores.fecha_ultima_baja"
        />
        <F1Campo
          :model-value="f1.ultimoPatron.value"
          :campo="SOLO_LECTURA[1]!"
        />
        <F1Campo
          v-model="form.valores.ultimo_salario_cotizado!"
          :campo="SEMANAS[5]!"
          :error="form.errores.ultimo_salario_cotizado"
        />
      </div>
      <F1Checks
        v-model="inconsistencias"
        nombre="inconsistencias"
        titulo="Revisión de inconsistencias"
        :catalogo="f1.catalogos.inconsistencias ?? []"
      />
      <F1Periodos ref="periodos" />
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

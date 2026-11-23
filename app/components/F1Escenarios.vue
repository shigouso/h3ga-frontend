<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import type { Registro } from '~/types/f1'
import {
  ESCENARIOS_SUGERIDOS,
  ESTADOS_CIVILES,
  ESTADOS_SALUD,
  errorEntero,
  errorMonto,
  formatoNumero,
  MAX_ESCENARIOS
} from '~/utils/f1'

const f1 = useF1()

// ---------- Sección 10 y comparativo de la 11: hasta 3 escenarios, cada uno en una columna ----------
const FILAS = [
  {
    nombre: 'semanas_proyectadas',
    etiqueta: 'Semanas proyectadas',
    entero: true
  },
  {
    nombre: 'salario_promedio_proyectado',
    etiqueta: 'Salario promedio proyectado'
  },
  { nombre: 'inversion_total_estimada', etiqueta: 'Inversión total estimada' },
  {
    nombre: 'pension_mensual_estimada',
    etiqueta: 'Pensión mensual proyectada'
  },
  { nombre: 'incremento_mensual', etiqueta: 'Incremento mensual de pensión' },
  { nombre: 'beneficio_a_5_anios', etiqueta: 'Beneficio acumulado a 5 años' },
  { nombre: 'beneficio_a_10_anios', etiqueta: 'Beneficio acumulado a 10 años' },
  { nombre: 'beneficio_a_15_anios', etiqueta: 'Beneficio acumulado a 15 años' }
] as const

interface Columna {
  clave: string
  nombre: string
  orden: number
  id?: string
  valores: Record<string, string>
  original: Record<string, string>
}

const aTexto = (v: unknown) => (v === null || v === undefined ? '' : String(v))
function nuevaColumna(
  clave: string,
  nombre: string,
  orden: number,
  guardado?: Registro
): Columna {
  const valores = Object.fromEntries(
    FILAS.map(f => [f.nombre, guardado ? aTexto(guardado[f.nombre]) : ''])
  )
  // La inversión es NOT NULL con valor 0: un 0 sin capturar se muestra vacío.
  if (guardado && valores.inversion_total_estimada === '0')
    valores.inversion_total_estimada = ''
  return {
    clave,
    nombre,
    orden,
    id: guardado ? String(guardado.id) : undefined,
    valores,
    original: { ...valores }
  }
}

const columnas = reactive<Columna[]>([])
for (const s of ESCENARIOS_SUGERIDOS) {
  const guardado = f1.escenarios.value.find(
    e => e.nombre_escenario === s.nombre
  )
  if (guardado)
    columnas.push(
      nuevaColumna(
        s.clave,
        s.nombre,
        guardado.orden,
        guardado as unknown as Registro
      )
    )
}
// Escenarios guardados con otro nombre (otra versión del formato): se muestran como seleccionados para respetar su orden.
for (const e of f1.escenarios.value) {
  if (!columnas.some(c => c.id === String(e.id)))
    columnas.push(
      nuevaColumna(
        `extra-${e.id}`,
        e.nombre_escenario,
        e.orden,
        e as unknown as Registro
      )
    )
}
const opcionesEscenario = computed(() => [
  ...ESCENARIOS_SUGERIDOS,
  ...columnas
    .filter(c => c.clave.startsWith('extra-'))
    .map(c => ({ clave: c.clave, nombre: c.nombre }))
])
const mesesM10 = ref(
  aTexto(
    f1.escenarios.value.find(e => e.nombre_escenario === 'Modalidad 10')
      ?.meses_modalidad_10
  )
)
const mesesM10Inicial = mesesM10.value
const eliminados = ref<string[]>([])

const ordenadas = computed(() =>
  [...columnas].sort((a, b) => a.orden - b.orden)
)
const seleccionada = (clave: string) => columnas.some(c => c.clave === clave)
const llenas = computed(() => columnas.length >= MAX_ESCENARIOS)

function alternar(clave: string, nombre: string, marcar: boolean) {
  if (marcar) {
    const ocupados = new Set(columnas.map(c => c.orden))
    const orden = [1, 2, 3].find(o => !ocupados.has(o))
    if (orden) columnas.push(nuevaColumna(clave, nombre, orden))
    return
  }
  const i = columnas.findIndex(c => c.clave === clave)
  if (i < 0) return
  const [quitada] = columnas.splice(i, 1)
  if (quitada?.id) eliminados.value.push(quitada.id)
}

const numero = (t: string | undefined) => ((t ?? '').trim() ? Number(t) : null)
const calculos = (c: Columna) => {
  const inversion = numero(c.valores.inversion_total_estimada)
  const proyectada = numero(c.valores.pension_mensual_estimada)
  const incremento = numero(c.valores.incremento_mensual)
  const meses
    = inversion !== null && incremento !== null && inversion > 0 && incremento > 0
      ? Math.round((inversion / incremento) * 10) / 10
      : null
  return {
    base:
      proyectada !== null && incremento !== null
        ? proyectada - incremento
        : null,
    meses,
    anios: meses === null ? null : Math.round((meses / 12) * 10) / 10
  }
}
const mostrar = (n: number | null) => (n === null ? '—' : formatoNumero(n))

// ---------- Sección 11: situación patrimonial, hijos y conclusión financiera ----------
const PATRIMONIAL: CampoF1[] = [
  {
    nombre: 'saldo_cuenta_individual',
    etiqueta: 'Saldo actual de la cuenta individual',
    tipo: 'monto'
  },
  {
    nombre: 'ahorros_inversiones_adicionales',
    etiqueta: 'Ahorros e inversiones adicionales para el retiro',
    tipo: 'monto'
  },
  {
    nombre: 'aportaciones_voluntarias',
    etiqueta: 'Aportaciones voluntarias existentes',
    tipo: 'monto'
  },
  {
    nombre: 'ingreso_mensual',
    etiqueta: 'Salario o ingreso mensual',
    tipo: 'monto'
  },
  {
    nombre: 'ingreso_conyuge',
    etiqueta: 'Ingresos del cónyuge o pareja',
    tipo: 'monto'
  },
  {
    nombre: 'otras_fuentes_ingreso',
    etiqueta: 'Rentas, inversiones u otras fuentes de ingreso',
    tipo: 'texto'
  },
  { nombre: 'seguros', etiqueta: 'Seguros', tipo: 'texto' },
  {
    nombre: 'estado_salud',
    etiqueta: 'Estado de salud',
    tipo: 'select',
    opciones: ESTADOS_SALUD
  },
  {
    nombre: 'padecimientos',
    etiqueta: 'Padecimientos detectados',
    tipo: 'texto'
  },
  {
    nombre: 'estado_civil',
    etiqueta: 'Estado civil',
    tipo: 'select',
    opciones: ESTADOS_CIVILES
  },
  { nombre: 'edad_conyuge', etiqueta: 'Edad del cónyuge', tipo: 'entero' },
  {
    nombre: 'actividad_economica_conyuge',
    etiqueta: 'Actividad económica del cónyuge',
    tipo: 'texto'
  },
  {
    nombre: 'bienes_patrimoniales',
    etiqueta: 'Bienes patrimoniales',
    tipo: 'area'
  },
  {
    nombre: 'creditos_deudas_vigentes',
    etiqueta: 'Crédito o deudas vigentes',
    tipo: 'area'
  }
]
const CONCLUSION: CampoF1 = {
  nombre: 'conclusion_financiera',
  etiqueta: 'Conclusión financiera',
  tipo: 'area'
}
// El estado civil del cliente es el valor inicial mientras el registro patrimonial no lo tenga (el backend lo guarda en null).
const patrimonial = useFormularioF1(PATRIMONIAL, {
  ...f1.patrimonial.value,
  estado_civil:
    f1.patrimonial.value?.estado_civil ?? f1.cliente.value.estado_civil
})
const conclusion = useFormularioF1([CONCLUSION], f1.diagnostico.value)

interface Hijo {
  clave: number
  edad: string
  tiene_discapacidad: boolean
}
let claveHijo = 0
const hijos = reactive<Hijo[]>(
  (f1.listas['situacion-patrimonial/hijos'] ?? []).map(h => ({
    clave: claveHijo++,
    edad: aTexto(h.edad),
    tiene_discapacidad: h.tiene_discapacidad === true
  }))
)
const hijosGuardados = (f1.listas['situacion-patrimonial/hijos'] ?? []).length
const erroresHijo = reactive<Record<number, string | undefined>>({})

const erroresColumna = reactive<
  Record<string, Record<string, string | undefined>>
>({})

function validarTodo(): boolean {
  let ok = patrimonial.validar() && conclusion.validar()
  for (const c of columnas) {
    const e: Record<string, string | undefined> = {}
    for (const f of FILAS)
      e[f.nombre]
        = 'entero' in f
          ? errorEntero(c.valores[f.nombre] ?? '')
          : errorMonto(c.valores[f.nombre] ?? '')
    if (c.clave === 'm10') e.meses_modalidad_10 = errorEntero(mesesM10.value)
    erroresColumna[c.clave] = e
    if (Object.values(e).some(Boolean)) ok = false
  }
  for (const h of hijos) {
    erroresHijo[h.clave] = !h.edad.trim()
      ? 'La edad es obligatoria'
      : (errorEntero(h.edad)
        ?? (Number(h.edad) > 120 ? 'Debe ser de 0 a 120' : undefined))
    if (erroresHijo[h.clave]) ok = false
  }
  return ok
}

async function guardarEscenarios() {
  for (const id of eliminados.value) await f1.api.escenarios.eliminar(id)
  eliminados.value = []
  for (const c of ordenadas.value) {
    const { meses } = calculos(c)
    const esM10 = c.clave === 'm10'
    if (!c.id) {
      const datos: Registro = { nombre_escenario: c.nombre, orden: c.orden }
      for (const f of FILAS)
        if ((c.valores[f.nombre] ?? '').trim())
          datos[f.nombre] = Number(c.valores[f.nombre])
      if (meses !== null) datos.meses_recuperacion_inversion = meses
      if (esM10 && mesesM10.value.trim())
        datos.meses_modalidad_10 = Number(mesesM10.value)
      c.id = String((await f1.api.escenarios.crear(datos)).id)
    } else {
      const cambios: Registro = {}
      for (const f of FILAS)
        if (c.valores[f.nombre] !== c.original[f.nombre])
          cambios[f.nombre] = (c.valores[f.nombre] ?? '').trim()
            ? Number(c.valores[f.nombre])
            : null
      const cambioCalculo
        = c.valores.inversion_total_estimada
          !== c.original.inversion_total_estimada
          || c.valores.incremento_mensual !== c.original.incremento_mensual
      if (cambioCalculo && meses !== null)
        cambios.meses_recuperacion_inversion = meses
      if (esM10 && mesesM10.value !== mesesM10Inicial)
        cambios.meses_modalidad_10 = mesesM10.value.trim()
          ? Number(mesesM10.value)
          : null
      if (Object.keys(cambios).length > 0)
        await f1.api.escenarios.actualizar(c.id, cambios)
    }
    c.original = { ...c.valores }
  }
}

async function enviar(): Promise<boolean> {
  if (!validarTodo()) return false
  return patrimonial.ejecutar(async () => {
    await guardarEscenarios()
    const hayPatrimonial
      = Boolean(f1.patrimonial.value)
        || Object.keys(patrimonial.cuerpo()).length > 0
        || hijos.length > 0
    if (hayPatrimonial) await f1.guardarPatrimonial(patrimonial.completo())
    if (hijos.length > 0 || hijosGuardados > 0) {
      await f1.guardarLista(
        'situacion-patrimonial/hijos',
        hijos.map(h => ({
          edad: Number(h.edad),
          ...(h.tiene_discapacidad ? { tiene_discapacidad: true } : {})
        }))
      )
    }
    await f1.guardarCampos(conclusion.cuerpo())
    patrimonial.confirmar()
    conclusion.confirmar()
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
        10. Selección de escenarios
      </h4>
      <p
        data-escenarios-contador
        class="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800"
      >
        {{ columnas.length }}/{{ MAX_ESCENARIOS }} seleccionados — los elegidos
        alimentan la tabla comparativa de la sección 11
      </p>
      <div class="grid gap-2 md:grid-cols-2">
        <div
          v-for="s in opcionesEscenario"
          :key="s.clave"
          class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2"
        >
          <label
            class="flex cursor-pointer items-center gap-2 text-sm text-neutral-900"
          >
            <input
              type="checkbox"
              :name="`escenario-${s.clave}`"
              :checked="seleccionada(s.clave)"
              :disabled="llenas && !seleccionada(s.clave)"
              @change="
                alternar(
                  s.clave,
                  s.nombre,
                  ($event.target as HTMLInputElement).checked
                )
              "
            >
            {{ s.nombre }}
          </label>
          <label
            v-if="s.clave === 'm10' && seleccionada('m10')"
            class="flex items-center gap-2 text-sm"
          >
            por
            <input
              v-model="mesesM10"
              name="meses_modalidad_10"
              inputmode="numeric"
              placeholder="N"
              aria-label="Meses de Modalidad 10"
              autocomplete="off"
              class="w-20 rounded-md border border-marca-200 px-2 py-1"
            >
            meses
          </label>
        </div>
      </div>
      <p
        v-if="erroresColumna.m10?.meses_modalidad_10"
        class="text-sm text-red-700"
      >
        {{ erroresColumna.m10.meses_modalidad_10 }}
      </p>
    </section>

    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        11. Análisis financiero / Retorno de inversión
      </h4>
      <div
        v-if="ordenadas.length === 0"
        class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-600"
      >
        Elige escenarios arriba para compararlos.
      </div>
      <div
        v-else
        class="grid gap-4 md:grid-cols-3"
      >
        <div
          v-for="c in ordenadas"
          :key="c.clave"
          :data-escenario-col="c.orden"
          class="space-y-3 rounded-xl border border-marca-100 bg-white p-4"
        >
          <h5 class="text-sm font-semibold text-profundo-700">
            Escenario {{ c.orden }}
            <span class="block font-normal text-neutral-600">{{
              c.nombre
            }}</span>
          </h5>
          <label
            v-for="f in FILAS.slice(0, 5)"
            :key="f.nombre"
            class="block text-xs font-semibold text-profundo-700"
          >
            {{ f.etiqueta }}
            <input
              v-model="c.valores[f.nombre]"
              :name="f.nombre"
              :inputmode="'entero' in f ? 'numeric' : 'decimal'"
              :placeholder="'entero' in f ? undefined : '$'"
              autocomplete="off"
              class="mt-1 w-full rounded-md border border-marca-200 px-2 py-1.5 text-sm font-normal"
            >
            <span
              v-if="erroresColumna[c.clave]?.[f.nombre]"
              class="block font-normal text-red-700"
            >{{ erroresColumna[c.clave]![f.nombre] }}</span>
          </label>
          <dl
            class="grid grid-cols-3 gap-2 rounded-lg bg-neutral-50 p-2 text-xs"
          >
            <div>
              <dt class="text-neutral-500">
                Pensión base
              </dt>
              <dd
                data-calculo="base"
                class="font-semibold"
              >
                {{ mostrar(calculos(c).base) }}
              </dd>
            </div>
            <div>
              <dt class="text-neutral-500">
                Meses
              </dt>
              <dd
                data-calculo="meses"
                class="font-semibold"
              >
                {{ mostrar(calculos(c).meses) }}
              </dd>
            </div>
            <div>
              <dt class="text-neutral-500">
                Años
              </dt>
              <dd
                data-calculo="anios"
                class="font-semibold"
              >
                {{ mostrar(calculos(c).anios) }}
              </dd>
            </div>
          </dl>
          <label
            v-for="f in FILAS.slice(5)"
            :key="f.nombre"
            class="block text-xs font-semibold text-profundo-700"
          >
            {{ f.etiqueta }}
            <input
              v-model="c.valores[f.nombre]"
              :name="f.nombre"
              :inputmode="'entero' in f ? 'numeric' : 'decimal'"
              :placeholder="'entero' in f ? undefined : '$'"
              autocomplete="off"
              class="mt-1 w-full rounded-md border border-marca-200 px-2 py-1.5 text-sm font-normal"
            >
            <span
              v-if="erroresColumna[c.clave]?.[f.nombre]"
              class="block font-normal text-red-700"
            >{{ erroresColumna[c.clave]![f.nombre] }}</span>
          </label>
        </div>
      </div>
      <p class="text-xs text-neutral-500">
        Fórmula de recuperación simple: inversión total ÷ incremento mensual de
        pensión = meses aproximados para recuperar la inversión.
      </p>

      <h5 class="pt-2 text-sm font-semibold text-profundo-700">
        Situación patrimonial y de ahorro para el retiro
      </h5>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <F1Campo
          v-for="c in PATRIMONIAL.slice(0, 12)"
          :key="c.nombre"
          v-model="patrimonial.valores[c.nombre]!"
          :campo="c"
          :error="patrimonial.errores[c.nombre]"
        />
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <F1Campo
          v-model="patrimonial.valores.bienes_patrimoniales!"
          :campo="PATRIMONIAL[12]!"
        />
        <F1Campo
          v-model="patrimonial.valores.creditos_deudas_vigentes!"
          :campo="PATRIMONIAL[13]!"
        />
      </div>

      <div class="space-y-2">
        <h5 class="text-sm font-semibold text-profundo-700">
          Hijos
          <span class="font-normal text-neutral-500">· Total: <span data-total-hijos>{{ hijos.length }}</span></span>
        </h5>
        <div
          v-for="(h, i) in hijos"
          :key="h.clave"
          data-hijo
          class="flex flex-wrap items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3"
        >
          <label class="text-xs font-semibold text-profundo-700">
            Edad
            <input
              v-model="h.edad"
              name="edad"
              inputmode="numeric"
              autocomplete="off"
              class="mt-1 block w-24 rounded-md border border-marca-200 px-2 py-1.5 text-sm font-normal"
            >
            <span
              v-if="erroresHijo[h.clave]"
              class="block font-normal text-red-700"
            >{{ erroresHijo[h.clave] }}</span>
          </label>
          <label class="mt-5 flex items-center gap-2 text-sm">
            <input
              v-model="h.tiene_discapacidad"
              type="checkbox"
              name="tiene_discapacidad"
            >
            Con discapacidad
          </label>
          <button
            type="button"
            data-accion="quitar-hijo"
            aria-label="Quitar hijo"
            class="ml-auto mt-5 text-neutral-500 hover:text-red-700"
            @click="hijos.splice(i, 1)"
          >
            <UIcon
              name="i-lucide-x"
              class="size-4"
            />
          </button>
        </div>
        <UButton
          data-accion="agregar-hijo"
          color="neutral"
          variant="outline"
          icon="i-lucide-plus"
          size="sm"
          @click="
            hijos.push({
              clave: claveHijo++,
              edad: '',
              tiene_discapacidad: false
            })
          "
        >
          Agregar hijo
        </UButton>
      </div>

      <F1Campo
        v-model="conclusion.valores.conclusion_financiera!"
        :campo="CONCLUSION"
      />
    </section>

    <p
      v-if="patrimonial.errorGeneral.value"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ patrimonial.errorGeneral.value }}
    </p>
  </form>
</template>

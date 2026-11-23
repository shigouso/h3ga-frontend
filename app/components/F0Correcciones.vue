<script setup lang="ts">
import type { Correccion, TipoCorreccion } from '~/types/f0'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{
  clienteId: string
  tipos: TipoCorreccion[]
  correcciones: Correccion[]
  disponible: boolean
}>()
const emit = defineEmits<{ correcciones: [correcciones: Correccion[]] }>()

const api = useCorrecciones(props.clienteId)

// Filas de la tabla del wireframe, con el id del tipo en el catálogo del backend.
const PLANTILLA = [
  { tipoId: 1, etiqueta: 'Corrección CURP' },
  { tipoId: 3, etiqueta: 'Corrección Acta' },
  { tipoId: 7, etiqueta: 'Unificación NSS' },
  { tipoId: 8, etiqueta: 'Corrección AFORE' },
  { tipoId: 9, etiqueta: 'Actualización IMSS' },
  { tipoId: 12, etiqueta: 'Otro' }
]
// Tipos que modifican el expediente (CURP, RFC, nombre, nacimiento, sexo): el backend exige el dato correcto.
const REQUIERE_DATO = [1, 2, 4, 5, 6]
const TIPO_OTRO = 12

interface Fila {
  clave: string
  tipoId: number
  etiqueta: string
  id?: string
  observaciones: string
  tiempo: string
  // En "Otro", dato_actual guarda el nombre del trámite que se especifica.
  dato_actual: string
  dato_correcto: string
  guardado: string
}

const texto = (valor: string | null | undefined) => valor ?? ''
const huella = (
  f: Pick<Fila, 'observaciones' | 'tiempo' | 'dato_actual' | 'dato_correcto'>
) =>
  JSON.stringify(
    [f.observaciones, f.tiempo, f.dato_actual, f.dato_correcto].map(v =>
      v.trim()
    )
  )

function aFila(
  clave: string,
  tipoId: number,
  etiqueta: string,
  c?: Correccion
): Fila {
  const fila = {
    clave,
    tipoId,
    etiqueta,
    id: c?.id,
    observaciones: texto(c?.observaciones),
    tiempo: texto(c?.tiempo_promedio),
    dato_actual: texto(c?.dato_actual),
    dato_correcto: texto(c?.dato_correcto)
  }
  return { ...fila, guardado: huella(fila) }
}

// Una fila por tipo de la tabla (con su primera corrección, si existe) y una fila extra por cada corrección
// que no cabe ahí (otros tipos o repetidas), para no ocultar datos del cliente.
function armarFilas(): Fila[] {
  const restantes = [...props.correcciones]
  const filas = PLANTILLA.map((p) => {
    const i = restantes.findIndex(c => c.tipo_correccion_id === p.tipoId)
    return aFila(
      String(p.tipoId),
      p.tipoId,
      p.etiqueta,
      i >= 0 ? restantes.splice(i, 1)[0] : undefined
    )
  })
  const extras = restantes.map(c =>
    aFila(
      `extra-${c.id}`,
      c.tipo_correccion_id,
      props.tipos.find(t => t.id === c.tipo_correccion_id)?.nombre
      ?? 'Otra corrección',
      c
    )
  )
  return [...filas, ...extras]
}
const filas = reactive<Fila[]>(armarFilas())
const registros = ref<Correccion[]>([...props.correcciones])
const errores = reactive<
  Record<string, { dato_correcto?: string, tramite?: string }>
>({})
const errorGeneral = ref<string | null>(null)

const tieneDatos = (f: Fila) =>
  Boolean(
    f.observaciones.trim()
    || f.tiempo.trim()
    || f.dato_actual.trim()
    || f.dato_correcto.trim()
  )
const requiereDato = (f: Fila) => REQUIERE_DATO.includes(f.tipoId)
const esOtro = (f: Fila) => f.tipoId === TIPO_OTRO
const muestraDatos = (f: Fila) =>
  requiereDato(f) && (tieneDatos(f) || Boolean(f.id))

function validar(): boolean {
  let ok = true
  for (const f of filas) {
    const e: { dato_correcto?: string, tramite?: string } = {}
    if (requiereDato(f) && (tieneDatos(f) || f.id) && !f.dato_correcto.trim())
      e.dato_correcto = 'El dato correcto es obligatorio'
    if (esOtro(f) && tieneDatos(f) && !f.dato_actual.trim())
      e.tramite = 'Especifica el trámite'
    errores[f.clave] = e
    if (e.dato_correcto || e.tramite) ok = false
  }
  return ok
}

const vacioANull = (v: string) => v.trim() || null

async function guardarFila(f: Fila) {
  if (!f.id) {
    if (!tieneDatos(f)) return
    const datos = Object.fromEntries(
      Object.entries({
        observaciones: f.observaciones.trim(),
        tiempo_promedio: f.tiempo.trim(),
        dato_actual: f.dato_actual.trim(),
        dato_correcto: f.dato_correcto.trim()
      }).filter(([, v]) => v)
    )
    const creada = await api.crear({ tipo_correccion_id: f.tipoId, ...datos })
    f.id = creada.id
    registros.value = [...registros.value, creada]
  } else if (huella(f) !== f.guardado) {
    const actualizada = await api.actualizar(f.id, {
      observaciones: vacioANull(f.observaciones),
      tiempo_promedio: vacioANull(f.tiempo),
      dato_actual: vacioANull(f.dato_actual),
      dato_correcto: vacioANull(f.dato_correcto)
    })
    registros.value = registros.value.map(r =>
      r.id === actualizada.id ? actualizada : r
    )
  } else {
    return
  }
  f.guardado = huella(f)
}

// Guarda solo lo que cambió: crea las filas nuevas con datos y actualiza las ya guardadas que se modificaron.
async function enviar(): Promise<boolean> {
  errorGeneral.value = null
  if (!validar()) return false
  try {
    for (const f of filas) await guardarFila(f)
    return true
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    // Sin conexión: useApi ya mostró el aviso.
    if (e.status !== 0)
      errorGeneral.value
        = e.status === 400 || e.status === 409
          ? e.mensaje
          : 'No se pudo guardar. Inténtalo de nuevo.'
    return false
  } finally {
    emit('correcciones', registros.value)
  }
}
defineExpose({ enviar })

const claseCampo
  = 'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base font-normal text-neutral-900'
</script>

<template>
  <form
    class="space-y-3"
    novalidate
    @submit.prevent
  >
    <p
      v-if="!disponible"
      role="status"
      class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-neutral-600"
    >
      No se pudieron cargar las correcciones del cliente, por eso no se muestra
      la tabla. Recarga la página para intentarlo de nuevo.
    </p>

    <template v-else>
      <h4 class="font-semibold text-profundo-700">
        Tabla de correcciones
      </h4>
      <div class="overflow-x-auto rounded-xl border border-marca-100">
        <table class="w-full min-w-[44rem] text-left text-sm">
          <thead class="bg-neutral-100 text-profundo-700">
            <tr>
              <th class="w-1/4 px-4 py-3 font-semibold">
                Trámite
              </th>
              <th class="px-4 py-3 font-semibold">
                Observaciones
              </th>
              <th class="w-1/4 px-4 py-3 font-semibold">
                Tiempo promedio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in filas"
              :key="f.clave"
              :data-correccion="f.clave"
              class="border-t border-marca-100 align-top odd:bg-white even:bg-marca-50/60"
            >
              <td class="px-4 py-3">
                <div data-tramite>
                  <template v-if="esOtro(f)">
                    <input
                      v-model="f.dato_actual"
                      :name="`tramite-${f.clave}`"
                      placeholder="Otro (especifica el trámite)"
                      aria-label="Otro trámite"
                      autocomplete="off"
                      :class="claseCampo"
                    >
                    <span
                      v-if="errores[f.clave]?.tramite"
                      class="mt-1 block text-sm text-red-700"
                    >{{ errores[f.clave]!.tramite }}</span>
                  </template>
                  <span
                    v-else
                    class="font-semibold text-neutral-900"
                  >{{
                    f.etiqueta
                  }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <input
                  v-model="f.observaciones"
                  :name="`observaciones-${f.clave}`"
                  :aria-label="`Observaciones de ${f.etiqueta}`"
                  autocomplete="off"
                  :class="claseCampo"
                >
                <div
                  v-if="muestraDatos(f)"
                  class="mt-2 grid gap-2 md:grid-cols-2"
                >
                  <label class="block text-sm font-semibold text-profundo-700">
                    Dato actual
                    <input
                      v-model="f.dato_actual"
                      :name="`dato_actual-${f.clave}`"
                      autocomplete="off"
                      :class="`${claseCampo} mt-1`"
                    >
                  </label>
                  <label class="block text-sm font-semibold text-profundo-700">
                    Dato correcto
                    <input
                      v-model="f.dato_correcto"
                      :name="`dato_correcto-${f.clave}`"
                      autocomplete="off"
                      :class="`${claseCampo} mt-1`"
                    >
                    <span
                      v-if="errores[f.clave]?.dato_correcto"
                      class="mt-1 block font-normal text-red-700"
                    >{{ errores[f.clave]!.dato_correcto }}</span>
                  </label>
                </div>
              </td>
              <td class="px-4 py-3">
                <input
                  v-model="f.tiempo"
                  :name="`tiempo-${f.clave}`"
                  :aria-label="`Tiempo promedio de ${f.etiqueta}`"
                  autocomplete="off"
                  :class="claseCampo"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>
  </form>
</template>

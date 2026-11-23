<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import type { HistorialLaboral, InformacionIssste } from '~/types/f0'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{
  cliente: Cliente
  historial: HistorialLaboral | null | undefined
  issste: InformacionIssste | null | undefined
}>()
const emit = defineEmits<{
  cliente: [cliente: Cliente]
  historial: [historial: HistorialLaboral]
  issste: [issste: InformacionIssste]
}>()

const clientes = useClientes()
const api = useHistorialLaboral(props.cliente.id)

const ENTERO = /^\d+$/
const MONTO = /^\d+(\.\d{1,2})?$/
const ANIOS = MONTO
const VIGENCIA = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
  { valor: 'por_confirmar', etiqueta: 'Por confirmar' }
]

// El backend puede devolver los decimales como texto ("1562.20"): se muestran tal cual.
const estado = reactive({
  semanas_imss_reconocidas: String(props.cliente.semanas_imss_reconocidas),
  semanas_issste: String(props.historial?.semanas_issste ?? 0),
  salario_promedio: props.historial
    ? String(props.historial.salario_promedio)
    : '',
  ultimo_patron: props.historial?.ultimo_patron ?? '',
  vigencia_derechos: props.historial?.vigencia_derechos ?? 'por_confirmar',
  nss_issste: props.issste?.nss_issste ?? '',
  regimen_pensionario: props.issste?.regimen_pensionario ?? '',
  anios_laborados:
    props.issste?.anios_laborados == null
      ? ''
      : String(props.issste.anios_laborados)
})
const errores = reactive<Record<string, string | undefined>>({})
const errorGeneral = ref<string | null>(null)

// El bloque ISSSTE aparece si ya existe, si el cliente dice tener ISSSTE o si se capturan semanas ISSSTE.
const mostrarIssste = computed(
  () =>
    Boolean(props.issste)
    || props.cliente.tiene_issste === 'si'
    || (ENTERO.test(estado.semanas_issste.trim())
      && Number(estado.semanas_issste) > 0)
)
// Se envía si ya existía (para poder corregirla) o si se capturó algo.
const issstePorGuardar = computed(
  () =>
    mostrarIssste.value
    && Boolean(
      props.issste
      || estado.nss_issste.trim()
      || estado.regimen_pensionario.trim()
      || estado.anios_laborados.trim()
    )
)

function errorAnios(texto: string): string | undefined {
  const t = texto.trim()
  if (!t) return undefined
  if (!/^\d+(\.\d+)?$/.test(t)) return 'Debe ser un número entre 0 y 999.99'
  if (!ANIOS.test(t)) return 'Máximo 2 decimales'
  return Number(t) > 999.99 ? 'Debe ser un número entre 0 y 999.99' : undefined
}

function validar(): boolean {
  const entero = 'Debe ser un número entero de 0 o más'
  errores.semanas_imss_reconocidas = ENTERO.test(
    estado.semanas_imss_reconocidas.trim()
  )
    ? undefined
    : entero
  errores.semanas_issste = ENTERO.test(estado.semanas_issste.trim())
    ? undefined
    : entero
  errores.salario_promedio = MONTO.test(estado.salario_promedio.trim())
    ? undefined
    : 'Ingresa un monto válido (máximo 2 decimales)'
  if (issstePorGuardar.value) {
    errores.nss_issste = !estado.nss_issste.trim()
      ? 'El NSS del ISSSTE es obligatorio'
      : estado.nss_issste.trim().length > 20
        ? 'Máximo 20 caracteres'
        : undefined
    errores.regimen_pensionario = estado.regimen_pensionario.trim()
      ? undefined
      : 'El régimen pensionario es obligatorio'
    errores.anios_laborados = errorAnios(estado.anios_laborados)
  } else {
    errores.nss_issste
      = errores.regimen_pensionario
        = errores.anios_laborados
          = undefined
  }
  return Object.values(errores).every(e => !e)
}

async function enviar(): Promise<boolean> {
  errorGeneral.value = null
  if (!validar()) return false
  try {
    // Las semanas reconocidas por el IMSS son un dato del cliente; el resto va en el historial laboral.
    emit(
      'cliente',
      await clientes.actualizar(props.cliente.id, {
        semanas_imss_reconocidas: Number(estado.semanas_imss_reconocidas)
      })
    )
    const historial = await api.guardar({
      semanas_issste: Number(estado.semanas_issste),
      salario_promedio: Number(estado.salario_promedio),
      ultimo_patron: estado.ultimo_patron.trim(),
      vigencia_derechos:
        estado.vigencia_derechos as HistorialLaboral['vigencia_derechos']
    })
    emit('historial', historial)
    if (issstePorGuardar.value) {
      emit(
        'issste',
        await api.guardarIssste({
          nss_issste: estado.nss_issste.trim(),
          regimen_pensionario: estado.regimen_pensionario.trim(),
          anios_laborados: estado.anios_laborados.trim()
            ? Number(estado.anios_laborados)
            : null
        })
      )
    }
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
  }
}
defineExpose({ enviar })

const claseCampo
  = 'mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base font-normal text-neutral-900'
const claseEtiqueta = 'block text-sm font-semibold text-profundo-700'
</script>

<template>
  <form
    class="space-y-8"
    novalidate
    @submit.prevent
  >
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <label :class="claseEtiqueta">
        Semanas reconocidas IMSS
        <input
          v-model="estado.semanas_imss_reconocidas"
          name="semanas_imss_reconocidas"
          inputmode="numeric"
          autocomplete="off"
          :class="claseCampo"
        >
        <span
          v-if="errores.semanas_imss_reconocidas"
          class="mt-1 block text-sm font-normal text-red-700"
        >{{ errores.semanas_imss_reconocidas }}</span>
      </label>
      <label :class="claseEtiqueta">
        Semanas ISSSTE
        <input
          v-model="estado.semanas_issste"
          name="semanas_issste"
          inputmode="numeric"
          autocomplete="off"
          :class="claseCampo"
        >
        <span
          v-if="errores.semanas_issste"
          class="mt-1 block text-sm font-normal text-red-700"
        >{{ errores.semanas_issste }}</span>
      </label>
      <label :class="claseEtiqueta">
        Salario promedio
        <input
          v-model="estado.salario_promedio"
          name="salario_promedio"
          inputmode="decimal"
          placeholder="Ej. 1562.20"
          autocomplete="off"
          :class="claseCampo"
        >
        <span
          v-if="errores.salario_promedio"
          class="mt-1 block text-sm font-normal text-red-700"
        >{{ errores.salario_promedio }}</span>
      </label>
      <label :class="claseEtiqueta">
        Último patrón
        <input
          v-model="estado.ultimo_patron"
          name="ultimo_patron"
          autocomplete="off"
          :class="claseCampo"
        >
      </label>
      <label :class="claseEtiqueta">
        Vigencia de derechos
        <select
          v-model="estado.vigencia_derechos"
          name="vigencia_derechos"
          :class="claseCampo"
        >
          <option
            v-for="o in VIGENCIA"
            :key="o.valor"
            :value="o.valor"
          >
            {{ o.etiqueta }}
          </option>
        </select>
      </label>
    </div>

    <!-- Información ISSSTE: solo si el cliente la tiene. Se guarda aparte del historial laboral. -->
    <section
      v-if="mostrarIssste"
      data-issste
      class="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
    >
      <h4 class="mb-3 font-semibold text-profundo-700">
        Información ISSSTE
      </h4>
      <div class="grid gap-4 md:grid-cols-3">
        <label :class="claseEtiqueta">
          NSS del ISSSTE
          <input
            v-model="estado.nss_issste"
            name="nss_issste"
            autocomplete="off"
            :class="claseCampo"
          >
          <span
            v-if="errores.nss_issste"
            class="mt-1 block text-sm font-normal text-red-700"
          >{{ errores.nss_issste }}</span>
        </label>
        <label :class="claseEtiqueta">
          Régimen pensionario
          <input
            v-model="estado.regimen_pensionario"
            name="regimen_pensionario"
            placeholder="Ej. Décimo transitorio"
            autocomplete="off"
            :class="claseCampo"
          >
          <span
            v-if="errores.regimen_pensionario"
            class="mt-1 block text-sm font-normal text-red-700"
          >{{ errores.regimen_pensionario }}</span>
        </label>
        <label :class="claseEtiqueta">
          Años laborados
          <input
            v-model="estado.anios_laborados"
            name="anios_laborados"
            inputmode="decimal"
            placeholder="Ej. 18.5"
            autocomplete="off"
            :class="claseCampo"
          >
          <span
            v-if="errores.anios_laborados"
            class="mt-1 block text-sm font-normal text-red-700"
          >{{ errores.anios_laborados }}</span>
        </label>
      </div>
    </section>

    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>
  </form>
</template>

<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import type { ObjetivoEspecifico } from '~/types/f0'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{
  cliente: Cliente
  catalogo: ObjetivoEspecifico[]
  marcados: number[]
}>()
const emit = defineEmits<{
  cliente: [cliente: Cliente]
  objetivos: [ids: number[]]
}>()

const clientes = useClientes()
const objetivos = useObjetivos(props.cliente.id)

const OBJETIVOS_CLIENTE = [
  { valor: 'pensionarse_asap', etiqueta: 'Pensionarse lo antes posible' },
  {
    valor: 'mejorar_monto_pension',
    etiqueta: 'Mejorar el monto de la pensión'
  },
  { valor: 'negativa_pension', etiqueta: 'Negativa de pensión' }
]

const objetivoCliente = ref<string>(props.cliente.objetivo_cliente)
const seleccion = ref(new Set<number>(props.marcados))
const error = ref<string | null>(null)

function alternar(id: number, marcado: boolean) {
  const nueva = new Set(seleccion.value)
  if (marcado) nueva.add(id)
  else nueva.delete(id)
  seleccion.value = nueva
}

async function enviar(): Promise<boolean> {
  error.value = null
  try {
    const ids = [...seleccion.value].sort((a, b) => a - b)
    const actualizado = await clientes.actualizar(props.cliente.id, {
      objetivo_cliente: objetivoCliente.value as Cliente['objetivo_cliente']
    })
    await objetivos.reemplazar(ids)
    emit('cliente', actualizado)
    emit('objetivos', ids)
    return true
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    // Sin conexión: useApi ya mostró el aviso.
    if (e.status !== 0) error.value = 'No se pudo guardar. Inténtalo de nuevo.'
    return false
  }
}
defineExpose({ enviar })
</script>

<template>
  <div class="space-y-6">
    <label class="block max-w-sm text-sm font-semibold text-profundo-700">
      Objetivo del cliente
      <select
        v-model="objetivoCliente"
        name="objetivo_cliente"
        class="mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base font-normal text-neutral-900"
      >
        <option
          v-for="o in OBJETIVOS_CLIENTE"
          :key="o.valor"
          :value="o.valor"
        >
          {{ o.etiqueta }}
        </option>
      </select>
    </label>

    <div>
      <h4 class="mb-3 text-lg font-semibold text-profundo-700">
        Servicios / estrategias aplicables
      </h4>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label
          v-for="objetivo in catalogo"
          :key="objetivo.id"
          data-objetivo-especifico
          class="flex items-center gap-3 rounded-lg border px-4 py-3"
          :class="
            seleccion.has(objetivo.id)
              ? 'border-marca-300 bg-marca-100/60'
              : 'border-neutral-200 bg-white'
          "
        >
          <input
            type="checkbox"
            :name="`objetivo-${objetivo.id}`"
            :checked="seleccion.has(objetivo.id)"
            class="size-5 accent-profundo-500"
            @change="
              alternar(objetivo.id, ($event.target as HTMLInputElement).checked)
            "
          >
          <span class="text-neutral-800">{{ objetivo.nombre }}</span>
        </label>
      </div>
    </div>

    <p
      v-if="error"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ error }}
    </p>
  </div>
</template>

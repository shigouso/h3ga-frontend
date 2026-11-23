<script setup lang="ts">
import type { Cliente } from '~/types/cliente'
import { ApiError } from '~/utils/api-error'

const props = defineProps<{ cliente: Cliente }>()
const emit = defineEmits<{ cliente: [cliente: Cliente] }>()

const clientes = useClientes()
const observaciones = ref(props.cliente.observaciones_generales)
const error = ref<string | null>(null)

async function enviar(): Promise<boolean> {
  error.value = null
  try {
    emit(
      'cliente',
      await clientes.actualizar(props.cliente.id, {
        observaciones_generales: observaciones.value.trim()
      })
    )
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
    <label class="block text-sm font-semibold text-profundo-700">
      Observaciones
      <textarea
        v-model="observaciones"
        name="observaciones_generales"
        rows="5"
        placeholder="Notas relevantes del expediente…"
        class="mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base font-normal text-neutral-900"
      />
    </label>

    <aside
      class="rounded-xl border border-acento-300 bg-acento-50 p-5 text-sm text-neutral-800"
    >
      <p class="mb-2 flex items-center gap-2 font-medium">
        <UIcon
          name="i-lucide-info"
          class="size-4"
        />NOTAS IMPORTANTES:
      </p>
      <ul class="list-disc space-y-2 pl-6">
        <li>
          Documento diseñado para control interno y seguimiento de clientes.
        </li>
        <li>
          Protección de Datos Personales (Aviso de Privacidad): el cliente
          reconoce y acepta que, para la ejecución del presente contrato,
          entrega a H3GA SEGUROS Y PENSIONES sus datos personales, los cuales
          serán tratados conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP); mismos que serán
          utilizados exclusivamente para la asesoría técnica en materia de
          pensiones y jubilaciones. El cliente podrá ejercer sus derechos de
          Acceso, Rectificación, Cancelación u Oposición, así como revocar su
          consentimiento, enviando una solicitud por escrito al correo
          electrónico oficial: asistentehega@gmail.com. El texto completo del
          Aviso de Privacidad Integral, con todos sus detalles y
          actualizaciones, se encuentra disponible para su consulta permanente
          en el portal web: https://h3ga.vercel.app/.
        </li>
        <li>
          El presente formato es una herramienta de diagnóstico y planeación.
          Los cálculos son estimados, con base en la información y documentación
          proporcionada por el cliente y deben validarse con documentación
          oficial del IMSS, AFORE y, en su caso, con la resolución emitida por
          la autoridad competente. La recomendación puede cambiar si existen
          diferencias en semanas reconocidas, salario base, conservación de
          derechos, régimen aplicable, edad, topes legales, criterios
          administrativos o documentación del cliente.
        </li>
      </ul>
    </aside>

    <p
      v-if="error"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ error }}
    </p>
  </div>
</template>

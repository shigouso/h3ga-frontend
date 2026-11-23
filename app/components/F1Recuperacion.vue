<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import { aItems, aSelecciones } from '~/utils/f1'

const f1 = useF1()

const APLICA: CampoF1 = {
  nombre: 'aplica',
  etiqueta: '¿Aplica recuperación / aclaración?',
  tipo: 'opcion',
  opciones: [
    { valor: 'si', etiqueta: 'Sí' },
    { valor: 'no', etiqueta: 'No' },
    { valor: 'requiere_mas_evidencia', etiqueta: 'Requiere más evidencia' }
  ]
}
const OBSERVACIONES: CampoF1 = {
  nombre: 'observaciones',
  etiqueta: 'Observaciones',
  tipo: 'area'
}

const aplica = ref(String(f1.recuperacion.value?.aplica ?? ''))
const observaciones = ref(String(f1.recuperacion.value?.observaciones ?? ''))
const gestiones = ref(
  aSelecciones(f1.listas['recuperacion-gestiones'], 'tipo_gestion_id')
)
const evidencias = ref(
  aSelecciones(f1.listas['recuperacion-evidencias'], 'tipo_evidencia_id')
)
const errorAplica = ref<string | undefined>()
const errorGeneral = ref<string | null>(null)

async function enviar(): Promise<boolean> {
  errorGeneral.value = null
  errorAplica.value = undefined
  const hayAlgo = Boolean(
    aplica.value
    || observaciones.value.trim()
    || gestiones.value.length
    || evidencias.value.length
  )
  if (!hayAlgo) return true
  if (!aplica.value) {
    errorAplica.value
      = 'Indica si aplica la recuperación o aclaración de semanas'
    return false
  }
  try {
    await f1.guardarRecuperacion({
      aplica: aplica.value,
      ...(observaciones.value.trim()
        ? { observaciones: observaciones.value.trim() }
        : {})
    })
    await f1.guardarLista(
      'recuperacion-gestiones',
      aItems(gestiones.value, f1.catalogos.gestiones ?? [], 'tipo_gestion_id')
    )
    await f1.guardarLista(
      'recuperacion-evidencias',
      aItems(
        evidencias.value,
        f1.catalogos.evidencias ?? [],
        'tipo_evidencia_id'
      )
    )
    return true
  } catch (e) {
    return manejarErrorF1(e, errorGeneral)
  }
}
defineExpose({ enviar })
</script>

<template>
  <form
    class="space-y-6"
    novalidate
    @submit.prevent
  >
    <F1Campo
      v-model="aplica"
      :campo="APLICA"
      :error="errorAplica"
    />
    <div class="grid gap-6 xl:grid-cols-2">
      <F1Checks
        v-model="gestiones"
        nombre="gestiones"
        titulo="Tipo de gestión sugerida"
        :catalogo="f1.catalogos.gestiones ?? []"
        :maximo-columnas="2"
      />
      <F1Checks
        v-model="evidencias"
        nombre="evidencias"
        titulo="Evidencia mínima sugerida"
        :catalogo="f1.catalogos.evidencias ?? []"
        :maximo-columnas="2"
      />
    </div>
    <F1Campo
      v-model="observaciones"
      :campo="OBSERVACIONES"
    />
    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>
  </form>
</template>

<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import { aItems, aSelecciones } from '~/utils/f1'

const f1 = useF1()
const CAMPOS: CampoF1[] = [
  {
    nombre: 'comentarios_cliente',
    etiqueta: 'Comentarios del cliente',
    tipo: 'area'
  }
]
const form = useFormularioF1(CAMPOS, f1.diagnostico.value)
const seleccion = ref(aSelecciones(f1.listas.objetivos, 'objetivo_id'))

async function enviar(): Promise<boolean> {
  if (!form.validar()) return false
  return form.ejecutar(async () => {
    await f1.guardarCampos(form.cuerpo())
    await f1.guardarLista(
      'objetivos',
      aItems(seleccion.value, f1.catalogos.objetivos ?? [], 'objetivo_id')
    )
    form.confirmar()
  })
}
defineExpose({ enviar })
</script>

<template>
  <form
    class="space-y-6"
    novalidate
    @submit.prevent
  >
    <F1Checks
      v-model="seleccion"
      nombre="objetivos"
      titulo="Objetivos (selección múltiple)"
      :catalogo="f1.catalogos.objetivos ?? []"
    />
    <F1Campo
      v-model="form.valores.comentarios_cliente!"
      :campo="CAMPOS[0]!"
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

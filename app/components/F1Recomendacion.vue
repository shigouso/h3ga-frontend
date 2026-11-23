<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import { aItems, aSelecciones } from '~/utils/f1'

const f1 = useF1()

const CAMPOS: CampoF1[] = [
  {
    nombre: 'justificacion_estrategia',
    etiqueta: 'Justificación',
    tipo: 'area'
  },
  {
    nombre: 'siguiente_paso_sugerido',
    etiqueta: 'Siguiente paso sugerido',
    tipo: 'area'
  }
]
const form = useFormularioF1(CAMPOS, f1.diagnostico.value)
const estrategias = ref(
  aSelecciones(f1.listas['estrategias-recomendadas'], 'estrategia_id')
)
const plan = useTemplateRef<{
  validar: () => boolean
  enviar: () => Promise<void>
}>('plan')

async function enviar(): Promise<boolean> {
  const ok = form.validar()
  if (!ok || !(plan.value?.validar() ?? true)) return false
  return form.ejecutar(async () => {
    await f1.guardarCampos(form.cuerpo())
    await f1.guardarLista(
      'estrategias-recomendadas',
      aItems(
        estrategias.value,
        f1.catalogos.estrategias ?? [],
        'estrategia_id'
      )
    )
    await plan.value?.enviar()
    form.confirmar()
  })
}
defineExpose({ enviar })
</script>

<template>
  <form
    class="space-y-8"
    novalidate
    @submit.prevent
  >
    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        12. Recomendación final del asesor
      </h4>
      <F1Checks
        v-model="estrategias"
        nombre="estrategias"
        titulo="Estrategia recomendada"
        :catalogo="f1.catalogos.estrategias ?? []"
      />
      <div class="grid gap-4 xl:grid-cols-2">
        <F1Campo
          v-model="form.valores.justificacion_estrategia!"
          :campo="CAMPOS[0]!"
        />
        <F1Campo
          v-model="form.valores.siguiente_paso_sugerido!"
          :campo="CAMPOS[1]!"
        />
      </div>
    </section>

    <section class="space-y-4">
      <h4 class="font-semibold text-profundo-700">
        13. Plan de acción
      </h4>
      <F1Plan ref="plan" />
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

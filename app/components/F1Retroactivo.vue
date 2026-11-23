<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'
import type { Registro } from '~/types/f1'
import {
  CONCLUSIONES_RETROACTIVO,
  PREGUNTAS_RETROACTIVO,
  SI_NO_VALIDAR
} from '~/utils/f1'

const f1 = useF1()

const BAJA: CampoF1 = {
  nombre: 'fecha_ultima_baja',
  etiqueta: 'Fecha de baja IMSS',
  tipo: 'fecha'
}
const CAMPOS: CampoF1[] = [
  {
    nombre: 'fecha_propuesta_inicio_m40',
    etiqueta: 'Fecha propuesta de inicio de Modalidad 40',
    tipo: 'fecha'
  },
  { nombre: 'fecha_solicitud', etiqueta: 'Fecha de solicitud', tipo: 'fecha' },
  {
    nombre: 'meses_retroactivos_estimados',
    etiqueta: 'Meses retroactivos estimados',
    tipo: 'entero'
  },
  {
    nombre: 'salario_diario_propuesto',
    etiqueta: 'Salario diario propuesto',
    tipo: 'monto'
  },
  { nombre: 'cuotas_estimadas', etiqueta: 'Cuotas estimadas', tipo: 'monto' },
  {
    nombre: 'recargos_actualizaciones_estimadas',
    etiqueta: 'Recargos / actualizaciones estimadas',
    tipo: 'monto'
  },
  {
    nombre: 'total_estimado_pagar',
    etiqueta: 'Total estimado a pagar',
    tipo: 'monto'
  },
  {
    nombre: 'baja_por_mora_previa',
    etiqueta: '¿Existe baja por mora previa?',
    tipo: 'booleano'
  },
  {
    nombre: 'dentro_de_plazo_reingreso',
    etiqueta: '¿Está dentro de plazo para reingreso, si aplica?',
    tipo: 'opcion',
    opciones: SI_NO_VALIDAR.map(o =>
      o.valor === 'requiere_validar' ? { ...o, etiqueta: 'Validar' } : o
    )
  },
  {
    nombre: 'conclusion_retroactivo',
    etiqueta: 'Conclusión preliminar sobre retroactivo',
    tipo: 'opcion',
    opciones: CONCLUSIONES_RETROACTIVO
  },
  { nombre: 'comentarios', etiqueta: 'Comentarios', tipo: 'area' }
]

const baja = useFormularioF1([BAJA], f1.diagnostico.value)
const retro = useFormularioF1(CAMPOS, f1.retroactivo.value)

const guardadas = new Map(
  (f1.listas['conveniencia-retroactivo'] ?? []).map(p => [
    String(p.pregunta),
    p
  ])
)
const preguntas = reactive(
  PREGUNTAS_RETROACTIVO.map((pregunta) => {
    const g = guardadas.get(pregunta)
    return {
      pregunta,
      respuesta:
        g?.respuesta === true ? 'true' : g?.respuesta === false ? 'false' : ''
    }
  })
)

async function enviar(): Promise<boolean> {
  const ok = baja.validar() && retro.validar()
  if (!ok) return false
  return retro.ejecutar(async () => {
    await f1.guardarCampos(baja.cuerpo())
    const datos = retro.completo()
    const hayAlgo
      = Object.keys(datos).length > 0
        || preguntas.some(p => p.respuesta)
        || Boolean(f1.retroactivo.value)
    if (!hayAlgo) return
    await f1.guardarRetroactivo(datos)
    const items: Registro[] = preguntas.map(p => ({
      pregunta: p.pregunta,
      ...(p.respuesta ? { respuesta: p.respuesta === 'true' } : {})
    }))
    await f1.guardarLista('conveniencia-retroactivo', items)
    baja.confirmar()
    retro.confirmar()
  })
}
defineExpose({ enviar })

const campoPregunta = (i: number): CampoF1 => ({
  nombre: `retro-pregunta-${i}`,
  etiqueta: preguntas[i]!.pregunta,
  tipo: 'booleano'
})
</script>

<template>
  <form
    class="space-y-6"
    novalidate
    @submit.prevent
  >
    <p
      class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
    >
      Usa esta sección cuando se evalúe iniciar o regularizar Modalidad 40 desde
      una fecha anterior permitida, pagar meses omitidos, o reingresar después
      de baja por falta de pago. Valida siempre contra la Subdelegación y la
      normativa vigente.
    </p>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <F1Campo
        v-model="baja.valores.fecha_ultima_baja!"
        :campo="BAJA"
        :error="baja.errores.fecha_ultima_baja"
      />
      <F1Campo
        v-for="c in CAMPOS.slice(0, 7)"
        :key="c.nombre"
        v-model="retro.valores[c.nombre]!"
        :campo="c"
        :error="retro.errores[c.nombre]"
      />
    </div>
    <div class="flex flex-wrap gap-x-8 gap-y-4">
      <F1Campo
        v-model="retro.valores.baja_por_mora_previa!"
        :campo="CAMPOS[7]!"
      />
      <F1Campo
        v-model="retro.valores.dentro_de_plazo_reingreso!"
        :campo="CAMPOS[8]!"
      />
    </div>

    <section class="space-y-3">
      <h4 class="font-semibold text-profundo-700">
        Evaluación de conveniencia
      </h4>
      <div class="grid gap-4 md:grid-cols-2">
        <F1Campo
          v-for="(p, i) in preguntas"
          :key="p.pregunta"
          v-model="p.respuesta"
          :campo="campoPregunta(i)"
        />
      </div>
    </section>

    <F1Campo
      v-model="retro.valores.conclusion_retroactivo!"
      :campo="CAMPOS[9]!"
    />
    <F1Campo
      v-model="retro.valores.comentarios!"
      :campo="CAMPOS[10]!"
    />
    <p
      v-if="retro.errorGeneral.value"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ retro.errorGeneral.value }}
    </p>
  </form>
</template>

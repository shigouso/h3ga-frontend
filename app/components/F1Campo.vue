<script setup lang="ts">
import type { CampoF1 } from '~/composables/useFormularioF1'

const props = defineProps<{ campo: CampoF1, error?: string }>()
const modelo = defineModel<string>({ default: '' })

const claseCampo
  = 'mt-1 w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base font-normal text-neutral-900 read-only:bg-neutral-100'
const opciones = computed(() =>
  props.campo.tipo === 'booleano'
    ? [
        { valor: 'true', etiqueta: 'Sí' },
        { valor: 'false', etiqueta: 'No' }
      ]
    : (props.campo.opciones ?? [])
)
const esGrupo = computed(
  () => props.campo.tipo === 'opcion' || props.campo.tipo === 'booleano'
)
</script>

<template>
  <fieldset
    v-if="esGrupo"
    :data-grupo="campo.nombre"
    class="min-w-0 border-0 p-0"
  >
    <legend class="text-sm font-semibold text-profundo-700">
      {{ campo.etiqueta }}
    </legend>
    <div class="mt-1 flex flex-wrap gap-2">
      <label
        v-for="o in opciones"
        :key="o.valor"
        class="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-normal has-[:checked]:border-marca-500 has-[:checked]:bg-marca-50"
      >
        <input
          v-model="modelo"
          type="radio"
          :name="campo.nombre"
          :value="o.valor"
        >
        {{ o.etiqueta }}
      </label>
    </div>
    <span
      v-if="error"
      class="mt-1 block text-sm font-normal text-red-700"
    >{{
      error
    }}</span>
  </fieldset>

  <label
    v-else
    class="block min-w-0 text-sm font-semibold text-profundo-700"
  >
    {{ campo.etiqueta }}
    <textarea
      v-if="campo.tipo === 'area'"
      v-model="modelo"
      :name="campo.nombre"
      rows="4"
      :placeholder="campo.placeholder"
      :class="claseCampo"
    />
    <select
      v-else-if="campo.tipo === 'select'"
      v-model="modelo"
      :name="campo.nombre"
      :class="claseCampo"
    >
      <option value="">Seleccionar</option>
      <option
        v-for="o in campo.opciones"
        :key="o.valor"
        :value="o.valor"
      >
        {{ o.etiqueta }}
      </option>
    </select>
    <input
      v-else
      v-model="modelo"
      :type="campo.tipo === 'fecha' ? 'date' : 'text'"
      :name="campo.nombre"
      :inputmode="
        campo.tipo === 'entero'
          ? 'numeric'
          : campo.tipo === 'monto'
            ? 'decimal'
            : undefined
      "
      :readonly="campo.soloLectura"
      :placeholder="
        campo.placeholder ?? (campo.tipo === 'monto' ? '$' : undefined)
      "
      autocomplete="off"
      :class="claseCampo"
    >
    <span
      v-if="campo.ayuda"
      class="mt-1 block text-xs font-normal text-neutral-500"
    >{{ campo.ayuda }}</span>
    <span
      v-if="error"
      class="mt-1 block text-sm font-normal text-red-700"
    >{{
      error
    }}</span>
  </label>
</template>

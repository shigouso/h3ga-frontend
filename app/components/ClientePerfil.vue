<script setup lang="ts">
import type { CatalogosCliente, Cliente } from '~/types/cliente'
import type {
  EstatusTramite,
  EtapaCliente,
  EventoAgenda
} from '~/types/expediente'
import { proximaCita, horaCorta } from '~/utils/citas'
import { esEtapaActual } from '~/utils/etapas'
import {
  diasHasta,
  edadDesde,
  formatearFechaCorta,
  textoDias
} from '~/utils/fechas'

const props = defineProps<{
  cliente: Cliente
  etapas: EtapaCliente[]
  estatus: EstatusTramite[]
  catalogos: CatalogosCliente | null
  asesorNombre: string | null
  eventos: EventoAgenda[] | null
}>()

const toast = useToast()
const pestana = ref<'datos' | 'fechas'>('datos')

const nombreCompleto = computed(() =>
  [
    props.cliente.nombre,
    props.cliente.apellido_paterno,
    props.cliente.apellido_materno
  ]
    .filter(Boolean)
    .join(' ')
)
const iniciales = computed(() =>
  `${props.cliente.nombre.charAt(0)}${props.cliente.apellido_paterno.charAt(0)}`.toUpperCase()
)
const edad = computed(() => edadDesde(props.cliente.fecha_nacimiento))
const nombreEstatus = (id: number) =>
  props.estatus.find(e => e.id === id)?.nombre ?? ''
const etapasActuales = computed(() =>
  props.etapas.filter(e => esEtapaActual(e.estatus_id))
)

const OBJETIVOS: Record<string, string> = {
  pensionarse_asap: 'Pensionarse lo antes posible',
  mejorar_monto_pension: 'Mejorar el monto de la pensión',
  negativa_pension: 'Resolver la negativa de pensión'
}
const SI_NO: Record<string, string> = {
  si: 'Sí',
  no: 'No',
  por_confirmar: 'Por confirmar'
}

// WhatsApp: un número de 10 dígitos es mexicano y lleva la lada 52.
const whatsapp = computed(() => {
  const digitos = props.cliente.telefono.replace(/\D/g, '')
  if (!digitos) return null
  return `https://wa.me/${digitos.length === 10 ? `52${digitos}` : digitos}`
})

const domicilio = computed(() =>
  [props.cliente.domicilio, props.cliente.estado].filter(Boolean).join(', ')
)

const nombreDe = (
  lista: { id: number, nombre: string }[] | undefined,
  id: number
) => lista?.find(i => i.id === id)?.nombre ?? null
const datos = computed(() => [
  {
    clave: 'afore',
    etiqueta: 'AFORE',
    valor: nombreDe(props.catalogos?.afores, props.cliente.afore_id)
  },
  { clave: 'nss', etiqueta: 'NSS', valor: props.cliente.nss },
  { clave: 'curp', etiqueta: 'CURP', valor: props.cliente.curp },
  { clave: 'rfc', etiqueta: 'RFC', valor: props.cliente.rfc },
  { clave: 'ine', etiqueta: 'INE', valor: props.cliente.ine },
  {
    clave: 'regimen',
    etiqueta: 'Régimen',
    valor: nombreDe(props.catalogos?.regimenes, props.cliente.regimen_id)
  },
  {
    clave: 'ley',
    etiqueta: 'Ley probable',
    valor: nombreDe(
      props.catalogos?.leyesProbables,
      props.cliente.ley_probable_id
    )
  },
  {
    clave: 'semanas',
    etiqueta: 'Semanas IMSS reconocidas',
    valor: String(props.cliente.semanas_imss_reconocidas)
  },
  {
    clave: 'recuperar',
    etiqueta: 'Semanas a recuperar',
    valor:
      props.cliente.semanas_a_recuperar == null
        ? null
        : String(props.cliente.semanas_a_recuperar)
  },
  {
    clave: 'issste',
    etiqueta: '¿Tiene ISSSTE?',
    valor: SI_NO[props.cliente.tiene_issste] ?? null
  }
])

const cita = computed(() =>
  props.eventos ? proximaCita(props.eventos, props.cliente.id) : null
)

async function copiar(valor: string) {
  try {
    await navigator.clipboard.writeText(valor)
    toast.add({ title: 'Copiado', description: valor, color: 'success' })
  } catch {
    toast.add({ title: 'No se pudo copiar', color: 'error' })
  }
}

const clasePestana = (activa: boolean) => [
  'flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 font-medium transition-colors',
  activa
    ? 'border-acento-500 text-acento-800'
    : 'border-transparent text-neutral-500 hover:text-neutral-700'
]
</script>

<template>
  <aside
    data-perfil
    class="rounded-2xl bg-white p-5 shadow-sm"
  >
    <h2
      class="flex items-center gap-2 font-display text-2xl font-semibold text-profundo-700"
    >
      <UIcon
        name="i-lucide-smile"
        class="size-7"
      />
      Cliente
    </h2>

    <div
      class="mt-4 rounded-2xl bg-gradient-to-b from-acento-50 via-acento-100 to-acento-300 p-5 shadow-md"
    >
      <h3
        data-perfil-nombre
        class="text-center text-lg font-semibold text-profundo-900"
      >
        {{ nombreCompleto }}
      </h3>

      <div class="mt-4 flex items-center justify-between gap-4">
        <div class="min-w-0 space-y-3 text-sm text-neutral-800">
          <div>
            <p class="mb-1 text-neutral-600">
              Etapas actuales
            </p>
            <ul
              v-if="etapasActuales.length"
              data-etapas-actuales
              class="space-y-1"
            >
              <li
                v-for="etapa in etapasActuales"
                :key="etapa.id"
                class="flex items-start gap-2"
              >
                <UIcon
                  name="i-lucide-briefcase-business"
                  class="mt-0.5 size-4 shrink-0 text-profundo-500"
                />
                <span>{{ etapa.nombre }} •
                  {{ nombreEstatus(etapa.estatus_id) }}</span>
              </li>
            </ul>
            <p
              v-else
              class="text-neutral-600"
            >
              Sin etapas en proceso
            </p>
          </div>

          <div class="space-y-1.5">
            <p class="text-neutral-600">
              Datos principales
            </p>
            <p class="flex items-center gap-2">
              <UIcon
                name="i-lucide-phone"
                class="size-4 shrink-0 text-profundo-500"
              />{{ cliente.telefono }}
            </p>
            <p class="flex items-center gap-2 break-all">
              <UIcon
                name="i-lucide-mail"
                class="size-4 shrink-0 text-profundo-500"
              />{{ cliente.correo_electronico }}
            </p>
            <p
              v-if="domicilio"
              class="flex items-center gap-2"
            >
              <UIcon
                name="i-lucide-map-pin"
                class="size-4 shrink-0 text-profundo-500"
              />{{ domicilio }}
            </p>
            <p class="flex items-center gap-2">
              <UIcon
                name="i-lucide-cake"
                class="size-4 shrink-0 text-profundo-500"
              />Nació el {{ formatearFechaCorta(cliente.fecha_nacimiento) }}
            </p>
            <a
              v-if="whatsapp"
              :href="whatsapp"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2 py-0.5 text-sm text-neutral-800 hover:bg-neutral-50"
            >
              <UIcon
                name="i-lucide-message-circle"
                class="size-4 text-green-600"
              />{{ cliente.telefono }}
            </a>
          </div>
        </div>

        <div class="flex shrink-0 flex-col items-center gap-2">
          <span
            class="flex size-24 items-center justify-center rounded-full border-4 border-marca-200 bg-marca-100 text-3xl font-semibold text-marca-800 shadow-inner"
          >{{ iniciales }}</span>
          <p
            data-perfil-edad
            class="font-semibold text-profundo-700"
          >
            {{ edad }} años
          </p>
        </div>
      </div>

      <p
        v-if="asesorNombre"
        class="mt-4 text-center"
      >
        <span
          data-asesor
          class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-profundo-500 bg-white/70 px-3 py-1 text-sm text-profundo-900"
        >
          <UIcon
            name="i-lucide-user-round"
            class="size-4"
          />
          Asesor(a) {{ asesorNombre }}
        </span>
      </p>
    </div>

    <div class="mt-5">
      <p class="flex items-center gap-2 text-neutral-600">
        <UIcon
          name="i-lucide-star"
          class="size-4"
        />Objetivo del cliente
      </p>
      <p
        data-objetivo
        class="mt-1 text-lg font-semibold text-profundo-700"
      >
        {{ OBJETIVOS[cliente.objetivo_cliente] ?? cliente.objetivo_cliente }}
      </p>
    </div>

    <div
      role="tablist"
      class="mt-5 flex border-b border-neutral-200"
    >
      <button
        type="button"
        role="tab"
        :aria-selected="pestana === 'datos'"
        :class="clasePestana(pestana === 'datos')"
        @click="pestana = 'datos'"
      >
        <UIcon
          name="i-lucide-folder-check"
          class="size-5"
        />Datos oficiales y
        previsionales
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="pestana === 'fechas'"
        :class="clasePestana(pestana === 'fechas')"
        @click="pestana = 'fechas'"
      >
        <UIcon
          name="i-lucide-calendar-heart"
          class="size-5"
        />Fechas
        institucionales
      </button>
    </div>

    <div
      v-if="pestana === 'datos'"
      class="mt-4 grid gap-3 sm:grid-cols-2"
    >
      <div
        v-for="dato in datos"
        :key="dato.clave"
        :data-dato="dato.clave"
        class="rounded-xl bg-white p-4 shadow ring-1 ring-neutral-100"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm uppercase text-neutral-500">
            {{ dato.etiqueta }}
          </p>
          <button
            v-if="dato.valor"
            type="button"
            data-accion="copiar"
            class="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-profundo-700"
            :aria-label="`Copiar ${dato.etiqueta}`"
            @click="copiar(dato.valor)"
          >
            <UIcon
              name="i-lucide-copy"
              class="size-5"
            />
          </button>
        </div>
        <p
          class="mt-1 break-all text-lg font-medium"
          :class="dato.valor ? 'text-profundo-700' : 'text-neutral-400'"
        >
          {{ dato.valor || "Sin registrar" }}
        </p>
      </div>
    </div>

    <dl
      v-else
      data-fechas
      class="mt-4 space-y-3"
    >
      <div class="rounded-xl bg-white p-4 shadow ring-1 ring-neutral-100">
        <dt class="text-sm uppercase text-neutral-500">
          Fecha de ingreso
        </dt>
        <dd class="mt-1 text-lg font-medium text-profundo-700">
          {{ formatearFechaCorta(cliente.fecha_ingreso) }}
        </dd>
      </div>
      <div class="rounded-xl bg-white p-4 shadow ring-1 ring-neutral-100">
        <dt class="text-sm uppercase text-neutral-500">
          Fecha de nacimiento
        </dt>
        <dd class="mt-1 text-lg font-medium text-profundo-700">
          {{ formatearFechaCorta(cliente.fecha_nacimiento) }} · {{ edad }} años
        </dd>
      </div>
      <div class="rounded-xl bg-white p-4 shadow ring-1 ring-neutral-100">
        <dt class="text-sm uppercase text-neutral-500">
          Próxima cita
        </dt>
        <dd class="mt-1 text-lg font-medium text-profundo-700">
          <template v-if="eventos === null">
            No disponible
          </template>
          <template v-else-if="cita">
            {{ formatearFechaCorta(cita.fecha) }} · {{ horaCorta(cita.hora) }}
            <span class="block text-sm font-normal text-neutral-600">{{ cita.motivo }} · {{ textoDias(diasHasta(cita.fecha)) }}</span>
          </template>
          <template v-else>
            Sin citas programadas
          </template>
        </dd>
      </div>
    </dl>
  </aside>
</template>

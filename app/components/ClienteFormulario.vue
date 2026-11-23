<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type {
  ActualizarCliente,
  CatalogosCliente,
  Cliente,
  CrearCliente
} from '~/types/cliente'
import { ApiError } from '~/utils/api-error'
import { mensajeDeCampo } from '~/utils/errores-api'
import { edadDesde, hoyISO } from '~/utils/fechas'

type Seccion = 'personales' | 'contacto' | 'previsionales' | 'objetivo'

// `secciones` permite usar el formulario por partes (los pasos del F0): solo se muestran, validan y envían
// los campos de esas secciones. `sinBotones` deja que quien lo usa ponga sus propios botones y llame a enviar().
const props = withDefaults(
  defineProps<{
    cliente: Cliente | null
    catalogos: CatalogosCliente
    secciones?: Seccion[]
    sinBotones?: boolean
  }>(),
  {
    secciones: () => ['personales', 'contacto', 'previsionales', 'objetivo'],
    sinBotones: false
  }
)
const emit = defineEmits<{ guardado: [cliente: Cliente], cancelar: [] }>()

const api = useClientes()
const formulario = useTemplateRef('formulario')
const enviando = ref(false)
const errorGeneral = ref<string | null>(null)
const editando = computed(() => props.cliente !== null)

const CURP = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z0-9]\d$/
const ENTERO = /^\d+$/

const SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
  { valor: 'por_confirmar', etiqueta: 'Por confirmar' }
]
const ESTADOS_CIVILES = [
  { valor: 'soltero', etiqueta: 'Soltero(a)' },
  { valor: 'casado', etiqueta: 'Casado(a)' },
  { valor: 'divorciado', etiqueta: 'Divorciado(a)' },
  { valor: 'viudo', etiqueta: 'Viudo(a)' },
  { valor: 'concubinato', etiqueta: 'Concubinato' }
]
const SEXOS = [
  { valor: 'hombre', etiqueta: 'Hombre' },
  { valor: 'mujer', etiqueta: 'Mujer' }
]
const OBJETIVOS = [
  { valor: 'pensionarse_asap', etiqueta: 'Pensionarse lo antes posible' },
  {
    valor: 'mejorar_monto_pension',
    etiqueta: 'Mejorar el monto de la pensión'
  },
  { valor: 'negativa_pension', etiqueta: 'Negativa de pensión' }
]

const c = props.cliente
const estado = reactive<Record<string, string | number>>({
  nombre: c?.nombre ?? '',
  apellido_paterno: c?.apellido_paterno ?? '',
  apellido_materno: c?.apellido_materno ?? '',
  referido_por: c?.referido_por ?? '',
  telefono: c?.telefono ?? '',
  correo_electronico: c?.correo_electronico ?? '',
  fecha_ingreso: c?.fecha_ingreso.slice(0, 10) ?? hoyISO(),
  fecha_nacimiento: c?.fecha_nacimiento.slice(0, 10) ?? '',
  sexo: c?.sexo ?? '',
  estado_civil: c?.estado_civil ?? 'soltero',
  dependientes_economicos: String(c?.dependientes_economicos ?? 0),
  ocupacion: c?.ocupacion ?? '',
  curp: c?.curp ?? '',
  rfc: c?.rfc ?? '',
  nss: c?.nss ?? '',
  ine: c?.ine ?? '',
  domicilio: c?.domicilio ?? '',
  estado: c?.estado ?? '',
  regimen_id: c?.regimen_id ?? '',
  ley_probable_id: c?.ley_probable_id ?? '',
  afore_id: c?.afore_id ?? '',
  cambio_afore: c?.cambio_afore ?? 'por_confirmar',
  semanas_imss_reconocidas: String(c?.semanas_imss_reconocidas ?? 0),
  semanas_a_recuperar:
    c?.semanas_a_recuperar == null ? '' : String(c.semanas_a_recuperar),
  tiene_issste: c?.tiene_issste ?? 'por_confirmar',
  subdelegacion_imss_probable: c?.subdelegacion_imss_probable ?? '',
  requiere_contadora: c?.requiere_contadora ?? 'por_confirmar',
  objetivo_cliente: c?.objetivo_cliente ?? '',
  observaciones_generales: c?.observaciones_generales ?? ''
})
const CAMPOS = Object.keys(estado)

const CAMPOS_DE_SECCION: Record<Seccion, string[]> = {
  personales: [
    'nombre',
    'apellido_paterno',
    'apellido_materno',
    'fecha_nacimiento',
    'sexo',
    'estado_civil',
    'dependientes_economicos',
    'curp',
    'rfc',
    'nss',
    'ine'
  ],
  contacto: [
    'telefono',
    'correo_electronico',
    'fecha_ingreso',
    'domicilio',
    'estado',
    'referido_por',
    'ocupacion'
  ],
  previsionales: [
    'regimen_id',
    'ley_probable_id',
    'afore_id',
    'semanas_imss_reconocidas',
    'semanas_a_recuperar',
    'subdelegacion_imss_probable',
    'tiene_issste',
    'cambio_afore',
    'requiere_contadora'
  ],
  objetivo: ['objetivo_cliente', 'observaciones_generales']
}
const camposActivos = computed(
  () =>
    new Set(props.secciones.flatMap(seccion => CAMPOS_DE_SECCION[seccion]))
)
const activa = (seccion: Seccion) => props.secciones.includes(seccion)

// La edad se calcula con la fecha de nacimiento: no se captura.
const edad = computed(() => {
  const nacimiento = String(estado.fecha_nacimiento ?? '')
  return /^\d{4}-\d{2}-\d{2}$/.test(nacimiento)
    ? String(edadDesde(nacimiento))
    : ''
})
const texto = (campo: string) => String(estado[campo] ?? '').trim()

function validar(): FormError[] {
  const errores: FormError[] = []
  const falta = (campo: string, mensaje: string) => {
    if (!texto(campo)) errores.push({ name: campo, message: mensaje })
  }
  falta('nombre', 'Ingresa el nombre')
  falta('apellido_paterno', 'Ingresa el apellido paterno')
  falta('telefono', 'Ingresa el teléfono')
  falta('fecha_ingreso', 'Ingresa la fecha de ingreso')
  falta('fecha_nacimiento', 'Ingresa la fecha de nacimiento')
  falta('sexo', 'Elige el sexo')
  falta('regimen_id', 'Elige el régimen')
  falta('ley_probable_id', 'Elige la ley probable')
  falta('afore_id', 'Elige la AFORE')
  falta('objetivo_cliente', 'Elige el objetivo del cliente')

  const correo = texto('correo_electronico')
  if (!correo)
    errores.push({ name: 'correo_electronico', message: 'Ingresa el correo' })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    errores.push({
      name: 'correo_electronico',
      message: 'Ingresa un correo válido'
    })

  const curp = texto('curp').toUpperCase()
  if (curp && !CURP.test(curp))
    errores.push({
      name: 'curp',
      message: 'La CURP debe tener el formato oficial (18 caracteres)'
    })
  for (const [campo, maximo] of [
    ['rfc', 13],
    ['nss', 11],
    ['ine', 18]
  ] as const) {
    if (texto(campo).length > maximo)
      errores.push({
        name: campo,
        message: `No debe pasar de ${maximo} caracteres`
      })
  }
  for (const campo of ['dependientes_economicos', 'semanas_imss_reconocidas']) {
    if (!ENTERO.test(texto(campo)))
      errores.push({
        name: campo,
        message: 'Debe ser un número entero de 0 o más'
      })
  }
  if (
    texto('semanas_a_recuperar')
    && !ENTERO.test(texto('semanas_a_recuperar'))
  ) {
    errores.push({
      name: 'semanas_a_recuperar',
      message: 'Debe ser un número entero de 0 o más'
    })
  }
  return errores.filter(e => e.name && camposActivos.value.has(e.name))
}

function cuerpo(): CrearCliente {
  const datos = {
    nombre: texto('nombre'),
    apellido_paterno: texto('apellido_paterno'),
    apellido_materno: texto('apellido_materno'),
    referido_por: texto('referido_por'),
    telefono: texto('telefono'),
    correo_electronico: texto('correo_electronico'),
    fecha_ingreso: texto('fecha_ingreso'),
    fecha_nacimiento: texto('fecha_nacimiento'),
    sexo: estado.sexo,
    estado_civil: estado.estado_civil,
    dependientes_economicos: Number(texto('dependientes_economicos')),
    regimen_id: Number(estado.regimen_id),
    ley_probable_id: Number(estado.ley_probable_id),
    afore_id: Number(estado.afore_id),
    cambio_afore: estado.cambio_afore,
    semanas_imss_reconocidas: Number(texto('semanas_imss_reconocidas')),
    tiene_issste: estado.tiene_issste,
    requiere_contadora: estado.requiere_contadora,
    objetivo_cliente: estado.objetivo_cliente,
    // La API exige estos textos aunque vayan vacíos.
    domicilio: texto('domicilio'),
    estado: texto('estado'),
    subdelegacion_imss_probable: texto('subdelegacion_imss_probable'),
    observaciones_generales: texto('observaciones_generales')
  } as CrearCliente
  // Los opcionales vacíos no se envían.
  if (texto('curp')) datos.curp = texto('curp').toUpperCase()
  if (texto('rfc')) datos.rfc = texto('rfc').toUpperCase()
  if (texto('nss')) datos.nss = texto('nss')
  if (texto('ine')) datos.ine = texto('ine')
  if (texto('ocupacion')) datos.ocupacion = texto('ocupacion')
  if (texto('semanas_a_recuperar'))
    datos.semanas_a_recuperar = Number(texto('semanas_a_recuperar'))
  // Guardado parcial: solo viajan los campos de las secciones que muestra este formulario.
  return Object.fromEntries(
    Object.entries(datos).filter(([campo]) => camposActivos.value.has(campo))
  ) as CrearCliente
}

async function guardar(): Promise<boolean> {
  errorGeneral.value = null
  enviando.value = true
  try {
    const guardado = props.cliente
      ? await api.actualizar(props.cliente.id, cuerpo() as ActualizarCliente)
      : await api.crear(cuerpo())
    emit('guardado', guardado)
    return true
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    if (error.status === 409) {
      formulario.value?.setErrors([{ name: 'curp', message: error.mensaje }])
    } else if (
      error.status === 400
      && error.campos
      && Object.keys(error.campos).some(k => CAMPOS.includes(k))
    ) {
      formulario.value?.setErrors(
        Object.entries(error.campos)
          .filter(([campo]) => CAMPOS.includes(campo))
          .map(([campo, mensaje]) => ({
            name: campo,
            message: mensajeDeCampo(mensaje)
          }))
      )
    }
    // Sin conexión: useApi ya mostró el aviso.
    else if (error.status !== 0) {
      errorGeneral.value = 'No se pudo guardar. Inténtalo de nuevo.'
    }
    return false
  } finally {
    enviando.value = false
  }
}

// Para quien pone sus propios botones (los pasos del F0): valida y guarda; true si quedó guardado.
async function enviar(): Promise<boolean> {
  try {
    await formulario.value?.validate()
  } catch {
    return false
  }
  return guardar()
}
defineExpose({ enviar })

const claseSelect
  = 'w-full rounded-lg border border-marca-200 bg-white px-3 py-2.5 text-base text-neutral-900 focus:outline-2 focus:outline-marca-600'
const campo = 'w-full'
</script>

<template>
  <UForm
    ref="formulario"
    :state="estado"
    :validate="validar"
    novalidate
    class="space-y-8"
    @submit="guardar"
  >
    <fieldset
      v-if="activa('personales')"
      class="space-y-4"
    >
      <legend class="mb-2 font-display text-lg font-semibold text-profundo-900">
        Datos personales
      </legend>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="Nombre(s)"
          name="nombre"
          data-campo="nombre"
        >
          <UInput
            v-model="estado.nombre"
            name="nombre"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Apellido paterno"
          name="apellido_paterno"
          data-campo="apellido_paterno"
        >
          <UInput
            v-model="estado.apellido_paterno"
            name="apellido_paterno"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Apellido materno"
          name="apellido_materno"
          data-campo="apellido_materno"
        >
          <UInput
            v-model="estado.apellido_materno"
            name="apellido_materno"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <UFormField
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          data-campo="fecha_nacimiento"
        >
          <UInput
            v-model="estado.fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Edad"
          hint="Calculada"
          data-campo="edad"
        >
          <UInput
            :model-value="edad"
            name="edad"
            readonly
            tabindex="-1"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Sexo"
          name="sexo"
          data-campo="sexo"
        >
          <select
            v-model="estado.sexo"
            name="sexo"
            :class="claseSelect"
          >
            <option value="">
              Selecciona…
            </option>
            <option
              v-for="o in SEXOS"
              :key="o.valor"
              :value="o.valor"
            >
              {{ o.etiqueta }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="Estado civil"
          name="estado_civil"
          data-campo="estado_civil"
        >
          <select
            v-model="estado.estado_civil"
            name="estado_civil"
            :class="claseSelect"
          >
            <option
              v-for="o in ESTADOS_CIVILES"
              :key="o.valor"
              :value="o.valor"
            >
              {{ o.etiqueta }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="Dependientes económicos"
          name="dependientes_economicos"
          data-campo="dependientes_economicos"
        >
          <UInput
            v-model="estado.dependientes_economicos"
            name="dependientes_economicos"
            inputmode="numeric"
            :class="campo"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UFormField
          label="CURP"
          name="curp"
          data-campo="curp"
        >
          <UInput
            v-model="estado.curp"
            name="curp"
            autocomplete="off"
            maxlength="18"
            class="w-full uppercase"
          />
        </UFormField>
        <UFormField
          label="RFC"
          name="rfc"
          data-campo="rfc"
        >
          <UInput
            v-model="estado.rfc"
            name="rfc"
            autocomplete="off"
            class="w-full uppercase"
          />
        </UFormField>
        <UFormField
          label="NSS"
          name="nss"
          data-campo="nss"
        >
          <UInput
            v-model="estado.nss"
            name="nss"
            autocomplete="off"
            inputmode="numeric"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="INE"
          name="ine"
          data-campo="ine"
        >
          <UInput
            v-model="estado.ine"
            name="ine"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
      </div>
    </fieldset>

    <fieldset
      v-if="activa('contacto')"
      class="space-y-4"
    >
      <legend class="mb-2 font-display text-lg font-semibold text-profundo-900">
        Contacto y registro
      </legend>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="Teléfono"
          name="telefono"
          data-campo="telefono"
        >
          <UInput
            v-model="estado.telefono"
            name="telefono"
            type="tel"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Correo electrónico"
          name="correo_electronico"
          data-campo="correo_electronico"
        >
          <UInput
            v-model="estado.correo_electronico"
            name="correo_electronico"
            type="email"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Fecha de ingreso"
          name="fecha_ingreso"
          data-campo="fecha_ingreso"
        >
          <UInput
            v-model="estado.fecha_ingreso"
            name="fecha_ingreso"
            type="date"
            :class="campo"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="Domicilio"
          name="domicilio"
          data-campo="domicilio"
          class="md:col-span-2"
        >
          <UInput
            v-model="estado.domicilio"
            name="domicilio"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Estado"
          name="estado"
          data-campo="estado"
        >
          <UInput
            v-model="estado.estado"
            name="estado"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <UFormField
          label="Referido por"
          name="referido_por"
          data-campo="referido_por"
        >
          <UInput
            v-model="estado.referido_por"
            name="referido_por"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Ocupación"
          name="ocupacion"
          data-campo="ocupacion"
        >
          <UInput
            v-model="estado.ocupacion"
            name="ocupacion"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
      </div>
    </fieldset>

    <fieldset
      v-if="activa('previsionales')"
      class="space-y-4"
    >
      <legend class="mb-2 font-display text-lg font-semibold text-profundo-900">
        Datos previsionales
      </legend>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="Régimen"
          name="regimen_id"
          data-campo="regimen_id"
        >
          <select
            v-model.number="estado.regimen_id"
            name="regimen_id"
            :class="claseSelect"
          >
            <option value="">
              Selecciona…
            </option>
            <option
              v-for="r in catalogos.regimenes"
              :key="r.id"
              :value="r.id"
            >
              {{ r.nombre }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="Ley probable"
          name="ley_probable_id"
          data-campo="ley_probable_id"
        >
          <select
            v-model.number="estado.ley_probable_id"
            name="ley_probable_id"
            :class="claseSelect"
          >
            <option value="">
              Selecciona…
            </option>
            <option
              v-for="l in catalogos.leyesProbables"
              :key="l.id"
              :value="l.id"
            >
              {{ l.nombre }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="AFORE"
          name="afore_id"
          data-campo="afore_id"
        >
          <select
            v-model.number="estado.afore_id"
            name="afore_id"
            :class="claseSelect"
          >
            <option value="">
              Selecciona…
            </option>
            <option
              v-for="a in catalogos.afores"
              :key="a.id"
              :value="a.id"
            >
              {{ a.nombre }}
            </option>
          </select>
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="Semanas IMSS reconocidas"
          name="semanas_imss_reconocidas"
          data-campo="semanas_imss_reconocidas"
        >
          <UInput
            v-model="estado.semanas_imss_reconocidas"
            name="semanas_imss_reconocidas"
            inputmode="numeric"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Semanas a recuperar"
          name="semanas_a_recuperar"
          data-campo="semanas_a_recuperar"
        >
          <UInput
            v-model="estado.semanas_a_recuperar"
            name="semanas_a_recuperar"
            inputmode="numeric"
            :class="campo"
          />
        </UFormField>
        <UFormField
          label="Subdelegación IMSS probable"
          name="subdelegacion_imss_probable"
          data-campo="subdelegacion_imss_probable"
        >
          <UInput
            v-model="estado.subdelegacion_imss_probable"
            name="subdelegacion_imss_probable"
            autocomplete="off"
            :class="campo"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField
          label="¿Tiene ISSSTE?"
          name="tiene_issste"
          data-campo="tiene_issste"
        >
          <select
            v-model="estado.tiene_issste"
            name="tiene_issste"
            :class="claseSelect"
          >
            <option
              v-for="o in SI_NO"
              :key="o.valor"
              :value="o.valor"
            >
              {{ o.etiqueta }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="¿Cambio de AFORE?"
          name="cambio_afore"
          data-campo="cambio_afore"
        >
          <select
            v-model="estado.cambio_afore"
            name="cambio_afore"
            :class="claseSelect"
          >
            <option
              v-for="o in SI_NO"
              :key="o.valor"
              :value="o.valor"
            >
              {{ o.etiqueta }}
            </option>
          </select>
        </UFormField>
        <UFormField
          label="¿Requiere contadora?"
          name="requiere_contadora"
          data-campo="requiere_contadora"
        >
          <select
            v-model="estado.requiere_contadora"
            name="requiere_contadora"
            :class="claseSelect"
          >
            <option
              v-for="o in SI_NO"
              :key="o.valor"
              :value="o.valor"
            >
              {{ o.etiqueta }}
            </option>
          </select>
        </UFormField>
      </div>
    </fieldset>

    <fieldset
      v-if="activa('objetivo')"
      class="space-y-4"
    >
      <legend class="mb-2 font-display text-lg font-semibold text-profundo-900">
        Objetivo
      </legend>
      <UFormField
        label="Objetivo del cliente"
        name="objetivo_cliente"
        data-campo="objetivo_cliente"
      >
        <select
          v-model="estado.objetivo_cliente"
          name="objetivo_cliente"
          :class="claseSelect"
        >
          <option value="">
            Selecciona…
          </option>
          <option
            v-for="o in OBJETIVOS"
            :key="o.valor"
            :value="o.valor"
          >
            {{ o.etiqueta }}
          </option>
        </select>
      </UFormField>
      <UFormField
        label="Observaciones generales"
        name="observaciones_generales"
        data-campo="observaciones_generales"
      >
        <UTextarea
          v-model="estado.observaciones_generales"
          name="observaciones_generales"
          :rows="3"
          :class="campo"
        />
      </UFormField>
    </fieldset>

    <p
      v-if="errorGeneral"
      role="alert"
      class="text-sm font-medium text-red-700"
    >
      {{ errorGeneral }}
    </p>

    <div
      v-if="!sinBotones"
      class="flex justify-end gap-3 border-t border-neutral-200 pt-4"
    >
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        data-accion="cancelar"
        @click="emit('cancelar')"
      >
        Cancelar
      </UButton>
      <UButton
        type="submit"
        :loading="enviando"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
      >
        {{ editando ? "Guardar cambios" : "Registrar cliente" }}
      </UButton>
    </div>
  </UForm>
</template>

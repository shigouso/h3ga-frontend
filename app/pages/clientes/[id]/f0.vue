<script setup lang="ts">
import type { DocumentoCliente, TipoDocumento } from '~/types/expediente'
import type { Correccion, HistorialLaboral, InformacionIssste, ObjetivoEspecifico, TipoCorreccion } from '~/types/f0'
import { formatearFechaCorta } from '~/utils/fechas'
import { puede } from '~/utils/permisos'

definePageMeta({ titulo: 'Diagnósticos y expedientes' })

const PASOS = [
  { titulo: 'Datos generales del cliente', subtitulo: 'Información de identificación del cliente' },
  { titulo: 'Documentación inicial', subtitulo: 'Marca los documentos que ya se recibieron' },
  { titulo: 'Diagnóstico inicial', subtitulo: 'Objetivo y estrategias aplicables' },
  { titulo: 'Correcciones y validaciones', subtitulo: 'Trámites previos al diagnóstico' },
  { titulo: 'Historial laboral', subtitulo: 'Semanas, salario y vigencia de derechos' },
  { titulo: 'Observaciones generales', subtitulo: '' },
]

const ruta = useRoute()
const id = String(ruta.params.id)
const sesion = useSessionStore()
const toast = useToast()
const api = useApi()

// El Auxiliar no puede leer historial laboral ni objetivos: su vista del cliente es el expediente.
const permitido = sesion.usuario ? puede(sesion.usuario.rol, 'f0.ver') : false
if (!permitido) await navigateTo(`/clientes/${id}`)
const puedeF1 = sesion.usuario ? puede(sesion.usuario.rol, 'f1.ver') : false
const soloLectura = computed(() => !(sesion.usuario && puede(sesion.usuario.rol, 'clientes.editar')))

const { cliente, etapas, catalogos, documentos, cargando, estado, asesorNombre, cargar, cargarDocumentos } = useExpediente(id)

// Lo que solo necesita el F0: historial laboral, ISSSTE, objetivos y tipos de documento. Si algo falla, el
// paso correspondiente se muestra vacío (useApi ya avisó los 403 y los errores de red).
const historial = ref<HistorialLaboral | null | undefined>(null)
const issste = ref<InformacionIssste | null | undefined>(null)
const catalogoObjetivos = ref<ObjetivoEspecifico[]>([])
const marcados = ref<number[]>([])
const tipos = ref<TipoDocumento[]>([])
const tiposCorreccion = ref<TipoCorreccion[]>([])
const correcciones = ref<Correccion[]>([])
// Si no se pueden leer las correcciones (p. ej. el Supervisor no tiene permiso) no se ofrece la tabla: guardarla sin
// conocer lo que ya existe crearía duplicados.
const correccionesDisponibles = ref(true)
const extrasCargando = ref(true)

async function cargarExtras() {
  const historialApi = useHistorialLaboral(id)
  const objetivosApi = useObjetivos(id)
  function leer<T>(promesa: Promise<T>, asignar: (valor: T) => void) {
    return promesa.then(asignar).catch(() => undefined)
  }
  const correccionesApi = useCorrecciones(id)
  await Promise.all([
    leer(historialApi.obtener(), (v) => { historial.value = v }),
    leer(historialApi.obtenerIssste(), (v) => { issste.value = v }),
    leer(objetivosApi.catalogo(), (v) => { catalogoObjetivos.value = v }),
    leer(objetivosApi.marcados(), (v) => { marcados.value = v.map(m => m.objetivo_id) }),
    leer(useDocumentos().tipos(), (v) => { tipos.value = v }),
    leer(correccionesApi.tipos(), (v) => { tiposCorreccion.value = v }),
    correccionesApi.listar().then((v) => { correcciones.value = v }).catch(() => { correccionesDisponibles.value = false }),
  ])
  extrasCargando.value = false
}
if (permitido) onMounted(cargarExtras)

const cargandoTodo = computed(() => cargando.value || (permitido && extrasCargando.value))

const paso = ref(Math.min(Math.max(Number(ruta.query.paso) || 1, 1), PASOS.length))
const pasoActual = useTemplateRef<{ enviar: () => Promise<boolean> }>('pasoActual')

const avance = computed(() => etapas.value?.etapas.find(e => e.numero_paso === 0)?.avance_porcentaje ?? 0)

// Guardado parcial: cada paso guarda solo lo suyo. En solo lectura no hay nada que guardar.
async function guardar(): Promise<boolean> {
  if (soloLectura.value) return true
  const guardado = (await pasoActual.value?.enviar()) ?? true
  if (guardado) toast.add({ title: 'Cambios guardados', color: 'success' })
  return guardado
}
async function continuar() {
  if (await guardar()) paso.value++
}

async function alSubirseDocumento(nuevo: DocumentoCliente) {
  // Un tipo de documento único reemplaza al anterior: se recarga la lista para reflejarlo.
  if (documentos.value.some(d => d.tipo_documento_id === nuevo.tipo_documento_id)) await cargarDocumentos()
  else documentos.value = [...documentos.value, nuevo]
}

async function descargarF0() {
  try {
    await api.descargar(`/clientes/${id}/diagnostico-inicial/pdf`, `F0-${id}.pdf`)
  }
  catch {
    // useApi ya avisó los 403 y los errores de red; los demás se muestran aquí.
    toast.add({ title: 'No se pudo descargar el formato F0', color: 'error' })
  }
}
</script>

<template>
  <section
    v-if="permitido"
    class="space-y-5"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        :to="`/clientes/${id}`"
        data-accion="regresar"
        class="inline-flex items-center gap-2 font-medium text-profundo-700 hover:underline"
      >
        <UIcon
          name="i-lucide-undo-2"
          class="size-5"
        />
        Regresar
      </NuxtLink>
      <div class="flex flex-wrap items-center gap-3">
        <UButton
          :to="`/clientes/${id}`"
          data-accion="ver-expediente"
          color="neutral"
          variant="outline"
          icon="i-lucide-eye"
          class="bg-white shadow-md"
        >
          Ver expediente
        </UButton>
        <UButton
          v-if="puedeF1"
          :to="`/clientes/${id}/f1`"
          data-accion="diagnostico-especializado"
          icon="i-lucide-clipboard-pen-line"
          class="bg-profundo-500 text-white"
        >
          Diagnóstico especializado
        </UButton>
      </div>
    </div>

    <p
      v-if="cargandoTodo"
      class="py-16 text-center text-neutral-500"
      role="status"
    >
      Cargando el diagnóstico…
    </p>

    <div
      v-else-if="estado === 'no-encontrado'"
      class="rounded-2xl bg-white p-10 text-center shadow-sm"
    >
      <h2 class="font-display text-2xl font-semibold text-profundo-900">
        Cliente no encontrado
      </h2>
    </div>

    <div
      v-else-if="estado === 'fallo' || !cliente || !catalogos"
      class="rounded-2xl bg-white p-10 text-center shadow-sm"
      role="alert"
    >
      <p class="text-red-700">
        No se pudo cargar el diagnóstico.
      </p>
      <UButton
        class="mt-3"
        color="neutral"
        variant="outline"
        data-accion="reintentar"
        @click="cargar"
      >
        Reintentar
      </UButton>
    </div>

    <template v-else>
      <div class="max-w-3xl rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <h2
            data-f0-titulo
            class="rounded-lg bg-marca-50 px-3 py-1 font-display text-3xl font-semibold text-profundo-700"
          >
            F0 → Diagnóstico inicial
          </h2>
          <p
            data-f0-avance
            class="font-display text-2xl text-marca-700"
          >
            {{ avance }}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Avance del diagnóstico inicial"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="avance"
          class="mt-3 h-2.5 overflow-hidden rounded-full bg-neutral-200"
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-marca-400 to-profundo-500"
            :style="{ width: `${avance}%` }"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-800">
          <span class="flex items-center gap-2">
            Fecha del diagnóstico:
            <span
              data-f0-fecha
              class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm"
            >
              <UIcon
                name="i-lucide-calendar"
                class="size-4"
              />{{ formatearFechaCorta(cliente.fecha_ingreso) }}
            </span>
          </span>
          <span
            v-if="asesorNombre"
            class="flex items-center gap-2"
          >
            Asesor responsable:
            <span
              data-f0-asesor
              class="inline-flex items-center gap-2 rounded-full border border-profundo-500 bg-marca-50 px-3 py-1 text-sm"
            >
              <UIcon
                name="i-lucide-user-round"
                class="size-4"
              />{{ asesorNombre }}
            </span>
          </span>
        </div>
        <UButton
          v-if="!soloLectura"
          data-accion="guardar"
          color="neutral"
          variant="outline"
          icon="i-lucide-save"
          size="lg"
          class="bg-white shadow-md"
          @click="guardar"
        >
          Guardar
        </UButton>
        <p
          v-else
          class="rounded-lg bg-neutral-200 px-3 py-1 text-sm text-neutral-700"
        >
          Solo lectura: solo el Asesor del cliente captura el diagnóstico.
        </p>
      </div>

      <ol
        class="flex flex-wrap gap-2"
        aria-label="Pasos del diagnóstico"
      >
        <li
          v-for="(p, i) in PASOS"
          :key="p.titulo"
          data-paso
          :aria-current="paso === i + 1 ? 'step' : undefined"
          class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
          :class="paso === i + 1 ? 'border-profundo-500 bg-profundo-500 text-white' : 'border-neutral-300 bg-white text-neutral-600'"
        >
          <span class="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">{{ i + 1 }}</span>
          {{ p.titulo }}
        </li>
      </ol>

      <div class="rounded-2xl bg-white shadow-sm">
        <div class="flex items-center gap-3 border-b border-neutral-200 p-5">
          <span class="flex size-9 items-center justify-center rounded-full bg-profundo-500 font-semibold text-white">{{ paso }}</span>
          <div>
            <h3 class="text-lg font-semibold text-profundo-900">
              {{ PASOS[paso - 1]!.titulo }}
            </h3>
            <p
              v-if="PASOS[paso - 1]!.subtitulo"
              class="text-sm text-neutral-600"
            >
              {{ PASOS[paso - 1]!.subtitulo }}
            </p>
          </div>
        </div>

        <fieldset
          :disabled="soloLectura"
          class="min-w-0 border-0 p-5"
        >
          <ClienteFormulario
            v-if="paso === 1"
            ref="pasoActual"
            :cliente="cliente"
            :catalogos="catalogos"
            :secciones="['personales', 'contacto', 'previsionales']"
            sin-botones
            @guardado="cliente = $event"
          />
          <F0Documentos
            v-else-if="paso === 2"
            ref="pasoActual"
            :cliente-id="id"
            :documentos="documentos"
            :tipos="tipos"
            @subido="alSubirseDocumento"
          />
          <F0Objetivos
            v-else-if="paso === 3"
            ref="pasoActual"
            :cliente="cliente"
            :catalogo="catalogoObjetivos"
            :marcados="marcados"
            @cliente="cliente = $event"
            @objetivos="marcados = $event"
          />
          <F0Correcciones
            v-else-if="paso === 4"
            ref="pasoActual"
            :cliente-id="id"
            :tipos="tiposCorreccion"
            :correcciones="correcciones"
            :disponible="correccionesDisponibles"
            @correcciones="correcciones = $event"
          />
          <F0HistorialLaboral
            v-else-if="paso === 5"
            ref="pasoActual"
            :cliente="cliente"
            :historial="historial"
            :issste="issste"
            @cliente="cliente = $event"
            @historial="historial = $event"
            @issste="issste = $event"
          />
          <F0Observaciones
            v-else
            ref="pasoActual"
            :cliente="cliente"
            @cliente="cliente = $event"
          />
        </fieldset>
      </div>

      <div class="flex justify-end gap-3">
        <UButton
          v-if="paso > 1"
          data-accion="retroceder"
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
          size="lg"
          class="bg-white shadow-md"
          @click="paso--"
        >
          Retroceder
        </UButton>
        <UButton
          v-if="paso < PASOS.length"
          data-accion="continuar"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          class="bg-acento-500 font-semibold text-profundo-900 shadow-md hover:bg-acento-400"
          @click="continuar"
        >
          Continuar
        </UButton>
        <UButton
          v-else
          data-accion="descargar-f0"
          icon="i-lucide-file-down"
          size="lg"
          class="bg-acento-500 font-semibold text-profundo-900 shadow-md hover:bg-acento-400"
          @click="descargarF0"
        >
          Descargar
        </UButton>
      </div>
    </template>
  </section>
</template>

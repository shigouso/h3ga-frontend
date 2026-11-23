<script setup lang="ts">
import type { RolCatalogo, TipoAsesor, Usuario } from '~/types/usuario'
import { normalizarTexto } from '~/utils/texto'
import { nombreRolVisible, ROL_ID } from '~/utils/roles'

definePageMeta({ titulo: 'Usuarios y roles' })

const POR_PAGINA = 10
const DESCRIPCION_ROL: Record<number, string> = {
  [ROL_ID.asesor]: 'Gestiona clientes, agenda y expedientes asignados.',
  [ROL_ID.auxiliar]: 'Captura documentos y da apoyo a los trámites.',
  [ROL_ID.supervisor]: 'Supervisa el avance, reportes y permisos del equipo.'
}
const ETIQUETA_ROL: Record<number, string> = {
  [ROL_ID.asesor]: 'bg-marca-100 text-marca-800',
  [ROL_ID.auxiliar]: 'bg-acento-100 text-acento-800',
  [ROL_ID.supervisor]: 'bg-profundo-500 text-white'
}

const sesion = useSessionStore()
const api = useUsuarios()
const toast = useToast()

const usuarios = ref<Usuario[]>([])
const roles = ref<RolCatalogo[]>([])
const tiposAsesor = ref<TipoAsesor[]>([])
const cargando = ref(true)
const falloCarga = ref(false)

const busqueda = ref('')
const filtroRol = ref<number | ''>('')
const filtroEstado = ref<'todos' | 'activos' | 'inactivos'>('todos')
const pagina = ref(1)

const formularioAbierto = ref(false)
const usuarioEnEdicion = ref<Usuario | null>(null)
const revocarAbierto = ref(false)
const porRevocar = ref<Usuario | null>(null)
const procesando = ref(false)

async function cargar() {
  cargando.value = true
  falloCarga.value = false
  try {
    const [lista, catalogos] = await Promise.all([
      api.listar(),
      api.catalogos()
    ])
    usuarios.value = lista
    roles.value = catalogos.roles
    tiposAsesor.value = catalogos.tiposAsesor
  } catch {
    // useApi ya avisó los 403 y los errores de red; aquí solo se deja de mostrar "cargando".
    falloCarga.value = true
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)

const nombreRol = (id: number) =>
  nombreRolVisible(roles.value.find(r => r.id === id)?.nombre ?? 'Sin rol')
const nombreCompleto = (u: Usuario) =>
  [u.nombre, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(' ')
const iniciales = (u: Usuario) =>
  `${u.nombre.charAt(0)}${u.apellido_paterno.charAt(0)}`.toUpperCase()
const esYo = (u: Usuario) => u.id === sesion.usuario?.id

const tarjetas = computed(() =>
  roles.value.map((rol) => {
    const delRol = usuarios.value.filter(u => u.rol_id === rol.id)
    return {
      rol,
      activos: delRol.filter(u => u.activo).length,
      total: delRol.length
    }
  })
)

const filtrados = computed(() => {
  const texto = normalizarTexto(busqueda.value)
  return usuarios.value.filter((u) => {
    if (filtroRol.value !== '' && u.rol_id !== filtroRol.value) return false
    if (filtroEstado.value === 'activos' && !u.activo) return false
    if (filtroEstado.value === 'inactivos' && u.activo) return false
    return (
      !texto
      || normalizarTexto(`${nombreCompleto(u)} ${u.correo_electronico}`).includes(
        texto
      )
    )
  })
})
const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(filtrados.value.length / POR_PAGINA))
)
const visibles = computed(() =>
  filtrados.value.slice(
    (pagina.value - 1) * POR_PAGINA,
    pagina.value * POR_PAGINA
  )
)
watch([busqueda, filtroRol, filtroEstado], () => {
  pagina.value = 1
})

function reemplazar(actualizado: Usuario) {
  const i = usuarios.value.findIndex(u => u.id === actualizado.id)
  if (i >= 0) usuarios.value[i] = actualizado
  else
    usuarios.value = [...usuarios.value, actualizado].sort((a, b) =>
      a.correo_electronico.localeCompare(b.correo_electronico)
    )
}

function abrirAlta() {
  usuarioEnEdicion.value = null
  formularioAbierto.value = true
}
function abrirEdicion(usuario: Usuario) {
  usuarioEnEdicion.value = usuario
  formularioAbierto.value = true
}
function alGuardar(guardado: Usuario) {
  const eraAlta = usuarioEnEdicion.value === null
  reemplazar(guardado)
  formularioAbierto.value = false
  toast.add({
    title: eraAlta ? 'Usuario registrado' : 'Cambios guardados',
    description: nombreCompleto(guardado),
    color: 'success'
  })
}

function pedirRevocar(usuario: Usuario) {
  porRevocar.value = usuario
  revocarAbierto.value = true
}
async function cambiarEstado(usuario: Usuario, activo: boolean) {
  procesando.value = true
  try {
    reemplazar(
      activo
        ? await api.restablecer(usuario.id)
        : await api.desactivar(usuario.id)
    )
    toast.add({
      title: activo ? 'Acceso restablecido' : 'Permisos revocados',
      description: nombreCompleto(usuario),
      color: 'success'
    })
    revocarAbierto.value = false
  } catch {
    // useApi ya avisó los 403 y los errores de red; los demás se muestran aquí.
    toast.add({
      title: 'No se pudo completar la acción',
      description: 'Inténtalo de nuevo.',
      color: 'error'
    })
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-neutral-700">
        Administra usuarios, roles asignados y permisos de acceso a H3GA.
      </p>
      <UButton
        data-accion="nuevo"
        icon="i-lucide-plus"
        size="lg"
        class="bg-acento-500 font-semibold text-profundo-900 hover:bg-acento-400"
        @click="abrirAlta"
      >
        Nuevo usuario
      </UButton>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <article
        v-for="{ rol, activos, total } in tarjetas"
        :key="rol.id"
        data-tarjeta-rol
        class="rounded-xl border border-neutral-200 bg-white p-5"
      >
        <div class="flex items-center justify-between gap-3">
          <span
            data-etiqueta-rol
            class="inline-block whitespace-nowrap rounded-full px-3 py-0.5 text-sm font-semibold"
            :class="ETIQUETA_ROL[rol.id] ?? 'bg-neutral-100 text-neutral-700'"
          >{{ nombreRolVisible(rol.nombre) }}</span>
          <p class="whitespace-nowrap text-neutral-500">
            <span class="text-xl font-semibold text-neutral-900">{{
              activos
            }}</span>
            / {{ total }} activos
          </p>
        </div>
        <p class="mt-3 text-neutral-700">
          {{ rol.descripcion ?? DESCRIPCION_ROL[rol.id] ?? "" }}
        </p>
      </article>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white">
      <div class="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h2 class="text-lg font-semibold text-profundo-900">
            Usuarios del sistema
          </h2>
          <p class="text-sm text-neutral-500">
            Total: {{ usuarios.length }}
            {{ usuarios.length === 1 ? "usuario" : "usuarios" }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <UInput
            v-model="busqueda"
            type="search"
            name="buscar"
            icon="i-lucide-search"
            placeholder="Buscar usuario"
            aria-label="Buscar usuario"
            class="w-64"
          />
          <select
            v-model.number="filtroRol"
            name="filtro-rol"
            aria-label="Filtrar por rol"
            class="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">
              Todos los roles
            </option>
            <option
              v-for="rol in roles"
              :key="rol.id"
              :value="rol.id"
            >
              {{ nombreRolVisible(rol.nombre) }}
            </option>
          </select>
          <select
            v-model="filtroEstado"
            name="filtro-estado"
            aria-label="Filtrar por estado"
            class="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            <option value="todos">
              Todos los estados
            </option>
            <option value="activos">
              Activos
            </option>
            <option value="inactivos">
              Revocados
            </option>
          </select>
        </div>
      </div>

      <p
        v-if="cargando"
        class="border-t border-neutral-200 p-8 text-center text-neutral-500"
        role="status"
      >
        Cargando usuarios…
      </p>

      <div
        v-else-if="falloCarga"
        class="border-t border-neutral-200 p-8 text-center"
        role="alert"
      >
        <p class="text-red-700">
          No se pudieron cargar los usuarios.
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

      <p
        v-else-if="visibles.length === 0"
        class="border-t border-neutral-200 p-8 text-center text-neutral-500"
      >
        No hay usuarios que coincidan con la búsqueda.
      </p>

      <div
        v-else
        class="overflow-x-auto border-t border-neutral-200"
      >
        <table class="w-full text-left">
          <thead class="bg-neutral-50 text-sm text-profundo-700">
            <tr>
              <th class="px-5 py-3 font-medium">
                Usuario
              </th>
              <th class="px-5 py-3 font-medium">
                Correo electrónico
              </th>
              <th class="px-5 py-3 font-medium">
                Rol asignado
              </th>
              <th class="px-5 py-3 font-medium">
                Estado
              </th>
              <th class="px-5 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr
              v-for="usuario in visibles"
              :key="usuario.id"
            >
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-marca-100 font-semibold text-marca-800"
                  >{{ iniciales(usuario) }}</span>
                  <div>
                    <p class="font-semibold text-neutral-900">
                      {{ nombreCompleto(usuario) }}
                    </p>
                    <span
                      v-if="esYo(usuario)"
                      class="rounded bg-acento-500 px-1.5 text-xs font-semibold text-profundo-900"
                    >Tú</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3 text-sm text-neutral-700">
                {{ usuario.correo_electronico }}
              </td>
              <td class="px-5 py-3">
                <span
                  data-etiqueta-rol
                  class="inline-block whitespace-nowrap rounded-full px-3 py-0.5 text-sm font-semibold"
                  :class="
                    ETIQUETA_ROL[usuario.rol_id]
                      ?? 'bg-neutral-100 text-neutral-700'
                  "
                >{{ nombreRol(usuario.rol_id) }}</span>
              </td>
              <td class="px-5 py-3">
                <span
                  class="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-sm"
                  :class="
                    usuario.activo
                      ? 'border-green-700 text-green-700'
                      : 'border-red-600 text-red-600'
                  "
                >
                  <UIcon
                    :name="
                      usuario.activo
                        ? 'i-lucide-circle-check'
                        : 'i-lucide-circle-x'
                    "
                    class="size-4"
                  />
                  {{ usuario.activo ? "Activo" : "Revocado" }}
                </span>
              </td>
              <td class="px-5 py-3">
                <div class="flex justify-end gap-2">
                  <template v-if="usuario.activo">
                    <UButton
                      color="neutral"
                      variant="outline"
                      size="sm"
                      icon="i-lucide-pencil"
                      data-accion="editar"
                      :aria-label="`Editar a ${nombreCompleto(usuario)}`"
                      @click="abrirEdicion(usuario)"
                    >
                      Editar
                    </UButton>
                    <UButton
                      v-if="!esYo(usuario)"
                      color="error"
                      variant="soft"
                      size="sm"
                      icon="i-lucide-ban"
                      data-accion="revocar"
                      :aria-label="`Revocar a ${nombreCompleto(usuario)}`"
                      @click="pedirRevocar(usuario)"
                    >
                      Revocar
                    </UButton>
                  </template>
                  <UButton
                    v-else
                    size="sm"
                    icon="i-lucide-shield-check"
                    class="bg-profundo-500 text-white hover:bg-profundo-600"
                    data-accion="restablecer"
                    :loading="procesando"
                    :aria-label="`Restablecer a ${nombreCompleto(usuario)}`"
                    @click="cambiarEstado(usuario, true)"
                  >
                    Restablecer
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav
        v-if="!cargando && totalPaginas > 1"
        class="flex items-center justify-center gap-1 border-t border-neutral-200 p-4"
        aria-label="Paginación"
      >
        <button
          type="button"
          class="rounded border border-neutral-300 px-3 py-1 disabled:opacity-40"
          aria-label="Página anterior"
          :disabled="pagina === 1"
          @click="pagina--"
        >
          ‹
        </button>
        <button
          v-for="n in totalPaginas"
          :key="n"
          type="button"
          class="rounded border px-3 py-1"
          :class="
            n === pagina
              ? 'border-marca-500 bg-marca-500 text-white'
              : 'border-neutral-300'
          "
          :aria-current="n === pagina ? 'page' : undefined"
          @click="pagina = n"
        >
          {{ n }}
        </button>
        <button
          type="button"
          class="rounded border border-neutral-300 px-3 py-1 disabled:opacity-40"
          aria-label="Página siguiente"
          :disabled="pagina === totalPaginas"
          @click="pagina++"
        >
          ›
        </button>
      </nav>
    </div>

    <UModal
      v-model:open="formularioAbierto"
      :title="usuarioEnEdicion ? 'Editar usuario' : 'Nuevo usuario'"
      :description="
        usuarioEnEdicion
          ? nombreCompleto(usuarioEnEdicion)
          : 'Registra una cuenta y asígnale un rol.'
      "
    >
      <template #body>
        <UsuarioFormulario
          :key="usuarioEnEdicion?.id ?? 'nuevo'"
          :usuario="usuarioEnEdicion"
          :roles="roles"
          :tipos-asesor="tiposAsesor"
          @guardado="alGuardar"
          @cancelar="formularioAbierto = false"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="revocarAbierto"
      title="Revocar permisos"
      description="La cuenta se conserva; solo se bloquea el acceso."
    >
      <template #body>
        <p v-if="porRevocar">
          <strong>{{ nombreCompleto(porRevocar) }}</strong> dejará de poder
          iniciar sesión en H3GA. Sus clientes, citas y expedientes no se
          eliminan y podrás restablecer el acceso en cualquier momento.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            color="neutral"
            variant="outline"
            data-accion="cancelar-revocar"
            @click="revocarAbierto = false"
          >
            Cancelar
          </UButton>
          <UButton
            color="error"
            variant="soft"
            icon="i-lucide-ban"
            data-accion="confirmar-revocar"
            :loading="procesando"
            @click="porRevocar && cambiarEstado(porRevocar, false)"
          >
            Revocar permisos
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

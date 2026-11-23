<script setup lang="ts">
import { menuPara, SECCION_SISTEMA, type EntradaMenu } from '~/utils/menu'

const sesion = useSessionStore()
const route = useRoute()
const contraido = ref(false)
// Cerrar sesión pide confirmación: un clic sin querer no debe sacar a nadie.
const confirmarSalida = ref(false)

// Por debajo de `lg` (1024 px) el menú se contrae solo para dejar espacio al contenido;
// al volver a una pantalla ancha se expande. El botón del encabezado sigue funcionando.
onMounted(() => {
  const pantallaChica = window.matchMedia('(max-width: 1023.98px)')
  const ajustar = (e: { matches: boolean }) => {
    contraido.value = e.matches
  }
  ajustar(pantallaChica)
  pantallaChica.addEventListener('change', ajustar)
  onBeforeUnmount(() => pantallaChica.removeEventListener('change', ajustar))
})

const entradas = computed(() =>
  sesion.usuario ? menuPara(sesion.usuario.rol) : []
)
const ajustes = computed(() =>
  entradas.value.find(e => e.seccion === SECCION_SISTEMA)
)

// Las entradas de navegación, agrupadas por sección en el orden del menú.
const secciones = computed(() => {
  const grupos: { titulo: string, entradas: EntradaMenu[] }[] = []
  for (const entrada of entradas.value.filter(
    e => e.seccion !== SECCION_SISTEMA
  )) {
    const grupo = grupos.find(g => g.titulo === entrada.seccion)
    if (grupo) grupo.entradas.push(entrada)
    else grupos.push({ titulo: entrada.seccion, entradas: [entrada] })
  }
  return grupos
})

const titulo = computed(() =>
  typeof route.meta.titulo === 'string' ? route.meta.titulo : ''
)

function activa(ruta: string) {
  return ruta === '/'
    ? route.path === '/'
    : route.path === ruta || route.path.startsWith(`${ruta}/`)
}

const claseEnlace = (ruta: string) => [
  'flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-white',
  activa(ruta) ? 'bg-white/15 text-white' : 'text-neutral-300',
  contraido.value ? 'justify-center' : ''
]
</script>

<template>
  <div class="flex min-h-dvh bg-neutral-100">
    <aside
      class="sticky top-0 flex h-dvh shrink-0 flex-col bg-profundo-500 py-5 text-neutral-200 transition-[width] duration-200"
      :class="contraido ? 'w-[88px] items-center px-3' : 'w-[280px] px-5'"
    >
      <div class="flex justify-center">
        <img
          v-if="contraido"
          src="/img/logo-circular.png"
          alt="H3GA"
          class="h-12 w-12 object-contain"
        >
        <img
          v-else
          src="/img/logo-horizontal.png"
          alt="H3GA Seguros y Pensiones"
          class="h-12 object-contain"
        >
      </div>

      <hr class="my-5 w-full border-white/20">

      <nav
        class="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        :class="{ 'w-full': contraido }"
        aria-label="Menú principal"
      >
        <template
          v-for="(seccion, indice) in secciones"
          :key="seccion.titulo"
        >
          <p
            v-if="!contraido"
            data-seccion
            class="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-marca-300"
            :class="indice > 0 ? 'pt-4' : ''"
          >
            {{ seccion.titulo }}
          </p>
          <hr
            v-else-if="indice > 0"
            class="my-3 border-white/20"
          >
          <div class="space-y-1">
            <NuxtLink
              v-for="entrada in seccion.entradas"
              :key="entrada.ruta"
              :to="entrada.ruta"
              :class="claseEnlace(entrada.ruta)"
              :aria-label="contraido ? entrada.etiqueta : undefined"
              :title="contraido ? entrada.etiqueta : undefined"
              :aria-current="activa(entrada.ruta) ? 'page' : undefined"
            >
              <UIcon
                :name="entrada.icono"
                class="size-6 shrink-0"
              />
              <template v-if="!contraido">
                <span class="flex-1">{{ entrada.etiqueta }}</span>
                <AvisosBadge v-if="entrada.ruta === '/avisos'" />
              </template>
            </NuxtLink>
          </div>
        </template>
        <!-- Contraído, el contador también debe verse: se monta aparte para no perder el aviso. -->
        <div
          v-if="contraido && entradas.some((e) => e.ruta === '/avisos')"
          class="flex justify-center pt-1"
        >
          <AvisosBadge />
        </div>
      </nav>

      <div
        class="space-y-1 border-t border-white/20 pt-4"
        :class="{ 'w-full': contraido }"
      >
        <NuxtLink
          v-if="ajustes"
          :to="ajustes.ruta"
          :class="claseEnlace(ajustes.ruta)"
          :aria-label="contraido ? ajustes.etiqueta : undefined"
          :title="contraido ? ajustes.etiqueta : undefined"
        >
          <UIcon
            :name="ajustes.icono"
            class="size-6 shrink-0"
          />
          <span v-if="!contraido">{{ ajustes.etiqueta }}</span>
        </NuxtLink>
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
          :class="{ 'justify-center': contraido }"
          aria-label="Cerrar sesión"
          :title="contraido ? 'Cerrar sesión' : undefined"
          @click="confirmarSalida = true"
        >
          <UIcon
            name="i-lucide-log-out"
            class="size-6 shrink-0"
          />
          <span v-if="!contraido">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <UModal
      v-model:open="confirmarSalida"
      title="¿Quieres cerrar tu sesión?"
      description="Para volver a entrar tendrás que iniciar sesión de nuevo."
    >
      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            color="neutral"
            variant="outline"
            data-accion="cancelar-cerrar-sesion"
            @click="confirmarSalida = false"
          >
            Cancelar
          </UButton>
          <UButton
            data-accion="confirmar-cerrar-sesion"
            icon="i-lucide-log-out"
            class="bg-profundo-500 text-white hover:bg-profundo-600"
            @click="sesion.cerrarSesion()"
          >
            Sí, cerrar sesión
          </UButton>
        </div>
      </template>
    </UModal>

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-3"
      >
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-profundo-500 hover:bg-neutral-100"
            :aria-label="contraido ? 'Expandir menú' : 'Contraer menú'"
            :aria-expanded="!contraido"
            @click="contraido = !contraido"
          >
            <UIcon
              :name="
                contraido
                  ? 'i-lucide-panel-left-open'
                  : 'i-lucide-panel-left-close'
              "
              class="size-6"
            />
          </button>
          <h1
            class="truncate font-display text-2xl font-semibold leading-tight text-profundo-900"
          >
            {{ titulo }}
          </h1>
        </div>
        <div
          v-if="sesion.usuario"
          class="flex shrink-0 items-center gap-4"
        >
          <CampanaAvisos />
          <div class="text-right">
            <p class="font-semibold leading-tight text-profundo-900">
              {{ sesion.usuario.nombre }}
            </p>
            <span
              class="mt-0.5 inline-block rounded border border-profundo-500 px-2 text-xs capitalize text-profundo-500"
            >
              {{ sesion.usuario.rol }}
            </span>
          </div>
        </div>
      </header>

      <main class="min-w-0 flex-1 p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CatalogosCliente, Cliente } from '~/types/cliente'
import { puede } from '~/utils/permisos'

definePageMeta({ titulo: 'Nuevo cliente' })

const sesion = useSessionStore()
const api = useClientes()
const toast = useToast()

const catalogos = ref<CatalogosCliente | null>(null)
const falloCarga = ref(false)

// Solo el Asesor registra clientes; el menú no lo ofrece a los demás, pero se llega por la dirección.
const permitido = sesion.usuario ? puede(sesion.usuario.rol, 'clientes.crear') : false
if (!permitido) await navigateTo('/clientes')

async function cargar() {
  falloCarga.value = false
  try {
    catalogos.value = await api.catalogos()
  }
  catch {
    // useApi ya avisó los 403 y los errores de red.
    falloCarga.value = true
  }
}
if (permitido) onMounted(cargar)

function alGuardar(cliente: Cliente) {
  toast.add({ title: 'Cliente registrado', description: `${cliente.nombre} ${cliente.apellido_paterno}`, color: 'success' })
  return navigateTo('/clientes')
}
</script>

<template>
  <section
    v-if="permitido"
    class="mx-auto max-w-5xl space-y-6"
  >
    <div>
      <NuxtLink
        to="/clientes"
        class="inline-flex items-center gap-1 text-sm font-medium text-marca-700 hover:underline"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Regresar
      </NuxtLink>
      <p class="mt-2 text-neutral-700">
        Registra al cliente; el expediente queda a tu nombre.
      </p>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white p-6">
      <p v-if="falloCarga" class="text-center" role="alert">
        <span class="text-red-700">No se pudieron cargar los catálogos.</span>
        <UButton class="ml-3" color="neutral" variant="outline" data-accion="reintentar" @click="cargar">
          Reintentar
        </UButton>
      </p>
      <p v-else-if="!catalogos" class="text-center text-neutral-500" role="status">
        Cargando…
      </p>
      <ClienteFormulario
        v-else
        :cliente="null"
        :catalogos="catalogos"
        @guardado="alGuardar"
        @cancelar="navigateTo('/clientes')"
      />
    </div>
  </section>
</template>

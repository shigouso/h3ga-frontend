import { defineStore } from 'pinia'
import type { Aviso } from '~/types/aviso'
import { ApiError } from '~/utils/api-error'

// Cuántos avisos tiene pendientes el usuario: lo comparten el contador del menú y el Centro de avisos, para que baje al
// atender uno sin pedir la lista dos veces a la vez.
export const useAvisosStore = defineStore('avisos', () => {
  const api = useApi()
  const pendientes = ref(0)
  // Los avisos sin atender (los usa la campana del encabezado).
  const lista = ref<Aviso[]>([])
  let enCurso: Promise<void> | null = null

  function cargar(): Promise<void> {
    enCurso ??= (async () => {
      try {
        lista.value = await api.get<Aviso[]>('/avisos', {
          query: { atendido: false }
        })
        pendientes.value = lista.value.length
      } catch (error) {
        // Un fallo de avisos no debe romper el menú; useApi ya avisó si fue un problema de red o de permiso.
        if (!(error instanceof ApiError)) throw error
        lista.value = []
        pendientes.value = 0
      } finally {
        enCurso = null
      }
    })()
    return enCurso
  }

  // Marca un aviso como atendido y vuelve a leer la lista para que la campana y el contador se actualicen.
  async function atender(id: string): Promise<void> {
    await api.patch<Aviso>(`/avisos/${id}/atender`)
    await cargar()
  }

  return { pendientes, lista, cargar, atender }
})

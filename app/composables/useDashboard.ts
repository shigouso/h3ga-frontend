import type { DashboardResumen } from '~/types/dashboard'

// Filas máximas de cada lista que pide el Dashboard (el backend admite de 1 a 50); los totales siempre vienen completos.
const LIMITE = 50

// Datos del Dashboard: el backend entrega el resumen ya calculado y con el alcance del rol, en una sola petición.
export function useDashboard() {
  const api = useApi()

  const datos = ref<DashboardResumen | null>(null)
  const cargando = ref(true)
  const fallo = ref(false)

  async function cargar() {
    cargando.value = true
    fallo.value = false
    try {
      datos.value = await api.get<DashboardResumen>('/dashboard', {
        query: { limite: LIMITE }
      })
    } catch {
      // useApi ya avisó los 403 y los errores de red.
      fallo.value = true
    }
    cargando.value = false
  }

  return { datos, cargando, fallo, cargar }
}

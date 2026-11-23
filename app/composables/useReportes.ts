import type { PeriodoReporte, ReporteOperativo } from '~/types/reporte'

// Reporte operativo semanal o mensual (Asesor y Supervisor). El backend limita el alcance por rol: el Asesor ve sus
// clientes y el Supervisor todos, con el desglose por asesor.
export function useReportes() {
  const api = useApi()
  const consulta = (periodo: PeriodoReporte, fecha: string) =>
    `periodo=${periodo}&fecha=${fecha}`

  return {
    generar: (periodo: PeriodoReporte, fecha: string) =>
      api.get<ReporteOperativo>('/reportes', { query: { periodo, fecha } }),
    // Mismo periodo y fecha que la vista; el nombre del archivo lo da el backend.
    descargarPdf: (periodo: PeriodoReporte, fecha: string) =>
      api.descargar(
        `/reportes/pdf?${consulta(periodo, fecha)}`,
        `Reporte-operativo-${periodo}-${fecha}.pdf`
      )
  }
}

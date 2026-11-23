// Contrato de GET /reportes (reporte operativo, etapas 0 a 4). El Swagger del backend no lo describe campo por campo,
// así que se copia de `reportes/reporte-operativo.ts` del backend.
export type PeriodoReporte = 'semanal' | 'mensual' | 'trimestral'

export interface FilaCartera {
  numero_paso: number
  nombre: string
  total: number
  // Una clave por cada estatus (en el orden de `cartera.estatus`), aunque valga 0.
  por_estatus: Record<string, number>
}
export interface EtapaFinalizada {
  cliente: string
  numero_paso: number
  etapa: string
  fecha_completada: string
}
export interface EtapaPorVencer {
  cliente: string
  numero_paso: number
  etapa: string
  fecha_compromiso: string
  situacion: 'vencido' | 'por_vencer'
}
export interface CambioDeEstatus {
  cliente: string
  numero_paso: number
  etapa: string
  // null en el primer registro de la etapa.
  estatus_anterior: string | null
  estatus_nuevo: string
  fecha: string
  asesor: string
}
export interface AvanceDeAsesor {
  asesor_id: string
  asesor: string
  clientes: number
  avance_promedio: number
}

export interface ReporteOperativo {
  periodo: PeriodoReporte
  desde: string
  hasta: string
  hoy: string
  alcance: 'asesor' | 'supervisor'
  cartera: { estatus: string[], etapas: FilaCartera[] }
  finalizados: { total: number, lista: EtapaFinalizada[] }
  vencimientos: {
    vencidos: number
    por_vencer: number
    lista: EtapaPorVencer[]
  }
  // `tasa` es una fracción de 0 a 1.
  rechazo: {
    tasa: number
    bloqueos: number
    etapas_con_cambios: number
    motivos: { motivo: string, total: number }[]
  }
  clientes_nuevos: {
    total: number
    por_regimen: { regimen: string, total: number }[]
  }
  // Cambios de estatus del periodo, los más recientes primero (máximo 20; `total` cuenta todos).
  trazabilidad: { total: number, lista: CambioDeEstatus[] }
  // Solo para el Supervisor.
  por_asesor?: AvanceDeAsesor[]
}

import type { components } from '~~/types/api'

// Contratos del Diagnóstico Especializado F1, generados desde el Swagger del backend.
type S = components['schemas']
export type Diagnostico = S['DiagnosticoEspecializado']
// Las columnas son opcionales y aceptan null para borrar un valor.
export type ActualizarDiagnostico = {
  [K in keyof S['UpdateDiagnosticoEspecializadoDto']]?:
    S['UpdateDiagnosticoEspecializadoDto'][K] | null;
}
export type Escenario = S['EscenarioPension']
export type Accion = S['PlanAccion']
export type Periodo = S['PeriodoInconsistencia']

export interface ItemCatalogo {
  id: number
  nombre: string
}
// Elemento de una lista con "Otro: detalle" seleccionado en pantalla.
export interface Seleccion {
  id: number
  detalle: string
}
export type Registro = Record<string, unknown>

// Cuerpo del 409 al descargar el F1 incompleto.
export interface CampoFaltante {
  seccion: string
  campo: string
  etiqueta: string
}

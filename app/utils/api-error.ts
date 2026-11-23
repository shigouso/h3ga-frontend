// Error que lanza useApi() en cualquier respuesta de error. status 0 = sin respuesta (error de red).
export class ApiError extends Error {
  readonly status: number
  readonly mensaje: string
  readonly campos?: Record<string, string>
  // Cuerpo completo de la respuesta de error (p. ej. la lista `faltantes` del PDF del F1 incompleto).
  readonly detalle?: Record<string, unknown>

  constructor(
    status: number,
    mensaje: string,
    campos?: Record<string, string>,
    detalle?: Record<string, unknown>
  ) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.mensaje = mensaje
    this.campos = campos
    this.detalle = detalle
  }
}

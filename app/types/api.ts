/** Error HTTP normalizado para que las vistas manejen fallos sin depender de $fetch. */
export class ApiRequestError extends Error {
  readonly status: number | undefined
  readonly data: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.data = data
  }
}

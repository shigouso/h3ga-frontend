import { ApiError } from '~/utils/api-error'

type Consulta = Record<string, string | number | boolean | undefined>
interface OpcionesGet {
  query?: Consulta
}
interface RespuestaError {
  response?: { status?: number, _data?: unknown }
  data?: unknown
  statusCode?: number
}

const MENSAJE_RED
  = 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
const MENSAJE_SESION_INVALIDA
  = 'Tu sesión ya no es válida. Inicia sesión de nuevo.'
const MENSAJE_SIN_PERMISO = 'No tienes permiso para realizar esta acción.'

// Nest devuelve los errores de validación como ["campo debe ser ...", ...]: el primer término es el campo.
function camposDe(mensajes: string[]): Record<string, string> | undefined {
  const campos: Record<string, string> = {}
  for (const texto of mensajes) {
    const coincidencia = /^([a-z_][a-z0-9_.]*)\s+(.+)$/i.exec(texto)
    if (coincidencia) campos[coincidencia[1]!] = coincidencia[2]!
  }
  return Object.keys(campos).length > 0 ? campos : undefined
}

function nombreDeArchivo(cabecera: string | null): string | null {
  if (!cabecera) return null
  const codificado = /filename\*=UTF-8''([^;]+)/i.exec(cabecera)
  if (codificado) {
    try {
      return decodeURIComponent(codificado[1]!)
    } catch {
      return codificado[1]!
    }
  }
  return /filename="?([^";]+)"?/i.exec(cabecera)?.[1] ?? null
}

// Único punto de acceso a la API: agrega Authorization y centraliza los errores.
export function useApi() {
  const config = useRuntimeConfig()
  const sesion = useSessionStore()
  const toast = useToast()

  function aApiError(error: unknown): ApiError {
    const { response, data, statusCode } = (error ?? {}) as RespuestaError
    const status = response?.status ?? statusCode ?? 0

    if (status === 0) {
      toast.add({
        title: 'Sin conexión',
        description: MENSAJE_RED,
        color: 'error'
      })
      return new ApiError(0, MENSAJE_RED)
    }

    const cuerpo = (data ?? response?._data ?? {}) as {
      message?: string | string[]
    }
    const mensajes = Array.isArray(cuerpo.message) ? cuerpo.message : undefined
    const mensaje: string = typeof cuerpo.message === 'string'
      ? cuerpo.message
      : mensajes
        ? mensajes.join('; ')
        : `Error ${status}`

    if (status === 401 && sesion.token) {
      void sesion.cerrarSesion(MENSAJE_SESION_INVALIDA)
    } else if (status === 403) {
      toast.add({
        title: 'Sin permiso',
        description: MENSAJE_SIN_PERMISO,
        color: 'warning'
      })
    }

    return new ApiError(
      status,
      mensaje,
      status === 400 && mensajes ? camposDe(mensajes) : undefined,
      typeof cuerpo === 'object'
        ? (cuerpo as Record<string, unknown>)
        : undefined
    )
  }

  function exigirSesionVigente() {
    if (sesion.token && !sesion.verificarVigencia()) {
      void navigateTo('/login')
      throw new ApiError(401, MENSAJE_SESION_INVALIDA)
    }
  }

  function cabeceras(): Record<string, string> {
    return sesion.token ? { Authorization: `Bearer ${sesion.token}` } : {}
  }

  async function pedir<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    ruta: string,
    extra: { body?: unknown, query?: Consulta } = {}
  ): Promise<T> {
    exigirSesionVigente()
    try {
      return (await $fetch<T>(ruta, {
        baseURL: config.public.apiBase,
        method,
        headers: cabeceras(),
        ...extra
      } as Parameters<typeof $fetch>[1])) as T
    } catch (error) {
      throw aApiError(error)
    }
  }

  // Pide un archivo con el token y devuelve su contenido (para verlo o guardarlo).
  async function obtenerArchivo(
    ruta: string,
    nombreSugerido = 'descarga'
  ): Promise<{ blob: Blob, nombre: string }> {
    exigirSesionVigente()
    let respuesta
    try {
      respuesta = await $fetch.raw(ruta, {
        baseURL: config.public.apiBase,
        headers: cabeceras(),
        responseType: 'blob'
      })
    } catch (error) {
      // Con responseType 'blob' el cuerpo del error también llega como Blob: se lee para conservar el mensaje.
      const e = error as { response?: { _data?: unknown }, data?: unknown }
      if (e.response?._data instanceof Blob) {
        try {
          const cuerpo = JSON.parse(await e.response._data.text())
          e.response._data = cuerpo
          e.data = cuerpo
        } catch {
          // Si no es JSON se deja tal cual.
        }
      }
      throw aApiError(error)
    }
    return {
      blob: respuesta._data as Blob,
      nombre:
        nombreDeArchivo(respuesta.headers.get('content-disposition'))
        ?? nombreSugerido
    }
  }

  // Pide un archivo con el token y lo guarda con el nombre de Content-Disposition.
  async function descargar(ruta: string, nombreSugerido = 'descarga') {
    const { blob, nombre } = await obtenerArchivo(ruta, nombreSugerido)
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = nombre
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    // Se libera con un pequeño retraso: algunos navegadores cancelan la descarga si se revoca de inmediato.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return nombre
  }

  return {
    get: <T>(ruta: string, opciones: OpcionesGet = {}) =>
      pedir<T>('GET', ruta, { query: opciones.query }),
    post: <T>(ruta: string, cuerpo?: unknown) =>
      pedir<T>('POST', ruta, { body: cuerpo }),
    put: <T>(ruta: string, cuerpo?: unknown) =>
      pedir<T>('PUT', ruta, { body: cuerpo }),
    patch: <T>(ruta: string, cuerpo?: unknown) =>
      pedir<T>('PATCH', ruta, { body: cuerpo }),
    delete: <T = void>(ruta: string) => pedir<T>('DELETE', ruta),
    descargar,
    obtenerArchivo
  }
}

import { defineStore } from 'pinia'
import type { SesionRespuesta, UsuarioSesion } from '~/types/sesion'

// El token vive solo en memoria y sessionStorage: nunca en localStorage, en la URL ni en registros.
const CLAVE_ALMACEN = 'h3ga.sesion'
export const MENSAJE_SESION_VENCIDA
  = 'Tu sesión venció. Inicia sesión de nuevo.'

interface SesionGuardada {
  token: string
  usuario: UsuarioSesion
  expiraEn: number
}

function leerAlmacen(): SesionGuardada | null {
  try {
    const crudo = sessionStorage.getItem(CLAVE_ALMACEN)
    if (!crudo) return null
    const datos = JSON.parse(crudo) as Partial<SesionGuardada>
    if (
      typeof datos.token !== 'string'
      || !datos.usuario
      || typeof datos.expiraEn !== 'number'
    )
      return null
    return {
      token: datos.token,
      usuario: datos.usuario,
      expiraEn: datos.expiraEn
    }
  } catch {
    return null
  }
}

function escribirAlmacen(sesion: SesionGuardada | null) {
  try {
    if (sesion) sessionStorage.setItem(CLAVE_ALMACEN, JSON.stringify(sesion))
    else sessionStorage.removeItem(CLAVE_ALMACEN)
  } catch {
    // Sin sessionStorage la sesión sigue viviendo en memoria hasta recargar.
  }
}

export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(null)
  const usuario = ref<UsuarioSesion | null>(null)
  const expiraEn = ref<number | null>(null)
  const mensaje = ref<string | null>(null)
  let temporizador: ReturnType<typeof setTimeout> | null = null

  const estaVigente = computed(
    () =>
      token.value !== null
      && expiraEn.value !== null
      && Date.now() < expiraEn.value
  )

  function limpiar(motivo?: string) {
    if (temporizador) clearTimeout(temporizador)
    temporizador = null
    token.value = null
    usuario.value = null
    expiraEn.value = null
    mensaje.value = motivo ?? null
    escribirAlmacen(null)
  }

  function programarVencimiento() {
    if (temporizador) clearTimeout(temporizador)
    if (expiraEn.value === null) return
    temporizador = setTimeout(
      () => cerrarSesion(MENSAJE_SESION_VENCIDA),
      Math.max(0, expiraEn.value - Date.now())
    )
  }

  function establecer(datos: SesionGuardada) {
    token.value = datos.token
    usuario.value = datos.usuario
    expiraEn.value = datos.expiraEn
    mensaje.value = null
    escribirAlmacen(datos)
    programarVencimiento()
  }

  // Limpia la sesión y manda a /login (con el motivo para mostrarlo ahí).
  function cerrarSesion(motivo?: string) {
    limpiar(motivo)
    return navigateTo('/login')
  }

  // Comprueba el reloj en el momento; limpia (sin navegar) si venció. Quien llama decide la redirección.
  function verificarVigencia(): boolean {
    if (token.value === null) return false
    if (estaVigente.value) return true
    limpiar(MENSAJE_SESION_VENCIDA)
    return false
  }

  async function iniciarSesion(correo: string, contrasena: string) {
    const api = useApi()
    const respuesta = await api.post<SesionRespuesta>('/auth/login', {
      correo_electronico: correo,
      contrasena
    })
    establecer({
      token: respuesta.access_token,
      usuario: respuesta.usuario,
      expiraEn: Date.now() + respuesta.expires_in * 1000
    })
  }

  // Rehidrata al recargar la página; una sesión guardada que ya venció se descarta.
  const guardada = leerAlmacen()
  if (guardada && Date.now() < guardada.expiraEn) establecer(guardada)
  else if (guardada) escribirAlmacen(null)

  return {
    token,
    usuario,
    expiraEn,
    mensaje,
    estaVigente,
    iniciarSesion,
    cerrarSesion,
    verificarVigencia
  }
})

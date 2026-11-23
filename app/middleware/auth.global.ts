import { rutaPermitida } from '~/utils/permisos'

// Sin sesión: todo va a /login. Con sesión: /login y las rutas que el rol no tiene van al inicio ('/'),
// que cualquier rol puede ver, así que nunca hay un bucle de redirecciones.
export default defineNuxtRouteMiddleware((to) => {
  const sesion = useSessionStore()
  const hayRol = sesion.verificarVigencia() ? sesion.usuario?.rol : undefined

  if (!hayRol) {
    return to.path === '/login' ? undefined : navigateTo('/login')
  }
  if (to.path === '/login' || !rutaPermitida(hayRol, to.path)) {
    return navigateTo('/')
  }
})

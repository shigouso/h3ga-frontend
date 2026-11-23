import type {
  ActualizarUsuario,
  CrearUsuario,
  RolCatalogo,
  TipoAsesor,
  Usuario
} from '~/types/usuario'

// Usuarios y catálogos de roles y tipos de asesor (solo el Supervisor administra usuarios).
export function useUsuarios() {
  const api = useApi()

  return {
    listar: () => api.get<Usuario[]>('/usuarios'),
    crear: (datos: CrearUsuario) => api.post<Usuario>('/usuarios', datos),
    actualizar: (id: string, datos: ActualizarUsuario) =>
      api.patch<Usuario>(`/usuarios/${id}`, datos),
    // "Revocar" bloquea el acceso sin borrar la cuenta; "restablecer" lo devuelve.
    desactivar: (id: string) =>
      api.patch<Usuario>(`/usuarios/${id}`, { activo: false }),
    restablecer: (id: string) =>
      api.patch<Usuario>(`/usuarios/${id}`, { activo: true }),
    // Solo el Supervisor. Responde 204 sin cuerpo: no hay nada que leer.
    restablecerContrasena: (id: string, contrasena: string) =>
      api.patch<undefined>(`/usuarios/${id}/contrasena`, { contrasena }),
    async catalogos() {
      const [roles, tiposAsesor] = await Promise.all([
        api.get<RolCatalogo[]>('/catalogos/roles'),
        api.get<TipoAsesor[]>('/catalogos/tipos-asesor')
      ])
      return { roles, tiposAsesor }
    }
  }
}

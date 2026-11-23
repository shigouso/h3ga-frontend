/** Contrato de POST /api/auth/login. */
export interface LoginCredentials {
  correo_electronico: string
  contrasena: string
}

export interface LoginUser {
  id: string
  nombre: string
  apellido_paterno: string
  apellido_materno?: string | null
  correo_electronico: string
  rol_id: number
}

export interface LoginResponse {
  access_token: string
  usuario: LoginUser
}

/** Contrato de GET /api/auth/me. El backend obtiene el rol desde la sesión JWT. */
export interface CurrentUser extends LoginUser {
  activo: boolean
  roles: {
    nombre: string
  }
}

// Cuenta de la persona que tiene la sesión abierta (cualquier rol).
export function useCuenta() {
  const api = useApi()

  return {
    // 204 sin cuerpo. Con la contraseña actual incorrecta el backend responde 400 (no 401, para no cerrar la sesión).
    cambiarContrasena: (contrasenaActual: string, contrasenaNueva: string) =>
      api.patch<undefined>('/auth/contrasena', {
        contrasena_actual: contrasenaActual,
        contrasena_nueva: contrasenaNueva
      })
  }
}

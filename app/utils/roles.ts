// roles.id del backend (apps/api/src/common/auth/roles-sistema.ts): el único lugar que los relaciona con el rol del token.
export const ROL_ID = { asesor: 1, auxiliar: 2, supervisor: 3 } as const

// El catálogo llama "Supervisor Operativo (Admin)" al rol del supervisor; en pantalla va sin la aclaración.
export function nombreRolVisible(nombre: string): string {
  return nombre.replace(/\s*\(admin\)\s*$/i, '')
}

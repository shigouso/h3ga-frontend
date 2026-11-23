import type { Rol } from '~/types/sesion'

// El menú y el middleware ocultan lo que no corresponde, pero el backend es quien impone los permisos.
const RUTAS_POR_ROL: Record<Rol, string[]> = {
  // Fase 1 (clientes, agenda, avisos, reportes, usuarios) más las pantallas de los wireframes que
  // construye el resto del equipo (modalidades, diagnósticos, correcciones, etc.).
  asesor: [
    '/',
    '/clientes',
    '/agenda',
    '/avisos',
    '/reportes',
    '/pension-final',
    '/modalidades',
    '/servicios-complementarios',
    '/diagnosticos',
    '/correcciones',
    '/biblioteca',
    '/configuracion'
  ],
  auxiliar: [
    '/',
    '/clientes',
    '/agenda',
    '/avisos',
    '/gestion-documental',
    '/biblioteca',
    '/configuracion'
  ],
  supervisor: [
    '/',
    '/clientes',
    '/agenda',
    '/avisos',
    '/reportes',
    '/usuarios',
    '/formatos-institucionales',
    '/configuracion'
  ]
}

const ACCIONES_POR_ROL = {
  'clientes.crear': ['asesor'],
  'clientes.editar': ['asesor'],
  // Diagnóstico inicial F0: lo captura el Asesor y lo ve el Supervisor; el Auxiliar no puede leer historial ni objetivos.
  'f0.ver': ['asesor', 'supervisor'],
  // Diagnóstico especializado F1: solo el Asesor del cliente (las rutas del backend son solo de su rol).
  'f1.ver': ['asesor'],
  'clientes.reasignar': ['supervisor'],
  'etapas.cambiarEstatus': ['asesor'],
  'auxiliares.autorizar': ['asesor'],
  // Ver quién ayuda en un expediente: el Asesor dueño y el Supervisor (el Auxiliar no puede leer la lista).
  'auxiliares.ver': ['asesor', 'supervisor'],
  'documentos.subir': ['asesor', 'auxiliar'],
  'documentos.revisar': ['asesor', 'auxiliar'],
  'agenda.escribir': ['asesor'],
  'reportes.ver': ['asesor', 'supervisor'],
  'usuarios.administrar': ['supervisor']
} as const satisfies Record<string, readonly Rol[]>

export type Accion = keyof typeof ACCIONES_POR_ROL

export function rutasPermitidas(rol: Rol): string[] {
  return [...RUTAS_POR_ROL[rol]]
}

// '/clientes' permite también '/clientes/123'; '/' solo permite el inicio.
export function rutaPermitida(rol: Rol, ruta: string): boolean {
  return RUTAS_POR_ROL[rol].some(
    base => ruta === base || (base !== '/' && ruta.startsWith(`${base}/`))
  )
}

export function puede(rol: Rol, accion: Accion): boolean {
  return (ACCIONES_POR_ROL[accion] as readonly Rol[]).includes(rol)
}

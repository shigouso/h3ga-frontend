import type { Rol } from '~/types/sesion'
import { rutasPermitidas } from '~/utils/permisos'

export interface EntradaMenu {
  etiqueta: string
  ruta: string
  icono: string
  seccion: string
}

// Sección de la configuración: el diseño la dibuja abajo, junto a "Cerrar sesión", no en la navegación.
export const SECCION_SISTEMA = 'Sistema'

// Todas las entradas posibles, en el orden en que se dibujan. Los iconos son de Lucide (icones.js.org).
// Un rol ve la entrada solo si permisos.ts le permite la ruta: el menú no puede ofrecer una ruta que el
// middleware rechazaría, ni dejar fuera una que el rol sí tiene.
const ENTRADAS: EntradaMenu[] = [
  {
    etiqueta: 'Inicio',
    ruta: '/',
    icono: 'i-lucide-layout-dashboard',
    seccion: 'General'
  },
  {
    etiqueta: 'Clientes',
    ruta: '/clientes',
    icono: 'i-lucide-users',
    seccion: 'General'
  },
  {
    etiqueta: 'Agenda y citas',
    ruta: '/agenda',
    icono: 'i-lucide-calendar-days',
    seccion: 'General'
  },
  {
    etiqueta: 'Centro de avisos',
    ruta: '/avisos',
    icono: 'i-lucide-bell',
    seccion: 'General'
  },
  {
    etiqueta: 'Reportes',
    ruta: '/reportes',
    icono: 'i-lucide-file-chart-pie',
    seccion: 'General'
  },
  {
    etiqueta: 'Usuarios y roles',
    ruta: '/usuarios',
    icono: 'i-lucide-user-cog',
    seccion: 'General'
  },
  {
    etiqueta: 'Pensión final',
    ruta: '/pension-final',
    icono: 'i-lucide-flag',
    seccion: 'Estrategias y servicios'
  },
  {
    etiqueta: 'Modalidades',
    ruta: '/modalidades',
    icono: 'i-lucide-briefcase-business',
    seccion: 'Estrategias y servicios'
  },
  {
    etiqueta: 'Servicios complementarios',
    ruta: '/servicios-complementarios',
    icono: 'i-lucide-puzzle',
    seccion: 'Estrategias y servicios'
  },
  {
    etiqueta: 'Diagnósticos',
    ruta: '/diagnosticos',
    icono: 'i-lucide-clipboard-pen-line',
    seccion: 'Diagnósticos y trámites'
  },
  {
    etiqueta: 'Correcciones',
    ruta: '/correcciones',
    icono: 'i-lucide-file-cog',
    seccion: 'Diagnósticos y trámites'
  },
  {
    etiqueta: 'Gestión Documental',
    ruta: '/gestion-documental',
    icono: 'i-lucide-folder-open',
    seccion: 'Otros'
  },
  {
    etiqueta: 'Formatos institucionales',
    ruta: '/formatos-institucionales',
    icono: 'i-lucide-landmark',
    seccion: 'Otros'
  },
  {
    etiqueta: 'Biblioteca',
    ruta: '/biblioteca',
    icono: 'i-lucide-book-open',
    seccion: 'Otros'
  },
  {
    etiqueta: 'Configuración del Sistema',
    ruta: '/configuracion',
    icono: 'i-lucide-settings',
    seccion: SECCION_SISTEMA
  }
]

// El menú oculta lo que no corresponde al rol, pero el backend es quien impone los permisos.
export function menuPara(rol: Rol): EntradaMenu[] {
  const permitidas = rutasPermitidas(rol)
  return ENTRADAS.filter(entrada => permitidas.includes(entrada.ruta))
}

// Primera pantalla de trabajo de cada rol: la primera entrada del menú que no es el inicio.
export function rutaInicio(rol: Rol): string {
  return menuPara(rol).find(entrada => entrada.ruta !== '/')?.ruta ?? '/'
}

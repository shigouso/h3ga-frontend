import { defineStore } from 'pinia'

// Preferencias de la persona en este navegador (no están en la base de datos): se guardan en localStorage.
const CLAVE = 'h3ga.preferencias'

interface Preferencias {
  sonidoCampana: boolean
  movimientoCampana: boolean
}
const POR_OMISION: Preferencias = {
  sonidoCampana: true,
  movimientoCampana: true
}

function leer(): Preferencias {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return { ...POR_OMISION }
    const datos = JSON.parse(crudo) as Partial<Preferencias>
    return {
      sonidoCampana:
        typeof datos.sonidoCampana === 'boolean'
          ? datos.sonidoCampana
          : POR_OMISION.sonidoCampana,
      movimientoCampana:
        typeof datos.movimientoCampana === 'boolean'
          ? datos.movimientoCampana
          : POR_OMISION.movimientoCampana
    }
  } catch {
    return { ...POR_OMISION }
  }
}

export const usePreferenciasStore = defineStore('preferencias', () => {
  const inicial = leer()
  const sonidoCampana = ref(inicial.sonidoCampana)
  const movimientoCampana = ref(inicial.movimientoCampana)

  // Sin localStorage (modo privado, datos bloqueados) las preferencias valen solo mientras la pestaña siga abierta.
  watch([sonidoCampana, movimientoCampana], () => {
    try {
      localStorage.setItem(
        CLAVE,
        JSON.stringify({
          sonidoCampana: sonidoCampana.value,
          movimientoCampana: movimientoCampana.value
        })
      )
    } catch {
      // Se conservan en memoria.
    }
  })

  function restablecer() {
    sonidoCampana.value = POR_OMISION.sonidoCampana
    movimientoCampana.value = POR_OMISION.movimientoCampana
    try {
      localStorage.removeItem(CLAVE)
    } catch {
      // Nada que borrar.
    }
  }

  return { sonidoCampana, movimientoCampana, restablecer }
})

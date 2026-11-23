// Campanita del recordatorio: dos notas suaves generadas con Web Audio (sin archivo de audio que descargar).
// Los navegadores solo dejan sonar después de que la persona interactuó con la página; si no, no pasa nada.
export function reproducirCampana(): void {
  try {
    const Contexto
      = window.AudioContext
        ?? (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
    if (!Contexto) return
    const contexto = new Contexto()
    const nota = (frecuencia: number, inicio: number, duracion: number) => {
      const oscilador = contexto.createOscillator()
      const volumen = contexto.createGain()
      oscilador.type = 'sine'
      oscilador.frequency.value = frecuencia
      // Sube rápido y se apaga despacio, para que suene a campanita y no a pitido.
      volumen.gain.setValueAtTime(0.0001, contexto.currentTime + inicio)
      volumen.gain.exponentialRampToValueAtTime(
        0.18,
        contexto.currentTime + inicio + 0.02
      )
      volumen.gain.exponentialRampToValueAtTime(
        0.0001,
        contexto.currentTime + inicio + duracion
      )
      oscilador.connect(volumen).connect(contexto.destination)
      oscilador.start(contexto.currentTime + inicio)
      oscilador.stop(contexto.currentTime + inicio + duracion)
    }
    nota(880, 0, 0.5)
    nota(1318.5, 0.18, 0.7)
    setTimeout(() => {
      void contexto.close()
    }, 1500)
  } catch {
    // Sin audio disponible la campana simplemente no suena.
  }
}

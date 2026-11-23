// Para buscar sin distinguir mayúsculas ni acentos ("Iván" coincide con "ivan").
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

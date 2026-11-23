// Nest (class-validator) devuelve los errores de validación en inglés: se traducen los más comunes
// para mostrarlos bajo cada campo.
export function mensajeDeCampo(texto: string): string {
  if (/formato de una CURP/i.test(texto))
    return 'La CURP no tiene el formato oficial (18 caracteres)'
  if (/must be an email/i.test(texto)) return 'Ingresa un correo válido'
  if (/should not be empty/i.test(texto)) return 'Este campo es obligatorio'
  const mas = /must be longer than or equal to (\d+) characters/i.exec(texto)
  if (mas) return `Debe tener al menos ${mas[1]} caracteres`
  const menos = /must be shorter than or equal to (\d+) characters/i.exec(
    texto
  )
  if (menos) return `No debe pasar de ${menos[1]} caracteres`
  return 'Valor no válido'
}

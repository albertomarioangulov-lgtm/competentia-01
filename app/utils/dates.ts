/**
 * Convierte una fecha a string YYYY-MM-DD para enviar como parámetro en requests.
 * Retorna undefined si la fecha es inválida.
 */
export const formatDateParam = (date: string | undefined): string | undefined => {
  if (!date) return undefined
  const d = new Date(date)
  if (isNaN(d.getTime())) return undefined
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

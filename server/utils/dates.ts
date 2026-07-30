/**
 * Ajusta una fecha al último milisegundo del día (23:59:59.999 UTC).
 * Útil para filtros de rango de fechas con $lte en MongoDB.
 */
export const getEndOfDay = (date: string): Date => {
  const endDate = new Date(date)
  endDate.setUTCHours(23, 59, 59, 999)
  return endDate
}
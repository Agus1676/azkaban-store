export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0'
  return `$${price.toLocaleString('es-AR')}`
}

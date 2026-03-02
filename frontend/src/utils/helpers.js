/**
 * Utilidad para manejar clases CSS dinámicas
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formatea un número como precio
 */
export function formatPrice(price) {
  return `$${price.toFixed(1)}`
}

/**
 * Formatea un valor en pesos colombianos (COP)
 */
export function formatCOP(value) {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Valida un email
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Valida un teléfono
 */
export function isValidPhone(phone) {
  const re = /^[\d\s\-+()]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Genera un slug a partir de un texto
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

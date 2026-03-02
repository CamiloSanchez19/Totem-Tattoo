/**
 * Utilidades de optimización del proyecto
 */

/**
 * Debounce para operaciones costosas
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle para eventos frecuentes
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Cache simple para resultados de funciones
 */
export const memoize = (fn) => {
  const cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    if (key in cache) return cache[key]
    const result = fn(...args)
    cache[key] = result
    return result
  }
}

/**
 * Carga de imágenes con lazy loading
 */
export const setupLazyImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })
    
    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img))
  }
}

/**
 * Preload de recursos críticos
 */
export const preloadResource = (href, type = 'script') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = type
  link.href = href
  document.head.appendChild(link)
}

/**
 * Prefetch de rutas futuras
 */
export const prefetchRoute = (href) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

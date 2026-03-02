import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook personalizado para manejar la navegación interna en una SPA
 * Intercepta los clics en enlaces <a> y los convierte en navegación de React Router
 * evitando las recargas de página completas
 * 
 * @example
 * function Layout({ children }) {
 *   useInternalLinks()
 *   return <div>{children}</div>
 * }
 */
export function useInternalLinks() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a')
      
      if (!target) return
      
      const href = target.getAttribute('href')
      
      // Solo interceptar enlaces internos que comienzan con /
      // Ignorar enlaces externos (//) y archivos estáticos
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        // Ignorar enlaces a archivos multimedia o documentos
        if (!href.match(/\.(jpg|jpeg|png|gif|svg|pdf|zip|mp4|webm)$/i)) {
          e.preventDefault()
          navigate(href)
        }
      }
    }

    // Usar event delegation para mejor rendimiento
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [navigate])
}

import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchPopup() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentQuery = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)

    return searchParams.get('q') || ''
  }, [location.search])

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const queryValue = String(formData.get('search-field') ?? '')
    const trimmedQuery = queryValue.trim()

    const targetUrl = trimmedQuery ? `/productos?q=${encodeURIComponent(trimmedQuery)}` : '/productos'

    navigate(targetUrl)
    document.body.classList.remove('search-active')
  }

  return (
    <div className="search-popup">
      <button className="close-search style-two" type="button" aria-label="Close search">
        <span className="icofont-brand-nexus"></span>
      </button>
      <button className="close-search" type="button" aria-label="Close search">
        <span className="icofont-arrow-up"></span>
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="search" 
            name="search-field" 
            placeholder="Buscar productos" 
            defaultValue={currentQuery}
            required 
            autoComplete="off"
          />
          <button type="submit" aria-label="Search">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchPopup

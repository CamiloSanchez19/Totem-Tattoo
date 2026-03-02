import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import { isAdminAuthenticated, loginAdmin } from '../config/adminApi'
import '../styles/styles.css'

function AdminLogin() {
  const navigate = useNavigate()
  const { showToast } = useToastContext()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCredentials((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!credentials.email.trim() || !credentials.password) {
      showToast('Ingresa correo y contraseña', 'warning', 2500)
      return
    }

    try {
      setIsSubmitting(true)
      await loginAdmin({
        email: credentials.email.trim(),
        password: credentials.password,
      })
      showToast('Bienvenido al panel administrativo', 'success', 2200)
      navigate('/admin', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'No fue posible iniciar sesión'
      showToast(message, 'error', 2800)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-head">
          <h1>Acceso administrativo</h1>
          <p>Ingresa con tus credenciales para gestionar reservas y productos.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              autoComplete="email"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" className="theme-btn btn-style-one admin-auth-submit" disabled={isSubmitting}>
            <span className="txt">{isSubmitting ? 'Ingresando...' : 'Entrar al dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
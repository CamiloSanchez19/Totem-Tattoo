import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import { useCart } from '../context/CartContext'
import { useToastContext } from '../context/ToastContext'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import { createPublicSale } from '../config/adminApi'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function Checkout() {
  useJQueryPlugins()
  const { cartItems, getSubtotal, clearCart } = useCart()
  const { showToast } = useToastContext()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 19)
    const groups = digits.match(/.{1,4}/g)
    return groups ? groups.join(' ') : ''
  }

  const formatCardExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  const formatCardCVC = (value) => value.replace(/\D/g, '').slice(0, 4)
  const formatPhone = (value) => value.replace(/[^\d+\s()-]/g, '').slice(0, 20)
  const formatPostalCode = (value) => value.replace(/[^A-Za-z0-9\s-]/g, '').slice(0, 10).toUpperCase()
  const formatOnlyLetters = (value) => value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]/g, '').replace(/\s{2,}/g, ' ')

  const isOnlyLetters = (value) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(value)
  const isValidAddress = (value) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s#.,-]+$/.test(value)

  const isValidLuhn = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '')
    let sum = 0
    let shouldDouble = false

    for (let i = digits.length - 1; i >= 0; i -= 1) {
      let digit = Number(digits.charAt(i))
      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      shouldDouble = !shouldDouble
    }

    return sum % 10 === 0
  }

  const isExpiryNotPast = (expiry) => {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry)
    if (!match) return false

    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    return year > currentYear || (year === currentYear && month >= currentMonth)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    }

    if (name === 'cardExpiry') {
      formattedValue = formatCardExpiry(value)
    }

    if (name === 'cardCVC') {
      formattedValue = formatCardCVC(value)
    }

    if (name === 'phone') {
      formattedValue = formatPhone(value)
    }

    if (name === 'zipCode') {
      formattedValue = formatPostalCode(value)
    }

    if (['firstName', 'lastName', 'city', 'state', 'cardName'].includes(name)) {
      formattedValue = formatOnlyLetters(value)
    }

    setValidationErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const validateForm = () => {
    const errors = {}

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'cardName',
      'cardNumber',
      'cardExpiry',
      'cardCVC',
    ]

    requiredFields.forEach((field) => {
      if (!String(formData[field] || '').trim()) {
        errors[field] = 'Este campo es obligatorio'
      }
    })

    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const city = formData.city.trim()
    const state = formData.state.trim()
    const cardName = formData.cardName.trim()
    const address = formData.address.trim()

    if (firstName && (!isOnlyLetters(firstName) || firstName.length < 2)) {
      errors.firstName = 'El nombre solo debe contener letras y mínimo 2 caracteres'
    }

    if (lastName && (!isOnlyLetters(lastName) || lastName.length < 2)) {
      errors.lastName = 'El apellido solo debe contener letras y mínimo 2 caracteres'
    }

    if (city && (!isOnlyLetters(city) || city.length < 2)) {
      errors.city = 'La ciudad solo debe contener letras y mínimo 2 caracteres'
    }

    if (state && (!isOnlyLetters(state) || state.length < 2)) {
      errors.state = 'Provincia/Estado solo debe contener letras y mínimo 2 caracteres'
    }

    if (cardName && (!isOnlyLetters(cardName) || cardName.length < 4)) {
      errors.cardName = 'El nombre de la tarjeta solo debe contener letras y apellidos válidos'
    }

    if (address && (!isValidAddress(address) || address.length < 6)) {
      errors.address = 'La dirección debe ser válida y tener al menos 6 caracteres'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un email válido'
    }

    const phoneDigits = (formData.phone || '').replace(/\D/g, '')
    if (formData.phone && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
      errors.phone = 'Ingresa un teléfono válido'
    }

    if (formData.zipCode && !/^[A-Z0-9\s-]{4,10}$/.test(formData.zipCode)) {
      errors.zipCode = 'Ingresa un código postal válido'
    }

    const rawCardNumber = (formData.cardNumber || '').replace(/\s+/g, '')
    if (rawCardNumber && (!/^\d{13,19}$/.test(rawCardNumber) || !isValidLuhn(rawCardNumber))) {
      errors.cardNumber = 'Ingresa un número de tarjeta válido'
    }

    if (formData.cardExpiry && !isExpiryNotPast(formData.cardExpiry)) {
      errors.cardExpiry = 'Fecha inválida o vencida. Usa MM/YY'
    }

    if (formData.cardCVC && !/^\d{3,4}$/.test(formData.cardCVC)) {
      errors.cardCVC = 'El CVC debe tener 3 o 4 dígitos'
    }

    return errors
  }

  const fieldClassName = (fieldName) => `form-group ${validationErrors[fieldName] ? 'has-error' : ''}`

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] || 'Revisa los campos del formulario'
      showToast(firstError, 'warning', 2800)
      return
    }

    const payload = {
      ...formData,
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }

    try {
      setIsSubmitting(true)
      const response = await createPublicSale(payload)
      setOrderId(response?.data?.id || null)
      setOrderPlaced(true)
      clearCart()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo procesar la venta. Verifica el stock e intenta de nuevo.'
      showToast(message, 'error', 3200)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <PageTitle 
          title="Pago" 
          breadcrumbs={[
          ]} 
        />
        <section className="checkout-section">
          <div className="auto-container">
            <div className="empty-cart-message">
              <h3>Tu carrito está vacío</h3>
              <p>No puedes proceder al pago sin productos en tu carrito.</p>
              <Link to="/productos" className="theme-btn">
                Volver a Productos
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  if (orderPlaced) {
    return (
      <Layout>
        <PageTitle 
          title="Pedido Confirmado" 
          breadcrumbs={[
          ]} 
        />
        <section className="checkout-section">
          <div className="auto-container">
            <div className="order-confirmation">
              <div className="success-icon">
                <i className="fa fa-check-circle"></i>
              </div>
              <h2>¡Pedido Confirmado!</h2>
              <p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
              
              <div className="confirmation-details">
                <h3>Detalles del Pedido</h3>
                <div className="detail-item">
                  <span>Número de Pedido:</span>
                  <strong>{orderId ? `#VENTA-${orderId}` : '#VENTA'}</strong>
                </div>
                <div className="detail-item">
                  <span>Total:</span>
                  <strong>{formatCOP(getSubtotal())}</strong>
                </div>
                <div className="detail-item">
                  <span>Email:</span>
                  <strong>{formData.email}</strong>
                </div>
              </div>

              <p className="confirmation-message">
                Te hemos enviado un email con los detalles de tu pedido. Pronto nos pondremos en contacto para confirmar la fecha del servicio.
              </p>

              <Link to="/productos" className="theme-btn">
                Continuar Comprando
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageTitle 
        title="Pago" 
        breadcrumbs={[
        ]} 
      />
      
      <section className="checkout-section">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="checkout-form" noValidate>
                {Object.keys(validationErrors).length > 0 && (
                  <div className="checkout-validation-banner">
                    Revisa los campos resaltados antes de confirmar el pedido.
                  </div>
                )}
                {/* Información de Envío */}
                <div className="form-section">
                  <h3>Información de Contacto</h3>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className={fieldClassName('firstName')}>
                        <label>Nombre</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                        {validationErrors.firstName && <p className="checkout-field-error">{validationErrors.firstName}</p>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className={fieldClassName('lastName')}>
                        <label>Apellido</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                        {validationErrors.lastName && <p className="checkout-field-error">{validationErrors.lastName}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className={fieldClassName('email')}>
                        <label>Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {validationErrors.email && <p className="checkout-field-error">{validationErrors.email}</p>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className={fieldClassName('phone')}>
                        <label>Teléfono</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {validationErrors.phone && <p className="checkout-field-error">{validationErrors.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="form-section">
                  <h3>Dirección de Envío</h3>
                  <div className={fieldClassName('address')}>
                    <label>Dirección</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {validationErrors.address && <p className="checkout-field-error">{validationErrors.address}</p>}
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className={fieldClassName('city')}>
                        <label>Ciudad</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        {validationErrors.city && <p className="checkout-field-error">{validationErrors.city}</p>}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className={fieldClassName('state')}>
                        <label>Provincia/Estado</label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                        {validationErrors.state && <p className="checkout-field-error">{validationErrors.state}</p>}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className={fieldClassName('zipCode')}>
                        <label>Código Postal</label>
                        <input 
                          type="text" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                        {validationErrors.zipCode && <p className="checkout-field-error">{validationErrors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Pago */}
                <div className="form-section">
                  <h3>Información de Pago</h3>
                  <div className={fieldClassName('cardName')}>
                    <label>Nombre en la Tarjeta</label>
                    <input 
                      type="text" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                    {validationErrors.cardName && <p className="checkout-field-error">{validationErrors.cardName}</p>}
                  </div>
                  <div className={fieldClassName('cardNumber')}>
                    <label>Número de Tarjeta</label>
                    <input 
                      type="text" 
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                    {validationErrors.cardNumber && <p className="checkout-field-error">{validationErrors.cardNumber}</p>}
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className={fieldClassName('cardExpiry')}>
                        <label>Fecha de Expiración</label>
                        <input 
                          type="text" 
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                        />
                        {validationErrors.cardExpiry && <p className="checkout-field-error">{validationErrors.cardExpiry}</p>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className={fieldClassName('cardCVC')}>
                        <label>CVC</label>
                        <input 
                          type="text" 
                          name="cardCVC"
                          placeholder="123"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                        />
                        {validationErrors.cardCVC && <p className="checkout-field-error">{validationErrors.cardCVC}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>

            {/* Resumen del Pedido */}
            <div className="col-lg-4">
              <div className="order-summary">
                <h3>Resumen del Pedido</h3>
                
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-name">
                        <span>{item.name}</span>
                        <span className="item-qty">×{item.quantity}</span>
                      </div>
                      <div className="item-price">
                        {formatCOP(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <strong>{formatCOP(getSubtotal())}</strong>
                  </div>
                  <div className="total-row">
                    <span>Envío:</span>
                    <strong>Gratuito</strong>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <strong>{formatCOP(getSubtotal())}</strong>
                  </div>
                </div>

                <p className="payment-info">
                  Este es un pedido de demostración. Los datos de pago son simulados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Checkout

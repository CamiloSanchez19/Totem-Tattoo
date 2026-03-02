import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import { useCart } from '../context/CartContext'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import { createPublicSale } from '../config/adminApi'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function Checkout() {
  useJQueryPlugins()
  const { cartItems, getSubtotal, clearCart } = useCart()
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      window.alert(message)
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
              <form onSubmit={handleSubmit} className="checkout-form">
                {/* Información de Envío */}
                <div className="form-section">
                  <h3>Información de Contacto</h3>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Nombre</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Apellido</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Teléfono</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="form-section">
                  <h3>Dirección de Envío</h3>
                  <div className="form-group">
                    <label>Dirección</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label>Ciudad</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label>Provincia/Estado</label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label>Código Postal</label>
                        <input 
                          type="text" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Pago */}
                <div className="form-section">
                  <h3>Información de Pago</h3>
                  <div className="form-group">
                    <label>Nombre en la Tarjeta</label>
                    <input 
                      type="text" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Número de Tarjeta</label>
                    <input 
                      type="text" 
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Fecha de Expiración</label>
                        <input 
                          type="text" 
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>CVC</label>
                        <input 
                          type="text" 
                          name="cardCVC"
                          placeholder="123"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          required 
                        />
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

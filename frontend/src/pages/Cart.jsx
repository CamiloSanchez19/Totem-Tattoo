import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import { useCart } from '../context/CartContext'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function Cart() {
  useJQueryPlugins()
  const { cartItems, removeFromCart, updateQuantity, getSubtotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <Layout>
        <PageTitle 
          title="Mi Carrito" 
          breadcrumbs={[
          ]} 
        />
        <section className="cart-section">
          <div className="auto-container">
            <div className="empty-cart-message">
              <h3>Tu carrito está vacío</h3>
              <p>No tienes productos en tu carrito. ¡Continúa comprando!</p>
              <Link to="/productos" className="theme-btn">
                Ver Productos
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
        title="Mi Carrito" 
        breadcrumbs={[
        ]} 
      />
      
      <section className="cart-section">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-table">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="cart-item">
                        <td className="product-cell">
                          <div className="product-info">
                            <img src={item.image} alt={item.name} />
                            <div>
                              <h4>{item.name}</h4>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="price-cell">{formatCOP(item.price)}</td>
                        <td className="quantity-cell">
                          <div className="quantity-control">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="qty-btn"
                            >
                              −
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="total-cell">
                          {formatCOP(item.price * item.quantity)}
                        </td>
                        <td className="action-cell">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-summary">
                <h3>Resumen del Pedido</h3>
                
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <strong>{formatCOP(getSubtotal())}</strong>
                </div>
                
                <div className="summary-item">
                  <span>Envío:</span>
                  <strong>Gratuito</strong>
                </div>
                
                <div className="summary-item">
                  <span>Impuestos:</span>
                  <strong>Calculado al pagar</strong>
                </div>
                
                <div className="summary-total">
                  <span>Total:</span>
                  <strong>{formatCOP(getSubtotal())}</strong>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  Proceder al Pago
                </Link>

                <Link to="/productos" className="continue-shopping-btn">
                  Continuar Comprando
                </Link>

                <button 
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Cart

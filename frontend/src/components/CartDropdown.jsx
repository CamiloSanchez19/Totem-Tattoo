import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function CartDropdown() {
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, removeFromCart, getSubtotal, getTotalItems } = useCart()

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!dropdownRef.current) {
        return
      }

      if (!dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId)
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="cart-box-btn"
        type="button"
        onClick={handleToggle}
        aria-label="Abrir carrito"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="icon-basket"></span>
        <span className="total-cart">{getTotalItems()}</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu show pull-right cart-panel" role="menu">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-panel-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-product">
                    <div className="inner">
                      <div className="cross-icon">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="remove-btn"
                          title="Eliminar del carrito"
                          aria-label={`Eliminar ${item.name} del carrito`}
                        >
                          <span className="icon fa fa-remove"></span>
                        </button>
                      </div>
                      <div className="image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <h3>
                        <Link to="/productos">{item.name}</Link>
                      </h3>
                      <div className="quantity-text">Cantidad: {item.quantity}</div>
                      <div className="price">{formatCOP(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                Sub Total: <span>{formatCOP(getSubtotal())}</span>
              </div>
              <ul className="btns-boxed">
                <li>
                  <Link to="/cart">Ver Carrito</Link>
                </li>
                <li>
                  <Link to="/checkout">CheckOut</Link>
                </li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CartDropdown

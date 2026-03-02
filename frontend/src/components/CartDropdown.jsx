import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function CartDropdown() {
  const { cartItems, removeFromCart, getSubtotal, getTotalItems } = useCart()

  return (
    <div className="dropdown">
      <button
        className="cart-box-btn dropdown-toggle"
        type="button"
        id="dropdownMenu"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="icon-basket"></span>
        <span className="total-cart">{getTotalItems()}</span>
      </button>
      <div className="dropdown-menu pull-right cart-panel" aria-labelledby="dropdownMenu">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-product">
                <div className="inner">
                  <div className="cross-icon">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                      title="Eliminar del carrito"
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
    </div>
  )
}

export default CartDropdown

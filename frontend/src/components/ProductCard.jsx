import { useCart } from '../context/CartContext'
import { useToastContext } from '../context/ToastContext'
import { formatCOP } from '../utils/helpers'
import '../styles/styles.css'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToastContext()

  const handleAddToCart = () => {
    addToCart(product)
    showToast(`${product.name} añadido al carrito`, 'success', 3000)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/images/productos/producto-1.jpg'} alt={product.name} />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">{formatCOP(product.price)}</div>
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            <span className="icon-basket"></span>
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

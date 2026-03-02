import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import ProductCard from '../components/ProductCard'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import { fetchPublicProducts } from '../config/adminApi'
import '../styles/styles.css'

function Productos() {
  useJQueryPlugins()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products

    return products.filter((product) => (
      product.name.toLowerCase().includes(searchQuery)
      || product.description.toLowerCase().includes(searchQuery)
    ))
  }, [products, searchQuery])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchPublicProducts()
        const mapped = response.map((product) => ({
          id: product.id,
          name: product.nombre,
          description: product.descripcion || 'Sin descripción disponible.',
          price: Number(product.precio || 0),
          image: product.imagen || '/images/productos/producto-1.jpg',
        }))
        setProducts(mapped)
      } catch {
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])
  
  return (
    <Layout>
      <PageTitle 
        title="Productos" 
        breadcrumbs={[
        ]} 
      />
      
      <section className="products-section">
        <div className="auto-container">
          <div className="sec-title centered">
            <h2>Nuestros Productos</h2>
            <p>
              {searchQuery
                ? `Resultados para "${searchParams.get('q')}"`
                : 'Selecciona los productos que deseas comprar'}
            </p>
          </div>

          {isLoading && <p style={{ textAlign: 'center', marginBottom: 20 }}>Cargando productos...</p>}
          
          <div className="products-grid">
            {!isLoading && filteredProducts.length === 0 && (
              <p style={{ textAlign: 'center', width: '100%' }}>No hay productos disponibles por ahora.</p>
            )}

            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </Layout>
  )
}

export default Productos

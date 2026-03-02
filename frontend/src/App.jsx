import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Portafolio = lazy(() => import('./pages/Portafolio'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Productos = lazy(() => import('./pages/Productos'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Reservas = lazy(() => import('./pages/Reservas'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

function LoadingFallback() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portafolio" element={<Portafolio />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </ToastProvider>
  )
}

export default App

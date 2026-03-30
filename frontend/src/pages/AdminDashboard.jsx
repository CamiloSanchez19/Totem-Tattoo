import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import { formatCOP } from '../utils/helpers'
import {
  clearAdminToken,
  createProduct,
  createPurchase,
  createReservation,
  deleteProduct,
  deletePurchase,
  deleteReservation,
  fetchDashboardStats,
  fetchAdminMe,
  fetchProducts,
  fetchPurchases,
  fetchReservations,
  fetchSales,
  isAdminAuthenticated,
  logoutAdmin,
  updateProduct,
  updatePurchase,
  updatePurchaseStatus,
  updateReservation,
  updateReservationStatus,
} from '../config/adminApi'
import '../styles/styles.css'

const EMPTY_STATS = {
  totalProducts: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  totalReservations: 0,
  pendingReservations: 0,
  confirmedReservations: 0,
  totalPurchases: 0,
  pendingPurchases: 0,
  purchasesTotalAmount: 0,
  totalSales: 0,
  paidSales: 0,
  salesTotalAmount: 0,
}

const INITIAL_PRODUCT_FORM = {
  nombre: '',
  categoria: 'Aftercare',
  descripcion: '',
  imagenActual: '',
  imagenUrl: '',
  precio: '',
  stock: '',
  activo: true,
}

const INITIAL_RESERVATION_FORM = {
  cliente: '',
  email: '',
  telefono: '',
  artista: '',
  fecha: '',
  servicio: '',
  estado: 'Pendiente',
}

const INITIAL_PURCHASE_FORM = {
  proveedor: '',
  fecha: '',
  total: '',
  estado: 'Pendiente',
  detalle: '',
}

const MAX_PRODUCT_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_PRODUCT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateOnly(value) {
  if (!value) return '-'

  const candidate = value.includes('T') ? value : `${value}T00:00:00`
  const date = new Date(candidate)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function humanizeValue(value) {
  if (!value) return '-'

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function normalizeServiceDetails(reservation) {
  if (reservation?.servicio_detalle && typeof reservation.servicio_detalle === 'object') {
    return {
      estilo: reservation.servicio_detalle.estilo || '-',
      zona: reservation.servicio_detalle.zona || '-',
      tamano: reservation.servicio_detalle.tamano || '-',
      color: reservation.servicio_detalle.color || '-',
      email: reservation.servicio_detalle.email || '-',
    }
  }

  const fallback = {
    estilo: '-',
    zona: '-',
    tamano: '-',
    color: '-',
    email: '-',
  }

  const raw = String(reservation?.servicio || '')
  const parts = raw.split('|').map((part) => part.trim()).filter(Boolean)

  if (parts.length > 0) {
    fallback.estilo = parts[0]
  }

  parts.slice(1).forEach((part) => {
    const [label, ...valueParts] = part.split(':')
    const key = (label || '').trim().toLowerCase()
    const value = valueParts.join(':').trim()

    if (key === 'zona') fallback.zona = value || '-'
    if (key === 'tamaño' || key === 'tamano') fallback.tamano = value || '-'
    if (key === 'color') fallback.color = value || '-'
    if (key === 'email' || key === 'correo') fallback.email = value || '-'
  })

  return fallback
}

function normalizePreferredDates(reservation) {
  const preferredDates = Array.isArray(reservation?.fechas_preferidas)
    ? reservation.fechas_preferidas.filter(Boolean)
    : []

  if (preferredDates.length) {
    return preferredDates.slice(0, 3)
  }

  return reservation?.fecha ? [reservation.fecha] : []
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { showToast } = useToastContext()

  const [activeView, setActiveView] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(EMPTY_STATS)
  const [adminUser, setAdminUser] = useState(null)

  const [products, setProducts] = useState([])
  const [reservations, setReservations] = useState([])
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])

  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM)
  const [productImageFile, setProductImageFile] = useState(null)
  const [productImagePreview, setProductImagePreview] = useState('')
  const [productImageSource, setProductImageSource] = useState('file')
  const [editingProductId, setEditingProductId] = useState(null)
  const [productSearch, setProductSearch] = useState('')

  const [reservationForm, setReservationForm] = useState(INITIAL_RESERVATION_FORM)
  const [editingReservationId, setEditingReservationId] = useState(null)
  const [reservationStatusFilter, setReservationStatusFilter] = useState('Todos')
  const [reservationSearch, setReservationSearch] = useState('')

  const [purchaseForm, setPurchaseForm] = useState(INITIAL_PURCHASE_FORM)
  const [editingPurchaseId, setEditingPurchaseId] = useState(null)
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState('Todos')
  const [purchaseSearch, setPurchaseSearch] = useState('')
  const [salesSearch, setSalesSearch] = useState('')
  const [salesStatusFilter, setSalesStatusFilter] = useState('Todos')
  const [salesDateFrom, setSalesDateFrom] = useState('')
  const [salesDateTo, setSalesDateTo] = useState('')

  const goToLogin = useCallback(() => {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }, [navigate])

  const handleApiError = useCallback((error, fallbackMessage = 'No se pudo completar la operación') => {
    const status = error?.response?.status

    if (status === 401) {
      showToast('Tu sesión expiró. Inicia sesión nuevamente.', 'warning', 2800)
      goToLogin()
      return
    }

    const message = error?.response?.data?.message || fallbackMessage
    showToast(message, 'error', 2800)
  }, [goToLogin, showToast])

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [meData, statsData, productsData, reservationsData, purchasesData, salesData] = await Promise.all([
        fetchAdminMe(),
        fetchDashboardStats(),
        fetchProducts(),
        fetchReservations(),
        fetchPurchases(),
        fetchSales(),
      ])

      setAdminUser(meData.user || null)
      setStats({ ...EMPTY_STATS, ...statsData })
      setProducts(productsData)
      setReservations(reservationsData)
      setPurchases(purchasesData)
      setSales(salesData)
    } catch (error) {
      handleApiError(error, 'No se pudo cargar el dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [handleApiError])

  const refreshStats = async () => {
    try {
      const statsData = await fetchDashboardStats()
      setStats({ ...EMPTY_STATS, ...statsData })
    } catch (error) {
      handleApiError(error, 'No se pudieron actualizar las métricas')
    }
  }

  useEffect(() => {
    if (isAdminAuthenticated()) {
      loadDashboardData()
    }
  }, [loadDashboardData])

  const filteredProducts = useMemo(() => {
    const searchTerm = productSearch.trim().toLowerCase()
    if (!searchTerm) return products

    return products.filter((product) => (
      product.nombre.toLowerCase().includes(searchTerm)
      || product.categoria.toLowerCase().includes(searchTerm)
      || String(product.id).toLowerCase().includes(searchTerm)
    ))
  }, [products, productSearch])

  const filteredReservations = useMemo(() => {
    const searchTerm = reservationSearch.trim().toLowerCase()

    return reservations.filter((reservation) => {
      const hasStatus = reservationStatusFilter === 'Todos' || reservation.estado === reservationStatusFilter
      const hasSearch = !searchTerm
        || reservation.cliente.toLowerCase().includes(searchTerm)
        || String(reservation.id).toLowerCase().includes(searchTerm)
        || reservation.artista.toLowerCase().includes(searchTerm)

      return hasStatus && hasSearch
    })
  }, [reservations, reservationSearch, reservationStatusFilter])

  const filteredPurchases = useMemo(() => {
    const searchTerm = purchaseSearch.trim().toLowerCase()

    return purchases.filter((purchase) => {
      const hasStatus = purchaseStatusFilter === 'Todos' || purchase.estado === purchaseStatusFilter
      const hasSearch = !searchTerm
        || purchase.proveedor.toLowerCase().includes(searchTerm)
        || String(purchase.id).toLowerCase().includes(searchTerm)
        || (purchase.detalle || '').toLowerCase().includes(searchTerm)

      return hasStatus && hasSearch
    })
  }, [purchases, purchaseSearch, purchaseStatusFilter])

  const filteredSales = useMemo(() => {
    const searchTerm = salesSearch.trim().toLowerCase()

    return sales.filter((sale) => {
      const saleDate = (sale.creado_en || '').slice(0, 10)
      const hasStatus = salesStatusFilter === 'Todos' || sale.estado === salesStatusFilter
      const hasFromDate = !salesDateFrom || (saleDate && saleDate >= salesDateFrom)
      const hasToDate = !salesDateTo || (saleDate && saleDate <= salesDateTo)

      const productsText = (sale.items || []).map((item) => item.nombre_producto).join(' ').toLowerCase()

      const hasSearch = !searchTerm
        || sale.cliente.toLowerCase().includes(searchTerm)
        || sale.email.toLowerCase().includes(searchTerm)
        || String(sale.id).includes(searchTerm)
        || productsText.includes(searchTerm)

      return hasStatus && hasFromDate && hasToDate && hasSearch
    })
  }, [sales, salesSearch, salesStatusFilter, salesDateFrom, salesDateTo])

  const resetProductForm = () => {
    setProductForm(INITIAL_PRODUCT_FORM)
    setProductImageFile(null)
    setProductImagePreview('')
    setProductImageSource('file')
    setEditingProductId(null)
  }

  const resetReservationForm = () => {
    setReservationForm(INITIAL_RESERVATION_FORM)
    setEditingReservationId(null)
  }

  const resetPurchaseForm = () => {
    setPurchaseForm(INITIAL_PURCHASE_FORM)
    setEditingPurchaseId(null)
  }

  const onProductFormChange = (event) => {
    const { name, value, type, checked } = event.target
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onProductImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setProductImageSource('file')

    if (!file) {
      setProductImageFile(null)
      setProductImagePreview(productForm.imagenActual || productForm.imagenUrl || '')
      return
    }

    if (!ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type)) {
      showToast('Formato no permitido. Usa JPG, PNG o WEBP.', 'warning', 2600)
      event.target.value = ''
      setProductImageFile(null)
      setProductImagePreview(productForm.imagenActual || '')
      return
    }

    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      showToast('La imagen supera 4 MB. Elige una imagen más liviana.', 'warning', 2800)
      event.target.value = ''
      setProductImageFile(null)
      setProductImagePreview(productForm.imagenActual || '')
      return
    }

    setProductImageFile(file)

    const previewUrl = URL.createObjectURL(file)
    setProductImagePreview(previewUrl)
  }

  const onProductImageUrlChange = (event) => {
    const imageUrl = event.target.value
    setProductImageSource('url')
    setProductImageFile(null)
    setProductForm((current) => ({
      ...current,
      imagenUrl: imageUrl,
    }))
    setProductImagePreview(imageUrl.trim())
  }

  const isValidHttpUrl = (value) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const onReservationFormChange = (event) => {
    const { name, value } = event.target
    setReservationForm((current) => ({ ...current, [name]: value }))
  }

  const onPurchaseFormChange = (event) => {
    const { name, value } = event.target
    setPurchaseForm((current) => ({ ...current, [name]: value }))
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()

    if (!productForm.nombre.trim()) {
      showToast('El producto debe tener nombre', 'warning', 2500)
      return
    }

    const payload = {
      nombre: productForm.nombre.trim(),
      categoria: productForm.categoria,
      descripcion: productForm.descripcion.trim(),
      precio: Number(productForm.precio),
      stock: Number(productForm.stock),
      activo: Boolean(productForm.activo),
    }

    if (!payload.precio || payload.precio <= 0) {
      showToast('Ingresa un precio válido', 'warning', 2500)
      return
    }

    if (payload.stock < 0) {
      showToast('Ingresa un stock válido', 'warning', 2500)
      return
    }

    const formData = new FormData()
    formData.append('nombre', payload.nombre)
    formData.append('categoria', payload.categoria)
    formData.append('descripcion', payload.descripcion)
    formData.append('precio', String(payload.precio))
    formData.append('stock', String(payload.stock))
    formData.append('activo', payload.activo ? '1' : '0')

    const imageUrl = productForm.imagenUrl.trim()

    if (productImageSource === 'url' && imageUrl && !isValidHttpUrl(imageUrl)) {
      showToast('La URL de imagen no es válida. Debe iniciar por http:// o https://', 'warning', 3000)
      return
    }

    if (productImageSource === 'file' && productImageFile) {
      formData.append('imagen', productImageFile)
    } else if (productImageSource === 'url' && imageUrl) {
      formData.append('imagen_url', imageUrl)
    } else if (productForm.imagenActual) {
      formData.append('imagen_actual', productForm.imagenActual)
    }

    try {
      if (editingProductId) {
        formData.append('_method', 'PUT')
        const updatedProduct = await updateProduct(editingProductId, formData)
        setProducts((current) => current.map((item) => (item.id === editingProductId ? updatedProduct : item)))
        showToast('Producto actualizado correctamente', 'success', 2500)
      } else {
        const createdProduct = await createProduct(formData)
        setProducts((current) => [createdProduct, ...current])
        showToast('Producto creado correctamente', 'success', 2500)
      }

      resetProductForm()
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo guardar el producto')
    }
  }

  const handleProductEdit = (product) => {
    const isExternalImage = /^https?:\/\//i.test(product.imagen || '')

    setEditingProductId(product.id)
    setProductForm({
      nombre: product.nombre,
      categoria: product.categoria,
      descripcion: product.descripcion || '',
      imagenActual: product.imagen || '',
      imagenUrl: isExternalImage ? (product.imagen || '') : '',
      precio: String(product.precio),
      stock: String(product.stock),
      activo: product.activo,
    })
    setProductImageFile(null)
    setProductImageSource(isExternalImage ? 'url' : 'file')
    setProductImagePreview(product.imagen || '')
    setActiveView('products')
  }

  const handleProductDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      setProducts((current) => current.filter((product) => product.id !== productId))
      if (editingProductId === productId) resetProductForm()
      showToast('Producto eliminado', 'info', 2200)
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo eliminar el producto')
    }
  }

  const handleReservationSubmit = async (event) => {
    event.preventDefault()

    if (!reservationForm.cliente.trim() || !reservationForm.telefono.trim() || !reservationForm.artista.trim()) {
      showToast('Completa cliente, teléfono y artista', 'warning', 2500)
      return
    }

    if (!reservationForm.fecha || !reservationForm.servicio.trim()) {
      showToast('Completa fecha y servicio', 'warning', 2500)
      return
    }

    const payload = {
      cliente: reservationForm.cliente.trim(),
      telefono: reservationForm.telefono.trim(),
      artista: reservationForm.artista.trim(),
      fecha: reservationForm.fecha,
      servicio: reservationForm.servicio.trim(),
      estado: reservationForm.estado,
    }

    try {
      if (editingReservationId) {
        const updatedReservation = await updateReservation(editingReservationId, payload)
        setReservations((current) => current.map((item) => (item.id === editingReservationId ? updatedReservation : item)))
        showToast('Reserva actualizada', 'success', 2500)
      } else {
        const createdReservation = await createReservation(payload)
        setReservations((current) => [createdReservation, ...current])
        showToast('Reserva creada', 'success', 2500)
      }

      resetReservationForm()
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo guardar la reserva')
    }
  }

  const handleReservationEdit = (reservation) => {
    const serviceDetails = normalizeServiceDetails(reservation)

    setEditingReservationId(reservation.id)
    setReservationForm({
      cliente: reservation.cliente,
      email: serviceDetails.email && serviceDetails.email !== '-' ? serviceDetails.email : '',
      telefono: reservation.telefono,
      artista: reservation.artista,
      fecha: reservation.fecha,
      servicio: reservation.servicio,
      estado: reservation.estado,
    })
    setActiveView('reservations')
  }

  const handleReservationDelete = async (reservationId) => {
    try {
      await deleteReservation(reservationId)
      setReservations((current) => current.filter((reservation) => reservation.id !== reservationId))
      if (editingReservationId === reservationId) resetReservationForm()
      showToast('Reserva eliminada', 'info', 2200)
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo eliminar la reserva')
    }
  }

  const handleReservationStatus = async (reservationId, status) => {
    try {
      const updatedReservation = await updateReservationStatus(reservationId, status)
      setReservations((current) => current.map((reservation) => (
        reservation.id === reservationId ? updatedReservation : reservation
      )))
      showToast(`Reserva marcada como ${status.toLowerCase()}`, 'success', 2000)
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo actualizar el estado de la reserva')
    }
  }

  const handlePurchaseSubmit = async (event) => {
    event.preventDefault()

    if (!purchaseForm.proveedor.trim()) {
      showToast('Ingresa el proveedor de la compra', 'warning', 2500)
      return
    }

    if (!purchaseForm.fecha) {
      showToast('Selecciona una fecha', 'warning', 2500)
      return
    }

    const payload = {
      proveedor: purchaseForm.proveedor.trim(),
      fecha: purchaseForm.fecha,
      total: Number(purchaseForm.total),
      estado: purchaseForm.estado,
      detalle: purchaseForm.detalle.trim(),
    }

    if (!payload.total || payload.total <= 0) {
      showToast('Ingresa un total válido', 'warning', 2500)
      return
    }

    try {
      if (editingPurchaseId) {
        const updatedPurchase = await updatePurchase(editingPurchaseId, payload)
        setPurchases((current) => current.map((item) => (item.id === editingPurchaseId ? updatedPurchase : item)))
        showToast('Compra actualizada', 'success', 2500)
      } else {
        const createdPurchase = await createPurchase(payload)
        setPurchases((current) => [createdPurchase, ...current])
        showToast('Compra registrada', 'success', 2500)
      }

      resetPurchaseForm()
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo guardar la compra')
    }
  }

  const handlePurchaseEdit = (purchase) => {
    setEditingPurchaseId(purchase.id)
    setPurchaseForm({
      proveedor: purchase.proveedor,
      fecha: purchase.fecha,
      total: String(purchase.total),
      estado: purchase.estado,
      detalle: purchase.detalle || '',
    })
    setActiveView('purchases')
  }

  const handlePurchaseDelete = async (purchaseId) => {
    try {
      await deletePurchase(purchaseId)
      setPurchases((current) => current.filter((purchase) => purchase.id !== purchaseId))
      if (editingPurchaseId === purchaseId) resetPurchaseForm()
      showToast('Compra eliminada', 'info', 2200)
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo eliminar la compra')
    }
  }

  const handlePurchaseStatus = async (purchaseId, status) => {
    try {
      const updatedPurchase = await updatePurchaseStatus(purchaseId, status)
      setPurchases((current) => current.map((purchase) => (
        purchase.id === purchaseId ? updatedPurchase : purchase
      )))
      showToast(`Compra marcada como ${status.toLowerCase()}`, 'success', 2000)
      refreshStats()
    } catch (error) {
      handleApiError(error, 'No se pudo actualizar el estado de la compra')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin()
    } catch {
      clearAdminToken()
    }
    navigate('/admin/login', { replace: true })
  }

  const statusBadgeClass = (status) => {
    if (status === 'Confirmada') return 'badge badge-success'
    if (status === 'Pendiente') return 'badge badge-warning'
    if (status === 'Cancelada') return 'badge badge-danger'
    if (status === 'Reprogramada') return 'badge badge-info'
    return 'badge badge-secondary'
  }

  const purchaseBadgeClass = (status) => {
    if (status === 'Recibida') return 'badge badge-success'
    if (status === 'Pagada') return 'badge badge-success'
    if (status === 'Pendiente') return 'badge badge-warning'
    if (status === 'Cancelada') return 'badge badge-danger'
    return 'badge badge-secondary'
  }

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  if (isLoading) {
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar" />
        <main className="admin-main">
          <div className="admin-panel-card">
            <h3>Cargando dashboard...</h3>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>TÓTEM Admin</h2>
          <span>Panel privado</span>
        </div>

        {adminUser && (
          <div className="admin-user-chip">
            <strong>{adminUser.name}</strong>
            <small>{adminUser.email}</small>
          </div>
        )}

        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={activeView === 'overview' ? 'active' : ''}
            onClick={() => setActiveView('overview')}
          >
            Resumen
          </button>
          <button
            type="button"
            className={activeView === 'products' ? 'active' : ''}
            onClick={() => setActiveView('products')}
          >
            Productos
          </button>
          <button
            type="button"
            className={activeView === 'reservations' ? 'active' : ''}
            onClick={() => setActiveView('reservations')}
          >
            Reservas
          </button>
          <button
            type="button"
            className={activeView === 'purchases' ? 'active' : ''}
            onClick={() => setActiveView('purchases')}
          >
            Compras
          </button>
          <button
            type="button"
            className={activeView === 'sales' ? 'active' : ''}
            onClick={() => setActiveView('sales')}
          >
            Ventas
          </button>
        </nav>

        <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <h1>Dashboard administrativo</h1>
            <p>Controla productos, reservas y compras del estudio desde backend real.</p>
          </div>
          <div className="admin-main-cta">
            <button type="button" className="theme-btn btn-style-one" onClick={() => setActiveView('products')}>
              <span className="txt">Nuevo producto</span>
            </button>
            <button type="button" className="theme-btn btn-style-one" onClick={() => setActiveView('reservations')}>
              <span className="txt">Nueva reserva</span>
            </button>
            <button type="button" className="theme-btn btn-style-one" onClick={() => setActiveView('purchases')}>
              <span className="txt">Nueva compra</span>
            </button>
            <button type="button" className="theme-btn btn-style-one" onClick={() => setActiveView('sales')}>
              <span className="txt">Ver ventas</span>
            </button>
          </div>
        </header>

        <div className="admin-kpi-grid">
          <article className="admin-kpi-card">
            <h4>Productos activos</h4>
            <strong>{stats.activeProducts} / {stats.totalProducts}</strong>
            <span>Catálogo disponible para venta</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Stock crítico</h4>
            <strong>{stats.lowStockProducts}</strong>
            <span>Productos con 5 unidades o menos</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Reservas pendientes</h4>
            <strong>{stats.pendingReservations}</strong>
            <span>Clientes por confirmar</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Reservas confirmadas</h4>
            <strong>{stats.confirmedReservations}</strong>
            <span>Total de agendas confirmadas</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Compras pendientes</h4>
            <strong>{stats.pendingPurchases}</strong>
            <span>Órdenes por recibir</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Gasto en compras</h4>
            <strong>{formatCOP(stats.purchasesTotalAmount)}</strong>
            <span>Total registrado en compras</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Ventas totales</h4>
            <strong>{stats.totalSales}</strong>
            <span>Pedidos registrados desde carrito</span>
          </article>
          <article className="admin-kpi-card">
            <h4>Ingresos por ventas</h4>
            <strong>{formatCOP(stats.salesTotalAmount)}</strong>
            <span>Total de ventas pagadas</span>
          </article>
        </div>

        {activeView === 'overview' && (
          <div className="row clearfix">
            <div className="col-lg-7 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head">
                  <h3>Reservas recientes</h3>
                  <button type="button" onClick={() => setActiveView('reservations')}>Gestionar</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Artista</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 6).map((reservation) => (
                        <tr key={reservation.id}>
                          <td>{reservation.id}</td>
                          <td>{reservation.cliente}</td>
                          <td>{reservation.artista}</td>
                          <td>{formatDateTime(reservation.fecha)}</td>
                          <td><span className={statusBadgeClass(reservation.estado)}>{reservation.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head">
                  <h3>Stock actual</h3>
                  <button type="button" onClick={() => setActiveView('products')}>Gestionar</button>
                </div>
                <ul className="admin-stock-list">
                  {products.slice(0, 6).map((product) => (
                    <li key={product.id}>
                      <div>
                        <strong>{product.nombre}</strong>
                        <small>{product.categoria}</small>
                      </div>
                      <span className={product.stock <= 5 ? 'badge badge-danger' : 'badge badge-success'}>
                        {product.stock} uds
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head">
                  <h3>Ventas recientes</h3>
                  <button type="button" onClick={() => setActiveView('sales')}>Gestionar</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, 5).map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{sale.cliente}</td>
                          <td>{sale.email}</td>
                          <td>{formatCOP(sale.total)}</td>
                          <td><span className={purchaseBadgeClass(sale.estado)}>{sale.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'sales' && (
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head admin-filter-head">
                  <h3>Historial de ventas</h3>
                  <div className="admin-filter-controls">
                    <input
                      type="text"
                      placeholder="Buscar cliente, email, producto o ID"
                      value={salesSearch}
                      onChange={(event) => setSalesSearch(event.target.value)}
                    />
                    <select value={salesStatusFilter} onChange={(event) => setSalesStatusFilter(event.target.value)}>
                      <option value="Todos">Todos</option>
                      <option value="Pagada">Pagada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                    <input
                      type="date"
                      value={salesDateFrom}
                      onChange={(event) => setSalesDateFrom(event.target.value)}
                      title="Desde"
                    />
                    <input
                      type="date"
                      value={salesDateTo}
                      onChange={(event) => setSalesDateTo(event.target.value)}
                      title="Hasta"
                    />
                  </div>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>
                            <strong>{sale.cliente}</strong>
                            <div className="text-muted">{sale.email}</div>
                            <div className="text-muted">{sale.telefono}</div>
                            <div className="text-muted">
                              Envío: {sale.direccion || '-'}
                            </div>
                            <div className="text-muted">
                              {sale.ciudad || '-'}, {sale.departamento || '-'} ({sale.codigo_postal || '-'})
                            </div>
                          </td>
                          <td>{formatDateTime(sale.creado_en)}</td>
                          <td>
                            <div className="admin-service-details">
                              {(sale.items || []).map((item) => (
                                <span key={`${sale.id}-${item.id}`}>
                                  {item.nombre_producto} × {item.cantidad}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>{formatCOP(sale.total)}</td>
                          <td><span className={purchaseBadgeClass(sale.estado)}>{sale.estado}</span></td>
                        </tr>
                      ))}
                      {filteredSales.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">No hay ventas para el filtro actual</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'products' && (
          <div className="row clearfix">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <h3>{editingProductId ? 'Editar producto' : 'Nuevo producto'}</h3>
                <form className="admin-form" onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input id="nombre" name="nombre" value={productForm.nombre} onChange={onProductFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <select id="categoria" name="categoria" value={productForm.categoria} onChange={onProductFormChange}>
                      <option value="Aftercare">Aftercare</option>
                      <option value="Higiene">Higiene</option>
                      <option value="Merch">Merch</option>
                      <option value="Insumos">Insumos</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <input id="descripcion" name="descripcion" value={productForm.descripcion} onChange={onProductFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="imagen">Imagen del producto</label>
                    <div className="admin-image-source-switch">
                      <label>
                        <input
                          type="radio"
                          name="imageSource"
                          value="file"
                          checked={productImageSource === 'file'}
                          onChange={() => {
                            setProductImageSource('file')
                            setProductImagePreview(productForm.imagenActual || '')
                          }}
                        />
                        Subir archivo
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="imageSource"
                          value="url"
                          checked={productImageSource === 'url'}
                          onChange={() => {
                            setProductImageSource('url')
                            setProductImageFile(null)
                            setProductImagePreview(productForm.imagenUrl.trim() || productForm.imagenActual || '')
                          }}
                        />
                        Usar URL
                      </label>
                    </div>
                    <div className="admin-image-upload">
                      {productImageSource === 'file' ? (
                        <>
                          <input id="imagen" name="imagen" type="file" accept="image/*" onChange={onProductImageChange} />
                          <small className="admin-image-upload-help">Selecciona una imagen desde este ordenador. Formatos: JPG, PNG o WEBP. Tamaño máximo: 4 MB.</small>
                          {productImageFile && (
                            <p className="admin-image-upload-filename">Archivo seleccionado: {productImageFile.name}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            id="imagenUrl"
                            name="imagenUrl"
                            type="url"
                            placeholder="https://..."
                            value={productForm.imagenUrl}
                            onChange={onProductImageUrlChange}
                          />
                          <small className="admin-image-upload-help">Pega una URL pública válida (http:// o https://).</small>
                        </>
                      )}
                    </div>
                    {productImagePreview && (
                      <div className="admin-image-preview">
                        <img
                          src={productImagePreview}
                          alt="Vista previa del producto"
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="precio">Precio (COP)</label>
                    <input id="precio" name="precio" type="number" min="0" value={productForm.precio} onChange={onProductFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input id="stock" name="stock" type="number" min="0" value={productForm.stock} onChange={onProductFormChange} />
                  </div>
                  <div className="admin-inline-control">
                    <input id="activo" name="activo" type="checkbox" checked={productForm.activo} onChange={onProductFormChange} />
                    <label htmlFor="activo">Producto activo</label>
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="theme-btn btn-style-one">
                      <span className="txt">{editingProductId ? 'Guardar cambios' : 'Crear producto'}</span>
                    </button>
                    {editingProductId && (
                      <button type="button" className="admin-ghost-btn" onClick={resetProductForm}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head">
                  <h3>Catálogo de productos</h3>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, categoría o ID"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                  />
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <strong>{product.nombre}</strong>
                            <div className="text-muted">{product.categoria}</div>
                            <div className="text-muted">{product.descripcion || 'Sin descripción'}</div>
                          </td>
                          <td>{formatCOP(product.precio)}</td>
                          <td>
                            <span className={product.stock <= 5 ? 'badge badge-danger' : 'badge badge-success'}>
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <span className={product.activo ? 'badge badge-success' : 'badge badge-secondary'}>
                              {product.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button type="button" onClick={() => handleProductEdit(product)}>Editar</button>
                              <button type="button" className="danger" onClick={() => handleProductDelete(product.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">No se encontraron productos</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'reservations' && (
          <div className="row clearfix">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <h3>{editingReservationId ? 'Editar reserva' : 'Nueva reserva'}</h3>
                <form className="admin-form" onSubmit={handleReservationSubmit}>
                  <div className="form-group">
                    <label htmlFor="cliente">Cliente</label>
                    <input id="cliente" name="cliente" value={reservationForm.cliente} onChange={onReservationFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emailReserva">Correo del cliente</label>
                    <input
                      id="emailReserva"
                      name="email"
                      value={reservationForm.email || ''}
                      readOnly
                      placeholder="Sin correo disponible"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input id="telefono" name="telefono" value={reservationForm.telefono} onChange={onReservationFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="artista">Artista</label>
                    <input id="artista" name="artista" value={reservationForm.artista} onChange={onReservationFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fecha">Fecha y hora</label>
                    <input id="fecha" name="fecha" type="datetime-local" value={reservationForm.fecha} onChange={onReservationFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="servicio">Servicio</label>
                    <input id="servicio" name="servicio" value={reservationForm.servicio} onChange={onReservationFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" name="estado" value={reservationForm.estado} onChange={onReservationFormChange}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Reprogramada">Reprogramada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="theme-btn btn-style-one">
                      <span className="txt">{editingReservationId ? 'Guardar cambios' : 'Crear reserva'}</span>
                    </button>
                    {editingReservationId && (
                      <button type="button" className="admin-ghost-btn" onClick={resetReservationForm}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head admin-filter-head">
                  <h3>Agenda de reservas</h3>
                  <div className="admin-filter-controls">
                    <input
                      type="text"
                      placeholder="Buscar cliente, artista o ID"
                      value={reservationSearch}
                      onChange={(event) => setReservationSearch(event.target.value)}
                    />
                    <select value={reservationStatusFilter} onChange={(event) => setReservationStatusFilter(event.target.value)}>
                      <option value="Todos">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Reprogramada">Reprogramada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Fechas preferidas</th>
                        <th>Referencias</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => {
                        const serviceDetails = normalizeServiceDetails(reservation)
                        const preferredDates = normalizePreferredDates(reservation)

                        return (
                          <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>
                              <strong>{reservation.cliente}</strong>
                              <div className="text-muted">{reservation.telefono}</div>
                              <div className="text-muted">Artista: {reservation.artista}</div>
                            </td>
                            <td>
                              <div className="admin-service-details">
                                <span><strong>Estilo:</strong> {humanizeValue(serviceDetails.estilo)}</span>
                                <span><strong>Zona:</strong> {humanizeValue(serviceDetails.zona)}</span>
                                <span><strong>Tamaño:</strong> {serviceDetails.tamano || '-'}</span>
                                <span><strong>Color:</strong> {humanizeValue(serviceDetails.color)}</span>
                              </div>
                            </td>
                            <td>
                              {preferredDates.length ? (
                                <div className="admin-preferred-dates">
                                  {preferredDates.map((dateValue, index) => (
                                    <span key={`${reservation.id}-date-${index}`}>
                                      {formatDateOnly(dateValue)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted">Sin fechas</span>
                              )}
                            </td>
                            <td>
                              {reservation.referencias_imagenes_urls?.length ? (
                                <div className="admin-reference-gallery">
                                  {reservation.referencias_imagenes_urls.slice(0, 3).map((imageUrl, index) => (
                                    <a
                                      key={`${reservation.id}-${index}`}
                                      href={imageUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="admin-reference-thumb"
                                      title={`Referencia ${index + 1}`}
                                    >
                                      <img src={imageUrl} alt={`Referencia ${index + 1}`} loading="lazy" />
                                    </a>
                                  ))}
                                  {reservation.referencias_imagenes_urls.length > 3 && (
                                    <span className="admin-reference-more">+{reservation.referencias_imagenes_urls.length - 3}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">Sin imágenes</span>
                              )}
                            </td>
                            <td>
                              <span className={statusBadgeClass(reservation.estado)}>{reservation.estado}</span>
                            </td>
                            <td>
                              <div className="admin-row-actions">
                                <button type="button" onClick={() => handleReservationEdit(reservation)}>Editar</button>
                                {reservation.estado !== 'Confirmada' && (
                                  <button type="button" onClick={() => handleReservationStatus(reservation.id, 'Confirmada')}>
                                    Confirmar
                                  </button>
                                )}
                                {reservation.estado !== 'Cancelada' && (
                                  <button type="button" className="danger" onClick={() => handleReservationStatus(reservation.id, 'Cancelada')}>
                                    Cancelar
                                  </button>
                                )}
                                <button type="button" className="danger" onClick={() => handleReservationDelete(reservation.id)}>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {filteredReservations.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No hay reservas para el filtro actual</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'purchases' && (
          <div className="row clearfix">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <h3>{editingPurchaseId ? 'Editar compra' : 'Nueva compra'}</h3>
                <form className="admin-form" onSubmit={handlePurchaseSubmit}>
                  <div className="form-group">
                    <label htmlFor="proveedor">Proveedor</label>
                    <input id="proveedor" name="proveedor" value={purchaseForm.proveedor} onChange={onPurchaseFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaCompra">Fecha</label>
                    <input id="fechaCompra" name="fecha" type="date" value={purchaseForm.fecha} onChange={onPurchaseFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="totalCompra">Total (COP)</label>
                    <input id="totalCompra" name="total" type="number" min="0" value={purchaseForm.total} onChange={onPurchaseFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="estadoCompra">Estado</label>
                    <select id="estadoCompra" name="estado" value={purchaseForm.estado} onChange={onPurchaseFormChange}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Recibida">Recibida</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="detalleCompra">Detalle</label>
                    <input id="detalleCompra" name="detalle" value={purchaseForm.detalle} onChange={onPurchaseFormChange} placeholder="Ej: tinta, guantes, agujas" />
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="theme-btn btn-style-one">
                      <span className="txt">{editingPurchaseId ? 'Guardar cambios' : 'Registrar compra'}</span>
                    </button>
                    {editingPurchaseId && (
                      <button type="button" className="admin-ghost-btn" onClick={resetPurchaseForm}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="admin-panel-card">
                <div className="admin-panel-card-head admin-filter-head">
                  <h3>Historial de compras</h3>
                  <div className="admin-filter-controls">
                    <input
                      type="text"
                      placeholder="Buscar proveedor, detalle o ID"
                      value={purchaseSearch}
                      onChange={(event) => setPurchaseSearch(event.target.value)}
                    />
                    <select value={purchaseStatusFilter} onChange={(event) => setPurchaseStatusFilter(event.target.value)}>
                      <option value="Todos">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Recibida">Recibida</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>{purchase.id}</td>
                          <td>
                            <strong>{purchase.proveedor}</strong>
                            <div className="text-muted">{purchase.detalle || 'Sin detalle'}</div>
                          </td>
                          <td>{purchase.fecha}</td>
                          <td>{formatCOP(purchase.total)}</td>
                          <td>
                            <span className={purchaseBadgeClass(purchase.estado)}>{purchase.estado}</span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button type="button" onClick={() => handlePurchaseEdit(purchase)}>Editar</button>
                              {purchase.estado !== 'Recibida' && (
                                <button type="button" onClick={() => handlePurchaseStatus(purchase.id, 'Recibida')}>
                                  Recibida
                                </button>
                              )}
                              {purchase.estado !== 'Cancelada' && (
                                <button type="button" className="danger" onClick={() => handlePurchaseStatus(purchase.id, 'Cancelada')}>
                                  Cancelar
                                </button>
                              )}
                              <button type="button" className="danger" onClick={() => handlePurchaseDelete(purchase.id)}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredPurchases.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">No hay compras para el filtro actual</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard

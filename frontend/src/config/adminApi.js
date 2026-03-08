import axios from 'axios'

const ADMIN_TOKEN_KEY = 'totem_admin_token'

const isLocalHost =
  typeof window !== 'undefined'
  && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL

const DEFAULT_API_BASE_URL = isLocalHost
  ? 'http://127.0.0.1:8000/api'
  : 'https://totem-tattoo.onrender.com/api'

const isLocalApiUrl = (value) => /localhost|127\.0\.0\.1/i.test(String(value || ''))

const API_BASE_URL = (!isLocalHost && isLocalApiUrl(envApiBaseUrl))
  ? 'https://totem-tattoo.onrender.com/api'
  : (envApiBaseUrl || DEFAULT_API_BASE_URL)

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken())
}

function authHeaders() {
  const token = getAdminToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function loginAdmin(payload) {
  const response = await adminApi.post('/admin/login', payload)

  if (response.data?.token) {
    setAdminToken(response.data.token)
  }

  return response.data
}

export async function fetchAdminMe() {
  const response = await adminApi.get('/admin/me', {
    headers: authHeaders(),
  })

  return response.data
}

export async function logoutAdmin() {
  try {
    await adminApi.post('/admin/logout', {}, {
      headers: authHeaders(),
    })
  } finally {
    clearAdminToken()
  }
}

export async function fetchDashboardStats() {
  const response = await adminApi.get('/admin/dashboard/stats', {
    headers: authHeaders(),
  })

  return response.data.stats
}

export async function fetchProducts() {
  const response = await adminApi.get('/admin/products', {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function fetchPublicProducts() {
  const response = await adminApi.get('/productos')

  return response.data.data
}

export async function createPublicReservation(payload) {
  const response = await adminApi.post('/reservas', payload)

  return response.data
}

export async function createPublicSale(payload) {
  const response = await adminApi.post('/ventas', payload)

  return response.data
}

export async function createProduct(payload) {
  const response = await adminApi.post('/admin/products', payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function updateProduct(id, payload) {
  const response = await adminApi.put(`/admin/products/${id}`, payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function deleteProduct(id) {
  await adminApi.delete(`/admin/products/${id}`, {
    headers: authHeaders(),
  })
}

export async function fetchReservations() {
  const response = await adminApi.get('/admin/reservations', {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function createReservation(payload) {
  const response = await adminApi.post('/admin/reservations', payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function updateReservation(id, payload) {
  const response = await adminApi.put(`/admin/reservations/${id}`, payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function deleteReservation(id) {
  await adminApi.delete(`/admin/reservations/${id}`, {
    headers: authHeaders(),
  })
}

export async function updateReservationStatus(id, estado) {
  const response = await adminApi.patch(`/admin/reservations/${id}/status`, { estado }, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function fetchPurchases() {
  const response = await adminApi.get('/admin/purchases', {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function createPurchase(payload) {
  const response = await adminApi.post('/admin/purchases', payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function updatePurchase(id, payload) {
  const response = await adminApi.put(`/admin/purchases/${id}`, payload, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function deletePurchase(id) {
  await adminApi.delete(`/admin/purchases/${id}`, {
    headers: authHeaders(),
  })
}

export async function updatePurchaseStatus(id, estado) {
  const response = await adminApi.patch(`/admin/purchases/${id}/status`, { estado }, {
    headers: authHeaders(),
  })

  return response.data.data
}

export async function fetchSales() {
  const response = await adminApi.get('/admin/sales', {
    headers: authHeaders(),
  })

  return response.data.data
}

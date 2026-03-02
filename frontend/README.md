# Frontend Totem (React + Vite)

Aplicación web pública y panel administrativo conectados a la API Laravel.

## 1) Stack

- React 19
- React Router
- Axios
- Vite
- ESLint

## 2) Rutas principales

- `/`: inicio
- `/portafolio`: portafolio
- `/pricing`: precios
- `/productos`: catálogo
- `/cart`: carrito
- `/checkout`: checkout
- `/reservas`: formulario público de reservas
- `/admin/login`: login admin
- `/admin`: dashboard admin

## 3) Configuración

Crear/editar `.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 4) Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

## 5) Scripts

- `npm run dev`: modo desarrollo.
- `npm run build`: compilación producción.
- `npm run preview`: previsualización build.
- `npm run lint`: lint sobre `src`.
- `npm run quality`: lint + build.

## 6) Integración con backend

Servicios de API en:

- `src/config/adminApi.js`

Incluye:

- Login admin.
- Gestión de token en `localStorage`.
- CRUD administrativo.
- Endpoints públicos de reservas/ventas/productos.

## 7) Estado global

- `CartContext`: carrito de compras.
- `ToastContext`: notificaciones toast.

## 8) Buenas prácticas de operación

- Ejecutar backend primero (`http://127.0.0.1:8000`).
- Si cambia puerto de backend, actualizar `VITE_API_BASE_URL`.
- Limpiar token admin si hay sesiones antiguas inválidas.

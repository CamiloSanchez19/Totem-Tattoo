


# Totem - Documentacion del proyecto

Proyecto full stack con frontend en React (Vite) y backend API en Laravel.

## 1) Estructura del repositorio

- `frontend/`: aplicacion React para sitio publico y panel admin.
- `backend/`: API REST en Laravel para autenticacion admin, catalogo, reservas, compras y ventas.

## 2) Arquitectura de servidores (produccion)

- Frontend: Vercel
- Backend API: Render (Web Service con Docker)
- Base de datos: Railway (MySQL)

Flujo:

1. Usuario entra al frontend en Vercel.
2. Frontend consume endpoints `/api` del backend en Render.
3. Backend se conecta a MySQL en Railway por variables de entorno.

## 3) Tecnologias

### Frontend
- React 19
- React Router
- Axios
- Vite
- ESLint

### Backend
- PHP 8.2+
- Laravel 12
- MySQL
- Pest (testing)

## 4) Requisitos para desarrollo local

- Node.js 20+
- npm 10+
- PHP 8.2+
- Composer 2+
- MySQL 8+

## 5) Configuracion rapida (primera vez)

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### Frontend

```bash
cd frontend
npm install
```

Configurar `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 6) Ejecucion local

Backend:

```bash
cd backend
php -S 127.0.0.1:8000 -t public
```

Frontend:

```bash
cd frontend
npm run dev
```

Abrir la URL de Vite (normalmente `http://127.0.0.1:5173`).

## 7) Variables de entorno en produccion

### Vercel (Frontend)

- `VITE_API_BASE_URL=https://TU_BACKEND_RENDER.onrender.com/api`

### Render (Backend)

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://TU_BACKEND_RENDER.onrender.com`
- `APP_KEY=base64:...`
- `CORS_ALLOWED_ORIGINS=https://TU_FRONTEND_VERCEL.vercel.app`
- `DB_CONNECTION=mysql`
- `DB_HOST=...` (Railway)
- `DB_PORT=3306`
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

Recomendado en Render:

- `SESSION_DRIVER=file`
- `CACHE_STORE=file`
- `QUEUE_CONNECTION=sync`
- `LOG_CHANNEL=stderr`

## 8) Despliegue del backend en Render

Crear un `Web Service` con:

- Runtime: `Docker`
- Root Directory: `backend`
- Dockerfile Path: `Dockerfile`

El repositorio ya incluye:

- `backend/Dockerfile`
- `backend/.dockerignore`

## 9) Base de datos en Railway

1. Crear servicio MySQL en Railway.
2. Copiar credenciales (`host`, `port`, `database`, `user`, `password`).
3. Cargar esas credenciales en variables de entorno de Render.
4. Ejecutar migraciones/seed en deploy (`php artisan migrate --force` y opcional `php artisan db:seed --force`).

## 10) Usuario admin inicial

Se crea desde `backend/database/seeders/DatabaseSeeder.php`:

- Email: `admin@totem.local`
- Password: `Totem2026*`

## 11) Calidad y pruebas

Frontend:

- `npm run quality`

Backend:

- `composer quality`

## 12) Documentacion detallada

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- API y troubleshooting: `backend/docs/API.md`

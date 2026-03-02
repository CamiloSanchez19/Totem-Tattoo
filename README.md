


# Totem — Documentación del proyecto

Proyecto full stack con frontend en React (Vite) y backend API en Laravel.

## 1) Estructura del repositorio

- `frontend/`: aplicación React para web pública (portafolio, reservas, productos, checkout) y panel admin.
- `backend/`: API REST en Laravel para autenticación admin, catálogo, reservas, compras y ventas.

## 2) Tecnologías

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

## 3) Requisitos

- Node.js 20+
- npm 10+
- PHP 8.2+
- Composer 2+
- MySQL 8+

## 4) Configuración rápida (primera vez)

### Backend
1. Ir a `backend/`
2. Instalar dependencias: `composer install`
3. Copiar env: `copy .env.example .env` (si no existe)
4. Generar key: `php artisan key:generate`
5. Configurar base de datos en `.env`
6. Ejecutar migraciones y seeders:
   - `php artisan migrate`
   - `php artisan db:seed`

### Frontend
1. Ir a `frontend/`
2. Instalar dependencias: `npm install`
3. Verificar `.env` con:
   - `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

## 5) Cómo ejecutar el proyecto (desarrollo)

Usar 2 terminales.

### Terminal 1 (backend)
```bash
cd backend
php -S 127.0.0.1:8000 -t public
```

### Terminal 2 (frontend)
```bash
cd frontend
npm run dev
```

Abrir la URL que muestra Vite (normalmente `http://127.0.0.1:5173`).

## 6) Usuario admin inicial

Se crea desde `DatabaseSeeder`:

- Email: `admin@totem.local`
- Password: `Totem2026*`

## 7) Calidad y pruebas

### Frontend
- Lint + build: `npm run quality`

### Backend
- Tests: `composer quality`

## 8) Documentación detallada

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- API y troubleshooting: `backend/docs/API.md`

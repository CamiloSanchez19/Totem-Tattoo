# Backend Totem (Laravel API)

API REST para gestión de productos, reservas, compras y ventas, con autenticación de administrador por token.

## 1) Arquitectura

- Framework: Laravel 12
- Base de datos: MySQL
- Autenticación admin: token propio (`tokens_api_admin`)
- Middleware: `admin.api.auth`
- Rutas API: `routes/api.php`

## 2) Módulos principales

- **Auth admin**: login, sesión actual, logout.
- **Dashboard**: estadísticas agregadas de negocio.
- **Productos**: catálogo público y CRUD admin.
- **Reservas**: creación pública + gestión admin.
- **Compras**: CRUD y cambio de estado.
- **Ventas**: creación pública y consulta admin.

## 3) Estructura relevante

- `app/Http/Controllers/Api/`: controladores públicos.
- `app/Http/Controllers/Api/Admin/`: controladores del panel.
- `app/Http/Middleware/AdminApiAuth.php`: validación Bearer token admin.
- `app/Models/`: entidades (`Product`, `Reservation`, `Purchase`, `Sale`, `SaleItem`, `AdminApiToken`, `User`).
- `database/migrations/`: esquema de BD.
- `database/seeders/DatabaseSeeder.php`: usuario admin inicial.

## 4) Instalación

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Configurar en `.env`:

- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=administrador` (o tu DB)
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

Ejecutar:

```bash
php artisan migrate
php artisan db:seed
```

## 5) Ejecución en desarrollo

En este proyecto, para mayor estabilidad local, usar:

```bash
php -S 127.0.0.1:8000 -t public
```

## 6) Usuario admin por defecto

- Email: `admin@totem.local`
- Password: `Totem2026*`

## 7) Calidad y pruebas

```bash
composer quality
```

Actualmente ejecuta pruebas con Pest.

## 8) Optimización de base de datos

Se agregaron índices para consultas frecuentes en migración:

- `database/migrations/2026_03_01_000400_add_performance_indexes.php`

Incluye índices en:

- `productos`: `activo`, `existencias`, (`activo`, `categoria`)
- `reservas`: `estado`, `fecha`, (`estado`, `fecha`)
- `compras`: `estado`, `fecha`
- `ventas`: `estado`, `creado_en`
- `ventas_items`: (`venta_id`, `producto_id`)
- `tokens_api_admin`: `expira_en`

## 9) Flujo de autenticación admin

1. `POST /api/admin/login` con email/password.
2. Backend valida credenciales y `is_admin`.
3. Devuelve token plano.
4. Frontend envía `Authorization: Bearer <token>` en endpoints admin.
5. Middleware valida token hash, expiración y rol admin.

## 10) Referencia de endpoints

Ver `backend/docs/API.md`.

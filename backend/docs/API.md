# API Totem (Backend)

Base URL local:

- `http://127.0.0.1:8000/api`

## 1) Endpoints públicos

### `GET /productos`
Retorna catálogo activo.

### `POST /reservas`
Crea una reserva pública.

Campos esperados (resumen):
- `name`, `email`, `phone`
- `body_zone`, `size_cm`, `style`, `color`
- `preferred_dates[]`
- `reference_images[]` (opcional)

### `POST /ventas`
Registra una venta pública con descuento de stock transaccional.

Campos esperados (resumen):
- `firstName`, `lastName`, `email`, `phone`
- `address`, `city`, `state`, `zipCode`
- `cardName`
- `items[]` con `id` y `quantity`

## 2) Endpoints admin (autenticación)

### `POST /admin/login`
Body:
```json
{
  "email": "admin@totem.local",
  "password": "Totem2026*"
}
```

Respuesta exitosa:
```json
{
  "message": "Login exitoso",
  "token": "...",
  "user": {
    "id": 1,
    "name": "Admin Totem",
    "email": "admin@totem.local"
  }
}
```

### `GET /admin/me`
Requiere `Authorization: Bearer <token>`.

### `POST /admin/logout`
Invalida token actual.

## 3) Endpoints admin (negocio)

Todos requieren Bearer token.

### Dashboard
- `GET /admin/dashboard/stats`

### Productos
- `GET /admin/products`
- `POST /admin/products`
- `GET /admin/products/{id}`
- `PUT /admin/products/{id}`
- `DELETE /admin/products/{id}`

### Reservas
- `GET /admin/reservations`
- `POST /admin/reservations`
- `GET /admin/reservations/{id}`
- `PUT /admin/reservations/{id}`
- `DELETE /admin/reservations/{id}`
- `PATCH /admin/reservations/{id}/status`

### Compras
- `GET /admin/purchases`
- `POST /admin/purchases`
- `GET /admin/purchases/{id}`
- `PUT /admin/purchases/{id}`
- `DELETE /admin/purchases/{id}`
- `PATCH /admin/purchases/{id}/status`

### Ventas
- `GET /admin/sales`
- `GET /admin/sales/{id}`
- `DELETE /admin/sales/{id}`

## 4) Códigos comunes

- `200`: OK
- `201`: Recurso creado
- `401`: Token faltante/inválido/expirado
- `403`: Usuario sin permisos admin
- `422`: Error de validación o credenciales inválidas

## 5) Troubleshooting rápido

## No puedo iniciar sesión

1. Confirmar backend arriba en `127.0.0.1:8000`.
2. Verificar admin seed:
   - email `admin@totem.local`
   - password `Totem2026*`
3. Confirmar que `users.is_admin = 1` para ese correo.
4. Borrar token viejo en navegador (`localStorage`, key `totem_admin_token`).

## `php artisan serve` falla

Si falla localmente, usar:

```bash
php -S 127.0.0.1:8000 -t public
```

## Frontend no conecta al backend

Verificar en `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

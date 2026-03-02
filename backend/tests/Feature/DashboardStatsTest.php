<?php

use App\Models\AdminApiToken;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Reservation;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

it('retorna estadisticas de dashboard con autenticacion admin', function (): void {
    Product::query()->create([
        'nombre' => 'Producto 1',
        'categoria' => 'Cat A',
        'descripcion' => null,
        'imagen' => null,
        'precio' => 100,
        'existencias' => 3,
        'activo' => true,
    ]);

    Product::query()->create([
        'nombre' => 'Producto 2',
        'categoria' => 'Cat B',
        'descripcion' => null,
        'imagen' => null,
        'precio' => 200,
        'existencias' => 30,
        'activo' => false,
    ]);

    Reservation::query()->create([
        'cliente' => 'Cliente A',
        'telefono' => '3000000000',
        'artista' => 'Por asignar',
        'fecha' => now()->addDay(),
        'servicio' => 'Linea fina',
        'estado' => 'Pendiente',
    ]);

    Reservation::query()->create([
        'cliente' => 'Cliente B',
        'telefono' => '3111111111',
        'artista' => 'Por asignar',
        'fecha' => now()->addDays(2),
        'servicio' => 'Sombreado',
        'estado' => 'Confirmada',
    ]);

    Purchase::query()->create([
        'proveedor' => 'Proveedor A',
        'fecha' => now()->toDateString(),
        'total' => 1000,
        'estado' => 'Pendiente',
        'detalle' => null,
    ]);

    Sale::query()->create([
        'cliente' => 'Cliente Venta',
        'email' => 'venta@example.com',
        'telefono' => '3222222222',
        'direccion' => 'Calle 5',
        'ciudad' => 'Cali',
        'departamento' => 'Valle',
        'codigo_postal' => '760001',
        'total' => 1500,
        'estado' => 'Pagada',
        'detalles_pago' => ['metodo' => 'Tarjeta'],
    ]);

    $user = User::factory()->create([
        'is_admin' => true,
    ]);

    $plainToken = Str::random(64);

    AdminApiToken::query()->create([
        'user_id' => $user->id,
        'nombre' => 'dashboard',
        'token' => hash('sha256', $plainToken),
        'expira_en' => now()->addDay(),
    ]);

    $response = $this->withHeaders([
        'Authorization' => "Bearer {$plainToken}",
    ])->getJson('/api/admin/dashboard/stats');

    $response->assertOk();
    $response->assertJsonPath('stats.totalProducts', 2);
    $response->assertJsonPath('stats.activeProducts', 1);
    $response->assertJsonPath('stats.lowStockProducts', 1);
    $response->assertJsonPath('stats.totalReservations', 2);
    $response->assertJsonPath('stats.pendingReservations', 1);
    $response->assertJsonPath('stats.confirmedReservations', 1);
    $response->assertJsonPath('stats.totalPurchases', 1);
    $response->assertJsonPath('stats.pendingPurchases', 1);
    $response->assertJsonPath('stats.purchasesTotalAmount', 1000);
    $response->assertJsonPath('stats.totalSales', 1);
    $response->assertJsonPath('stats.paidSales', 1);
    $response->assertJsonPath('stats.salesTotalAmount', 1500);
});

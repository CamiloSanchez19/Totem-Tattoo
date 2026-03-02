<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('registra una venta y descuenta stock', function (): void {
    $product = Product::query()->create([
        'nombre' => 'Tinta Premium',
        'categoria' => 'Insumos',
        'descripcion' => 'Tinta negra',
        'imagen' => null,
        'precio' => 100000,
        'existencias' => 10,
        'activo' => true,
    ]);

    $response = $this->postJson('/api/ventas', [
        'firstName' => 'Ana',
        'lastName' => 'Pérez',
        'email' => 'ana@example.com',
        'phone' => '3000000000',
        'address' => 'Calle 1 #2-3',
        'city' => 'Bogotá',
        'state' => 'Cundinamarca',
        'zipCode' => '110111',
        'cardName' => 'Ana Perez',
        'items' => [
            ['id' => $product->id, 'quantity' => 2],
            ['id' => $product->id, 'quantity' => 1],
        ],
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.estado', 'Pagada');
    $response->assertJsonPath('data.total', 300000);

    $saleId = $response->json('data.id');

    $this->assertDatabaseHas('ventas', [
        'id' => $saleId,
        'cliente' => 'Ana Pérez',
        'estado' => 'Pagada',
    ]);

    $this->assertDatabaseHas('ventas_items', [
        'venta_id' => $saleId,
        'producto_id' => $product->id,
        'cantidad' => 3,
    ]);

    $this->assertDatabaseHas('productos', [
        'id' => $product->id,
        'existencias' => 7,
    ]);
});

it('rechaza ventas con stock insuficiente sin generar registros parciales', function (): void {
    $product = Product::query()->create([
        'nombre' => 'Fuente de poder',
        'categoria' => 'Equipos',
        'descripcion' => null,
        'imagen' => null,
        'precio' => 50000,
        'existencias' => 1,
        'activo' => true,
    ]);

    $response = $this->postJson('/api/ventas', [
        'firstName' => 'Luis',
        'lastName' => 'Gómez',
        'email' => 'luis@example.com',
        'phone' => '3111111111',
        'address' => 'Carrera 10 #20-30',
        'city' => 'Medellín',
        'state' => 'Antioquia',
        'zipCode' => '050001',
        'cardName' => 'Luis Gomez',
        'items' => [
            ['id' => $product->id, 'quantity' => 2],
        ],
    ]);

    $response->assertStatus(422);

    $this->assertDatabaseCount('ventas', 0);
    $this->assertDatabaseCount('ventas_items', 0);
    $this->assertDatabaseHas('productos', [
        'id' => $product->id,
        'existencias' => 1,
    ]);
});

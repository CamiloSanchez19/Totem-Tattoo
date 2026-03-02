<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\PurchaseController;
use App\Http\Controllers\Api\Admin\ReservationController;
use App\Http\Controllers\Api\Admin\SaleController;
use App\Http\Controllers\Api\PublicReservationController;
use App\Http\Controllers\Api\PublicSaleController;
use Illuminate\Support\Facades\Route;

Route::get('/productos', [ProductController::class, 'catalogo']);
Route::post('/reservas', [PublicReservationController::class, 'store']);
Route::post('/ventas', [PublicSaleController::class, 'store']);

Route::prefix('admin')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('admin.api.auth')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        Route::apiResource('products', ProductController::class);

        Route::apiResource('reservations', ReservationController::class);
        Route::patch('reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);

        Route::apiResource('purchases', PurchaseController::class);
        Route::patch('purchases/{purchase}/status', [PurchaseController::class, 'updateStatus']);

        Route::apiResource('sales', SaleController::class)->only(['index', 'show', 'destroy']);
    });
});

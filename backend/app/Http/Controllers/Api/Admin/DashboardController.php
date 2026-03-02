<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Reservation;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $productStats = Product::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN activo = ? THEN 1 ELSE 0 END) as activos', [1])
            ->selectRaw('SUM(CASE WHEN existencias <= ? THEN 1 ELSE 0 END) as bajo_stock', [5])
            ->first();

        $reservationStats = Reservation::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN estado = ? THEN 1 ELSE 0 END) as pendientes', ['Pendiente'])
            ->selectRaw('SUM(CASE WHEN estado = ? THEN 1 ELSE 0 END) as confirmadas', ['Confirmada'])
            ->first();

        $purchaseStats = Purchase::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN estado = ? THEN 1 ELSE 0 END) as pendientes', ['Pendiente'])
            ->selectRaw('COALESCE(SUM(total), 0) as monto_total')
            ->first();

        $saleStats = Sale::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN estado = ? THEN 1 ELSE 0 END) as pagadas', ['Pagada'])
            ->selectRaw('COALESCE(SUM(total), 0) as monto_total')
            ->first();

        return response()->json([
            'stats' => [
                'totalProducts' => (int) ($productStats->total ?? 0),
                'activeProducts' => (int) ($productStats->activos ?? 0),
                'lowStockProducts' => (int) ($productStats->bajo_stock ?? 0),
                'totalReservations' => (int) ($reservationStats->total ?? 0),
                'pendingReservations' => (int) ($reservationStats->pendientes ?? 0),
                'confirmedReservations' => (int) ($reservationStats->confirmadas ?? 0),
                'totalPurchases' => (int) ($purchaseStats->total ?? 0),
                'pendingPurchases' => (int) ($purchaseStats->pendientes ?? 0),
                'purchasesTotalAmount' => (float) ($purchaseStats->monto_total ?? 0),
                'totalSales' => (int) ($saleStats->total ?? 0),
                'paidSales' => (int) ($saleStats->pagadas ?? 0),
                'salesTotalAmount' => (float) ($saleStats->monto_total ?? 0),
            ],
        ]);
    }
}

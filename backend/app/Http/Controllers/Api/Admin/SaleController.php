<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    public function index(): JsonResponse
    {
        $sales = Sale::query()
            ->with('items')
            ->latest('id')
            ->get()
            ->map(fn (Sale $sale) => $this->mapSale($sale));

        return response()->json(['data' => $sales]);
    }

    public function show(Sale $sale): JsonResponse
    {
        $sale->load('items');

        return response()->json(['data' => $this->mapSale($sale)]);
    }

    public function destroy(Sale $sale): JsonResponse
    {
        $sale->delete();

        return response()->json(['message' => 'Venta eliminada']);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapSale(Sale $sale): array
    {
        return [
            'id' => $sale->id,
            'cliente' => $sale->cliente,
            'email' => $sale->email,
            'telefono' => $sale->telefono,
            'direccion' => $sale->direccion,
            'ciudad' => $sale->ciudad,
            'departamento' => $sale->departamento,
            'codigo_postal' => $sale->codigo_postal,
            'total' => (float) $sale->total,
            'estado' => $sale->estado,
            'detalles_pago' => $sale->detalles_pago,
            'items' => $sale->items->map(fn (SaleItem $item) => [
                'id' => $item->id,
                'producto_id' => $item->producto_id,
                'nombre_producto' => $item->nombre_producto,
                'precio_unitario' => (float) $item->precio_unitario,
                'cantidad' => (int) $item->cantidad,
                'subtotal' => (float) $item->subtotal,
            ])->values(),
            'creado_en' => $sale->creado_en,
            'actualizado_en' => $sale->actualizado_en,
        ];
    }
}

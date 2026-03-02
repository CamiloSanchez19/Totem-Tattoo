<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class PublicSaleController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:100'],
            'lastName' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'zipCode' => ['required', 'string', 'max:30'],
            'cardName' => ['required', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $sale = DB::transaction(function () use ($validated): Sale {
            /** @var Collection<int, int> $itemsByProduct */
            $itemsByProduct = collect($validated['items'])
                ->groupBy('id')
                ->map(fn (Collection $items) => $items->sum(fn (array $item) => (int) $item['quantity']));

            $productIds = $itemsByProduct->keys()->map(fn (mixed $id) => (int) $id)->values();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $total = 0;
            $itemsPayload = [];

            foreach ($itemsByProduct as $productId => $quantity) {
                $product = $products->get((int) $productId);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'Uno o más productos ya no están disponibles.',
                    ]);
                }

                if (! $product->activo) {
                    throw ValidationException::withMessages([
                        'items' => "El producto {$product->nombre} no está disponible para venta.",
                    ]);
                }

                if ($product->existencias < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Stock insuficiente para {$product->nombre}. Disponible: {$product->existencias}.",
                    ]);
                }

                $unitPrice = (float) $product->precio;
                $subtotal = $unitPrice * $quantity;
                $total += $subtotal;

                $itemsPayload[] = [
                    'producto_id' => $product->id,
                    'nombre_producto' => $product->nombre,
                    'precio_unitario' => $unitPrice,
                    'cantidad' => $quantity,
                    'subtotal' => $subtotal,
                ];

                $product->decrement('existencias', $quantity);
            }

            $sale = Sale::query()->create([
                'cliente' => trim($validated['firstName'] . ' ' . $validated['lastName']),
                'email' => $validated['email'],
                'telefono' => $validated['phone'],
                'direccion' => $validated['address'],
                'ciudad' => $validated['city'],
                'departamento' => $validated['state'],
                'codigo_postal' => $validated['zipCode'],
                'total' => $total,
                'estado' => 'Pagada',
                'detalles_pago' => [
                    'metodo' => 'Tarjeta',
                    'titular' => $validated['cardName'],
                ],
            ]);

            foreach ($itemsPayload as $itemData) {
                $sale->items()->create($itemData);
            }

            return $sale->load('items');
        });

        return response()->json([
            'message' => 'Venta registrada correctamente',
            'data' => [
                'id' => $sale->id,
                'total' => (float) $sale->total,
                'estado' => $sale->estado,
            ],
        ], 201);
    }
}

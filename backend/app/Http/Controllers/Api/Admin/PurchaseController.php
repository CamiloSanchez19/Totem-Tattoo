<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index(): JsonResponse
    {
        $purchases = Purchase::query()
            ->latest('id')
            ->get()
            ->map(fn (Purchase $purchase) => $this->mapPurchase($purchase));

        return response()->json(['data' => $purchases]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'proveedor' => ['required', 'string', 'max:255'],
            'fecha' => ['required', 'date'],
            'total' => ['required', 'numeric', 'min:0.01'],
            'estado' => ['nullable', 'string', 'in:Pendiente,Recibida,Cancelada'],
            'detalle' => ['nullable', 'string'],
        ]);

        $purchase = Purchase::query()->create([
            'proveedor' => $validated['proveedor'],
            'fecha' => $validated['fecha'],
            'total' => $validated['total'],
            'estado' => $validated['estado'] ?? 'Pendiente',
            'detalle' => $validated['detalle'] ?? null,
        ]);

        return response()->json([
            'message' => 'Compra registrada',
            'data' => $this->mapPurchase($purchase),
        ], 201);
    }

    public function show(Purchase $purchase): JsonResponse
    {
        return response()->json(['data' => $this->mapPurchase($purchase)]);
    }

    public function update(Request $request, Purchase $purchase): JsonResponse
    {
        $validated = $request->validate([
            'proveedor' => ['required', 'string', 'max:255'],
            'fecha' => ['required', 'date'],
            'total' => ['required', 'numeric', 'min:0.01'],
            'estado' => ['nullable', 'string', 'in:Pendiente,Recibida,Cancelada'],
            'detalle' => ['nullable', 'string'],
        ]);

        $purchase->update([
            'proveedor' => $validated['proveedor'],
            'fecha' => $validated['fecha'],
            'total' => $validated['total'],
            'estado' => $validated['estado'] ?? 'Pendiente',
            'detalle' => $validated['detalle'] ?? null,
        ]);

        return response()->json([
            'message' => 'Compra actualizada',
            'data' => $this->mapPurchase($purchase),
        ]);
    }

    public function destroy(Purchase $purchase): JsonResponse
    {
        $purchase->delete();

        return response()->json(['message' => 'Compra eliminada']);
    }

    public function updateStatus(Request $request, Purchase $purchase): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', 'string', 'in:Pendiente,Recibida,Cancelada'],
        ]);

        $purchase->update(['estado' => $validated['estado']]);

        return response()->json([
            'message' => 'Estado de compra actualizado',
            'data' => $this->mapPurchase($purchase),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapPurchase(Purchase $purchase): array
    {
        return [
            'id' => $purchase->id,
            'proveedor' => $purchase->proveedor,
            'fecha' => optional($purchase->fecha)->format('Y-m-d'),
            'total' => (float) $purchase->total,
            'estado' => $purchase->estado,
            'detalle' => $purchase->detalle,
            'creado_en' => $purchase->creado_en,
            'actualizado_en' => $purchase->actualizado_en,
        ];
    }
}

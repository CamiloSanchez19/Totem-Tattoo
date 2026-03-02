<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function catalogo(): JsonResponse
    {
        $products = Product::query()
            ->where('activo', true)
            ->latest('id')
            ->get()
            ->map(fn (Product $product) => $this->mapProduct($product));

        return response()->json(['data' => $products]);
    }

    public function index(): JsonResponse
    {
        $products = Product::query()
            ->latest('id')
            ->get()
            ->map(fn (Product $product) => $this->mapProduct($product));

        return response()->json(['data' => $products]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'imagen' => ['nullable', 'string', 'max:2048'],
            'precio' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $product = Product::query()->create([
            'nombre' => $validated['nombre'],
            'categoria' => $validated['categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'imagen' => $validated['imagen'] ?? null,
            'precio' => $validated['precio'],
            'existencias' => $validated['stock'],
            'activo' => $validated['activo'] ?? true,
        ]);

        return response()->json([
            'message' => 'Producto creado',
            'data' => $this->mapProduct($product),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['data' => $this->mapProduct($product)]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'imagen' => ['nullable', 'string', 'max:2048'],
            'precio' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $product->update([
            'nombre' => $validated['nombre'],
            'categoria' => $validated['categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'imagen' => $validated['imagen'] ?? null,
            'precio' => $validated['precio'],
            'existencias' => $validated['stock'],
            'activo' => $validated['activo'] ?? true,
        ]);

        return response()->json([
            'message' => 'Producto actualizado',
            'data' => $this->mapProduct($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'nombre' => $product->nombre,
            'categoria' => $product->categoria,
            'descripcion' => $product->descripcion,
            'imagen' => $product->imagen,
            'precio' => (float) $product->precio,
            'stock' => $product->existencias,
            'activo' => $product->activo,
            'creado_en' => $product->creado_en,
            'actualizado_en' => $product->actualizado_en,
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            'imagen' => ['nullable', 'image', 'max:4096'],
            'imagen_url' => ['nullable', 'url', 'max:2048'],
            'imagen_actual' => ['nullable', 'string', 'max:2048'],
            'precio' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $imagePath = $this->resolveImagePathFromRequest(
            $request,
            $validated['imagen_actual'] ?? null,
            $validated['imagen_url'] ?? null
        );

        $product = Product::query()->create([
            'nombre' => $validated['nombre'],
            'categoria' => $validated['categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'imagen' => $imagePath,
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
            'imagen' => ['nullable', 'image', 'max:4096'],
            'imagen_url' => ['nullable', 'url', 'max:2048'],
            'imagen_actual' => ['nullable', 'string', 'max:2048'],
            'precio' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $imagePath = $this->resolveImagePathFromRequest(
            $request,
            $validated['imagen_actual'] ?? $product->imagen,
            $validated['imagen_url'] ?? null
        );

        if (($request->hasFile('imagen') || !empty($validated['imagen_url'])) && $this->isStoredPublicPath($product->imagen)) {
            Storage::disk('public')->delete($product->imagen);
        }

        $product->update([
            'nombre' => $validated['nombre'],
            'categoria' => $validated['categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'imagen' => $imagePath,
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
        if ($this->isStoredPublicPath($product->imagen)) {
            Storage::disk('public')->delete($product->imagen);
        }

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
            'imagen' => $this->resolveImageUrl($product->imagen),
            'precio' => (float) $product->precio,
            'stock' => $product->existencias,
            'activo' => $product->activo,
            'creado_en' => $product->creado_en,
            'actualizado_en' => $product->actualizado_en,
        ];
    }

    private function resolveImagePathFromRequest(Request $request, ?string $fallbackImage, ?string $imageUrl): ?string
    {
        if ($request->hasFile('imagen')) {
            return $request->file('imagen')->store('productos', 'public');
        }

        if ($imageUrl) {
            return $imageUrl;
        }

        return $fallbackImage;
    }

    private function resolveImageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        return Storage::disk('public')->url($image);
    }

    private function isStoredPublicPath(?string $image): bool
    {
        if (!$image) {
            return false;
        }

        return !Str::startsWith($image, ['http://', 'https://', '/']);
    }
}

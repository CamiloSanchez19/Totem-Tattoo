<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class PublicReservationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'body_zone' => ['required', 'string', 'max:100'],
            'size_cm' => ['required', 'string', 'max:100'],
            'style' => ['required', 'string', 'max:100'],
            'color' => ['required', 'string', 'max:100'],
            'preferred_dates' => ['required', 'array', 'min:1'],
            'preferred_dates.*' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'reference_images' => ['nullable', 'array', 'max:3'],
            'reference_images.*' => ['file', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $firstPreferredDate = $validated['preferred_dates'][0];
        $scheduledAt = $firstPreferredDate . ' 10:00:00';

        $serviceSummary = sprintf(
            '%s | Zona: %s | Tamaño: %s | Color: %s | Email: %s',
            $validated['style'],
            $validated['body_zone'],
            $validated['size_cm'],
            $validated['color'],
            $validated['email']
        );

        $serviceDetails = [
            'estilo' => $validated['style'],
            'zona' => $validated['body_zone'],
            'tamano' => $validated['size_cm'],
            'color' => $validated['color'],
            'email' => $validated['email'],
        ];

        $referenceImagePaths = [];
        $imageFiles = Arr::wrap($request->file('reference_images', []));

        foreach ($imageFiles as $imageFile) {
            if (! $imageFile) {
                continue;
            }

            $referenceImagePaths[] = $imageFile->store('reservas/referencias', 'public');
        }

        $reservation = Reservation::query()->create([
            'cliente' => $validated['name'],
            'telefono' => $validated['phone'],
            'artista' => 'Por asignar',
            'fecha' => $scheduledAt,
            'servicio' => mb_substr($serviceSummary, 0, 255),
            'servicio_detalle' => $serviceDetails,
            'fechas_preferidas' => array_values($validated['preferred_dates']),
            'referencias_imagenes' => $referenceImagePaths,
            'estado' => 'Pendiente',
        ]);

        return response()->json([
            'message' => 'Reserva recibida correctamente',
            'data' => [
                'id' => $reservation->id,
                'estado' => $reservation->estado,
                'referencias_imagenes_urls' => collect($referenceImagePaths)
                    ->map(fn (string $path) => url(Storage::disk('public')->url($path)))
                    ->values(),
            ],
        ], 201);
    }
}

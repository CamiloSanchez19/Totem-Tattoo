<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    public function index(): JsonResponse
    {
        $reservations = Reservation::query()
            ->latest('id')
            ->get()
            ->map(fn (Reservation $reservation) => $this->mapReservation($reservation));

        return response()->json(['data' => $reservations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente' => ['required', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:50'],
            'artista' => ['required', 'string', 'max:255'],
            'fecha' => ['required', 'date'],
            'servicio' => ['required', 'string', 'max:255'],
            'estado' => ['nullable', 'string', 'in:Pendiente,Confirmada,Reprogramada,Cancelada'],
        ]);

        $reservation = Reservation::query()->create([
            'cliente' => $validated['cliente'],
            'telefono' => $validated['telefono'],
            'artista' => $validated['artista'],
            'fecha' => $validated['fecha'],
            'servicio' => $validated['servicio'],
            'estado' => $validated['estado'] ?? 'Pendiente',
        ]);

        return response()->json([
            'message' => 'Reserva creada',
            'data' => $this->mapReservation($reservation),
        ], 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json(['data' => $this->mapReservation($reservation)]);
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'cliente' => ['required', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:50'],
            'artista' => ['required', 'string', 'max:255'],
            'fecha' => ['required', 'date'],
            'servicio' => ['required', 'string', 'max:255'],
            'estado' => ['nullable', 'string', 'in:Pendiente,Confirmada,Reprogramada,Cancelada'],
        ]);

        $reservation->update([
            'cliente' => $validated['cliente'],
            'telefono' => $validated['telefono'],
            'artista' => $validated['artista'],
            'fecha' => $validated['fecha'],
            'servicio' => $validated['servicio'],
            'estado' => $validated['estado'] ?? 'Pendiente',
        ]);

        return response()->json([
            'message' => 'Reserva actualizada',
            'data' => $this->mapReservation($reservation),
        ]);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->json(['message' => 'Reserva eliminada']);
    }

    public function updateStatus(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', 'string', 'in:Pendiente,Confirmada,Reprogramada,Cancelada'],
        ]);

        $reservation->update(['estado' => $validated['estado']]);

        return response()->json([
            'message' => 'Estado de la reserva actualizado',
            'data' => $this->mapReservation($reservation),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapReservation(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'cliente' => $reservation->cliente,
            'telefono' => $reservation->telefono,
            'artista' => $reservation->artista,
            'fecha' => optional($reservation->fecha)->format('Y-m-d\\TH:i'),
            'servicio' => $reservation->servicio,
            'servicio_detalle' => $reservation->servicio_detalle ?? null,
            'fechas_preferidas' => $reservation->fechas_preferidas ?? [],
            'estado' => $reservation->estado,
            'referencias_imagenes' => $reservation->referencias_imagenes ?? [],
            'referencias_imagenes_urls' => collect($reservation->referencias_imagenes ?? [])
                ->map(fn (string $path) => url(Storage::disk('public')->url($path)))
                ->values(),
            'creado_en' => $reservation->creado_en,
            'actualizado_en' => $reservation->actualizado_en,
        ];
    }
}

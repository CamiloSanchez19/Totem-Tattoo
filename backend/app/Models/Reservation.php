<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    public const CREATED_AT = 'creado_en';

    public const UPDATED_AT = 'actualizado_en';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'cliente',
        'telefono',
        'artista',
        'fecha',
        'servicio',
        'servicio_detalle',
        'fechas_preferidas',
        'referencias_imagenes',
        'estado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'datetime',
            'servicio_detalle' => 'array',
            'fechas_preferidas' => 'array',
            'referencias_imagenes' => 'array',
        ];
    }
}

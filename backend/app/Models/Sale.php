<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    public const CREATED_AT = 'creado_en';

    public const UPDATED_AT = 'actualizado_en';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'cliente',
        'email',
        'telefono',
        'direccion',
        'ciudad',
        'departamento',
        'codigo_postal',
        'total',
        'estado',
        'detalles_pago',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'detalles_pago' => 'array',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class, 'venta_id');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table): void {
            $table->index('activo', 'productos_activo_idx');
            $table->index('existencias', 'productos_existencias_idx');
            $table->index(['activo', 'categoria'], 'productos_activo_categoria_idx');
        });

        Schema::table('reservas', function (Blueprint $table): void {
            $table->index('estado', 'reservas_estado_idx');
            $table->index('fecha', 'reservas_fecha_idx');
            $table->index(['estado', 'fecha'], 'reservas_estado_fecha_idx');
        });

        Schema::table('compras', function (Blueprint $table): void {
            $table->index('estado', 'compras_estado_idx');
            $table->index('fecha', 'compras_fecha_idx');
        });

        Schema::table('ventas', function (Blueprint $table): void {
            $table->index('estado', 'ventas_estado_idx');
            $table->index('creado_en', 'ventas_creado_en_idx');
        });

        Schema::table('ventas_items', function (Blueprint $table): void {
            $table->index(['venta_id', 'producto_id'], 'ventas_items_venta_producto_idx');
        });

        Schema::table('tokens_api_admin', function (Blueprint $table): void {
            $table->index('expira_en', 'tokens_api_admin_expira_en_idx');
        });
    }

    public function down(): void
    {
        Schema::table('tokens_api_admin', function (Blueprint $table): void {
            $table->dropIndex('tokens_api_admin_expira_en_idx');
        });

        Schema::table('ventas_items', function (Blueprint $table): void {
            $table->dropIndex('ventas_items_venta_producto_idx');
        });

        Schema::table('ventas', function (Blueprint $table): void {
            $table->dropIndex('ventas_estado_idx');
            $table->dropIndex('ventas_creado_en_idx');
        });

        Schema::table('compras', function (Blueprint $table): void {
            $table->dropIndex('compras_estado_idx');
            $table->dropIndex('compras_fecha_idx');
        });

        Schema::table('reservas', function (Blueprint $table): void {
            $table->dropIndex('reservas_estado_idx');
            $table->dropIndex('reservas_fecha_idx');
            $table->dropIndex('reservas_estado_fecha_idx');
        });

        Schema::table('productos', function (Blueprint $table): void {
            $table->dropIndex('productos_activo_idx');
            $table->dropIndex('productos_existencias_idx');
            $table->dropIndex('productos_activo_categoria_idx');
        });
    }
};

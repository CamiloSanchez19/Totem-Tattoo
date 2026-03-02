<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('products') && ! Schema::hasTable('productos')) {
            Schema::rename('products', 'productos');
        }

        if (Schema::hasTable('reservations') && ! Schema::hasTable('reservas')) {
            Schema::rename('reservations', 'reservas');
        }

        if (Schema::hasTable('purchases') && ! Schema::hasTable('compras')) {
            Schema::rename('purchases', 'compras');
        }

        if (Schema::hasTable('admin_api_tokens') && ! Schema::hasTable('tokens_api_admin')) {
            Schema::rename('admin_api_tokens', 'tokens_api_admin');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('productos') && ! Schema::hasTable('products')) {
            Schema::rename('productos', 'products');
        }

        if (Schema::hasTable('reservas') && ! Schema::hasTable('reservations')) {
            Schema::rename('reservas', 'reservations');
        }

        if (Schema::hasTable('compras') && ! Schema::hasTable('purchases')) {
            Schema::rename('compras', 'purchases');
        }

        if (Schema::hasTable('tokens_api_admin') && ! Schema::hasTable('admin_api_tokens')) {
            Schema::rename('tokens_api_admin', 'admin_api_tokens');
        }
    }
};

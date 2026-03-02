<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table): void {
            $table->json('servicio_detalle')->nullable()->after('servicio');
            $table->json('fechas_preferidas')->nullable()->after('servicio_detalle');
        });
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table): void {
            $table->dropColumn(['servicio_detalle', 'fechas_preferidas']);
        });
    }
};

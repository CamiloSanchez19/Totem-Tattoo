<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table): void {
            $table->id();
            $table->string('cliente');
            $table->string('email');
            $table->string('telefono', 50);
            $table->string('direccion');
            $table->string('ciudad', 100);
            $table->string('departamento', 100);
            $table->string('codigo_postal', 30);
            $table->decimal('total', 12, 2);
            $table->string('estado', 50)->default('Pagada');
            $table->json('detalles_pago')->nullable();
            $table->timestamp('creado_en')->nullable();
            $table->timestamp('actualizado_en')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'name')) {
                $table->renameColumn('name', 'nombre');
            }
            if (Schema::hasColumn('products', 'category')) {
                $table->renameColumn('category', 'categoria');
            }
            if (Schema::hasColumn('products', 'price')) {
                $table->renameColumn('price', 'precio');
            }
            if (Schema::hasColumn('products', 'is_active')) {
                $table->renameColumn('is_active', 'activo');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'client_name')) {
                $table->renameColumn('client_name', 'cliente');
            }
            if (Schema::hasColumn('reservations', 'phone')) {
                $table->renameColumn('phone', 'telefono');
            }
            if (Schema::hasColumn('reservations', 'artist')) {
                $table->renameColumn('artist', 'artista');
            }
            if (Schema::hasColumn('reservations', 'scheduled_at')) {
                $table->renameColumn('scheduled_at', 'fecha');
            }
            if (Schema::hasColumn('reservations', 'service')) {
                $table->renameColumn('service', 'servicio');
            }
            if (Schema::hasColumn('reservations', 'status')) {
                $table->renameColumn('status', 'estado');
            }
        });

        Schema::table('purchases', function (Blueprint $table) {
            if (Schema::hasColumn('purchases', 'supplier')) {
                $table->renameColumn('supplier', 'proveedor');
            }
            if (Schema::hasColumn('purchases', 'purchase_date')) {
                $table->renameColumn('purchase_date', 'fecha');
            }
            if (Schema::hasColumn('purchases', 'status')) {
                $table->renameColumn('status', 'estado');
            }
            if (Schema::hasColumn('purchases', 'detail')) {
                $table->renameColumn('detail', 'detalle');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'nombre')) {
                $table->renameColumn('nombre', 'name');
            }
            if (Schema::hasColumn('products', 'categoria')) {
                $table->renameColumn('categoria', 'category');
            }
            if (Schema::hasColumn('products', 'precio')) {
                $table->renameColumn('precio', 'price');
            }
            if (Schema::hasColumn('products', 'activo')) {
                $table->renameColumn('activo', 'is_active');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'cliente')) {
                $table->renameColumn('cliente', 'client_name');
            }
            if (Schema::hasColumn('reservations', 'telefono')) {
                $table->renameColumn('telefono', 'phone');
            }
            if (Schema::hasColumn('reservations', 'artista')) {
                $table->renameColumn('artista', 'artist');
            }
            if (Schema::hasColumn('reservations', 'fecha')) {
                $table->renameColumn('fecha', 'scheduled_at');
            }
            if (Schema::hasColumn('reservations', 'servicio')) {
                $table->renameColumn('servicio', 'service');
            }
            if (Schema::hasColumn('reservations', 'estado')) {
                $table->renameColumn('estado', 'status');
            }
        });

        Schema::table('purchases', function (Blueprint $table) {
            if (Schema::hasColumn('purchases', 'proveedor')) {
                $table->renameColumn('proveedor', 'supplier');
            }
            if (Schema::hasColumn('purchases', 'fecha')) {
                $table->renameColumn('fecha', 'purchase_date');
            }
            if (Schema::hasColumn('purchases', 'estado')) {
                $table->renameColumn('estado', 'status');
            }
            if (Schema::hasColumn('purchases', 'detalle')) {
                $table->renameColumn('detalle', 'detail');
            }
        });
    }
};

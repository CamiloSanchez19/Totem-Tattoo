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
            if (Schema::hasColumn('products', 'stock')) {
                $table->renameColumn('stock', 'existencias');
            }
            if (Schema::hasColumn('products', 'created_at')) {
                $table->renameColumn('created_at', 'creado_en');
            }
            if (Schema::hasColumn('products', 'updated_at')) {
                $table->renameColumn('updated_at', 'actualizado_en');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'created_at')) {
                $table->renameColumn('created_at', 'creado_en');
            }
            if (Schema::hasColumn('reservations', 'updated_at')) {
                $table->renameColumn('updated_at', 'actualizado_en');
            }
        });

        Schema::table('purchases', function (Blueprint $table) {
            if (Schema::hasColumn('purchases', 'created_at')) {
                $table->renameColumn('created_at', 'creado_en');
            }
            if (Schema::hasColumn('purchases', 'updated_at')) {
                $table->renameColumn('updated_at', 'actualizado_en');
            }
        });

        Schema::table('admin_api_tokens', function (Blueprint $table) {
            if (Schema::hasColumn('admin_api_tokens', 'name')) {
                $table->renameColumn('name', 'nombre');
            }
            if (Schema::hasColumn('admin_api_tokens', 'last_used_at')) {
                $table->renameColumn('last_used_at', 'ultimo_uso_en');
            }
            if (Schema::hasColumn('admin_api_tokens', 'expires_at')) {
                $table->renameColumn('expires_at', 'expira_en');
            }
            if (Schema::hasColumn('admin_api_tokens', 'created_at')) {
                $table->renameColumn('created_at', 'creado_en');
            }
            if (Schema::hasColumn('admin_api_tokens', 'updated_at')) {
                $table->renameColumn('updated_at', 'actualizado_en');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'existencias')) {
                $table->renameColumn('existencias', 'stock');
            }
            if (Schema::hasColumn('products', 'creado_en')) {
                $table->renameColumn('creado_en', 'created_at');
            }
            if (Schema::hasColumn('products', 'actualizado_en')) {
                $table->renameColumn('actualizado_en', 'updated_at');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'creado_en')) {
                $table->renameColumn('creado_en', 'created_at');
            }
            if (Schema::hasColumn('reservations', 'actualizado_en')) {
                $table->renameColumn('actualizado_en', 'updated_at');
            }
        });

        Schema::table('purchases', function (Blueprint $table) {
            if (Schema::hasColumn('purchases', 'creado_en')) {
                $table->renameColumn('creado_en', 'created_at');
            }
            if (Schema::hasColumn('purchases', 'actualizado_en')) {
                $table->renameColumn('actualizado_en', 'updated_at');
            }
        });

        Schema::table('admin_api_tokens', function (Blueprint $table) {
            if (Schema::hasColumn('admin_api_tokens', 'nombre')) {
                $table->renameColumn('nombre', 'name');
            }
            if (Schema::hasColumn('admin_api_tokens', 'ultimo_uso_en')) {
                $table->renameColumn('ultimo_uso_en', 'last_used_at');
            }
            if (Schema::hasColumn('admin_api_tokens', 'expira_en')) {
                $table->renameColumn('expira_en', 'expires_at');
            }
            if (Schema::hasColumn('admin_api_tokens', 'creado_en')) {
                $table->renameColumn('creado_en', 'created_at');
            }
            if (Schema::hasColumn('admin_api_tokens', 'actualizado_en')) {
                $table->renameColumn('actualizado_en', 'updated_at');
            }
        });
    }
};

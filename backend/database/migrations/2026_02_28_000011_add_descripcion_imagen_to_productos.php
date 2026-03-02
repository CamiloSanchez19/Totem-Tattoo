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
        Schema::table('productos', function (Blueprint $table) {
            if (! Schema::hasColumn('productos', 'descripcion')) {
                $table->text('descripcion')->nullable()->after('categoria');
            }

            if (! Schema::hasColumn('productos', 'imagen')) {
                $table->string('imagen', 2048)->nullable()->after('descripcion');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos', 'imagen')) {
                $table->dropColumn('imagen');
            }

            if (Schema::hasColumn('productos', 'descripcion')) {
                $table->dropColumn('descripcion');
            }
        });
    }
};

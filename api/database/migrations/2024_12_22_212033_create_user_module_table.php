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
        Schema::create('user_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('module')->onDelete('cascade');
            $table->boolean('allow_view');
            $table->boolean('allow_create');
            $table->boolean('allow_update');
            $table->boolean('allow_delete');
            $table->timestamps();
        });

        Schema::create('user_module_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('module')->onDelete('cascade');
            $table->foreignId('module_permission_id')->constrained('module_permission')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_module');
        Schema::dropIfExists('user_module_permission');
    }
};

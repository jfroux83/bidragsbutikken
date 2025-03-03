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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->default(1);
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('street_1', 100)->nullable();
            $table->string('street_2', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('postal_code', 100)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->integer('referred_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

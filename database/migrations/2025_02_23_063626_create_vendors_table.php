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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->default(1);
            $table->string('name', 200);
            $table->string('address_1', 100)->nullable();
            $table->string('address_2', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('postal_code', 100)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->integer('receive_orders_email')->default(1);
            $table->decimal('free_shipping_amount', 10, 2)->default(0);
            $table->decimal('admin_fee', 10, 2)->default(0);
            $table->decimal('payment_fee', 10, 2)->default(0);
            $table->decimal('system_fee', 10, 2)->default(0);
            $table->decimal('contribution_fee', 10, 2)->default(0);
            $table->decimal('bonus_fee', 10, 2)->default(0);
            $table->integer('max_delivery_distance')->default(0);
            $table->string('logo', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};

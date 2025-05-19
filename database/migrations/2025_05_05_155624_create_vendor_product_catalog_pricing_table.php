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
        Schema::create('vendor_product_catalog_pricing', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendor_product_catalog_id');
            $table->foreign('vendor_product_catalog_id')->references('id')->on('vendor_product_catalogs')->onDelete('cascade');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variation_id')->nullable();
            $table->string('type', 50);
            $table->integer('status')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_product_catalog_pricing');
    }
};

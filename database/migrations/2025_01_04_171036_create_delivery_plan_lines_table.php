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
        Schema::create('delivery_plan_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('delivery_plan_header_id');
            $table->foreign('delivery_plan_header_id')->references('id')->on('delivery_plan_headers');
            $table->unsignedBigInteger('agreement_line_id');
            // $table->foreign('agreement_line_id')->references('agreement_lines_id')->on('agreement_lines');
            $table->unsignedBigInteger('product_id');
            // $table->foreign('product_id')->references('product_id')->on('product');
            $table->integer('delivery_frequency');
            $table->string('payment_option');
            $table->integer('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_plan_lines');
    }
};

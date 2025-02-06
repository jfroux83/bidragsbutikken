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
        Schema::create('delivery_plan_headers', function (Blueprint $table) {
            $table->id();
            $table->string('doc_num', 20)->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->date('created_at');
            $table->date('updated_at');
            $table->string('period', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_plan_headers');
    }
};

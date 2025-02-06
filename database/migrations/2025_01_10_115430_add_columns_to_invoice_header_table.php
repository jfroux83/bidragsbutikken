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
        Schema::table('invoice_header', function (Blueprint $table) {
            $table->dropColumn('message');
            $table->dropColumn('content');
            $table->dropColumn('invoice_creation_date');
            $table->dropForeign('fk_invoice_header_supplier');
            $table->dropColumn('supplier_supplier_id');

            $table->unsignedBigInteger('delivery_plan_header_id')->nullable();
            $table->date('created_at')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->string('payment_reference', 50)->nullable();
            $table->string('payment_link', 200)->nullable();
            $table->string('vipps_key', 50)->nullable();
            $table->string('payment_status', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_header', function (Blueprint $table) {
            $table->string('message', 2048)->nullable();
            $table->text('content')->nullable();
            $table->date('invoice_creation_date')->nullable();
            $table->unsignedBigInteger('supplier_supplier_id')->nullable();
            $table->foreign('supplier_supplier_id')->references('supplier_id')->on('supplier');

            $table->dropColumn('delivery_plan_header_id');
            $table->dropColumn('created_at');
            $table->dropColumn('total');
            $table->dropColumn('payment_reference');
            $table->dropColumn('payment_link');
            $table->dropColumn('vipps_key');
            $table->dropColumn('payment_status');
        });
    }
};

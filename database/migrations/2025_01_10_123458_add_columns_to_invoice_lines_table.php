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
        /*Schema::table('invoice_lines', function (Blueprint $table) {
            $table->dropForeign('fk_invoice_lines_document_header');
            $table->dropColumn('document_header_document_header_id');
            $table->dropColumn('supplier_price');
            $table->dropColumn('admin_and_delivery_fee_percent');
            $table->dropColumn('contribution_fee_percent');
            $table->dropColumn('payment_fee_percent');
            $table->dropColumn('referral_bonus_fee_percent');
            $table->dropColumn('system_owner_fee_percent');
            $table->dropColumn('vat_percent');
            $table->dropColumn('quantity_delivered_extr');
            $table->dropColumn('quantity_undelivered_calc');
            $table->dropColumn('retail_price_incl_vat_calc');
            $table->dropColumn('invoice_line_total_incl_vat_calc');
            $table->dropColumn('outstanding_amount_extr');
            $table->dropColumn('payment_option');
            $table->dropColumn('invoice_date');
            $table->dropColumn('payment_status');
            $table->dropColumn('delivery_status');
            $table->dropColumn('delivery_frequency');

            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('product_id')->on('product');
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('line_total', 10, 2)->default(0);
        });*/
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*Schema::table('invoice_lines', function (Blueprint $table) {
            //
        });*/
    }
};

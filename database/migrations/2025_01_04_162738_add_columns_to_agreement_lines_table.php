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
        /*Schema::table('agreement_lines', function (Blueprint $table) {
            $table->date('created_at')->nullable();
            $table->date('updated_at')->nullable();
            $table->string('first_delivery', 10)->nullable();
            $table->string('current_delivery', 10)->nullable();
            $table->string('last_delivery', 10)->nullable();
            $table->string('next_delivery', 10)->nullable();
            $table->integer('once_off_purchase')->default(0);
            $table->integer('processed')->default(0);
            $table->integer('locked')->default(0);
        });*/
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*Schema::table('agreement_lines', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
            $table->dropColumn('first_delivery');
            $table->dropColumn('current_delivery');
            $table->dropColumn('last_delivery');
            $table->dropColumn('next_delivery');
            $table->dropColumn('once_off_purchase');
            $table->dropColumn('processed');
            $table->dropColumn('locked');
        });*/
    }
};

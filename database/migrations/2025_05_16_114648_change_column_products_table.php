<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('type', 50)->nullable()->after('is_subscribable');
        });

        DB::table('products')->where('is_subscribable', 0)->update(['type' => 'once-off']);
        DB::table('products')->where('is_subscribable', 1)->update(['type' => 'both']);

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_subscribable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('is_subscribable')->default(1)->after('type');
        });

        DB::table('products')->where('type', 'once-off')->update(['is_subscribable' => 0]);
        DB::table('products')->whereIn('type', ['subscription', 'both'])->update(['is_subscribable' => 1]);

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};

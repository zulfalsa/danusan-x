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
        Schema::create('orders', function (Blueprint $table) {
            $table->integer('order_id')->autoIncrement();
            $table->string('buyer_name', 150);
            $table->string('buyer_phone', 20);
            $table->string('buyer_address', 255);
            $table->text('buyer_notes'); 
            $table->string('tracking_code', 100)->nullable();
            $table->integer('total_price');
            $table->enum('status', ['menunggu verifikasi', 'diproses penjual', 'selesai', 'dibatalkan'])
                ->default('menunggu verifikasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

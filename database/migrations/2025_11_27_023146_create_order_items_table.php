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
        Schema::create('order_items', function (Blueprint $table) {
            $table->integer('items_id')->autoIncrement();
            $table->integer('order_id');
            $table->integer('product_id');
            $table->integer('quantity');
            $table->integer('price');
            $table->integer('subtotal');
            $table->timestamps();
            $table->foreign('order_id')
                ->references('order_id')
                ->on('orders') 
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('product_id')
                ->references('product_id')
                ->on('products') 
                ->onUpdate('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

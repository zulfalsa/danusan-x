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
        Schema::create('products', function (Blueprint $table) {
            $table->integer('product_id')->autoIncrement();
            $table->integer('seller_id');
            $table->foreign('seller_id')
                  ->references('user_id')
                  ->on('users') 
                  ->onDelete('cascade') 
                  ->onUpdate('cascade'); 
            $table->string('name', 150);              
            $table->string('category', 100)->nullable(); 
            $table->text('description')->nullable();  
            $table->integer('price');                 
            $table->integer('stock')->default(0);     
            $table->string('image', 255)->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

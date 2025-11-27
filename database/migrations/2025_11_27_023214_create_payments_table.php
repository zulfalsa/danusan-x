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
        Schema::create('payments', function (Blueprint $table) {
            $table->integer('payment_id')->autoIncrement();
            $table->integer('order_id');
            $table->integer('admin_id')->nullable(); 
            $table->string('proof', 255);
            $table->enum('status', ['menunggu verifikasi', 'valid', 'invalid'])
                ->default('menunggu verifikasi');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('verified_at')->nullable();
            $table->foreign('order_id')
                ->references('order_id')
                ->on('orders')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('admin_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null') 
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

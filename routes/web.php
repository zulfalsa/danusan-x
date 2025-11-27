<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use Inertia\Inertia;

// --- HALAMAN PUBLIK (PEMBELI / TAMU) ---
// Homepage: Katalog Produk
Route::get('/', [ProductController::class, 'index'])->name('home');
// Detail Produk
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');

// Alur Pembelian (Tanpa Login)
Route::get('/cart/checkout', [OrderController::class, 'create'])->name('order.checkout');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::get('/order/track', [OrderController::class, 'track'])->name('order.track'); // Halaman lacak pesanan
Route::get('/order/payment/{tracking_code}', [OrderController::class, 'showPayment'])->name('order.payment');
Route::post('/order/payment/{order_id}', [OrderController::class, 'uploadProof'])->name('payment.upload');


// --- AREA AUTHENTICATED (LOGIN DULU) ---
Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    
    // Dashboard Umum (Redirect sesuai role bisa ditambahkan di sini)
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // --- AREA PENJUAL (SELLER) ---
    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        // Manajemen Produk
        Route::get('/products', [SellerProductController::class, 'index'])->name('products.index');
        Route::post('/products', [SellerProductController::class, 'store'])->name('products.store');
        Route::put('/products/{id}', [SellerProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{id}', [SellerProductController::class, 'destroy'])->name('products.destroy');

        // Manajemen Pesanan Masuk
        Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{id}/complete', [SellerOrderController::class, 'complete'])->name('orders.complete');
    });

    // --- AREA ADMIN ---
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // Verifikasi Pembayaran
        Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        Route::post('/payments/{id}/verify', [AdminPaymentController::class, 'verify'])->name('payments.verify');
    });
});
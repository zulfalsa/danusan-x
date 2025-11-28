<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\GateController; // <--- Import Controller Gate
use Illuminate\Http\Request;
use Inertia\Inertia;

// --- GATEKEEPING ROUTES (Halaman Kunci) ---
Route::get('/secret-gate', [GateController::class, 'show'])->name('gate.form');
Route::post('/secret-gate', [GateController::class, 'unlock'])->name('gate.unlock');

// --- HALAMAN PUBLIK (PEMBELI/GUEST) ---
Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');

// Alur Pembelian
Route::get('/cart/checkout', [OrderController::class, 'create'])->name('order.checkout');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::get('/order/track', [OrderController::class, 'track'])->name('order.track');
Route::get('/order/payment/{tracking_code}', [OrderController::class, 'showPayment'])->name('order.payment');
Route::post('/order/payment/{order_id}', [OrderController::class, 'uploadProof'])->name('payment.upload');
Route::post('/order/{tracking_code}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');


// --- AREA AUTHENTICATED ---
// Menggunakan 'auth' (default web/session) menggantikan 'auth:sanctum' untuk menghindari error driver
Route::middleware(['auth', config('jetstream.auth_session'), 'verified'])->group(function () {

    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->role === 'seller') {
            return redirect()->route('seller.orders.index');
        } elseif ($user->role === 'admin') {
            return redirect()->route('admin.payments.index');
        }
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // --- AREA PENJUAL (SELLER) ---
    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        // Produk
        Route::get('/products', [SellerProductController::class, 'index'])->name('products.index');
        Route::post('/products', [SellerProductController::class, 'store'])->name('products.store');
        Route::put('/products/{id}', [SellerProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{id}', [SellerProductController::class, 'destroy'])->name('products.destroy');
        
        // Order
        Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{id}/complete', [SellerOrderController::class, 'complete'])->name('orders.complete');
    });

    // --- AREA ADMIN ---
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        Route::post('/payments/{id}/verify', [AdminPaymentController::class, 'verify'])->name('payments.verify');
    });
});

// --- SETTINGS ROUTES (Profile, Password, 2FA) ---
require __DIR__.'/settings.php';
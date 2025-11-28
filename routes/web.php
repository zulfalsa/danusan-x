<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\GateController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product; 
use App\Models\Order; 

// ... (ROUTE GATE TETAP SAMA) ...

// =========================================================================
// HALAMAN PUBLIK (PEMBELI/GUEST) - MENGGANTIKAN CONTROLLER DENGAN INERTIA
// =========================================================================

// 1. HOME PAGE
Route::get('/', function () {
    try {
        $products = Product::query()->from('product')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Home', ['products' => $products]); 
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
})->name('home');

// 2. HALAMAN CART & CHECKOUT
Route::get('/cart', function () { return Inertia::render('Cart'); })->name('cart');
Route::get('/checkout', function () { return Inertia::render('order/checkout'); })->name('checkout');

// 3. HALAMAN SUCCESS (payment.tsx)
Route::get('/order/payment/{id}', function ($id) {
    return Inertia::render('order/payment', [
        'order_id' => $id
    ]);
})->name('order.payment');

// 4. HALAMAN LACAK PESANAN (track.tsx)
// OPSI A: Tambahkan ALIAS agar /track langsung berfungsi
Route::get('/track', function (Request $request) {
    $code = $request->input('code');
    $order = null;
    return Inertia::render('order/track', ['order' => $order]); 
})->name('track'); // Route name baru: track

// Route LAMA yang dipertahankan, dan sekarang memiliki alias Inertia di atas
Route::get('/order/track', function (Request $request) {
    $code = $request->input('code');
    $order = null;
    return Inertia::render('order/track', ['order' => $order]); 
})->name('order.track');


// --- ROUTE LAMA LAINNYA (DI-COMMENT) ---
// Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
// Route::get('/cart/checkout', [OrderController::class, 'create'])->name('order.checkout'); 
// Route::post('/order', [OrderController::class, 'store'])->name('order.store');
// Route::get('/order/payment/{tracking_code}', [OrderController::class, 'showPayment'])->name('order.payment');
// Route::post('/order/payment/{order_id}', [OrderController::class, 'uploadProof'])->name('payment.upload');
// Route::post('/order/{tracking_code}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');


// ... (ROUTE AUTHENTICATED DAN SETTINGS TETAP SAMA) ...
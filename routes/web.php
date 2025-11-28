<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;

/*
|--------------------------------------------------------------------------
| ROUTE AUTHENTICATION (GATE, LOGIN, REGISTER)
|--------------------------------------------------------------------------
*/

// GATEKEEP PAGE (auth/gate.tsx)
Route::get('/auth/gate', function () {
    return Inertia::render('auth/gate');
})->name('auth.gate');

// FIX: Middleware mencari route('gate.form')
Route::get('/gate', function () {
    return Inertia::render('auth/gate');
})->name('gate.form');

// LOGIN STAFF
Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

// REGISTER STAFF
Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');



/*
|--------------------------------------------------------------------------
| ROUTE PUBLIC (GUEST / PEMBELI)
|--------------------------------------------------------------------------
*/

// HOME PAGE
Route::get('/', function () {
    try {
        $products = Product::query()
            ->from('product')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Home', ['products' => $products]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
})->name('home');

// CART PAGE
Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

// CHECKOUT PAGE
Route::get('/checkout', function () {
    return Inertia::render('order/checkout');
})->name('checkout');

// PAYMENT PAGE
Route::get('/order/payment/{id}', function ($id) {
    return Inertia::render('order/payment', [
        'order_id' => $id
    ]);
})->name('order.payment');

// TRACK ORDER PAGE — versi pendek
Route::get('/track', function (Request $request) {
    return Inertia::render('order/track', [
        'order' => null,
        'code' => $request->input('code')
    ]);
})->name('track');

// TRACK ORDER PAGE — alias versi lama
Route::get('/order/track', function (Request $request) {
    return Inertia::render('order/track', [
        'order' => null,
        'code' => $request->input('code')
    ]);
})->name('order.track');



/*
|--------------------------------------------------------------------------
| ROUTE YANG DIKOMENTARI (REFERENSI BACKEND)
|--------------------------------------------------------------------------
|
| Hanya referensi. Tidak digunakan karena semua halaman diganti Inertia.
|
| Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
| Route::post('/order', [OrderController::class, 'store'])->name('order.store');
| Route::get('/order/payment/{tracking_code}', [OrderController::class, 'showPayment'])->name('order.payment');
| Route::post('/order/payment/{order_id}', [OrderController::class, 'uploadProof'])->name('payment.upload');
| Route::post('/order/{tracking_code}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
|
*/



/*
|--------------------------------------------------------------------------
| ROUTE STAFF / ADMIN (jika diperlukan)
|--------------------------------------------------------------------------
|
| Contoh:
| Route::middleware(['auth:sanctum'])->group(function () {
|     Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
| });
|
*/
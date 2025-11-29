<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| AUTHENTICATION ROUTES
|--------------------------------------------------------------------------
*/

// Gate page
Route::get('/auth/gate', function (Request $request) {
    return Inertia::render('auth/gate');
})->name('auth.gate')->middleware('guest');

Route::get('/gate', function (Request $request) {
    return Inertia::render('auth/gate');
})->name('gate.form')->middleware('guest');

// Login & Register
Route::get('/login', fn() => Inertia::render('auth/login'))
    ->middleware('guest')
    ->name('login');

Route::get('/register', fn() => Inertia::render('auth/register'))
    ->middleware('guest')
    ->name('register');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (GUEST / PEMBELI)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $products = Product::orderBy('created_at', 'desc')->get();
    return Inertia::render('Home', ['products' => $products]);
})->name('home');

Route::get('/cart', fn() => Inertia::render('Cart'))->name('cart');
Route::get('/checkout', fn() => Inertia::render('order/checkout'))->name('checkout');
Route::get('/order/payment/{id}', fn($id) => Inertia::render('order/payment', ['order_id' => $id]))->name('order.payment');

Route::get('/track', fn(Request $request) => Inertia::render('order/track', [
    'order' => null,
    'code' => $request->input('code')
]))->name('track');

Route::get('/order/track', fn(Request $request) => Inertia::render('order/track', [
    'order' => null,
    'code' => $request->input('code')
]))->name('order.track');

/*
|--------------------------------------------------------------------------
| STAFF / ADMIN ROUTES (PROTECTED)
|--------------------------------------------------------------------------
|
| Semua route staff/admin hanya bisa diakses jika session gate_unlocked
|
*/
Route::middleware(['CheckGatePass'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Tambahkan route staff/admin lain di sini
    // Contoh:
    // Route::get('/seller/products', [SellerProductController::class, 'index'])->name('seller.products');
});

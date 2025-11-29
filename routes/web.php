<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\AuthController; // PENTING: Controller Auth untuk API
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;

/*
|--------------------------------------------------------------------------
| ROUTE AUTHENTICATION (GATE, LOGIN, REGISTER)
|--------------------------------------------------------------------------
| Menggunakan middleware 'guest' agar hanya bisa diakses oleh user yang belum login.
*/

// GATEKEEP PAGE (auth/gate.tsx)
Route::get('/auth/gate', function (Request $request) {
    return Inertia::render('auth/gate');
})->name('auth.gate')->middleware('guest');

// FIX: Middleware mencari route('gate.form')
Route::get('/gate', function (Request $request) {
    return Inertia::render('auth/gate');
})->name('gate.form')->middleware('guest');

// LOGIN STAFF
Route::get('/login', fn() => Inertia::render('auth/login'))
    ->middleware('guest')
    ->name('login');

// REGISTER STAFF
Route::get('/register', fn() => Inertia::render('auth/register'))
    ->middleware('guest')
    ->name('register');


/*
|--------------------------------------------------------------------------
| ROUTE API OTENTIKASI (POST) - Solusi untuk CSRF token mismatch
|--------------------------------------------------------------------------
| Rute ini adalah API yang dipanggil oleh frontend Register/Login.
| Kita menggunakan ->withoutMiddleware(['web']) untuk mengecualikan rute ini
| dari perlindungan CSRF yang diterapkan pada grup middleware 'web'.
|
*/

Route::prefix('api')->group(function () {
    // Menangani permintaan POST dari frontend Register.jsx
    Route::post('/register', [AuthController::class, 'register']);

    // Menangani permintaan POST dari frontend Login.jsx
    Route::post('/login', [AuthController::class, 'login']);

    // Anda bisa menambahkan rute API POST/PUT/DELETE lainnya di sini
})->withoutMiddleware(['web']);


/*
|--------------------------------------------------------------------------
| ROUTE PUBLIC (GUEST / PEMBELI)
|--------------------------------------------------------------------------
*/

// HOME PAGE
Route::get('/', function () {
    try {
        $products = Product::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Home', ['products' => $products]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
})->name('home');

// CART PAGE
Route::get('/cart', fn() => Inertia::render('Cart'))->name('cart');

// CHECKOUT PAGE
Route::get('/checkout', fn() => Inertia::render('order/checkout'))->name('checkout');

// PAYMENT PAGE
Route::get('/order/payment/{id}', fn($id) => Inertia::render('order/payment', ['order_id' => $id]))->name('order.payment');

// TRACK ORDER PAGE — versi pendek
Route::get('/track', fn(Request $request) => Inertia::render('order/track', [
    'order' => null,
    'code' => $request->input('code')
]))->name('track');

// TRACK ORDER PAGE — alias versi lama
Route::get('/order/track', fn(Request $request) => Inertia::render('order/track', [
    'order' => null,
    'code' => $request->input('code')
]))->name('order.track');


/*
|--------------------------------------------------------------------------
| ROUTE STAFF / ADMIN (PROTECTED)
|--------------------------------------------------------------------------
|
| Semua route staff/admin hanya bisa diakses jika session gate_unlocked (asumsi CheckGatePass)
|
*/
Route::middleware(['CheckGatePass'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Tambahkan route staff/admin lain di sini
});
<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {        
        $orders = Order::with(['items.product'])
            ->whereIn('status', ['diproses penjual', 'selesai']) // tampilkan keduanya
            ->latest() // urutkan berdasarkan created_at DESC
            ->get();
        
        $products = Product::latest()->get();

        return Inertia::render('seller/orders/index', [
            'orders' => $orders,
            'products' => $products
        ]);
    }

    public function complete($order_id)
    {
        $order = Order::findOrFail($order_id);
        
        $order->update(['status' => 'selesai']);

        return redirect()->back()->with('success', 'Pesanan diselesaikan.');
    }
}
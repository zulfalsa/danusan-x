<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {        
        $sellerId = Auth::user()->user_id;

        $orders = Order::where('status', 'diproses penjual')
            ->whereHas('items.product', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })
            ->with(['items' => function ($query) use ($sellerId) {
                $query->whereHas('product', function ($q) use ($sellerId) {
                    $q->where('seller_id', $sellerId);
                })->with('product');
            }])
            ->get();

        return Inertia::render('seller/orders/index', [
            'orders' => $orders
        ]);
    }

    public function complete($order_id)
    {
        $order = Order::findOrFail($order_id);
        
        $order->update(['status' => 'selesai']);

        return redirect()->back()->with('success', 'Pesanan diselesaikan.');
    }
}
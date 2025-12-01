<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function create()
    {
        return Inertia::render('order/checkout', [
            'qris_url' => asset('images/qris-dummy.jpg'), 
            'products' => Product::where('stock', '>', 0)->get() 
        ]);
    }

    public function store(Request $request)
    {
        // ... (Kode store sama seperti sebelumnya, tidak perlu diubah)
        $validated = $request->validate([
            'buyer_name' => 'required|string|max:150',
            'buyer_phone' => 'required|string|max:20',
            'buyer_address' => 'required|string|max:255',
            'buyer_notes' => 'required|string',
            'cart_items' => 'required|array',
            'cart_items.*.product_id' => 'required|exists:products,product_id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'transfer_proof' => 'required|image|max:2048', 
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $totalPrice = 0;
            foreach ($validated['cart_items'] as $item) {
                $product = Product::find($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} habis.");
                }
                $totalPrice += $product->price * $item['quantity'];
                $product->decrement('stock', $item['quantity']);
            }

            $order = Order::create([
                'buyer_name' => $validated['buyer_name'],
                'buyer_phone' => $validated['buyer_phone'],
                'buyer_address' => $validated['buyer_address'],
                'buyer_notes' => $validated['buyer_notes'] ?? '-',
                'total_price' => $totalPrice,
                'status' => 'menunggu verifikasi',
                'tracking_code' => strtoupper(Str::random(10)),
            ]);

            foreach ($validated['cart_items'] as $item) {
                $product = Product::find($item['product_id']);
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $product->product_id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);
            }

            if ($request->hasFile('transfer_proof')) {
                $path = $request->file('transfer_proof')->store('payment-proofs', 'public');
                Payment::create([
                    'order_id' => $order->order_id,
                    'proof' => $path,
                    'status' => 'menunggu verifikasi',
                ]);
            }

            return redirect()->route('order.track', ['code' => $order->tracking_code])
                ->with('success', 'Pesanan berhasil dibuat! Silakan simpan Kode Tracking Anda.');
        });
    }

    public function track(Request $request)
    {
        $order = null;
        
        if ($request->has('code') && $request->query('code') != '') {
            $code = strtoupper(trim($request->query('code')));

            $order = Order::with(['items.product', 'payment'])
                ->where('tracking_code', $code)
                ->first();
        }

        return Inertia::render('order/track', [
            'order' => $order,
            'flash' => session('success')
        ]);
    }
    
    // Tambahkan method ini jika belum ada (digunakan di halaman detail/payment)
    public function showPayment($tracking_code)
    {
        $order = Order::with('items.product')->where('tracking_code', $tracking_code)->firstOrFail();
        $payment = Payment::where('order_id', $order->order_id)->first();

        return Inertia::render('order/payment', [
            'order' => $order,
            'payment' => $payment,
        ]);
    }
}
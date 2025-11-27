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
        return Inertia::render('Order/Checkout');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'buyer_name' => 'required|string|max:150',
            'buyer_phone' => 'required|string|max:20',
            'buyer_address' => 'required|string|max:255',
            'buyer_notes' => 'required|string',
            'cart_items' => 'required|array', // Item dari keranjang belanja (local storage)
            'cart_items.*.product_id' => 'required|exists:products,product_id',
            'cart_items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalPrice = 0;
            foreach ($validated['cart_items'] as $item) {
                $product = Product::find($item['product_id']);
                $totalPrice += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'buyer_name' => $validated['buyer_name'],
                'buyer_phone' => $validated['buyer_phone'],
                'buyer_address' => $validated['buyer_address'],
                'buyer_notes' => $validated['buyer_notes'],
                'total_price' => $totalPrice,
                'status' => 'menunggu verifikasi',
                'tracking_code' => strtoupper(Str::random(10)), // Kode unik pelacakan
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

            return redirect()->route('order.payment', ['tracking_code' => $order->tracking_code]);
        });
    }

    public function showPayment($tracking_code)
    {
        $order = Order::with('items.product')->where('tracking_code', $tracking_code)->firstOrFail();
        
        $payment = Payment::where('order_id', $order->order_id)->first();

        return Inertia::render('Order/Payment', [
            'order' => $order,
            'payment' => $payment,
            'qris_url' => asset('images/qris-dummy.jpg') // Ganti dengan path QRIS asli
        ]);
    }

    public function uploadProof(Request $request, $order_id)
    {
        $request->validate([
            'proof' => 'required|image|max:2048', // Max 2MB
        ]);

        $path = $request->file('proof')->store('payment-proofs', 'public');

        Payment::create([
            'order_id' => $order_id,
            'proof' => $path,
            'status' => 'menunggu verifikasi',
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
    }

    public function track(Request $request)
    {
        $order = null;
        if ($request->has('code')) {
            $order = Order::with(['items.product', 'payment'])
                ->where('tracking_code', $request->query('code'))
                ->first();
        }

        return Inertia::render('Order/Track', [
            'order' => $order
        ]);
    }
}
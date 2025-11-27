<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('order')
            ->where('status', 'menunggu verifikasi')
            ->get();

        return Inertia::render('admin/payments/index', [
            'payments' => $payments
        ]);
    }

    public function verify(Request $request, $payment_id)
    {
        $request->validate([
            'status' => 'required|in:valid,invalid',
            'notes' => 'nullable|string'
        ]);

        $payment = Payment::findOrFail($payment_id);
        
        DB::transaction(function () use ($payment, $request) {
            $payment->update([
                'status' => $request->status,
                'admin_id' => Auth::user()->user_id, // Admin yang memverifikasi
                'verified_at' => now(),
                'notes' => $request->notes
            ]);

            if ($request->status === 'valid') {
                $payment->order->update(['status' => 'diproses penjual']);
            } else {
                $payment->order->update(['status' => 'dibatalkan']);
            }
        });

        return redirect()->back()->with('success', 'Verifikasi berhasil diproses.');
    }
}
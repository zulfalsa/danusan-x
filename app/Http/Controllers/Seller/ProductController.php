<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar produk milik penjual yang sedang login.
     */
    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('seller/products/index', [
            'products' => $products
        ]);
    }

    /**
     * Menyimpan produk baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $userId = Auth::user()->user_id ?? Auth::id();

        Product::create([
            'seller_id' => $userId,
            'name' => $validated['name'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category' => $validated['category'] ?? '-',
            'description' => $validated['description'],
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Memperbarui data produk.
     */
    public function update(Request $request, $id)
    {
        $userId = Auth::user()->user_id ?? Auth::id();

        // Cari produk dan pastikan milik penjual yang login
        $product = Product::where('product_id', $id)
            ->where('seller_id', $userId)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', 
        ]);

        // Handle Image Upload
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            // Simpan gambar baru
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            // Jika tidak upload baru, hapus key image agar tidak null/tertimpa
            unset($validated['image']);
        }

        $product->update($validated);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Menghapus produk.
     */
    public function destroy($id)
    {
        $userId = Auth::user()->user_id ?? Auth::id();

        $product = Product::where('product_id', $id)
            ->where('seller_id', $userId)
            ->firstOrFail();

        // ✅ CEK: Jika produk sudah punya order, tolak hapus
        if ($product->orderItems()->exists()) {
            return redirect()->back()->with('error', 'Produk tidak dapat dihapus karena sudah memiliki pesanan.');
        }

        // Hapus file gambar dari storage
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
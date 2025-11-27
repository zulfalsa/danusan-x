<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('seller:user_id,name')->latest()->get();

        return Inertia::render('welcome', [
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::with('seller:user_id,name')->findOrFail($id);

        return Inertia::render('product/show', [
            'product' => $product
        ]);
    }
}
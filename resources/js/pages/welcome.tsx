import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
    product_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    seller: { name: string };
}

export default function Welcome({ products }: { products: Product[] }) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartCount(cart.length);
    }, []);

    const addToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        
        const existingItem = cart.find((item: any) => item.product_id === product.product_id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('danusan_cart', JSON.stringify(cart));
        setCartCount(cart.length);
        alert('Produk masuk keranjang!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Katalog Danusan" />
            
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-primary">Danusan X</div>
                    <div className="flex items-center gap-4">
                        <Link href="/order/track" className="text-sm font-medium hover:underline">
                            Lacak Pesanan
                        </Link>
                        <Link href="/cart/checkout" className="relative">
                            <Button variant="outline" size="icon">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Link href="/login" className="text-sm text-gray-600">
                            Login Penjual
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Produk Terbaru</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.product_id} className="flex flex-col">
                            <div className="aspect-square bg-gray-200 relative overflow-hidden rounded-t-xl">
                                {product.image ? (
                                    <img src={`/storage/${product.image}`} alt={product.name} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">Oleh: {product.seller.name}</p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="font-bold text-lg">Rp {product.price.toLocaleString('id-ID')}</p>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-2">{product.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => addToCart(product)}>
                                    + Keranjang
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
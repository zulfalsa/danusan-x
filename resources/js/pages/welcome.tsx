import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import React, { ReactNode } from 'react'; // Added React and ReactNode for typing


interface HeadProps {
    title: string;
}
const Head = ({ title }: HeadProps) => <title>{title}</title>;

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

const Link = ({ href, children, className, ...props }: LinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);
// --- END: FIX FOR RESOLUTION ERROR & TS ERRORS ---

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
        // NOTE: Keeping existing logic strictly as per rule 1.
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartCount(cart.length);
    }, []);

    const addToCart = (product: Product) => {
        // NOTE: Keeping existing logic strictly as per rule 1.
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

    // Use an empty array if products is null or undefined to prevent the 'map' error.
    const productList = products || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Katalog Danusan" />
            
            {/* --- 1. Navigation Bar (Orange Theme) --- */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and App Name */}
                    <div className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </div>
                    
                    {/* Navigation Links and Actions */}
                    <div className="flex items-center gap-6">
                        {/* Lacak Pesanan (Search Icon) */}
                        <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            Lacak
                        </Link>
                        
                        {/* Cart Icon */}
                        <Link href="/cart/checkout" className="relative">
                            <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-orange-600">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        
                        {/* Login Staff Button (Styled Link) */}
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- 2. Hero/Banner Section (Light Orange) --- */}
            <div className="bg-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center space-x-8">
                    {/* Left: Icon and Title */}
                    <div className="w-1/4 flex flex-col items-center justify-center p-6 bg-orange-200 rounded-lg shadow-lg">
                        <Package className="h-20 w-20 text-orange-600" style={{ strokeWidth: 1.5 }} />
                        <h1 className="font-extrabold text-2xl text-orange-600 mt-2">Danusan-X</h1>
                    </div>
                    
                    {/* Right: Welcome Message */}
                    <div className="w-3/4">
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Selamat Datang, Folks!</h1>
                        <p className="text-lg text-gray-600 max-w-xl">
                            dengan membeli danusan kami, kamu telah menukung kegiatan X berjalan dengan baik. Oh iya, kau bisa belanja tanpa perlu login!
                        </p>
                    </div>
                </div>
            </div>

            {/* --- 3. Product Catalog --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Produk Terbaru</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productList.map((product) => (
                        <Card key={product.product_id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl">
                            {/* Image Placeholder/Area (Orange background) */}
                            <div className="aspect-square relative overflow-hidden bg-orange-200">
                                {product.image ? (
                                    <img 
                                        src={`/storage/${product.image}`} 
                                        alt={product.name} 
                                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-orange-400">
                                        <Package className="h-10 w-10 mb-2"/>
                                        <span className="text-sm font-medium">No Image</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Card Content */}
                            <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-xl font-semibold line-clamp-1 text-gray-800">{product.name}</CardTitle>
                                <p className="text-xs text-gray-500 mt-1">Oleh: {product.seller.name}</p>
                            </CardHeader>
                            <CardContent className="flex-grow p-4 pt-2">
                                <p className="text-sm text-gray-600 line-clamp-3 mt-2 mb-4">{product.description}</p>
                                <p className="font-bold text-lg text-orange-600">Rp {product.price.toLocaleString('id-ID')}</p>
                            </CardContent>
                            
                            {/* Card Footer - Button */}
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors font-semibold shadow-md" onClick={() => addToCart(product)}>
                                    + Beli
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                
                {/* Fallback for empty products list */}
                {productList.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <Package className="h-10 w-10 mx-auto mb-3" />
                        <p className="font-medium text-lg">Belum ada produk yang tersedia saat ini.</p>
                        <p>Cek kembali nanti atau hubungi penjual untuk info lebih lanjut.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
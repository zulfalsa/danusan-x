import React, { useState, ReactNode, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { Package, Search, ShoppingCart } from "lucide-react";
import { Button } from '@/components/ui/button';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

const CustomLink = ({ href, children, className, ...props }: LinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

export default function Gate() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // NOTE: Keeping existing logic strictly as per rule 1.
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartCount(cart.length);
    }, []);
    const { data, setData, post, processing, errors } = useForm({
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post("/secret-gate"); // <-- FIXED, NO MORE WRONG route() CALL
    };

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col">
            <Head title="Secret Gate" />
            
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
                        {/* Login Staff Button (Styled Link) */}
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>

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
                    </div>
                </div>
            </nav>

            <div className="flex justify-center items-center flex-grow p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-200 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Who Are You?</h2>

                    <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
                        Kalau kamu adalah pembeli, kamu tidak perlu melakukan login dan bisa langsung
                        melakukan proses pembelian. Login hanya diperlukan untuk Penjual atau admin saja.
                        Penjual atau Admin <span className="font-semibold text-orange-600">harap masukkan secret password</span>.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block font-medium text-gray-700 mb-1 text-left">
                                Secret Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={`w-full border border-gray-300 rounded-lg px-3 py-2 h-12 text-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                            />
                            {errors.password && (
                                <div className="text-red-600 text-sm mt-1 text-left">{errors.password}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg h-12 hover:bg-orange-700 transition shadow-md ${
                                processing ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            Lanjut
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <CustomLink href="/" className="text-gray-600 text-sm underline hover:text-orange-600 transition">
                            Kembali ke Menu Pembeli
                        </CustomLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

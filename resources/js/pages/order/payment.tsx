import { Button } from '@/components/ui/button';
import { Package, Search, ShoppingCart, CheckCircle, Copy } from 'lucide-react';
import React, { useState, ReactNode } from 'react';

// --- START: PLACEHOLDER IMPORTS (for Inertia) ---
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
// --- END: PLACEHOLDER IMPORTS ---

interface OrderSuccessProps {
    trackingCode: string; // Assuming the tracking code is passed as a prop
}

export default function OrderSuccess({ trackingCode }: OrderSuccessProps) {
    const [isCopied, setIsCopied] = useState(false);

    // Function to copy text to clipboard (using document.execCommand for iFrame compatibility)
    const copyToClipboard = () => {
        const tempInput = document.createElement('input');
        tempInput.value = trackingCode;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-orange-50 pb-12">
            <Head title="Pesanan Berhasil" />
            
            {/* --- 1. Navigation Bar (Orange Theme) --- */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and App Name */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </Link>
                    
                    {/* Navigation Links and Actions */}
                    <div className="flex items-center gap-6">
                        {/* Login Staff Button */}
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>
                        {/* Lacak Pesanan */}
                        <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            Lacak
                        </Link>
                        {/* Cart Icon */}
                        <Link href="/cart/checkout">
                            <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- 2. Confirmation Content --- */}
            <main className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 pt-16">
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center space-y-8">
                    
                    {/* Success Icon and Message */}
                    <div>
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                        <h1 className="text-2xl font-bold text-gray-800 mt-4">Pesanan Berhasil Dikirimi!</h1>
                    </div>

                    {/* Order ID Box (Styled to match design) */}
                    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">ID PESANAN</p>
                        
                        <div className="relative inline-block">
                            <p className="text-4xl font-extrabold text-orange-600">{trackingCode}</p>
                            
                            {/* Copy Button */}
                            <button 
                                onClick={copyToClipboard}
                                className={`mt-2 text-sm font-medium transition-colors flex items-center mx-auto ${
                                    isCopied ? 'text-green-600' : 'text-orange-500 hover:text-orange-600'
                                }`}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                {isCopied ? 'ID Disimpan!' : 'Simpan ID untuk Pengecekan'}
                            </button>
                        </div>
                    </div>

                    {/* Verification Message */}
                    <p className="text-gray-600">Mohon tunggu verifikasi dari admin</p>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <Link href={`/order/track?code=${trackingCode}`}>
                            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg px-8 shadow-md transition-colors">
                                Lacak Status
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button className="bg-orange-600 hover:bg-orange-700 font-bold text-lg px-8 shadow-md transition-colors">
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
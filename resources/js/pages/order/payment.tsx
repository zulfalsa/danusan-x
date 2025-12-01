import { Link, usePage, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Package, Search, ShoppingCart, CheckCircle, Copy } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface PageProps {
    order?: {
        id?: number;
        trackingCode?: string;
    };
    [key: string]: any;
}

export default function OrderSuccess() {
    const { props } = usePage<PageProps>();
    const order = props.order;

    const [tracking, setTracking] = useState<string>('LOADING');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (order?.trackingCode) {
            setTracking(order.trackingCode);
        } else if (order?.id) {
            setTracking(order.id.toString());
        } else {
            setTracking("UNKNOWN");
        }
    }, [order]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tracking);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-orange-50 pb-12">
            <Head title="Pesanan Berhasil" />

            {/* --- Navigation Bar --- */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </Link>

                    {/* Nav Items */}
                    <div className="flex items-center gap-6">
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>

                        <Link href="/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            Lacak
                        </Link>

                        <Link href="/cart/checkout">
                            <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>


            {/* --- Main Content --- */}
            <main className="max-w-xl mx-auto p-4 sm:p-6 lg:px-8 pt-16">
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center space-y-8">

                    {/* Success + Title */}
                    <div>
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                        <h1 className="text-2xl font-bold text-gray-800 mt-4">Pesanan Berhasil Dikirim!</h1>
                    </div>

                    {/* Order Tracking */}
                    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">ID PESANAN</p>

                        <div className="relative inline-block">
                            <p className="text-4xl font-extrabold text-orange-600">{tracking}</p>

                            <button
                                onClick={copyToClipboard}
                                className={`mt-2 text-sm font-medium flex items-center mx-auto transition-colors ${
                                    isCopied ? 'text-green-600' : 'text-orange-500 hover:text-orange-600'
                                }`}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                {isCopied ? 'ID Disalin!' : 'Simpan ID untuk Pengecekan'}
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600">Mohon tunggu verifikasi dari admin</p>

                    {/* Actions */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <Link href={`/track?code=${tracking}`}>
                            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg px-8 shadow-md transition-colors">
                                Lacak Status
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 shadow-md transition-colors">
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

        </div>
    );
}

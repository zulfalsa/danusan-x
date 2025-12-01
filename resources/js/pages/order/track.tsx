import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Truck, XCircle, ShoppingCart, Clock, Home } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// --- BAGIAN INI KHUSUS UNTUK PREVIEW (HAPUS DI APLIKASI ASLI) ---
// Di aplikasi asli, HAPUS blok ini dan gunakan: import { Head, Link, useForm } from '@inertiajs/react';
const Head = ({ title }: { title: string }) => {
    useEffect(() => { document.title = title; }, [title]);
    return null;
};
const Link = ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>;
const useForm = (initialValues: any) => {
    const [data, setData] = useState(initialValues);
    const [processing, setProcessing] = useState(false);
    
    // Simulasi fungsi get Inertia
    const get = (url: string) => {
        setProcessing(true);
        console.log(`Mengirim GET ke ${url} dengan data:`, data);
        
        // Di aplikasi asli, Inertia akan melakukan navigasi. 
        // Di sini kita hanya simulasi loading.
        setTimeout(() => {
            setProcessing(false);
            // Redirect manual untuk preview jika code ada
            if (data.code) {
                window.location.search = `?code=${data.code}`;
            }
        }, 800);
    };

    return { 
        data, 
        setData: (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value })), 
        get, 
        processing 
    };
};
// ------------------------------------------------------------------

// --- Interfaces ---
interface Order {
    tracking_code: string;
    status: string;
    buyer_name: string;
    created_at: string;
    items: any[];
}

export default function Track({ order }: { order?: Order }) {
    const [cartCount, setCartCount] = useState(0);
    
    useEffect(() => {
    // NOTE: Keeping existing logic strictly as per rule 1.
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartCount(cart.length);
    }, []);
    // 1. Setup Form
    const { data, setData, get, processing } = useForm({
        code: ''
    });
    
    // 2. State UI untuk hasil pencarian
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        // Cek parameter URL saat halaman dimuat
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const codeParam = urlParams.get('code');
            
            // Jika ada order (dari backend) atau ada param 'code', tampilkan hasil
            if (codeParam || order) {
                setHasSearched(true);
                if (codeParam) {
                    setData('code', codeParam);
                }
            }
        }
    }, [order]); 

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        
        // 3. PERBAIKAN PENTING: Gunakan URL path manual '/track' 
        // agar tidak error jika helper route() tidak tersedia
        get('/track'); 
    };

    // Helper warna badge status
    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'menunggu verifikasi': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'diproses penjual': return 'bg-blue-500 hover:bg-blue-600';
            case 'dikirim': return 'bg-purple-500 hover:bg-purple-600';
            case 'selesai': return 'bg-green-500 hover:bg-green-600';
            case 'dibatalkan': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <Head title="Lacak Pesanan" />
            
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

            <div className="flex flex-col items-center py-12 px-4">
                <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-[#EA580C]">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Truck className="h-6 w-6 text-[#EA580C]" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Cek Status Pesanan</CardTitle>
                            <p className="text-sm text-gray-500">Masukkan kode tracking untuk melacak.</p>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-4">
                        {/* Form Pencarian */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input 
                                placeholder="Contoh: TRX12345ABC" 
                                value={data.code} 
                                onChange={e => setData('code', e.target.value)} 
                                className="flex-grow h-11 text-lg uppercase placeholder:normal-case border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                            />
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#EA580C] hover:bg-orange-700 font-bold h-11 px-6 text-white"
                            >
                                {processing ? '...' : 'Cari'}
                            </Button>
                        </form>
                        
                        {/* Hasil Pencarian */}
                        {hasSearched && (
                            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {order ? (
                                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                                            <span className="font-mono font-bold text-gray-700 tracking-wider">#{order.tracking_code}</span>
                                            <Badge className={`${getStatusBadgeColor(order.status)} text-white border-0`}>
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pembeli</p>
                                                <p className="font-medium text-gray-900">{order.buyer_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal Order</p>
                                                <div className="flex items-center gap-1 font-medium text-gray-900">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            
                                            {/* Link ke Detail Pembayaran */}
                                            {order.status === 'menunggu verifikasi' && (
                                                <div className="pt-4 mt-2 border-t border-dashed">
                                                    <Link href={`/order/payment/${order.tracking_code}`}>
                                                        <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
                                                            Lihat Detail / Upload Pembayaran
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Tampilan jika tidak ditemukan atau sedang loading awal di preview
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-800">
                                        <XCircle className="h-10 w-10 mx-auto mb-3 opacity-50 text-red-600" />
                                        <p className="font-bold text-lg">Pesanan Tidak Ditemukan</p>
                                        <p className="text-sm opacity-80 mt-1">Mohon periksa kembali kode tracking Anda.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Link href="/">
                    <Button className="mt-8 bg-orange-600 hover:bg-orange-700 font-bold text-lg px-10 py-3 shadow-lg transition-colors">
                        Kembali ke Beranda
                    </Button>
                </Link>
            </div>
        </div>
    );
}
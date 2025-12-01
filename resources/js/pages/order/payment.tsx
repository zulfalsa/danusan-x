import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Search, Clock, FileText, Home, CheckCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// --- Interfaces ---
interface Product {
    product_id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

interface Order {
    order_id: number;
    buyer_name: string;
    buyer_phone: string;
    buyer_address: string;
    buyer_notes: string;
    total_price: number;
    status: string;
    tracking_code: string;
    created_at: string;
    items: OrderItem[];
}

interface Payment {
    payment_id: number;
    proof: string;
    status: string;
    created_at: string;
}

interface PaymentPageProps {
    order: Order;
    payment: Payment | null;
}

export default function PaymentPage({ order, payment }: PaymentPageProps) {
    // Helper untuk warna badge status
    const [cartCount, setCartCount] = useState(0);
    
        useEffect(() => {
            // NOTE: Keeping existing logic strictly as per rule 1.
            const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
            setCartCount(cart.length);
        }, []);

    const getStatusColor = (status: string) => {
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
        <div className="min-h-screen bg-[#FFF7ED] pb-12 font-sans text-slate-800">
            <Head title={`Detail Pembayaran - ${order.tracking_code}`} />

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

            <main className="max-w-5xl mx-auto p-4 lg:p-8 mt-4">
                
                {/* Header Page */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Detail Pesanan & Pembayaran</h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            Kode Tracking: 
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                                {order.tracking_code}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/">
                            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                <Home className="w-4 h-4 mr-2" /> Beranda
                            </Button>
                        </Link>
                        <Link href={`/order/track?code=${order.tracking_code}`}>
                            <Button className="bg-[#EA580C] hover:bg-orange-700 text-white shadow-md">
                                <Search className="w-4 h-4 mr-2" /> Lacak Status
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Kolom Kiri: Detail Order --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Kartu Status Utama */}
                        <Card className="border-t-4 border-t-[#EA580C] shadow-md overflow-hidden">
                            <CardHeader className="bg-orange-50/50 pb-4 border-b border-orange-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-gray-800">Status Pesanan</CardTitle>
                                        <CardDescription>Informasi terkini mengenai pesanan Anda</CardDescription>
                                    </div>
                                    <Badge className={`${getStatusColor(order.status)} text-white border-0 px-3 py-1 text-sm`}>
                                        {order.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    <span>Waktu Pemesanan: <strong>{new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</strong></span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rincian Barang */}
                        <Card className="shadow-md border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-gray-800">Rincian Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-0 divider-y divide-gray-100">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-gray-900">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <Separator className="my-6" />
                                
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-700">Total Pembayaran</span>
                                    <span className="font-extrabold text-2xl text-[#EA580C]">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informasi Pembeli */}
                        <Card className="shadow-md border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-gray-800">Data Pembeli</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Nama Lengkap</p>
                                    <p className="font-medium text-gray-900">{order.buyer_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Nomor WhatsApp</p>
                                    <p className="font-medium text-gray-900">{order.buyer_phone}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 mb-1">Alamat Pengiriman</p>
                                    <p className="font-medium text-gray-900">{order.buyer_address}</p>
                                </div>
                                {order.buyer_notes && (
                                    <div className="sm:col-span-2 bg-yellow-50 p-3 rounded border border-yellow-100">
                                        <p className="text-gray-500 mb-1 text-xs uppercase font-bold tracking-wider">Catatan</p>
                                        <p className="text-gray-800 italic">"{order.buyer_notes}"</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Kolom Kanan: Bukti Pembayaran --- */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg border-gray-200 h-full sticky top-24">
                            <CardHeader className="bg-gray-50 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                    Bukti Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {payment ? (
                                    <div className="space-y-5">
                                        {/* Container Gambar */}
                                        <div className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-[3/4] flex items-center justify-center">
                                            <img 
                                                src={`/storage/${payment.proof}`} 
                                                alt="Bukti Transfer" 
                                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-in-out cursor-zoom-in"
                                                onClick={() => window.open(`/storage/${payment.proof}`, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                        </div>

                                        {/* Status Pembayaran */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Status Verifikasi</span>
                                                <Badge variant="outline" className={`${getStatusColor(payment.status)} text-white border-0`}>
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Diunggah Pada</span>
                                                <span className="font-medium text-gray-900">{new Date(payment.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-800 border border-blue-100">
                                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                                            <p>Bukti pembayaran telah diterima sistem. Admin akan memverifikasi dalam waktu 1x24 jam.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Belum Ada Bukti</h3>
                                        <p className="text-sm text-gray-500 mt-1 mb-6">Bukti transfer belum diunggah untuk pesanan ini.</p>
                                        <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                            Jika Anda sudah melakukan pembayaran namun status belum berubah, mohon hubungi admin.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
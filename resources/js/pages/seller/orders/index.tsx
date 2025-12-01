import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, CheckCircle, Package, Box, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Definisi tipe data
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
}

interface OrderItem {
    items_id: number;
    product: Product;
    quantity: number;
    price: number;
}

interface Order {
    order_id: number;
    tracking_code: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_address: string;
    total_price: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

interface Props {
    orders: Order[];
    products: Product[];
}

export default function SellerOrders({ orders, products }: Props) {
    const activeOrders = orders || [];
    const myProducts = products || [];
    
    const [showFullOrders, setShowFullOrders] = useState(false);
    const { post, processing } = useForm();

    // Logika Dashboard: Cari pesanan TERBARU yang statusnya MASIH PERLU DIPROSES
    // Array 'orders' diasumsikan sudah terurut 'latest' dari backend.
    // Kita cari item pertama yang BUKAN 'selesai' atau 'completed'.
    const firstPendingOrder = activeOrders.find(o => o.status !== 'completed' && o.status !== 'selesai');
    
    // Boolean untuk mengecek apakah ada pesanan pending
    const hasPendingOrder = !!firstPendingOrder;

    const handleComplete = (orderId: number) => {
        if (confirm('Tandai pesanan ini sebagai selesai? Status tidak dapat dikembalikan.')) {
            post(`/seller/orders/${orderId}/complete`);
        }
    };

    const openWhatsApp = (phone: string, buyerName: string) => {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.substring(1);
        const text = `Halo ${buyerName}, pesanan Anda di Danusan X sedang saya proses.`;
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleLogout = () => {
        router.post('/logout'); 
    };

    const pageTitle = showFullOrders ? 'Semua Pesanan' : 'Dashboard Penjual';

    return (
        <AppLayout breadcrumbs={[{ title: pageTitle, href: '#' }]}>
            <Head title={pageTitle} /> 

            {/* --- HEADER --- */}
            <div className="p-6 bg-orange-600 sticky top-0 z-10 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-white">{pageTitle}</h1>
                <div className="flex space-x-4 items-center">
                    <Button 
                        variant="outline" 
                        className="bg-white text-orange-600 border-white/50 hover:bg-orange-50 hover:text-orange-700 transition duration-150 rounded-lg shadow-md font-semibold px-4"
                        onClick={handleLogout}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Keluar
                    </Button>
                </div>
            </div>

            <div className="p-6">
                
                {!showFullOrders ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        
                        {/* 1. KARTU PESANAN MASUK (Dashboard Widget) */}
                        {/* Menampilkan pesanan pending TERBARU agar penjual langsung notice */}
                        <Card className="shadow-lg rounded-xl overflow-hidden lg:col-span-2 h-fit">
                            <CardHeader className="flex flex-row items-center space-x-3 p-5 bg-white border-b">
                                <Box className="h-6 w-6 text-orange-600" />
                                <CardTitle className="text-xl font-semibold text-gray-800">
                                    Pesanan Perlu Diproses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="border border-orange-200 rounded-xl overflow-hidden shadow-md">
                                    {/* Bagian Atas Kartu Preview */}
                                    <div className={`p-4 ${hasPendingOrder ? 'bg-orange-50' : 'bg-gray-50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-2xl text-orange-800">
                                                    #{hasPendingOrder ? firstPendingOrder?.tracking_code : '---'}
                                                </div>
                                                <div className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm mt-2 inline-flex items-center gap-1 border ${hasPendingOrder ? 'bg-white text-orange-600 border-orange-100' : 'bg-gray-200 text-gray-500 border-gray-300'}`}>
                                                    {hasPendingOrder ? (
                                                        <><Clock className="h-3 w-3" /> Perlu Proses</>
                                                    ) : (
                                                        'Semua Beres'
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-base text-gray-700 mt-2 font-medium">
                                            {hasPendingOrder ? firstPendingOrder?.buyer_name : 'Tidak ada pesanan menunggu.'}
                                        </p>
                                    </div>
                                    
                                    {/* Bagian Bawah Kartu Preview */}
                                    <div className="p-4 bg-white">
                                        {hasPendingOrder && firstPendingOrder?.items && (
                                            <div className="mb-4 border-b border-gray-100 pb-3">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rincian:</p>
                                                <ul className="space-y-2">
                                                    {firstPendingOrder.items.map((item, i) => (
                                                        <li key={i} className="flex justify-between text-sm items-center">
                                                            <span className="text-gray-700 truncate max-w-[180px]">
                                                                {item.product?.name || 'Produk dihapus'} 
                                                                <span className="text-xs text-gray-500 ml-1 font-bold">x{item.quantity}</span>
                                                            </span>
                                                            <span className="font-medium text-gray-900 text-xs">
                                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-3 pt-2 border-t border-dashed border-gray-200 flex justify-between text-sm font-bold text-orange-600">
                                                    <span>Total</span>
                                                    <span>Rp {firstPendingOrder.total_price?.toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            className="w-full font-bold transition duration-150 rounded-lg shadow-md"
                                            style={{ backgroundColor: hasPendingOrder ? '#25D366' : '#e5e7eb', color: hasPendingOrder ? 'white' : '#9ca3af' }}
                                            onClick={() => hasPendingOrder && openWhatsApp(firstPendingOrder.buyer_phone, firstPendingOrder.buyer_name)}
                                            disabled={!hasPendingOrder} 
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" /> Hubungi WA
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-right pt-2 mt-4">
                                    <button 
                                        onClick={() => setShowFullOrders(true)}
                                        className="text-sm font-medium text-blue-600 hover:text-orange-600 transition duration-150 cursor-pointer bg-transparent border-none p-0 underline flex items-center justify-end w-full"
                                    >
                                        Lihat Riwayat & Semua Pesanan <ArrowRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. KARTU PRODUK SAYA */}
                        <Card className="shadow-lg rounded-xl overflow-hidden lg:col-span-3 h-fit flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-x-4 p-5 bg-white border-b">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-3">
                                    <Package className="h-6 w-6 text-gray-700" />
                                    <span>Produk Saya</span>
                                </CardTitle>
                                <Link 
                                    href="/seller/products" 
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    Kelola <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                {myProducts.length === 0 ? (
                                    <div className="text-center p-10 m-5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500 font-medium text-sm">Belum ada produk.</p>
                                        <Link href="/seller/products" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                                            + Tambah Produk Sekarang
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {myProducts.slice(0, 5).map((product) => (
                                            <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition duration-150">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded-md bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                                                        {product.image ? (
                                                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">{product.name}</h4>
                                                        <p className="text-xs text-gray-500">Stok: <span className={product.stock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{product.stock}</span></p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-orange-600 block">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                                            <Link href="/seller/products" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                                                Lihat {myProducts.length} Produk Lainnya
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // --- TAMPILAN FULL LIST PESANAN --- 
                    // Menampilkan SELURUH order, baik yang pending maupun selesai
                    <div className="mt-0 pt-0">
                        <div className="mb-6 flex justify-between items-center">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowFullOrders(false)}
                                className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-lg transition duration-150 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                                Kembali
                            </Button>
                            <span className="text-sm text-gray-500 font-medium">Total: {activeOrders.length} Pesanan</span>
                        </div>

                        <div className="grid gap-6">
                            {activeOrders.length === 0 ? (
                                <div className="text-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-medium text-lg">Belum ada riwayat pesanan.</p>
                                </div>
                            ) : (
                                activeOrders.map((order) => {
                                    // LOGIKA STATUS: Cek apakah pesanan sudah selesai
                                    const isCompleted = order.status === 'selesai' || order.status === 'completed';
                                    
                                    return (
                                        <Card 
                                            key={order.order_id} 
                                            // TAMPILAN BEDA: 
                                            // Jika Selesai: Background agak abu-abu, border tipis, opacity sedikit turun.
                                            // Jika Aktif: Background putih cerah, border orange tipis, shadow lebih hidup.
                                            className={`transition duration-300 ${
                                                isCompleted 
                                                ? 'bg-gray-50 border-gray-200 opacity-80' 
                                                : 'bg-white border-orange-200 shadow-md hover:shadow-xl ring-1 ring-orange-100'
                                            }`}
                                        >
                                            <CardHeader className={`pb-3 border-b border-gray-100 ${isCompleted ? 'bg-gray-100/50' : 'bg-orange-50/50'}`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <CardTitle className={`text-lg font-bold ${isCompleted ? 'text-gray-600' : 'text-gray-800'}`}>
                                                                Order <span className={isCompleted ? 'text-gray-600' : 'text-blue-600'}>#{order.tracking_code}</span>
                                                            </CardTitle>
                                                            
                                                            {/* BADGE STATUS */}
                                                            {isCompleted ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse">
                                                                    <Clock className="w-3 h-3 mr-1" /> Perlu Diproses
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Tombol WhatsApp selalu ada untuk komunikasi */}
                                                    <Button 
                                                        style={{ backgroundColor: '#25D366' }} 
                                                        size="sm" 
                                                        className="text-white hover:bg-green-600 shadow-sm transition duration-150 rounded-lg h-8"
                                                        onClick={() => openWhatsApp(order.buyer_phone, order.buyer_name)}
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-2" /> WA
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent className="pt-4">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Kolom Produk */}
                                                    <div>
                                                        <h4 className="font-bold text-sm mb-3 text-gray-700 border-b pb-1">Detail Produk:</h4>
                                                        <ul className="space-y-2 text-sm">
                                                            {order.items.map((item, index) => (
                                                                <li key={index} className="flex justify-between border-b border-gray-100 pb-1.5 last:border-0">
                                                                    <span>
                                                                        {item.product?.name || <span className="text-red-500 italic">Produk dihapus</span>} 
                                                                        <span className="text-gray-500 font-medium ml-1">x{item.quantity}</span>
                                                                    </span>
                                                                    <span className="font-semibold text-gray-700">Rp {item.price ? item.price.toLocaleString('id-ID') : '0'}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="mt-4 pt-2 border-t font-bold text-base flex justify-between items-center">
                                                             <span className="text-gray-600">Total Pesanan:</span>
                                                             <span className={`text-lg ${isCompleted ? 'text-gray-700' : 'text-orange-600'}`}>
                                                                 Rp {order.total_price?.toLocaleString('id-ID') || 0}
                                                             </span>
                                                        </div>
                                                    </div>

                                                    {/* Kolom Pengiriman & Aksi */}
                                                    <div className="flex flex-col justify-between">
                                                        <div className="space-y-3 text-sm">
                                                            <h4 className="font-bold text-sm mb-2 text-gray-700 border-b pb-1">Data Pembeli:</h4>
                                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-gray-500 text-xs">Nama:</span>
                                                                    <span className="font-medium text-gray-800">{order.buyer_name}</span>
                                                                </div>
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-gray-500 text-xs mt-0.5">Alamat:</span>
                                                                    <span className="font-medium text-gray-800 text-right w-2/3">{order.buyer_address}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* TOMBOL AKSI: Hanya muncul jika BELUM selesai */}
                                                        {!isCompleted ? (
                                                            <div className="mt-6 flex justify-end">
                                                                <Button 
                                                                    onClick={() => handleComplete(order.order_id)} 
                                                                    disabled={processing}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-150 shadow-md rounded-lg w-full md:w-auto"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2" /> Tandai Selesai
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-6 flex justify-end">
                                                                <span className="text-xs text-gray-400 italic flex items-center">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Pesanan telah diselesaikan
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
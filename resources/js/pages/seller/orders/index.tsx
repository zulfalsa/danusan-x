import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, CheckCircle, Package, Box } from 'lucide-react';
import { useState } from 'react'; 
// MENGGUNAKAN IMPORT ASLI:
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; 


export default function SellerOrders({ orders }: { orders: any[] }) {
    // FIX: Pastikan orders dianggap sebagai array
    const activeOrders = orders || []; 
    
    // State untuk mengontrol tampilan daftar pesanan lengkap
    const [showFullOrders, setShowFullOrders] = useState(false);

    const { post, processing } = useForm();

    // Gunakan actual first pending order, atau objek kosong untuk null safety
    const firstPendingOrder = activeOrders.find(o => o.status !== 'completed') || {};
    
    // Check if a valid order was found
    const hasPendingOrder = !!firstPendingOrder.order_id;

    const handleComplete = (orderId: number) => {
        // PERATURAN: Penggunaan `confirm()` dipertahankan sesuai aturan 1
        if (confirm('Tandai pesanan ini sebagai selesai?')) {
            post(`/seller/orders/${orderId}/complete`);
        }
    };

    const openWhatsApp = (phone: string, buyerName: string) => {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.substring(1);
        const text = `Halo ${buyerName}, pesanan Anda di Danusan X sedang saya proses.`;
        // PERATURAN: window.open dipertahankan
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleLihatLebihLengkap = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); // Mencegah navigasi penuh
        setShowFullOrders(true);
    };

    const handleBackToDashboard = () => {
        setShowFullOrders(false);
    };

    // FUNGSI LOGOUT BARU
    const handleLogout = () => {
        // Inertia.js / Laravel logout typically uses router.post to /logout
        router.post('/logout'); 
    };

    const pageTitle = showFullOrders ? 'Semua Pesanan' : 'Dashboard Penjual';

    return (
        <AppLayout breadcrumbs={[{ title: pageTitle, href: '#' }]}>
            {/* Judul Halaman */}
            <Head title={pageTitle} /> 

            {/* --- TOP SECTION: DASHBOARD HEADER & Logout Button (ORANGE STYLING) --- */}
            <div className="p-6 bg-orange-600 sticky top-0 z-10 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-white">{pageTitle}</h1>
                <div className="flex space-x-4 items-center">
                    {/* Logout Button: Sekarang menggunakan handleLogout */}
                    <Button 
                        variant="outline" 
                        // Menggunakan latar putih/orange muda agar menonjol dari header orange
                        className="bg-white text-orange-600 border-white/50 hover:bg-orange-50 hover:text-orange-700 transition duration-150 rounded-lg shadow-md font-semibold px-4"
                        onClick={handleLogout}
                    >
                        {/* Ikon LogOut (menggunakan inline SVG untuk mematuhi aturan impor) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Keluar
                    </Button>
                </div>
            </div>

            <div className="p-6">
                
                {/* --- MAIN DASHBOARD CONTENT: Hanya Tampilkan Ringkasan Jika Belum Klik "Lihat Lebih Lengkap" --- */}
                {!showFullOrders ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        
                        {/* 1. PESANAN MASUK (INCOMING ORDERS) - 2/5 width */}
                        <Card className="shadow-lg rounded-xl overflow-hidden lg:col-span-2 h-fit">
                            <CardHeader className="flex flex-row items-center space-x-3 p-5 bg-white border-b">
                                <Box className="h-6 w-6 text-orange-600" />
                                <CardTitle className="text-xl font-semibold text-gray-800">
                                    Pesanan Masuk
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                {/* Order Summary Preview Card */}
                                <div className="border border-orange-200 rounded-xl overflow-hidden shadow-md">
                                    <div className="p-4" style={{ backgroundColor: '#FFECE2' }}>
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-2xl text-orange-800">
                                                #{hasPendingOrder ? firstPendingOrder.tracking_code : '---'}
                                            </div>
                                            <div className="text-sm font-semibold px-3 py-1 bg-white text-orange-600 rounded-full shadow-sm">
                                                {hasPendingOrder ? 'Siap Diproses' : 'Kosong'}
                                            </div>
                                        </div>
                                        <p className="text-base text-gray-700 mt-1">
                                            {hasPendingOrder ? firstPendingOrder.buyer_name : 'Tidak Ada Pesanan'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <Button
                                            className="w-full font-bold transition duration-150 rounded-lg shadow-md"
                                            style={{ backgroundColor: '#25D366' }} // WhatsApp Green
                                            onClick={() => openWhatsApp(firstPendingOrder.buyer_phone, firstPendingOrder.buyer_name)}
                                            disabled={!hasPendingOrder} // Disabled jika tidak ada pesanan
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" /> Hubungi WA
                                        </Button>
                                    </div>
                                </div>

                                {/* "Lihat Lebih Lengkap" Link untuk Pesanan */}
                                <div className="text-right pt-2 mt-4">
                                    <a 
                                        href="/seller/orders" // URL Asli dipertahankan
                                        onClick={handleLihatLebihLengkap} // Tambahkan handler state toggle
                                        className="text-sm font-medium text-blue-600 hover:text-orange-600 transition duration-150 cursor-pointer"
                                    >
                                        Lihat Lebih Lengkap &rarr;
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. PRODUK SAYA (MY PRODUCTS) - 3/5 width */}
                        <Card className="shadow-lg rounded-xl overflow-hidden lg:col-span-3 h-fit">
                            {/* CardHeader diubah untuk menempatkan tombol + Produk */}
                            <CardHeader className="flex flex-row items-center justify-between space-x-4 p-5 bg-white border-b">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package h-6 w-6 text-gray-700"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                    <span>Produk Saya</span>
                                </CardTitle>
                                {/* MENGHAPUS + Produk Button */}
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                {/* Product List Placeholder setelah mock dihapus */}
                                <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500 font-medium text-sm">Data produk tidak tersedia di properti ini.</p>
                                    <p className="text-gray-400 text-xs mt-1">Gunakan tombol "Lihat Lebih Lengkap" untuk mengelola produk Anda.</p>
                                </div>

                                {/* "Lihat Lebih Lengkap" Link untuk Produk */}
                                <div className="text-right pt-2 mt-4">
                                    <a 
                                        href="/seller/products" // Placeholder untuk halaman produk lengkap
                                        className="text-sm font-medium text-blue-600 hover:text-orange-600 transition duration-150"
                                    >
                                        Lihat Lebih Lengkap &rarr;
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // --- ORIGINAL ORDER LIST (FULL VIEW) --- 
                    <div className="mt-0 pt-0">
                        {/* Tombol Kembali ke Dashboard */}
                        <div className="mb-4">
                            <Button 
                                variant="outline" 
                                onClick={handleBackToDashboard}
                                className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-lg transition duration-150 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                                Kembali ke Dashboard
                            </Button>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Semua Pesanan yang Perlu Diproses</h2>
                        <div className="grid gap-4">
                            {activeOrders.length === 0 ? (
                                <div className="text-center p-10 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                                    <Package className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500 font-medium">Belum ada pesanan baru.</p>
                                    <p className="text-sm text-gray-400 mt-1">Status pesanan akan muncul di sini.</p>
                                </div>
                            ) : (
                                activeOrders.map((order) => (
                                    <Card key={order.order_id} className="shadow-md rounded-xl hover:shadow-lg transition duration-300">
                                        <CardHeader className="bg-gray-50/70 pb-3 border-b border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                                        Order <span className="text-blue-600">#{order.tracking_code}</span>
                                                    </CardTitle>
                                                    <p className="text-xs text-gray-500 mt-0.5">Dibuat: {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                </div>
                                                <Button 
                                                    style={{ backgroundColor: '#25D366' }} // WhatsApp Green
                                                    size="sm" 
                                                    className="text-white hover:bg-green-600 shadow-md transition duration-150 rounded-lg"
                                                    onClick={() => openWhatsApp(order.buyer_phone, order.buyer_name)}
                                                >
                                                    <MessageCircle className="h-4 w-4 mr-2" /> Hubungi Pembeli
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="col-span-2">
                                                    <h4 className="font-bold text-sm mb-3 text-gray-700 border-b pb-1">Detail Produk:</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        {order.items.map((item: any) => (
                                                            // Pastikan item.price ada sebelum memanggil toLocaleString
                                                            <li key={item.items_id} className="flex justify-between border-b border-gray-100 pb-1.5 last:border-0">
                                                                <span>{item.product?.name || 'Produk Tidak Ditemukan'} <span className="text-gray-500">x{item.quantity}</span></span>
                                                                <span className="font-semibold text-gray-700">Rp {item.price ? item.price.toLocaleString('id-ID') : '0'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 pt-2 border-t font-bold text-base flex justify-between">
                                                         <span>Total Pesanan:</span>
                                                         <span className="text-orange-600">
                                                             Rp {order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toLocaleString('id-ID')}
                                                         </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm border-l pl-4">
                                                    <h4 className="font-bold text-sm mb-3 text-gray-700 border-b pb-1">Informasi Pengiriman:</h4>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs">Nama Pembeli:</span>
                                                        <span className="font-medium text-gray-800">{order.buyer_name}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs">Alamat:</span>
                                                        <span className="font-medium text-gray-800 line-clamp-2">{order.buyer_address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-4 border-t flex justify-end">
                                                <Button 
                                                    onClick={() => handleComplete(order.order_id)} 
                                                    disabled={processing}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-150 shadow-md rounded-lg"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Tandai Selesai
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
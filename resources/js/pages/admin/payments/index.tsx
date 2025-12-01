import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import { Check, X, Eye, Package, LogOut } from 'lucide-react';
// MENGGUNAKAN IMPORT ASLI:
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; 


export default function AdminPayments({ payments: initialPayments }: { payments: any[] }) {
    // Menggunakan data asli dari props. Diperlukan untuk memastikan array selalu ada.
    const verifiedPayments = initialPayments || [];
    
    const [proofModalOpen, setProofModalOpen] = useState(false);
    const [currentProofUrl, setCurrentProofUrl] = useState('');

    const handleVerify = (id: number, status: 'valid' | 'invalid') => {
        // Logika Inertia untuk POST ke backend dan mengubah status
        if (confirm(`Konfirmasi status: ${status === 'valid' ? 'Setuju' : 'Tolak'}?`)) {
            router.post(`/admin/payments/${id}/verify`, { 
                status: status 
            }, {
                // preserveScroll: Biarkan halaman tidak bergeser setelah aksi
                preserveScroll: true,
            });
        }
    };
    
    const openProofModal = (proofUrl: string) => {
        // Di lingkungan produksi, ini akan menggunakan URL asli
        setCurrentProofUrl(proofUrl);
        setProofModalOpen(true);
    };

    const handleLogout = () => {
        // Menggunakan router.post asli untuk fungsi logout API
        router.post('/logout', {}); 
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Verifikasi', href: '#' }]}>
            <Head title="Verifikasi Pembayaran" />

            {/* --- TOP HEADER SECTION (ORANGE) --- */}
            <div className="p-6 bg-orange-600 sticky top-0 z-10 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-white">Dashboard Admin</h1>
                <div className="flex space-x-4 items-center">
                    <Button 
                        onClick={handleLogout}
                        className="bg-white text-orange-600 border-white/50 hover:bg-orange-50 hover:text-orange-700 transition duration-150 rounded-lg shadow-md font-semibold px-4"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Admin Keluar
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-orange-600">
                    Verifikasi Pembayaran
                </h1>
                
                {verifiedPayments.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                        <Package className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Tidak ada pembayaran yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Header Tabel (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-5 font-bold text-sm text-gray-600 uppercase tracking-wider border-b-2 pb-2 mb-4">
                            <div className="col-span-1 px-4">ID & Pembeli</div>
                            <div className="col-span-1 px-4 text-center">Total</div>
                            <div className="col-span-2 px-4 text-center">Bukti Transfer</div>
                            <div className="col-span-1 px-4 text-right">Aksi</div>
                        </div>

                        {verifiedPayments.map((p) => (
                            <Card key={p.payment_id} className="shadow-md rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
                                <CardContent className="p-4 grid grid-cols-5 items-center justify-between gap-4">
                                    
                                    {/* Kolom ID & Pembeli (col 1/5) */}
                                    <div className="col-span-2 md:col-span-1 flex flex-col">
                                        <div className="font-semibold text-sm uppercase text-gray-500 mb-1 md:hidden">Order ID / Pembeli</div>
                                        <div className="font-bold text-lg text-gray-800">
                                            #{p.order.tracking_code}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-0.5">
                                            {p.order.buyer_name}
                                            <span className="block text-xs text-gray-500">{p.order.buyer_phone}</span>
                                        </div>
                                    </div>

                                    {/* Kolom Total (col 2/5) */}
                                    <div className="col-span-1 flex flex-col items-center">
                                        <div className="font-semibold text-sm uppercase text-gray-500 mb-1 md:hidden">Total</div>
                                        <div className="font-extrabold text-lg text-orange-600">
                                            Rp {p.order.total_price.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    {/* Kolom Bukti (col 3/5) */}
                                    <div className="col-span-1 flex flex-col items-center">
                                        <div className="font-semibold text-sm uppercase text-gray-500 mb-1 md:hidden">Bukti</div>
                                        <Button 
                                            size="sm" 
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-blue-100/50"
                                            // Menggunakan p.proof URL asli untuk dilihat
                                            onClick={() => openProofModal(`/storage/${p.proof}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2"/> Lihat
                                        </Button>
                                    </div>


                                    {/* Kolom Aksi (col 4/5 & 5/5) */}
                                    <div className="col-span-2 flex justify-end gap-2">
                                        <Button 
                                            size="sm" 
                                            className="bg-green-500 hover:bg-green-600 font-bold" 
                                            onClick={() => handleVerify(p.payment_id, 'valid')}
                                        >
                                            <Check className="w-4 h-4 mr-1"/> Setuju
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-red-500 hover:bg-red-600 font-bold" 
                                            onClick={() => handleVerify(p.payment_id, 'invalid')}
                                        >
                                            <X className="w-4 h-4 mr-1"/> Tolak
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAL BUKTI TRANSFER --- */}
            {proofModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    onClick={() => setProofModalOpen(false)}
                >
                    <div 
                        className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()} // Mencegah klik modal menutup modal
                    >
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Bukti Transfer</h2>
                        <img 
                            // Menggunakan URL bukti transfer yang sebenarnya
                            src={currentProofUrl} 
                            alt="Bukti Transfer" 
                            className="w-full h-auto object-contain rounded-lg shadow-inner border border-gray-200" 
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src="https://placehold.co/500x300/fec89a/333333?text=Gambar+Tidak+Ditemukan";
                            }}
                        />
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setProofModalOpen(false)} variant="outline">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
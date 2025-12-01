import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import { Check, X, Eye, Package, LogOut } from 'lucide-react';
// MENGGUNAKAN IMPORT ASLI:
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; 


export default function AdminPayments({ payments: initialPayments }: { payments: any[] }) {

    // Gunakan initialPayments jika ada, jika tidak gunakan dummyPayments untuk preview
    const verifiedPayments = initialPayments || [];
    
    const [proofModalOpen, setProofModalOpen] = useState(false);
    const [currentProofUrl, setCurrentProofUrl] = useState('');

    const handleVerify = (id: number, status: 'valid' | 'invalid') => {
        if (confirm(`Konfirmasi status: ${status === 'valid' ? 'Setuju' : 'Tolak'}?`)) {
            router.post(`/admin/payments/${id}/verify`, { 
                status: status 
            }, {
                preserveScroll: true,
            });
        }
    };
    
    const openProofModal = (proofUrl: string) => {
        setCurrentProofUrl(proofUrl);
        setProofModalOpen(true);
    };

    const handleLogout = () => {
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

            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-orange-600 flex items-center gap-2">
                    Verifikasi Pembayaran
                </h1>
                
                {verifiedPayments.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium text-lg">Tidak ada pembayaran yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Header Tabel (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-5 font-bold text-sm text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 pb-3 mb-4 px-4">
                            <div className="col-span-1">ID & Pembeli</div>
                            <div className="col-span-1 text-center">Total</div>
                            <div className="col-span-1 text-center">Bukti Transfer</div>
                            <div className="col-span-2 text-right">Aksi</div>
                        </div>

                        {verifiedPayments.map((p) => (
                            <Card key={p.payment_id} className="shadow-md rounded-xl hover:shadow-lg transition duration-300 border border-gray-200 bg-white overflow-hidden">
                                <CardContent className="p-5 grid grid-cols-1 md:grid-cols-5 items-center gap-4 md:gap-4">
                                    
                                    {/* Kolom ID & Pembeli (col 1/5) */}
                                    <div className="md:col-span-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 pb-3 md:pb-0">
                                        <div className="md:hidden font-semibold text-gray-500 text-sm">Order Info</div>
                                        <div className="text-right md:text-left">
                                            <div className="font-bold text-lg text-gray-800 tracking-tight">
                                                #{p.order.tracking_code}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1 font-medium">
                                                {p.order.buyer_name}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {p.order.buyer_phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kolom Total (col 2/5) */}
                                    <div className="md:col-span-1 flex flex-row md:flex-col justify-between md:justify-center items-center border-b md:border-b-0 pb-3 md:pb-0">
                                        <div className="md:hidden font-semibold text-gray-500 text-sm">Total Bayar</div>
                                        <div className="font-extrabold text-lg text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                                            Rp {p.order.total_price.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    {/* Kolom Bukti (col 3/5) */}
                                    <div className="md:col-span-1 flex flex-row md:flex-col justify-between md:justify-center items-center border-b md:border-b-0 pb-3 md:pb-0">
                                        <div className="md:hidden font-semibold text-gray-500 text-sm">Bukti Transfer</div>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 w-full md:w-auto"
                                            onClick={() => openProofModal(p.proof.startsWith('http') ? p.proof : `/storage/${p.proof}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2"/> Lihat Bukti
                                        </Button>
                                    </div>

                                    {/* Kolom Aksi (col 4/5 & 5/5) */}
                                    <div className="md:col-span-2 flex justify-end gap-3 pt-2 md:pt-0">
                                        {/* LOGIKA STATUS: Tombol vs Label */}
                                        {p.status === 'menunggu verifikasi' ? (
                                            <>
                                                <Button 
                                                    className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-sm flex-1 md:flex-none" 
                                                    onClick={() => handleVerify(p.payment_id, 'valid')}
                                                >
                                                    <Check className="w-4 h-4 mr-2"/> Setuju
                                                </Button>
                                                <Button 
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-sm flex-1 md:flex-none" 
                                                    onClick={() => handleVerify(p.payment_id, 'invalid')}
                                                >
                                                    <X className="w-4 h-4 mr-2"/> Tolak
                                                </Button>
                                            </>
                                        ) : (
                                            <div className={`px-5 py-2 rounded-lg font-bold text-sm uppercase flex items-center border w-full md:w-auto justify-center shadow-sm ${
                                                p.status === 'valid' 
                                                ? 'bg-green-50 text-green-700 border-green-200 ring-1 ring-green-100' 
                                                : 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100'
                                            }`}>
                                                {p.status === 'valid' ? (
                                                    <><Check className="w-5 h-5 mr-2 stroke-[3]"/> Disetujui</>
                                                ) : (
                                                    <><X className="w-5 h-5 mr-2 stroke-[3]"/> Ditolak</>
                                                )}
                                            </div>
                                        )}
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
                    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setProofModalOpen(false)}
                >
                    <div 
                        className="bg-white p-0 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-500" />
                                Bukti Transfer
                            </h2>
                            <button onClick={() => setProofModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto bg-gray-100 flex items-center justify-center min-h-[300px]">
                            <img 
                                src={currentProofUrl} 
                                alt="Bukti Transfer" 
                                className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-md border border-white" 
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src="https://placehold.co/500x300/fec89a/333333?text=Gambar+Tidak+Ditemukan";
                                }}
                            />
                        </div>

                        <div className="p-4 border-t bg-white flex justify-end">
                            <Button onClick={() => setProofModalOpen(false)} variant="outline" className="font-semibold">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
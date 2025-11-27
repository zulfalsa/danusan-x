import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; // Ganti useForm dengan router
import { Check, X, Eye } from 'lucide-react';

export default function AdminPayments({ payments }: { payments: any[] }) {
    
    const handleVerify = (id: number, status: 'valid' | 'invalid') => {
        if (confirm(`Konfirmasi status: ${status}?`)) {
            router.post(`/admin/payments/${id}/verify`, { 
                status: status 
            }, {
                preserveScroll: true,
            });
            }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Verifikasi', href: '#' }]}>
            <Head title="Verifikasi Pembayaran" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Pembayaran Pending</h1>
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Bukti</th>
                                    <th className="px-6 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.payment_id} className="border-b">
                                        <td className="px-6 py-4">#{p.order.tracking_code}</td>
                                        <td className="px-6 py-4">Rp {p.order.total_price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <a href={`/storage/${p.proof}`} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1">
                                                <Eye className="w-4 h-4"/> Lihat
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Button 
                                                size="sm" 
                                                className="bg-green-600 hover:bg-green-700" 
                                                onClick={() => handleVerify(p.payment_id, 'valid')}
                                            >
                                                <Check className="w-4 h-4"/>
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive" 
                                                onClick={() => handleVerify(p.payment_id, 'invalid')}
                                            >
                                                <X className="w-4 h-4"/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
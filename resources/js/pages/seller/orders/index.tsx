import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { MessageCircle, CheckCircle, Package } from 'lucide-react';

export default function SellerOrders({ orders }: { orders: any[] }) {
    const { post, processing } = useForm();

    const handleComplete = (orderId: number) => {
        if (confirm('Tandai pesanan ini sebagai selesai?')) {
            post(`/seller/orders/${orderId}/complete`);
        }
    };

    const openWhatsApp = (phone: string, buyerName: string) => {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.substring(1);
        const text = `Halo ${buyerName}, pesanan Anda di Danusan X sedang saya proses.`;
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pesanan Masuk', href: '#' }]}>
            <Head title="Pesanan Masuk" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Pesanan Perlu Diproses</h1>
                <div className="grid gap-4">
                    {orders.length === 0 ? (
                        <div className="text-center p-10 bg-white rounded-lg border border-dashed">
                            <Package className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Belum ada pesanan baru.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <Card key={order.order_id}>
                                <CardHeader className="bg-gray-50/50 pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base">Order #{order.tracking_code}</CardTitle>
                                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <Button 
                                            variant="outline" size="sm" 
                                            className="text-green-600 border-green-200"
                                            onClick={() => openWhatsApp(order.buyer_phone, order.buyer_name)}
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" /> Hubungi Pembeli
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2">Detail Produk:</h4>
                                            <ul className="space-y-1 text-sm">
                                                {order.items.map((item: any) => (
                                                    <li key={item.items_id} className="flex justify-between border-b pb-1 last:border-0">
                                                        <span>{item.product.name} x{item.quantity}</span>
                                                        <span className="font-medium">Rp {item.price.toLocaleString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-500 block">Nama Pembeli:</span><span className="font-medium">{order.buyer_name}</span></div>
                                            <div><span className="text-gray-500 block">Alamat:</span><span className="font-medium">{order.buyer_address}</span></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex justify-end">
                                        <Button onClick={() => handleComplete(order.order_id)} disabled={processing}>
                                            <CheckCircle className="h-4 w-4 mr-2" /> Tandai Selesai
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm } from '@inertiajs/react';

export default function Track({ order }: { order: any }) {
    const { data, setData, get } = useForm({ code: '' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/order/track');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <Head title="Lacak Pesanan" />
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center">Lacak Status</h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input placeholder="Kode Tracking" value={data.code} onChange={e => setData('code', e.target.value)} />
                    <Button type="submit">Cari</Button>
                </form>

                {order && (
                    <Card>
                        <CardHeader className="border-b pb-4">
                            <div className="flex justify-between">
                                <CardTitle>Order #{order.tracking_code}</CardTitle>
                                <span className="font-bold uppercase text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{order.status}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="font-medium">{order.buyer_name}</p>
                            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                                {order.items.map((item: any) => (
                                    <li key={item.items_id}>{item.product.name} x{item.quantity}</li>
                                ))}
                            </ul>
                            {order.status === 'menunggu verifikasi' && (
                                <div className="mt-4 text-center">
                                    <a href={`/order/payment/${order.tracking_code}`} className="text-blue-600 underline">Ke Halaman Pembayaran</a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
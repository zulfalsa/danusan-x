import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

declare global {
    var route: any;
}

export default function Payment({ order, payment, qris_url }: any) {
    const { data, setData, post, progress, processing } = useForm({
        proof: null as File | null,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/order/payment/${order.order_id}`, {
            forceFormData: true
        }  
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Head title={`Pembayaran - ${order.tracking_code}`} />
            
            <div className="max-w-xl mx-auto space-y-6">
                <Card className={`border-l-4 ${order.status === 'menunggu verifikasi' ? 'border-yellow-500' : 'border-blue-500'}`}>
                    <CardContent className="pt-6 flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-gray-600" />
                        <div>
                            <p className="font-bold uppercase">{order.status}</p>
                            <p className="text-sm text-gray-500">Kode Tracking: <span className="font-mono font-bold">{order.tracking_code}</span></p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Instruksi Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Total Tagihan</p>
                            <p className="text-3xl font-bold text-primary">Rp {order.total_price.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="flex justify-center">
                            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-white">
                                <img src={qris_url} alt="QRIS Code" className="w-48 h-48 object-contain" />
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500">Scan QRIS di atas untuk membayar.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Konfirmasi Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payment ? (
                             <div className="text-center py-6 space-y-3">
                                <div className="flex justify-center text-green-500">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h3 className="font-bold text-lg">Bukti Terkirim!</h3>
                                <p className="text-gray-500">Admin sedang memverifikasi pembayaran Anda.</p>
                                <img src={`/storage/${payment.proof}`} alt="Bukti" className="h-32 mx-auto mt-4 rounded border" />
                            </div>
                        ) : (
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="proof">Unggah Bukti Transfer</Label>
                                    <Input 
                                        id="proof" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setData('proof', e.currentTarget.files ? e.currentTarget.files[0] : null)}
                                        required
                                    />
                                    {progress && (
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                      </div>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    Kirim Bukti Pembayaran
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
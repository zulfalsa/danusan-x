import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface CartItem {
    product_id: number;
    name?: string; 
    price?: number; 
    quantity: number;
}

interface CheckoutForm {
    buyer_name: string;
    buyer_phone: string;
    buyer_address: string;
    buyer_notes: string;
    cart_items: CartItem[];
}

export default function Checkout() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        buyer_name: '',
        buyer_phone: '',
        buyer_address: '',
        buyer_notes: '-',
        cart_items: [],
    });

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartItems(items);
        
        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);

        setData(data => ({
            ...data,
            cart_items: items.map((item: any) => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order'), {
            onSuccess: () => {
                localStorage.removeItem('danusan_cart');
            }
        };
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Keranjang Kosong</h1>
                <Button onClick={() => window.history.back()}>Kembali Belanja</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Head title="Checkout Pesanan" />
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Data Pemesan</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input 
                                id="name" 
                                value={data.buyer_name}
                                onChange={e => setData('buyer_name', e.target.value)}
                                required
                            />
                            {errors.buyer_name && <span className="text-red-500 text-xs">{errors.buyer_name}</span>}
                        </div>
                        <div>
                            <Label htmlFor="phone">Nomor WhatsApp</Label>
                            <Input 
                                id="phone" 
                                value={data.buyer_phone}
                                onChange={e => setData('buyer_phone', e.target.value)}
                                required
                                placeholder="0812..."
                            />
                            {errors.buyer_phone && <span className="text-red-500 text-xs">{errors.buyer_phone}</span>}
                        </div>
                        <div>
                            <Label htmlFor="address">Alamat Pengiriman / COD</Label>
                            <Input 
                                id="address" 
                                value={data.buyer_address}
                                onChange={e => setData('buyer_address', e.target.value)}
                                required
                            />
                            {errors.buyer_address && <span className="text-red-500 text-xs">{errors.buyer_address}</span>}
                        </div>
                        <div>
                            <Label htmlFor="notes">Catatan (Opsional)</Label>
                            <Input 
                                id="notes" 
                                value={data.buyer_notes}
                                onChange={e => setData('buyer_notes', e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Memproses...' : 'Buat Pesanan'}
                        </Button>
                    </form>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                        {cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-500">x {item.quantity}</p>
                                </div>
                                <p>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search, ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

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
    transfer_proof: File | null;
}

export default function Checkout() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [step, setStep] = useState<'cart' | 'form'>('cart');
    const [fileName, setFileName] = useState('No File Chosen');

    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        buyer_name: '',
        buyer_phone: '',
        buyer_address: '',
        buyer_notes: '-',
        cart_items: [],
        transfer_proof: null,
    });

    const updateCartInLocalStorage = (updatedItems: any[]) => {
        localStorage.setItem('danusan_cart', JSON.stringify(updatedItems));
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const calculateTotal = (items: any[]) => {
        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);

        setData('cart_items', items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity
        })) as CartItem[]);
    };

    const removeItem = (product_id: number) => {
        const updatedItems = cartItems.filter(item => item.product_id !== product_id);
        updateCartInLocalStorage(updatedItems);
    };

    const updateQuantity = (product_id: number, delta: number) => {
        const updatedItems = cartItems.map(item =>
            item.product_id === product_id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        updateCartInLocalStorage(updatedItems);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('transfer_proof', file);
        setFileName(file ? file.name : 'No File Chosen');
    };

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        calculateTotal(items);
        setCartItems(items);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/order', {
            onSuccess: (res: any) => {
                const page = res?.props || {};

                const tracking =
                    page.trackingCode ||
                    page.tracking ||
                    page.order?.tracking_code ||
                    page.order?.tracking ||
                    "UNKNOWN";

                localStorage.removeItem("danusan_cart");

                window.location.href = `/order/success?code=${tracking}`;
            }
        });
    };

    return (
        <div className="min-h-screen bg-orange-50 pb-12">
            <Head title={step === 'cart' ? "Keranjang Belanja" : "Form Pemesanan"} />

            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white">Danusan-X</div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/order/track" className="hidden lg:flex items-center text-white text-sm font-medium hover:text-orange-200">
                            <Search className="h-5 w-5 mr-1" /> Lacak
                        </Link>

                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>

                        <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-4 lg:p-8 mt-4">
                {step === 'cart' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Keranjang Belanja</h1>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow">
                                            <div className="w-14 h-14 bg-orange-200 rounded-lg flex items-center justify-center">
                                                <Package className="h-7 w-7 text-orange-600" />
                                            </div>

                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <div className="flex border border-gray-300 rounded-md overflow-hidden h-8">
                                                    <Button variant="ghost" size="icon"
                                                        className="h-full w-7 text-gray-600"
                                                        onClick={() => updateQuantity(item.product_id, -1)}
                                                        disabled={item.quantity <= 1}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input readOnly value={item.quantity}
                                                        className="w-10 text-center text-sm h-full p-0 border-x" />
                                                    <Button variant="ghost" size="icon"
                                                        className="h-full w-7 text-gray-600"
                                                        onClick={() => updateQuantity(item.product_id, 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <Button variant="ghost" size="icon"
                                                    className="text-red-500 hover:bg-red-50"
                                                    onClick={() => removeItem(item.product_id)}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-xl shadow-xl border-2 border-dashed border-orange-300 text-center">
                                        <ShoppingCart className="h-12 w-12 text-orange-500 mx-auto" />
                                        <h2 className="text-lg font-bold text-gray-800 mt-3">Keranjang kosong</h2>
                                        <Link href="/">
                                            <Button className="bg-orange-600 hover:bg-orange-700 mt-4 font-bold px-6">
                                                Mulai Belanja
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="md:sticky md:top-28 w-full md:max-w-sm mx-auto bg-white p-6 rounded-xl shadow-xl border space-y-4">
                                <h2 className="text-xl font-bold text-gray-800">Ringkasan</h2>

                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total:</span>
                                    <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>

                                <Button
                                    onClick={() => setStep('form')}
                                    className="w-full bg-green-500 hover:bg-green-600 font-bold h-12"
                                    disabled={cartItems.length === 0}
                                >
                                    Check Out
                                </Button>

                                <div className="text-center">
                                    <Link href="/" className="text-orange-500 hover:underline text-sm">
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {step === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <button onClick={() => setStep('cart')} className="flex items-center text-orange-600 font-semibold mb-6">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                        </button>

                        <div className="bg-white p-8 rounded-xl shadow-xl border">
                            <h1 className="text-2xl font-bold mb-6">Form Pemesanan</h1>

                            <div className="bg-yellow-50 border p-6 text-center rounded-lg mb-6">
                                <p className="font-medium text-gray-700 mb-3">Silahkan Scan QRIS berikut</p>
                                <div className="w-40 h-40 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                                <p className="text-xl font-bold text-orange-600">
                                    Total: Rp {totalPrice.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={data.buyer_name}
                                        onChange={e => setData('buyer_name', e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label>Nomor WhatsApp</Label>
                                    <Input
                                        value={data.buyer_phone}
                                        onChange={e => setData('buyer_phone', e.target.value)}
                                        required
                                        placeholder="0812..."
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label>Upload Bukti Transfer</Label>
                                    <div className="flex border rounded-lg h-10 overflow-hidden">
                                        <label
                                            htmlFor="transfer_proof"
                                            className="bg-gray-100 px-4 flex items-center border-r cursor-pointer">
                                            Choose File
                                        </label>
                                        <span className="px-3 flex items-center text-gray-500 text-sm">{fileName}</span>
                                        <Input
                                            id="transfer_proof"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".jpg,.jpeg,.png"
                                            disabled={processing}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">*format must be JPG/PNG</p>
                                </div>

                                <div>
                                    <Label>Alamat Pengiriman / COD</Label>
                                    <Input
                                        value={data.buyer_address}
                                        onChange={e => setData('buyer_address', e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label>Catatan (Opsional)</Label>
                                    <Input
                                        value={data.buyer_notes}
                                        onChange={e => setData('buyer_notes', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 font-bold h-12 mt-4" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Buat Pesanan'}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import InputError from '../../components/input-error';
import { Package, Search, ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

// --- Interfaces ---
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

interface CheckoutProps {
    qris_url?: string; // Optional jika belum ada
}

export default function Checkout({ qris_url }: CheckoutProps) {
    const [cartCount, setCartCount] = useState(0);
    
    useEffect(() => {
        // NOTE: Keeping existing logic strictly as per rule 1.
        const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartCount(cart.length);
    }, []);
    // --- State ---
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [step, setStep] = useState<'cart' | 'form'>('cart');
    const [fileName, setFileName] = useState('No File Chosen');

    // --- Form Handling ---
    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        buyer_name: '',
        buyer_phone: '',
        buyer_address: '',
        buyer_notes: '',
        cart_items: [],
        transfer_proof: null,
    });

    // --- Logic Keranjang ---
    const updateCartInLocalStorage = (updatedItems: CartItem[]) => {
        localStorage.setItem('danusan_cart', JSON.stringify(updatedItems));
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const calculateTotal = (items: CartItem[]) => {
        const total = items.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
        setTotalPrice(total);

        // Update data form agar siap dikirim
        setData(prev => ({
            ...prev,
            cart_items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price, // Menyertakan price agar sesuai tipe (meski backend mungkin hitung ulang)
                name: item.name
            }))
        }));
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

    // Load cart on mount
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
        setCartItems(items);
        calculateTotal(items);
    }, []);


    // --- Event Handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('transfer_proof', file);
        setFileName(file ? file.name : 'No File Chosen');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order', {
            forceFormData: true,
            onSuccess: () => {
                localStorage.removeItem("danusan_cart");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FFF7ED] pb-12 font-sans">
            <Head title={step === 'cart' ? "Keranjang Belanja" : "Form Pemesanan"} />

            {/* --- 1. Navigation Bar (Orange Theme) --- */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and App Name */}
                    <div className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </div>
                    
                    {/* Navigation Links and Actions */}
                    <div className="flex items-center gap-6">
                        {/* Login Staff Button (Styled Link) */}
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>
                        
                        {/* Lacak Pesanan (Search Icon) */}
                        <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            Lacak
                        </Link>
                        
                        {/* Cart Icon */}
                        <Link href="/cart/checkout" className="relative">
                            <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-orange-600">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-4 lg:p-8 mt-4">
                
                {/* --- TAMPILAN KERANJANG (CART) --- */}
                {step === 'cart' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Keranjang Belanja</h1>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="h-8 w-8 text-orange-500" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-gray-800 truncate text-lg">{item.name}</p>
                                                <p className="text-gray-500">Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex border border-gray-300 rounded-md overflow-hidden h-9 bg-gray-50">
                                                    <button 
                                                        className="px-3 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                                                        onClick={() => updateQuantity(item.product_id, -1)}
                                                        disabled={item.quantity <= 1}>
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <div className="w-10 flex items-center justify-center text-sm font-semibold border-x border-gray-300 bg-white">
                                                        {item.quantity}
                                                    </div>
                                                    <button 
                                                        className="px-3 text-gray-600 hover:bg-gray-200 transition"
                                                        onClick={() => updateQuantity(item.product_id, 1)}>
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <Button variant="ghost" size="icon"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => removeItem(item.product_id)}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-xl shadow-sm border-2 border-dashed border-gray-300 text-center">
                                        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h2 className="text-lg font-semibold text-gray-600">Keranjang kosong</h2>
                                        <Link href="/">
                                            <Button className="bg-[#EA580C] hover:bg-orange-700 mt-4 font-bold px-6 text-white">
                                                Mulai Belanja
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="md:sticky md:top-28 w-full md:max-w-sm mx-auto bg-white p-6 rounded-xl shadow-lg border border-orange-100 space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Ringkasan</h2>
                                <div className="flex justify-between font-bold text-xl items-center">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-[#EA580C] text-2xl">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <Button
                                    onClick={() => setStep('form')}
                                    className="w-full bg-[#22C55E] hover:bg-green-600 text-white font-bold h-12 text-lg shadow-md transition-all transform hover:scale-[1.02]"
                                    disabled={cartItems.length === 0}
                                >
                                    Checkout Sekarang
                                </Button>
                                <div className="text-center">
                                    <Link href="/" className="text-[#EA580C] hover:text-orange-700 text-sm font-medium hover:underline">
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- TAMPILAN FORM PEMESANAN (Sesuai Gambar) --- */}
                {step === 'form' && (
                    <div className="max-w-xl mx-auto">
                        <button 
                            onClick={() => setStep('cart')} 
                            className="flex items-center text-[#EA580C] font-medium mb-6 hover:underline transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                        </button>

                        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Form Pemesanan</h1>

                            {/* QRIS Box - Styling Kuning */}
                            <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-lg p-6 text-center mb-8">
                                <p className="font-semibold text-gray-800 mb-4 text-lg">Silahkan Scan QRIS berikut</p>
                                
                                <div className="bg-white p-2 inline-block rounded-lg shadow-sm border border-gray-200 mb-4">
                                    {qris_url ? (
                                        <img 
                                            src={qris_url} 
                                            alt="QRIS" 
                                            className="w-40 h-40 object-contain mx-auto"
                                        />
                                    ) : (
                                        // Placeholder icon jika gambar tidak ada
                                        <div className="w-40 h-40 bg-gray-800 rounded flex items-center justify-center text-white">
                                            <ImageIcon className="w-12 h-12 opacity-50" />
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-xl font-bold text-gray-900">
                                    Total: Rp {totalPrice.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nama Lengkap */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="buyer_name" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                                    <Input
                                        id="buyer_name"
                                        value={data.buyer_name}
                                        onChange={e => setData('buyer_name', e.target.value)}
                                        required
                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 h-10"
                                    />
                                    <InputError message={errors.buyer_name} />
                                </div>

                                {/* No WhatsApp (Label sesuai gambar: "No WhatsApp") */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="buyer_phone" className="text-sm font-semibold text-gray-700">No WhatsApp</Label>
                                    <Input
                                        id="buyer_phone"
                                        type="tel"
                                        value={data.buyer_phone}
                                        onChange={e => setData('buyer_phone', e.target.value)}
                                        required
                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 h-10"
                                    />
                                    <InputError message={errors.buyer_phone} />
                                </div>

                                {/* Upload Bukti Transfer - Custom Style "Choose File" */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="transfer_proof" className="text-sm font-semibold text-gray-700">Upload Bukti Transfer</Label>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 h-10">
                                        <label 
                                            htmlFor="transfer_proof" 
                                            className="bg-[#F3F4F6] text-gray-700 px-4 h-full flex items-center cursor-pointer border-r border-gray-300 text-sm font-medium hover:bg-gray-200 transition"
                                        >
                                            Choose File
                                        </label>
                                        <span className="px-3 text-gray-500 text-sm truncate flex-grow">
                                            {fileName}
                                        </span>
                                        <input
                                            id="transfer_proof"
                                            type="file"
                                            className="sr-only" // Hide default input
                                            onChange={handleFileChange}
                                            accept=".jpg,.jpeg,.png"
                                            disabled={processing}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">*format must be JPG/PNG</p>
                                    <InputError message={errors.transfer_proof} />
                                </div>

                                {/* Alamat */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="buyer_address" className="text-sm font-semibold text-gray-700">Alamat Pengiriman / COD</Label>
                                    <Input
                                        id="buyer_address"
                                        value={data.buyer_address}
                                        onChange={e => setData('buyer_address', e.target.value)}
                                        required
                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 h-10"
                                    />
                                    <InputError message={errors.buyer_address} />
                                </div>

                                {/* Catatan */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="buyer_notes" className="text-sm font-semibold text-gray-700">Catatan</Label>
                                    <Input
                                        id="buyer_notes"
                                        value={data.buyer_notes}
                                        onChange={e => setData('buyer_notes', e.target.value)}
                                        required
                                        placeholder="Pickup / delivery, catatan khusus, dll..."
                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 h-10"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold h-12 text-lg mt-6 shadow-md transition-all" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                                    ) : (
                                        'Buat Pesanan'
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
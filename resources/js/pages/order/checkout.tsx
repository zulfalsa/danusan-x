import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search, ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react'; // Added icons for design
import React, { useEffect, useState, ReactNode } from 'react';

// --- Global Type Declarations (Fixes ts(2339) '__app_id' error) ---
declare global {
    interface Window {
        __app_id?: string;
    }
}
// --- END Global Type Declarations ---

// --- START: FIX FOR RESOLUTION ERROR & TS ERRORS ---
// Placeholder components for Inertia dependencies (Head and useForm) and Link
interface HeadProps {
    title: string;
}
const Head = ({ title }: HeadProps) => <title>{title}</title>;

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

const Link = ({ href, children, className, ...props }: LinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

// FIX: Corrected placeholder useForm to support generics and proper setData typing.
interface FormErrors {
    [key: string]: string | undefined;
}

interface UseFormProps<T> {
    data: T;
    setData: (key: keyof T | T, value?: T[keyof T]) => void;
    post: (url: string, options?: { onSuccess?: () => void }) => void;
    processing: boolean;
    errors: FormErrors;
}

// Placeholder for useForm to prevent compilation error.
const useForm = <T extends Record<string, any>>(initialData: T): UseFormProps<T> => {
    const [data, setDataState] = useState<T>(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    
    // Custom setData to handle both key/value and object arguments
    const setData = (keyOrObject: keyof T | T, value?: T[keyof T]) => {
        if (typeof keyOrObject === 'string' && value !== undefined) {
            setDataState(prev => ({ ...prev, [keyOrObject]: value }));
        } else if (typeof keyOrObject === 'object' && keyOrObject !== null) {
            setDataState(keyOrObject as T);
        }
    };
    
    return { 
        data, 
        setData: setData as (key: keyof T | T, value?: T[keyof T]) => void,
        post: (url: string, options) => {
            setProcessing(true);
            setTimeout(() => { // Simulate API latency
                setProcessing(false);
                // Simulate success
                if (options && options.onSuccess) {
                    options.onSuccess();
                }
            }, 1000);
        },
        processing,
        errors
    };
};
// --- END: FIX FOR RESOLUTION ERROR & TS ERRORS ---


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
    // --- STATE MANAGEMENT & LOGIC ---
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    // NEW STATE: Manages the display step: 'cart' or 'form'
    const [step, setStep] = useState<'cart' | 'form'>('cart'); 

    const updateCartInLocalStorage = (updatedItems: any[]) => {
        localStorage.setItem('danusan_cart', JSON.stringify(updatedItems));
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const calculateTotal = (items: any[]) => {
        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);
        
        // FIX ts(2345): Now using the correctly typed UseFormProps.setData:
        setData('cart_items', items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity
        })) as unknown as CartItem[]);
    };

    const removeItem = (product_id: number) => {
        const updatedItems = cartItems.filter(item => item.product_id !== product_id);
        updateCartInLocalStorage(updatedItems);
    };

    const updateQuantity = (product_id: number, delta: number) => {
        const updatedItems = cartItems.map(item => {
            if (item.product_id === product_id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        updateCartInLocalStorage(updatedItems);
    };
    
    // Original Form Initialization
    const { data, setData, post, processing, errors } = useForm<CheckoutForm>({
        buyer_name: '',
        buyer_phone: '',
        buyer_address: '',
        buyer_notes: '-',
        cart_items: [],
    });

    useEffect(() => {
        let items = JSON.parse(localStorage.getItem('danusan_cart') || '[]');

        // --- TEMPORARY MOCK LOGIC FOR PREVIEW ONLY (RETAINED) ---
        // FIX ts(2339): Now refers to window.__app_id safely
        if (items.length === 0 && typeof window.__app_id !== 'undefined') {
             // Removing mock data here to allow the empty state to display naturally in the Canvas
             // items = [ ... ];
        }
        // --- END TEMPORARY MOCK LOGIC ---

        calculateTotal(items); // Calculate and set total, and update useForm data
        setCartItems(items);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // This is the submission of the final form data
        post('/order', { 
            onSuccess: () => {
                localStorage.removeItem('danusan_cart');
            }
        });
    };

    // --- RENDER FUNCTIONS ---

    // Removed the separate `if (cartItems.length === 0)` return block.

    // --- MAIN RENDER (Wraps the two steps) ---
    return (
        <div className="min-h-screen bg-orange-50 pb-12">
            <Head title={step === 'cart' ? "Keranjang Belanja" : "Form Pemesanan"} />
            
            {/* --- 1. Navigation Bar (Orange Theme) --- */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and App Name */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </Link>
                    
                    {/* Navigation Links and Actions */}
                    <div className="flex items-center gap-6">
                        {/* Lacak Pesanan */}
                        <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            Lacak
                        </Link>
                        {/* Login Staff Button */}
                        <Link href="/login">
                            <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                                Login Staff
                            </Button>
                        </Link>
                        {/* Cart Icon (Active here) */}
                        <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                             <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

                {step === 'cart' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 pb-2 border-b-2 border-orange-500">
                            Keranjang Belanja
                        </h1>
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* LEFT COLUMN: Cart Items or Empty State Message */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.length > 0 ? (
                                    // RENDER CART ITEMS
                                    cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
                                            
                                            {/* Image Placeholder (Orange Square) */}
                                            <div className="flex-shrink-0 w-14 h-14 bg-orange-200 rounded-lg flex items-center justify-center shadow-inner">
                                                <Package className="h-7 w-7 text-orange-600" />
                                            </div>
                                            
                                            {/* Details */}
                                            <div className="flex-grow">
                                                <p className="font-semibold text-lg line-clamp-1 text-gray-800">{item.name}</p>
                                                <p className="text-orange-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            
                                            {/* Quantity Controls and Trash (Styled smaller) */}
                                            <div className="flex items-center space-x-2">
                                                {/* Quantity Input Group */}
                                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:bg-gray-100 p-0" 
                                                            onClick={() => updateQuantity(item.product_id, -1)} disabled={item.quantity <= 1}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input 
                                                        type="number" 
                                                        readOnly 
                                                        value={item.quantity} 
                                                        className="w-8 text-center text-sm h-7 p-0 border-y-0 border-x border-gray-300 bg-white focus:ring-0"
                                                    />
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:bg-gray-100 p-0" 
                                                            onClick={() => updateQuantity(item.product_id, 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 h-7 w-7 p-0" onClick={() => removeItem(item.product_id)}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // EMPTY CART MESSAGE (Styled to fill the space)
                                    <div className="bg-white p-12 rounded-xl shadow-xl border-2 border-dashed border-orange-300 text-center space-y-4">
                                        <ShoppingCart className="h-12 w-12 text-orange-500 mx-auto" />
                                        <h2 className="text-xl font-bold text-gray-800">Keranjangmu kosong, mulai belanja!</h2>
                                        <p className="text-gray-600">Jelajahi katalog kami dan temukan produk favoritmu.</p>
                                        <Link href="/">
                                            <Button className="bg-orange-600 hover:bg-orange-700 font-semibold text-lg px-8 shadow-md mt-2">
                                                 Mulai Belanja
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Ringkasan / Summary (Matching image_cd9f9e.png) */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4 text-gray-800">Ringkasan</h2>
                                    
                                    {/* Total Price */}
                                    <div className="flex justify-between font-extrabold text-2xl mb-6">
                                        <span className="text-gray-700">Total:</span>
                                        <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                    
                                    {/* Checkout Button */}
                                    <Button 
                                        onClick={() => setStep('form')} 
                                        className={`w-full font-bold text-lg h-12 shadow-md transition-colors ${
                                            cartItems.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={cartItems.length === 0}
                                    >
                                        Check Out
                                    </Button>
                                    
                                    {/* Continue Shopping Link */}
                                    <div className="mt-4 text-center">
                                        <Link href="/" className="text-orange-500 font-medium hover:underline text-sm transition-colors">
                                            Lanjut Belanja
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {step === 'form' && (
                    <div className="max-w-2xl mx-auto pt-4">
                        {/* Kembali Link */}
                        <button onClick={() => setStep('cart')} className="flex items-center text-orange-600 font-semibold mb-6 hover:text-orange-700 transition">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                        </button>
                        
                        {/* Form Card (Matching image_cd9f5f.png style) */}
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-200">
                            <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Form Pemesanan</h1>
                            
                            {/* QRIS Section (Yellow Background) */}
                            <div className="bg-yellow-50 border border-yellow-200 p-6 text-center rounded-lg mb-6">
                                <p className="font-semibold text-gray-700 mb-4">Silahkan Scan QRIS berikut</p>
                                <div className="w-40 h-40 bg-gray-300 rounded-lg mx-auto flex items-center justify-center mb-2">
                                    {/* Mock QRIS Placeholder */}
                                    <div className="h-10 w-10 bg-gray-500 rounded-sm"></div> 
                                </div>
                                <p className="font-extrabold text-xl text-orange-600">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama Lengkap */}
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        value={data.buyer_name}
                                        onChange={e => setData('buyer_name', e.target.value)}
                                        required
                                        className="h-10 mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    />
                                    {errors.buyer_name && <span className="text-red-500 text-xs mt-1 block">{errors.buyer_name}</span>}
                                </div>
                                
                                {/* Nomor WhatsApp */}
                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium">Nomor WhatsApp</Label>
                                    <Input 
                                        id="phone" 
                                        value={data.buyer_phone}
                                        onChange={e => setData('buyer_phone', e.target.value)}
                                        required
                                        placeholder="0812..."
                                        className="h-10 mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    />
                                    {errors.buyer_phone && <span className="text-red-500 text-xs mt-1 block">{errors.buyer_phone}</span>}
                                </div>
                                
                                {/* Upload Bukti Transfer (Using a styled label for file input) */}
                                <div>
                                    <Label htmlFor="transfer_proof" className="text-sm font-medium block mb-1">Upload Bukti Transfer</Label>
                                    <div className="flex border border-gray-300 rounded-lg overflow-hidden h-10">
                                        {/* Styled Button/Label for 'Choose File' */}
                                        <label 
                                            htmlFor="transfer_proof" 
                                            className="bg-gray-100 px-4 py-2 flex items-center border-r border-gray-300 cursor-pointer text-sm text-gray-700 hover:bg-gray-200"
                                        >
                                            Choose File
                                        </label>
                                        {/* Display file name */}
                                        <span className="px-3 py-2 text-gray-500 flex items-center text-sm italic">
                                            No File Chosen
                                        </span>
                                        <Input 
                                            id="transfer_proof" 
                                            type="file" 
                                            className="hidden" // Hiding the actual file input
                                            // Note: In a real app, you would handle file change here and update state/data
                                            accept=".jpg, .jpeg, .png"
                                            disabled={processing}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">*format must be JPG/PNG</p>
                                </div>

                                {/* Address and Notes Fields (Retained from original component) */}
                                <div>
                                    <Label htmlFor="address" className="text-sm font-medium">Alamat Pengiriman / COD</Label>
                                    <Input 
                                        id="address" 
                                        value={data.buyer_address}
                                        onChange={e => setData('buyer_address', e.target.value)}
                                        required
                                        className="h-10 mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    />
                                    {errors.buyer_address && <span className="text-red-500 text-xs mt-1 block">{errors.buyer_address}</span>}
                                </div>
                                <div>
                                    <Label htmlFor="notes" className="text-sm font-medium">Catatan (Opsional)</Label>
                                    <Input 
                                        id="notes" 
                                        value={data.buyer_notes}
                                        onChange={e => setData('buyer_notes', e.target.value)}
                                        className="h-10 mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    />
                                </div>
                                
                                {/* Buat Pesanan Button */}
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 mt-6 shadow-md" disabled={processing}>
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
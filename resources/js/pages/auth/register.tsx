import { useEffect, useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Package, Search, ShoppingCart } from 'lucide-react';

// --- Komponen Layout Internal (Agar seragam dengan Login) ---
const AuthLayoutWrapper = ({ 
    children, 
    title, 
    description 
}: { 
    children: React.ReactNode;
    title: string;
    description: string;
}) => {
    const [cartCount, setCartCount] = useState(0);

    // Hitung jumlah item keranjang dari localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('danusan_cart') || '[]');
            const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
            setCartCount(count);
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col font-sans text-slate-800">
            {/* Navbar Oranye */}
            <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                    </Link>
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Tombol Login Staff (Link ke halaman login) */}
                        <Link href="/login">
                            <Button className="bg-white text-[#EA580C] font-bold hover:bg-orange-50 shadow-md border-0 hidden sm:flex">
                                Login Staff
                            </Button>
                        </Link>
                        
                        <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                            <Search className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">Lacak</span>
                        </Link>
                        
                        <Link href="/cart/checkout" className="relative">
                            <Button variant="outline" size="icon" className="bg-transparent border-white text-white hover:bg-white hover:text-[#EA580C]">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#EA580C]">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Konten Utama */}
            <div className="flex-grow flex flex-col justify-center items-center p-4 sm:p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
                        <p className="text-gray-500 mt-2 text-sm">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'seller', // Default role
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        };
    };

    return (
        <AuthLayoutWrapper
            title="Daftar Akun"
            description="Bergabunglah untuk mulai berjualan atau mengelola pesanan."
        >
            <Head title="Daftar Akun" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Nama */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Contoh: Budi Santoso"
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="nama@email.com"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Role Selection */}
                <div className="grid gap-2">
                    <Label htmlFor="role">Daftar Sebagai</Label>
                    <div className="relative">
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-orange-500 focus:ring-orange-500 focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="seller">Seller (Penjual)</option>
                            <option value="admin">Admin</option>
                        </select>
                        {/* Custom Arrow Icon for Select */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <InputError message={errors.role} />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="********"
                    />
                    <InputError message={errors.password} />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="********"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button 
                    type="submit" 
                    className="mt-4 w-full bg-[#EA580C] hover:bg-orange-700 font-bold text-lg h-11 shadow-lg transition-all" 
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mendaftar...
                        </>
                    ) : (
                        'Daftar Sekarang'
                    )}
                </Button>

                <div className="text-center text-sm text-gray-600 space-y-3 mt-2">
                    <p>
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="font-bold text-[#EA580C] hover:text-orange-800 transition underline decoration-orange-300 underline-offset-4"
                        >
                            Masuk (Login)
                        </Link>
                    </p>
                    <div className="border-t border-gray-100 pt-3">
                        <Link href="/" className="text-gray-500 text-xs hover:text-[#EA580C] transition flex items-center justify-center gap-1">
                            &larr; Kembali ke Menu Pembeli
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayoutWrapper>
    );
}
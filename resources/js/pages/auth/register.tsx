import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, ReactNode } from 'react';
// import AuthLayout from '@/layouts/auth-layout'; // Placeholder used instead
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Package, Search, ShoppingCart } from 'lucide-react'; 

// --- PLACEHOLDER COMPONENTS FOR PREVIEW ---
const AuthLayoutPlaceholder = ({ title, description, children }: { title: string, description: string, children: ReactNode }) => (
    <div className="min-h-screen bg-orange-50 flex flex-col">
        {/* Navigasi Bar Oranye */}
        <nav className="bg-orange-600 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Package className="h-7 w-7 text-white" />
                    <div className="font-extrabold text-2xl text-white tracking-wide">Danusan-X</div>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/secret-gate">
                        <Button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                            Login Staff
                        </Button>
                    </Link>
                    <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                        <Search className="h-5 w-5 mr-1" />
                        Lacak
                    </Link>
                    <Link href="/cart/checkout">
                        <Button className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600 p-2">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>

        {/* Konten Utama */}
        <div className="flex flex-grow justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{title}</h1>
                <p className="text-center text-gray-600 mb-6">{description}</p>
                {children}
            </div>
        </div>
    </div>
);
// --- END PLACEHOLDER ---

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin', 
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayoutPlaceholder
            title="Buat Akun Baru"
            description="Masukkan detail Anda di bawah ini untuk mendaftar"
        >
            <Head title="Daftar Akun" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-4">
                    {/* Nama */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            className="h-10 focus:border-orange-500 focus:ring-orange-500"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="h-10 focus:border-orange-500 focus:ring-orange-500"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* Pilihan Role */}
                    <div className="grid gap-2">
                        <Label htmlFor="role">Daftar Sebagai</Label>
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                        </select>
                        <InputError message={errors.role} className="mt-1" />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="h-10 focus:border-orange-500 focus:ring-orange-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="h-10 focus:border-orange-500 focus:ring-orange-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors" 
                        disabled={processing}
                    >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Daftar Sekarang
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link
                        href="/login"
                        className="font-bold text-orange-600 hover:text-orange-700 transition underline underline-offset-4"
                    >
                        Masuk (Login)
                    </Link>
                </div>
            </form>
        </AuthLayoutPlaceholder>
    );
}
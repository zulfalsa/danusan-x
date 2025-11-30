// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Head } from '@inertiajs/react'; // FIX: Hapus Form dari import Inertia
import { LoaderCircle, Package, Search, ShoppingCart } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import AuthLayout from '@/layouts/auth-layout'; // Placeholder digunakan sebagai gantinya
import React, { useState, ReactNode } from "react"; 

// --- GLOBAL TYPE DECLARATIONS ---
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---

// --- INTERFACES & TYPES (Dideklarasikan di atas) ---
interface PlaceholderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

// FIX ts(2430): Sederhanakan interface FormProps agar tidak konflik dengan HTMLAttributes
interface PlaceholderFormProps {
    // Simulasi properti form Inertia
    children: (props: { processing: boolean, errors: any }) => ReactNode;
    // Tambahkan properti umum form HTML untuk mencegah konflik
    className?: string;
    // Tambahkan properti Inertia yang digunakan di komponen
    resetOnSuccess?: string[]; 
}
// --- END INTERFACES & TYPES ---


// --- START: PLACEHOLDER INERTIA & LAYOUT COMPONENTS ---
// Placeholder untuk Link dari Inertia
const Link = ({ href, children, className, ...props }: PlaceholderLinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

// Placeholder untuk Form Inertia (untuk kompilasi Canvas)
const Form = ({ children, ...props }: PlaceholderFormProps) => {
    // Status simulasi untuk kompilasi
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({}); 

    // Tidak ada implementasi post/get sesungguhnya
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            // Simulasi error agar styling error dapat dilihat di Canvas
            setErrors({ email: 'Simulasi error: Email tidak ditemukan.' }); 
        }, 800);
    };

    return (
        <form onSubmit={handleSubmit} {...props}>
            {children({ processing, errors })}
        </form>
    );
};

// Placeholder untuk AuthLayout, menggunakan properti title dan description
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

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayoutPlaceholder
            title="Lupa Kata Sandi"
            description="Masukkan email Anda untuk menerima tautan reset kata sandi"
        >
            <Head title="Lupa Kata Sandi" />

            {status && (
                // Styling pesan status hijau
                <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-100 p-3 rounded-lg border border-green-300">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    // Styling fokus oranye
                                    className="h-10 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="email@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="flex items-center justify-start">
                                <Button
                                    className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        'Kirim Tautan Reset Password'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-gray-600">
                    <span>Atau, kembali ke</span>
                    {/* Styling link login dengan warna oranye */}
                    <TextLink 
                        href={login()} 
                        className="font-bold text-orange-600 hover:text-orange-700 transition underline underline-offset-4"
                    >
                        Masuk (Login)
                    </TextLink>
                </div>
            </div>
        </AuthLayoutPlaceholder>
    );
}
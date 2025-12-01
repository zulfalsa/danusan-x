import { update } from '@/routes/password';
import { Head } from '@inertiajs/react'; // FIX: Form dihapus dari impor Inertia

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// import AuthLayout from '@/layouts/auth-layout'; // Placeholder digunakan sebagai gantinya

import React, { useState, ReactNode } from "react";
import { Package, Search, ShoppingCart, LoaderCircle } from 'lucide-react'; 

// --- GLOBAL TYPE DECLARATIONS ---
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---

// --- INTERFACES & TYPES ---
interface ResetPasswordProps {
    token: string;
    email: string;
}

interface PlaceholderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

// FIX ts(2739) FINAL: Sederhanakan interface FormProps agar hanya mengandung children yang fungsional
interface PlaceholderFormProps {
    children: (props: { processing: boolean, errors: any }) => ReactNode;
}
// --- END INTERFACES & TYPES ---

// --- START: PLACEHOLDER INERTIA & LAYOUT COMPONENTS ---

// Placeholder Link
const Link = ({ href, children, className, ...props }: PlaceholderLinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

// Placeholder Form (Mimicking processing logic)
// Menggunakan generic untuk menerima semua props Inertia yang disebar (*update.form()*)
const Form = ({ children, ...props }: PlaceholderFormProps & React.HTMLAttributes<HTMLFormElement> & any) => {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({}); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            // Simulasi error untuk melihat styling error
            setErrors({ password: 'Simulasi error: Password baru terlalu pendek.' }); 
        }, 800);
    };

    return (
        // Mengabaikan properti Inertia yang tidak perlu disimulasikan (transform, resetOnSuccess, dll.)
        <form onSubmit={handleSubmit} className={props.className} {...props}>
            {/* Mengirimkan properti yang dibutuhkan oleh children function */}
            {children({ processing: props.processing || processing, errors: props.errors || errors })}
        </form>
    );
};

// Placeholder AuthLayout
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

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayoutPlaceholder
            title="Atur Ulang Kata Sandi"
            description="Masukkan kata sandi baru Anda di bawah ini"
        >
            <Head title="Atur Ulang Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data: any) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }: { processing: boolean, errors: any }) => ( // FIX: Deklarasi tipe eksplisit untuk menghilangkan ts(7031)
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                // Styling read-only input
                                className="mt-1 block w-full h-10 focus:border-orange-500 focus:ring-orange-500 bg-gray-100 cursor-default"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password Baru</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                // Styling fokus oranye
                                className="mt-1 block w-full h-10 focus:border-orange-500 focus:ring-orange-500"
                                autoFocus
                                placeholder="Password baru"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                // Styling fokus oranye
                                className="mt-1 block w-full h-10 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Konfirmasi password"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            // Styling tombol submit oranye
                            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Atur Ulang Password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayoutPlaceholder>
    );
}
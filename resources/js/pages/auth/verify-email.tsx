// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
// import AuthLayout from '@/layouts/auth-layout'; // Placeholder digunakan sebagai gantinya
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Head } from '@inertiajs/react'; // FIX: Form dihapus dari impor Inertia

import React, { useState, ReactNode } from "react";
import { Package, Search, ShoppingCart } from 'lucide-react'; 

// --- GLOBAL TYPE DECLARATIONS ---
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---

// --- INTERFACES & TYPES ---
interface VerifyEmailProps {
    status?: string;
}

interface PlaceholderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

// FIX ts(2322): Sederhanakan interface FormProps agar hanya mengandung children yang fungsional
interface PlaceholderFormProps {
    children: (props: { processing: boolean, errors: any }) => ReactNode;
    className?: string;
}
// --- END INTERFACES & TYPES ---

// --- START: PLACEHOLDER INERTIA & LAYOUT COMPONENTS ---
const Link = ({ href, children, className, ...props }: PlaceholderLinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

// Placeholder Form (Mimicking processing logic)
const Form = ({ children, ...props }: PlaceholderFormProps & React.HTMLAttributes<HTMLFormElement> & any) => {
    const [processing, setProcessing] = useState(false);
    const [errors] = useState<any>({}); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            console.log("Simulated verification link resent.");
        }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className={props.className} {...props}>
            {/* FIX: Melakukan type casting eksplisit untuk menghilangkan ts(2322) */}
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
                        <button className="bg-white text-orange-600 font-bold hover:bg-orange-100 shadow-md">
                            Login Staff
                        </button>
                    </Link>
                    <Link href="/order/track" className="flex items-center text-white text-sm font-medium hover:text-orange-200 transition">
                        <Search className="h-5 w-5 mr-1" />
                        Lacak
                    </Link>
                    <Link href="/cart/checkout">
                        <button className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600 p-2">
                            <ShoppingCart className="h-5 w-5" />
                        </button>
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

export default function VerifyEmail({ status }: VerifyEmailProps) {
    return (
        <AuthLayoutPlaceholder
            title="Verifikasi Email"
            description="Harap verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan ke email Anda."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-center text-sm font-medium text-green-600 bg-green-100 p-3 rounded-lg border border-green-300">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing, errors }: { processing: boolean, errors: any }) => (
                    <>
                        <Button 
                            disabled={processing} 
                            // Styling tombol utama oranye
                            className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <TextLink
                            href={logout()}
                            // Styling tautan logout oranye
                            className="mx-auto block text-sm font-bold text-orange-600 hover:text-orange-700 transition"
                        >
                            Keluar (Logout)
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayoutPlaceholder>
    );
}
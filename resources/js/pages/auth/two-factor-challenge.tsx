import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
// FIX: OTP_MAX_LENGTH didefinisikan secara lokal untuk self-contained
const OTP_MAX_LENGTH = 6;
// FIX: Mengubah REGEXP_ONLY_DIGITS menjadi string literal untuk prop pattern
const REGEXP_ONLY_DIGITS_STRING = '\\d+'; 

import AuthLayout from '@/layouts/auth-layout'; // Placeholder digunakan sebagai gantinya
import { store } from '@/routes/two-factor/login'; // Placeholder digunakan
import { Head } from '@inertiajs/react'; // FIX: Link dihapus dari impor Inertia
import { Package, Search, ShoppingCart, LoaderCircle } from 'lucide-react';
import React, { useMemo, useState, ReactNode } from 'react';

// --- GLOBAL TYPE DECLARATIONS ---
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---

// --- INTERFACES & TYPES ---
interface PlaceholderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

interface PlaceholderFormProps {
    children: (props: { processing: boolean, errors: any, clearErrors: () => void }) => ReactNode;
    resetOnError?: boolean;
    resetOnSuccess?: boolean;
    className?: string;
}
// --- END INTERFACES & TYPES ---

// --- START: PLACEHOLDER INERTIA & LAYOUT COMPONENTS ---
// FIX: Link didefinisikan sebagai placeholder di sini
const Link = ({ href, children, className, ...props }: PlaceholderLinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

const Form = ({ children, resetOnError, className }: PlaceholderFormProps) => {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({}); 

    const clearErrors = () => setErrors({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setErrors({ code: 'Simulasi error: Kode salah.' }); 
        }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children({ processing, errors, clearErrors })}
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
                        <button className="bg-white text-orange-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-100 transition">
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


export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode Pemulihan',
                description:
                    'Masukkan salah satu kode pemulihan darurat Anda untuk mengkonfirmasi akses.',
                toggleText: 'Masuk menggunakan kode otentikasi',
            };
        }

        return {
            title: 'Kode Otentikasi',
            description:
                'Masukkan kode otentikasi yang disediakan oleh aplikasi otentikator Anda.',
            toggleText: 'Masuk menggunakan kode pemulihan',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <AuthLayoutPlaceholder
            title={authConfigContent.title}
            description={authConfigContent.description}
        >
            <Head title="Two-Factor Authentication" />

            <div className="space-y-6">
                <Form
                    {...store.form()}
                    className="space-y-6" // Menambahkan space-y-6 untuk jarak yang lebih baik
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <>
                                    <Input
                                        name="recovery_code"
                                        type="text"
                                        placeholder="Masukkan kode pemulihan"
                                        autoFocus={showRecoveryInput}
                                        required
                                        // Styling fokus oranye
                                        className="h-10 focus:border-orange-500 focus:ring-orange-500"
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                    <div className="flex w-full items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS_STRING}
                                            // Styling slot agar konsisten
                                            className="[&>div:focus]:border-orange-500"
                                            autoFocus
                                        >
                                            <InputOTPGroup>
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            // Styling slot agar fokus menggunakan warna oranye
                                                            className="h-14 w-10 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 data-[state=active]:border-orange-500"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Lanjutkan
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                <span>atau Anda dapat </span>
                                <button
                                    type="button"
                                    className="cursor-pointer font-bold text-orange-600 underline underline-offset-4 transition-colors duration-300 ease-out hover:text-orange-700"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayoutPlaceholder>
    );
}
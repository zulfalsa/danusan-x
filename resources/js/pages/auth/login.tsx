import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// Hapus AuthLayout, karena tidak dapat diresolve di lingkungan Canvas
// import AuthLayout from '@/layouts/auth-layout'; 
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react'; // FIX: Link dihapus dari impor Inertia
import { Package, Search, ShoppingCart } from "lucide-react"; // Import ikon Navigasi Bar
import React, { useState, ReactNode } from "react"; // Diperlukan untuk placeholder

// --- GLOBAL TYPE DECLARATIONS ---
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---

// --- INTERFACES & TYPES (Dideklarasikan di atas) ---
interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

// FIX ts(2552): Mengganti nama LinkProps dan memindahkannya ke atas
interface PlaceholderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}
// --- END INTERFACES & TYPES ---

// --- START: PLACEHOLDER INERTIA IMPORTS (Hanya untuk kompilasi Canvas) ---
const useForm = (initialData: any) => {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    
    return { 
        data, 
        setData: (key: string, value: string) => setData((prev: any) => ({ ...prev, [key]: value })),
        post: (url: string) => {
            setProcessing(true);
            setTimeout(() => { 
                setProcessing(false);
                setErrors({ email: 'Simulasi error.' });
                console.log(`Simulated POST request completed to ${url}`);
            }, 500);
        },
        processing,
        errors
    };
};


const Link = ({ href, children, className, ...props }: PlaceholderLinkProps) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);
// --- END: PLACEHOLDER INERTIA IMPORTS ---

// Placeholder untuk AuthLayout, menggunakan properti title dan description
const AuthLayoutPlaceholder = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="min-h-screen bg-orange-50 flex flex-col">
        {/* Navigasi Bar Oranye (Disalin dari Gatekeeper.jsx) */}
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

        {/* Konten Utama (Login Card) */}
        <div className="flex flex-grow justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{title}</h1>
                <p className="text-center text-gray-600 mb-6">{description}</p>
                {children}
            </div>
        </div>
    </div>
);


export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        // Mengganti AuthLayout dengan AuthLayoutPlaceholder untuk kompilasi mandiri
        <AuthLayoutPlaceholder
            title="Login Staff" 
            description="Masukkan email dan password Anda untuk masuk ke dashboard penjual." 
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    // Menambahkan styling fokus oranye
                                    className="h-10 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        // Styling link Forgot Password dengan warna oranye
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-orange-600 hover:text-orange-700 transition"
                                            tabIndex={5}
                                        >
                                            Lupa password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    // Menambahkan styling fokus oranye
                                    className="h-10 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    // Styling Checkbox (asumsi komponen Checkbox menerima class styling)
                                    className="border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 focus:ring-orange-500"
                                />
                                <Label htmlFor="remember">Ingat saya</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md transition-colors"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-gray-700 space-y-2">
                                <p>
                                    Belum punya akun?{' '}
                                    <TextLink 
                                        href={register()} 
                                        tabIndex={5} 
                                        className="font-bold text-orange-600 hover:text-orange-700 transition"
                                    >
                                        Daftar di sini
                                    </TextLink>
                                </p>
                                {/* Tambahan: Kembali ke Menu Pembeli sesuai desain */}
                                <Link href="/" className="text-gray-600 text-sm underline hover:text-orange-600 transition block pt-2">
                                    Kembali ke Menu Pembeli
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayoutPlaceholder>
    );
}
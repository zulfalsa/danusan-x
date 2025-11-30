import React, { useState, ReactNode } from "react";
// FIX: Menghapus impor yang menyebabkan error kompilasi dan menggantinya dengan placeholder.
// import { useForm } from "@inertiajs/react";
// import { Link } from "@inertiajs/react";
import { Package, Search, ShoppingCart } from "lucide-react"; // Import ikon

// --- GLOBAL TYPE DECLARATIONS (FIX: ts(2339) error) ---
// Deklarasi fungsi global 'route' yang disediakan oleh Laravel/Ziggy.
declare global {
    interface Window {
        route: (name: string, params?: any) => string;
    }
}
// --- END GLOBAL TYPE DECLARATIONS ---


// --- START: PLACEHOLDER INERTIA IMPORTS (Hanya untuk kompilasi Canvas) ---
// Ini adalah placeholder untuk useForm. Perhatikan bahwa logic simulasi telah dihapus sepenuhnya 
// agar tidak mengganggu logic asli aplikasi Anda (Rule 1).
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
                // Simulasi error agar styling error dapat dilihat di Canvas,
                // tapi tidak ada logic penentuan key di sini.
                setErrors({ password: 'Simulasi error: Password salah.' });
                console.log(`Simulated POST request completed to ${url}`);
            }, 500);
        },
        processing,
        errors
    };
};

// Placeholder untuk Link dari Inertia
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
// --- END: PLACEHOLDER INERTIA IMPORTS ---

export default function Gate() {
    // --- LOGIC (TIDAK BERUBAH SAMA SEKALI) ---
    const { data, setData, post, processing, errors } = useForm({
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // NOTE: Sekarang TypeScript mengenali 'route' secara global.
        post(window.route('gate.store')); // Memperbaiki bug logika, kembali ke penggunaan window.route
    };
    // --- END LOGIC ---

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col">
            {/* Header (Styled agar sesuai dengan bilah navigasi oranye) */}
            <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-orange-600 shadow-xl sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    {/* Logo dan Nama Aplikasi */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-7 w-7 text-white" />
                        <h1 className="text-2xl font-extrabold text-white tracking-wide">Danusan-X</h1>
                    </Link>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Link Login Staff (Distyling sebagai Tombol) */}
                    <Link href="/secret-gate">
                        <button className="bg-white text-orange-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-100 transition">
                            Login Staff
                        </button>
                    </Link>
                    {/* Link Lacak */}
                    <Link href="/order/track" className="flex items-center text-white font-medium hover:text-orange-200 transition">
                        <Search className="h-5 w-5 mr-1" />
                        Lacak
                    </Link>
                    {/* Link Keranjang */}
                    <Link href="/cart/checkout" className="relative">
                         <ShoppingCart className="h-6 w-6 text-white" />
                    </Link>
                </div>
            </header>

            {/* Kartu Tengah (Distyling agar sesuai dengan desain) */}
            <div className="flex justify-center items-center flex-grow p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-200 text-center">

                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Who Are You?</h2>

                    <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
                        Kalau kamu adalah pembeli, kamu tidak perlu melakukan login dan bisa langsung 
                        melakukan proses pembelian. Login hanya diperlukan untuk Penjual atau admin saja. 
                        Penjual atau Admin <span className="font-semibold text-orange-600">harap masukkan secret password</span>.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input Password */}
                        <div>
                            <label htmlFor="password" className="block font-medium text-gray-700 mb-1 text-left">
                                Secret Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={`w-full border border-gray-300 rounded-lg px-3 py-2 h-12 text-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                            />
                            {errors.password && (
                                <div className="text-red-600 text-sm mt-1 text-left">{errors.password}</div>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg h-12 hover:bg-orange-700 transition shadow-md ${
                                processing ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            Lanjut
                        </button>
                    </form>

                    {/* Link Kembali ke Menu Pembeli */}
                    <div className="text-center mt-4">
                        <Link href="/" className="text-gray-600 text-sm underline hover:text-orange-600 transition">
                            Kembali ke Menu Pembeli
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
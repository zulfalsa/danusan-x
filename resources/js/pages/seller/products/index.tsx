import React, { useState } from "react";
// Menggunakan import asli Inertia dan Layout Anda
import { Head, useForm, router, Link } from "@inertiajs/react"; 
import AppLayout from "@/layouts/app-layout"; 
import { Package, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    // Tambahkan properti yang hilang (diasumsikan ada di backend)
    category?: string; 
    description?: string;
}

interface Props {
    products: Product[];
}

// Tipe data yang digunakan untuk form Inertia
interface FormDataType {
    name: string;
    price: string;
    stock: string;
    category: string;
    description: string;
    image: File | null;
}

export default function SellerProducts({ products }: Props) {
    // FIX: Pastikan array produk terdefinisi
    const productList = products || []; 
    const [isAdding, setIsAdding] = useState(false);

    // FIX: Menambahkan kembali category dan description ke state useForm
    const { data, setData, post, processing, reset } = useForm<FormDataType>({
        name: "",
        price: "",
        stock: "",
        category: "", // Ditambahkan kembali
        description: "", // Ditambahkan kembali
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/seller/products", {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setIsAdding(false);
            },
            onError: (errors) => {
                console.error("Form submission errors:", errors);
            }
        });
    };

    const deleteProduct = (id: number) => {
        // PERATURAN: Penggunaan `confirm()` dipertahankan sesuai aturan 1
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        router.delete(`/seller/products/${id}`);
    };

    const handleBackToDashboard = () => {
        // Menggunakan router.visit asli Inertia untuk kembali ke orders dashboard
        router.visit('/seller/orders');
    };

    return (
        <AppLayout>
            <Head title="Manajemen Produk" />

            {/* --- TOP HEADER SECTION (ORANGE) --- */}
            <div className="p-6 bg-orange-600 sticky top-0 z-10 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-white">Manajemen Produk</h1>
                <div className="flex space-x-4 items-center">
                    {/* Tombol Kembali ke Dashboard */}
                    <button 
                        onClick={handleBackToDashboard}
                        className="bg-white/90 text-orange-600 border-white/50 hover:bg-orange-50 hover:text-orange-700 transition duration-150 rounded-lg shadow-md font-semibold px-4 py-2 text-sm flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center border-b pb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                        <Package className="h-6 w-6 text-orange-600" />
                        Daftar Produk
                    </h1>

                    <button
                        onClick={() => setIsAdding(true)}
                        // Styling oranye sesuai desain
                        style={{ backgroundColor: '#FF8A00' }} 
                        className="hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-md transition duration-150"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Produk
                    </button>
                </div>

                {productList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-300 rounded-xl bg-white/70 text-gray-500 shadow-inner">
                        <Package className="h-16 w-16 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">Belum ada produk</p>
                        <p className="text-sm">Mulai tambahkan produk pertama Anda untuk berjualan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productList.map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Bagian Gambar Produk */}
                                <div className="h-48 bg-gray-100 relative">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        // MENGHILANGKAN PLACEHOLDER VISUAL JIKA TIDAK ADA GAMBAR
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
                                            {/* Konten dikosongkan untuk menyembunyikan placeholder */}
                                        </div>
                                    )}

                                    {/* Action Buttons overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Link 
                                            // Menggunakan Link asli Inertia untuk navigasi edit
                                            href={`/seller/products/${product.id}/edit`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 shadow-md font-medium"
                                        >
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Link>

                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 shadow-md font-medium"
                                        >
                                            <Trash2 className="h-4 w-4" /> Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Produk */}
                                <div className="p-4 flex-grow space-y-2">
                                    <h2 className="text-xl font-bold leading-snug text-gray-900">{product.name}</h2>
                                    
                                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                        <p className="text-lg font-extrabold text-orange-600">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </p>
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            Stok: {product.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODAL / FORM PENAMBAHAN PRODUK */}
                {isAdding && (
                    // Menerapkan efek backdrop blur dan mengurangi kegelapan overlay
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Tambah Produk Baru</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="font-semibold text-sm block mb-1 text-gray-700">Nama Produk</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-sm block mb-1 text-gray-700">Harga (Rp)</label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData("price", e.target.value)}
                                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-sm block mb-1 text-gray-700">Stok</label>
                                        <input
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData("stock", e.target.value)}
                                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                {/* Input Kategori */}
                                <div>
                                    <label className="font-semibold text-sm block mb-1 text-gray-700">Kategori (Opsional)</label>
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                        placeholder="Makanan, Minuman, Merchandise..."
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150"
                                    />
                                </div>

                                {/* Input Deskripsi */}
                                <div>
                                    <label className="font-semibold text-sm block mb-1 text-gray-700">Deskripsi (Opsional)</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Jelaskan detail produk..."
                                        rows={3}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-150 resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-sm block mb-1 text-gray-700">Gambar Produk</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
                                        className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition duration-150"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition duration-150"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition duration-150 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
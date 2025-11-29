import React, { useState, useEffect } from 'react';
import { LogOut, Package, ArrowLeft, Image, FileText, Tag, DollarSign, Box } from 'lucide-react';

// --- TIPE DEFINITION UNTUK TYPE SCRIPT ---

/**
 * Interface untuk data formulir produk.
 */
interface ProductFormData {
  name: string;
  price: number | '';
  stock: number | '';
  description: string;
  photoFile: File | null;
}

/**
 * Interface untuk data produk yang akan diedit (simulasi).
 * Jika null, maka mode Tambah. Jika ada, mode Edit.
 */
interface ExistingProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    imageUrl: string; // URL foto produk yang sudah ada
}

// --- KOMPONEN UTAMA FORM PRODUK ---
const App: React.FC = () => {
    // Simulasi data produk yang sedang diedit. 
    // Dalam aplikasi nyata, ini bisa didapatkan dari URL params atau props.
    // Kita simulasikan produk ini untuk menunjukkan mode Edit.
    const initialProductToEdit: ExistingProduct | null = {
        id: 123,
        name: 'Tahu Isi Spesial',
        price: 2500,
        stock: 45,
        description: 'Tahu goreng dengan isian sayur dan sambal pedas. Cocok untuk semua kalangan!',
        imageUrl: 'https://placehold.co/100x100/A0E7E5/333333?text=Tahu',
    };
    
    const [productToEdit] = useState<ExistingProduct | null>(null); // Ganti null menjadi initialProductToEdit untuk mencoba mode EDIT
    const isEditMode = productToEdit !== null;
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: '',
        stock: '',
        description: '',
        photoFile: null,
    });
    const [photoFileName, setPhotoFileName] = useState<string>('No File Chosen');

    // useEffect untuk memuat data jika dalam mode Edit
    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price,
                stock: productToEdit.stock,
                description: productToEdit.description,
                photoFile: null, // File tidak dimuat otomatis
            });
            setPhotoFileName(productToEdit.imageUrl ? 'Photo Existing' : 'No File Chosen');
        }
    }, [isEditMode, productToEdit]);


    // Fungsi untuk simulasi Logout (dari Dashboard)
    const handleLogout = (): void => {
        // Simulasi Logout
        const notificationContainer = document.getElementById('notification-container');
        if (notificationContainer) {
            const notification = document.createElement('div');
            notification.textContent = "Anda telah berhasil Logout (Simulasi).";
            notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-xl z-50 transition-opacity duration-300';
            notificationContainer.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
        console.log("Melakukan Logout Penjual...");
    };

    // Fungsi untuk kembali ke halaman sebelumnya
    const handleBack = (): void => {
        console.log("Navigasi kembali ke Dashboard Penjual...");
        // Di aplikasi nyata: window.history.back(); atau gunakan router
        alert("Simulasi: Kembali ke Dashboard Penjual.");
    };

    // Handler untuk input teks dan angka
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        // Konversi harga dan stok ke angka, atau biarkan kosong jika input tidak valid
        const numericValue = (name === 'price' || name === 'stock') ? 
                             (value === '' ? '' : parseFloat(value)) : value;
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: numericValue 
        }));
    };

    // Handler untuk input file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData(prev => ({ ...prev, photoFile: file }));
        setPhotoFileName(file ? file.name : 'No File Chosen');
    };

    // Handler untuk Submit Form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        
        // Validasi dasar
        if (!formData.name || !formData.price || !formData.stock || !formData.description) {
            alert("Harap lengkapi semua bidang yang wajib diisi.");
            return;
        }
        
        const action = isEditMode ? 'mengedit' : 'menambah';
        const endpoint = isEditMode ? `/api/products/${productToEdit?.id}` : '/api/products';
        
        console.log(`Mengirim data produk untuk ${action}:`, formData);
        console.log(`Endpoint target: ${endpoint} (Metode: ${isEditMode ? 'PUT/PATCH' : 'POST'})`);
        
        // Logika pengiriman data ke Laravel API di sini
        alert(`Simulasi: Data produk '${formData.name}' berhasil di${action}.`);
        
        // Reset form setelah submit (opsional)
        // if (!isEditMode) {
        //    setFormData({ name: '', price: '', stock: '', description: '', photoFile: null });
        //    setPhotoFileName('No File Chosen');
        // }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Container untuk Notifikasi */}
            <div id="notification-container"></div> 

            {/* HEADER SESUAI DESAIN ORANYE */}
            <header className="sticky top-0 z-20 bg-orange-600 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Package size={32} className="text-white" />
                        <h1 className="text-3xl font-extrabold text-white">Danusan-X</h1>
                    </div>
                    
                    {/* Tombol Seller & Logout DROPDOWN */}
                    <div className="relative group">
                        <button className="flex items-center bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-orange-800 transition duration-150">
                            <span>Seller</span>
                        </button>
                        {/* Dropdown Logout */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-200 transform scale-95 group-hover:scale-100 origin-top-right z-30">
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition"
                            >
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* KONTEN UTAMA FORM */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6">
                
                {/* Tombol Kembali */}
                <button 
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-orange-600 transition mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Kembali
                </button>

                {/* Card Form */}
                <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <h2 className="2xl font-bold text-gray-800 mb-6 border-b pb-3">
                        {isEditMode ? 'Edit Produk' : 'Tambah Produk'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Nama Produk */}
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                                <Tag size={20} className="mr-2 text-orange-500" /> Nama Produk
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                                placeholder="Contoh: Risol Mayo Jumbo"
                            />
                        </div>

                        {/* Harga dan Stok (Dua Kolom) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div>
                                <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                                    <DollarSign size={20} className="mr-2 text-orange-500" /> Harga
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    // Menggunakan value.toString() agar input dapat menerima number|''
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                                    placeholder="Contoh: 3500"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="stock" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                                    <Box size={20} className="mr-2 text-orange-500" /> Stok
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                                    placeholder="Contoh: 50"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Produk */}
                        <div>
                            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                                <FileText size={20} className="mr-2 text-orange-500" /> Deskripsi Produk
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition resize-none"
                                placeholder="Jelaskan detail produk Anda di sini."
                            />
                        </div>

                        {/* Foto Produk (Custom File Input) */}
                        <div>
                            <label htmlFor="photoFile" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                                <Image size={20} className="mr-2 text-orange-500" /> Foto Produk
                            </label>
                            
                            {isEditMode && productToEdit?.imageUrl && (
                                <p className="text-sm text-green-600 mb-2">Foto saat ini tersedia. Pilih file baru jika ingin mengubahnya.</p>
                            )}

                            <div className="flex items-center space-x-3">
                                <label htmlFor="photoFileInput" className="cursor-pointer bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150">
                                    Choose File
                                </label>
                                <input
                                    type="file"
                                    id="photoFileInput"
                                    name="photoFile"
                                    accept="image/jpeg, image/png"
                                    onChange={handleFileChange}
                                    className="hidden" // Sembunyikan input file asli
                                />
                                <span className="text-gray-500 truncate flex-1">
                                    {photoFileName}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">*Format harus JPG/PNG</p>
                        </div>

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-200 mt-8"
                        >
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah Produk'}
                        </button>
                    </form>

                </div>
            </main>

        </div>
    );
};

export default App;
import React, { useState } from 'react';
import { LogOut, Package, ArrowLeft, Plus, Edit, Trash2, Search, Zap } from 'lucide-react';

// --- TIPE DEFINITION UNTUK TYPE SCRIPT ---

/**
 * Interface untuk objek Produk Penjual.
 */
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string; // URL gambar produk (placeholder)
}

// --- DATA SIMULASI DIHAPUS, DIGANTI DENGAN ARRAY KOSONG ---
// CATATAN: Array ini harus diisi dari API Laravel Anda saat integrasi.
// const simulatedProducts: Product[] = [...] -> DIHAPUS

// --- KOMPONEN PEMBANTU ---

/**
 * Komponen Item dalam daftar Produk (Card/Row).
 */
const ProductItem: React.FC<{ product: Product, onEdit: (id: number) => void, onDelete: (id: number) => void }> = ({ product, onEdit, onDelete }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition duration-150 ${isOutOfStock ? 'bg-red-50 border border-red-300' : 'bg-white border border-gray-100 hover:shadow-md'}`}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Placeholder Gambar Produk */}
        <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/60x60/CCCCCC/333333?text=P"; }}
        />
        
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-lg truncate ${isOutOfStock ? 'text-red-700' : 'text-gray-900'}`}>{product.name}</p>
          <p className="text-sm text-gray-600 truncate">{product.category}</p>
          <p className="font-bold text-base text-green-700">Rp{product.price.toLocaleString('id-ID')}</p>
        </div>
      </div>
      
      {/* Kolom Stok & Aksi */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
            <p className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-gray-800'}`}>
                {product.stock}
            </p>
            <p className="text-xs text-gray-500">
                {isOutOfStock ? 'Habis' : 'Stok'}
            </p>
        </div>

        <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(product.id)}
              className="text-gray-500 hover:text-blue-500 transition p-2 rounded-full hover:bg-gray-100"
              title="Edit Produk"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="text-gray-500 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100"
              title="Hapus Produk"
            >
              <Trash2 size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};


// --- KOMPONEN UTAMA DAFTAR PRODUK ---
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fungsi untuk simulasi Logout
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

  // Fungsi Aksi Produk
  const handleAddProduct = (): void => {
    console.log("Navigasi ke halaman Tambah Produk...");
    alert("Simulasi: Navigasi ke Form Tambah Produk");
  };

  const handleEditProduct = (id: number): void => {
    console.log(`Edit Produk ID: ${id}`);
    alert(`Simulasi: Navigasi ke Form Edit Produk ID: ${id}`);
  };

  const handleDeleteProduct = (id: number): void => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Simulasi: Produk berhasil dihapus.");
    }
  };

  // Filter Produk berdasarkan pencarian
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          {/* Tombol Seller & Logout (Dropdown/Menu) */}
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
      
      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Header, Navigasi, dan Tombol Aksi */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <button onClick={() => window.history.back()} className="text-gray-600 hover:text-orange-600 transition">
                    <ArrowLeft size={28} />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Manajemen Produk</h2>
            </div>
            <button 
                onClick={handleAddProduct}
                className="flex items-center bg-orange-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-orange-600 transition duration-150"
            >
                <Plus size={18} className="mr-2" />
                <span>Tambah Produk</span>
            </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
            
            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Cari nama produk atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Daftar Produk */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <Zap size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-semibold">Tidak ada produk yang ditemukan.</p>
                    <p className="text-sm">Silakan tambah produk baru atau sesuaikan filter pencarian.</p>
                    {products.length === 0 && (
                        <button 
                            onClick={handleAddProduct}
                            className="mt-4 flex items-center justify-center mx-auto text-orange-600 font-medium hover:text-orange-800"
                        >
                            <Plus size={16} className="mr-1" /> Tambah Produk Sekarang
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProducts.map(product => (
                        <ProductItem 
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            )}
        </div>
      </main>

    </div>
  );
};

export default App;
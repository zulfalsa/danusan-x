import React, { useState } from 'react';
import { LogOut, Package, Edit, Trash2, ClipboardList, Plus, ArrowRight } from 'lucide-react';

// --- TIPE DEFINITION UNTUK TYPE SCRIPT ---

/**
 * Interface untuk objek Pesanan Penjual.
 */
interface Order {
  id: string;
  buyerName: string;
  status: 'Siap Diproses' | 'Sedang Dikirim' | 'Selesai';
  phone: string; // Nomor WA pembeli untuk fungsionalitas "Hubungi WA"
}

/**
 * Interface untuk objek Produk Penjual.
 */
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// --- DATA MOCKUP DIHAPUS, DIGANTI DENGAN ARRAY KOSONG ---
// const initialOrders: Order[] = [];
// const initialProducts: Product[] = [];

// --- KOMPONEN PEMBANTU ---

// Komponen Card Pesanan Masuk
// Komponen ini didesain untuk menampilkan HANYA SATU pesanan terbaru
const IncomingOrderCard: React.FC<{ order: Order, onContact: (phone: string) => void }> = ({ order, onContact }) => {
  return (
    <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg shadow-md flex flex-col space-y-3">
        {/* Header Pesanan */}
        <div className="flex justify-between items-start border-b border-orange-200 pb-2">
            <div className="text-left">
                <p className="font-semibold text-sm text-gray-700">{order.id}</p>
                <p className="text-lg font-bold text-gray-900">{order.buyerName}</p>
            </div>
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {order.status}
            </span>
        </div>

        {/* Tombol Aksi */}
        <button
            onClick={() => onContact(order.phone)}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-150 shadow-md"
        >
            Hubungi WA
        </button>
    </div>
  );
};

// Komponen Item Produk Saya
const ProductItem: React.FC<{ product: Product, onEdit: (id: number) => void, onDelete: (id: number) => void }> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        {/* Placeholder Gambar Produk */}
        <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md shadow-sm"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/50x50/CCCCCC/333333?text=P"; }}
        />
        <div>
          <p className="font-medium text-gray-800">{product.name}</p>
          <p className="text-sm font-bold text-gray-600">Rp{product.price.toLocaleString('id-ID')}</p>
        </div>
      </div>
      
      {/* Tombol Aksi */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit(product.id)}
          className="text-gray-500 hover:text-blue-500 transition p-1 rounded-full hover:bg-gray-100"
          title="Edit Produk"
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={() => onDelete(product.id)}
          className="text-gray-500 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100"
          title="Hapus Produk"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA DASHBOARD PENJUAL ---
const App: React.FC = () => {
  // State diinisialisasi dengan array kosong
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Fungsi untuk simulasi Logout
  const handleLogout = (): void => {
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

  // Fungsi untuk navigasi ke halaman Tambah Produk (simulasi)
  const handleAddProduct = (): void => {
    console.log("Navigasi ke halaman Tambah Produk...");
    alert("Simulasi: Navigasi ke Form Tambah Produk.");
  };

  // Fungsi untuk tombol "Hubungi WA"
  const handleContactWA = (phone: string): void => {
    window.open(`https://wa.me/${phone}`, '_blank');
    alert(`Simulasi: Membuka WhatsApp untuk nomor ${phone}`);
  };
  
  // FUNGSI BARU: Navigasi ke Daftar Pesanan
  const handleViewAllOrders = (): void => {
      console.log("Navigasi ke Daftar Pesanan: /seller/orders/index");
      alert("Simulasi: Navigasi ke Daftar Pesanan (/seller/orders/index).");
      // Di aplikasi nyata: window.location.href = '/seller/orders/index';
  };

  // FUNGSI BARU: Navigasi ke Daftar Produk
  const handleViewAllProducts = (): void => {
      console.log("Navigasi ke Daftar Produk: /seller/products/index");
      alert("Simulasi: Navigasi ke Daftar Produk (/seller/products/index).");
      // Di aplikasi nyata: window.location.href = '/seller/products/index';
  };


  // Fungsi Aksi Produk
  const handleEditProduct = (id: number): void => {
    console.log(`Edit Produk ID: ${id}`);
    alert(`Simulasi: Navigasi ke Edit Produk ID: ${id}`);
  };

  const handleDeleteProduct = (id: number): void => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Simulasi: Produk berhasil dihapus.");
    }
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
      
      {/* KONTEN UTAMA DASHBOARD */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Penjual</h2>
            <button 
                onClick={handleAddProduct}
                className="flex items-center bg-orange-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-orange-600 transition duration-150"
            >
                <Plus size={18} className="mr-2" />
                <span>Produk</span>
            </button>
        </div>

        {/* TATA LETAK DUA KOLOM (RESPONSIVE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Kiri: Pesanan Masuk (2/3 lebar di mobile, 1/3 di desktop) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-min">
                <div className="flex items-center justify-between text-gray-800 mb-4 border-b pb-2">
                    <div className="flex items-center space-x-2">
                        <ClipboardList size={24} className="text-orange-600" />
                        <h3 className="text-xl font-bold">Pesanan Masuk</h3>
                    </div>
                    {/* Tombol Lihat Selengkapnya - Pesanan */}
                    <button onClick={handleViewAllOrders} className="text-sm text-orange-600 hover:text-orange-800 transition flex items-center">
                        Lihat Selengkapnya <ArrowRight size={16} className="ml-1" />
                    </button>
                </div>
                
                {orders.length > 0 ? (
                    // Menampilkan pesanan pertama jika ada
                    <IncomingOrderCard order={orders[0]} onContact={handleContactWA} />
                ) : (
                    // Pesan jika tidak ada pesanan
                    <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Saat ini tidak ada pesanan baru.</p>
                    </div>
                )}
            </div>

            {/* Kolom Kanan: Produk Saya (Penuh di mobile, 2/3 di desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-gray-800 mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold">$ Produk Saya</h3>
                    {/* Tombol Lihat Selengkapnya - Produk */}
                    <button onClick={handleViewAllProducts} className="text-sm text-orange-600 hover:text-orange-800 transition flex items-center">
                        Lihat Selengkapnya <ArrowRight size={16} className="ml-1" />
                    </button>
                </div>
                
                <div className="space-y-2">
                    {/* Tampilkan 3 produk teratas saja di dashboard */}
                    {products.slice(0, 3).map(product => (
                        <ProductItem 
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                    {/* Pesan jika tidak ada produk */}
                    {products.length === 0 && (
                         <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">Anda belum memiliki produk. Tambahkan produk pertama Anda!</p>
                            <button 
                                onClick={handleAddProduct}
                                className="mt-3 text-orange-600 hover:text-orange-800 transition flex items-center justify-center mx-auto text-sm font-medium"
                            >
                                <Plus size={16} className="mr-1" /> Tambah Produk
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
      </main>

    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // <-- MENGGUNAKAN LINK ASLI INERTIA
import { ArrowLeft, Package, LogIn, Search, ShoppingCart, Menu, X, Image as ImageIcon, Upload } from 'lucide-react';

// --- KODE SAFELINK DIHAPUS ---

// MENGHILANGKAN EXPORT DEFAULT DI SINI (Membuat fungsi Checkout biasa)
function Checkout() {
  const [total, setTotal] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State Form
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    proof: null as File | null
  });

  // 1. Ambil Total Harga dari Keranjang saat dimuat
  useEffect(() => {
    const savedCart = localStorage.getItem('danusan_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        // Pastikan items adalah array dan memiliki properti price dan quantity
        const cartTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setTotal(cartTotal);
      } catch (e) {
        console.error("Gagal memuat keranjang");
      }
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, proof: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (total <= 0) {
        alert("Keranjang kosong. Silakan belanja terlebih dahulu!");
        return;
    }
    
    // 1. Generate Order ID Acak (Simulasi ID Transaksi)
    const randomOrderId = Math.floor(1000 + Math.random() * 9000);

    // 2. Kosongkan Keranjang (Simulasi)
    localStorage.removeItem('danusan_cart');
    window.dispatchEvent(new Event('storage')); // Update cart count di header

    // 3. Redirect ke Halaman Success (payment.tsx) dengan ID tersebut
    // Di project asli, ini adalah router.post('/order', form) yang kemudian redirect
    window.location.href = `/order/payment/${randomOrderId}`; // <-- PERUBAHAN KE RUTE PAYMENT
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-transparent border-2 border-white rounded p-1">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">Danusan-X</h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/auth/gate" className="flex items-center gap-1 bg-orange-700 hover:bg-orange-800 transition-colors px-3 py-1.5 rounded-md font-medium text-sm">
              <LogIn size={18} />
              <span>Login Staff</span>
            </Link>
            <Link href="/track" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
              <Search size={20} />
              <span className="font-medium">Lacak</span>
            </Link>
            <Link href="/cart" className="hover:text-orange-100 relative">
              <ShoppingCart size={24} />
              {/* Cart count diabaikan di sini, karena Checkout harusnya datang dari Cart */}
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors">
            <ArrowLeft size={20} />
            Kembali
          </Link>
        </div>

        {/* Kartu Form */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-black mb-6 border-b pb-4">Form Pemesanan</h2>

          {/* Kotak QRIS */}
          <div className="bg-[#FFFBEB] border border-orange-100 rounded-lg p-6 mb-8 text-center">
            <p className="font-bold text-gray-800 mb-4">Silahkan Scan QRIS berikut</p>
            
            {/* Placeholder QR Code */}
            <div className="bg-gray-700 w-48 h-32 mx-auto rounded-lg flex items-center justify-center mb-4 text-white">
               <ImageIcon size={48} />
            </div>

            <p className="font-bold text-lg text-black">
              Total: {formatCurrency(total)}
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                id="name"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            {/* No WA */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-800 mb-2">No WhatsApp</label>
              <input 
                type="tel" 
                id="whatsapp"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                value={form.whatsapp}
                onChange={(e) => setForm({...form, whatsapp: e.target.value})}
                required
              />
            </div>

            {/* Upload Bukti */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Upload Bukti Transfer</label>
              <div className="border border-gray-300 rounded-md p-1 flex items-center bg-white">
                <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors mr-3">
                  Choose File
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-gray-400 text-sm truncate">
                  {form.proof ? form.proof.name : 'No File Chosen'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">*format must be JPG/PNG</p>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 rounded-md transition-colors mt-4 shadow-sm"
            >
              Buat Pesanan
            </button>

          </form>
        </div>

      </main>
    </div>
  );
}

export default Checkout;
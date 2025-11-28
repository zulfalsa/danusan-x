import React, { useState } from 'react'; 
// import { useForm, Link, Head } from '@inertiajs/react'; // <-- UNCOMMENT INI DI VS CODE
import { Search, Package, ArrowLeft, Truck, AlertCircle, CheckCircle, Clock, XCircle, LogIn, ShoppingCart, Menu, X } from 'lucide-react';

// --- MOCKING INERTIA DAN HOOKS UNTUK STABILITAS ---
const Link = ({ href, className, children }: any) => <a href={href} className={className}>{children}</a>;
const Head = ({ title }: any) => <title>{title}</title>;
const useForm = (initialValues: any) => {
  const [data, setData] = React.useState(initialValues);
  return {
    data,
    setData: (key: string, value: any) => (setData({ ...data, [key]: value })),
    get: (url: string, options: any) => console.log(`Navigating to ${url}`, options),
    processing: false
  };
};
// -------------------------------------------------------------------

// Interface untuk Order (sesuai database Anda)
interface OrderItem {
  items_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Order {
  order_id: number;
  tracking_code: string;
  buyer_name: string;
  status: 'menunggu verifikasi' | 'diproses penjual' | 'selesai' | 'dibatalkan';
  total_price: number;
  items: OrderItem[];
}

function Track({ order }: { order?: Order }) {
  // Gunakan useForm dari Inertia untuk menangani input & submit form
  const { data, setData, get, processing } = useForm({
    code: order?.tracking_code || '', // Jika ada order (hasil cari sebelumnya), isi otomatis
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // State untuk mengontrol pesan error


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.code.trim()) return;

    // Menandai bahwa pencarian sudah dilakukan
    setHasSearched(true); 

    // Kirim request GET ke endpoint '/order/track' dengan parameter 'code'
    get('/order/track', {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Helper untuk warna status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'menunggu verifikasi': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'diproses penjual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'selesai': return 'bg-green-100 text-green-800 border-green-200';
      case 'dibatalkan': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper untuk icon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'menunggu verifikasi': return <Clock size={16} className="mr-1" />;
      case 'diproses penjual': return <Package size={16} className="mr-1" />;
      case 'selesai': return <CheckCircle size={16} className="mr-1" />;
      case 'dibatalkan': return <XCircle size={16} className="mr-1" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  // Tentukan apakah user sudah mencari dan tidak menemukan hasil
  const hasSearchedAndFailed = hasSearched && !processing && !order;


  return (
    <div className="min-h-screen bg-[#FFF7ED] font-sans text-gray-800">
      <Head title="Lacak Pesanan" />

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
            <Link href="/track" className="flex items-center gap-1 text-orange-100 font-bold transition-colors">
              <Search size={20} />
              <span className="font-medium">Lacak</span>
            </Link>
            <Link href="/cart" className="hover:text-orange-100 relative">
              <ShoppingCart size={24} />
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full border border-gray-100 transition-all duration-300">
          
          {/* Judul Form */}
          <div className="flex items-center gap-2 mb-6">
            <Truck size={28} className="text-black" />
            <h2 className="text-xl font-bold text-black">Lacak Status Pesanan</h2>
          </div>

          {/* Form Pencarian */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input 
              type="text" 
              placeholder="Masukkan Kode Tracking" 
              className={`flex-grow border rounded-md px-4 py-2 focus:ring-2 outline-none transition-colors ${
                hasSearchedAndFailed
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' // Merah jika error
                  : 'border-gray-400 focus:ring-orange-500 focus:border-orange-500'
              }`}
              value={data.code}
              onChange={(e: any) => setData('code', e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-md transition-colors disabled:opacity-70"
              disabled={processing}
            >
              {processing ? '...' : 'Cari'}
            </button>
          </form>

          {/* AREA HASIL PENCARIAN */}
          
          {order ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Header Kartu */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order ID</p>
                  <p className="font-bold text-lg text-black">#{order.tracking_code}</p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              {/* Isi Kartu */}
              <div className="p-5 space-y-4">
                
                {/* Info Pembeli */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nama Pembeli</p>
                  <p className="font-medium text-gray-900">{order.buyer_name}</p>
                </div>

                {/* List Barang */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Detail Barang</p>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.items_id} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                        <span className="text-gray-700">
                          {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total Harga */}
                <div className="pt-2 flex justify-between items-center border-t border-gray-200 mt-2">
                  <span className="font-bold text-gray-800">Total Tagihan</span>
                  <span className="font-bold text-orange-600 text-lg">{formatCurrency(order.total_price)}</span>
                </div>

                {/* Tombol Aksi Khusus (Jika status menunggu verifikasi) */}
                {order.status === 'menunggu verifikasi' && (
                  <div className="pt-2">
                    <Link 
                      href={`/order/payment/${order.tracking_code}`} 
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-colors text-sm"
                    >
                      Upload / Cek Bukti Pembayaran
                    </Link>
                  </div>
                )}

              </div>
            </div>
          ) : (
            // Pesan Tidak Ditemukan
            hasSearchedAndFailed && (
               <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <AlertCircle size={40} className="text-red-500" />
                  </div>
                  <h3 className="text-red-700 font-bold text-md mb-1">Pesanan Tidak Ditemukan</h3>
                  <p className="text-red-600 text-xs">
                    Pastikan kode tracking <strong>"{data.code}"</strong> sudah benar.
                  </p>
               </div>
            )
          )}

        </div>

        {/* Tombol Kembali */}
        <div className="mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Beranda
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Track;
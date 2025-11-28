import React, { useState } from 'react'; 
import { Link } from '@inertiajs/react';
import { CheckCircle, Package, LogIn, Search, ShoppingCart, Menu, X, Clipboard, ArrowLeft } from 'lucide-react';

interface Props {
  order_id: string; 
}

function Payment({ order_id }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const idToCopy = order_id;
    const tempInput = document.createElement('input');
    tempInput.value = idToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center border border-gray-100">
          
          {/* Icon Sukses */}
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-600 fill-green-100" />
          </div>

          <h2 className="text-xl font-bold text-black mb-6">Pesanan Berhasil Dibuat!</h2>

          {/* Kotak ID Pesanan */}
          <div className="bg-gray-200 rounded-md p-6 mb-4">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">ID PESANAN</p>
            <p className="text-4xl font-bold text-black tracking-widest mb-3">{order_id}</p>
            
            <button 
                onClick={handleCopy}
                className={`text-sm font-medium transition-colors inline-flex items-center gap-1 px-3 py-1 rounded-full ${copied ? 'bg-green-500 text-white' : 'text-red-500 hover:bg-red-50'}`}
            >
                <Clipboard size={14} />
                {copied ? 'ID Tersalin!' : 'Simpan ID untuk Pengecekan'}
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-8">
            Silakan cek status pesanan Anda.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link 
                href={`/track?code=${order_id}`} // Mengarahkan ke halaman lacak dengan ID yang sudah terisi
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-md transition-colors w-full sm:w-auto flex justify-center items-center"
            >
                Lacak Status
            </Link>
            
            <Link 
              href="/" 
              className="px-6 py-3 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-md transition-colors w-full sm:w-auto flex justify-center items-center"
            >
              Kembali ke Beranda
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Payment;
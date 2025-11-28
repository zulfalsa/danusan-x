import React, { useState } from 'react';
import { ShoppingCart, Lock, Search } from 'lucide-react';

// Komponen Header Navigasi yang sama di semua halaman Auth
const AuthHeader = () => (
  <header className="bg-orange-600 shadow-xl fixed top-0 left-0 right-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="text-2xl font-bold tracking-wider text-white">
        Danusan<span className="text-yellow-200">-X</span>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/login" className="flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 transition duration-150">
          <Lock className="w-4 h-4 mr-1" /> Login Staff
        </a>
        <button className="flex items-center text-white hover:text-gray-200 transition duration-150">
          <Search className="w-5 h-5 mr-1" /> Lacak
        </button>
        <button className="relative p-2 text-white hover:text-gray-200 transition duration-150">
          <ShoppingCart className="w-6 h-6" />
          {/* Badge untuk Keranjang */}
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-orange-600 bg-red-500 text-xs text-white"></span>
        </button>
      </div>
    </div>
  </header>
);

// Komponen Utama Gatekeep
export default function GatePage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  
  // Tipe e diubah menjadi React.FormEvent<HTMLFormElement> untuk form submit
  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // TODO: Ganti logika dummy ini dengan pemanggilan API ke backend untuk memverifikasi Secret Password
    if (secret === 'admin-rahasia') {
      // Simulasikan berhasil, arahkan ke halaman login staff
      window.location.href = '/login'; 
    } else if (secret) {
        // Logika error
        setError('Secret Password salah. Mohon coba lagi.');
    } else {
        setError('Secret Password tidak boleh kosong.');
    }
  };
  
  // Tipe e diubah menjadi React.ChangeEvent<HTMLInputElement>
  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecret(e.target.value);
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16">
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Who Are You?</h2>
          
          {/* Deskripsi dari desain */}
          <div className="p-4 rounded-lg mb-6">
            <p className="text-sm text-center text-gray-700">
              Kalau kamu bukan pembeli, kamu tidak perlu melakukan login dan bisa langsung melakukan proses pembelian. Login hanya diperlukan untuk Penjual atau Admin saja. Penjual atau Admin harap memasukkan **Secret Password**.
            </p>
          </div>
          
          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-1">
                Secret Password
              </label>
              <input
                id="secret"
                name="secret"
                type="password"
                required
                value={secret}
                onChange={handleSecretChange} // Menggunakan handler spesifik
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Masukkan kode rahasia..."
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150"
            >
              Lanjut
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Kembali ke Menu Pembeli
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
// import { Link } from '@inertiajs/react'; // <-- UNCOMMENT INI DI VS CODE
import { ShoppingCart, Search, LogIn, Trash2, Package, Menu, X, Image as ImageIcon } from 'lucide-react';

// --- GANTI TAG INERTIA LINK DENGAN TAG <a> MURNI (SOLUSI STABIL) ---
const SafeLink = ({ href, className, children }: any) => <a href={href} className={className}>{children}</a>;
// -------------------------------------------------------------------

// Interface dan logika LocalStorage dari riwayat sebelumnya
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. LOAD DATA (Mengambil dari LocalStorage)
  useEffect(() => {
    const savedCart = localStorage.getItem('danusan_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Gagal memuat keranjang", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE DATA (Menyimpan ke LocalStorage setiap kali cartItems berubah)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('danusan_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('storage')); // Memicu update di Home/halaman lain
    }
  }, [cartItems, isLoaded]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  const handleQuantity = (id: number, change: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemove = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <SafeLink href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-transparent border-2 border-white rounded p-1">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">Danusan-X</h1>
          </SafeLink>

          <div className="hidden md:flex items-center gap-6">
            <SafeLink href="/auth/gate" className="flex items-center gap-1 bg-orange-700 hover:bg-orange-800 transition-colors px-3 py-1.5 rounded-md font-medium text-sm">
              <LogIn size={18} />
              <span>Login Staff</span>
            </SafeLink>
            
            {/* Lacak Link */}
            <SafeLink href="/track" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
              <Search size={20} />
              <span className="font-medium">Lacak</span>
            </SafeLink>

            {/* Cart Icon (Aktif) */}
            <SafeLink href="/cart" className="text-orange-100 relative hover:text-white transition-colors">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[1rem] h-4 flex items-center justify-center rounded-full px-1">
                      {cartItems.reduce((a, b) => a + b.quantity, 0)}
                  </span>
              )}
            </SafeLink>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-orange-600 px-4 py-4 space-y-4">
            <SafeLink href="/auth/gate" className="block text-white py-2">Login Staff</SafeLink>
            <SafeLink href="/track" className="block text-white py-2">Lacak Pesanan</SafeLink>
            <SafeLink href="/cart" className="block text-white py-2">Keranjang ({cartItems.reduce((a, b) => a + b.quantity, 0)})</SafeLink>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-black">Keranjang Belanja</h1>
        <hr className="border-gray-300 mb-8" />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* List Produk */}
          <div className="flex-1 w-full space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 text-center text-gray-500">
                <p className="mb-4">Keranjang belanja Anda kosong.</p>
                <SafeLink href="/" className="text-orange-500 font-medium hover:underline">
                  Mulai Belanja
                </SafeLink>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-200 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-500 opacity-50" />
                      )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-md">
                      <button 
                        onClick={() => handleQuantity(item.id, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l-md font-bold"
                      >-</button>
                      <span className="px-3 font-medium text-sm min-w-[30px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantity(item.id, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-md font-bold"
                      >+</button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ringkasan */}
          <div className="w-full lg:w-80 bg-white p-6 rounded-md shadow-sm border border-gray-100 lg:sticky lg:top-24">
            <h3 className="font-bold text-lg mb-4">Ringkasan</h3>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg text-black">{formatCurrency(total)}</span>
            </div>

            {cartItems.length > 0 ? (
                <SafeLink 
                  href="/checkout" 
                  className="block w-full text-center bg-[#16A34A] hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors mb-4 shadow-sm"
                >
                  Check Out
                </SafeLink>
            ) : (
                <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-md cursor-not-allowed mb-4">
                  Check Out
                </button>
            )}

            <div className="text-center">
              <SafeLink href="/" className="text-orange-500 text-sm font-medium hover:underline">
                Lanjut Belanja
              </SafeLink>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
// import { Link } from '@inertiajs/react'; // <-- UNCOMMENT INI DI VS CODE
import { ShoppingCart, Search, LogIn, Plus, Package, Image as ImageIcon, Menu, X } from 'lucide-react';

// Komponen Cadangan: Menggunakan tag <a> MURNI untuk menghindari crash Inertia
const SafeLink = ({ href, className, children }: any) => <a href={href} className={className}>{children}</a>;

// Pindahkan interfaces keluar dari scope fungsi
interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// MENGHILANGKAN EXPORT DEFAULT DI SINI (Membuat fungsi Home biasa)
function Home({ products = [] }: { products: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // --- LOGIKA CART ---
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('danusan_cart');
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      } catch (e) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  const handleAddToCart = (product: Product) => {
    const savedCart = localStorage.getItem('danusan_cart');
    let items: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = items.findIndex(item => item.id === product.product_id);

    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity += 1;
    } else {
      items.push({
        id: product.product_id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }

    localStorage.setItem('danusan_cart', JSON.stringify(items));
    updateCartCount();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };
  // --- END LOGIKA ---

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);


  return (
    <div className="min-h-screen font-sans text-gray-800">
      
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
            
            {/* Cart Link */}
            <SafeLink href="/cart" className="hover:text-orange-100 transition-colors relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[1rem] h-4 flex items-center justify-center rounded-full px-1">
                  {cartCount}
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
            <SafeLink href="/cart" className="block text-white py-2">Keranjang ({cartCount})</SafeLink>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-white py-12 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="text-black mb-2">
               <Package size={120} strokeWidth={1.5} className="text-black" />
            </div>
            <h2 className="text-orange-500 text-2xl md:text-3xl font-bold">Danusan-X</h2>
          </div>
          <div className="max-w-lg text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black">Selamat Datang, Folks!</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              dengan membeli danusan kami, kamu telah mendukung kegiatan X berjalan dengan baik. Oh iya, kamu bisa belanja tanpa perlu login!
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-[#FFF7ED] py-12 min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                <p>Belum ada produk yang tersedia.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <div className="h-48 bg-orange-200 flex items-center justify-center relative overflow-hidden">
                      {product.image ? (
                        <img src={`/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-black/10 p-4 rounded-full">
                             <ImageIcon size={48} className="text-gray-700 opacity-80" />
                        </div>
                      )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-orange-500 font-bold text-lg">
                        {formatCurrency(product.price)}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Plus size={16} strokeWidth={3} />
                        Beli
                      </button>
                  </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
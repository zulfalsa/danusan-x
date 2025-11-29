import React, { useState } from 'react';

// --- Global Declarations & Constants ---
declare const GATE_SECRET: string | undefined;
declare const __app_id: string | undefined;

const ENV_GATE_SECRET = typeof GATE_SECRET !== 'undefined' ? GATE_SECRET : 'admin123';
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Dipertahankan untuk kompatibilitas Canvas

// --- Komponen Header Navigasi Disesuaikan dengan Template User ---
const AuthHeader = () => {
    
    // Fungsi Navigasi (Memastikan path absolut dimulai dengan '/')
    const navigateTo = (path: string) => {
        // Mengubah path menjadi absolut (misal: 'login' menjadi '/login')
        const targetPath = path === '' || path === '/' ? '/' : `/${path.replace(/^\/+/g, '')}`;
        window.location.href = targetPath; 
    };
    
    // Ikon SVG untuk Package (Logo)
    const PackageIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.89 1.15l8 4.62c.5.29.89.85.89 1.48v9.3c0 .63-.39 1.19-.89 1.48l-8 4.62c-.5.29-1.11.29-1.61 0l-8-4.62c-.5-.29-.89-.85-.89-1.48v-9.3c0-.63.39-1.19.89-1.48l8-4.62c.5-.29 1.11-.29 1.61 0z"/>
            <path d="M12 22V7"/>
            <path d="M12 7l8-4.62"/>
            <path d="M12 7l-8 4.62"/>
        </svg>
    );

    const LogInIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
    );

    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    );

    const ShoppingCartIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
    );
    
    return (
        <header className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                
                {/* Logo Danusan-X */}
                <button onClick={() => navigateTo('/')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="bg-transparent border-2 border-white rounded p-1">
                        <PackageIcon />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-wide">Danusan-X</h1>
                </button>

                {/* Navigasi Kanan */}
                <div className="flex items-center gap-6">
                    
                    {/* Login Staff: NAVIGATE TO /auth/gate */}
                    <button 
                        onClick={() => navigateTo('auth/gate')} 
                        className="flex items-center gap-1 bg-orange-700 hover:bg-orange-800 transition-colors px-3 py-1.5 rounded-md font-medium text-sm shadow-lg">
                        <LogInIcon />
                        <span>Login Staff</span>
                    </button>
                    
                    {/* Lacak */}
                    <button onClick={() => navigateTo('track')} className="flex items-center gap-1 text-orange-100 font-bold hover:text-white transition-colors">
                        <SearchIcon />
                        <span className="font-medium">Lacak</span>
                    </button>

                    {/* Keranjang */}
                    <button onClick={() => navigateTo('cart')} className="hover:text-orange-100 relative">
                        <ShoppingCartIcon />
                        {/* Red Cart Badge */}
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-orange-500 bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                    </button>
                </div>
            </div>
        </header>
    )
};


/**
 * Main Application Component (Gate Page)
 */
const App = () => {
  const [secretPassword, setSecretPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle navigation to the Buyer/General page
  const handleBuyerAccess = () => {
    // Navigate directly to the root (buyer menu)
    window.location.href = `/`; // Use absolute root path
  };

  // Function to handle Secret Password and navigate to Staff Login
  const handleStaffContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (secretPassword.trim() === '') {
      setError('Harap masukkan Secret Password untuk masuk sebagai Staf/Admin.');
      setIsLoading(false);
      return;
    }
    
    // Validation against the Secret from the environment (ENV_GATE_SECRET)
    if (secretPassword === ENV_GATE_SECRET) {
      // Secret Password correct, immediately redirect to Staff Login
      window.location.href = `/login`; // Diarahkan ke rute Laravel yang didefinisikan: /login
    } else {
      // Secret Password incorrect
      setError('Secret Password salah. Cek kembali atau masuk sebagai Pembeli.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      {/* Gate Content */}
      <main className="flex-1 flex items-center justify-center p-4 pt-24 sm:pt-16">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Who Are You?</h2>

          {/* Flow Description */}
          <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
            Kalau kamu adalah **pembeli**, kamu tidak perlu melakukan login dan bisa langsung melakukan proses pembelian. Login hanya diperlukan untuk Penjual atau Admin saja. <br />
            <strong className="text-orange-600">Penjual atau Admin</strong> harap masukkan *secret password*.
          </p>

          {/* Secret Password Form */}
          <form onSubmit={handleStaffContinue} className="space-y-4">
            <label htmlFor="secret-password" className="block text-sm font-medium text-gray-700 sr-only">
              Secret Password
            </label>
            <input
              id="secret-password"
              type="password"
              value={secretPassword}
              // Perbaikan TS7006: e: React.ChangeEvent<HTMLInputElement>
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecretPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              placeholder="Secret Password"
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition duration-300">
                {error}
              </div>
            )}

            {/* Continue Button (Staff/Admin) */}
            <button
              type='submit'
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-200 flex items-center justify-center disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Lanjut'
              )}
            </button>
          </form>

          {/* Back to Buyer Menu Button */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <button
              onClick={handleBuyerAccess}
              className="text-sm text-gray-500 hover:text-gray-700 transition duration-150 font-medium"
              disabled={isLoading}
            >
              Kembali ke Menu Pembeli
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
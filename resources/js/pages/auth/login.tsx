import React, { useState } from 'react';

// --- Deklarasi Global & Konstanta ---
declare const __app_id: string | undefined;

const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// URL API Backend Laravel Anda (Ganti dengan URL yang sesuai di lingkungan nyata)
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 
const LOGIN_ENDPOINT = `${API_BASE_URL}/login`; // Asumsi endpoint login Laravel

// --- Komponen Header Navigasi Disesuaikan dengan Template User ---
const AuthHeader = () => {
    
    // Fungsi Navigasi (Memastikan path absolut dimulai dengan '/')
    const navigateTo = (path: string) => {
        // Ensures path starts with / unless it's the root '/'
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

                {/* Right Navigation */}
                <div className="flex items-center gap-6">
                    
                    {/* Login Staff: NAVIGATE TO /auth/gate */}
                    <button 
                        onClick={() => navigateTo('auth/gate')} 
                        className="flex items-center gap-1 bg-orange-700 hover:bg-orange-800 transition-colors px-3 py-1.5 rounded-md font-medium text-sm shadow-lg">
                        <LogInIcon />
                        <span>Login Staff</span>
                    </button>
                    
                    {/* Track */}
                    <button onClick={() => navigateTo('track')} className="flex items-center gap-1 text-orange-100 font-bold hover:text-white transition-colors">
                        <SearchIcon />
                        <span className="font-medium">Lacak</span>
                    </button>

                    {/* Cart */}
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
 * Komponen Utama Aplikasi Login
 * Mengurus logika Login Staff menggunakan panggilan API ke Backend Laravel.
 */
const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi navigasi ke Register
  const handleRegisterNavigation = () => {
    console.log('Navigasi ke halaman Register');
    // PERBAIKAN: Gunakan path absolut /register sesuai rute Laravel
    window.location.href = `/register`;
  };

  // Fungsi navigasi kembali ke Gate
  const handleGateNavigation = () => {
    console.log('Navigasi kembali ke Gate');
    // PERBAIKAN: Gunakan path absolut /auth/gate sesuai rute Laravel
    window.location.href = `/auth/gate`;
  };

  // Fungsi navigasi ke Lupa Password
  const handleForgotPasswordNavigation = () => {
    console.log('Navigasi ke halaman Lupa Password');
    // PERBAIKAN: Gunakan path absolut /forgot-password
    window.location.href = `/forgot-password`;
  };

  // Fungsi untuk menangani proses Login Staff melalui API Laravel
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (username.trim() === '' || password.trim() === '') {
      setError('Harap lengkapi Username dan Password.');
      setIsLoading(false);
      return;
    }

    try {
      // Panggilan API ke Backend Laravel
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          // Dalam Laravel, ini biasanya email/username dan password
          email: username, 
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Asumsi respons sukses dari Laravel berisi token dan data user
        console.log('Login Staff Berhasil. Token:', data.token);
        
        // Simpan token (misalnya di localStorage atau Context/Redux)
        localStorage.setItem('auth_token', data.token);
        
        // Navigasi ke Dashboard Staff
        // PERBAIKAN: Gunakan path absolut /admin/dashboard
        window.location.href = `/admin/dashboard`;
      } else {
        // Tangani error yang dikirim oleh Laravel (misal: 'Unauthorized', 'Validation Error')
        const errorMessage = data.message || 'Username atau Password Staff salah.';
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error during login API call:", e);
      setError("Gagal terhubung ke server. Cek URL API atau koneksi Anda.");
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />

      {/* Konten Login Staff */}
      <main className="flex-1 flex items-center justify-center p-4 pt-24 sm:pt-16">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login Staff</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Username (Diasumsikan Email di Laravel Auth) */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                placeholder="Masukkan Username atau Email Staff"
                disabled={isLoading}
              />
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                placeholder="Masukkan Password Staff"
                disabled={isLoading}
              />
            </div>

            {/* Pesan Error */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition duration-300">
                {error}
              </div>
            )}

            {/* Link Lupa Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPasswordNavigation}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 transition duration-150"
              >
                Lupa Password?
              </button>
            </div>


            {/* Tombol Masuk */}
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
                'Masuk'
              )}
            </button>
          </form>

          {/* Navigasi Tambahan */}
          <div className="mt-6 text-center text-sm space-y-2">
            <button 
              onClick={handleRegisterNavigation}
              className="block w-full text-orange-600 hover:text-orange-700 transition duration-150 font-medium"
              disabled={isLoading}
            >
              Belum punya akun? Daftar disini
            </button>
            <button 
              onClick={handleGateNavigation}
              className="block w-full text-gray-500 hover:text-gray-700 transition duration-150 mt-1"
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
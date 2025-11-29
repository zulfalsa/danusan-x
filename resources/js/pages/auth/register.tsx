import React, { useState } from 'react';

// --- Deklarasi Global & Konstanta ---
declare const __app_id: string | undefined;

const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// URL API Backend Laravel Anda
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 
const REGISTER_ENDPOINT = `${API_BASE_URL}/register`; // Asumsi endpoint registrasi Laravel

// --- Komponen Header Navigasi Disesuaikan dengan Template User ---
const AuthHeader = () => {
    
    // Fungsi Navigasi (Ensures absolute path starting with '/')
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

    // Ikon SVG untuk LogIn (Staff)
    const LogInIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
    );

    // Ikon SVG untuk Search (Lacak)
    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    );

    // Ikon SVG untuk ShoppingCart
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
                    
                    {/* Login Staff: DIARAHKAN KE GATE */}
                    <button 
                        onClick={() => navigateTo('auth/gate')} // Diarahkan ke GATE dulu
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

// Komponen Utama Daftar Akun Baru
const App = () => {
  const [role, setRole] = useState('Penjual');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Daftar role yang tersedia (hanya Penjual dan Admin)
  const availableRoles = [
    { value: 'Penjual', label: 'Penjual' },
    { value: 'Admin', label: 'Admin' },
  ];

  // Fungsi untuk menangani proses Registrasi melalui API Laravel
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setError('Harap lengkapi semua bidang.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi Password tidak cocok.');
      setIsLoading(false);
      return;
    }
    
    // Minimal panjang password (sesuaikan dengan aturan Laravel)
    if (password.length < 8) {
        setError('Password harus minimal 8 karakter.');
        setIsLoading(false);
        return;
    }

    try {
      // Panggilan API ke Backend Laravel
      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          // Asumsi 'name' atau 'username' di Laravel, dan mock email
          name: username, 
          email: `${username.toLowerCase()}@danusanx.com`, 
          password: password,
          password_confirmation: confirmPassword,
          role: role.toLowerCase(), // Kirim role yang dipilih
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registrasi Berhasil. User:', data.user);
        setSuccess('Pendaftaran berhasil! Anda dapat login sekarang.');
        // Setelah registrasi, arahkan ke halaman login
        setTimeout(() => {
          handleLoginNavigation();
        }, 2000);
      } else {
        // Tangani error yang dikirim oleh Laravel
        const errorMessage = data.message || 'Gagal mendaftar. Cek kembali data Anda.';
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error during register API call:", e);
      setError("Gagal terhubung ke server. Cek URL API atau koneksi Anda.");
      setIsLoading(false);
    }
  };

  // Fungsi navigasi ke Login
  const handleLoginNavigation = () => {
    console.log('Navigasi ke halaman Login');
    // PERBAIKAN: Gunakan path absolut /auth/login
    window.location.href = `/auth/login`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24 sm:pt-16">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Daftar Akun Baru</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                {availableRoles.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Input Username */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Username"
                disabled={isLoading}
              />
            </div>
            
            {/* Input Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>

             {/* Input Confirm Password */}
             <div>
              <label htmlFor="confirm-password" className="sr-only">Ulangi Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ulangi Password"
                disabled={isLoading}
              />
            </div>
            
            {/* Pesan Error & Sukses */}
            {(error || success) && (
              <p className={`mt-2 text-sm text-center p-2 rounded-lg border ${error ? 'text-red-700 bg-red-100 border-red-400' : 'text-green-700 bg-green-100 border-green-400'}`}>
                {error || success}
              </p>
            )}
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 mt-6 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
                onClick={handleLoginNavigation}
                className="text-sm font-medium text-gray-600 hover:text-orange-700 transition duration-150">
              Sudah punya akun? <strong className='text-orange-600'>Login disini</strong>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
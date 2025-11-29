import React, { useState } from 'react';
import { LogOut, CheckCircle, XCircle, Package } from 'lucide-react';

// --- TIPE DEFINITION UNTUK TYPE SCRIPT ---

/**
 * Interface untuk objek Transaksi.
 */
interface Transaction {
  id: string;
  buyer: string;
  phone: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Rejected';
}

/**
 * Interface untuk props komponen VerificationTable.
 */
interface VerificationTableProps {
  transactions: Transaction[];
  onVerify: (id: string, newStatus: 'Completed' | 'Rejected') => void;
}

// --- DATA MOCKUP (dengan typing) ---

// Data Transaksi Contoh (Dipertahankan untuk demonstrasi tampilan tabel)
const initialTransactions: Transaction[] = [
  { id: '#2412', buyer: 'Beverly', phone: '0811223344', total: 6000, status: 'Pending' },
  { id: '#2411', buyer: 'Alex', phone: '0812345678', total: 15000, status: 'Completed' },
  { id: '#2410', buyer: 'Ria', phone: '0876543210', total: 8500, status: 'Pending' },
  { id: '#2409', buyer: 'Faisal', phone: '0855555555', total: 22000, status: 'Rejected' },
];

// --- KOMPONEN ---

// Komponen Card Transaksi
const VerificationTable: React.FC<VerificationTableProps> = ({ transactions, onVerify }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-6">
      <h3 className="text-xl font-bold text-orange-600 mb-6 border-b pb-2">Verifikasi Pemesanan</h3>

      {/* Tabel Header (Desktop) */}
      <div className="hidden md:grid grid-cols-5 gap-4 font-semibold text-gray-700 pb-2 border-b">
        <div>ID</div>
        <div className="col-span-2">Pembeli</div>
        <div>Total</div>
        <div className="text-center">Verifikasi</div>
      </div>

      {/* Daftar Transaksi */}
      {transactions.length === 0 ? (
         <div className="text-center py-10 text-gray-500">
             <p className="text-lg font-semibold">Tidak ada pesanan yang menunggu verifikasi.</p>
             <p className="text-sm">Semua pesanan sudah diverifikasi atau belum ada pesanan baru.</p>
         </div>
      ) : (
        <div className="space-y-4 pt-2">
          {transactions.map(tx => (
            <div 
              key={tx.id} 
              className="md:grid md:grid-cols-5 gap-4 items-center py-3 border-b md:border-b-0 last:border-b-0 bg-gray-50 md:bg-white p-3 rounded-lg md:p-0"
            >
              {/* ID & Pembeli */}
              <div className="font-mono text-sm font-bold text-orange-500 mb-1 md:mb-0">{tx.id}</div>
              <div className="col-span-2">
                  <p className="font-semibold text-gray-800">{tx.buyer}</p>
                  <p className="text-xs text-gray-500">{tx.phone}</p>
              </div>
              {/* Total */}
              <div className="font-bold text-green-700">Rp{tx.total.toLocaleString('id-ID')}</div>
              
              {/* Aksi/Status */}
              <div className="flex justify-end md:justify-center space-x-2 mt-2 md:mt-0">
                  {tx.status === 'Pending' ? (
                      <>
                          <button 
                              onClick={() => onVerify(tx.id, 'Completed')}
                              className="flex items-center space-x-1 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-green-600 transition"
                          >
                              <CheckCircle size={16} /> <span className="hidden sm:inline">Setuju</span>
                          </button>
                          <button 
                              onClick={() => onVerify(tx.id, 'Rejected')}
                              className="flex items-center space-x-1 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-600 transition"
                          >
                              <XCircle size={16} /> <span className="hidden sm:inline">Tolak</span>
                          </button>
                      </>
                  ) : (
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.status === 'Completed' ? 'Selesai' : 'Ditolak'}
                      </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Komponen Utama Dashboard Admin
const App: React.FC = () => {
  // Hanya mempertahankan state transaksi yang disimulasikan, dengan tipe Transaction[]
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Fungsi placeholder untuk Logout
  const handleLogout = (): void => {
    // Di aplikasi nyata, ini akan memanggil API Logout Anda (Contoh: /logout)
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
    console.log("Melakukan Logout...");
  };

  // Logika Verifikasi
  const handleVerify = (id: string, newStatus: 'Completed' | 'Rejected'): void => {
    // Logika ini hanya mensimulasikan perubahan status di tampilan
    setTransactions(prev => prev.map(tx => 
        tx.id === id ? { ...tx, status: newStatus } : tx
    ));
    
    const message = newStatus === 'Completed' ? `Pesanan ${id} disetujui.` : `Pesanan ${id} ditolak.`;
    const notificationContainer = document.getElementById('notification-container');
    if (notificationContainer) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.className = `fixed top-4 right-4 ${newStatus === 'Completed' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-xl z-50 transition-opacity duration-300`;
      notificationContainer.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Container untuk Notifikasi */}
      <div id="notification-container"></div>
      
      {/* HEADER SESUAI DESAIN ORANYE */}
      <header className="sticky top-0 z-20 bg-orange-600 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Mengganti ikon Home dengan ikon Box/Kotak (Package) sesuai permintaan */}
            <Package size={32} className="text-white" />
            <h1 className="text-3xl font-extrabold text-white">Danusan-X</h1>
          </div>
          
          {/* Tombol Admin & Logout (Dropdown/Menu) */}
          <div className="relative group">
            <button className="flex items-center bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-orange-800 transition duration-150">
              {/* Ikon Logout dihapus dari tampilan default Admin button */}
              <span>Admin</span>
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
      
      {/* Area Konten Utama (Verifikasi Pesanan) */}
      {/* Menghapus sidebar dan membatasi lebar konten utama */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Verifikasi Pesanan</h2>
        <VerificationTable transactions={transactions} onVerify={handleVerify} />
      </main>

    </div>
  );
};

export default App;
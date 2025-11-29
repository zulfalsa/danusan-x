import React, { useState } from 'react';
import { LogOut, Package, ArrowLeft, ClipboardList, Phone, CheckCircle, Truck, XCircle, MoreVertical } from 'lucide-react';

// --- TIPE DEFINITION UNTUK TYPE SCRIPT ---

/**
 * Interface untuk objek Pesanan Penjual.
 */
interface Order {
  id: string;
  buyerName: string;
  phone: string; 
  total: number;
  items: string; // Detail item pesanan
  status: 'Siap Diproses' | 'Sedang Dikirim' | 'Selesai' | 'Dibatalkan';
}

type OrderStatus = 'Semua' | Order['status'];

// --- DATA SIMULASI DIHAPUS, DIGANTI DENGAN ARRAY KOSONG ---
// const simulatedOrders: Order[] = [...] -> DIHAPUS

// --- KOMPONEN PEMBANTU ---

// Komponen Status Badge
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  let colorClass;
  switch (status) {
    case 'Siap Diproses':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Sedang Dikirim':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Selesai':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Dibatalkan':
      colorClass = 'bg-red-100 text-red-800';
      break;
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

// --- KOMPONEN UTAMA DAFTAR PESANAN ---
const App: React.FC = () => {
  // State orders diinisialisasi dengan array kosong
  const [orders] = useState<Order[]>([]); 
  const [filterStatus, setFilterStatus] = useState<OrderStatus>('Semua');

  // Fungsi untuk simulasi Logout
  const handleLogout = (): void => {
    // Simulasi Logout
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
    console.log("Melakukan Logout Penjual...");
  };

  // Fungsi untuk tombol "Hubungi WA"
  const handleContactWA = (phone: string): void => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  // Fungsi Aksi Pesanan (mengubah status)
  const handleAction = (orderId: string, newStatus: Order['status']): void => {
    console.log(`Mengubah Pesanan ${orderId} menjadi ${newStatus}`);
    // Di aplikasi nyata, Anda akan memanggil API PATCH/PUT di sini
    alert(`Simulasi: Pesanan ${orderId} diubah ke status: ${newStatus}`);
  };

  // Filter Pesanan
  const filteredOrders = orders.filter(order => 
    filterStatus === 'Semua' || order.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Container untuk Notifikasi */}
      <div id="notification-container"></div>
      
      {/* HEADER SESUAI DESAIN ORANYE */}
      <header className="sticky top-0 z-20 bg-orange-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package size={32} className="text-white" />
            <h1 className="text-3xl font-extrabold text-white">Danusan-X</h1>
          </div>
          
          {/* Tombol Seller & Logout (Dropdown/Menu) */}
          <div className="relative group">
            <button className="flex items-center bg-orange-700 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-orange-800 transition duration-150">
              <span>Seller</span>
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
      
      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Header dan Navigasi */}
        <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => window.history.back()} className="text-gray-600 hover:text-orange-600 transition">
                <ArrowLeft size={28} />
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Daftar Pesanan</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
            
            {/* Filter Status */}
            <div className="flex space-x-2 overflow-x-auto pb-3 mb-4 border-b">
                {(['Semua', 'Siap Diproses', 'Sedang Dikirim', 'Selesai', 'Dibatalkan'] as OrderStatus[]).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`text-sm font-medium px-4 py-1.5 rounded-full whitespace-nowrap transition ${
                            filterStatus === status 
                                ? 'bg-orange-500 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Daftar Pesanan */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-semibold">Tidak ada pesanan dengan status "{filterStatus}".</p>
                    <p className="text-sm">Coba filter status lainnya.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 transition duration-150">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                                {/* Kolom 1: ID & Status */}
                                <div className="col-span-1">
                                    <p className="font-mono text-sm text-orange-600 font-bold">{order.id}</p>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Kolom 2: Pembeli & Detail */}
                                <div className="col-span-1 md:col-span-2">
                                    <p className="font-semibold text-gray-800">{order.buyerName}</p>
                                    <p className="text-xs text-gray-500 truncate">{order.items}</p>
                                    <p className="font-bold text-sm text-green-700">Rp{order.total.toLocaleString('id-ID')}</p>
                                </div>

                                {/* Kolom 3 & 4: Aksi */}
                                <div className="col-span-2 md:col-span-1 flex flex-col space-y-2">
                                    <button 
                                        onClick={() => handleContactWA(order.phone)}
                                        className="w-full bg-green-500 text-white text-sm py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-1"
                                    >
                                        <Phone size={16} />
                                        <span>Hubungi</span>
                                    </button>
                                    
                                    {order.status === 'Siap Diproses' && (
                                        <button 
                                            onClick={() => handleAction(order.id, 'Sedang Dikirim')}
                                            className="w-full bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-1"
                                        >
                                            <Truck size={16} />
                                            <span>Kirim</span>
                                        </button>
                                    )}
                                    
                                    {order.status === 'Sedang Dikirim' && (
                                        <button 
                                            onClick={() => handleAction(order.id, 'Selesai')}
                                            className="w-full bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center space-x-1"
                                        >
                                            <CheckCircle size={16} />
                                            <span>Selesaikan</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>

    </div>
  );
};

export default App;
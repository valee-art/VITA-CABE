import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Flame, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  Phone, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Package,
  Star,
  Share,
  TrendingUp,
  BarChart3,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Bell,
  Download,
  Mail,
  Send,
  UserCheck,
  Edit,
  Save,
  Search,
  Instagram,
  Facebook,
  LogOut,
  Calculator,
  History,
  LayoutDashboard,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Product, 
  CartItem, 
  Page, 
  OrderData, 
  Toast, 
  SocialLink, 
  UserProfile, 
  UserRole, 
  FinanceEntry,
  Customer
} from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { PRODUCTS, CONTACT_INFO } from './constants';
import { 
  getFinanceData, 
  getProducts, 
  saveProduct, 
  removeProduct, 
  getOrders, 
  saveOrder, 
  updateOrderStatusFirebase, 
  addFinanceEntry,
  getCustomers,
  updateCustomerFromTransaction,
  updateStock,
  getAllUsers,
  updateUserRole
} from './services/firebaseService';
import { 
  loginWithFirebase, 
  registerWithFirebase, 
  logoutFromFirebase, 
  subscribeToAuthChanges 
} from './services/authService';
import { User } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

// --- Components ---

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-xs px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md",
              toast.type === 'success' ? 'bg-brand-green/90 text-white' : 
              toast.type === 'error' ? 'bg-brand-red/90 text-white' : 
              'bg-brand-dark/90 text-white'
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : 
             toast.type === 'error' ? <X size={18} /> : 
             <ShoppingBag size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-auto opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Auth Form State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthView, setIsAuthView] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [financeData, setFinanceData] = useState<{ totalNominal: number, totalKomisi: number, entries: FinanceEntry[] } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u, p) => {
      setUser(u);
      setProfile(p);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && profile) {
      fetchData();
    }
  }, [user, profile, activeTab]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [pData, fData, cData, uData] = await Promise.all([
        getProducts(),
        profile ? getFinanceData(
          profile?.role === 'reseller' ? user?.uid : undefined,
          profile?.role === 'user' ? profile?.displayName : undefined
        ) : Promise.resolve(null),
        profile?.role === 'admin' ? getCustomers() : Promise.resolve([]),
        profile?.role === 'admin' ? getAllUsers() : Promise.resolve([])
      ]);
      if (pData) setProducts(pData);
      if (fData) setFinanceData(fData);
      if (cData) setCustomers(cData);
      if (uData) setAllUsers(uData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await registerWithFirebase(email, password, regRole, displayName);
        addToast('Akun berhasil didaftarkan!', 'success');
      } else {
        await loginWithFirebase(email, password);
        addToast('Selamat datang kembali!', 'success');
      }
    } catch (err: any) {
      setAuthError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutFromFirebase();
    addToast('Berhasil keluar', 'info');
  };

  // --- Views ---

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (isAuthView) {
      return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md glass-morphism p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setIsAuthView(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="inline-flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter text-brand-red">VITA</span>
                <span className="text-xl font-black tracking-tighter text-white">CABE</span>
              </div>
              <div className="w-8" />
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm font-medium">
                {isRegisterMode ? 'Daftar akun baru untuk mulai' : 'Masuk untuk mengelola bisnis Anda'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {isRegisterMode && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all text-white outline-none"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Daftar Sebagai</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setRegRole('user')}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold transition-all border",
                          regRole === 'user' ? "bg-brand-red border-brand-red text-white" : "bg-white/5 border-white/10 text-gray-500"
                        )}
                      >Pelanggan</button>
                      <button 
                        type="button"
                        onClick={() => setRegRole('reseller')}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold transition-all border",
                          regRole === 'reseller' ? "bg-brand-red border-brand-red text-white" : "bg-white/5 border-white/10 text-gray-500"
                        )}
                      >Reseller</button>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@vitacabe.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all text-white outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all text-white outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {authError && (
                <div className="bg-brand-red/10 border border-brand-red/20 p-4 rounded-xl text-brand-red text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={14} />
                  {authError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-red hover:bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isRegisterMode ? 'Daftar Sekarang' : 'Masuk Dashboard'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError('');
                }}
                className="text-xs font-bold text-gray-500 hover:text-brand-red transition-colors"
              >
                {isRegisterMode ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar gratis'}
              </button>
            </div>
          </motion.div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-brand-black text-white p-4 md:p-10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full" />
        
        <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <div className="text-xl font-black tracking-tighter leading-none">VITA CABE</div>
              <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Official Catalog</div>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthView(true)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Masuk Panel
          </button>
        </header>

        <main className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">CABAI RAWIT <span className="text-brand-red">PREMIUM</span></h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Kualitas terbaik langsung dari petani. Pedas alami, segar, dan tahan lama untuk kebutuhan dapur Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {products.length > 0 ? products.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -10 }}
                className="glass-morphism p-8 rounded-[3rem] border border-white/5 flex flex-col items-center text-center space-y-6 group"
              >
                <div className="w-24 h-24 bg-brand-red/10 rounded-[2rem] flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                  <Box size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">{p.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{p.description}</p>
                  <div className="text-3xl font-black text-brand-red">Rp {p.price.toLocaleString('id-ID')}</div>
                </div>
                <div className="w-full pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stok Tersedia</div>
                  <div className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-[10px] font-black">{p.stock} Pcs</div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                <p className="text-gray-500 font-bold uppercase tracking-widest">Katalog sedang dimuat...</p>
              </div>
            )}
          </div>

          <div className="glass-morphism p-12 rounded-[4rem] border border-brand-red/20 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-black">Siap Untuk Memesan?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Hubungi admin kami untuk pemesanan cepat atau informasi reseller di wilayah Anda.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <a 
                href={`https://wa.me/${CONTACT_INFO.admin.phone}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-brand-green px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 hover:scale-105 transition-transform"
              >
                <MessageCircle size={20} /> Pesan via WhatsApp
              </a>
              <button 
                onClick={() => setIsAuthView(true)}
                className="w-full md:w-auto bg-white/5 px-10 py-5 rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
              >
                Daftar Reseller
              </button>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2026 VITA CABE PREMIUM. ALL RIGHTS RESERVED.
        </footer>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-red/30">
      {/* Sidebar / Navigation */}
      <div className="fixed top-0 left-0 bottom-0 w-20 md:w-64 bg-brand-dark border-r border-white/5 flex flex-col z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
            <Flame className="text-white" size={24} />
          </div>
          <div className="hidden md:block">
            <div className="text-lg font-black tracking-tighter leading-none">VITA CABE</div>
            <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Dashboard</div>
          </div>
        </div>

        <nav className="flex-grow px-4 py-8 space-y-2">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label={profile?.role === 'user' ? "Katalog Harga" : "Dashboard"} 
          />
          {(profile?.role === 'admin' || profile?.role === 'reseller') && (
            <NavButton 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')} 
              icon={<Calculator size={20} />} 
              label="Input Penjualan" 
            />
          )}
          {profile?.role === 'admin' && (
            <>
              <NavButton 
                active={activeTab === 'stocks'} 
                onClick={() => setActiveTab('stocks')} 
                icon={<Box size={20} />} 
                label="Stok & Produk" 
              />
              <NavButton 
                active={activeTab === 'customers'} 
                onClick={() => setActiveTab('customers')} 
                icon={<Users size={20} />} 
                label="Pelanggan" 
              />
              <NavButton 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
                icon={<UserCheck size={20} />} 
                label="Kelola User" 
              />
            </>
          )}
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={20} />} 
            label="Riwayat" 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-black">
              {profile?.displayName?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block overflow-hidden">
              <div className="text-xs font-bold truncate">{profile?.displayName}</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">{profile?.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-brand-red hover:bg-brand-red/10 transition-all text-sm font-bold"
          >
            <LogOut size={20} />
            <span className="hidden md:block">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-20 md:ml-64 p-4 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Halo, {profile?.displayName}!</h1>
            <p className="text-gray-500 text-sm">Selamat datang di panel kendali VITA CABE.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sistem Online</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {profile?.role === 'user' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-morphism p-8 rounded-[2.5rem] border border-brand-red/20 flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red">
                        <Box size={32} />
                      </div>
                      <h3 className="text-xl font-black">Cabe 100g</h3>
                      <p className="text-3xl font-black text-brand-red">Rp 15.000</p>
                      <p className="text-xs text-gray-500">Kualitas Premium, Pedas Alami</p>
                    </div>
                    <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-4 opacity-50">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500">
                        <Box size={32} />
                      </div>
                      <h3 className="text-xl font-black">Cabe 200g</h3>
                      <p className="text-3xl font-black text-white">Rp --</p>
                      <p className="text-xs text-gray-500">Segera Hadir</p>
                    </div>
                    <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-4 opacity-50">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500">
                        <Box size={32} />
                      </div>
                      <h3 className="text-xl font-black">Cabe 500g</h3>
                      <p className="text-3xl font-black text-white">Rp --</p>
                      <p className="text-xs text-gray-500">Segera Hadir</p>
                    </div>
                  </div>
                  <div className="glass-morphism p-10 rounded-[3rem] border border-white/5 text-center space-y-4">
                    <h3 className="text-2xl font-black">Ingin Memesan?</h3>
                    <p className="text-gray-500">Hubungi reseller terdekat atau klik tombol di bawah ini.</p>
                    <button className="bg-brand-green px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 mx-auto">
                      <MessageCircle size={20} /> Chat Admin
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  label="Total Penjualan" 
                  value={`Rp ${financeData?.totalNominal.toLocaleString('id-ID') || 0}`} 
                  icon={<TrendingUp className="text-brand-red" />}
                  trend="+12% dari bulan lalu"
                />
                <StatCard 
                  label={profile?.role === 'admin' ? "Total Keuntungan" : "Total Komisi"} 
                  value={`Rp ${(profile?.role === 'admin' ? (financeData?.totalNominal || 0) - (financeData?.totalKomisi || 0) : (financeData?.totalKomisi || 0)).toLocaleString('id-ID')}`} 
                  icon={<Calculator className="text-brand-green" />}
                  trend="Update Real-time"
                />
                <StatCard 
                  label="Total Transaksi" 
                  value={financeData?.docCount.toString() || "0"} 
                  icon={<CheckCircle2 className="text-brand-red" />}
                  trend="Transaksi Berhasil"
                />
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-morphism p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-lg font-black mb-6">Grafik Penjualan</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financeData?.entries.slice(0, 7).reverse() || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="tanggal" hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#3b82f6' }}
                        />
                        <Bar dataKey="nominal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-morphism p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-lg font-black mb-6">Transaksi Terakhir</h3>
                  <div className="space-y-4">
                    {financeData?.entries.slice(0, 5).map((entry, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            entry.jenis === 'pemasukan' ? "bg-brand-green/10 text-brand-green" : "bg-brand-red/10 text-brand-red"
                          )}>
                            {entry.jenis === 'pemasukan' ? <Plus size={18} /> : <Minus size={18} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{entry.keterangan}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">{entry.weight || 'Umum'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-sm font-black",
                            entry.jenis === 'pemasukan' ? "text-brand-green" : "text-brand-red"
                          )}>
                            {entry.jenis === 'pemasukan' ? '+' : '-'} Rp {entry.nominal.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {entry.tanggal?.seconds ? new Date(entry.tanggal.seconds * 1000).toLocaleDateString() : 'Baru saja'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

          {activeTab === 'transactions' && (
            <TransactionForm 
              products={products} 
              profile={profile!} 
              user={user!}
              onSuccess={() => {
                setActiveTab('dashboard');
                addToast('Transaksi berhasil disimpan!');
              }}
            />
          )}

          {activeTab === 'stocks' && profile?.role === 'admin' && (
            <StockManagement products={products} onUpdate={fetchData} />
          )}

          {activeTab === 'customers' && profile?.role === 'admin' && (
            <CustomerDatabase customers={customers} />
          )}
          
          {activeTab === 'users' && profile?.role === 'admin' && (
            <UserManagement users={allUsers} onUpdate={fetchData} />
          )}

          {activeTab === 'history' && (
            <TransactionHistory entries={financeData?.entries || []} />
          )}
        </AnimatePresence>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// --- Sub-Components ---

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
        active ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-gray-500 hover:text-white hover:bg-white/5"
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-gray-500 group-hover:text-brand-red")}>
        {icon}
      </div>
      <span className="hidden md:block text-sm font-bold">{label}</span>
      {active && <div className="hidden md:block ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function StatCard({ label, value, icon, trend }: { label: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
        {trend}
      </div>
    </div>
  );
}

function TransactionForm({ products, profile, user, onSuccess }: { products: Product[], profile: UserProfile, user: User, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    weight: '100g' as '100g' | '200g' | '500g',
    ongkir: 0,
    keterangan: '',
    productId: '',
    jumlah: 1
  });

  const prices = {
    '100g': 15000,
    '200g': 28000,
    '500g': 65000
  };

  const commissions = {
    '100g': 2200,
    '200g': 0, // Variabel kosong untuk diisi nanti
    '500g': 0  // Variabel kosong untuk diisi nanti
  };

  const totalCabe = prices[formData.weight] * formData.jumlah;
  const totalBayar = totalCabe + formData.ongkir;
  const totalKomisi = commissions[formData.weight] * formData.jumlah;
  const untungOwner = totalCabe - totalKomisi - (5000 * formData.jumlah); // Contoh modal 5000 per pcs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addFinanceEntry({
        tanggal: serverTimestamp(),
        keterangan: formData.keterangan || `Penjualan ${formData.weight} - ${formData.customerName}`,
        nominal: totalCabe,
        jenis: 'pemasukan',
        weight: formData.weight,
        harga_cabe: totalCabe,
        ongkir: formData.ongkir,
        total_bayar: totalBayar,
        nominal_komisi: totalKomisi,
        untung_owner: untungOwner,
        jumlah: formData.jumlah,
        productId: formData.productId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        resellerId: profile.role === 'reseller' ? user.uid : undefined,
        resellerName: profile.role === 'reseller' ? profile.displayName : undefined
      });

      // Update Stock
      if (formData.productId) {
        const p = products.find(prod => prod.id === formData.productId);
        if (p) {
          await updateStock(p.id, Math.max(0, p.stock - formData.jumlah));
        }
      }

      // Update Customer
      await updateCustomerFromTransaction(formData.customerName, formData.customerPhone, totalBayar);

      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const sendToWA = () => {
    const text = `*NOTA VITA CABE*%0A%0A` +
                 `Nama: ${formData.customerName}%0A` +
                 `Berat: ${formData.weight}%0A` +
                 `Jumlah: ${formData.jumlah}%0A` +
                 `Harga Cabe: Rp ${totalCabe.toLocaleString('id-ID')}%0A` +
                 `Ongkir: Rp ${formData.ongkir.toLocaleString('id-ID')}%0A` +
                 `*Total Bayar: Rp ${totalBayar.toLocaleString('id-ID')}*%0A%0A` +
                 `Terima kasih sudah berbelanja!`;
    window.open(`https://wa.me/${formData.customerPhone}?text=${text}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto glass-morphism p-10 rounded-[3rem] border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-red/20 rounded-2xl flex items-center justify-center text-brand-red">
          <Calculator size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black">Kalkulator Transaksi</h2>
          <p className="text-gray-500 text-sm">Hitung otomatis komisi, ongkir, dan total bayar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Pelanggan</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none"
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">No. WhatsApp</label>
            <input 
              type="text" 
              required
              placeholder="62812..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none"
              value={formData.customerPhone}
              onChange={e => setFormData({...formData, customerPhone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pilih Produk (Potong Stok)</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none appearance-none"
            value={formData.productId}
            onChange={e => setFormData({...formData, productId: e.target.value})}
          >
            <option value="">-- Pilih Produk --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pilih Berat</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none appearance-none"
              value={formData.weight}
              onChange={e => setFormData({...formData, weight: e.target.value as any})}
            >
              <option value="100g">100 Gram</option>
              <option value="200g">200 Gram</option>
              <option value="500g">500 Gram</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Jumlah</label>
            <input 
              type="number" 
              min="1"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none"
              value={formData.jumlah}
              onChange={e => setFormData({...formData, jumlah: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Ongkos Kirim (Rp)</label>
            <input 
              type="number" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-red transition-all outline-none"
              value={formData.ongkir}
              onChange={e => setFormData({...formData, ongkir: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <div className="bg-brand-red/10 border border-brand-red/20 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Harga Cabe ({formData.weight} x {formData.jumlah})</span>
            <span className="font-black">Rp {totalCabe.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Ongkos Kirim</span>
            <span className="font-black">Rp {formData.ongkir.toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-4 border-t border-brand-red/20 flex justify-between items-center">
            <span className="text-brand-red font-black uppercase tracking-widest text-xs">Total Bayar</span>
            <span className="text-2xl font-black text-white">Rp {totalBayar.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button 
            type="submit"
            className="flex-grow bg-brand-red hover:bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-red/20 transition-all"
          >
            Simpan Transaksi
          </button>
          <button 
            type="button"
            onClick={sendToWA}
            className="bg-brand-green hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-green/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Kirim Nota WA
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function StockManagement({ products, onUpdate }: { products: Product[], onUpdate: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Manajemen Stok</h2>
        <button className="bg-brand-red p-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="glass-morphism p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-red">
                <Box size={24} />
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                p.stock > 10 ? "bg-brand-green/10 text-brand-green" : "bg-brand-red/10 text-brand-red"
              )}>
                Stok: {p.stock}
              </div>
            </div>
            <div>
              <h4 className="font-black text-lg">{p.name}</h4>
              <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="text-sm font-black text-brand-red">Rp {p.price.toLocaleString('id-ID')}</div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Edit size={14} /></button>
                <button className="p-2 bg-brand-red/10 text-brand-red rounded-lg hover:bg-brand-red/20 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserManagement({ users, onUpdate }: { users: UserProfile[], onUpdate: () => void }) {
  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (window.confirm(`Ubah role user ini menjadi ${newRole}?`)) {
      await updateUserRole(uid, newRole);
      onUpdate();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Manajemen Pengguna</h2>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total User: {users.length}</div>
      </div>
      <div className="bg-brand-dark border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <th className="p-6">User</th>
              <th className="p-6">Email</th>
              <th className="p-6">Role Saat Ini</th>
              <th className="p-6">Aksi Ubah Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center text-brand-red font-black">
                      {u.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-bold">{u.displayName}</div>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-400">{u.email}</td>
                <td className="p-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    u.role === 'admin' ? "bg-brand-red/10 text-brand-red" : 
                    u.role === 'reseller' ? "bg-brand-green/10 text-brand-green" : 
                    "bg-white/10 text-gray-400"
                  )}>
                    {u.role}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    {['admin', 'reseller', 'user'].map((r) => (
                      u.role !== r && (
                        <button 
                          key={r}
                          onClick={() => handleRoleChange(u.uid, r as UserRole)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Ke {r}
                        </button>
                      )
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerDatabase({ customers }: { customers: Customer[] }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black">Database Pelanggan</h2>
      <div className="glass-morphism rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <th className="p-6">Pelanggan</th>
              <th className="p-6">Kontak</th>
              <th className="p-6">Total Pesanan</th>
              <th className="p-6">Total Belanja</th>
              <th className="p-6">Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-black text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold">{c.name}</span>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-400">{c.phone}</td>
                <td className="p-6 text-sm font-bold">{c.totalOrders}x</td>
                <td className="p-6 text-sm font-black text-brand-green">Rp {c.totalSpent.toLocaleString('id-ID')}</td>
                <td className="p-6 text-[10px] text-gray-500 font-bold uppercase">
                  {c.lastOrder?.seconds ? new Date(c.lastOrder.seconds * 1000).toLocaleDateString() : 'Baru'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionHistory({ entries }: { entries: FinanceEntry[] }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black">Riwayat Transaksi</h2>
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="glass-morphism p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                entry.jenis === 'pemasukan' ? "bg-brand-green/10 text-brand-green" : "bg-brand-red/10 text-brand-red"
              )}>
                {entry.jenis === 'pemasukan' ? <Plus size={24} /> : <Minus size={24} />}
              </div>
              <div>
                <div className="font-black">{entry.keterangan}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span>{entry.weight || 'Umum'}</span>
                  <span>•</span>
                  <span>{entry.customerName || 'Anonim'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nominal</div>
                <div className={cn("font-black", entry.jenis === 'pemasukan' ? "text-brand-green" : "text-brand-red")}>
                  Rp {entry.nominal.toLocaleString('id-ID')}
                </div>
              </div>
              {entry.ongkir > 0 && (
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ongkir</div>
                  <div className="font-black text-white">Rp {entry.ongkir.toLocaleString('id-ID')}</div>
                </div>
              )}
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tanggal</div>
                <div className="text-xs font-bold text-gray-400">
                  {entry.tanggal?.seconds ? new Date(entry.tanggal.seconds * 1000).toLocaleDateString() : 'Baru'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

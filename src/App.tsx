/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Package,
  Star,
  Share,
  TrendingUp,
  BarChart3,
  Filter,
  ArrowUpDown,
  AlertCircle
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
import { Product, CartItem, Page, OrderData, Toast } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { PRODUCTS, CONTACT_INFO, TESTIMONIALS } from './constants';

// --- Components ---

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-xs px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-brand-green/90 text-white' : 
              toast.type === 'error' ? 'bg-brand-red/90 text-white' : 
              'bg-brand-dark/90 text-white'
            }`}
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

interface NavbarProps {
  currentPage: Page;
  setPage: (p: Page) => void;
  cartCount: number;
  toggleCart: () => void;
}

const Navbar = ({ 
  currentPage, 
  setPage, 
  cartCount, 
  toggleCart 
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; value: Page }[] = [
    { label: 'Beranda', value: 'home' },
    { label: 'Produk', value: 'products' },
    { label: 'Grosir', value: 'wholesale' },
    { label: 'Promo', value: 'promo' },
    { label: 'Tentang', value: 'about' },
    { label: 'Kontak', value: 'contact' },
    { label: 'Akun', value: 'account' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <span className="text-2xl font-black tracking-tighter text-brand-red">VITA</span>
            <span className="text-2xl font-black tracking-tighter text-white">CABE</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setPage(item.value)}
                className={`text-sm font-semibold transition-colors hover:text-brand-red ${
                  currentPage === item.value ? 'text-brand-red' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-white hover:text-brand-red transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleCart}
              className="relative p-2 text-white"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setPage(item.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-4 text-base font-semibold ${
                    currentPage === item.value ? 'text-brand-red bg-brand-red/10' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onViewDetail: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  key?: string | number;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onBuyNow,
  onViewDetail,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card flex flex-col h-full bg-brand-gray border-white/5 relative"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isBestSeller && (
          <div className="bg-brand-red text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-widest flex items-center gap-1">
            <TrendingUp size={10} /> Best Seller
          </div>
        )}
        {product.stock < 20 && (
          <div className="bg-brand-green text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-widest flex items-center gap-1">
            <AlertCircle size={10} /> Stok Terbatas
          </div>
        )}
      </div>

      <button 
        onClick={() => onToggleWishlist(product.id)}
        className={cn(
          "absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-colors",
          isWishlisted ? 'bg-brand-red text-white' : 'bg-black/20 text-white/60 hover:text-white'
        )}
      >
        <Star size={16} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div 
        onClick={() => onViewDetail(product)}
        className="aspect-square rounded-xl mb-4 bg-brand-dark flex items-center justify-center cursor-pointer group relative overflow-hidden"
      >
        <Flame size={64} className="text-brand-red opacity-20 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
            Lihat Detail
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-white">{product.name}</h3>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Flame 
              key={i} 
              size={12} 
              className={i < product.level ? "text-brand-red fill-brand-red" : "text-white/10"} 
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{product.description}</p>
      
      <div className="mb-4">
        <div className="text-brand-red font-black text-xl">
          Rp {product.price.toLocaleString('id-ID')}
        </div>
        {product.wholesalePrice && (
          <div className="text-brand-green text-xs font-bold">
            Grosir: Rp {product.wholesalePrice.toLocaleString('id-ID')}/pcs
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onAddToCart(product)}
          className="px-3 py-2 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-colors"
        >
          + Keranjang
        </button>
        <button 
          onClick={() => onBuyNow(product)}
          className="px-3 py-2 bg-brand-green text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
        >
          Beli Sekarang
        </button>
      </div>
    </motion.div>
  );
};

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  allProducts
}: { 
  product: Product | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onAddToCart: (p: Product) => void,
  allProducts: Product[]
}) => {
  if (!product) return null;

  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 2);

  const handleShare = (platform: string) => {
    const url = window.location.origin;
    const text = `Cek ${product.name} di VITA CABE! Pedasnya nampol!`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link berhasil disalin!');
    } else if (platform === 'wa') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-brand-dark z-[110] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 md:p-12 space-y-6 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-white">{product.name}</h2>
                  <div className="text-brand-green font-bold text-sm uppercase tracking-widest">{product.size}</div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-black text-brand-red">
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
                <div className="flex gap-1 bg-brand-red/10 px-3 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Flame 
                      key={i} 
                      size={14} 
                      className={i < product.level ? "text-brand-red fill-brand-red" : "text-white/10"} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                {product.description}
                <br /><br />
                <span className="text-xs font-bold text-white uppercase tracking-widest block mb-2">Keunggulan:</span>
                • 100% Cabe Murni Pilihan<br />
                • Tanpa Campuran Tepung & Pewarna<br />
                • Proses Higienis & Alami<br />
                • Level Pedas {product.level}/5
              </p>

              {related.length > 0 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Produk Terkait:</span>
                  <div className="grid grid-cols-2 gap-4">
                    {related.map(p => (
                      <div key={p.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                        <div className="text-sm font-bold truncate">{p.name}</div>
                        <div className="text-brand-red font-black text-xs">Rp {p.price.toLocaleString('id-ID')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bagikan:</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare('wa')} className="p-2 bg-white/5 rounded-lg hover:bg-brand-red transition-colors text-white">
                      <MessageCircle size={16} />
                    </button>
                    <button onClick={() => handleShare('copy')} className="p-2 bg-white/5 rounded-lg hover:bg-brand-red transition-colors text-white">
                      <Share size={16} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} /> Tambah Ke Keranjang
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemove, 
  onCheckout 
}: CartDrawerProps) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-dark z-[70] shadow-2xl flex flex-col border-l border-white/5"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Keranjang Belanja</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={64} className="text-white/5" />
                  <p className="text-gray-500 font-medium">Keranjang kamu masih kosong.</p>
                  <button 
                    onClick={onClose}
                    className="text-brand-red font-bold underline"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0">
                      <Flame size={20} className="text-brand-red opacity-30" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.size}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-white/10 rounded-lg text-white">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="p-1 hover:bg-white/5 rounded-l-lg"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="p-1 hover:bg-white/5 rounded-r-lg"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-white">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </div>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-[10px] text-red-500 font-bold uppercase tracking-tighter hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-brand-gray/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-xl font-black text-brand-red">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-center">
                  * Estimasi ongkir akan dihitung pada saat checkout
                </p>
                <button 
                  onClick={onCheckout}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  Checkout Sekarang <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Pages ---

const HomePage = ({ 
  setPage, 
  onAddToCart, 
  onBuyNow, 
  products, 
  testimonials, 
  onViewDetail,
  onToggleWishlist,
  wishlist
}: { 
  setPage: (p: Page) => void, 
  onAddToCart: (p: Product) => void, 
  onBuyNow: (p: Product) => void,
  products: Product[],
  testimonials: any[],
  onViewDetail: (p: Product) => void,
  onToggleWishlist: (id: string) => void,
  wishlist: string[]
}) => {
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-24 pb-24 bg-brand-black text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-bold uppercase tracking-widest">
              <Flame size={14} /> Bubuk Cabe Premium
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">
              Pedasnya <span className="text-brand-red">Nampol</span>,<br />
              Bikin Nagih!
            </h1>
            <p className="text-lg text-gray-400 max-w-md">
              Bubuk cabe premium tanpa campuran tepung, warna merah alami, kualitas pedas maksimal untuk setiap hidangan Anda.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setPage('products')} className="btn-primary">Beli Sekarang</button>
              <button onClick={() => setPage('wholesale')} className="btn-secondary">Jadi Reseller</button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-brand-red rounded-3xl rotate-3 flex items-center justify-center shadow-2xl">
              <div className="bg-white/10 backdrop-blur-xl w-[80%] h-[80%] rounded-2xl border border-white/20 flex flex-col items-center justify-center p-8 text-center text-white">
                <Flame size={120} className="mb-6 drop-shadow-lg" />
                <div className="text-4xl font-black mb-2">VITA CABE</div>
                <div className="text-sm font-bold tracking-widest opacity-80 uppercase">100% Cabe Murni</div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-6 -right-6 bg-brand-green text-white p-4 rounded-2xl shadow-xl font-black text-center z-20"
            >
              <div className="text-xs opacity-80">Mulai Dari</div>
              <div className="text-xl">Rp 15rb</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-brand-gray py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Kenapa Harus VITA CABE?</h2>
            <p className="text-gray-500">Kualitas yang kami jaga untuk kepuasan lidah Anda.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Bubuk Premium", desc: "Diproses dari cabe pilihan terbaik." },
              { icon: CheckCircle2, title: "Warna Alami", desc: "Merah alami tanpa pewarna buatan." },
              { icon: Flame, title: "Tanpa Tepung", desc: "100% cabe murni tanpa campuran." },
              { icon: Users, title: "Cocok UMKM", desc: "Partner terbaik untuk usaha kuliner." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto shadow-sm text-brand-green border border-white/5">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Produk Unggulan</h2>
            <p className="text-gray-500">Pilihan terfavorit pelanggan kami.</p>
          </div>
          <button onClick={() => setPage('products')} className="text-brand-red font-bold flex items-center gap-1 hover:underline">
            Lihat Semua <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featured.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onViewDetail={onViewDetail}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="bg-brand-dark rounded-[2rem] p-12 md:p-20 text-white relative overflow-hidden border border-white/5">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black leading-tight">Apa Kata Mereka?</h2>
              <div className="space-y-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center flex-shrink-0">
                      <Users size={20} className="text-white/20" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex gap-1 text-brand-green mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                      <p className="italic text-gray-300 text-sm mb-4">"{t.text}"</p>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[10px] text-brand-green uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square bg-brand-green/10 rounded-full flex items-center justify-center">
                <MessageCircle size={120} className="text-brand-green opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Kreasi Masakan</h2>
          <p className="text-gray-500">Inspirasi hidangan lezat dengan sentuhan VITA CABE.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Bakso Mercon", desc: "Tambahkan 2 sendok VITA CABE ke dalam kuah bakso untuk sensasi pedas meledak." },
            { title: "Ayam Geprek", desc: "Campurkan VITA CABE dengan bawang putih goreng untuk sambal geprek yang praktis." },
            { title: "Mie Pedas", desc: "Taburkan VITA CABE di atas mie instan favorit Anda untuk level pedas maksimal." }
          ].map((recipe, i) => (
            <div key={i} className="card bg-brand-gray border-white/5 p-8 space-y-4 group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                <Flame size={24} />
              </div>
              <h3 className="font-bold text-xl">{recipe.title}</h3>
              <p className="text-sm text-gray-400">{recipe.desc}</p>
              <div className="pt-4 flex items-center gap-2 text-brand-red font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat Resep <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 text-center py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-black tracking-tight">Siap Untuk Level Pedas Baru?</h2>
          <p className="text-gray-500">Dapatkan VITA CABE sekarang dan rasakan bedanya cabe murni berkualitas premium.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setPage('products')} className="btn-primary">Belanja Sekarang</button>
            <button onClick={() => setPage('contact')} className="px-6 py-3 border border-white/10 rounded-xl font-semibold hover:bg-white/5 transition-colors">Hubungi Kami</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({ 
  products,
  onAddToCart, 
  onBuyNow,
  onViewDetail,
  onToggleWishlist,
  wishlist
}: { 
  products: Product[],
  onAddToCart: (p: Product) => void, 
  onBuyNow: (p: Product) => void,
  onViewDetail: (p: Product) => void,
  onToggleWishlist: (id: string) => void,
  wishlist: string[]
}) => {
  const [filter, setFilter] = useState<'All' | 'Retail' | 'Wholesale' | 'Reseller'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'level'>('default');

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'level') result.sort((a, b) => b.level - a.level);

    return result;
  }, [products, filter, searchQuery, sortBy]);

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-12 bg-brand-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Katalog Produk</h1>
        <p className="text-gray-500">Pilih ukuran yang sesuai dengan kebutuhan Anda.</p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <input 
            type="text" 
            placeholder="Cari produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-gray border-white/10 rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-brand-red transition-all pl-12"
          />
          <ShoppingBag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-brand-gray border-white/10 rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-brand-red transition-all appearance-none pr-10"
            >
              <option value="default">Urutkan</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="level">Tingkat Pedas</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['Semua', 'Retail', 'Grosir', 'Reseller'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat === 'Semua' ? 'All' : cat as any)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              (filter === 'All' && cat === 'Semua') || filter === cat 
                ? 'bg-brand-red text-white shadow-lg' 
                : 'bg-brand-gray text-gray-500 hover:bg-white/10'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onViewDetail={onViewDetail}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl opacity-10">🔍</div>
          <p className="text-gray-500">Produk tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </div>
  );
};

const WholesalePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    plan: '20 - 50 pcs'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo VITA CABE, saya ingin mendaftar sebagai Reseller:%0A%0ANama: ${formData.name}%0ANo. WA: ${formData.phone}%0AKota: ${formData.city}%0ARencana Pembelian: ${formData.plan}`;
    window.open(`https://wa.me/${CONTACT_INFO.admin.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-24">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold uppercase tracking-widest">
            <Users size={14} /> Program Reseller
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter text-white">
            Tumbuh Bersama <br />
            <span className="text-brand-green">VITA CABE</span>
          </h1>
          <p className="text-lg text-gray-400">
            Dapatkan harga khusus grosir dan dukungan materi promosi eksklusif untuk membantu Anda memulai bisnis bubuk cabe premium.
          </p>
          <ul className="space-y-4 text-white">
            {[
              "Minimal order hanya 20 pcs",
              "Harga grosir jauh lebih kompetitif",
              "Support materi promosi (foto & video)",
              "Prioritas stok untuk reseller tetap"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-semibold">
                <CheckCircle2 className="text-brand-green" size={20} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-brand-gray rounded-[2rem] p-12 flex items-center justify-center border border-white/5">
          <Package size={160} className="text-brand-green opacity-20" />
        </div>
      </section>

      <section className="bg-brand-dark border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Form Pendaftaran Reseller</h2>
            <p className="text-gray-500">Isi data diri Anda dan tim kami akan segera menghubungi.</p>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</label>
              <input 
                required
                type="text" 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" 
                placeholder="Contoh: Selvia Yosefin" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">No. WhatsApp</label>
              <input 
                required
                type="tel" 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" 
                placeholder="0896..." 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Kota Domisili</label>
              <input 
                required
                type="text" 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" 
                placeholder="Contoh: Jakarta" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Rencana Pembelian Awal</label>
              <select 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red"
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
              >
                <option>20 - 50 pcs</option>
                <option>51 - 100 pcs</option>
                <option>Diatas 100 pcs</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full btn-secondary py-4 text-lg">Kirim Pendaftaran</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Apakah VITA CABE mengandung pengawet?", a: "Tidak. VITA CABE 100% murni dari cabe pilihan yang dikeringkan secara alami tanpa bahan pengawet atau pewarna buatan." },
    { q: "Berapa lama masa simpan VITA CABE?", a: "Dalam kemasan tertutup rapat dan disimpan di tempat sejuk, VITA CABE dapat bertahan hingga 12 bulan." },
    { q: "Apakah bisa kirim ke luar kota?", a: "Tentu! Kami melayani pengiriman ke seluruh wilayah Indonesia menggunakan jasa ekspedisi terpercaya." },
    { q: "Bagaimana cara menjadi reseller?", a: "Anda bisa mendaftar melalui halaman 'Grosir' atau langsung menghubungi Admin kami via WhatsApp." }
  ];

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-24 text-white">
      <section className="text-center max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black tracking-tight">Cerita VITA CABE</h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          Berawal dari kecintaan akan kuliner pedas Nusantara, VITA CABE hadir untuk memberikan solusi bubuk cabe murni berkualitas tinggi bagi rumah tangga maupun pelaku usaha kuliner.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-black">Visi & Misi</h2>
          <div className="space-y-6">
            <div className="card space-y-2 bg-brand-dark border-white/5">
              <h3 className="font-bold text-brand-red">Visi</h3>
              <p className="text-gray-400">Menjadi brand bubuk cabe nomor satu di Indonesia yang dikenal karena kemurnian dan kualitas pedasnya.</p>
            </div>
            <div className="card space-y-2 bg-brand-dark border-white/5">
              <h3 className="font-bold text-brand-green">Misi</h3>
              <ul className="text-gray-400 space-y-2 list-disc pl-4">
                <li>Menyediakan produk cabe murni tanpa bahan pengawet dan campuran.</li>
                <li>Mendukung pertumbuhan UMKM kuliner Indonesia.</li>
                <li>Menjaga standar higienitas tinggi dalam setiap proses produksi.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl font-black">Proses Produksi</h2>
          <div className="bg-brand-gray rounded-3xl p-8 space-y-6 border border-white/5">
            {[
              { step: "01", title: "Seleksi Cabe", desc: "Hanya cabe segar pilihan yang masuk tahap produksi." },
              { step: "02", title: "Pengeringan Higienis", desc: "Dikeringkan dengan suhu terjaga untuk mempertahankan warna alami." },
              { step: "03", title: "Penggilingan Halus", desc: "Digiling hingga tingkat kehalusan sempurna tanpa campuran tepung." },
              { step: "04", title: "Quality Control", desc: "Setiap batch diuji tingkat kepedasan dan kebersihannya." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl font-black text-brand-red/20">{item.step}</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Pertanyaan Sering Diajukan (FAQ)</h2>
          <p className="text-gray-500">Segala hal yang perlu Anda ketahui tentang VITA CABE.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center bg-brand-gray hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <Plus size={20} className={`text-brand-red transition-transform ${openFaq === i ? 'rotate-45' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-gray-400 bg-brand-dark/50 border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Hubungi Kami</h1>
        <p className="text-gray-500">Punya pertanyaan? Tim kami siap membantu Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="card text-center space-y-6 p-10">
          <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto text-brand-red">
            <Phone size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">FOUNDER</h3>
            <p className="text-gray-500">{CONTACT_INFO.founder.name}</p>
            <p className="text-xs text-gray-400 mb-2">0{CONTACT_INFO.founder.phone.substring(2)}</p>
            <a 
              href={`https://wa.me/${CONTACT_INFO.founder.phone}?text=Halo%20VITA%20CABE%2C%20saya%20ingin%20menjemput%20kehangatan%20rasa%20dalam%20setiap%20butiran%20pedasmu.%20Bolehkah%20saya%20memesan%20keajaiban%20merah%20ini%3F`}
              target="_blank"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="card text-center space-y-6 p-10">
          <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto text-brand-green">
            <Users size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">ADMIN</h3>
            <p className="text-gray-500">{CONTACT_INFO.admin.name}</p>
            <p className="text-xs text-gray-400 mb-2">0{CONTACT_INFO.admin.phone.substring(2)}</p>
            <a 
              href={`https://wa.me/${CONTACT_INFO.admin.phone}?text=Halo%20VITA%20CABE%2C%20saya%20ingin%20menjemput%20kehangatan%20rasa%20dalam%20setiap%20butiran%20pedasmu.%20Bolehkah%20saya%20memesan%20keajaiban%20merah%20ini%3F`}
              target="_blank"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="card text-center space-y-6 p-10">
          <div className="w-16 h-16 bg-brand-black/5 rounded-2xl flex items-center justify-center mx-auto text-brand-black">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">JAM OPERASIONAL</h3>
            <p className="text-gray-500">Setiap Hari</p>
            <p className="font-black">08.00 – 21.00 WIB</p>
          </div>
        </div>
      </div>

      {/* Order Tracking Simulation */}
      <section className="bg-brand-dark border border-white/5 rounded-[2rem] p-12 md:p-20 text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-black">Lacak Pesanan</h2>
          <p className="text-gray-500">Masukkan nomor pesanan Anda untuk melihat status pengiriman.</p>
          <div className="flex gap-2">
            <input type="text" placeholder="Contoh: VC-2026-001" className="bg-white/5 border-none rounded-xl p-4 flex-grow focus:ring-1 focus:ring-brand-red" />
            <button onClick={() => alert('Pesanan Anda sedang dalam proses pengemasan oleh Admin.')} className="bg-brand-red px-8 rounded-xl font-bold hover:bg-red-700 transition-colors">Lacak</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const CheckoutPage = ({ items, onOrderSuccess }: { items: CartItem[], onOrderSuccess: (order: OrderData) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
    paymentMethod: 'Transfer Bank',
    shipping: 'Reguler (Rp 10.000)'
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shippingCost = formData.shipping.includes('10.000') ? 10000 : 25000;
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'VITA10') {
      setDiscount(subtotal * 0.1);
      alert('Promo VITA10 berhasil digunakan!');
    } else {
      alert('Kode promo tidak valid.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: OrderData = {
      id: `VC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toLocaleDateString('id-ID'),
      items,
      total,
      status: 'Menunggu Pembayaran',
      ...formData,
      shippingCost
    };
    onOrderSuccess(order);
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white">Informasi Pengiriman</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">No. WhatsApp</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Metode Pembayaran</label>
                <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red">
                  <option>Transfer Bank</option>
                  <option>E-wallet (OVO/Gopay)</option>
                  <option>COD (Bayar di Tempat)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Opsi Pengiriman</label>
                <select value={formData.shipping} onChange={e => setFormData({...formData, shipping: e.target.value})} className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red">
                  <option>Reguler (Rp 10.000)</option>
                  <option>Ekspres (Rp 25.000)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Alamat Lengkap</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red"></textarea>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Catatan Tambahan (Opsional)</label>
                <input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} type="text" className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" />
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white">Instruksi Pembayaran</h2>
            <div className="bg-brand-gray rounded-3xl p-8 space-y-6 border border-white/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0 font-black text-white shadow-sm">1</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white">Transfer Ke Rekening</h4>
                  <div className="p-4 bg-brand-dark rounded-xl border border-white/10 space-y-1">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{CONTACT_INFO.bank.name}</div>
                    <div className="text-lg font-black tracking-wider text-white">{CONTACT_INFO.bank.accountNumber}</div>
                    <div className="text-sm font-bold text-brand-red">{CONTACT_INFO.bank.accountName}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0 font-black text-white shadow-sm">2</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white">Konfirmasi</h4>
                  <p className="text-sm text-gray-400">Setelah transfer, silakan konfirmasi ke WhatsApp Admin dengan mengirimkan bukti transfer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card sticky top-32 space-y-6 bg-brand-dark border-white/10">
            <h3 className="text-xl font-black text-white">Ringkasan Pesanan</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Kode Promo" 
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="bg-brand-gray border-none rounded-xl p-3 text-sm text-white flex-grow focus:ring-1 focus:ring-brand-red" 
                />
                <button 
                  onClick={applyPromo}
                  className="bg-brand-red px-4 rounded-xl text-xs font-bold text-white"
                >
                  Pakai
                </button>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ongkos Kirim</span>
                  <span className="font-bold text-white">Rp {shippingCost.toLocaleString('id-ID')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-brand-green">
                    <span>Diskon Promo</span>
                    <span className="font-bold">- Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <span className="text-brand-red">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <button 
              form="checkout-form"
              type="submit"
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              Buat Pesanan <CheckCircle2 size={20} />
            </button>
            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
              Pesanan diproses setelah pembayaran dikonfirmasi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AccountPage = ({ 
  orders, 
  wishlist, 
  products, 
  onAddToCart, 
  onViewDetail,
  onToggleWishlist
}: { 
  orders: OrderData[], 
  wishlist: string[], 
  products: Product[],
  onAddToCart: (p: Product) => void,
  onViewDetail: (p: Product) => void,
  onToggleWishlist: (id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-12 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center text-3xl font-black">
            V
          </div>
          <div>
            <h1 className="text-3xl font-black">Akun Saya</h1>
            <p className="text-gray-500 text-sm">Pelanggan Setia VITA CABE</p>
          </div>
        </div>
        <div className="flex bg-brand-gray p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Pesanan Saya
          </button>
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'wishlist' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Wishlist
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-brand-dark rounded-[2rem] border border-white/5 space-y-4">
              <Clock size={64} className="mx-auto text-white/5" />
              <p className="text-gray-500">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-brand-dark border border-white/5 rounded-[2rem] p-8 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">No. Pesanan</div>
                    <div className="font-black text-lg">{order.id}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</div>
                    <div className="text-brand-green font-bold">{order.status}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-400">{item.quantity}x {item.name}</span>
                        <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Pembayaran</span>
                      <span className="text-brand-red font-black text-lg">Rp {order.total.toLocaleString('id-ID')}</span>
                    </div>
                    <button 
                      onClick={() => window.open(`https://wa.me/${CONTACT_INFO.admin.phone}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20status%20pesanan%20${order.id}`, '_blank')}
                      className="w-full py-3 bg-brand-green text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                    >
                      Tanya Admin via WA
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistedProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-brand-dark rounded-[2rem] border border-white/5 space-y-4">
              <Star size={64} className="mx-auto text-white/5" />
              <p className="text-gray-500">Wishlist kamu masih kosong.</p>
            </div>
          ) : (
            wishlistedProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={() => {}}
                onViewDetail={onViewDetail}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={true}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ orders, onUpdateStatus }: { orders: OrderData[], onUpdateStatus: (id: string, status: OrderData['status']) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsers = [
      { user: 'vale', pass: '24042009' },
      { user: 'selvia', pass: '05061999' }
    ];

    const found = validUsers.find(u => u.user === username.toLowerCase() && u.pass === password);
    if (found) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Username atau Password salah!');
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const resellerOrders = orders.filter(order => order.items.some(item => item.category === 'Reseller' || item.category === 'Wholesale'));
  const resellerRevenue = resellerOrders.reduce((acc, order) => acc + order.total, 0);
  const retailRevenue = totalRevenue - resellerRevenue;

  // Chart Data
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('id-ID');
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.date === date);
      return {
        name: date.split('/')[0] + '/' + date.split('/')[1],
        revenue: dayOrders.reduce((acc, o) => acc + o.total, 0)
      };
    });
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-md w-full bg-brand-dark border-white/10 p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Admin Login</h2>
            <p className="text-gray-500 text-sm">Khusus Vale & Selvia</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Username</label>
              <input 
                type="text" 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" 
                placeholder="vale / selvia"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                className="w-full bg-brand-gray border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-red" 
                placeholder="DDMMYYYY"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-brand-red text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full btn-primary py-4">Masuk Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-12 text-white">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Dashboard Keuangan</h1>
          <p className="text-gray-500">Laporan pendapatan VITA CABE secara real-time.</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-gray-500 hover:text-brand-red uppercase tracking-widest">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-brand-gray border-white/5 p-8 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Pendapatan</div>
          <div className="text-3xl font-black text-brand-red">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <div className="text-[10px] text-gray-400">Dari {orders.length} total pesanan</div>
        </div>
        <div className="card bg-brand-gray border-white/5 p-8 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pendapatan Reseller/Grosir</div>
          <div className="text-3xl font-black text-brand-green">Rp {resellerRevenue.toLocaleString('id-ID')}</div>
          <div className="text-[10px] text-gray-400">{resellerOrders.length} pesanan skala besar</div>
        </div>
        <div className="card bg-brand-gray border-white/5 p-8 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pendapatan Retail</div>
          <div className="text-3xl font-black text-white">Rp {retailRevenue.toLocaleString('id-ID')}</div>
          <div className="text-[10px] text-gray-400">Penjualan satuan langsung</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card bg-brand-dark border border-white/5 p-8 space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-brand-red" size={20} />
          <h2 className="text-xl font-black">Tren Pendapatan (7 Hari Terakhir)</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `Rp ${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#ff4d4d', fontWeight: 'bold' }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#ff4d4d' : '#333'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-black">Transaksi Terbaru</h2>
        <div className="bg-brand-dark border border-white/5 rounded-[2rem] overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="p-6">ID Pesanan</th>
                <th className="p-6">Pelanggan</th>
                <th className="p-6">Item</th>
                <th className="p-6">Total</th>
                <th className="p-6">Status</th>
                <th className="p-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 italic">Belum ada data transaksi</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-sm">{order.id}</td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-white">{order.name}</div>
                      <div className="text-[10px] text-gray-500">{order.phone}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-xs text-gray-400">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="p-6 font-black text-brand-red text-sm">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        order.status === 'Selesai' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <select 
                        className="bg-brand-gray text-[10px] font-bold uppercase p-2 rounded-lg border-none focus:ring-1 focus:ring-brand-red"
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                      >
                        <option>Menunggu Pembayaran</option>
                        <option>Diproses</option>
                        <option>Dikirim</option>
                        <option>Selesai</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [products] = useState<Product[]>(PRODUCTS);
  const [testimonials] = useState(TESTIMONIALS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // New States
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vitacabe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<OrderData[]>(() => {
    const saved = localStorage.getItem('vitacabe_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('vitacabe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Orders
  useEffect(() => {
    localStorage.setItem('vitacabe_orders', JSON.stringify(orders));
  }, [orders]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const isExist = prev.includes(id);
      if (isExist) {
        addToast('Dihapus dari wishlist', 'info');
        return prev.filter(item => item !== id);
      }
      addToast('Ditambahkan ke wishlist', 'success');
      return [...prev, id];
    });
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`${product.name} masuk keranjang`);
    setIsCartOpen(true);
  };

  const buyNow = (product: Product) => {
    setCart([{ ...product, quantity: 1 }]);
    setPage('checkout');
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item dihapus', 'info');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setPage('checkout');
  };

  const handleOrderSuccess = (order: OrderData) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
    addToast('Pesanan berhasil dibuat!', 'success');
    setPage('account');
  };

  const updateOrderStatus = (id: string, status: OrderData['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
    addToast(`Status pesanan ${id} diperbarui`, 'success');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-brand-black">
      <Navbar 
        currentPage={page} 
        setPage={setPage} 
        cartCount={cartCount}
        toggleCart={() => setIsCartOpen(true)}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {page === 'home' && (
              <HomePage 
                setPage={setPage} 
                onAddToCart={addToCart} 
                onBuyNow={buyNow} 
                products={products}
                testimonials={testimonials}
                onViewDetail={setSelectedProduct}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            )}
            {page === 'products' && (
              <ProductsPage 
                products={products}
                onAddToCart={addToCart} 
                onBuyNow={buyNow} 
                onViewDetail={setSelectedProduct}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            )}
            {page === 'wholesale' && <WholesalePage />}
            {page === 'promo' && (
              <div className="pt-32 pb-24 px-4 text-center space-y-8">
                <h1 className="text-4xl font-black text-white">Promo Spesial</h1>
                <div className="max-w-xl mx-auto bg-brand-red text-white p-12 rounded-[2rem] shadow-2xl space-y-4">
                  <div className="text-6xl font-black">DISKON 10%</div>
                  <p className="text-lg opacity-80">Khusus untuk pelanggan baru!</p>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl font-bold text-sm uppercase tracking-widest border border-white/20">
                    Gunakan Kode: <span className="text-white">VITA10</span>
                  </div>
                  <button onClick={() => setPage('products')} className="bg-white text-brand-red px-8 py-3 rounded-xl font-bold mt-4 hover:bg-white/90 transition-colors">
                    Belanja Sekarang
                  </button>
                </div>
              </div>
            )}
            {page === 'about' && <AboutPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'account' && (
              <AccountPage 
                orders={orders} 
                wishlist={wishlist} 
                products={products}
                onAddToCart={addToCart}
                onViewDetail={setSelectedProduct}
                onToggleWishlist={toggleWishlist}
              />
            )}
            {page === 'admin' && <AdminDashboard orders={orders} onUpdateStatus={updateOrderStatus} />}
            {page === 'checkout' && <CheckoutPage items={cart} onOrderSuccess={handleOrderSuccess} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-brand-black text-white py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <span className="text-2xl font-black tracking-tighter text-brand-red">VITA</span>
              <span className="text-2xl font-black tracking-tighter text-white">CABE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Bubuk cabe premium tanpa campuran tepung, warna merah alami, kualitas pedas maksimal.
            </p>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/${CONTACT_INFO.admin.phone}?text=Salam%20hangat%20dari%20pecinta%20pedas.%20Saya%20ingin%20membawa%20pulang%20sensasi%20%27Pedasnya%20Nampol%27%20dari%20VITA%20CABE%20ke%20dapur%20saya.%20Bagaimana%20caranya%3F`}
                target="_blank"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors cursor-pointer"
              >
                <MessageCircle size={20} />
              </a>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors cursor-pointer">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green">Menu</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Beranda', 'Produk', 'Grosir', 'Tentang', 'Kontak'].map(item => (
                <li key={item} className="hover:text-white cursor-pointer transition-colors" onClick={() => setPage(item === 'Beranda' ? 'home' : item.toLowerCase() as Page)}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green">Customer Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-red flex-shrink-0" />
                <span>Jl. Duri Selatan Ic, No. 1D, rt. 0010 rw. 001, Duri Selatan, Tambora, Kota Jakarta Barat, DKI Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-red flex-shrink-0" />
                <span>0{CONTACT_INFO.founder.phone.substring(2)}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-brand-red flex-shrink-0" />
                <span>08.00 – 21.00 WIB</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green">Newsletter</h4>
            <p className="text-xs text-gray-400">Dapatkan info promo terbaru langsung di WhatsApp Anda.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert('Terima kasih! Kami akan mengirimkan info promo terbaru.'); }}>
              <input type="tel" placeholder="No. WhatsApp" className="bg-white/5 border-none rounded-lg p-3 text-sm flex-grow focus:ring-1 focus:ring-brand-red" required />
              <button type="submit" className="bg-brand-red p-3 rounded-lg hover:bg-red-700 transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 VITA CABE. All Rights Reserved. Founded by {CONTACT_INFO.founder.name}.</p>
          <button onClick={() => setPage('admin')} className="hover:text-brand-red transition-colors">Admin Access</button>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        allProducts={products}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-brand-red text-white rounded-full shadow-2xl z-50 hover:bg-red-700 transition-colors"
          >
            <Plus size={24} className="rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

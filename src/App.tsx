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
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Page, OrderData } from './types';
import { PRODUCTS, CONTACT_INFO, TESTIMONIALS } from './constants';

// --- Components ---

const EditableImage = ({ 
  src, 
  onUpload, 
  className, 
  placeholder: PlaceholderIcon 
}: { 
  src?: string, 
  onUpload: (base64: string) => void, 
  className?: string,
  placeholder?: any
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-brand-gray">
          {PlaceholderIcon && <PlaceholderIcon size={48} className="text-white/10" />}
        </div>
      )}
      <label className="upload-overlay">
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        <div className="flex flex-col items-center gap-2 text-white font-bold text-xs">
          <Plus size={20} />
          <span>{src ? 'Ganti Foto' : 'Tambah Foto'}</span>
        </div>
      </label>
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
    { label: 'Home', value: 'home' },
    { label: 'Produk', value: 'products' },
    { label: 'Grosir', value: 'wholesale' },
    { label: 'Promo', value: 'promo' },
    { label: 'Tentang', value: 'about' },
    { label: 'Kontak', value: 'contact' },
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
  onImageUpload: (id: string, image: string) => void;
  key?: string | number;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onBuyNow,
  onImageUpload
}: ProductCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card flex flex-col h-full bg-brand-gray border-white/5"
    >
      <EditableImage 
        src={product.image}
        onUpload={(img) => onImageUpload(product.id, img)}
        className="aspect-square rounded-xl mb-4"
        placeholder={Flame}
      />
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-white">{product.name}</h3>
        <div className="bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded-full">
          Level {product.level}
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
                    <div className="w-20 h-20 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Flame size={24} className="text-brand-red opacity-30" />
                      )}
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
  heroImage, 
  onHeroUpload, 
  testimonials, 
  onTestimonialUpload,
  onProductUpload
}: { 
  setPage: (p: Page) => void, 
  onAddToCart: (p: Product) => void, 
  onBuyNow: (p: Product) => void,
  products: Product[],
  heroImage: string,
  onHeroUpload: (img: string) => void,
  testimonials: any[],
  onTestimonialUpload: (id: string, img: string) => void,
  onProductUpload: (id: string, img: string) => void
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
              <Flame size={14} /> Premium Chili Powder
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
            className="relative group"
          >
            <EditableImage 
              src={heroImage}
              onUpload={onHeroUpload}
              className="aspect-square bg-brand-red rounded-3xl rotate-3 shadow-2xl"
              placeholder={Flame}
            />
            
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
              onImageUpload={onProductUpload}
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
                    <EditableImage 
                      src={t.image}
                      onUpload={(img) => onTestimonialUpload(t.id, img)}
                      className="w-16 h-16 rounded-full flex-shrink-0"
                      placeholder={Users}
                    />
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
  onProductUpload
}: { 
  products: Product[],
  onAddToCart: (p: Product) => void, 
  onBuyNow: (p: Product) => void,
  onProductUpload: (id: string, img: string) => void
}) => {
  const [filter, setFilter] = useState<'All' | 'Retail' | 'Wholesale' | 'Reseller'>('All');

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-12 bg-brand-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Katalog Produk</h1>
        <p className="text-gray-500">Pilih ukuran yang sesuai dengan kebutuhan Anda.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['All', 'Retail', 'Wholesale', 'Reseller'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filter === cat 
                ? 'bg-brand-red text-white shadow-lg' 
                : 'bg-brand-gray text-gray-500 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            onImageUpload={onProductUpload}
          />
        ))}
      </div>
    </div>
  );
};

const WholesalePage = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-24">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold uppercase tracking-widest">
            <Users size={14} /> Reseller Program
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter">
            Tumbuh Bersama <br />
            <span className="text-brand-green">VITA CABE</span>
          </h1>
          <p className="text-lg text-gray-600">
            Dapatkan harga khusus grosir dan dukungan materi promosi eksklusif untuk membantu Anda memulai bisnis bubuk cabe premium.
          </p>
          <ul className="space-y-4">
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
        <div className="bg-brand-gray rounded-[2rem] p-12 flex items-center justify-center">
          <Package size={160} className="text-brand-green opacity-20" />
        </div>
      </section>

      <section className="bg-brand-dark border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Form Pendaftaran Reseller</h2>
            <p className="text-gray-500">Isi data diri Anda dan tim kami akan segera menghubungi.</p>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</label>
              <input type="text" className="w-full" placeholder="Contoh: Selvia Yosefin" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">No. WhatsApp</label>
              <input type="tel" className="w-full" placeholder="0896..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Kota Domisili</label>
              <input type="text" className="w-full" placeholder="Contoh: Jakarta" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Rencana Pembelian Awal</label>
              <select className="w-full">
                <option>20 - 50 pcs</option>
                <option>51 - 100 pcs</option>
                <option>Diatas 100 pcs</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-4">
              <button className="w-full btn-secondary py-4 text-lg">Daftar Sekarang</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-24">
      <section className="text-center max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black tracking-tight">Cerita VITA CABE</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Berawal dari kecintaan akan kuliner pedas Nusantara, VITA CABE hadir untuk memberikan solusi bubuk cabe murni berkualitas tinggi bagi rumah tangga maupun pelaku usaha kuliner.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-black">Visi & Misi</h2>
          <div className="space-y-6">
            <div className="card space-y-2">
              <h3 className="font-bold text-brand-red">Visi</h3>
              <p className="text-gray-600">Menjadi brand bubuk cabe nomor satu di Indonesia yang dikenal karena kemurnian dan kualitas pedasnya.</p>
            </div>
            <div className="card space-y-2">
              <h3 className="font-bold text-brand-green">Misi</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-4">
                <li>Menyediakan produk cabe murni tanpa bahan pengawet dan campuran.</li>
                <li>Mendukung pertumbuhan UMKM kuliner Indonesia.</li>
                <li>Menjaga standar higienitas tinggi dalam setiap proses produksi.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl font-black">Proses Produksi</h2>
          <div className="bg-brand-gray rounded-3xl p-8 space-y-6">
            {[
              { step: "01", title: "Seleksi Cabe", desc: "Hanya cabe segar pilihan yang masuk tahap produksi." },
              { step: "02", title: "Pengeringan Higienis", desc: "Dikeringkan dengan suhu terjaga untuk mempertahankan warna alami." },
              { step: "03", title: "Penggilingan Halus", desc: "Digiling hingga tingkat kehalusan sempurna tanpa campuran tepung." },
              { step: "04", title: "Quality Control", desc: "Setiap batch diuji tingkat kepedasan dan kebersihannya." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl font-black text-brand-red/20">{item.step}</div>
                <div className="space-y-1">
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
            <a 
              href={`https://wa.me/${CONTACT_INFO.founder.phone}`}
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
            <a 
              href={`https://wa.me/${CONTACT_INFO.admin.phone}`}
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
    </div>
  );
};

const CheckoutPage = ({ items, onOrderSuccess }: { items: CartItem[], onOrderSuccess: () => void }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [formData, setFormData] = useState<OrderData>({
    name: '',
    address: '',
    phone: '',
    notes: '',
    paymentMethod: 'Transfer Bank'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order processing
    alert("Pesanan berhasil dibuat! Silakan lakukan pembayaran dan upload bukti transfer.");
    onOrderSuccess();
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-black">Informasi Pengiriman</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-brand-gray border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">No. WhatsApp</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-brand-gray border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Metode Pembayaran</label>
                <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-brand-gray border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-red">
                  <option>Transfer Bank</option>
                  <option>E-wallet (OVO/Gopay)</option>
                  <option>COD (Bayar di Tempat)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Alamat Lengkap</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full bg-brand-gray border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-red"></textarea>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Catatan Tambahan (Opsional)</label>
                <input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} type="text" className="w-full bg-brand-gray border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-red" />
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
                  <h4 className="font-bold text-white">Upload Bukti Transfer</h4>
                  <p className="text-sm text-gray-400">Kirimkan bukti transfer melalui form ini atau langsung ke WhatsApp Admin.</p>
                  <input type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-red/10 file:text-brand-red hover:file:bg-brand-red/20" />
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
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-bold text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimasi Ongkir</span>
                <span className="text-brand-green font-bold">Dihitung Admin</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4">
                <span className="text-white">Total</span>
                <span className="text-brand-red">Rp {subtotal.toLocaleString('id-ID')}</span>
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

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [heroImage, setHeroImage] = useState<string>('');
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateProductImage = (id: string, image: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, image } : p));
  };

  const updateTestimonialImage = (id: string, image: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, image } : t));
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setPage('checkout');
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setPage('home');
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
                heroImage={heroImage}
                onHeroUpload={setHeroImage}
                testimonials={testimonials}
                onTestimonialUpload={updateTestimonialImage}
                onProductUpload={updateProductImage}
              />
            )}
            {page === 'products' && (
              <ProductsPage 
                products={products}
                onAddToCart={addToCart} 
                onBuyNow={buyNow} 
                onProductUpload={updateProductImage}
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
                    Diskon Otomatis Saat Checkout
                  </div>
                  <button onClick={() => setPage('products')} className="bg-white text-brand-red px-8 py-3 rounded-xl font-bold mt-4 hover:bg-white/90 transition-colors">
                    Belanja Sekarang
                  </button>
                </div>
              </div>
            )}
            {page === 'about' && <AboutPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'checkout' && <CheckoutPage items={cart} onOrderSuccess={handleOrderSuccess} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-brand-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-brand-red">VITA</span>
              <span className="text-2xl font-black tracking-tighter text-white">CABE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Bubuk cabe premium tanpa campuran tepung, warna merah alami, kualitas pedas maksimal.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors cursor-pointer">
                <MessageCircle size={20} />
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors cursor-pointer">
                <Users size={20} />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green">Menu</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Home', 'Produk', 'Grosir', 'Tentang', 'Kontak'].map(item => (
                <li key={item} className="hover:text-white cursor-pointer transition-colors" onClick={() => setPage(item.toLowerCase() as Page)}>{item}</li>
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
                <span>{CONTACT_INFO.founder.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-brand-red flex-shrink-0" />
                <span>08.00 – 21.00 WIB</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green">Newsletter</h4>
            <p className="text-xs text-gray-400">Dapatkan info promo terbaru langsung di email Anda.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email Anda" className="bg-white/5 border-none rounded-lg p-3 text-sm flex-grow focus:ring-1 focus:ring-brand-red" />
              <button className="bg-brand-red p-3 rounded-lg hover:bg-red-700 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
          <p>© 2026 VITA CABE. All Rights Reserved. Founded by {CONTACT_INFO.founder.name}.</p>
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
    </div>
  );
}

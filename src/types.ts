export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice?: number;
  level: number;
  size: string;
  minOrder: number;
  description: string;
  category: 'Retail' | 'Wholesale' | 'Reseller';
  stock: number;
  isBestSeller?: boolean;
  isComingSoon?: boolean;
  reviews?: Review[];
  rating?: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Page = 'home' | 'products' | 'wholesale' | 'about' | 'contact' | 'checkout' | 'account' | 'admin';

export interface OrderData {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai';
  name: string;
  address: string;
  phone: string;
  notes: string;
  paymentMethod: string;
  shippingCost: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export type UserRole = 'admin' | 'reseller' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

export interface FinanceEntry {
  id?: string;
  tanggal: any;
  keterangan: string;
  nominal: number; // Total Harga Cabe (tanpa ongkir)
  jenis: 'pemasukan' | 'pengeluaran';
  weight: '100g' | '200g' | '500g';
  harga_cabe: number;
  ongkir: number;
  total_bayar: number;
  nominal_komisi: number;
  untung_owner: number;
  jumlah: number;
  productId?: string;
  customerName: string;
  customerPhone: string;
  resellerId?: string;
  resellerName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: any;
}

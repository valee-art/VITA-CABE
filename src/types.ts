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
}

export interface CartItem extends Product {
  quantity: number;
}

export type Page = 'home' | 'products' | 'wholesale' | 'promo' | 'about' | 'contact' | 'checkout' | 'account' | 'admin';

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

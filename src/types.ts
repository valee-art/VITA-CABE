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
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Page = 'home' | 'products' | 'wholesale' | 'promo' | 'about' | 'contact' | 'checkout';

export interface OrderData {
  name: string;
  address: string;
  phone: string;
  notes: string;
  paymentMethod: string;
  proof?: File;
}

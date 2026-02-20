import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'VITA CABE 100ml',
    price: 15000,
    level: 3,
    size: '100ml',
    minOrder: 1,
    description: 'Bubuk cabe premium kemasan praktis 100ml. Cocok untuk stok dapur rumah tangga.',
    category: 'Retail'
  },
  {
    id: '2',
    name: 'VITA CABE 200ml',
    price: 28000,
    level: 4,
    size: '200ml',
    minOrder: 1,
    description: 'Bubuk cabe premium kemasan 200ml. Lebih hemat untuk pecinta pedas sejati.',
    category: 'Retail'
  },
  {
    id: '3',
    name: 'VITA CABE 500ml',
    price: 65000,
    level: 5,
    size: '500ml',
    minOrder: 1,
    description: 'Kemasan besar 500ml. Pilihan tepat untuk usaha kuliner atau stok bulanan.',
    category: 'Retail'
  },
  {
    id: '4',
    name: 'Paket Grosir (20 pcs)',
    price: 240000, // Misal 12k/pcs untuk 100ml
    wholesalePrice: 12000,
    level: 4,
    size: '20 x 100ml',
    minOrder: 20,
    description: 'Paket grosir minimal 20 pcs. Harga jauh lebih murah untuk dijual kembali.',
    category: 'Wholesale'
  },
  {
    id: '5',
    name: 'Paket Reseller Exclusive',
    price: 500000,
    level: 4,
    size: 'Mix Sizes',
    minOrder: 1,
    description: 'Paket lengkap reseller termasuk materi promosi dan dukungan penuh dari tim VITA CABE.',
    category: 'Reseller'
  }
];

export const TESTIMONIALS = [
  { id: '1', name: 'Siti Aminah', role: 'Pemilik Warung Bakso', text: 'VITA CABE bikin kuah bakso saya makin merah menggoda dan pedasnya pas banget!', image: '' },
  { id: '2', name: 'Budi Santoso', role: 'Ibu Rumah Tangga', text: 'Praktis banget buat stok di rumah. Gak perlu repot ulek cabe lagi.', image: '' }
];

export const CONTACT_INFO = {
  founder: {
    name: 'SELVIA YOSEFIN',
    phone: '089693308580'
  },
  admin: {
    name: 'VALE',
    phone: '08194068927'
  },
  bank: {
    name: 'Mandiri',
    accountName: 'SELVIA YOSEFIN',
    accountNumber: '1460014407410'
  }
};

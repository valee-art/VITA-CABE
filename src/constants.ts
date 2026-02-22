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
    category: 'Retail',
    stock: 150,
    isBestSeller: true,
    rating: 4.8,
    reviews: [
      { id: 'r1', userName: 'Andi', rating: 5, comment: 'Pedasnya mantap, pas buat bakso!', date: '12/02/2026' },
      { id: 'r2', userName: 'Budi', rating: 4, comment: 'Cukup pedas, pengiriman cepat.', date: '15/02/2026' }
    ]
  },
  {
    id: '2',
    name: 'VITA CABE 200ml',
    price: 28000,
    level: 4,
    size: '200ml',
    minOrder: 1,
    description: 'Bubuk cabe premium kemasan 200ml. Lebih hemat untuk pecinta pedas sejati.',
    category: 'Retail',
    stock: 85,
    isBestSeller: true,
    rating: 4.9,
    reviews: [
      { id: 'r3', userName: 'Santi', rating: 5, comment: 'Langganan terus di sini, kualitas oke.', date: '18/02/2026' }
    ]
  },
  {
    id: '3',
    name: 'VITA CABE 500ml',
    price: 65000,
    level: 5,
    size: '500ml',
    minOrder: 1,
    description: 'Kemasan besar 500ml. Pilihan tepat untuk usaha kuliner atau stok bulanan.',
    category: 'Retail',
    stock: 40,
    rating: 5.0,
    reviews: [
      { id: 'r4', userName: 'Warung Makan Barokah', rating: 5, comment: 'Sangat membantu untuk bumbu masakan warung saya.', date: '20/02/2026' }
    ]
  },
  {
    id: '4',
    name: 'Paket Grosir (20 pcs)',
    price: 240000,
    wholesalePrice: 12000,
    level: 4,
    size: '20 x 100ml',
    minOrder: 20,
    description: 'Paket grosir minimal 20 pcs. Harga jauh lebih murah untuk dijual kembali.',
    category: 'Wholesale',
    stock: 25,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Paket Reseller Exclusive',
    price: 500000,
    level: 4,
    size: 'Mix Sizes',
    minOrder: 1,
    description: 'Paket lengkap reseller termasuk materi promosi dan dukungan penuh dari tim VITA CABE.',
    category: 'Reseller',
    stock: 10,
    rating: 5.0
  }
];

export const TESTIMONIALS = [
  { id: '1', name: 'Siti Aminah', role: 'Pemilik Warung Bakso', text: 'VITA CABE bikin kuah bakso saya makin merah menggoda dan pedasnya pas banget!' },
  { id: '2', name: 'Budi Santoso', role: 'Ibu Rumah Tangga', text: 'Praktis banget buat stok di rumah. Gak perlu repot ulek cabe lagi.' }
];

export const CONTACT_INFO = {
  founder: {
    name: 'SELVIA YOSEFIN',
    phone: '6289693308580'
  },
  admin: {
    name: 'VALE',
    phone: '628194068927'
  },
  email: 'Vitacabe89@gmail.com',
  bank: {
    name: 'Mandiri',
    accountName: 'SELVIA YOSEFIN',
    accountNumber: '1460014407410'
  },
  socials: [
    { id: '1', platform: 'Instagram', url: 'https://www.instagram.com/vitacabe00?igsh=NXc0NDNweGZ6azQ' }
  ]
};

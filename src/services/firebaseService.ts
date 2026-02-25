import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDB } from '../firebase';
import { Product, OrderData, FinanceEntry } from '../types';

export const getFinanceData = async () => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const keuanganRef = collection(db, 'keuangan');
    // Ambil semua dokumen tanpa sorting di awal untuk menghindari error Index Firebase
    const querySnapshot = await getDocs(keuanganRef);
    
    let totalNominal = 0;
    const data: FinanceEntry[] = [];

    if (querySnapshot.empty) {
      console.warn('Koleksi "keuangan" ditemukan tetapi tidak ada dokumen di dalamnya.');
      return { totalNominal: 0, entries: [], docCount: 0 };
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      
      // Cari field nominal (cek variasi huruf besar/kecil: nominal, Nominal, NOMINAL)
      const rawNominal = docData.nominal ?? docData.Nominal ?? docData.NOMINAL ?? 0;
      const nominal = Number(rawNominal) || 0;
      
      // Cari field jenis (cek variasi: jenis, Jenis, JENIS)
      const rawJenis = String(docData.jenis ?? docData.Jenis ?? docData.JENIS ?? 'pemasukan').toLowerCase();
      const jenis = (rawJenis === 'pengeluaran' || rawJenis === 'keluar' || rawJenis === 'expense') 
        ? 'pengeluaran' 
        : 'pemasukan';

      // Logika Pemasukan vs Pengeluaran
      if (jenis === 'pengeluaran') {
        totalNominal -= nominal;
      } else {
        totalNominal += nominal;
      }

      data.push({ id: doc.id, ...docData, nominal, jenis } as FinanceEntry);
    });

    // Urutkan secara manual berdasarkan tanggal (jika ada field tanggal)
    data.sort((a, b) => {
      const dateA = a.tanggal?.seconds || 0;
      const dateB = b.tanggal?.seconds || 0;
      return dateB - dateA;
    });

    return {
      totalNominal,
      entries: data,
      docCount: querySnapshot.size
    };
  } catch (error) {
    console.error('Error fetching finance data from Firebase:', error);
    return null;
  }
};

export const addFinanceEntry = async (entry: Omit<FinanceEntry, 'id'>) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const keuanganRef = collection(db, 'keuangan');
    await addDoc(keuanganRef, {
      ...entry,
      tanggal: entry.tanggal || serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding finance entry to Firebase:', error);
  }
};

export const getProducts = async (): Promise<Product[] | null> => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    return null;
  }
};

export const saveProduct = async (product: Product) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, product);
  } catch (error) {
    console.error('Error saving product to Firebase:', error);
  }
};

export const removeProduct = async (id: string) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product from Firebase:', error);
  }
};

export const getOrders = async (): Promise<OrderData[] | null> => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: OrderData[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderData);
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders from Firebase:', error);
    return null;
  }
};

export const saveOrder = async (order: OrderData) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order);
  } catch (error) {
    console.error('Error saving order to Firebase:', error);
  }
};

export const updateOrderStatusFirebase = async (id: string, status: string) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status in Firebase:', error);
  }
};

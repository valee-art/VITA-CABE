import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirebaseDB } from '../firebase';
import { Product, OrderData } from '../types';

export const getFinanceData = async () => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const keuanganRef = collection(db, 'keuangan');
    // Try to get all docs, sorting might fail if index is not ready
    const querySnapshot = await getDocs(keuanganRef);
    
    let totalNominal = 0;
    const data: any[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const nominal = Number(docData.nominal) || 0;
      const jenis = docData.jenis?.toLowerCase() || 'pemasukan';

      // If it's an expense (pengeluaran), we subtract it. 
      // Otherwise, we assume it's income (pemasukan).
      if (jenis === 'pengeluaran' || jenis === 'keluar') {
        totalNominal -= nominal;
      } else {
        totalNominal += nominal;
      }

      data.push({ id: doc.id, ...docData, nominal });
    });

    // Sort manually by date if 'tanggal' exists, to avoid index errors in Firebase
    data.sort((a, b) => {
      const dateA = a.tanggal?.seconds || 0;
      const dateB = b.tanggal?.seconds || 0;
      return dateB - dateA;
    });

    return {
      totalNominal,
      entries: data
    };
  } catch (error) {
    console.error('Error fetching finance data from Firebase:', error);
    return null;
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

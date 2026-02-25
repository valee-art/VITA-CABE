import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc, where } from 'firebase/firestore';
import { getFirebaseDB } from '../firebase';
import { Product, OrderData, FinanceEntry, Customer, UserProfile, UserRole } from '../types';

// --- Transactions / Keuangan ---
export const getFinanceData = async (resellerId?: string, customerName?: string) => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const transactionsRef = collection(db, 'transactions');
    let q = query(transactionsRef);
    
    if (resellerId) {
      q = query(transactionsRef, where('resellerId', '==', resellerId));
    } else if (customerName) {
      q = query(transactionsRef, where('customerName', '==', customerName));
    }

    const querySnapshot = await getDocs(q);
    
    let totalNominal = 0;
    let totalKomisi = 0;
    const data: FinanceEntry[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const nominal = Number(docData.nominal) || 0;
      const jenis = docData.jenis || 'pemasukan';
      const komisi = Number(docData.nominal_komisi) || 0;

      if (jenis === 'pengeluaran') {
        totalNominal -= nominal;
      } else {
        totalNominal += nominal;
        totalKomisi += komisi;
      }

      data.push({ id: doc.id, ...docData, nominal, jenis } as FinanceEntry);
    });

    data.sort((a, b) => {
      const dateA = a.tanggal?.seconds || 0;
      const dateB = b.tanggal?.seconds || 0;
      return dateB - dateA;
    });

    return {
      totalNominal,
      totalKomisi,
      entries: data,
      docCount: querySnapshot.size
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }
};

export const addFinanceEntry = async (entry: Omit<FinanceEntry, 'id'>) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const transactionsRef = collection(db, 'transactions');
    await addDoc(transactionsRef, {
      ...entry,
      tanggal: entry.tanggal || serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};

// --- Stocks / Products ---
export const getProducts = async (): Promise<Product[] | null> => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const stocksRef = collection(db, 'stocks');
    const querySnapshot = await getDocs(stocksRef);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return null;
  }
};

export const saveProduct = async (product: Product) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const stockRef = doc(db, 'stocks', product.id);
    await setDoc(stockRef, product);
  } catch (error) {
    console.error('Error saving stock:', error);
  }
};

export const removeProduct = async (id: string) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    await deleteDoc(doc(db, 'stocks', id));
  } catch (error) {
    console.error('Error deleting stock:', error);
  }
};

export const updateStock = async (id: string, newStock: number) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const stockRef = doc(db, 'stocks', id);
    await updateDoc(stockRef, { stock: newStock });
  } catch (error) {
    console.error('Error updating stock:', error);
  }
};

// --- Customers ---
export const getCustomers = async (): Promise<Customer[] | null> => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const customersRef = collection(db, 'customers');
    const querySnapshot = await getDocs(customersRef);
    const customers: Customer[] = [];
    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() } as Customer);
    });
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return null;
  }
};

export const saveCustomer = async (customer: Customer) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const customerRef = doc(db, 'customers', customer.id);
    await setDoc(customerRef, customer);
  } catch (error) {
    console.error('Error saving customer:', error);
  }
};

export const updateCustomerFromTransaction = async (name: string, phone: string, amount: number) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const customerId = phone || name; // Use phone as ID if available
    const customerRef = doc(db, 'customers', customerId);
    const customerDoc = await getDoc(customerRef);

    if (customerDoc.exists()) {
      const data = customerDoc.data();
      await updateDoc(customerRef, {
        totalOrders: (data.totalOrders || 0) + 1,
        totalSpent: (data.totalSpent || 0) + amount,
        lastOrder: serverTimestamp()
      });
    } else {
      await setDoc(customerRef, {
        id: customerId,
        name,
        phone,
        totalOrders: 1,
        totalSpent: amount,
        lastOrder: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
  }
};

// --- Users ---
export const getAllUsers = async (): Promise<UserProfile[] | null> => {
  const db = getFirebaseDB();
  if (!db) return null;

  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

export const updateUserRole = async (uid: string, role: UserRole) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
  }
};
// --- Orders ---
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
    console.error('Error fetching orders:', error);
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
    console.error('Error saving order:', error);
  }
};

export const updateOrderStatusFirebase = async (id: string, status: string) => {
  const db = getFirebaseDB();
  if (!db) return;

  try {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

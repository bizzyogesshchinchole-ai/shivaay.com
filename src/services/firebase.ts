import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Product,
  Category,
  Order,
  Review,
  Coupon,
  StoreSettings,
  GrainGuideArticle,
  CustomerUser,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_GRAIN_ARTICLES,
  INITIAL_CUSTOMERS,
} from '../data/initialData';

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
} else {
  app = getApp();
}

// Initialize Firestore with custom database ID
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Collection References
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  REVIEWS: 'reviews',
  COUPONS: 'coupons',
  SETTINGS: 'settings',
  ARTICLES: 'articles',
};

// Seeding utility to populate initial store data if database is brand new
export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      const batch = writeBatch(db);

      // Seed Products
      INITIAL_PRODUCTS.forEach((prod) => {
        const ref = doc(db, COLLECTIONS.PRODUCTS, prod.id);
        batch.set(ref, prod);
      });

      // Seed Categories
      INITIAL_CATEGORIES.forEach((cat) => {
        const ref = doc(db, COLLECTIONS.CATEGORIES, cat.id);
        batch.set(ref, cat);
      });

      // Seed Initial Orders
      INITIAL_ORDERS.forEach((ord) => {
        const ref = doc(db, COLLECTIONS.ORDERS, ord.id);
        batch.set(ref, ord);
      });

      // Seed Initial Customers
      INITIAL_CUSTOMERS.forEach((cust) => {
        const ref = doc(db, COLLECTIONS.CUSTOMERS, cust.id);
        batch.set(ref, cust);
      });

      // Seed Reviews
      INITIAL_REVIEWS.forEach((rev) => {
        const ref = doc(db, COLLECTIONS.REVIEWS, rev.id);
        batch.set(ref, rev);
      });

      // Seed Coupons
      INITIAL_COUPONS.forEach((coup) => {
        const ref = doc(db, COLLECTIONS.COUPONS, coup.code);
        batch.set(ref, coup);
      });

      // Seed Settings
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'store_settings');
      batch.set(settingsRef, INITIAL_STORE_SETTINGS);

      // Seed Articles
      INITIAL_GRAIN_ARTICLES.forEach((art) => {
        const ref = doc(db, COLLECTIONS.ARTICLES, art.id);
        batch.set(ref, art);
      });

      await batch.commit();
      return { success: true, message: 'Initial catalog & store data successfully seeded to Firestore.' };
    }
    return { success: true, message: 'Firestore already populated with existing catalog data.' };
  } catch (error: any) {
    console.warn('Firebase initial seed notice:', error?.message || error);
    return { success: false, message: error?.message || 'Failed to seed initial data' };
  }
}

// Real-Time Listeners
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.PRODUCTS));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Product[];
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Products sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.CATEGORIES));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Category[];
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Categories sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.ORDERS));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Order[];
        // Sort descending by date
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Orders sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToCustomers(
  onUpdate: (customers: CustomerUser[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.CUSTOMERS));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as CustomerUser[];
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Customers sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToReviews(
  onUpdate: (reviews: Review[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.REVIEWS));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as Review[];
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Reviews sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToCoupons(
  onUpdate: (coupons: Coupon[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.COUPONS));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          code: docSnap.id,
        })) as Coupon[];
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Coupons sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToSettings(
  onUpdate: (settings: StoreSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'store_settings');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as StoreSettings);
      }
    },
    (err) => {
      console.warn('Settings sync error:', err.message);
      if (onError) onError(err);
    }
  );
}

// Firestore Direct CRUD Operations

// Orders
export async function firestoreSaveOrder(order: Order): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.ORDERS, order.id);
    await setDoc(ref, order, { merge: true });
  } catch (e) {
    console.error('Error saving order to Firestore:', e);
  }
}

export async function firestoreUpdateOrderStatus(
  orderId: string,
  statusUpdates: Partial<Order>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(ref, statusUpdates);
  } catch (e) {
    console.error('Error updating order status in Firestore:', e);
  }
}

export async function firestoreDeleteOrder(orderId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.ORDERS, orderId);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting order from Firestore:', e);
  }
}

// Customers
export async function firestoreSaveCustomer(customer: CustomerUser): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.CUSTOMERS, customer.id);
    await setDoc(ref, customer, { merge: true });
  } catch (e) {
    console.error('Error saving customer to Firestore:', e);
  }
}

export async function firestoreUpdateCustomer(
  customerId: string,
  updates: Partial<CustomerUser>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.CUSTOMERS, customerId);
    await updateDoc(ref, updates);
  } catch (e) {
    console.error('Error updating customer in Firestore:', e);
  }
}

// Products
export async function firestoreSaveProduct(product: Product): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.PRODUCTS, product.id);
    await setDoc(ref, product, { merge: true });
  } catch (e) {
    console.error('Error saving product to Firestore:', e);
  }
}

export async function firestoreUpdateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.PRODUCTS, productId);
    await updateDoc(ref, updates);
  } catch (e) {
    console.error('Error updating product in Firestore:', e);
  }
}

export async function firestoreDeleteProduct(productId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting product from Firestore:', e);
  }
}

// Categories
export async function firestoreSaveCategory(category: Category): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.CATEGORIES, category.id);
    await setDoc(ref, category, { merge: true });
  } catch (e) {
    console.error('Error saving category to Firestore:', e);
  }
}

export async function firestoreDeleteCategory(categoryId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.CATEGORIES, categoryId);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting category from Firestore:', e);
  }
}

// Reviews
export async function firestoreSaveReview(review: Review): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.REVIEWS, review.id);
    await setDoc(ref, review, { merge: true });
  } catch (e) {
    console.error('Error saving review to Firestore:', e);
  }
}

export async function firestoreUpdateReview(
  reviewId: string,
  updates: Partial<Review>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.REVIEWS, reviewId);
    await updateDoc(ref, updates);
  } catch (e) {
    console.error('Error updating review in Firestore:', e);
  }
}

export async function firestoreDeleteReview(reviewId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.REVIEWS, reviewId);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting review from Firestore:', e);
  }
}

// Coupons
export async function firestoreSaveCoupon(coupon: Coupon): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.COUPONS, coupon.code);
    await setDoc(ref, coupon, { merge: true });
  } catch (e) {
    console.error('Error saving coupon to Firestore:', e);
  }
}

export async function firestoreDeleteCoupon(couponCode: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.COUPONS, couponCode);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting coupon from Firestore:', e);
  }
}

// Store Settings
export async function firestoreSaveSettings(settings: StoreSettings): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.SETTINGS, 'store_settings');
    await setDoc(ref, settings, { merge: true });
  } catch (e) {
    console.error('Error saving settings to Firestore:', e);
  }
}

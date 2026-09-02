import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Review,
  Coupon,
  StoreSettings,
  PackSizeOption,
  GrainGuideArticle,
  CategoryId,
  BannerAdSize,
  CustomerDetails,
  CustomerUser,
  SavedAddress,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_GRAIN_ARTICLES,
  INITIAL_BANNER_SIZES,
  INITIAL_CUSTOMERS,
} from '../data/initialData';
import {
  seedInitialFirestoreData,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToCustomers,
  subscribeToReviews,
  subscribeToCoupons,
  subscribeToSettings,
  firestoreSaveOrder,
  firestoreUpdateOrderStatus,
  firestoreDeleteOrder,
  firestoreSaveCustomer,
  firestoreUpdateCustomer,
  firestoreSaveProduct,
  firestoreUpdateProduct,
  firestoreDeleteProduct,
  firestoreSaveCategory,
  firestoreDeleteCategory,
  firestoreSaveReview,
  firestoreUpdateReview,
  firestoreDeleteReview,
  firestoreSaveCoupon,
  firestoreDeleteCoupon,
  firestoreSaveSettings,
} from '../services/firebase';

export type PageView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'about'
  | 'why-shivaay'
  | 'grain-guide'
  | 'article-detail'
  | 'contact'
  | 'policies'
  | 'admin'
  | 'banner-studio'
  | 'account';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Navigation & UI
  currentPage: PageView;
  currentView: PageView;
  navigateTo: (page: PageView, extra?: { productId?: string; categoryId?: CategoryId; articleId?: string; orderId?: string; policyTab?: string }) => void;
  selectedProductId: string | null;
  selectedArticleId: string | null;
  selectedCategoryId: CategoryId | null;
  selectedOrderId: string | null;
  activePolicyTab: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cloud Database & Sync
  isFirebaseConnected: boolean;
  isCloudSyncing: boolean;
  lastCloudSync: Date | null;
  cloudSyncError: string | null;
  forceSyncToCloud: () => Promise<void>;

  // Customer Account & Profile
  currentCustomer: CustomerUser | null;
  allCustomers: CustomerUser[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  customerLogin: (emailOrPhone: string, name?: string) => Promise<{ success: boolean; message: string; user?: CustomerUser }>;
  customerRegister: (data: { fullName: string; email: string; phone: string; dietaryPreferences?: string[] }) => Promise<{ success: boolean; message: string; user?: CustomerUser }>;
  customerLogout: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  addCustomerAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateCustomerAddress: (addressId: string, address: Partial<SavedAddress>) => void;
  deleteCustomerAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  getCustomerOrders: (customerOverride?: CustomerUser) => Order[];
  reorderPastOrder: (order: Order) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  grainArticles: GrainGuideArticle[];
  bannerSizes: BannerAdSize[];
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  addCategory: (category: Omit<Category, 'itemCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; message: string };
  addGrainArticle: (article: Omit<GrainGuideArticle, 'id'>) => void;
  updateGrainArticle: (id: string, updates: Partial<GrainGuideArticle>) => void;
  deleteGrainArticle: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, packSize: PackSizeOption, quantity?: number) => void;
  updateCartQuantity: (productId: string, sku: string, quantity: number) => void;
  removeFromCart: (productId: string, sku: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalWeightKg: number;
  cartItemCount: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;

  // Orders
  orders: Order[];
  lastCreatedOrder: Order | null;
  currentOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  placeOrder: (params: { customer: CustomerDetails; paymentMethod: any }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;

  // Reset & Helpers
  resetToDefaultData: () => void;
  generateWhatsAppLink: (customText?: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'shv_products_v2',
  CATEGORIES: 'shv_categories_v2',
  ARTICLES: 'shv_articles_v2',
  CART: 'shv_cart_v2',
  ORDERS: 'shv_orders_v2',
  REVIEWS: 'shv_reviews_v2',
  COUPONS: 'shv_coupons_v2',
  SETTINGS: 'shv_settings_v2',
  CUSTOMERS: 'shv_customers_v2',
  CURRENT_CUSTOMER: 'shv_current_customer_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activePolicyTab, setActivePolicyTab] = useState<string>('shipping');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Cloud Database Sync State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSync, setLastCloudSync] = useState<Date | null>(new Date());
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  // Customer Authentication & Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [allCustomers, setAllCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    return saved ? JSON.parse(saved) : null;
  });

  // Entities with Local Storage + Cloud persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [grainArticles, setGrainArticles] = useState<GrainGuideArticle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return saved ? JSON.parse(saved) : INITIAL_GRAIN_ARTICLES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(allCustomers));
  }, [allCustomers]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(grainArticles));
  }, [grainArticles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Real-time Cloud Synchronization with Firebase Firestore
  useEffect(() => {
    let unsubs: Array<() => void> = [];

    async function initFirebaseSync() {
      try {
        setIsCloudSyncing(true);
        // Step 1: Ensure initial seed data exists if database is new
        await seedInitialFirestoreData();

        // Step 2: Subscribe to real-time updates for each collection
        const unsubProducts = subscribeToProducts((cloudProds) => {
          if (cloudProds && cloudProds.length > 0) {
            setProducts(cloudProds);
            setLastCloudSync(new Date());
          }
        });

        const unsubCats = subscribeToCategories((cloudCats) => {
          if (cloudCats && cloudCats.length > 0) {
            setCategories(cloudCats);
            setLastCloudSync(new Date());
          }
        });

        const unsubOrders = subscribeToOrders((cloudOrders) => {
          if (cloudOrders && cloudOrders.length > 0) {
            setOrders(cloudOrders);
            setLastCloudSync(new Date());
          }
        });

        const unsubCusts = subscribeToCustomers((cloudCusts) => {
          if (cloudCusts && cloudCusts.length > 0) {
            setAllCustomers(cloudCusts);
            // If current customer is logged in, update currentCustomer object if modified in cloud
            setCurrentCustomer((prev) => {
              if (!prev) return null;
              const matched = cloudCusts.find((c) => c.id === prev.id);
              return matched || prev;
            });
            setLastCloudSync(new Date());
          }
        });

        const unsubReviews = subscribeToReviews((cloudRevs) => {
          if (cloudRevs && cloudRevs.length > 0) {
            setReviews(cloudRevs);
            setLastCloudSync(new Date());
          }
        });

        const unsubCoupons = subscribeToCoupons((cloudCoups) => {
          if (cloudCoups && cloudCoups.length > 0) {
            setCoupons(cloudCoups);
            setLastCloudSync(new Date());
          }
        });

        const unsubSettings = subscribeToSettings((cloudSettings) => {
          if (cloudSettings) {
            setSettings(cloudSettings);
            setLastCloudSync(new Date());
          }
        });

        unsubs = [
          unsubProducts,
          unsubCats,
          unsubOrders,
          unsubCusts,
          unsubReviews,
          unsubCoupons,
          unsubSettings,
        ];

        setIsFirebaseConnected(true);
        setIsCloudSyncing(false);
        setCloudSyncError(null);
      } catch (err: any) {
        console.warn('Firebase sync warning:', err);
        setIsFirebaseConnected(false);
        setIsCloudSyncing(false);
        setCloudSyncError(err?.message || 'Offline fallback active');
      }
    }

    initFirebaseSync();

    return () => {
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch (_) {}
      });
    };
  }, []);

  const forceSyncToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const res = await seedInitialFirestoreData();
      setLastCloudSync(new Date());
      setIsCloudSyncing(false);
      showToast(res.message || 'Firestore cloud synchronized!', 'success');
    } catch (e: any) {
      setIsCloudSyncing(false);
      showToast('Cloud sync error: ' + (e?.message || 'Unknown error'), 'error');
    }
  };

  // Scroll to top on page navigation
  const navigateTo = (
    page: PageView,
    extra?: { productId?: string; categoryId?: CategoryId; articleId?: string; orderId?: string; policyTab?: string }
  ) => {
    setCurrentPage(page);
    if (extra?.productId) setSelectedProductId(extra.productId);
    if (extra?.categoryId !== undefined) setSelectedCategoryId(extra.categoryId);
    if (extra?.articleId) setSelectedArticleId(extra.articleId);
    if (extra?.orderId) setSelectedOrderId(extra.orderId);
    if (extra?.policyTab) setActivePolicyTab(extra.policyTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Helpers
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Operations
  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `shv-prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [product, ...prev]);
    firestoreSaveProduct(product);
    showToast(`Added product "${product.name}" successfully!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    firestoreUpdateProduct(id, updates);
    showToast('Product updated successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    firestoreDeleteProduct(id);
    showToast('Product removed.', 'info');
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const newId = `shv-prod-${Date.now()}`;
    const duplicated: Product = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${original.sku}-CPY`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [duplicated, ...prev]);
    firestoreSaveProduct(duplicated);
    showToast(`Duplicated "${original.name}" as copy.`, 'success');
  };

  const toggleProductAvailability = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const updatedStatus = !prod.isAvailable;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: updatedStatus } : p))
    );
    firestoreUpdateProduct(id, { isAvailable: updatedStatus });
  };

  // Category Operations
  const addCategory = (catData: Omit<Category, 'itemCount'>) => {
    const id = catData.id || `cat-${Date.now()}`;
    const newCat: Category = {
      ...catData,
      id,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    firestoreSaveCategory(newCat);
    showToast(`Category "${newCat.name}" created!`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    const targetCat = categories.find((c) => c.id === id);
    if (targetCat) {
      firestoreSaveCategory({ ...targetCat, ...updates });
    }
    showToast('Category updated successfully.', 'success');
  };

  const deleteCategory = (id: string): { success: boolean; message: string } => {
    const linkedProducts = products.filter((p) => p.category === id);
    if (linkedProducts.length > 0) {
      showToast(`Cannot delete category with ${linkedProducts.length} linked products. Please reassign them first.`, 'warning');
      return { success: false, message: `Has ${linkedProducts.length} linked products` };
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    firestoreDeleteCategory(id);
    showToast('Category deleted.', 'info');
    return { success: true, message: 'Category deleted' };
  };

  // Grain Article Operations
  const addGrainArticle = (articleData: Omit<GrainGuideArticle, 'id'>) => {
    const id = `art-${Date.now()}`;
    const newArticle: GrainGuideArticle = {
      ...articleData,
      id,
    };
    setGrainArticles((prev) => [newArticle, ...prev]);
    showToast(`Article "${newArticle.title}" published!`, 'success');
  };

  const updateGrainArticle = (id: string, updates: Partial<GrainGuideArticle>) => {
    setGrainArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Article updated.', 'success');
  };

  const deleteGrainArticle = (id: string) => {
    setGrainArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Article removed from grain guide.', 'info');
  };

  // Cart Operations
  const addToCart = (product: Product, packSize: PackSizeOption, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedPackSize.sku === packSize.sku
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * packSize.price,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          productImage: product.images[0] || '',
          category: product.category,
          selectedPackSize: packSize,
          unitPrice: packSize.price,
          quantity,
          totalPrice: packSize.price * quantity,
          preparationTimeDays: product.preparationTimeDays || 1,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${packSize.size}) to cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sku);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedPackSize.sku === sku) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, sku: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedPackSize.sku === sku)
      )
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalWeightKg = cart.reduce(
    (sum, item) => sum + (item.selectedPackSize.weightInKg || 1) * item.quantity,
    0
  );

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 599;
  const standardDeliveryCharge = settings.standardDeliveryCharge || 50;

  const deliveryCharge =
    cartSubtotal >= freeDeliveryThreshold || cartSubtotal === 0 ? 0 : standardDeliveryCharge;

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  // Coupon Operations
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount for ${found.code} is ₹${found.minOrderAmount}. Add ₹${found.minOrderAmount - cartSubtotal} more.`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    firestoreSaveCoupon(coupon);
    showToast(`Coupon "${coupon.code}" created.`, 'success');
  };

  const updateCoupon = (code: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, ...updates } : c))
    );
    const targetCoup = coupons.find((c) => c.code === code);
    if (targetCoup) {
      firestoreSaveCoupon({ ...targetCoup, ...updates });
    }
    showToast('Coupon updated.', 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    firestoreDeleteCoupon(code);
    showToast('Coupon deleted.', 'info');
  };

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (cartSubtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Customer Account Operations
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const customerLogin = async (
    emailOrPhone: string,
    name?: string
  ): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const existing = allCustomers.find(
      (c) =>
        c.email.toLowerCase() === cleanQuery ||
        c.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (existing) {
      const updatedUser: CustomerUser = {
        ...existing,
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentCustomer(updatedUser);
      setAllCustomers((prev) =>
        prev.map((u) => (u.id === existing.id ? updatedUser : u))
      );
      firestoreSaveCustomer(updatedUser);
      showToast(`Welcome back, ${existing.fullName}!`, 'success');
      return { success: true, message: 'Logged in successfully.', user: updatedUser };
    }

    if (name) {
      const isEmail = emailOrPhone.includes('@');
      const newUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        fullName: name,
        email: isEmail ? emailOrPhone : `${emailOrPhone.replace(/[^0-9]/g, '')}@customer.shivaayagri.com`,
        phone: isEmail ? '9876500000' : emailOrPhone,
        loyaltyTier: 'Grain Club Explorer',
        totalGrainMilledKg: 0,
        dietaryPreferences: ['Stone-Ground Whole Grain'],
        addresses: [],
        createdAt: new Date().toISOString().split('T')[0],
        lastLoginAt: new Date().toISOString(),
      };

      setAllCustomers((prev) => [newUser, ...prev]);
      setCurrentCustomer(newUser);
      firestoreSaveCustomer(newUser);
      showToast(`Welcome to Shivaay Fresh Grains, ${newUser.fullName}!`, 'success');
      return { success: true, message: 'Account created and logged in.', user: newUser };
    }

    return { success: false, message: 'No registered customer found with this email or phone.' };
  };

  const customerRegister = async (data: {
    fullName: string;
    email: string;
    phone: string;
    dietaryPreferences?: string[] ;
  }): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = allCustomers.find(
      (c) => c.email.toLowerCase() === cleanEmail || c.phone === data.phone
    );

    if (existing) {
      return {
        success: false,
        message: 'An account with this email or phone number already exists.',
      };
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      loyaltyTier: 'Grain Club Explorer',
      totalGrainMilledKg: 0,
      dietaryPreferences: data.dietaryPreferences || ['Stone-Ground Whole Grain'],
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: new Date().toISOString(),
    };

    setAllCustomers((prev) => [newUser, ...prev]);
    setCurrentCustomer(newUser);
    firestoreSaveCustomer(newUser);
    showToast(`Welcome to Shivaay Fresh Grains, ${newUser.fullName}!`, 'success');
    return { success: true, message: 'Registration successful.', user: newUser };
  };

  const customerLogout = () => {
    setCurrentCustomer(null);
    showToast('You have been logged out safely.', 'info');
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    if (!currentCustomer) return;

    const updatedUser = { ...currentCustomer, ...updates };
    setCurrentCustomer(updatedUser);
    setAllCustomers((prev) =>
      prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
    );
    firestoreUpdateCustomer(currentCustomer.id, updates);
    showToast('Customer profile updated in cloud.', 'success');
  };

  const addCustomerAddress = (addressData: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newAddress: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    if (currentCustomer) {
      const addresses = currentCustomer.addresses || [];
      const updatedAddresses = addressData.isDefault
        ? addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : [...addresses, newAddress];

      const updatedUser = { ...currentCustomer, addresses: updatedAddresses };
      setCurrentCustomer(updatedUser);
      setAllCustomers((prev) =>
        prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
      );
      firestoreUpdateCustomer(currentCustomer.id, { addresses: updatedAddresses });
    }

    showToast(`Address "${newAddress.label}" saved.`, 'success');
    return newAddress;
  };

  const updateCustomerAddress = (addressId: string, updates: Partial<SavedAddress>) => {
    if (!currentCustomer) return;

    let updatedAddresses = (currentCustomer.addresses || []).map((addr) => {
      if (addr.id === addressId) {
        return { ...addr, ...updates };
      }
      if (updates.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    const updatedUser = { ...currentCustomer, addresses: updatedAddresses };
    setCurrentCustomer(updatedUser);
    setAllCustomers((prev) =>
      prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
    );
    firestoreUpdateCustomer(currentCustomer.id, { addresses: updatedAddresses });
    showToast('Delivery address updated.', 'success');
  };

  const deleteCustomerAddress = (addressId: string) => {
    if (!currentCustomer) return;

    const updatedAddresses = (currentCustomer.addresses || []).filter(
      (a) => a.id !== addressId
    );
    const updatedUser = { ...currentCustomer, addresses: updatedAddresses };
    setCurrentCustomer(updatedUser);
    setAllCustomers((prev) =>
      prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
    );
    firestoreUpdateCustomer(currentCustomer.id, { addresses: updatedAddresses });
    showToast('Address removed.', 'info');
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentCustomer) return;

    const updatedAddresses = (currentCustomer.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const updatedUser = { ...currentCustomer, addresses: updatedAddresses };
    setCurrentCustomer(updatedUser);
    setAllCustomers((prev) =>
      prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
    );
    firestoreUpdateCustomer(currentCustomer.id, { addresses: updatedAddresses });
    showToast('Default delivery address changed.', 'success');
  };

  const getCustomerOrders = (customerOverride?: CustomerUser): Order[] => {
    const targetUser = customerOverride || currentCustomer;
    if (!targetUser) return [];

    const cleanEmail = targetUser.email.toLowerCase();
    const cleanPhone = targetUser.phone.replace(/[^0-9]/g, '');

    return orders.filter((ord) => {
      if (ord.customerId === targetUser.id || ord.customer.customerId === targetUser.id) {
        return true;
      }
      if (ord.customer.email && ord.customer.email.toLowerCase() === cleanEmail) {
        return true;
      }
      if (
        cleanPhone.length >= 8 &&
        ord.customer.phone &&
        ord.customer.phone.replace(/[^0-9]/g, '').includes(cleanPhone)
      ) {
        return true;
      }
      return false;
    });
  };

  const reorderPastOrder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const matchedPack =
          prod.packSizes.find((ps) => ps.size === item.packSize) || prod.packSizes[0];
        addToCart(prod, matchedPack, item.quantity);
        count++;
      }
    });

    if (count > 0) {
      showToast(`Added ${count} fresh flour item(s) from #${order.orderNumber} to cart!`, 'success');
      setIsCartOpen(true);
    } else {
      showToast('Products in this past order are currently not available.', 'warning');
    }
  };

  // Order Operations
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>
  ): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SHV-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Received',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();

    // Persist immediately to Firebase Firestore
    firestoreSaveOrder(newOrder);

    return newOrder;
  };

  const placeOrder = ({ customer, paymentMethod }: { customer: CustomerDetails; paymentMethod: any }): Order => {
    const totalAmount = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);
    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + 3);

    const newOrder = createOrder({
      customerId: currentCustomer?.id,
      customer: {
        fullName: customer.fullName,
        email: customer.email || currentCustomer?.email || 'customer@example.com',
        phone: customer.phone,
        customerId: currentCustomer?.id,
      },
      deliveryAddress: {
        streetAddress: customer.addressLine1,
        areaLocality: customer.addressLine2 || '',
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        landmark: customer.landmark,
        orderNotes: customer.specialInstructions,
      },
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        packSize: item.selectedPackSize.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        productImage: item.productImage,
      })),
      subtotal: cartSubtotal,
      deliveryCharge,
      discountAmount,
      couponCode: appliedCoupon?.code,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cash_on_delivery' : 'paid',
      estimatedDeliveryDate: estDelivery.toISOString().split('T')[0],
      status: 'Received',
    });

    // If user is logged in, accumulate grain weight and loyalty tier
    if (currentCustomer) {
      const orderWeightKg = cart.reduce(
        (sum, item) => sum + (item.selectedPackSize.weightInKg || 1) * item.quantity,
        0
      );
      const updatedTotalKg = (currentCustomer.totalGrainMilledKg || 0) + orderWeightKg;
      let newTier: 'Grain Club Explorer' | 'Silver Harvest' | 'Gold Master Miller' = 'Grain Club Explorer';
      if (updatedTotalKg >= 25) newTier = 'Gold Master Miller';
      else if (updatedTotalKg >= 10) newTier = 'Silver Harvest';

      const updatedUser: CustomerUser = {
        ...currentCustomer,
        totalGrainMilledKg: Number(updatedTotalKg.toFixed(1)),
        loyaltyTier: newTier,
      };

      // Also auto-save address if customer doesn't have it saved
      const hasMatchingAddr = (currentCustomer.addresses || []).some(
        (a) =>
          a.addressLine1.toLowerCase() === customer.addressLine1.toLowerCase() &&
          a.pincode === customer.pincode
      );

      if (!hasMatchingAddr) {
        const autoAddr: SavedAddress = {
          id: `addr-${Date.now()}`,
          label: (currentCustomer.addresses || []).length === 0 ? 'Home' : 'Recent Delivery',
          fullName: customer.fullName,
          phone: customer.phone,
          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2,
          landmark: customer.landmark,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          isDefault: (currentCustomer.addresses || []).length === 0,
        };
        updatedUser.addresses = [...(currentCustomer.addresses || []), autoAddr];
      }

      setCurrentCustomer(updatedUser);
      setAllCustomers((prev) =>
        prev.map((u) => (u.id === currentCustomer.id ? updatedUser : u))
      );
      firestoreSaveCustomer(updatedUser);
    }

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    notes?: string
  ) => {
    let updatedFields: Partial<Order> = { status };
    if (trackingNumber) updatedFields.trackingNumber = trackingNumber;
    if (notes) updatedFields.adminNotes = notes;

    const ord = orders.find((o) => o.id === orderId);
    if (status === 'Preparing' && ord && !ord.preparationStartedAt) {
      updatedFields.preparationStartedAt = new Date().toISOString();
    }
    if (status === 'Dispatched' && ord && !ord.dispatchedAt) {
      updatedFields.dispatchedAt = new Date().toISOString();
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedFields } : o))
    );
    firestoreUpdateOrderStatus(orderId, updatedFields);
    showToast(`Order status updated to "${status}" and synced to cloud.`, 'success');
  };

  const getOrderById = (id: string) => orders.find((o) => o.id === id);
  const getOrderByNumber = (num: string) =>
    orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === num.trim().toLowerCase() ||
        o.id.toLowerCase() === num.trim().toLowerCase()
    );

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    firestoreDeleteOrder(id);
    showToast('Order record removed.', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => {
    const id = `rev-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      isApproved: true, // Auto-approved for smooth demonstration
    };
    setReviews((prev) => [newReview, ...prev]);
    firestoreSaveReview(newReview);
    showToast('Thank you for sharing your feedback!', 'success');
  };

  const approveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
    );
    firestoreUpdateReview(id, { isApproved: true });
    showToast('Review approved.', 'success');
  };

  const rejectReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    firestoreDeleteReview(id);
    showToast('Review deleted.', 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    firestoreDeleteReview(id);
    showToast('Review removed.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    firestoreSaveSettings(updated);
    showToast('Store settings updated and synced to cloud.', 'success');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setGrainArticles(INITIAL_GRAIN_ARTICLES);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setSettings(INITIAL_STORE_SETTINGS);
    localStorage.clear();
    showToast('Store reset to clean demo data.', 'info');
  };

  // WhatsApp Link Helper
  const generateWhatsAppLink = (customText?: string) => {
    const rawNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const phone = rawNumber || '919876543210';
    const text =
      customText ||
      `Hello ${settings.brandName}, I would like to enquire about your freshly prepared flour products.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        currentView: currentPage,
        navigateTo,
        selectedProductId,
        selectedArticleId,
        selectedCategoryId,
        selectedOrderId,
        activePolicyTab,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        // Cloud Sync
        isFirebaseConnected,
        isCloudSyncing,
        lastCloudSync,
        cloudSyncError,
        forceSyncToCloud,
        // Customer Account
        currentCustomer,
        allCustomers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        getCustomerOrders,
        reorderPastOrder,
        // Catalog
        products,
        categories,
        grainArticles,
        bannerSizes: INITIAL_BANNER_SIZES,
        getProductById,
        getProductBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        addGrainArticle,
        updateGrainArticle,
        deleteGrainArticle,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalWeightKg,
        cartItemCount,
        deliveryCharge,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        coupons,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        orders,
        lastCreatedOrder,
        currentOrder: lastCreatedOrder,
        createOrder,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        getOrderByNumber,
        reviews,
        addReview,
        approveReview,
        rejectReview,
        deleteReview,
        settings,
        updateSettings,
        toasts,
        showToast,
        addToast: (type, message) => showToast(message, type),
        removeToast,
        resetToDefaultData,
        generateWhatsAppLink,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

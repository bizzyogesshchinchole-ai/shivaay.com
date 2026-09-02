import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { authService } from '../../services/authService';
import { AdminLoginGate } from './AdminLoginGate';
import { ProductManagement } from './ProductManagement';
import { CategoryManagement } from './CategoryManagement';
import { OrderManagement } from './OrderManagement';
import { ArticleManagement } from './ArticleManagement';
import { CouponManagement } from './CouponManagement';
import { ReviewManagement } from './ReviewManagement';
import { SettingsManagement } from './SettingsManagement';
import { SecurityManagement } from './SecurityManagement';
import { CloudDatabaseManagement } from './CloudDatabaseManagement';
import {
  Package,
  Layers,
  ShoppingBag,
  BookOpen,
  Tag,
  MessageSquare,
  Settings,
  Sparkles,
  ExternalLink,
  Store,
  ArrowLeft,
  ShieldCheck,
  Lock,
  LogOut,
  Clock,
  AlertTriangle,
  Database,
} from 'lucide-react';

type AdminTab =
  | 'products'
  | 'categories'
  | 'orders'
  | 'articles'
  | 'coupons'
  | 'reviews'
  | 'database'
  | 'settings'
  | 'security';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const INACTIVITY_WARN_MS = 14 * 60 * 1000; // 14 minutes

export const AdminPage: React.FC = () => {
  const {
    products,
    categories,
    orders,
    grainArticles,
    coupons,
    reviews,
    settings,
    navigateTo,
    addToast,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(60);

  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<any>(null);

  // Check existing session token on mount
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const valid = await authService.verifySession();
      if (isMounted) {
        setIsAuthenticated(valid);
      }
    };
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Inactivity auto-lock handler
  const handleUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showInactivityWarning) {
      setShowInactivityWarning(false);
      setInactivityCountdown(60);
    }
  }, [showInactivityWarning]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Attach user activity listeners
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Inactivity ticker
    inactivityTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        // Trigger auto lock
        authService.logout();
        setIsAuthenticated(false);
        setShowInactivityWarning(false);
        addToast('warning', 'Admin panel locked due to 15 minutes of inactivity.');
      } else if (elapsed >= INACTIVITY_WARN_MS) {
        setShowInactivityWarning(true);
        setInactivityCountdown(Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
      } else {
        if (showInactivityWarning) {
          setShowInactivityWarning(false);
        }
      }
    }, 1000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [isAuthenticated, handleUserActivity, showInactivityWarning, addToast]);

  const handleInstantLock = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    addToast('info', 'Admin panel locked securely.');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Verifying Cryptographic Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginGate
        onAuthenticated={() => {
          setIsAuthenticated(true);
          lastActivityRef.current = Date.now();
          addToast('success', 'Admin authenticated securely.');
        }}
        onReturnToStore={() => navigateTo('home')}
      />
    );
  }

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Preparing'
  ).length;

  const tabs: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }[] = [
    {
      id: 'products',
      label: 'Products & Flours',
      icon: <Package className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Layers className="w-4 h-4" />,
      badge: categories.length,
    },
    {
      id: 'orders',
      label: 'Orders & Milling',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Active` : orders.length,
    },
    {
      id: 'articles',
      label: 'Grain Guide & Blog',
      icon: <BookOpen className="w-4 h-4" />,
      badge: grainArticles.length,
    },
    {
      id: 'coupons',
      label: 'Coupons & Promos',
      icon: <Tag className="w-4 h-4" />,
      badge: coupons.length,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: reviews.length,
    },
    {
      id: 'database',
      label: 'Cloud Database (Firestore)',
      icon: <Database className="w-4 h-4 text-emerald-600" />,
      badge: 'Live',
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'security',
      label: 'Security & Access',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Inactivity Warning Modal */}
      {showInactivityWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl border border-amber-500/50 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Inactivity Lock Pending</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Admin session will lock in <span className="font-mono font-bold text-amber-400">{inactivityCountdown}s</span> to protect store data.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleUserActivity}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
            >
              Keep Session Active
            </button>
          </div>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Return to Customer Storefront"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <div className="h-5 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-xs">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-slate-900 leading-tight">
                      {settings.brandName} Admin Panel
                    </h1>
                    <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Encrypted Session</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Store Operations & Flour Catalog Management
                  </p>
                </div>
              </div>
            </div>

            {/* Quick shortcuts: Banner Ad Generator, Live Store & Lock Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('banner-generator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Banner Studio</span>
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
              >
                <Store className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Live Store</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {/* Instant Screen Lock / Panic Button */}
              <button
                onClick={handleInstantLock}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-900 hover:border-rose-800 text-white text-xs font-semibold shadow-xs transition-all group"
                title="Lock Admin Panel Now"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                <span>Lock Panel</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-t border-slate-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'articles' && <ArticleManagement />}
        {activeTab === 'coupons' && <CouponManagement />}
        {activeTab === 'reviews' && <ReviewManagement />}
        {activeTab === 'database' && <CloudDatabaseManagement />}
        {activeTab === 'settings' && <SettingsManagement />}
        {activeTab === 'security' && <SecurityManagement />}
      </main>
    </div>
  );
};

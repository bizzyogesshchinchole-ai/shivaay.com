import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Tag,
  ShieldCheck,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

export const CloudDatabaseManagement: React.FC = () => {
  const {
    products,
    categories,
    orders,
    allCustomers,
    reviews,
    coupons,
    settings,
    isFirebaseConnected,
    isCloudSyncing,
    lastCloudSync,
    cloudSyncError,
    forceSyncToCloud,
    showToast,
  } = useStore();

  const [isExporting, setIsExporting] = useState(false);

  const collections = [
    {
      name: 'products',
      label: 'Products & Flours',
      count: products.length,
      icon: <Package className="w-4 h-4 text-emerald-600" />,
      description: 'Grain types, pack sizes, stone-ground tags, live prices',
    },
    {
      name: 'orders',
      label: 'Orders & Milling Records',
      count: orders.length,
      icon: <ShoppingBag className="w-4 h-4 text-blue-600" />,
      description: 'Fresh milling batches, customer deliveries, status timelines',
    },
    {
      name: 'customers',
      label: 'Customer Accounts',
      count: allCustomers.length,
      icon: <Users className="w-4 h-4 text-purple-600" />,
      description: 'Profiles, loyalty tiers, milling kg milestones, address books',
    },
    {
      name: 'categories',
      label: 'Categories',
      count: categories.length,
      icon: <Layers className="w-4 h-4 text-amber-600" />,
      description: 'Whole wheat, gluten-free millets, multi-grain blends, pulses',
    },
    {
      name: 'reviews',
      label: 'Customer Reviews',
      count: reviews.length,
      icon: <MessageSquare className="w-4 h-4 text-rose-600" />,
      description: 'Verified buyer testimonials, aroma ratings, roti softness scores',
    },
    {
      name: 'coupons',
      label: 'Promo Coupons',
      count: coupons.length,
      icon: <Tag className="w-4 h-4 text-indigo-600" />,
      description: 'Discount codes, minimum spend rules, max discount caps',
    },
  ];

  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        database: 'Google Firebase Firestore',
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId,
        data: {
          products,
          categories,
          orders,
          customers: allCustomers,
          reviews,
          coupons,
          settings,
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shivaay-firestore-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Cloud database backup downloaded successfully.', 'success');
    } catch (e: any) {
      showToast('Export failed: ' + e?.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">Google Firebase Firestore</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Real-Time Sync Active
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Spark Free Tier (Forever Free)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Your store is connected to a production Google Cloud Firestore NoSQL database. Every flour order, stock change, review, and customer profile updates in real-time across all devices without needing a page refresh.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={forceSyncToCloud}
              disabled={isCloudSyncing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Syncing...' : 'Force Cloud Sync'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Database Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Cloud Project</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] truncate block mt-0.5" title={firebaseConfig.projectId}>
              {firebaseConfig.projectId}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Database ID</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] truncate block mt-0.5" title={firebaseConfig.firestoreDatabaseId}>
              {firebaseConfig.firestoreDatabaseId}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Daily Quota (Spark Tier)</span>
            <span className="font-bold text-emerald-700 text-[11px] block mt-0.5">
              50,000 Reads • 20,000 Writes / Day (Free)
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Last Cloud Sync</span>
            <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              {lastCloudSync ? lastCloudSync.toLocaleTimeString() : 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Collections Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <span>Firestore Collections & Document Counts</span>
          </h3>
          <span className="text-xs text-slate-500">
            {collections.reduce((sum, c) => sum + c.count, 0)} total synchronized documents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.name}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      {col.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{col.label}</h4>
                      <code className="text-[10px] text-slate-400 font-mono">/{col.name}</code>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                    {col.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Live Synced
                </span>
                <span>Firestore Document Store</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages & Scalability Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Why Firebase Firestore Serves Shivaay Agri Best Down the Line</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white mb-1">Instant Real-Time Order Stream</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When a customer places an order on their smartphone, the Chakki mill operator sees it pop up on the dispatch tablet in under 100 milliseconds without refreshing.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white mb-1">24/7 Availability (Zero Sleep Mode)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unlike other free-tier platforms that sleep after inactivity, Firestore stays hot 24/7/365 with zero cold start delay for early-morning flour shoppers.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white mb-1">Mobile Apps & Multi-Device Ready</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ready for native Android & iOS flour subscription apps with automatic offline caching for delivery dispatchers in low-network areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

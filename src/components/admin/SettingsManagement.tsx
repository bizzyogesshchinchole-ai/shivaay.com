import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';
import {
  Settings,
  Store,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  Megaphone,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      freeDeliveryThreshold: Number(formData.freeDeliveryThreshold) || 999,
      standardDeliveryCharge: Number(formData.standardDeliveryCharge) || 60,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <span>Store Configuration & Operations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage contact channels, delivery rules, FSSAI regulatory info, and announcements.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Store className="w-4 h-4 text-slate-600" /> Brand Identity & Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand / Store Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Order Number</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physical Mill / Store Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={formData.fssaiLicense}
                onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Truck className="w-4 h-4 text-slate-600" /> Delivery Charges & Shipping Policy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Orders with subtotal equal or exceeding this amount receive free delivery.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={formData.standardDeliveryCharge}
                onChange={(e) => setFormData({ ...formData, standardDeliveryCharge: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Applied when order subtotal is below the free delivery threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Announcement Bar & Store Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Megaphone className="w-4 h-4 text-slate-600" /> Top Announcement Bar & Store Acceptance
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Announcement Message</label>
            <input
              type="text"
              value={formData.announcementBarText}
              onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                className="rounded text-slate-900 focus:ring-slate-900"
              />
              <div>
                <p className="font-bold text-slate-900">Show Announcement Bar</p>
                <p className="text-[10px] text-slate-500">Display the top banner to all visiting customers</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAcceptingOrders}
                onChange={(e) => setFormData({ ...formData, isAcceptingOrders: e.target.checked })}
                className="rounded text-slate-900 focus:ring-slate-900"
              />
              <div>
                <p className="font-bold text-slate-900">Accept Fresh Orders</p>
                <p className="text-[10px] text-slate-500">Keep checkout active for customers</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security & Access Protection Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Administrator Access & Data Protection</h3>
                <p className="text-[11px] text-slate-400">PBKDF2-SHA512 salt hashing, constant-time validation & brute-force rate limiter active.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold self-start sm:self-auto">
              ENCRYPTED & PROTECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-300">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Session Cryptography:</span>
              <span className="font-bold font-mono text-emerald-400">HMAC-SHA256 Signed</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Anti Brute-Force:</span>
              <span className="font-bold font-mono text-white">5 Attempts / 15m Lockout</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Inactivity Protection:</span>
              <span className="font-bold font-mono text-white">15m Auto-Lock</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm text-xs transition-all"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>

      {/* Reset Data Confirmation */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Store Data?</h3>
            <p className="text-slate-600">
              This will restore all default flour products, categories, guide articles, sample orders, and reviews. Any custom additions will be reset.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaultData();
                  setFormData({ ...settings });
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

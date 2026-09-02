import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { activePolicyTab, settings, navigateTo } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 text-xs text-slate-700">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Store Policies & Freshness Standards</h1>
        <p className="text-slate-500">
          Our uncompromised commitment to quality grains, transparent milling dates, and customer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping & Milling Policy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Fresh Milling & Shipping</h3>
          <p className="text-slate-600 leading-relaxed">
            We never warehouse pre-milled flour. Every order is stone-ground within 24 hours of placement. Standard transit takes 2-4 business days via express courier.
          </p>
          <ul className="space-y-1.5 text-slate-500 pt-2 border-t border-slate-100">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Free delivery on orders ≥ ₹{settings.freeDeliveryThreshold}
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Standard charge ₹{settings.standardDeliveryCharge}
            </li>
          </ul>
        </div>

        {/* Freshness & Quality Promise */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">100% Purity Guarantee</h3>
          <p className="text-slate-600 leading-relaxed">
            Zero bleaching agents, zero artificial preservatives, zero maida adulteration. 100% whole grain with natural bran, endosperm, and germ intact.
          </p>
          <ul className="space-y-1.5 text-slate-500 pt-2 border-t border-slate-100">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> FSSAI Lic. #{settings.fssaiLicense}
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Slow cold stone-grinding
            </li>
          </ul>
        </div>

        {/* Returns & Replacement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
            <RotateCcw className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Replacement Policy</h3>
          <p className="text-slate-600 leading-relaxed">
            As freshly ground perishable food items, we cannot accept opened bag returns. However, if transit damage or defective packaging occurs, we promptly re-mill and ship a fresh batch for free.
          </p>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigateTo('contact')}
              className="text-xs font-bold text-slate-900 hover:underline"
            >
              Contact Support for Help →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

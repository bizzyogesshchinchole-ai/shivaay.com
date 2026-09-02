import React from 'react';
import { useStore } from '../../context/StoreContext';
import { WhyShivaaySection } from '../home/WhyShivaaySection';
import { FreshnessModelSection } from '../home/FreshnessModelSection';
import { TrustHighlights } from '../home/TrustHighlights';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const WhyShivaayPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div>
      {/* Top Hero */}
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            The Fresh Milling Revolution
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Why Shivaay Agri Products?
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Commercial flours sit on warehouse shelves for months with stripped wheat germ and chemical preservatives. We stone grind your heritage grains only after your order is placed.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Explore Freshly Milled Flours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <WhyShivaaySection />
      <FreshnessModelSection />
      <TrustHighlights />
    </div>
  );
};

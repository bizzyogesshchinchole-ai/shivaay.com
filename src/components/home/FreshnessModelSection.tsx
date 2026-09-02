import React from 'react';
import { Clock, ShieldCheck, Check, X, ArrowRight, Wheat, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FreshnessModelSection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="py-16 bg-[#F5EFE6] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE0CD] text-[#784712] text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>The Made-On-Order Advantage</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] leading-tight">
              Freshness Starts With <span className="text-[#9A5C1B] italic">Your Order</span>.
            </h2>

            <p className="text-sm sm:text-base text-[#5C4D3C] leading-relaxed">
              At <strong>Shivaay Agri Products</strong>, our flour products are prepared and packed against customer orders. This helps us focus on delivering a fresher product experience instead of keeping large quantities of finished flour sitting in warehouse inventory for months.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#E6DEC9] shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2C241D]">
                    Natural Grain Oils & Aromatic Sweetness Retained
                  </h4>
                  <p className="text-xs text-[#7A6A58] mt-0.5">
                    Whole grain oils in wheat germ and millets like Bajra and Ragi oxidize quickly when pre-ground. Milling on demand prevents rancidity and guarantees natural sweetness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#E6DEC9] shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2C241D]">
                    Zero Chemical Bleach or Chemical Anti-Caking Agents
                  </h4>
                  <p className="text-xs text-[#7A6A58] mt-0.5">
                    Industrial flours use chemical conditioners for multi-month shelf life. Our fresh-on-order promise lets you enjoy 100% natural, unadulterated flour.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-3 rounded-xl bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Order Fresh Milled Flour Today</span>
                <ArrowRight className="w-4 h-4 text-[#E2B167]" />
              </button>
            </div>
          </div>

          {/* Right Comparison Visual Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-lg">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C241D] mb-6 text-center">
              Fresh On Order vs. Supermarket Shelf Flour
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shivaay Model */}
              <div className="p-5 rounded-2xl bg-[#F7FAF4] border-2 border-[#81C784]/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full uppercase">
                      Shivaay Agri
                    </span>
                    <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1B5E20] mb-2">
                    Prepared on Customer Order
                  </h4>
                  <ul className="space-y-2 text-xs text-[#2E4822]">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span><strong>0–2 Days</strong> from Milling</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Intact grain germ & bran</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Rich nutty aroma & soft rotis</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Pure whole grains, no fillers</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C8E6C9] text-[11px] font-bold text-[#2E7D32] text-center">
                  🌱 Max Freshness & Natural Nutrition
                </div>
              </div>

              {/* Ordinary Shelf Flour */}
              <div className="p-5 rounded-2xl bg-[#FFF8F8] border border-[#FFCDD2] flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#C62828] bg-[#FFEBEE] px-2.5 py-1 rounded-full uppercase">
                      Warehouse Stock
                    </span>
                    <Clock className="w-4 h-4 text-[#C62828]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#8C1B1B] mb-2">
                    Mass Factory Inventory
                  </h4>
                  <ul className="space-y-2 text-xs text-[#6B2A2A]">
                    <li className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                      <span><strong>60–120 Days</strong> on shelves</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                      <span>Germ often stripped away</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                      <span>Loss of fresh grain aroma</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                      <span>Chemical anti-caking additives</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#FFCDD2] text-[11px] font-bold text-[#C62828] text-center">
                  ⚠️ Oxidized oils & dull texture
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

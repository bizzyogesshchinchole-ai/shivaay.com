import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Layers, CheckCircle2, ArrowRight, Sparkles, Wheat } from 'lucide-react';

export const MultigrainSpotlight: React.FC = () => {
  const { navigateTo, products } = useStore();
  const multigrainProd = products.find((p) => p.category === 'multigrain') || products[0];

  const [activeGrainIndex, setActiveGrainIndex] = useState(0);

  const grains = multigrainProd.ingredients.length > 0 ? multigrainProd.ingredients : [
    { name: 'MP Sharbati Whole Wheat', percentage: 55, benefit: 'Provides natural gluten elasticity for soft rolling rotis' },
    { name: 'Jowar (Sorghum)', percentage: 12, benefit: 'Light on stomach, gentle digestion' },
    { name: 'Ragi (Finger Millet)', percentage: 10, benefit: 'Rich natural calcium and plant fiber' },
    { name: 'Bajra (Pearl Millet)', percentage: 8, benefit: 'Provides iron and mineral balance' },
    { name: 'Barley (Jau)', percentage: 6, benefit: 'High in beta-glucan soluble fiber' },
    { name: 'Roasted Chana', percentage: 6, benefit: 'Adds natural roasted nutty taste and protein' },
    { name: 'Flax Seeds (Alsi)', percentage: 3, benefit: 'Omega-3 fatty acids and natural essential oils' },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#3B2A1A] to-[#241B12] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl overflow-hidden relative">
          {/* Decorative grain backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E2B167]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & Explanation */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2B167]/20 border border-[#E2B167]/40 text-[#E2B167] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multigrain Spotlight</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                What&apos;s Inside Your <span className="text-[#E2B167] italic font-serif">Multigrain Flour</span>?
              </h2>

              <p className="text-xs sm:text-sm text-[#D4C5B5] leading-relaxed">
                Most commercial multigrain brands add token sprinkles of millets into refined flour. At <strong>Shivaay Agri Products</strong>, our signature 7-Grain flour uses a scientifically balanced ratio of 55% Sharbati wheat with 45% nutrient-rich millets, barley, roasted chana, and flax seeds.
              </p>

              {/* Composition Progress Visual */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#E2B167]">
                  <span>Balanced Whole Grain Ratio</span>
                  <span>100% Whole & Unrefined</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex">
                  <div style={{ width: '55%' }} className="h-full bg-[#E2B167]" title="Sharbati Wheat 55%"></div>
                  <div style={{ width: '12%' }} className="h-full bg-[#9CCC65]" title="Jowar 12%"></div>
                  <div style={{ width: '10%' }} className="h-full bg-[#EF5350]" title="Ragi 10%"></div>
                  <div style={{ width: '8%' }} className="h-full bg-[#FFA726]" title="Bajra 8%"></div>
                  <div style={{ width: '6%' }} className="h-full bg-[#AB47BC]" title="Barley 6%"></div>
                  <div style={{ width: '6%' }} className="h-full bg-[#FF7043]" title="Chana 6%"></div>
                  <div style={{ width: '3%' }} className="h-full bg-[#26A69A]" title="Flax 3%"></div>
                </div>
                <p className="text-[11px] text-[#B8A693]">
                  55% Sharbati Wheat (for soft rotis) + 45% Millets, Barley, Roasted Gram & Seeds.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('product-detail', { productId: multigrainProd.id })}
                  className="px-7 py-3.5 rounded-xl bg-[#E2B167] hover:bg-[#D49E48] text-[#241B12] font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Order Fresh 7-Grain Flour (₹95/kg)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Ingredient Cards */}
            <div className="lg:col-span-6 space-y-2.5">
              <h4 className="text-xs font-bold text-[#E2B167] uppercase tracking-wider mb-2">
                Click to explore each grain ingredient:
              </h4>

              <div className="space-y-2">
                {grains.map((item, idx) => {
                  const isSelected = activeGrainIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveGrainIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-white/20 border-[#E2B167] shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">{item.name}</span>
                          {item.percentage && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2B167] text-[#241B12]">
                              {item.percentage}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#D8C7B5] mt-1 leading-snug">
                          {item.benefit}
                        </p>
                      </div>
                      <Wheat className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-[#E2B167]' : 'text-white/40'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

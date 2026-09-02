import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ProductQuickViewModal } from '../product/ProductQuickViewModal';
import { Product } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'millet' | 'wheat' | 'multigrain'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'bestseller') return prod.isBestseller;
    if (activeTab === 'millet') return prod.category === 'millet';
    if (activeTab === 'wheat') return prod.category === 'wheat';
    if (activeTab === 'multigrain') return prod.category === 'multigrain';
    return true;
  });

  return (
    <section className="py-16 bg-white border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0DC] text-[#9A5C1B] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hand-Picked Selections</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D]">
              Freshly Milled On-Order Flours
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A49] mt-1.5 max-w-xl">
              Choose your preferred pack size (500g to 10kg). Milled only when your order is placed to preserve freshness and aroma.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Flours' },
              { id: 'bestseller', label: '⭐ Bestsellers' },
              { id: 'millet', label: 'Millets (Ragi/Jowar/Bajra)' },
              { id: 'wheat', label: 'Wheat (Sharbati/Khapli)' },
              { id: 'multigrain', label: '7-Grain Blends' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#3B2A1A] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B5A49] border border-[#DDD3C2] hover:border-[#9A5C1B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EADB] border border-[#DDD3C2] text-[#3B2A1A] font-bold text-sm transition-all shadow-xs group"
          >
            <span>Explore Complete Flour Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 text-[#9A5C1B] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <ProductQuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
    </section>
  );
};

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Wheat, Sparkles, Layers, CircleDot, Award, ArrowRight } from 'lucide-react';
import { CategoryId } from '../../types';

export const CategorySection: React.FC = () => {
  const { categories, navigateTo } = useStore();

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'wheat':
        return <Wheat className="w-5 h-5 text-[#9A5C1B]" />;
      case 'millet':
        return <Sparkles className="w-5 h-5 text-[#9A5C1B]" />;
      case 'multigrain':
        return <Layers className="w-5 h-5 text-[#9A5C1B]" />;
      case 'single-grain':
        return <CircleDot className="w-5 h-5 text-[#9A5C1B]" />;
      case 'specialty':
        return <Award className="w-5 h-5 text-[#9A5C1B]" />;
    }
  };

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
              Explore By Category
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] mt-1">
              Shop Fresh Grain & Millet Flours
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A49] mt-2 max-w-xl">
              From everyday wheat aata to heritage millets and custom multigrain recipes, freshly milled strictly upon your order.
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9A5C1B] hover:text-[#52320E] transition-colors self-start md:self-auto group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', { categoryId: cat.id })}
              className="group bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden hover:shadow-xl hover:border-[#D49E48] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative aspect-16/10 overflow-hidden bg-[#F0EAE1]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  {getCategoryIcon(cat.id)}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2C241D] group-hover:text-[#9A5C1B] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#7A6A58] mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#9A5C1B] group-hover:underline flex items-center gap-1">
                    <span>Explore Flours</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[10px] font-semibold text-[#8C7B6B] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E6DEC9]">
                    Fresh Milled
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

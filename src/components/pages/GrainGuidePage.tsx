import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BookOpen, Clock, ArrowRight, Wheat, Sparkles, HelpCircle } from 'lucide-react';

export const GrainGuidePage: React.FC = () => {
  const { grainArticles, navigateTo } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = grainArticles.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0DC] text-[#784712] text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Shivaay Grain Knowledge Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2C241D]">
            Understand Your Daily Grains
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A49] leading-relaxed">
            Deep dive into Indian heritage millets, the difference between ancient Emmer Khapli and modern wheat, tips for rolling ultra-soft rotis, and how to store fresh stone-ground flour.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'millets', label: '🌾 Indian Millets' },
            { id: 'wheat', label: '🌱 Wheat Heritage' },
            { id: 'multigrain', label: '🥣 Multigrain Science' },
            { id: 'storage', label: '📦 Freshness & Storage' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-[#3B2A1A] text-white shadow-xs'
                  : 'bg-white text-[#4A3B2C] border border-[#DDD3C2] hover:border-[#9A5C1B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigateTo('article-detail', { articleId: article.id })}
              className="group bg-white rounded-3xl border border-[#E6DEC9] overflow-hidden hover:shadow-xl hover:border-[#D49E48] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-[#F0EAE1]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#3B2A1A]/85 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  {article.category.toUpperCase()}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8C7B6B] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#9A5C1B]">{article.hindiName}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2C241D] group-hover:text-[#9A5C1B] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6B5A49] mt-2.5 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#9A5C1B] group-hover:underline flex items-center gap-1">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-[#8C7B6B]">Culinary & Health Tips</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Grain Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E6DEC9] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
              Quick Reference
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C241D]">
              Comparing Major Indian Grains & Millets
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E6DEC9] text-[#2C241D]">
                  <th className="p-3.5 font-bold">Grain Name</th>
                  <th className="p-3.5 font-bold">Gluten Nature</th>
                  <th className="p-3.5 font-bold">Digestive Feel</th>
                  <th className="p-3.5 font-bold">Key Natural Nutrients</th>
                  <th className="p-3.5 font-bold">Best Culinary Uses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1] text-[#5C4D3C]">
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">MP Sharbati Wheat</td>
                  <td className="p-3.5">Natural whole wheat gluten</td>
                  <td className="p-3.5">Medium, very soft texture</td>
                  <td className="p-3.5">Dietary fiber, Vitamin E, zinc</td>
                  <td className="p-3.5">Daily soft fulkas, parathas</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">Ancient Khapli (Emmer)</td>
                  <td className="p-3.5">Low / easily digestible gluten</td>
                  <td className="p-3.5">Light, gentle on gut</td>
                  <td className="p-3.5">Low GI, polyphenols, iron</td>
                  <td className="p-3.5">Diabetic-friendly rotis, laddoos</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">Ragi (Finger Millet)</td>
                  <td className="p-3.5">100% Gluten-free</td>
                  <td className="p-3.5">Cooling, high satiety</td>
                  <td className="p-3.5">Natural plant calcium (344mg), iron</td>
                  <td className="p-3.5">Ragi mudde, dosas, malt porridge</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">Jowar (Sorghum)</td>
                  <td className="p-3.5">100% Gluten-free</td>
                  <td className="p-3.5">Light & cooling</td>
                  <td className="p-3.5">Resistant starch, phosphorus</td>
                  <td className="p-3.5">Traditional soft bhakri, thalipeeth</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">Bajra (Pearl Millet)</td>
                  <td className="p-3.5">100% Gluten-free</td>
                  <td className="p-3.5">Warming, highly sustaining</td>
                  <td className="p-3.5">High natural iron, magnesium</td>
                  <td className="p-3.5">Winter bhakri with jaggery & ghee</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#2C241D]">Barley (Jau)</td>
                  <td className="p-3.5">Low gluten</td>
                  <td className="p-3.5">Very light, alkaline</td>
                  <td className="p-3.5">Beta-glucan soluble fiber</td>
                  <td className="p-3.5">Barley rotis, sattu mixes, gruel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

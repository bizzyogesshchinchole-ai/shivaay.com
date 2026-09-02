import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const GrainGuideSection: React.FC = () => {
  const { grainArticles, navigateTo } = useStore();

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0CD] text-[#784712] text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grain Knowledge & Guides</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D]">
              The Shivaay Grain Guide
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A49] mt-1 max-w-xl">
              Learn about traditional Indian grains, millet benefits, soft roti preparation techniques, and proper storage.
            </p>
          </div>

          <button
            onClick={() => navigateTo('grain-guide')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9A5C1B] hover:text-[#52320E] transition-colors self-start md:self-auto group"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grainArticles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => navigateTo('article-detail', { articleId: article.id })}
              className="group bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden hover:shadow-xl hover:border-[#D49E48] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-[#F0EAE1]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#3B2A1A]/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {article.category.toUpperCase()}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8C7B6B] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#9A5C1B]">{article.hindiName}</span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C241D] group-hover:text-[#9A5C1B] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6B5A49] mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#9A5C1B] group-hover:underline flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-[#8C7B6B]">Recipe & Storage tips</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

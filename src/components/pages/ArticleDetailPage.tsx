import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, ArrowLeft, ArrowRight, Share2, Wheat, Bookmark } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { selectedArticleId, grainArticles, navigateTo, showToast } = useStore();

  const article = grainArticles.find((a) => a.id === selectedArticleId) || grainArticles[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  if (!article) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#2C241D]">Article Not Found</h2>
        <button
          onClick={() => navigateTo('grain-guide')}
          className="mt-4 px-6 py-2.5 bg-[#3B2A1A] text-white font-bold text-xs rounded-xl"
        >
          Return to Grain Guide
        </button>
      </div>
    );
  }

  const otherArticles = grainArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button & Metadata */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('grain-guide')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A5C1B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Grain Guides</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-[#E6DEC9] text-[#7A6A58] hover:text-[#2C241D] shadow-2xs"
            title="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DEC9] shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#8C7B6B]">
              <span className="font-bold text-[#9A5C1B] bg-[#FAF0DC] px-3 py-1 rounded-full uppercase">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span className="font-semibold">{article.hindiName}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-[#5C4D3C] font-medium leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D0]">
              {article.summary}
            </p>
          </div>

          {/* Featured Image */}
          <div className="aspect-16/9 rounded-2xl overflow-hidden bg-[#F0EAE1] border border-[#E6DEC9]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Full Body */}
          <div className="text-xs sm:text-sm text-[#4A3B2C] leading-relaxed space-y-4 whitespace-pre-line border-t border-[#F0EAE1] pt-6 font-sans">
            {article.content}
          </div>

          {/* Footer Call to Action */}
          <div className="p-6 rounded-2xl bg-[#FAF0DC] border border-[#E0D0B5] flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div>
              <h4 className="font-serif font-bold text-base text-[#2C241D]">
                Taste the Freshness of Real Ground Flour
              </h4>
              <p className="text-xs text-[#784712] mt-0.5">
                Ready to try freshly milled flours in your kitchen?
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E2B167]" />
            </button>
          </div>
        </div>

        {/* Read Next Section */}
        {otherArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2C241D]">
              More Guides You Might Enjoy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigateTo('article-detail', { articleId: a.id })}
                  className="bg-white p-5 rounded-2xl border border-[#E6DEC9] hover:border-[#D49E48] transition-all cursor-pointer flex gap-4 items-center"
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-20 h-20 rounded-xl object-cover border border-[#E6DEC9] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#9A5C1B] uppercase">
                      {a.category}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2C241D] line-clamp-2 mt-0.5">
                      {a.title}
                    </h4>
                    <span className="text-[11px] text-[#8C7B6B] mt-1 block">
                      {a.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle2, MessageSquarePlus, X, Send } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, products, addReview, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const approvedReviews = reviews.filter((r) => r.isApproved);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      showToast('Please provide your name and review details.', 'error');
      return;
    }

    const prod = products.find((p) => p.id === selectedProdId);

    addReview({
      productId: selectedProdId,
      productName: prod ? prod.name : 'Shivaay Flour',
      customerName: name,
      customerCity: city || 'Customer',
      rating,
      title: title || 'Fresh and high quality flour',
      comment,
      isVerifiedPurchase: true,
    });

    setIsModalOpen(false);
    setName('');
    setCity('');
    setTitle('');
    setComment('');
  };

  return (
    <section className="py-16 bg-white border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
              Verified Customer Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] mt-1">
              What Indian Households Say About Our Flour
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A49] mt-1">
              Real feedback on freshness, roti softness, and authentic grain aroma.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EADB] border border-[#DDD3C2] text-[#3B2A1A] font-bold text-xs sm:text-sm transition-all shadow-xs self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#9A5C1B]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D0] flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-[#E2B167] text-[#E2B167]'
                          : 'text-[#DDD3C2]'
                      }`}
                    />
                  ))}
                </div>

                <h4 className="font-bold text-sm text-[#2C241D] mb-1.5 line-clamp-1">
                  &quot;{rev.title}&quot;
                </h4>
                <p className="text-xs text-[#5C4D3C] leading-relaxed line-clamp-4">
                  {rev.comment}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE1D0]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2C241D]">{rev.customerName}</span>
                  {rev.customerCity && (
                    <span className="text-[#8C7B6B]">{rev.customerCity}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8C7B6B] mt-1">
                  <span className="truncate max-w-[140px] text-[#9A5C1B] font-medium">
                    {rev.productName}
                  </span>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center gap-0.5 text-[#2E7D32] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {approvedReviews.length === 0 && (
          <div className="text-center py-10 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D0]">
            <p className="text-sm font-semibold text-[#5C4D3C]">
              Be one of the first customers to share your experience.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 px-4 py-2 bg-[#D49E48] text-[#241B12] font-bold text-xs rounded-xl"
            >
              Share Review
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6DEC9] relative animate-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7B6B]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C241D] mb-1">
              Share Your Flour Experience
            </h3>
            <p className="text-xs text-[#7A6A58] mb-4">
              Help fellow households choose fresh, wholesome Indian flours.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                  Product Purchased:
                </label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Your Name: *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    City / Location:
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                  Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-[#E2B167] text-[#E2B167]'
                            : 'text-[#DDD3C2]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#2C241D] ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Very soft rotis and amazing fresh aroma"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                  Your Detailed Experience: *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on texture, aroma, dough kneading, and packaging..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B5A49] hover:bg-[#FAF7F2] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

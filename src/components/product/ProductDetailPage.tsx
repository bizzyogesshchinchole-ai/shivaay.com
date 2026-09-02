import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PackSizeOption, Product } from '../../types';
import { ProductCard } from './ProductCard';
import {
  Star,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Zap,
  MessageCircle,
  Check,
  Wheat,
  Share2,
  Heart,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    navigateTo,
    reviews,
    generateWhatsAppLink,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const defaultPack =
    product.packSizes.find((p) => p.isPopular) || product.packSizes[0] || {
      size: '1 kg',
      weightInKg: 1,
      price: 65,
      sku: 'DEFAULT',
    };
  const [selectedPack, setSelectedPack] = useState<PackSizeOption>(defaultPack);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'nutrition' | 'storage' | 'reviews'>('details');
  const [isAdded, setIsAdded] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    if (product) {
      const pack = product.packSizes.find((p) => p.isPopular) || product.packSizes[0];
      setSelectedPack(pack);
      setActiveImage(product.images[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#2C241D]">Product Not Found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-[#3B2A1A] text-white font-bold text-xs rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedPack, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedPack, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const productReviews = reviews.filter((r) => r.productId === product.id && r.isApproved);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const productWhatsAppMessage = `Hello Shivaay Agri Products, I am interested in ${product.name} – ${selectedPack.size} (₹${selectedPack.price * quantity}). Please share availability and delivery timeframe.`;

  const discountPercent = selectedPack.originalPrice
    ? Math.round(
        ((selectedPack.originalPrice - selectedPack.price) / selectedPack.originalPrice) * 100
      )
    : 0;

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#8C7B6B] mb-6 flex-wrap">
          <button onClick={() => navigateTo('home')} className="hover:text-[#9A5C1B]">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigateTo('shop')} className="hover:text-[#9A5C1B]">
            Shop
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            onClick={() => navigateTo('shop', { categoryId: product.category })}
            className="capitalize hover:text-[#9A5C1B]"
          >
            {product.category} Flour
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-[#2C241D] truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Hero: Images & Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E6DEC9] shadow-sm mb-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E6DEC9]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3B2A1A]/95 text-white backdrop-blur-xs shadow-md">
                  <Clock className="w-3.5 h-3.5 text-[#E2B167]" />
                  <span>Milled on Order</span>
                </span>
                {product.isBestseller && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D49E48] text-[#1F1710]">
                    <Sparkles className="w-3 h-3" />
                    <span>Bestseller</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleShare}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-[#5C4D3C] hover:text-[#2C241D] hover:bg-white shadow-md transition-colors"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-[#C48E3C] scale-105 shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Freshness Callout Box */}
            <div className="p-4 rounded-2xl bg-[#FAF0DC] border border-[#E0D0B5] text-xs text-[#6A4315] space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-[#784712]">
                <Clock className="w-4 h-4" />
                <span>Prepared / Packed on Order</span>
              </p>
              <p className="leading-relaxed">
                Your flour is prepared and packed against your order to help provide a fresher product experience instead of relying on warehouse stock.
              </p>
            </div>
          </div>

          {/* Right Column: Title, Pack Selector, Pricing & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[#9A5C1B] bg-[#FAF0DC] px-2.5 py-0.5 rounded-md">
                  {product.category} Flour • {product.grainType}
                </span>
                <div className="flex items-center gap-1 bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#ECE2D0]">
                  <Star className="w-3.5 h-3.5 fill-[#E2B167] text-[#E2B167]" />
                  <span className="font-bold text-[#2C241D]">{product.rating}</span>
                  <span className="text-[11px] text-[#8C7B6B]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Hindi name */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241D]">
                {product.name}
              </h1>
              {product.hindiName && (
                <p className="text-sm font-medium text-[#8C7B6B] mt-1">{product.hindiName}</p>
              )}

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#5C4D3C] mt-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Live Price Display */}
              <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7A6A58] block mb-0.5">Price for {selectedPack.size}:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#2C241D]">
                      ₹{selectedPack.price * quantity}
                    </span>
                    {selectedPack.originalPrice && (
                      <span className="text-base text-[#9E8E7E] line-through font-medium">
                        ₹{selectedPack.originalPrice * quantity}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8C7B6B]">
                    (₹{Math.round(selectedPack.price / (selectedPack.weightInKg || 1))}/kg) • Taxes included
                  </span>
                </div>

                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Pack Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#4A3B2C] uppercase tracking-wider">
                    Available Pack Sizes:
                  </span>
                  <span className="text-xs text-[#9A5C1B] font-semibold">
                    Selected: {selectedPack.size}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {product.packSizes.map((pack) => {
                    const isSelected = selectedPack.sku === pack.sku;
                    return (
                      <button
                        key={pack.sku}
                        onClick={() => setSelectedPack(pack)}
                        className={`p-3 rounded-xl text-center transition-all border ${
                          isSelected
                            ? 'bg-[#3B2A1A] text-white border-[#3B2A1A] shadow-md ring-2 ring-[#D49E48]'
                            : 'bg-white text-[#4A3B2C] border-[#DDD3C2] hover:border-[#9A5C1B]'
                        }`}
                      >
                        <div className="font-bold text-sm">{pack.size}</div>
                        <div className="text-xs font-medium opacity-90 mt-0.5">₹{pack.price}</div>
                        {pack.isPopular && (
                          <div className="text-[9px] font-extrabold text-[#E2B167] uppercase tracking-wider mt-1">
                            Popular Choice
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold text-[#4A3B2C] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#DDD3C2] rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-base font-bold text-[#4A3B2C] hover:bg-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-sm font-bold text-[#2C241D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-base font-bold text-[#4A3B2C] hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7A6A58]">
                  Total Weight:{' '}
                  <strong>{((selectedPack.weightInKg || 1) * quantity).toFixed(1)} kg</strong>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#F0EAE1]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-[#2E7D32] text-white'
                      : product.isAvailable
                      ? 'bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] active:scale-98'
                      : 'bg-[#E6DEC9] text-[#8C7B6B] cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable}
                  className="py-3.5 px-6 rounded-2xl bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Zap className="w-5 h-5 text-[#E2B167]" />
                  <span>Buy Now • Fast Checkout</span>
                </button>
              </div>

              {/* WhatsApp Enquiry Button */}
              <a
                href={generateWhatsAppLink(productWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl border border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#128C7E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>WhatsApp Enquiry: Order Custom Weight / Ask Questions</span>
              </a>
            </div>
          </div>
        </div>

        {/* Product In-Depth Information Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E6DEC9] shadow-sm mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#E6DEC9] overflow-x-auto gap-2 sm:gap-6 pb-2 mb-6">
            {[
              { id: 'details', label: '🌾 Flour Overview & Description' },
              { id: 'ingredients', label: '🥗 Ingredients & Grains' },
              { id: 'nutrition', label: '📊 Nutrition Facts' },
              { id: 'storage', label: '📦 Preparation & Storage' },
              { id: 'reviews', label: `⭐ Reviews (${productReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#9A5C1B] text-[#9A5C1B]'
                    : 'border-transparent text-[#7A6A58] hover:text-[#2C241D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#5C4D3C] leading-relaxed animate-in fade-in">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C241D] mb-2">
                  About {product.name}
                </h3>
                <p>{product.longDescription}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#2C241D] mb-2">Best Suited For:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.suitableFor.map((use, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF0DC] text-[#784712] font-semibold text-xs border border-[#E0D0B5]"
                    >
                      ✓ {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-serif text-lg font-bold text-[#2C241D]">
                Pure Ingredients & Grain Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE1D0] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#2C241D]">{ing.name}</span>
                      {ing.percentage && (
                        <span className="text-xs font-bold text-[#9A5C1B] bg-white px-2 py-0.5 rounded-md border border-[#EAE1D0]">
                          {ing.percentage}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6A58]">{ing.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Nutrition */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4 animate-in fade-in max-w-xl">
              <h3 className="font-serif text-lg font-bold text-[#2C241D]">
                Nutritional Values (Approx. per 100g)
              </h3>
              <div className="border border-[#E6DEC9] rounded-2xl overflow-hidden divide-y divide-[#F0EAE1]">
                {product.nutritionFacts.map((nut, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-[#4A3B2C]">{nut.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C241D]">{nut.amount}</span>
                      {nut.dailyValue && (
                        <span className="text-[10px] text-[#8C7B6B] bg-[#FAF7F2] px-1.5 py-0.5 rounded-sm">
                          {nut.dailyValue} DV
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8C7B6B]">
                *Values are representative of natural, unrefined whole grains. Naturally occurring variations may apply.
              </p>
            </div>
          )}

          {/* Tab 4: Storage & Freshness */}
          {activeTab === 'storage' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#5C4D3C] animate-in fade-in max-w-2xl">
              <div className="p-4 rounded-xl bg-[#FAF0DC] border border-[#E0D0B5]">
                <h4 className="font-bold text-[#784712] mb-1">Milling Lead Time & Dispatch:</h4>
                <p>
                  Orders are freshly prepared and milled within <strong>{product.preparationTimeDays} business day(s)</strong> of receiving your order to ensure peak freshness.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#2C241D] mb-1">Recommended Shelf Life:</h4>
                <p>{product.shelfLife}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#2C241D] mb-1">Storage Instructions:</h4>
                <p>{product.storageInstructions}</p>
              </div>
            </div>
          )}

          {/* Tab 5: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2C241D]">
                  Customer Reviews for {product.name}
                </h3>
              </div>

              {productReviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D0]">
                      <div className="flex items-center gap-1 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#E2B167] text-[#E2B167]' : 'text-[#DDD3C2]'
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#2C241D]">&quot;{rev.title}&quot;</h4>
                      <p className="text-xs text-[#6B5A49] mt-1">{rev.comment}</p>
                      <div className="mt-3 pt-2 border-t border-[#EAE1D0] flex items-center justify-between text-[11px] text-[#8C7B6B]">
                        <span className="font-semibold text-[#2C241D]">{rev.customerName} ({rev.customerCity})</span>
                        <span>{rev.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8C7B6B]">
                  No reviews yet for this specific pack size. Order today and be the first to share your experience!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Related Flours Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C241D] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

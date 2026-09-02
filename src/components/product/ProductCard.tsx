import React, { useState } from 'react';
import { Product, PackSizeOption } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Eye,
  Star,
  Clock,
  Sparkles,
  Check,
  Wheat,
  MessageCircle,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, navigateTo, generateWhatsAppLink } = useStore();

  // Selected pack size state
  const defaultPack =
    product.packSizes.find((p) => p.isPopular) || product.packSizes[0] || {
      size: '1 kg',
      weightInKg: 1,
      price: 65,
      sku: 'DEMO',
    };
  const [selectedPack, setSelectedPack] = useState<PackSizeOption>(defaultPack);
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, selectedPack, quantity);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleCardClick = () => {
    navigateTo('product-detail', { productId: product.id });
  };

  const discountPercent = selectedPack.originalPrice
    ? Math.round(
        ((selectedPack.originalPrice - selectedPack.price) / selectedPack.originalPrice) * 100
      )
    : 0;

  const productWhatsAppMessage = `Hello Shivaay Agri Products, I am interested in ${product.name} (${selectedPack.size}) - ₹${selectedPack.price}. Please share ordering details.`;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden hover:shadow-xl hover:border-[#D49E48]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Image Section */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F5EFE6]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3B2A1A]/90 text-[#F5EFE6] backdrop-blur-xs shadow-xs">
            <Clock className="w-3 h-3 text-[#E2B167]" />
            <span>Milled on Order</span>
          </span>

          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D49E48] text-[#1F1710] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 text-[#5C4D3C] capitalize backdrop-blur-xs border border-[#E6DEC9]">
            {product.category}
          </span>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView ? onQuickView(product) : navigateTo('product-detail', { productId: product.id });
            }}
            className="px-3.5 py-2 bg-white/95 text-[#2C241D] rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#9A5C1B]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Grain Type */}
          <div className="flex items-center justify-between text-xs text-[#7A6A58] mb-1.5">
            <span className="font-medium flex items-center gap-1 text-[#8C7B6B]">
              <Wheat className="w-3.5 h-3.5 text-[#C48E3C]" />
              {product.grainType}
            </span>
            <div className="flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#ECE2D0]">
              <Star className="w-3 h-3 fill-[#E2B167] text-[#E2B167]" />
              <span className="font-bold text-[#2C241D] text-[11px]">{product.rating}</span>
              <span className="text-[10px] text-[#8C7B6B]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C241D] group-hover:text-[#9A5C1B] transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.hindiName && (
            <p className="text-xs text-[#8C7B6B] font-normal mb-2">{product.hindiName}</p>
          )}

          {/* Short Description */}
          <p className="text-xs text-[#6B5A49] line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>

          {/* Pack Size Selector Pills */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#7A6A58] uppercase tracking-wider">
                Select Pack Size:
              </span>
              <span className="text-[11px] font-medium text-[#9A5C1B]">
                {selectedPack.size}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.packSizes.map((pack) => {
                const isSelected = selectedPack.sku === pack.sku;
                return (
                  <button
                    key={pack.sku}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#3B2A1A] text-[#FAF7F2] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#5C4D3C] border border-[#E0D5BE] hover:border-[#9A5C1B]'
                    }`}
                  >
                    {pack.size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & Add To Cart Footer */}
        <div className="pt-3 border-t border-[#F0EAE1] space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-[#2C241D]">
                ₹{selectedPack.price}
              </span>
              {selectedPack.originalPrice && selectedPack.originalPrice > selectedPack.price && (
                <span className="text-xs text-[#9E8E7E] line-through font-medium">
                  ₹{selectedPack.originalPrice}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {/* WhatsApp Enquiry Button */}
            <a
              href={generateWhatsAppLink(productWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              title="Enquire on WhatsApp"
              className="col-span-1 p-2.5 rounded-xl border border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 flex items-center justify-center transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`col-span-4 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                isAddedAnim
                  ? 'bg-[#2E7D32] text-white'
                  : product.isAvailable
                  ? 'bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] active:scale-98'
                  : 'bg-[#E6DEC9] text-[#8C7B6B] cursor-not-allowed'
              }`}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : product.isAvailable ? (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              ) : (
                <span>Out of Milling Capacity</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

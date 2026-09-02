import React, { useState } from 'react';
import { Product, PackSizeOption } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Check,
  Wheat,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart, navigateTo, generateWhatsAppLink } = useStore();

  const defaultPack =
    product.packSizes.find((p) => p.isPopular) || product.packSizes[0] || {
      size: '1 kg',
      weightInKg: 1,
      price: 65,
      sku: 'DEMO',
    };
  const [selectedPack, setSelectedPack] = useState<PackSizeOption>(defaultPack);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    addToCart(product, selectedPack, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleViewFullDetails = () => {
    onClose();
    navigateTo('product-detail', { productId: product.id });
  };

  const productWhatsAppMessage = `Hello Shivaay Agri Products, I am interested in ${product.name} (${selectedPack.size}) - ₹${selectedPack.price}. Please share availability and delivery timeframe.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E6DEC9] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#2C241D] shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Gallery */}
          <div className="p-6 bg-[#FAF7F2] flex flex-col gap-3 justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E6DEC9]">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#3B2A1A]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E2B167]" />
                <span>Prepared on Order</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#C48E3C] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Freshness banner */}
            <div className="bg-[#EFE8DA] rounded-xl p-3 text-[11px] text-[#5C4D3C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>Zero warehouse shelf-aging. Milled freshly within 24–48 hours of order.</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#7A6A58] mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#9A5C1B]">
                  {product.category} Flour
                </span>
                <div className="flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#ECE2D0]">
                  <Star className="w-3 h-3 fill-[#E2B167] text-[#E2B167]" />
                  <span className="font-bold text-[#2C241D]">{product.rating}</span>
                  <span className="text-[10px]">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C241D]">
                {product.name}
              </h2>
              {product.hindiName && (
                <p className="text-xs text-[#8C7B6B] mt-0.5">{product.hindiName}</p>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6B5A49] mt-2 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pack Size Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider">
                    Select Pack Size:
                  </span>
                  <span className="text-xs font-semibold text-[#9A5C1B]">
                    {selectedPack.size} (₹{selectedPack.price})
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.packSizes.map((pack) => {
                    const isSelected = selectedPack.sku === pack.sku;
                    return (
                      <button
                        key={pack.sku}
                        onClick={() => setSelectedPack(pack)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-[#3B2A1A] text-[#FAF7F2] shadow-sm ring-2 ring-[#D49E48]'
                            : 'bg-[#FAF7F2] text-[#4A3B2C] border border-[#DDD3C2] hover:border-[#9A5C1B]'
                        }`}
                      >
                        <div>{pack.size}</div>
                        <div className="text-[10px] font-medium opacity-80">₹{pack.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#DDD3C2] rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#2C241D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7A6A58]">
                  Total: <strong className="text-[#2C241D]">₹{selectedPack.price * quantity}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-[#F0EAE1]">
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={generateWhatsAppLink(productWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-1 py-3 rounded-xl border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 flex items-center justify-center font-bold text-xs transition-colors"
                  title="Enquire on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

                <button
                  onClick={handleAddToCart}
                  className={`col-span-3 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • ₹{selectedPack.price * quantity}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleViewFullDetails}
                className="w-full py-2 text-xs font-bold text-[#9A5C1B] hover:text-[#52320E] flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Complete Ingredients, Nutrition & Recipes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

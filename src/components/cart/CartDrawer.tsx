import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Truck,
  Tag,
  Check,
  Wheat,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalWeightKg,
    deliveryCharge,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const grandTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E6DEC9]">
          {/* Header */}
          <div className="p-5 border-b border-[#E6DEC9] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3B2A1A] flex items-center justify-center text-[#E2B167]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#2C241D]">Your Fresh Cart</h2>
                <p className="text-[11px] text-[#7A6A58]">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} • Total weight: {cartTotalWeightKg.toFixed(1)} kg
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#7A6A58] hover:text-[#2C241D] hover:bg-[#EAE1D0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#FAF0DC] border-b border-[#E0D0B5]">
            {amountNeededForFreeDelivery > 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#784712] mb-1">
                  <span>Add ₹{amountNeededForFreeDelivery} more for FREE Delivery</span>
                  <span>Threshold: ₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D49E48] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                <Truck className="w-4 h-4" />
                <span>🎉 Congratulations! You qualify for FREE doorstep delivery.</span>
              </div>
            )}
          </div>

          {/* Item List Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#F0EAE1]">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedPackSize.sku}`}
                  className="pt-4 first:pt-0 flex gap-3.5 items-start"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-18 h-18 rounded-xl object-cover border border-[#E6DEC9] bg-[#FAF7F2] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C241D] truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-[#9A5C1B] font-semibold">
                      Pack: {item.selectedPackSize.size} (₹{item.unitPrice})
                    </p>
                    <p className="text-[10px] text-[#8C7B6B] mt-0.5">
                      Milled on order (~{item.preparationTimeDays} day prep)
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DDD3C2] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.selectedPackSize.sku,
                              item.quantity - 1
                            )
                          }
                          className="px-2.5 py-1 text-xs font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-[#2C241D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.selectedPackSize.sku,
                              item.quantity + 1
                            )
                          }
                          className="px-2.5 py-1 text-xs font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-[#2C241D]">
                          ₹{item.totalPrice}
                        </span>
                        <button
                          onClick={() =>
                            removeFromCart(item.productId, item.selectedPackSize.sku)
                          }
                          className="text-[#9E8E7E] hover:text-[#C62828] transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF0DC] text-[#9A5C1B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C241D]">
                  Your Cart is Empty
                </h3>
                <p className="text-xs text-[#7A6A58] max-w-xs mx-auto">
                  Add fresh whole wheat, traditional millets, or multigrain flours freshly milled on order.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-6 py-2.5 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-xs rounded-xl shadow-md"
                >
                  Explore Fresh Flours
                </button>
              </div>
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E6DEC9] bg-[#FAF7F2] space-y-3">
              {/* Coupon Box */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8C7B6B] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Try FRESH10 or WELCOME50"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD3C2] rounded-xl text-[#2C241D] uppercase focus:ring-2 focus:ring-[#C48E3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3B2A1A] hover:bg-[#281C10] text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-between text-xs text-[#2E7D32]">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Coupon &quot;{appliedCoupon.code}&quot; Applied (-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#C62828] font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5C4D3C] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2C241D]">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#2C241D]">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#2E7D32]">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#2C241D] pt-2 border-t border-[#E6DEC9]">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3.5 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

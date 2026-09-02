import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Tag,
  Check,
  ShieldCheck,
  Wheat,
  RotateCcw,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
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

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  const grandTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white rounded-3xl p-12 border border-[#E6DEC9] shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#FAF0DC] text-[#9A5C1B] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C241D]">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6A58] mt-2 mb-6 max-w-sm mx-auto">
            Discover our freshly prepared whole wheat, traditional millets (Ragi, Bajra, Jowar), and 7-grain flours.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-sm rounded-2xl shadow-md transition-all"
          >
            Shop Fresh Flours Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C241D]">
            Your Fresh Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A58] mt-1">
            Review your selected pack sizes before proceeding to delivery and payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="p-4 bg-[#FAF0DC] rounded-2xl border border-[#E0D0B5]">
              {amountNeededForFreeDelivery > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#784712]">
                    <span>Add ₹{amountNeededForFreeDelivery} more to enjoy FREE Delivery</span>
                    <span>Free shipping threshold: ₹{freeDeliveryThreshold}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/70 rounded-full overflow-hidden">
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
                  <span>🎉 Your order qualifies for FREE doorstep delivery!</span>
                </div>
              )}
            </div>

            {/* Item Cards */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-xs space-y-4 divide-y divide-[#F0EAE1]">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedPackSize.sku}`}
                  className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E6DEC9] bg-[#FAF7F2]"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C241D]">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-[#9A5C1B] font-semibold">
                        Pack Size: {item.selectedPackSize.size} • ₹{item.unitPrice} each
                      </p>
                      <p className="text-[11px] text-[#8C7B6B]">
                        Milled on order (1-2 days preparation)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#DDD3C2] rounded-xl overflow-hidden bg-[#FAF7F2]">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.selectedPackSize.sku,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1.5 text-xs font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-bold text-[#2C241D]">
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
                        className="px-3 py-1.5 text-xs font-bold text-[#4A3B2C] hover:bg-[#EAE1D0]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-[#2C241D]">
                        ₹{item.totalPrice}
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.selectedPackSize.sku)
                        }
                        className="text-[11px] font-bold text-[#C62828] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs font-bold text-[#9A5C1B] hover:underline flex items-center gap-1"
              >
                <span>← Continue Shopping for More Flours</span>
              </button>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-[#8C7B6B] hover:text-[#C62828]"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-xs space-y-4 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-[#2C241D] border-b border-[#F0EAE1] pb-3">
                Order Summary
              </h3>

              {/* Coupon Box */}
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#8C7B6B] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] uppercase"
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
                  <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-between text-xs text-[#2E7D32]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4" />
                      <span>{appliedCoupon.code} (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#C62828] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-[#5C4D3C] pt-2 border-t border-[#F0EAE1]">
                <div className="flex justify-between">
                  <span>Subtotal ({cartTotalWeightKg.toFixed(1)} kg)</span>
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
                <div className="flex justify-between text-lg font-extrabold text-[#2C241D] pt-3 border-t border-[#E6DEC9]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-4 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-[#8C7B6B] text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>100% Prepared on Order • Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

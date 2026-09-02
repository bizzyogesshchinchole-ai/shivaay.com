import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerDetails, Order, SavedAddress } from '../../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  ArrowRight,
  Sparkles,
  Wheat,
  Clock,
  User,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    appliedCoupon,
    placeOrder,
    navigateTo,
    showToast,
    currentCustomer,
    openAuthModal,
  } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    specialInstructions: '',
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate when currentCustomer exists
  useEffect(() => {
    if (currentCustomer) {
      const defaultAddr = (currentCustomer.addresses || []).find((a) => a.isDefault) || (currentCustomer.addresses || [])[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setCustomer({
          fullName: defaultAddr.fullName || currentCustomer.fullName,
          email: currentCustomer.email,
          phone: defaultAddr.phone || currentCustomer.phone,
          addressLine1: defaultAddr.addressLine1,
          addressLine2: defaultAddr.addressLine2 || '',
          landmark: defaultAddr.landmark || '',
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          specialInstructions: '',
        });
      } else {
        setCustomer((prev) => ({
          ...prev,
          fullName: currentCustomer.fullName,
          email: currentCustomer.email,
          phone: currentCustomer.phone,
        }));
      }
    }
  }, [currentCustomer]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setCustomer({
      fullName: addr.fullName,
      email: currentCustomer?.email || customer.email,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      specialInstructions: customer.specialInstructions,
    });
  };

  const grandTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#2C241D]">No items in checkout</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-[#3B2A1A] text-white font-bold text-xs rounded-xl"
        >
          Explore Flours
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.fullName || !customer.phone || !customer.addressLine1 || !customer.city || !customer.pincode) {
      showToast('Please fill in all required delivery address fields.', 'error');
      return;
    }

    if (customer.phone.length < 10) {
      showToast('Please enter a valid 10-digit phone number for delivery updates.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customer,
        paymentMethod,
      });

      setIsSubmitting(false);
      navigateTo('order-confirmation', { orderId: order.id });
    }, 800);
  };

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C241D]">
            Order Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A58] mt-1">
            Provide your delivery details. Your flour will be milled fresh upon order confirmation.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: Delivery Address & Payment */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#9A5C1B]" />
                    <h2 className="font-serif text-lg font-bold text-[#2C241D]">
                      1. Delivery Address & Contact
                    </h2>
                  </div>
                  {currentCustomer ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Logged in as {currentCustomer.fullName.split(' ')[0]}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="text-xs font-bold text-[#9A5C1B] hover:underline"
                    >
                      Sign In for 1-Click Fill
                    </button>
                  )}
                </div>

                {/* Saved Address Quick Selector */}
                {currentCustomer && (currentCustomer.addresses || []).length > 0 && (
                  <div className="space-y-2 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC9]">
                    <span className="text-[11px] font-bold text-[#4A3B2C] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9A5C1B]" />
                      <span>Choose from Saved Addresses</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentCustomer.addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <button
                            type="button"
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                              isSelected
                                ? 'bg-white border-[#C48E3C] ring-2 ring-[#C48E3C]/30 shadow-xs'
                                : 'bg-white/60 border-[#E6DEC9] hover:bg-white hover:border-[#DDD3C2]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#2C241D] uppercase text-[10px] bg-[#EFE9DF] px-2 py-0.5 rounded">
                                {addr.label}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>
                            <p className="font-semibold text-[#2C241D] truncate">{addr.fullName}</p>
                            <p className="text-[11px] text-[#7A6A58] line-clamp-1">
                              {addr.addressLine1}, {addr.city}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Email Address (Optional, for digital invoice)
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. vikram@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.addressLine1}
                    onChange={(e) => setCustomer({ ...customer, addressLine1: e.target.value })}
                    placeholder="e.g. Flat 402, Green Meadows Apt, Baner Road"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="e.g. Pune"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      placeholder="6-digit pincode"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Special Milling / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={customer.specialInstructions}
                    onChange={(e) => setCustomer({ ...customer, specialInstructions: e.target.value })}
                    placeholder="e.g. Please grind slightly coarse / call before delivery"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F0EAE1] pb-3">
                  <Lock className="w-5 h-5 text-[#9A5C1B]" />
                  <h2 className="font-serif text-lg font-bold text-[#2C241D]">
                    2. Select Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* UPI */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#9A5C1B] bg-[#FAF0DC]/50'
                        : 'border-[#DDD3C2] bg-[#FAF7F2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 text-[#9A5C1B]"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#2C241D] flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#9A5C1B]" />
                        <span>UPI / QR Code / GPay / PhonePe</span>
                      </div>
                      <p className="text-[11px] text-[#7A6A58] mt-1">
                        Instant payment via any UPI app or QR scanner.
                      </p>
                    </div>
                  </label>

                  {/* Cards */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#9A5C1B] bg-[#FAF0DC]/50'
                        : 'border-[#DDD3C2] bg-[#FAF7F2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 text-[#9A5C1B]"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#2C241D] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#9A5C1B]" />
                        <span>Credit / Debit Cards</span>
                      </div>
                      <p className="text-[11px] text-[#7A6A58] mt-1">
                        Visa, MasterCard, RuPay with 3D Secure OTP.
                      </p>
                    </div>
                  </label>

                  {/* NetBanking */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#9A5C1B] bg-[#FAF0DC]/50'
                        : 'border-[#DDD3C2] bg-[#FAF7F2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="mt-1 text-[#9A5C1B]"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#2C241D] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#9A5C1B]" />
                        <span>Net Banking</span>
                      </div>
                      <p className="text-[11px] text-[#7A6A58] mt-1">
                        All major Indian banks (SBI, HDFC, ICICI, Axis).
                      </p>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#9A5C1B] bg-[#FAF0DC]/50'
                        : 'border-[#DDD3C2] bg-[#FAF7F2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#9A5C1B]"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#2C241D] flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-[#9A5C1B]" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-[#7A6A58] mt-1">
                        Pay cash or scan QR when delivery partner arrives.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary: Order Items & Place Order */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-xs space-y-4 sticky top-28">
                <h3 className="font-serif text-lg font-bold text-[#2C241D] border-b border-[#F0EAE1] pb-3">
                  Order Breakdown
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-[#F0EAE1]">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedPackSize.sku}`}
                      className="pt-2 first:pt-0 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-[#2C241D] truncate">{item.productName}</p>
                        <p className="text-[#8C7B6B]">
                          {item.selectedPackSize.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-extrabold text-[#2C241D]">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-[#5C4D3C] pt-3 border-t border-[#F0EAE1]">
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
                  <div className="flex justify-between text-lg font-extrabold text-[#2C241D] pt-3 border-t border-[#E6DEC9]">
                    <span>Total to Pay</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Fresh Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="p-3 bg-[#FAF0DC] rounded-xl text-[11px] text-[#784712] flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Your flour will be ground fresh within 24-48 hours and packed in hygienic food-grade pouches.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

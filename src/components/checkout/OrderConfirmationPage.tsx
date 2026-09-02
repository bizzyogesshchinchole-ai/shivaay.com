import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  ShoppingBag,
  Printer,
  ArrowRight,
  ShieldCheck,
  Wheat,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { currentOrder, orders, selectedOrderId, navigateTo, generateWhatsAppLink } = useStore();

  const order = currentOrder || orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#2C241D]">No order found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 bg-[#3B2A1A] text-white font-bold text-xs rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const orderWhatsAppMessage = `Hello Shivaay Agri Products, I have placed order #${order.id} for ₹${order.totalAmount} (${order.customer.fullName}, ${order.customer.city}). Please confirm milling schedule.`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DEC9] shadow-sm text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full uppercase">
              Order Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C241D] mt-2">
              Thank You, {order.customer.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6A58] mt-1">
              Your order has been queued for fresh on-demand milling.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-xl border border-[#E6DEC9] text-xs font-mono text-[#2C241D]">
            <span>Order ID: <strong>{order.id}</strong></span>
            <span>•</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Instant WhatsApp Sync Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppLink(orderWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Order to WhatsApp for Priority Milling</span>
            </a>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-3 bg-[#FAF7F2] hover:bg-[#F3EADB] border border-[#DDD3C2] text-[#4A3B2C] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#9A5C1B]" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Milling & Delivery Tracking Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-sm mb-8 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#2C241D] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#9A5C1B]" />
            <span>Milling & Delivery Journey</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {[
              {
                title: 'Order Queued',
                subtitle: 'Order recorded',
                status: 'completed',
                icon: <CheckCircle2 className="w-4 h-4" />,
              },
              {
                title: 'Fresh Stone Milling',
                subtitle: 'Grains sorted & ground',
                status: 'current',
                icon: <Wheat className="w-4 h-4" />,
              },
              {
                title: 'Hygienic Packing',
                subtitle: 'Aroma-sealed pouch',
                status: 'pending',
                icon: <ShieldCheck className="w-4 h-4" />,
              },
              {
                title: 'Doorstep Delivery',
                subtitle: 'Dispatched to address',
                status: 'pending',
                icon: <Truck className="w-4 h-4" />,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between ${
                  step.status === 'completed'
                    ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                    : step.status === 'current'
                    ? 'bg-[#FAF0DC] border-[#D49E48] text-[#784712] ring-2 ring-[#D49E48]/40'
                    : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#8C7B6B] opacity-75'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs mb-2">
                  {step.icon}
                </div>
                <h4 className="font-bold text-xs sm:text-sm">{step.title}</h4>
                <p className="text-[10px] mt-0.5">{step.subtitle}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#7A6A58] bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9] text-center">
            Estimated delivery to <strong>{order.customer.city}</strong>: Within <strong>2 to 4 business days</strong>.
          </p>
        </div>

        {/* Order Details & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-sm space-y-3">
            <h3 className="font-serif text-base font-bold text-[#2C241D] border-b border-[#F0EAE1] pb-2">
              Delivery Address
            </h3>
            <p className="text-xs sm:text-sm text-[#4A3B2C] font-semibold">{order.customer.fullName}</p>
            <p className="text-xs text-[#6B5A49]">
              {order.customer.addressLine1}
              {order.customer.addressLine2 && `, ${order.customer.addressLine2}`}
            </p>
            <p className="text-xs text-[#6B5A49]">
              {order.customer.city}, {order.customer.state} – {order.customer.pincode}
            </p>
            <p className="text-xs text-[#6B5A49]">Phone: {order.customer.phone}</p>
            {order.customer.specialInstructions && (
              <p className="text-xs text-[#9A5C1B] bg-[#FAF7F2] p-2 rounded-lg border border-[#E6DEC9]">
                Note: {order.customer.specialInstructions}
              </p>
            )}
          </div>

          {/* Payment & Summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-sm space-y-3">
            <h3 className="font-serif text-base font-bold text-[#2C241D] border-b border-[#F0EAE1] pb-2">
              Payment Summary
            </h3>
            <div className="space-y-1.5 text-xs text-[#6B5A49]">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-[#2C241D] uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-[#2E7D32] capitalize">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-[#2C241D]">₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount:</span>
                  <span className="font-bold">-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-bold text-[#2C241D]">
                  {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#2C241D] pt-2 border-t border-[#F0EAE1]">
                <span>Grand Total:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-sm mb-10 space-y-4">
          <h3 className="font-serif text-base font-bold text-[#2C241D]">
            Freshly Ordered Items ({order.items.length})
          </h3>
          <div className="divide-y divide-[#F0EAE1]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E6DEC9]"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C241D]">{item.productName}</h4>
                    <p className="text-xs text-[#9A5C1B]">
                      Pack: {item.selectedPackSize.size} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-[#2C241D]">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Return to Home CTA */}
        <div className="text-center">
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3.5 bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Return to Shivaay Agri Home</span>
            <ArrowRight className="w-4 h-4 text-[#E2B167]" />
          </button>
        </div>
      </div>
    </div>
  );
};

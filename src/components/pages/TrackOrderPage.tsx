import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, getOrderByNumber, navigateTo } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toUpperCase();
    const found =
      getOrderByNumber(trimmed) ||
      orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === trimmed ||
          o.id.toUpperCase() === trimmed ||
          o.customer.phone.includes(query.trim()) ||
          (o.trackingNumber && o.trackingNumber.toUpperCase() === trimmed)
      );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Received', label: 'Order Placed', desc: 'Grains selected & scheduled for grinding' },
    { key: 'Preparing', label: 'Fresh Milling', desc: 'Slow stone-milled to retain wheat germ' },
    { key: 'Packed', label: 'Aero-Sealed', desc: 'Packaged in breathable aroma-lock bags' },
    { key: 'Dispatched', label: 'In Transit', desc: 'Handed over to express courier' },
    { key: 'Delivered', label: 'Delivered', desc: 'Fresh flour at your doorstep' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Received':
        return 0;
      case 'Preparing':
        return 1;
      case 'Packed':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time Stone Milling & Delivery Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Track Your Fresh Flour Order</h1>
        <p className="text-xs text-slate-500">
          Enter your Order Number (e.g. SHV-1001) or registered phone number to check live milling and dispatch status.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SHV-1001 or 9876543210"
              className="w-full pl-9 pr-3 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-mono font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Track Status
          </button>
        </form>

        {/* Quick sample orders if available */}
        {orders.length > 0 && !hasSearched && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Recent demo orders:</span>
            <div className="flex gap-2">
              {orders.slice(0, 2).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setQuery(o.orderNumber);
                    setSearchedOrder(o);
                    setHasSearched(true);
                  }}
                  className="font-mono font-semibold text-slate-800 hover:underline bg-slate-100 px-2 py-0.5 rounded"
                >
                  {o.orderNumber}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && !searchedOrder && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Order Found</h3>
          <p className="text-xs text-slate-500">
            We couldn&apos;t find an order matching &quot;{query}&quot;. Please double check your order number or phone number.
          </p>
        </div>
      )}

      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-mono">
                  {searchedOrder.orderNumber}
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {searchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Placed on{' '}
                {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {searchedOrder.trackingNumber && (
              <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AWB Tracking #</p>
                <p className="text-xs font-mono font-bold text-slate-900">{searchedOrder.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Stepper */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Milling & Delivery Journey
            </h3>

            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {steps.map((st, idx) => {
                  const isPassed = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div
                      key={st.key}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : isPassed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold font-mono">STEP 0{idx + 1}</span>
                        {isPassed ? (
                          <CheckCircle2
                            className={`w-4 h-4 ${isCurrent ? 'text-emerald-400' : 'text-emerald-600'}`}
                          />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <p
                        className={`font-bold text-xs ${
                          isCurrent ? 'text-white' : isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {st.label}
                      </p>
                      <p
                        className={`text-[10px] mt-1 leading-tight ${
                          isCurrent ? 'text-slate-300' : isPassed ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ordered items details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Ordered Flour Packs</h4>
              <div className="space-y-2">
                {searchedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">{item.productName}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.packSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">₹{item.totalPrice}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Delivery Destination</h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <p className="font-semibold text-slate-800">{searchedOrder.customer.fullName}</p>
                <p className="text-slate-600 font-mono">{searchedOrder.customer.phone}</p>
                <p className="text-slate-600 mt-1">{searchedOrder.deliveryAddress.streetAddress}</p>
                <p className="text-slate-700 font-medium">
                  {searchedOrder.deliveryAddress.city}, {searchedOrder.deliveryAddress.state} -{' '}
                  <span className="font-bold font-mono">{searchedOrder.deliveryAddress.pincode}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

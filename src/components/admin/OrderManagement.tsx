import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Trash2,
  Eye,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  Received: {
    label: 'Order Received',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
  },
  Preparing: {
    label: 'Fresh Milling in Progress',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: <Package className="w-3.5 h-3.5 text-blue-600" />,
  },
  Packed: {
    label: 'Aero-Packed & Sealed',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: <Package className="w-3.5 h-3.5 text-purple-600" />,
  },
  Dispatched: {
    label: 'Dispatched / In Transit',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
  },
  Delivered: {
    label: 'Successfully Delivered',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  },
  Cancelled: {
    label: 'Cancelled / Refunded',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
  },
};

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status update modal / form
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search) ||
      (o.deliveryAddress?.city && o.deliveryAddress.city.toLowerCase().includes(search.toLowerCase())) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumberInput(order.trackingNumber || '');
    setAdminNotesInput(order.adminNotes || '');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, trackingNumberInput, adminNotesInput);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveTrackingAndNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(
      selectedOrder.id,
      selectedOrder.status,
      trackingNumberInput.trim(),
      adminNotesInput.trim()
    );
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            trackingNumber: trackingNumberInput.trim(),
            adminNotes: adminNotesInput.trim(),
          }
        : null
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{orders.length}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Milling</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {orders.filter((o) => o.status === 'Received' || o.status === 'Preparing').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dispatched / Transit</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">
            {orders.filter((o) => o.status === 'Dispatched' || o.status === 'Packed').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Processed Revenue</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, phone, customer, city..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {['all', 'Received', 'Preparing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items & Pack Sizes</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Milling / Delivery Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const cfg = STATUS_CONFIG[ord.status] || STATUS_CONFIG.Received;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 font-mono">{ord.orderNumber}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{ord.customer.phone}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {ord.deliveryAddress.city}, {ord.deliveryAddress.pincode}
                          </p>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-[200px]">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 truncate">
                              <span className="font-semibold text-slate-900">{item.quantity}×</span>{' '}
                              {item.productName} ({item.packSize})
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">₹{ord.totalAmount}</p>
                          <span
                            className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              ord.paymentMethod === 'cod'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {ord.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.icon}
                            <span>{ord.status}</span>
                          </div>
                          {ord.trackingNumber && (
                            <p className="text-[10px] text-slate-500 font-mono">
                              Trk: {ord.trackingNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openOrderDetails(ord)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(ord.id)}
                            title="Delete Order Record"
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Order Record?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete order{' '}
              <strong className="text-slate-900">
                {orders.find((o) => o.id === deleteConfirmId)?.orderNumber}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmId) deleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Manage Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-6">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      STATUS_CONFIG[selectedOrder.status]?.bg
                    } ${STATUS_CONFIG[selectedOrder.status]?.text} ${
                      STATUS_CONFIG[selectedOrder.status]?.border
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Quick Status Workflow Buttons */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                  Update Milling & Dispatch Workflow Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Received', 'Preparing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                    (st) => {
                      const cfg = STATUS_CONFIG[st];
                      const isCurrent = selectedOrder.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedOrder.id, st)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                            isCurrent
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cfg.icon}
                          <span>{st}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Customer & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Customer Information
                  </h4>
                  <p className="font-semibold text-slate-800">{selectedOrder.customer.fullName}</p>
                  <p className="text-slate-600 font-mono">{selectedOrder.customer.phone}</p>
                  <p className="text-slate-500">{selectedOrder.customer.email}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> Delivery Address
                  </h4>
                  <p className="text-slate-700">{selectedOrder.deliveryAddress.streetAddress}</p>
                  {selectedOrder.deliveryAddress.areaLocality && (
                    <p className="text-slate-600">{selectedOrder.deliveryAddress.areaLocality}</p>
                  )}
                  <p className="text-slate-700 font-medium">
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} -{' '}
                    <span className="font-bold font-mono">{selectedOrder.deliveryAddress.pincode}</span>
                  </p>
                  {selectedOrder.deliveryAddress.landmark && (
                    <p className="text-[11px] text-slate-500">
                      Landmark: {selectedOrder.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered Items Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                  Ordered Fresh Flour Items
                </h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{item.productName}</p>
                          <p className="text-[11px] text-slate-500">
                            Pack: {item.packSize} • Qty: {item.quantity} × ₹{item.unitPrice}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900">₹{item.totalPrice}</p>
                    </div>
                  ))}

                  {/* Summary Totals */}
                  <div className="p-3 bg-slate-50 space-y-1 text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({selectedOrder.couponCode || 'Promo'})</span>
                        <span>-₹{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Shipping Charge</span>
                      <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking & Notes Form */}
              <form onSubmit={handleSaveTrackingAndNotes} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Courier Tracking / AWB Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      placeholder="e.g. DTDC-88492041 or DELHIVERY-19402"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Internal Admin / Milling Notes
                    </label>
                    <input
                      type="text"
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder="e.g. Extra coarse grind as requested by phone"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                  >
                    Save Tracking & Notes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

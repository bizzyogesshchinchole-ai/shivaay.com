import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  Wheat,
  ShieldCheck,
  Download,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Database,
  Lock,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { SavedAddress, Order, OrderStatus } from '../../types';
import { INITIAL_CUSTOMERS } from '../../data/initialData';

export const AccountPage: React.FC = () => {
  const {
    currentCustomer,
    customerLogout,
    customerLogin,
    updateCustomerProfile,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress,
    getCustomerOrders,
    reorderPastOrder,
    navigateTo,
    openAuthModal,
    products,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'preferences' | 'privacy'>('overview');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  // Address form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    isDefault: false,
  });

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  // Selected Order for Modal View
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // If user is not logged in, show an inviting Login / Registration prompt card
  if (!currentCustomer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome to Your Shivaay Account</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Sign in to view your order history, track freshly milled flour dispatches in real time, manage delivery addresses, and enjoy loyalty club perks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Sign In to Existing Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all"
            >
              Create New Account
            </button>
          </div>

          {/* Instant demo customer buttons */}
          <div className="pt-6 border-t border-slate-100 text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Test: Select a Demo Customer Profile
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_CUSTOMERS.map((cust) => (
                <button
                  key={cust.id}
                  onClick={() => customerLogin(cust.email)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-900">{cust.fullName}</p>
                  <p className="text-[11px] text-slate-500">{cust.email}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {cust.loyaltyTier} • {cust.addresses.length} Saved Address(es)
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customerOrders = getCustomerOrders();

  const filteredOrders = customerOrders.filter((ord) => {
    // Status filter
    if (orderFilter === 'active') {
      if (['Delivered', 'Cancelled'].includes(ord.status)) return false;
    }
    if (orderFilter === 'completed') {
      if (!['Delivered', 'Cancelled'].includes(ord.status)) return false;
    }
    // Search query filter
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchItem = ord.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchNum || matchItem;
    }
    return true;
  });

  const totalGrainMilled = currentCustomer.totalGrainMilledKg || 0;
  const nextTierTarget = totalGrainMilled < 10 ? 10 : totalGrainMilled < 25 ? 25 : 50;
  const progressPercent = Math.min(100, Math.round((totalGrainMilled / nextTierTarget) * 100));

  const handleOpenAddressModal = (address?: SavedAddress) => {
    if (address) {
      setEditingAddressId(address.id);
      setAddressForm({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        landmark: address.landmark || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: !!address.isDefault,
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        label: 'Home',
        fullName: currentCustomer.fullName,
        phone: currentCustomer.phone,
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '',
        isDefault: (currentCustomer.addresses || []).length === 0,
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.pincode) {
      return;
    }
    if (editingAddressId) {
      updateCustomerAddress(editingAddressId, addressForm);
    } else {
      addCustomerAddress(addressForm);
    }
    setIsAddressModalOpen(false);
  };

  const handleStartEditProfile = () => {
    setProfileName(currentCustomer.fullName);
    setProfileEmail(currentCustomer.email);
    setProfilePhone(currentCustomer.phone);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
    setIsEditingProfile(false);
  };

  const toggleDietaryTag = (tag: string) => {
    const current = currentCustomer.dietaryPreferences || [];
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    updateCustomerProfile({ dietaryPreferences: updated });
  };

  const dietaryOptionsList = [
    'Traditional Whole Wheat',
    'High Fiber Millet Diet',
    'Diabetic-Friendly Rotis',
    'Stone-Ground Coarse',
    'Pure Khapli Wheat',
    'Gluten-Sensitive Awareness',
    'Low Glycemic Index',
    'Ancient Grains Supporter',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Profile Header Hero */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800">
        {/* Background Subtle Accent */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/90 border-2 border-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {currentCustomer.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentCustomer.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>{currentCustomer.loyaltyTier || 'Grain Club Explorer'}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentCustomer.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentCustomer.phone}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {new Date(currentCustomer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Demo Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const nextCust = INITIAL_CUSTOMERS.find((c) => c.id !== currentCustomer.id) || INITIAL_CUSTOMERS[0];
                customerLogin(nextCust.email);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Switch demo customer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch Profile</span>
            </button>
            <button
              onClick={customerLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-900/50 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Loyalty Grain Milestone Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Fresh Grain Milled for You:</span>
                <strong className="text-emerald-400 font-bold">{totalGrainMilled} kg</strong>
              </span>
              <span className="text-slate-400 text-[11px]">
                {totalGrainMilled >= 25 ? 'Top Tier Achieved' : `${(nextTierTarget - totalGrainMilled).toFixed(1)} kg to next milestone`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <p className="text-[11px] text-slate-400">Active Club Status</p>
            <p className="text-xs font-bold text-emerald-400">
              {currentCustomer.loyaltyTier === 'Gold Master Miller'
                ? 'VIP Priority Milling & Free Delivery'
                : currentCustomer.loyaltyTier === 'Silver Harvest'
                ? '5% Recurring Discount Active'
                : '100% Stone-Ground Certified'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({customerOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({(currentCustomer.addresses || []).length})</span>
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'preferences'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Flour Preferences</span>
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Data Privacy & Security</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <Package className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{customerOrders.length}</p>
              <p className="text-[11px] text-slate-500">
                {customerOrders.filter((o) => ['Preparing', 'Dispatched'].includes(o.status)).length} active in milling/transit
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Milled Grains</span>
                <Wheat className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalGrainMilled} kg</p>
              <p className="text-[11px] text-emerald-700 font-medium">
                100% Traditional Chakki Stone-Ground
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Default Address</span>
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {(currentCustomer.addresses || []).find((a) => a.isDefault)?.label || (currentCustomer.addresses || [])[0]?.label || 'Not set'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {(currentCustomer.addresses || [])[0]?.city || 'Add an address'}
              </p>
            </div>
          </div>

          {/* Recent Order Quick-Card */}
          {customerOrders.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Latest Flour Order</h3>
                  <p className="text-xs text-slate-500">Order #{customerOrders[0].orderNumber} • Placed on {new Date(customerOrders[0].createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    customerOrders[0].status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : customerOrders[0].status === 'Dispatched'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {customerOrders[0].status}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {customerOrders[0].items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.productName}</p>
                        <p className="text-slate-500">{item.packSize} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Total Paid: <strong className="text-slate-900 font-bold">₹{customerOrders[0].totalAmount}</strong> ({customerOrders[0].paymentMethod.toUpperCase()})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingOrder(customerOrders[0])}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    View Invoice
                  </button>
                  <button
                    onClick={() => reorderPastOrder(customerOrders[0])}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reorder This Batch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">No orders placed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our range of farm-sourced, freshly ground whole wheat, millet, and multigrain flours.
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all"
              >
                Shop All Flours
              </button>
            </div>
          )}

          {/* Quick Dietary Profile Summary */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Your Dietary Tags & Preferences
              </h3>
              <button
                onClick={() => setActiveTab('preferences')}
                className="text-xs text-slate-900 font-semibold hover:underline"
              >
                Edit Preferences
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(currentCustomer.dietaryPreferences || []).length > 0 ? (
                currentCustomer.dietaryPreferences.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    🌱 {tag}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No specific preferences selected yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Order History & Real-Time Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                All Orders ({customerOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search order # or flour..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                >
                  {/* Order Top Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          Order #{order.orderNumber}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Order Total</p>
                      <p className="text-base font-bold text-slate-900">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Tracking & Delivery Details */}
                  <div className="bg-slate-50 rounded-xl p-3.5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Delivery Destination:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Milling & Shipping Status:</span>
                      {order.trackingNumber ? (
                        <p className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                          <Truck className="w-3 h-3 text-emerald-600" />
                          <span>Tracking: {order.trackingNumber}</span>
                        </p>
                      ) : (
                        <p className="text-slate-500 text-[11px]">
                          Est. Delivery: {order.estimatedDeliveryDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{item.productName}</p>
                            <p className="text-slate-500 text-[11px]">{item.packSize} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Detailed Invoice & Receipt</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('track-order')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Live Tracking
                      </button>
                      <button
                        onClick={() => reorderPastOrder(order)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">No matching orders found</h3>
              <p className="text-xs text-slate-500">
                {orderSearchQuery ? 'Try clearing your search query.' : 'You haven’t placed any orders yet.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Delivery Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Your Saved Delivery Addresses</h3>
              <p className="text-xs text-slate-500">
                Quickly select these addresses during checkout for seamless fresh flour deliveries.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddressModal()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentCustomer.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl border p-5 space-y-3 relative transition-all ${
                  addr.isDefault
                    ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-400/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-700">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Default Address
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenAddressModal(addr)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                      title="Edit address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCustomerAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  {addr.landmark && <p className="text-slate-500">Landmark: {addr.landmark}</p>}
                  <p className="font-medium text-slate-800">
                    {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>
                  <p className="text-slate-500 pt-1">Phone: {addr.phone}</p>
                </div>

                {!addr.isDefault && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold hover:underline"
                    >
                      Set as Default
                    </button>
                  </div>
                )}
              </div>
            ))}

            {(currentCustomer.addresses || []).length === 0 && (
              <div className="col-span-2 bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No saved addresses yet</p>
                <p className="text-[11px] text-slate-500">
                  Save your home, kitchen, or office address for 1-click checkout.
                </p>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Flour & Milling Preferences */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Custom Dietary & Milling Tags</h3>
              <p className="text-xs text-slate-500">
                Select your household dietary goals. We tailor grain milling suggestions and recipe recommendations to match your family&apos;s nutritional requirements.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {dietaryOptionsList.map((tag) => {
                const isSelected = (currentCustomer.dietaryPreferences || []).includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Edit Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Contact & Profile Information</h3>
                <p className="text-xs text-slate-500">Your official billing details for invoices and delivery SMS.</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={handleStartEditProfile}
                  className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Full Name</span>
                  <span className="font-semibold text-slate-900">{currentCustomer.fullName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{currentCustomer.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone Number</span>
                  <span className="font-semibold text-slate-900">{currentCustomer.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Data Privacy & Storage Transparency */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Where & How Your Customer Data is Stored
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Transparent breakdown answering how your order records, addresses, and profiles are persisted.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Storage & Cloud Sync</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your customer profile, address book, and order histories are safely synchronized in real-time with Google Cloud Firebase Firestore and backed up in your local offline cache.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Retention & Access</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Data remains accessible across all your devices permanently. You can log in from any phone or computer using your registered email/phone to access your flour milling history.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Access Security</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Protected with encrypted Google Cloud Firestore security rules, client-side isolation, and zero third-party advertising tracking.
                </p>
              </div>
            </div>

            {/* Export and data management */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Download Your Complete Profile & Order Log</p>
                <p className="text-[11px] text-slate-500">Export a machine-readable JSON copy of all your saved addresses and order histories.</p>
              </div>
              <button
                onClick={() => {
                  const dataToExport = {
                    customer: currentCustomer,
                    orders: customerOrders,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `shivaay-profile-${currentCustomer.id}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Profile JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit/Create Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Farm', 'Other'].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${
                        addressForm.label === lbl
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Full Name</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address / Flat / Building</label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="e.g. Flat 402, Greenfield Heights"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Locality / Sector</label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="e.g. Baner / Bandra West"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    required
                    maxLength={6}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultAddr"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="isDefaultAddr" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Set this as my default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice / Order Receipt Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">SHIVAAY AGRI PRODUCTS</h3>
                    <p className="text-[10px] text-slate-400">Fresh Milled Artisanal Flours</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Receipt Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Number</span>
                <strong className="text-slate-900 font-bold">{viewingOrder.orderNumber}</strong>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mt-2">Date Placed</span>
                <span className="text-slate-700">{new Date(viewingOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="text-slate-700 font-semibold uppercase">{viewingOrder.paymentMethod}</span>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mt-2">Current Status</span>
                <span className="text-emerald-700 font-bold">{viewingOrder.status}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Ordered Flour Items</span>
              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">{item.packSize} × {item.quantity} @ ₹{item.unitPrice}</p>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{viewingOrder.subtotal}</span>
              </div>
              {viewingOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({viewingOrder.couponCode})</span>
                  <span>-₹{viewingOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{viewingOrder.deliveryCharge === 0 ? 'FREE' : `₹${viewingOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{viewingOrder.totalAmount}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save Receipt</span>
              </button>
              <button
                onClick={() => {
                  reorderPastOrder(viewingOrder);
                  setViewingOrder(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reorder Items</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

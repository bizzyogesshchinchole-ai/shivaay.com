import React, { useState, useRef, useEffect } from 'react';
import { useStore, PageView } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import {
  Wheat,
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Truck,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Layers,
  BookOpen,
  Info,
  Store,
  UserCheck,
  User,
  LogIn,
  Award,
} from 'lucide-react';
import { CategoryId } from '../../types';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartItemCount,
    setIsCartOpen,
    categories,
    settings,
    products,
    setQuickViewProduct,
    currentCustomer,
    openAuthModal,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<typeof products>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search autocomplete
  useEffect(() => {
    if (localSearch.trim().length > 1) {
      const q = localSearch.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.grainType.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.includes(q))
      );
      setSearchSuggestions(filtered.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [localSearch, products]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigateTo('shop');
      setIsSearchOpen(false);
    }
  };

  const navLinks: { label: string; page: PageView; icon?: React.ReactNode }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All Flours', page: 'shop' },
    { label: 'Why Shivaay', page: 'why-shivaay' },
    { label: 'Grain Guide', page: 'grain-guide' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
          <span className="inline-block animate-pulse">🌾</span>
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-left focus:outline-none"
            aria-label="Shivaay Agri Products Home"
          >
            <BrandLogo size="md" variant="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateTo(link.page)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  currentPage === link.page
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Flour Categories
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateTo('shop', { categoryId: cat.id });
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors group"
                    >
                      <span className="font-medium group-hover:text-slate-900">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        {cat.id}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        navigateTo('shop');
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      View All Products →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar / Trigger */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 focus:outline-none"
                aria-label="Search flours"
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-medium text-slate-500">Search</span>
              </button>

              {/* Search Popover */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Search wheat, ragi, jowar, bajra, multigrain..."
                      autoFocus
                      className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    {localSearch && (
                      <button
                        type="button"
                        onClick={() => setLocalSearch('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>

                  {/* Suggestions dropdown */}
                  {searchSuggestions.length > 0 && (
                    <div className="mt-3 divide-y divide-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1 px-1">
                        Matching Flours
                      </div>
                      {searchSuggestions.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => {
                            navigateTo('product-detail', { productId: prod.id });
                            setIsSearchOpen(false);
                          }}
                          className="w-full py-2 px-1.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-lg transition-colors group"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-md object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-slate-700 truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Starts from ₹{prod.packSizes[0]?.price} • {prod.grainType}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {localSearch.trim().length > 1 && searchSuggestions.length === 0 && (
                    <p className="text-xs text-center text-slate-400 py-3">
                      No matching fresh flours found. Try searching &quot;wheat&quot;, &quot;ragi&quot;, or &quot;multigrain&quot;.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Track Order Link */}
            <button
              onClick={() => navigateTo('track-order')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Track Order Status"
            >
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Track Order</span>
            </button>

            {/* Customer Account Button */}
            {currentCustomer ? (
              <button
                onClick={() => navigateTo('account')}
                className={`p-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'account'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                }`}
                title={`Logged in as ${currentCustomer.fullName} (${currentCustomer.loyaltyTier || 'Member'})`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {currentCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block leading-none truncate max-w-[90px]">{currentCustomer.fullName.split(' ')[0]}</span>
                  <span className="text-[9px] text-emerald-700 font-normal leading-tight flex items-center gap-0.5">
                    <Award className="w-2.5 h-2.5" />
                    <span>{currentCustomer.loyaltyTier ? currentCustomer.loyaltyTier.replace('Grain Club ', '') : 'Member'}</span>
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Customer Sign In / Register"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cloud Live Status */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60"
              title="Google Firebase Firestore Cloud Sync Active"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Sync</span>
            </div>

            {/* Admin Portal Quick Button */}
            <button
              onClick={() => navigateTo('admin')}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Store Admin Dashboard & Banner Studio"
            >
              <Store className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 focus:outline-none"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[10px] font-bold bg-white text-slate-900 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  navigateTo(link.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  currentPage === link.page
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                navigateTo('track-order');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Track Your Order</span>
            </button>
            <button
              onClick={() => {
                if (currentCustomer) {
                  navigateTo('account');
                } else {
                  openAuthModal('login');
                }
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span>{currentCustomer ? `Account (${currentCustomer.fullName.split(' ')[0]})` : 'Customer Sign In / Register'}</span>
              </div>
              {currentCustomer && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {currentCustomer.loyaltyTier || 'Member'}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                navigateTo('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-slate-500" />
              <span>Admin Dashboard & Banner Studio</span>
            </button>
          </div>

          {/* Mobile Categories quick access */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              Flour Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigateTo('shop', { categoryId: cat.id });
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left hover:border-slate-300 transition-all"
                >
                  <p className="text-xs font-semibold text-slate-900">{cat.name}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{cat.shortDescription}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ProductQuickViewModal } from '../product/ProductQuickViewModal';
import { Product, CategoryId } from '../../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Wheat,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, selectedCategoryId, navigateTo } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(
    selectedCategoryId || 'all'
  );
  const [selectedGrain, setSelectedGrain] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Available unique grain types
  const grainTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.grainType));
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.grainType.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            (p.hindiName && p.hindiName.includes(q));
          if (!matches) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Grain
        if (selectedGrain !== 'all' && p.grainType !== selectedGrain) {
          return false;
        }

        // Bestsellers
        if (onlyBestsellers && !p.isBestseller) {
          return false;
        }

        // Price (check if min pack size price <= maxPrice)
        const minPrice = Math.min(...p.packSizes.map((ps) => ps.price));
        if (minPrice > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.packSizes[0].price - b.packSizes[0].price;
        }
        if (sortBy === 'price-desc') {
          return b.packSizes[0].price - a.packSizes[0].price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedGrain, onlyBestsellers, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedGrain('all');
    setMaxPrice(1200);
    setSortBy('featured');
    setOnlyBestsellers(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedGrain !== 'all' ||
    maxPrice < 1200 ||
    onlyBestsellers;

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#8C7B6B] mb-2">
            <button onClick={() => navigateTo('home')} className="hover:text-[#9A5C1B]">
              Home
            </button>
            <span>/</span>
            <span className="font-semibold text-[#2C241D]">Shop All Flours</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D]">
            Fresh Grain & Millet Flours
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A49] mt-1">
            Browse our complete selection of fresh, made-on-order stone ground and finely milled flours.
          </p>
        </div>

        {/* Top Control Bar: Search & View Options */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6DEC9] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8C7B6B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wheat, ragi, bajra, multigrain..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C48E3C] text-[#2C241D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8C7B6B] hover:text-[#2C241D]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Filter Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-xs font-bold text-[#4A3B2C] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#7A6A58] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
              >
                <option value="featured">Featured & Best</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#E6DEC9] shadow-xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9A5C1B]" />
                  <h3 className="font-bold text-sm text-[#2C241D]">Filter Flours</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-[#C62828] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#3B2A1A] text-white'
                        : 'text-[#4A3B2C] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] opacity-80">{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-[#3B2A1A] text-white'
                            : 'text-[#4A3B2C] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grain Type Filter */}
              <div className="border-t border-[#F0EAE1] pt-4">
                <h4 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider mb-2.5">
                  Grain Type
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedGrain('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      selectedGrain === 'all'
                        ? 'bg-[#9A5C1B] text-white'
                        : 'bg-[#FAF7F2] text-[#4A3B2C] border border-[#DDD3C2]'
                    }`}
                  >
                    All
                  </button>
                  {grainTypes.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrain(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        selectedGrain === g
                          ? 'bg-[#9A5C1B] text-white'
                          : 'bg-[#FAF7F2] text-[#4A3B2C] border border-[#DDD3C2]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Badges Filter */}
              <div className="border-t border-[#F0EAE1] pt-4">
                <h4 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider mb-2.5">
                  Preferences
                </h4>
                <label className="flex items-center gap-2 text-xs font-medium text-[#4A3B2C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyBestsellers}
                    onChange={(e) => setOnlyBestsellers(e.target.checked)}
                    className="rounded text-[#9A5C1B] focus:ring-[#9A5C1B]"
                  />
                  <span>⭐ Bestsellers Only</span>
                </label>
              </div>

              {/* Freshness Banner */}
              <div className="border-t border-[#F0EAE1] pt-4 bg-[#FAF0DC] p-3 rounded-xl">
                <p className="text-[11px] font-bold text-[#784712] flex items-center gap-1 mb-1">
                  <Wheat className="w-3.5 h-3.5" />
                  <span>On-Demand Milling</span>
                </p>
                <p className="text-[11px] text-[#6A4315] leading-snug">
                  Every pack is milled against your order within 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Product Listing Area */}
          <div className="lg:col-span-9">
            {/* Active Filters Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <span className="text-xs text-[#8C7B6B] font-semibold">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FAF0DC] text-[#784712] font-semibold px-2.5 py-0.5 rounded-full border border-[#D8C7B2]">
                    <span>Category: {selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedGrain !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FAF0DC] text-[#784712] font-semibold px-2.5 py-0.5 rounded-full border border-[#D8C7B2]">
                    <span>Grain: {selectedGrain}</span>
                    <button onClick={() => setSelectedGrain('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FAF0DC] text-[#784712] font-semibold px-2.5 py-0.5 rounded-full border border-[#D8C7B2]">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyBestsellers && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FAF0DC] text-[#784712] font-semibold px-2.5 py-0.5 rounded-full border border-[#D8C7B2]">
                    <span>Bestsellers</span>
                    <button onClick={() => setOnlyBestsellers(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#C62828] font-bold ml-auto hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-xs text-[#7A6A58] mb-4">
              <span>
                Showing <strong>{filteredProducts.length}</strong> fresh flour varieties
              </span>
              <span className="text-[11px] text-[#8C7B6B]">Prices adjust per pack size</span>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E6DEC9] p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF0DC] text-[#9A5C1B] flex items-center justify-center mx-auto">
                  <Wheat className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C241D]">
                  No matching flours found
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6A58] max-w-md mx-auto">
                  We couldn&apos;t find any flour matching your current filter criteria. Try clearing search terms or selecting &quot;All Categories&quot;.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#D49E48] hover:bg-[#C08A36] text-[#241B12] font-bold text-xs rounded-xl shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C241D]">Filter Flours</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-full text-[#8C7B6B]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider mb-2">
                Category
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border ${
                    selectedCategory === 'all'
                      ? 'bg-[#3B2A1A] text-white border-[#3B2A1A]'
                      : 'bg-[#FAF7F2] text-[#4A3B2C] border-[#DDD3C2]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left border ${
                      selectedCategory === c.id
                        ? 'bg-[#3B2A1A] text-white border-[#3B2A1A]'
                        : 'bg-[#FAF7F2] text-[#4A3B2C] border-[#DDD3C2]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grains */}
            <div>
              <h4 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider mb-2">
                Grain
              </h4>
              <div className="flex flex-wrap gap-2">
                {grainTypes.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrain(selectedGrain === g ? 'all' : g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      selectedGrain === g
                        ? 'bg-[#9A5C1B] text-white border-[#9A5C1B]'
                        : 'bg-[#FAF7F2] text-[#4A3B2C] border-[#DDD3C2]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4 border-t border-[#F0EAE1] flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-[#FAF7F2] border border-[#DDD3C2] text-[#4A3B2C] text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-[#D49E48] text-[#241B12] text-xs font-bold rounded-xl shadow-md"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

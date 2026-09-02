import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, PackSizeOption, GrainIngredient, NutritionFact } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Sparkles,
  Eye,
  X,
  Package,
  Layers,
  ArrowUpDown,
  Tag,
  DollarSign,
  Info,
} from 'lucide-react';

interface ProductFormData {
  id?: string;
  name: string;
  hindiName: string;
  slug: string;
  sku: string;
  category: string;
  grainType: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  packSizes: PackSizeOption[];
  ingredients: GrainIngredient[];
  preparationTimeDays: number;
  shelfLife: string;
  storageInstructions: string;
  nutritionFacts: NutritionFact[];
  suitableFor: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
}

const DEFAULT_FORM: ProductFormData = {
  name: '',
  hindiName: '',
  slug: '',
  sku: '',
  category: 'wheat',
  grainType: 'Wheat',
  shortDescription: '',
  longDescription: '',
  images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
  packSizes: [
    { size: '1 kg', weightInKg: 1, price: 90, originalPrice: 105, sku: 'SHV-PROD-1KG' },
    { size: '5 kg', weightInKg: 5, price: 425, originalPrice: 490, sku: 'SHV-PROD-5KG', isPopular: true },
  ],
  ingredients: [{ name: 'Whole Grain Flour', percentage: 100, benefit: 'High fiber, 100% natural bran and germ' }],
  preparationTimeDays: 1,
  shelfLife: '45 days from milling date',
  storageInstructions: 'Store in an airtight dry container away from direct sunlight.',
  nutritionFacts: [
    { label: 'Energy', amount: '360 kcal' },
    { label: 'Protein', amount: '12 g', dailyValue: '24%' },
    { label: 'Dietary Fiber', amount: '11 g', dailyValue: '40%' },
    { label: 'Carbohydrates', amount: '72 g' },
  ],
  suitableFor: ['Daily Rotis', 'Wholesome Family Meals'],
  isFeatured: false,
  isBestseller: false,
  isAvailable: true,
  rating: 4.9,
  reviewCount: 12,
};

export const ProductManagement: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductAvailability,
    navigateTo,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New item inputs in modal
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newSuitableTag, setNewSuitableTag] = useState('');

  // Filtering
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.grainType.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.hindiName && p.hindiName.includes(search));
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'available' && p.isAvailable) ||
        (selectedStatus === 'unavailable' && !p.isAvailable);
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return (a.packSizes[0]?.price || 0) - (b.packSizes[0]?.price || 0);
      if (sortBy === 'date') return (b.createdAt || '').localeCompare(a.createdAt || '');
      return 0;
    });

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData({
      ...DEFAULT_FORM,
      sku: `SHV-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.id || 'wheat',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      hindiName: product.hindiName || '',
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      grainType: product.grainType,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      images: product.images && product.images.length > 0 ? [...product.images] : [DEFAULT_FORM.images[0]],
      packSizes: product.packSizes && product.packSizes.length > 0 ? [...product.packSizes] : [...DEFAULT_FORM.packSizes],
      ingredients: product.ingredients && product.ingredients.length > 0 ? [...product.ingredients] : [...DEFAULT_FORM.ingredients],
      preparationTimeDays: product.preparationTimeDays || 1,
      shelfLife: product.shelfLife || '45 days from milling date',
      storageInstructions: product.storageInstructions || 'Store in an airtight container in a dry place.',
      nutritionFacts: product.nutritionFacts && product.nutritionFacts.length > 0 ? [...product.nutritionFacts] : [...DEFAULT_FORM.nutritionFacts],
      suitableFor: product.suitableFor && product.suitableFor.length > 0 ? [...product.suitableFor] : [...DEFAULT_FORM.suitableFor],
      isFeatured: !!product.isFeatured,
      isBestseller: !!product.isBestseller,
      isAvailable: product.isAvailable !== false,
      rating: product.rating || 4.9,
      reviewCount: product.reviewCount || 0,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const productPayload = {
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim(),
      slug,
      sku: formData.sku.trim() || `SHV-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      grainType: formData.grainType.trim() || 'Flour',
      shortDescription: formData.shortDescription.trim(),
      longDescription: formData.longDescription.trim(),
      images: formData.images.filter((img) => img.trim().length > 0),
      packSizes: formData.packSizes.length > 0 ? formData.packSizes : DEFAULT_FORM.packSizes,
      ingredients: formData.ingredients,
      preparationTimeDays: Number(formData.preparationTimeDays) || 1,
      shelfLife: formData.shelfLife,
      storageInstructions: formData.storageInstructions,
      nutritionFacts: formData.nutritionFacts,
      suitableFor: formData.suitableFor,
      isFeatured: formData.isFeatured,
      isBestseller: formData.isBestseller,
      isAvailable: formData.isAvailable,
      rating: Number(formData.rating) || 4.9,
      reviewCount: Number(formData.reviewCount) || 0,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  // Pack size helper
  const handleAddPackSize = () => {
    setFormData((prev) => ({
      ...prev,
      packSizes: [
        ...prev.packSizes,
        {
          size: '2 kg',
          weightInKg: 2,
          price: 180,
          originalPrice: 210,
          sku: `${prev.sku || 'SHV'}-2KG`,
          isPopular: false,
        },
      ],
    }));
  };

  const handleUpdatePackSize = (index: number, updates: Partial<PackSizeOption>) => {
    setFormData((prev) => {
      const next = [...prev.packSizes];
      next[index] = { ...next[index], ...updates };
      return { ...prev, packSizes: next };
    });
  };

  const handleRemovePackSize = (index: number) => {
    if (formData.packSizes.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      packSizes: prev.packSizes.filter((_, i) => i !== index),
    }));
  };

  // Ingredients helper
  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', percentage: 10, benefit: '' }],
    }));
  };

  const handleUpdateIngredient = (index: number, updates: Partial<GrainIngredient>) => {
    setFormData((prev) => {
      const next = [...prev.ingredients];
      next[index] = { ...next[index], ...updates };
      return { ...prev, ingredients: next };
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Nutrition helper
  const handleAddNutrition = () => {
    setFormData((prev) => ({
      ...prev,
      nutritionFacts: [...prev.nutritionFacts, { label: '', amount: '', dailyValue: '' }],
    }));
  };

  const handleUpdateNutrition = (index: number, updates: Partial<NutritionFact>) => {
    setFormData((prev) => {
      const next = [...prev.nutritionFacts];
      next[index] = { ...next[index], ...updates };
      return { ...prev, nutritionFacts: next };
    });
  };

  const handleRemoveNutrition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nutritionFacts: prev.nutritionFacts.filter((_, i) => i !== index),
    }));
  };

  // Add Image URL
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  // Add Suitable Tag
  const handleAddSuitableTag = () => {
    if (newSuitableTag.trim() && !formData.suitableFor.includes(newSuitableTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        suitableFor: [...prev.suitableFor, newSuitableTag.trim()],
      }));
      setNewSuitableTag('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-700" />
            <span>Flour Catalog & Products Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {products.length} products listed ({products.filter((p) => p.isAvailable).length} available for order milling)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={openAddModal}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Flour Product</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, grain..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-700"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-700"
          >
            <option value="all">All Stock Statuses</option>
            <option value="available">In Stock & Active</option>
            <option value="unavailable">Milling Paused / Out of Stock</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-700"
          >
            <option value="name">Sort by Name (A-Z)</option>
            <option value="price">Sort by Base Price</option>
            <option value="date">Sort by Newest Added</option>
          </select>
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category & Grain</th>
                <th className="py-3.5 px-4">Pack Sizes & Pricing</th>
                <th className="py-3.5 px-4">Status & Flags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <p className="font-medium">No products match the selected filters.</p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                      }}
                      className="mt-2 text-xs text-slate-900 underline font-semibold"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0] || DEFAULT_FORM.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                          {prod.hindiName && (
                            <p className="text-[11px] text-slate-500 font-hindi truncate">{prod.hindiName}</p>
                          )}
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Grain */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 capitalize">
                          {prod.category}
                        </span>
                        <p className="text-[11px] text-slate-500">{prod.grainType}</p>
                      </div>
                    </td>

                    {/* Pack sizes & prices */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {prod.packSizes.map((ps) => (
                            <span
                              key={ps.sku}
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                                ps.isPopular
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              {ps.size}: ₹{ps.price}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Lead Time: {prod.preparationTimeDays} day(s) milling
                        </p>
                      </div>
                    </td>

                    {/* Status toggles & Badges */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <button
                          onClick={() => toggleProductAvailability(prod.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            prod.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {prod.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Milling Paused</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          {prod.isFeatured && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Featured
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('product-detail', { productId: prod.id })}
                          title="View Live Listing in Store"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(prod.id)}
                          title="Duplicate Product as Copy"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Product Details"
                          className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Flour Listing?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900">
                {products.find((p) => p.id === deleteConfirmId)?.name}
              </strong>
              ? This action cannot be undone.
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
                  if (deleteConfirmId) deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProductId ? 'Modify Flour Listing' : 'Add New Flour Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure grain specifications, pack sizes, ingredients, and pricing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                  1. Basic Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pure Organic Ragi Flour"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hindi / Local Name</label>
                    <input
                      type="text"
                      value={formData.hindiName}
                      onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                      placeholder="e.g. शुद्ध रागी का आटा / नाचणी"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grain Type</label>
                    <input
                      type="text"
                      value={formData.grainType}
                      onChange={(e) => setFormData({ ...formData, grainType: e.target.value })}
                      placeholder="e.g. Finger Millet / Ragi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. SHV-RGI-01"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Tagline / Summary</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence description for shop cards"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Long Description & Milling Story</label>
                  <textarea
                    rows={3}
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    placeholder="Full product story, origin, milling technique, and freshness promise..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
                  />
                </div>
              </div>

              {/* Pack Sizes & Prices */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    2. Pack Sizes & Pricing
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddPackSize}
                    className="text-xs text-slate-900 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size Option
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.packSizes.map((ps, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-6 gap-2 items-center"
                    >
                      <div className="col-span-1 sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Label</label>
                        <input
                          type="text"
                          value={ps.size}
                          onChange={(e) => handleUpdatePackSize(idx, { size: e.target.value })}
                          placeholder="1 kg"
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={ps.weightInKg}
                          onChange={(e) => handleUpdatePackSize(idx, { weightInKg: parseFloat(e.target.value) || 1 })}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Selling (₹)</label>
                        <input
                          type="number"
                          value={ps.price}
                          onChange={(e) => handleUpdatePackSize(idx, { price: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">MRP (₹)</label>
                        <input
                          type="number"
                          value={ps.originalPrice || ''}
                          onChange={(e) => handleUpdatePackSize(idx, { originalPrice: parseInt(e.target.value) || undefined })}
                          placeholder="MRP"
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-1 flex items-center gap-1 pt-3">
                        <input
                          type="checkbox"
                          id={`pop-${idx}`}
                          checked={!!ps.isPopular}
                          onChange={(e) => handleUpdatePackSize(idx, { isPopular: e.target.checked })}
                          className="rounded text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor={`pop-${idx}`} className="text-[10px] text-slate-600 cursor-pointer font-medium">
                          Popular
                        </label>
                      </div>

                      <div className="col-span-1 sm:col-span-1 text-right pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemovePackSize(idx)}
                          disabled={formData.packSizes.length <= 1}
                          className="p-1 text-rose-500 hover:text-rose-700 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                  3. Image Gallery
                </h4>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (Unsplash or direct image link)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                  >
                    Add Image
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grain Ingredients & Ratio */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    4. Grain Ingredients & Health Benefits
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="text-xs text-slate-900 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Ingredient
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => handleUpdateIngredient(idx, { name: e.target.value })}
                          placeholder="Ingredient Name (e.g. Sharbati Wheat)"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={ing.percentage || ''}
                          onChange={(e) => handleUpdateIngredient(idx, { percentage: parseInt(e.target.value) || undefined })}
                          placeholder="%"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={ing.benefit}
                          onChange={(e) => handleUpdateIngredient(idx, { benefit: e.target.value })}
                          placeholder="Health benefit description"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable For Tags & Milling Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                  5. Usage, Shelf Life & Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Milling Lead Time (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={formData.preparationTimeDays}
                      onChange={(e) => setFormData({ ...formData, preparationTimeDays: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Shelf Life</label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                      placeholder="e.g. 45 days from milling date"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suitable For Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSuitableTag}
                      onChange={(e) => setNewSuitableTag(e.target.value)}
                      placeholder="Add tag (e.g. Soft Rotis, Weight Management, Diabetics)..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSuitableTag}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.suitableFor.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              suitableFor: prev.suitableFor.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flags: In Stock, Featured, Bestseller */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="font-semibold text-slate-800">In Stock (Milling Active)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="font-semibold text-slate-800">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="font-semibold text-slate-800">Bestseller Badge</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm"
                >
                  {editingProductId ? 'Save Product Changes' : 'Create Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

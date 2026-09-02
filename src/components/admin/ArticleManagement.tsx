import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { GrainGuideArticle } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  Sparkles,
} from 'lucide-react';

const DEFAULT_ARTICLE_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1608797178974-15b35a61dd78?auto=format&fit=crop&w=800&q=80',
];

export const ArticleManagement: React.FC = () => {
  const { grainArticles, addGrainArticle, updateGrainArticle, deleteGrainArticle, navigateTo } = useStore();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<GrainGuideArticle, 'id'>>({
    title: '',
    slug: '',
    grainName: '',
    hindiName: '',
    summary: '',
    content: '',
    culinaryUses: ['Rotis', 'Porridge'],
    storageTips: 'Keep in an airtight jar in a cool, dry place.',
    readTime: '3 min read',
    image: DEFAULT_ARTICLE_IMAGES[0],
    category: 'guide',
  });

  const [newCulinaryTag, setNewCulinaryTag] = useState('');

  const filteredArticles = grainArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.grainName.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingArticleId(null);
    setFormData({
      title: '',
      slug: '',
      grainName: '',
      hindiName: '',
      summary: '',
      content: '',
      culinaryUses: ['Daily Flatbreads', 'Health Breakfast Bowls'],
      storageTips: 'Keep in an airtight container away from humidity.',
      readTime: '4 min read',
      image: DEFAULT_ARTICLE_IMAGES[0],
      category: 'guide',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article: GrainGuideArticle) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      grainName: article.grainName,
      hindiName: article.hindiName || '',
      summary: article.summary,
      content: article.content,
      culinaryUses: [...article.culinaryUses],
      storageTips: article.storageTips,
      readTime: article.readTime,
      image: article.image,
      category: article.category,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const slug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const payload = {
      ...formData,
      slug,
      title: formData.title.trim(),
      grainName: formData.grainName.trim(),
      hindiName: formData.hindiName.trim(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
    };

    if (editingArticleId) {
      updateGrainArticle(editingArticleId, payload);
    } else {
      addGrainArticle(payload);
    }

    setIsModalOpen(false);
  };

  const handleAddCulinaryTag = () => {
    if (newCulinaryTag.trim() && !formData.culinaryUses.includes(newCulinaryTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        culinaryUses: [...prev.culinaryUses, newCulinaryTag.trim()],
      }));
      setNewCulinaryTag('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <span>Grain Knowledge Guide & Recipe Articles</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Educational nutrition profiles and cooking wisdom for traditional grains.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or grain name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 text-slate-900"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img
                  src={article.image || DEFAULT_ARTICLE_IMAGES[0]}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase">
                  {article.category}
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{article.grainName}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{article.title}</h3>
                <p className="text-slate-500 line-clamp-3 leading-relaxed">{article.summary}</p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigateTo('article-detail', { articleId: article.id })}
                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Read Article
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(article)}
                  className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(article.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Article?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this educational article?
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
                  if (deleteConfirmId) deleteGrainArticle(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-6">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingArticleId ? 'Modify Grain Article' : 'Write Grain Knowledge Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Why Ancient Emmer Wheat (Khapli) is Gentle on Digestion"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grain Name</label>
                  <input
                    type="text"
                    value={formData.grainName}
                    onChange={(e) => setFormData({ ...formData, grainName: e.target.value })}
                    placeholder="e.g. Khapli Wheat"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="wheat">Wheat</option>
                    <option value="millet">Millet</option>
                    <option value="multigrain">Multigrain</option>
                    <option value="guide">Guide & Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary Teaser</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short introductory hook for listings..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Body</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="In-depth educational content, nutritional breakdown, and heritage backstory..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage & Care Tips</label>
                <input
                  type="text"
                  value={formData.storageTips}
                  onChange={(e) => setFormData({ ...formData, storageTips: e.target.value })}
                  placeholder="e.g. Keep in an airtight container away from moisture..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* Culinary tags */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Culinary Dishes / Uses</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCulinaryTag}
                    onChange={(e) => setNewCulinaryTag(e.target.value)}
                    placeholder="Add dish use (e.g. Bhakri, Idli, Dosa, Khichdi)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddCulinaryTag}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.culinaryUses.map((tag, i) => (
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
                            culinaryUses: prev.culinaryUses.filter((_, idx) => idx !== i),
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

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  {editingArticleId ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Save,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/lib/store';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayPriority: number;
  isActive: boolean;
  _count?: { products: number };
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function AdminCategoriesPage() {
  const { showToast } = useStore();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New category form state
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState(50);
  const [creating, setCreating] = useState(false);

  // Inline edit state (per-row)
  const [editState, setEditState] = useState<Record<string, Partial<CategoryRow>>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {
      showToast('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }

  // Track inline edits
  function setField(id: string, field: keyof CategoryRow, value: unknown) {
    setEditState((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  }

  function getField<T extends keyof CategoryRow>(id: string, field: T, fallback: CategoryRow[T]): CategoryRow[T] {
    return (editState[id]?.[field] as CategoryRow[T]) ?? fallback;
  }

  async function saveCategory(cat: CategoryRow) {
    const changes = editState[cat.id];
    if (!changes || Object.keys(changes).length === 0) {
      showToast('No changes to save.');
      return;
    }
    setSavingId(cat.id);
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.error || 'Save failed.');
        return;
      }
      // Clear edit state for this row
      setEditState((prev) => { const n = { ...prev }; delete n[cat.id]; return n; });
      await loadCategories();
      showToast(`"${cat.name}" updated.`);
    } catch {
      showToast('Connection error.');
    } finally {
      setSavingId(null);
    }
  }

  async function deactivateCategory(cat: CategoryRow) {
    if (!confirm(`Deactivate "${cat.name}"? Products will remain but category won't appear in navigation.`)) return;
    setDeletingId(cat.id);
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('Deactivation failed.'); return; }
      await loadCategories();
      showToast(`"${cat.name}" deactivated.`);
    } catch {
      showToast('Connection error.');
    } finally {
      setDeletingId(null);
    }
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) { showToast('Name and slug are required.'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim(), description: newDesc.trim() || undefined, displayPriority: newPriority }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Create failed.'); return; }
      setShowNewForm(false);
      setNewName(''); setNewSlug(''); setNewDesc(''); setNewPriority(50);
      await loadCategories();
      showToast(`"${newName.trim()}" created.`);
    } catch {
      showToast('Connection error.');
    } finally {
      setCreating(false);
    }
  }

  const SHOE_SUBCATS = ['shoes-oxford','shoes-chelsea','shoes-derby','shoes-loafer','shoes-monk','shoes-boots'];
  const BAG_SUBCATS = ['bags-laptop','bags-handbag','bags-weekender','bags-backpack','bags-messenger'];
  const topLevel = categories.filter((c) => !SHOE_SUBCATS.includes(c.slug) && !BAG_SUBCATS.includes(c.slug));
  const shoeSubcats = categories.filter((c) => SHOE_SUBCATS.includes(c.slug));
  const bagSubcats = categories.filter((c) => BAG_SUBCATS.includes(c.slug));

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#767676]">Loading Taxonomy…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin" className="p-2 border border-[#E5E5E5] hover:border-[#111111] transition-colors">
            <ArrowLeft size={14} />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-0.5">
              Taxonomy Management
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#111111] uppercase tracking-wide">
              Categories
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="self-start sm:self-auto flex items-center space-x-2 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest px-4 py-2.5 transition-colors font-medium"
        >
          <Plus size={13} />
          <span>New Category</span>
        </button>
      </div>

      {/* Create Form */}
      {showNewForm && (
        <form onSubmit={createCategory} className="bg-white border border-[#E5E5E5] p-6 space-y-4">
          <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2">New Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Name *</label>
              <input
                type="text" required value={newName}
                onChange={(e) => { setNewName(e.target.value); if (!newSlug || newSlug === slugify(newName)) setNewSlug(slugify(e.target.value)); }}
                placeholder="e.g. Derby Shoes"
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Slug *</label>
              <input
                type="text" required value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="e.g. shoes-derby"
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Priority</label>
              <input
                type="number" value={newPriority} onChange={(e) => setNewPriority(parseInt(e.target.value || '50'))}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Description</label>
            <textarea rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#111111] resize-none"
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={creating}
              className="bg-[#111111] text-white text-xs uppercase tracking-widest px-4 py-2.5 flex items-center space-x-2 disabled:opacity-50 hover:bg-black transition-colors">
              {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              <span>{creating ? 'Creating…' : 'Create'}</span>
            </button>
            <button type="button" onClick={() => setShowNewForm(false)}
              className="text-xs uppercase tracking-widest px-4 py-2.5 border border-[#E5E5E5] hover:border-[#111111] transition-colors text-[#767676]">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category Group: Top-Level */}
      <CategoryGroup
        title="Top-Level Categories"
        categories={topLevel}
        editState={editState}
        getField={getField}
        setField={setField}
        saveCategory={saveCategory}
        deactivateCategory={deactivateCategory}
        savingId={savingId}
        deletingId={deletingId}
      />

      {/* Shoe Subcategories */}
      {shoeSubcats.length > 0 && (
        <CategoryGroup
          title="Shoe Subcategories"
          categories={shoeSubcats}
          editState={editState}
          getField={getField}
          setField={setField}
          saveCategory={saveCategory}
          deactivateCategory={deactivateCategory}
          savingId={savingId}
          deletingId={deletingId}
        />
      )}

      {/* Bag Subcategories */}
      {bagSubcats.length > 0 && (
        <CategoryGroup
          title="Bag Subcategories"
          categories={bagSubcats}
          editState={editState}
          getField={getField}
          setField={setField}
          saveCategory={saveCategory}
          deactivateCategory={deactivateCategory}
          savingId={savingId}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}

function CategoryGroup({
  title,
  categories,
  editState,
  getField,
  setField,
  saveCategory,
  deactivateCategory,
  savingId,
  deletingId,
}: {
  title: string;
  categories: CategoryRow[];
  editState: Record<string, Partial<CategoryRow>>;
  getField: <T extends keyof CategoryRow>(id: string, field: T, fallback: CategoryRow[T]) => CategoryRow[T];
  setField: (id: string, field: keyof CategoryRow, value: unknown) => void;
  saveCategory: (cat: CategoryRow) => Promise<void>;
  deactivateCategory: (cat: CategoryRow) => Promise<void>;
  savingId: string | null;
  deletingId: string | null;
}) {
  const hasEdits = (id: string) => editState[id] && Object.keys(editState[id]).length > 0;

  return (
    <div className="bg-white border border-[#E5E5E5]">
      <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center space-x-2">
        <Tag size={13} className="text-[#767676]" />
        <h2 className="font-serif text-sm uppercase tracking-widest text-[#111111]">{title}</h2>
        <span className="text-[10px] font-mono text-[#767676]">({categories.length})</span>
      </div>

      <div className="divide-y divide-[#F0F0F0]">
        {categories.map((cat) => (
          <div key={cat.id} className={`px-6 py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start ${hasEdits(cat.id) ? 'bg-amber-50/30' : ''}`}>
            {/* Name */}
            <div className="sm:col-span-3">
              <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Name</label>
              <input
                type="text"
                value={getField(cat.id, 'name', cat.name) as string}
                onChange={(e) => setField(cat.id, 'name', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Slug (read-only — changing slug breaks routes) */}
            <div className="sm:col-span-2">
              <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Slug</label>
              <div className="px-2.5 py-1.5 bg-neutral-50 border border-[#E5E5E5] text-[10px] font-mono text-[#767676] truncate">
                {cat.slug}
              </div>
            </div>

            {/* Priority */}
            <div className="sm:col-span-1">
              <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Priority</label>
              <input
                type="number"
                value={getField(cat.id, 'displayPriority', cat.displayPriority) as number}
                onChange={(e) => setField(cat.id, 'displayPriority', parseInt(e.target.value || '0'))}
                className="w-full px-2 py-1.5 border border-[#E5E5E5] text-xs font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Products count */}
            <div className="sm:col-span-1 flex flex-col">
              <span className="text-[9px] font-mono uppercase text-[#767676] mb-1">Products</span>
              <span className="text-xs font-mono text-[#111111] py-1.5">{cat._count?.products ?? '—'}</span>
            </div>

            {/* Active toggle */}
            <div className="sm:col-span-2 flex flex-col">
              <span className="text-[9px] font-mono uppercase text-[#767676] mb-1">Status</span>
              <label className="flex items-center space-x-2 cursor-pointer py-1.5">
                <input
                  type="checkbox"
                  checked={getField(cat.id, 'isActive', cat.isActive) as boolean}
                  onChange={(e) => setField(cat.id, 'isActive', e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#111111]"
                />
                <span className="text-[10px] font-mono text-[#767676]">
                  {(getField(cat.id, 'isActive', cat.isActive) as boolean) ? 'Active' : 'Hidden'}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="sm:col-span-3 flex items-center justify-end space-x-2 pt-1">
              {hasEdits(cat.id) && (
                <button
                  onClick={() => saveCategory(cat)}
                  disabled={savingId === cat.id}
                  className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-[#111111] text-white hover:bg-black transition-colors disabled:opacity-50"
                >
                  {savingId === cat.id
                    ? <Loader2 size={11} className="animate-spin" />
                    : <Save size={11} />}
                  <span>{savingId === cat.id ? 'Saving…' : 'Save'}</span>
                </button>
              )}
              <button
                onClick={() => deactivateCategory(cat)}
                disabled={deletingId === cat.id}
                title="Deactivate category"
                className="p-1.5 border border-[#E5E5E5] text-neutral-400 hover:text-rose-600 hover:border-rose-300 transition-colors disabled:opacity-40"
              >
                {deletingId === cat.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

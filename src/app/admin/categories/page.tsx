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

  const isShoeSub = (slug: string) => slug.startsWith('shoes-');
  const isBagSub = (slug: string) => slug.startsWith('bags-');
  const topLevel = categories.filter((c) => !isShoeSub(c.slug) && !isBagSub(c.slug));
  const shoeSubcats = categories.filter((c) => isShoeSub(c.slug));
  const bagSubcats = categories.filter((c) => isBagSub(c.slug));

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
          <Link href="/admin" className="p-2 border border-[#E5E5E5] hover:border-[#111111] transition-colors" title="Back to Dashboard">
            <ArrowLeft size={14} />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-0.5">
              Taxonomy Management
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#111111] uppercase tracking-wide">
              Categories &amp; Collections
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="self-start sm:self-auto flex items-center space-x-2 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest px-4 py-2.5 transition-colors font-medium shadow-xs"
        >
          <Plus size={13} />
          <span>{showNewForm ? 'Close Form' : 'New Category'}</span>
        </button>
      </div>

      {/* Create Form */}
      {showNewForm && (
        <form onSubmit={createCategory} className="bg-white border border-[#E5E5E5] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
            <h2 className="font-serif text-sm uppercase tracking-widest text-[#111111]">Create Atelier Category</h2>
            <span className="text-[10px] font-mono text-[#767676]">Will appear in catalog navigation and filter systems</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required value={newName}
                onChange={(e) => { setNewName(e.target.value); if (!newSlug || newSlug === slugify(newName)) setNewSlug(slugify(e.target.value)); }}
                placeholder="e.g. Leather Belts"
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="e.g. leather-belts"
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
              />
              <p className="text-[10px] font-mono text-neutral-400 mt-1">/collection/{newSlug || '...'}</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Display Priority
              </label>
              <input
                type="number" value={newPriority} onChange={(e) => setNewPriority(parseInt(e.target.value || '50'))}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
              />
              <p className="text-[10px] font-mono text-neutral-400 mt-1">Higher numbers rank first</p>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
              Editorial Description
            </label>
            <textarea rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Curated masterworks of British craftsmanship..."
              className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
            />
          </div>
          <div className="flex space-x-3 pt-1">
            <button type="submit" disabled={creating}
              className="bg-[#111111] text-white text-xs uppercase tracking-widest px-5 py-2.5 flex items-center space-x-2 disabled:opacity-50 hover:bg-black transition-colors">
              {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              <span>{creating ? 'Creating…' : 'Create Category'}</span>
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
          title="Footwear Subcategories"
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
          title="Luggage &amp; Bag Subcategories"
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
    <div className="bg-white border border-[#E5E5E5] shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center space-x-2">
          <Tag size={13} className="text-[#767676]" />
          <h2 className="font-serif text-sm uppercase tracking-widest text-[#111111]">{title}</h2>
          <span className="text-[10px] font-mono text-[#767676]">({categories.length})</span>
        </div>
        <span className="text-[10px] font-mono text-[#767676] hidden sm:inline">
          Edits auto-highlight in amber. Click Save to persist changes.
        </span>
      </div>

      {/* Table Container with Overflow Protection */}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-6 py-2.5 bg-neutral-50 border-b border-[#E5E5E5] text-[9px] font-mono uppercase tracking-widest text-[#767676] items-center">
            <div className="col-span-4">Category Name</div>
            <div className="col-span-3">URL Slug</div>
            <div className="col-span-1 text-center">Priority</div>
            <div className="col-span-1 text-center">Pieces</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F0F0F0]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`px-6 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors ${
                  hasEdits(cat.id) ? 'bg-amber-50/40 border-l-2 border-l-amber-500' : 'hover:bg-neutral-50/40'
                }`}
              >
                {/* Name */}
                <div className="col-span-4 pr-2">
                  <input
                    type="text"
                    value={getField(cat.id, 'name', cat.name) as string}
                    onChange={(e) => setField(cat.id, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E5E5] text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] transition-colors bg-white"
                  />
                </div>

                {/* Slug */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-100 border border-[#E5E5E5] text-[10px] font-mono text-[#767676] truncate">
                    <span className="truncate">{cat.slug}</span>
                    <Link
                      href={`/collection/${cat.slug}`}
                      target="_blank"
                      className="ml-auto text-neutral-400 hover:text-black transition-colors p-0.5"
                      title="Preview collection"
                    >
                      ↗
                    </Link>
                  </div>
                </div>

                {/* Priority */}
                <div className="col-span-1 text-center">
                  <input
                    type="number"
                    value={getField(cat.id, 'displayPriority', cat.displayPriority) as number}
                    onChange={(e) => setField(cat.id, 'displayPriority', parseInt(e.target.value || '0'))}
                    className="w-full px-2 py-1.5 border border-[#E5E5E5] text-xs font-mono text-center focus:outline-none focus:border-[#111111] transition-colors bg-white"
                  />
                </div>

                {/* Products Count */}
                <div className="col-span-1 text-center">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono bg-neutral-100 border border-neutral-200 text-[#111111]">
                    {cat._count?.products ?? 0}
                  </span>
                </div>

                {/* Active Toggle */}
                <div className="col-span-1 flex justify-center">
                  <label className="flex items-center space-x-1.5 cursor-pointer" title="Toggle visibility">
                    <input
                      type="checkbox"
                      checked={getField(cat.id, 'isActive', cat.isActive) as boolean}
                      onChange={(e) => setField(cat.id, 'isActive', e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#111111]"
                    />
                    <span className={`text-[9px] font-mono uppercase ${
                      (getField(cat.id, 'isActive', cat.isActive) as boolean) ? 'text-emerald-700' : 'text-neutral-400'
                    }`}>
                      {(getField(cat.id, 'isActive', cat.isActive) as boolean) ? 'Live' : 'Off'}
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end space-x-1.5">
                  {hasEdits(cat.id) && (
                    <button
                      onClick={() => saveCategory(cat)}
                      disabled={savingId === cat.id}
                      className="flex items-center space-x-1 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1.5 bg-[#111111] text-white hover:bg-black transition-colors disabled:opacity-50"
                      title="Save changes"
                    >
                      {savingId === cat.id ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                      <span>Save</span>
                    </button>
                  )}
                  <button
                    onClick={() => deactivateCategory(cat)}
                    disabled={deletingId === cat.id}
                    title="Deactivate or remove category"
                    className="p-1.5 border border-[#E5E5E5] text-neutral-400 hover:text-rose-600 hover:border-rose-300 transition-colors disabled:opacity-40"
                  >
                    {deletingId === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

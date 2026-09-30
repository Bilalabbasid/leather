'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
  Upload,
  Loader2,
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { Product, ProductImage, Variant, Category } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/data';
import { useStore } from '@/lib/store';

interface StagedImage {
  id: string;
  url: string;
  publicId?: string | null;
  altText: string;
  position: number;
  isPrimary: boolean;
  uploading?: boolean;
}

interface ProductEditorProps {
  params: { id: string };
}

export default function AdminProductEditorPage({ params }: ProductEditorProps) {
  const router = useRouter();
  const { showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [productSlug, setProductSlug] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [styleCode, setStyleCode] = useState('');
  const [categoryId, setCategoryId] = useState('cat-jackets');
  const [priceInPence, setPriceInPence] = useState<number>(185000);
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'ARCHIVED'>('ACTIVE');
  const [material, setMaterial] = useState('Italian Full-Grain Calfskin');
  const [leatherGrade, setLeatherGrade] = useState('');
  const [colorFamily, setColorFamily] = useState('Black');
  const [description, setDescription] = useState('');
  const [craftNotes, setCraftNotes] = useState('');
  const [careDetails, setCareDetails] = useState('');
  const [isFeaturedHero, setIsFeaturedHero] = useState(false);
  const [isTopSelling, setIsTopSelling] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [displayPriority, setDisplayPriority] = useState(0);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [images, setImages] = useState<StagedImage[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Load product + categories
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${params.id}`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories?.length) setCategories(catData.categories);
        }

        if (!prodRes.ok) {
          showToast('Product not found.');
          router.push('/admin/products');
          return;
        }

        const prodData = await prodRes.json();
        const p: Product = prodData.product;

        setTitle(p.title);
        setSlug(p.slug);
        setProductSlug(p.slug);
        setStyleCode(p.styleCode);
        setCategoryId(p.categoryId);
        setPriceInPence(p.priceInPence);
        setStatus(p.status);
        setMaterial(p.material);
        setLeatherGrade(p.leatherGrade || '');
        setColorFamily(p.colorFamily);
        setDescription(p.description);
        setCraftNotes(p.craftNotes || '');
        setCareDetails(p.careDetails || '');
        setIsFeaturedHero(p.isFeaturedHero);
        setIsTopSelling(p.isTopSelling);
        setIsNewArrival(p.isNewArrival);
        setDisplayPriority(p.displayPriority);
        setMetaTitle(p.metaTitle || '');
        setMetaDescription(p.metaDescription || '');
        setImages(
          (p.images || []).map((img: ProductImage) => ({
            id: img.id,
            url: img.url,
            publicId: img.publicId,
            altText: img.altText || '',
            position: img.position,
            isPrimary: img.isPrimary,
          }))
        );
        setVariants(p.variants || []);
      } catch (err) {
        console.error('Error loading product', err);
        showToast('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  // Image upload
  const uploadFile = useCallback(async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      showToast(`${file.name}: unsupported format.`);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(`${file.name}: exceeds 8MB limit.`);
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => [
      ...prev,
      {
        id: tempId,
        url: previewUrl,
        altText: `${title} product view`,
        position: prev.length,
        isPrimary: prev.length === 0,
        uploading: true,
      },
    ]);
    setPendingUploads((n) => n + 1);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Upload failed');
        setImages((prev) => prev.filter((img) => img.id !== tempId));
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === tempId
            ? { ...img, id: `img-${Date.now()}`, url: data.url, publicId: data.publicId, uploading: false }
            : img
        )
      );
      showToast('Image uploaded.');
    } catch {
      showToast('Upload failed — network error.');
      setImages((prev) => prev.filter((img) => img.id !== tempId));
      URL.revokeObjectURL(previewUrl);
    } finally {
      setPendingUploads((n) => n - 1);
      URL.revokeObjectURL(previewUrl);
    }
  }, [title, showToast]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [uploadFile]);

  // Image controls
  const moveImage = (idx: number, dir: 'up' | 'down') => {
    const next = dir === 'up' ? idx - 1 : idx + 1;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setImages(copy.map((img, i) => ({ ...img, position: i })));
  };

  const setPrimary = (idx: number) =>
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === idx })));

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) updated[0].isPrimary = true;
    setImages(updated);
  };

  // Variant controls
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}`,
        sku: `${styleCode || 'ACM'}-${String(variants.length + 1).padStart(2, '0')}`,
        size: '',
        color: colorFamily || 'Black',
        colorHex: '#111111',
        stockQuantity: 0,
        isActive: true,
        displayPriority: variants.length + 1,
        productId: params.id,
      },
    ]);
  };

  const updateVariant = (idx: number, field: keyof Variant, value: unknown) =>
    setVariants(variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));

  const removeVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx));

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { showToast('Product title is required.'); return; }
    if (!styleCode.trim()) { showToast('Style code / SKU is required.'); return; }
    if (variants.length === 0) { showToast('At least one variant/size is required.'); return; }
    if (pendingUploads > 0) { showToast('Please wait for image uploads to finish.'); return; }

    setSaving(true);
    setSaved(false);

    const payload = {
      title: title.trim(),
      slug,
      styleCode: styleCode.trim(),
      categoryId,
      priceInPence,
      status,
      material: material.trim(),
      leatherGrade: leatherGrade.trim() || null,
      colorFamily: colorFamily.trim(),
      description: description.trim(),
      craftNotes: craftNotes.trim() || null,
      careDetails: careDetails.trim() || null,
      isFeaturedHero,
      isTopSelling,
      isNewArrival,
      displayPriority,
      metaTitle: metaTitle.trim() || `${title.trim()} | ACEMEN London`,
      metaDescription: metaDescription.trim() || description.trim(),
      images: images.map((img, i) => ({
        url: img.url,
        altText: img.altText || `${title} — view ${i + 1}`,
        position: i,
        isPrimary: img.isPrimary,
      })),
      variants: variants.map((v, i) => ({
        id: v.id?.startsWith('var-') ? undefined : v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        colorHex: v.colorHex,
        materialVariation: v.materialVariation,
        priceOverrideInPence: v.priceOverrideInPence,
        stockQuantity: v.stockQuantity,
        isActive: v.isActive,
        displayPriority: v.displayPriority ?? i,
      })),
    };

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.issues
          ? data.issues.map((i: { message: string }) => i.message).join('; ')
          : data.error || 'Failed to save product.';
        showToast(msg);
        setSaving(false);
        return;
      }

      setProductSlug(data.product?.slug || slug);
      showToast(`"${title}" saved successfully.`);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      showToast('Connection error while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#767676]">
          Loading Product Specifications…
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/products" className="p-2 border border-[#E5E5E5] hover:border-[#111111] transition-colors">
            <ArrowLeft size={14} />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-0.5">
              Editing — {styleCode}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#111111] uppercase tracking-wide">
              {title || 'Untitled Piece'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto flex-wrap gap-2">
          {productSlug && (
            <Link
              href={`/products/${productSlug}`}
              target="_blank"
              className="text-xs uppercase tracking-widest px-4 py-2.5 border border-[#E5E5E5] text-[#767676] hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center space-x-1.5 font-medium"
            >
              <ExternalLink size={12} />
              <span>View on Site</span>
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`text-white text-xs uppercase tracking-widest px-5 py-2.5 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 ${
              saved ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-[#111111] hover:bg-black'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : saved ? (
              <>
                <CheckCircle size={14} />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">

          {/* Core Identification */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-5">
            <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2 text-[#111111]">
              Core Identification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                  Style Code / SKU <span className="text-rose-500">*</span>
                </label>
                <input type="text" required value={styleCode} onChange={(e) => setStyleCode(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                URL Slug
              </label>
              <input type="text" value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#767676] bg-neutral-50 focus:outline-none focus:border-[#111111] transition-colors"
              />
              <p className="text-[10px] font-mono text-neutral-400 mt-1">
                acemen.uk/products/<span className="text-[#767676]">{slug}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                  Category
                </label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] bg-white focus:outline-none focus:border-[#111111] transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                  Price (GBP) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#767676] pointer-events-none">£</span>
                  <input type="number" step="0.01" min="0" required
                    value={(priceInPence / 100).toFixed(2)}
                    onChange={(e) => setPriceInPence(Math.round(parseFloat(e.target.value || '0') * 100))}
                    className="w-full pl-7 pr-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
                <p className="text-[10px] font-mono text-neutral-400 mt-1">{priceInPence}p integer</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                  Status
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'DRAFT' | 'ARCHIVED')}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] bg-white focus:outline-none focus:border-[#111111] transition-colors"
                >
                  <option value="ACTIVE">ACTIVE — Live</option>
                  <option value="DRAFT">DRAFT — Hidden</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2 text-[#111111]">
              Materials &amp; Tannery Provenance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Primary Material</label>
                <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Tannery Grade</label>
                <input type="text" value={leatherGrade} onChange={(e) => setLeatherGrade(e.target.value)}
                  placeholder="e.g. Italian 1.2mm Waxed Steerhide"
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Color Family</label>
                <input type="text" value={colorFamily} onChange={(e) => setColorFamily(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Editorial */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-4">
            <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2 text-[#111111]">
              Editorial Content &amp; Preservation
            </h2>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Artisanal Construction Notes
              </label>
              <textarea rows={2} value={craftNotes} onChange={(e) => setCraftNotes(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Care &amp; Preservation
              </label>
              <textarea rows={2} value={careDetails} onChange={(e) => setCareDetails(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <h2 className="font-serif text-sm uppercase tracking-widest text-[#111111]">
                Variants &amp; Stock ({variants.length})
              </h2>
              <button type="button" onClick={addVariant}
                className="text-[10px] uppercase font-mono tracking-widest text-[#111111] border border-[#E5E5E5] px-2.5 py-1.5 hover:border-[#111111] flex items-center space-x-1 transition-colors"
              >
                <Plus size={10} />
                <span>Add Variant</span>
              </button>
            </div>

            {variants.length === 0 && (
              <p className="text-xs text-[#767676] font-mono py-1">No variants. At least one is required.</p>
            )}

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={v.id || idx}
                  className="p-3 border border-[#E5E5E5] bg-neutral-50/50 grid grid-cols-2 sm:grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Size / Label</label>
                    <input type="text" required value={v.size} onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                      placeholder="e.g. UK 9 / Medium"
                      className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">SKU</label>
                    <input type="text" required value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                      className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white font-mono text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Color</label>
                    <input type="text" required value={v.color} onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                      className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[9px] font-mono uppercase text-[#767676] mb-1">Stock</label>
                    <input type="number" min="0" required value={v.stockQuantity}
                      onChange={(e) => updateVariant(idx, 'stockQuantity', parseInt(e.target.value || '0'))}
                      className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white font-mono text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-between space-x-2">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="checkbox" checked={v.isActive} onChange={(e) => updateVariant(idx, 'isActive', e.target.checked)} className="w-3 h-3" />
                      <span className="text-[9px] font-mono text-[#767676]">Active</span>
                    </label>
                    <button type="button" onClick={() => removeVariant(idx)}
                      className="p-1 text-neutral-400 hover:text-rose-600 transition-colors" title="Remove">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">

          {/* Gallery */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <h2 className="font-serif text-sm uppercase tracking-widest text-[#111111]">
                Gallery &amp; Angles
              </h2>
              <span className="text-[10px] font-mono text-[#767676]">
                {images.filter((img) => !img.uploading).length} images
              </span>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed cursor-pointer py-8 flex flex-col items-center justify-center space-y-2 transition-colors select-none ${
                isDragOver ? 'border-[#111111] bg-neutral-50' : 'border-[#D4D4D4] hover:border-[#767676] hover:bg-neutral-50/50'
              }`}
            >
              <Upload size={18} className="text-[#767676]" />
              <p className="text-xs text-[#767676] text-center">
                Drag &amp; drop or <span className="underline">browse</span>
              </p>
              <p className="text-[10px] font-mono text-neutral-400">JPEG · PNG · WEBP · AVIF · 8MB max</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {pendingUploads > 0 && (
              <div className="flex items-center space-x-2 text-xs font-mono text-[#767676]">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Uploading {pendingUploads} file{pendingUploads > 1 ? 's' : ''}…</span>
              </div>
            )}

            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div key={img.id || idx}
                    className={`flex items-center space-x-3 p-2 border transition-colors ${
                      img.isPrimary ? 'border-[#111111] bg-neutral-50' : 'border-[#E5E5E5]'
                    }`}
                  >
                    <div className="w-12 h-14 relative bg-neutral-100 border border-[#E5E5E5] flex-shrink-0 overflow-hidden">
                      {img.uploading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 size={14} className="animate-spin text-neutral-400" />
                        </div>
                      ) : (
                        <Image src={img.url} alt="Product" fill sizes="48px" className="object-cover object-center" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 mb-1">
                        {img.isPrimary && (
                          <span className="text-[9px] font-mono uppercase bg-[#111111] text-white px-1.5 py-0.5">Primary</span>
                        )}
                        <span className="text-[10px] font-mono text-[#767676]">#{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={img.altText}
                        onChange={(e) =>
                          setImages(images.map((im, i) => i === idx ? { ...im, altText: e.target.value } : im))
                        }
                        placeholder="Alt text"
                        className="w-full text-[10px] px-1.5 py-1 border border-[#E5E5E5] focus:outline-none focus:border-[#111111] text-[#767676]"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <button type="button" onClick={() => moveImage(idx, 'up')} disabled={idx === 0}
                        className="p-1 border border-[#E5E5E5] hover:bg-neutral-100 disabled:opacity-25 transition-colors" title="Move up">
                        <ArrowUp size={11} />
                      </button>
                      <button type="button" onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1}
                        className="p-1 border border-[#E5E5E5] hover:bg-neutral-100 disabled:opacity-25 transition-colors" title="Move down">
                        <ArrowDown size={11} />
                      </button>
                      {!img.isPrimary && (
                        <button type="button" onClick={() => setPrimary(idx)}
                          className="p-1 border border-[#E5E5E5] hover:bg-neutral-100 text-[#767676] hover:text-[#111111] transition-colors" title="Set as primary">
                          <Star size={11} />
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(idx)}
                        className="p-1 text-neutral-400 hover:text-rose-600 transition-colors" title="Remove">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Merchandising */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-3">
            <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2 text-[#111111]">
              Merchandising &amp; Placement
            </h2>
            {[
              { label: 'Hero Spotlight Piece', desc: 'Homepage hero', val: isFeaturedHero, set: setIsFeaturedHero },
              { label: 'Iconic / Top Selling', desc: '"Top Selling" row', val: isTopSelling, set: setIsTopSelling },
              { label: 'New Arrival', desc: '"New Arrivals" section', val: isNewArrival, set: setIsNewArrival },
            ].map(({ label, desc, val, set }) => (
              <label key={label} className="flex items-start space-x-3 cursor-pointer py-0.5">
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0 accent-[#111111]"
                />
                <div>
                  <p className="text-xs text-[#111111]">{label}</p>
                  <p className="text-[10px] font-mono text-[#767676]">{desc}</p>
                </div>
              </label>
            ))}

            <div className="pt-2">
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">
                Display Priority
              </label>
              <input type="number" value={displayPriority}
                onChange={(e) => setDisplayPriority(parseInt(e.target.value || '0'))}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 border border-[#E5E5E5] space-y-3">
            <h2 className="font-serif text-sm uppercase tracking-widest border-b border-[#E5E5E5] pb-2 text-[#111111]">
              Search Engine Optimization
            </h2>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Meta Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={`${title} | ACEMEN London`}
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
              />
              {metaTitle && (
                <p className={`text-[10px] font-mono mt-1 ${metaTitle.length > 60 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {metaTitle.length} / 60 characters
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-1.5">Meta Description</label>
              <textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Editorial meta description…"
                className="w-full px-3 py-2.5 border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
              />
              {metaDescription && (
                <p className={`text-[10px] font-mono mt-1 ${metaDescription.length > 160 ? 'text-amber-600' : 'text-neutral-400'}`}>
                  {metaDescription.length} / 160 characters
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

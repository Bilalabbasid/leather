'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPence } from '@/lib/config';
import { useStore } from '@/lib/store';

export default function AdminProductsPage() {
  const { showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'ARCHIVED'>('ALL');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?status=ALL');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleMerch = async (productId: string, field: 'isFeaturedHero' | 'isTopSelling' | 'isNewArrival', currentVal: boolean) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentVal }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, [field]: !currentVal } : p))
        );
        showToast('Merchandising flag updated.');
      } else {
        showToast('Failed to update merchandising flag.');
      }
    } catch {
      showToast('Connection error updating placement.');
    }
  };

  const handleArchive = async (productId: string, title: string) => {
    if (!confirm(`Are you certain you wish to archive "${title}" from the atelier catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: 'ARCHIVED' } : p))
        );
        showToast(`"${title}" has been archived.`);
      } else {
        showToast('Failed to archive product.');
      }
    } catch {
      showToast('Error archiving product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.styleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-1">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
            Masterpieces & Outerwear
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest px-4 py-2.5 transition-colors flex items-center space-x-2 font-medium self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Leather Piece</span>
        </Link>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="bg-white p-4 border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, material..."
            className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
          />
          <Search size={14} className="text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-[11px] font-mono uppercase text-[#767676]">Status:</span>
          {(['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[10px] uppercase font-mono px-2.5 py-1 border transition-colors ${
                statusFilter === s
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#E5E5E5] text-[#767676] hover:border-neutral-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#767676]">
              Retrieving Catalog...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#767676]">
            No masterpieces match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-neutral-50 text-[10px] font-mono uppercase tracking-widest text-[#767676]">
                  <th className="py-3 px-4">Piece</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Merchandising</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredProducts.map((product) => {
                  const primaryImg =
                    product.images?.find((img) => img.isPrimary) || product.images?.[0];
                  const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + v.stockQuantity,
                    0
                  );

                  return (
                    <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-14 relative bg-neutral-100 border border-[#E5E5E5] flex-shrink-0 overflow-hidden">
                            {primaryImg ? (
                              <Image
                                src={primaryImg.url}
                                alt={product.title}
                                fill
                                sizes="48px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400 font-mono">
                                No Img
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-serif text-sm font-medium text-[#111111]">
                              {product.title}
                            </div>
                            <div className="text-[10px] text-[#767676] truncate max-w-xs">
                              {product.leatherGrade || product.material}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#767676]">
                        {product.styleCode}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#767676]">
                        {product.category?.name || product.categoryId}
                      </td>

                      {/* Price in Pence */}
                      <td className="py-3 px-4 font-mono text-[#111111]">
                        {formatPence(product.priceInPence)}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`px-2 py-0.5 border text-[10px] ${
                            totalStock <= 3
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-neutral-50 text-[#111111] border-neutral-200'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                            product.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : product.status === 'DRAFT'
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Merchandising Toggles */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() =>
                              handleToggleMerch(product.id, 'isFeaturedHero', product.isFeaturedHero)
                            }
                            className={`px-1.5 py-0.5 text-[9px] font-mono border transition-colors ${
                              product.isFeaturedHero
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'text-[#767676] border-[#E5E5E5] hover:border-neutral-400'
                            }`}
                            title="Toggle Hero Spotlight"
                          >
                            Hero
                          </button>
                          <button
                            onClick={() =>
                              handleToggleMerch(product.id, 'isTopSelling', product.isTopSelling)
                            }
                            className={`px-1.5 py-0.5 text-[9px] font-mono border transition-colors ${
                              product.isTopSelling
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'text-[#767676] border-[#E5E5E5] hover:border-neutral-400'
                            }`}
                            title="Toggle Iconic Badge"
                          >
                            Iconic
                          </button>
                          <button
                            onClick={() =>
                              handleToggleMerch(product.id, 'isNewArrival', product.isNewArrival)
                            }
                            className={`px-1.5 py-0.5 text-[9px] font-mono border transition-colors ${
                              product.isNewArrival
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'text-[#767676] border-[#E5E5E5] hover:border-neutral-400'
                            }`}
                            title="Toggle New Arrival"
                          >
                            New
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#767676] hover:text-[#111111] transition-colors"
                            title="Preview on storefront"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-[#767676] hover:text-[#111111] transition-colors"
                            title="Edit product"
                          >
                            <Edit size={14} />
                          </Link>

                          {product.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleArchive(product.id, product.title)}
                              className="p-1.5 text-neutral-400 hover:text-rose-700 transition-colors"
                              title="Archive product"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

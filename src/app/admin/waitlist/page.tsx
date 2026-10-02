'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Loader2,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useStore } from '@/lib/store';

interface WaitlistRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  category: string;
  productTitle?: string | null;
  productId?: string | null;
  preferredSize?: string | null;
  notes?: string | null;
  status: 'PENDING' | 'CONTACTED' | 'ALLOCATED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export default function AdminWaitlistPage() {
  const { showToast } = useStore();
  const [entries, setEntries] = useState<WaitlistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Edit / Details Modal State
  const [editingEntry, setEditingEntry] = useState<WaitlistRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New Entry Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    category: 'Waitlist',
    productTitle: '',
    preferredSize: '',
    notes: '',
    status: 'PENDING' as const,
  });

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/waitlist');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error('Failed to load waitlist entries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWaitlist();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingEntry.name,
          email: editingEntry.email,
          phone: editingEntry.phone,
          deliveryAddress: editingEntry.deliveryAddress,
          category: editingEntry.category,
          productTitle: editingEntry.productTitle,
          preferredSize: editingEntry.preferredSize,
          status: editingEntry.status,
          notes: editingEntry.notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEntries((prev) =>
          prev.map((item) => (item.id === editingEntry.id ? data.entry : item))
        );
        showToast('Waitlist dossier updated successfully.');
        setEditingEntry(null);
      } else {
        showToast('Failed to update waitlist entry.');
      }
    } catch {
      showToast('Error updating dossier.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: WaitlistRecord['status']) => {
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEntries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (editingEntry && editingEntry.id === id) {
          setEditingEntry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Status updated to ${newStatus}.`);
      } else {
        showToast('Status update failed.');
      }
    } catch {
      showToast('Error modifying status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this waitlist entry?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEntries((prev) => prev.filter((item) => item.id !== id));
        showToast('Waitlist record removed.');
      } else {
        showToast('Failed to delete entry.');
      }
    } catch {
      showToast('Error deleting record.');
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });

      if (res.ok) {
        const data = await res.json();
        setEntries((prev) => [data.entry, ...prev]);
        showToast('New waitlist entry registered.');
        setIsNewModalOpen(false);
        setNewFormData({
          name: '',
          email: '',
          phone: '',
          deliveryAddress: '',
          category: 'Waitlist',
          productTitle: '',
          preferredSize: '',
          notes: '',
          status: 'PENDING',
        });
      } else {
        showToast('Failed to create waitlist record.');
      }
    } catch {
      showToast('Error registering client.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ALLOCATED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CONTACTED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.productTitle && e.productTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' ? true : e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] block mb-1">
            Private Allocation & Pre-Order Registry
          </span>
          <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
            Waitlist Dossiers
          </h1>
          <p className="text-xs text-[#767676] mt-1">
            Review, edit client contact information, update confirmed delivery addresses, and manage allocation fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <Plus size={14} />
            <span>Manual Registration</span>
          </button>

          <button
            onClick={loadWaitlist}
            className="text-xs font-mono uppercase tracking-wider px-3.5 py-2 border border-[#E5E5E5] hover:border-[#111111] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="bg-white p-4 border border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, address, email..."
            className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
          />
          <Search size={14} className="text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono uppercase text-[#767676] mr-1">Status:</span>
          {(['ALL', 'PENDING', 'CONTACTED', 'ALLOCATED', 'FULFILLED', 'CANCELLED'] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[10px] uppercase font-mono px-2.5 py-1 border transition-colors whitespace-nowrap ${
                  statusFilter === s
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-[#E5E5E5] text-[#767676] hover:border-neutral-400'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#767676]">
              Loading Waitlist Dossiers...
            </span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#767676]">
            No client waitlist records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-neutral-50 text-[10px] font-mono uppercase tracking-widest text-[#767676]">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact Info (Email & Phone)</th>
                  <th className="py-3 px-4">Delivery Destination</th>
                  <th className="py-3 px-4">Requested Piece / Fit</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Edit Dossier</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-medium text-[#111111] whitespace-nowrap">
                      {entry.name}
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4 text-[#111111]">
                      <div className="font-mono text-[11px] text-[#111111]">{entry.phone}</div>
                      <div className="text-[11px] text-[#767676]">{entry.email}</div>
                    </td>

                    {/* Delivery Address */}
                    <td className="py-3.5 px-4 text-[#111111] max-w-[220px]">
                      <div className="truncate text-[11px] leading-relaxed" title={entry.deliveryAddress}>
                        {entry.deliveryAddress}
                      </div>
                    </td>

                    {/* Piece / Size */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#111111]">
                        {entry.productTitle || entry.category}
                      </div>
                      {entry.preferredSize && (
                        <div className="text-[10px] font-mono text-[#767676]">
                          Size: {entry.preferredSize}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#767676] whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${getStatusBadge(
                          entry.status
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </td>

                    {/* Edit Button */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#111111] hover:text-[#C5A869] underline underline-offset-2 transition-colors"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                    </td>

                    {/* Dropdown & Delete */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <select
                          value={entry.status}
                          onChange={(e) =>
                            handleQuickStatusChange(entry.id, e.target.value as any)
                          }
                          className="text-[11px] font-mono border border-[#E5E5E5] px-2 py-1 bg-white focus:outline-none focus:border-[#111111]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="ALLOCATED">ALLOCATED</option>
                          <option value="FULFILLED">FULFILLED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL ("make sure that is editable via admin and stuff") */}
      {editingEntry && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditingEntry(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E5E5E5] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
          >
            {/* Close */}
            <button
              onClick={() => setEditingEntry(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#111111] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A869] block">
                Atelier Dossier Editor
              </span>
              <h2 className="font-serif text-2xl font-light text-[#111111] uppercase tracking-wide">
                Edit Waitlist Entry
              </h2>
              <p className="text-xs text-[#767676] mt-1">
                Modify client details, delivery destination, phone number, and allocation status.
              </p>
            </div>

            {/* Quick Transition Ribbon */}
            <div className="bg-neutral-50 p-3 border border-[#E5E5E5] flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-[#767676]">Quick Status:</span>
              <button
                type="button"
                onClick={() =>
                  setEditingEntry((prev) => (prev ? { ...prev, status: 'CONTACTED' } : null))
                }
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-purple-600 hover:text-purple-700 transition-colors"
              >
                Mark Contacted
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingEntry((prev) => (prev ? { ...prev, status: 'ALLOCATED' } : null))
                }
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark Allocated
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingEntry((prev) => (prev ? { ...prev, status: 'FULFILLED' } : null))
                }
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Mark Fulfilled
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              {/* Name & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.name}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Allocation Status
                  </label>
                  <select
                    value={editingEntry.status}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, status: e.target.value as any } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] bg-white focus:outline-none focus:border-[#111111]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ALLOCATED">ALLOCATED</option>
                    <option value="FULFILLED">FULFILLED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editingEntry.email}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, email: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Telephone / Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.phone}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, phone: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Delivery Address & Destination
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingEntry.deliveryAddress}
                  onChange={(e) =>
                    setEditingEntry((prev) =>
                      prev ? { ...prev, deliveryAddress: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Product Title & Preferred Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Requested Piece / Title
                  </label>
                  <input
                    type="text"
                    value={editingEntry.productTitle || ''}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, productTitle: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Preferred Size / Fit
                  </label>
                  <input
                    type="text"
                    value={editingEntry.preferredSize || ''}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, preferredSize: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Atelier Notes & Customization Details
                </label>
                <textarea
                  rows={2}
                  value={editingEntry.notes || ''}
                  onChange={(e) =>
                    setEditingEntry((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                  }
                  placeholder="Fitting notes, leather grade requests, dispatch instructions..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-5 py-2.5 border border-[#E5E5E5] text-xs font-mono uppercase hover:border-[#111111] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW REGISTRATION MODAL */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E5E5E5] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
          >
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#111111] transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A869] block">
                Atelier Dossier Creation
              </span>
              <h2 className="font-serif text-2xl font-light text-[#111111] uppercase tracking-wide">
                Register Waitlist Client
              </h2>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFormData.name}
                    onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Telephone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFormData.phone}
                    onChange={(e) => setNewFormData({ ...newFormData, phone: e.target.value })}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newFormData.email}
                    onChange={(e) => setNewFormData({ ...newFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newFormData.status}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] bg-white focus:outline-none focus:border-[#111111]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ALLOCATED">ALLOCATED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newFormData.deliveryAddress}
                  onChange={(e) =>
                    setNewFormData({ ...newFormData, deliveryAddress: e.target.value })
                  }
                  placeholder="Full street address, city, postcode, country"
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Requested Piece / Category
                  </label>
                  <input
                    type="text"
                    value={newFormData.productTitle}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, productTitle: e.target.value })
                    }
                    placeholder="e.g. Bespoke Shearling Jacket"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Size / Fit
                  </label>
                  <input
                    type="text"
                    value={newFormData.preferredSize}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, preferredSize: e.target.value })
                    }
                    placeholder="e.g. 42R, UK 10"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Atelier Notes
                </label>
                <textarea
                  rows={2}
                  value={newFormData.notes}
                  onChange={(e) => setNewFormData({ ...newFormData, notes: e.target.value })}
                  placeholder="Special instructions..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E5E5E5] text-xs font-mono uppercase hover:border-[#111111] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>Register Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

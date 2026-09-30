'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Camera, Check, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AdminMediaPage() {
  const { showToast } = useStore();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [recentUploads, setRecentUploads] = useState<Array<{ url: string; filename: string; provider: string }>>([
    { url: '/images/hero/editorial_hero.jpg', filename: 'editorial_hero.jpg', provider: 'Atelier Core' },
    { url: '/images/products/biker_jacket_front.jpg', filename: 'biker_jacket_front.jpg', provider: 'Atelier Core' },
    { url: '/images/products/biker_jacket_back.jpg', filename: 'biker_jacket_back.jpg', provider: 'Atelier Core' },
    { url: '/images/products/oxford_pair_front.jpg', filename: 'oxford_pair_front.jpg', provider: 'Atelier Core' },
    { url: '/images/products/oxford_pair_top.jpg', filename: 'oxford_pair_top.jpg', provider: 'Atelier Core' },
    { url: '/images/products/chelsea_pair_front.jpg', filename: 'chelsea_pair_front.jpg', provider: 'Atelier Core' },
    { url: '/images/products/chelsea_pair_back.jpg', filename: 'chelsea_pair_back.jpg', provider: 'Atelier Core' },
    { url: '/images/products/shearling_jacket_front.jpg', filename: 'shearling_jacket_front.jpg', provider: 'Atelier Core' },
    { url: '/images/products/duffel_front.jpg', filename: 'duffel_front.jpg', provider: 'Atelier Core' },
    { url: '/images/products/wallet_front.jpg', filename: 'wallet_front.jpg', provider: 'Atelier Core' },
  ]);

  const handleFileProcess = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid format. Only JPEG, PNG, WEBP, and AVIF are permitted.');
      return;
    }

    // Validate size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file exceeds maximum allowable size of 8MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Upload failed.');
        return;
      }

      setRecentUploads([
        { url: data.url, filename: file.name, provider: data.storageProvider },
        ...recentUploads,
      ]);
      showToast('Media asset successfully ingested.');
    } catch {
      showToast('Upload error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Asset URL copied to clipboard.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-1">
          Media Architecture
        </span>
        <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
          Atelier Asset & Campaign Ingestion
        </h1>
        <p className="text-xs text-[#767676] mt-1 max-w-2xl">
          High-performance CDN and storage pipeline. All uploads are validated for color accuracy, resolution, and format integrity.
        </p>
      </div>

      {/* Uploader Card (Desktop Drag & Drop + Mobile Camera/Picker) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-8 sm:p-12 text-center transition-all bg-white ${
          dragActive
            ? 'border-[#111111] bg-neutral-50'
            : 'border-[#E5E5E5] hover:border-neutral-400'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
          <div className="w-14 h-14 bg-neutral-50 border border-[#E5E5E5] flex items-center justify-center text-[#111111]">
            <Upload size={22} strokeWidth={1.5} />
          </div>

          <div>
            <h3 className="font-serif text-lg text-[#111111] font-normal uppercase tracking-wide">
              {uploading ? 'Ingesting Asset...' : 'Drag and drop campaign imagery'}
            </h3>
            <p className="text-xs text-[#767676] mt-1">
              Supports JPEG, PNG, WEBP, AVIF up to 8MB.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest px-5 py-2.5 transition-colors flex items-center space-x-2 font-medium">
              <Upload size={14} />
              <span>Select File</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <label className="cursor-pointer bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs uppercase tracking-widest px-4 py-2.5 transition-colors flex items-center space-x-2 sm:hidden">
              <Camera size={14} />
              <span>Camera</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-[#767676] pt-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
              <span>Processing secure upload pipeline...</span>
            </div>
          )}
        </div>
      </div>

      {/* Asset Repository Gallery */}
      <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <h2 className="font-serif text-lg uppercase tracking-wide text-[#111111]">
            Ingested Assets ({recentUploads.length})
          </h2>
          <span className="text-[10px] uppercase font-mono text-[#767676]">
            ACEMEN Storage Ledger
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentUploads.map((item, idx) => (
            <div
              key={idx}
              className="border border-[#E5E5E5] bg-neutral-50/50 p-2 space-y-2 group"
            >
              <div className="relative aspect-[3/4] w-full bg-white border border-[#E5E5E5] overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="text-[10px] space-y-1">
                <div className="truncate font-mono text-[#111111]" title={item.filename}>
                  {item.filename}
                </div>
                <div className="text-[9px] text-[#767676] truncate font-mono">
                  {item.provider}
                </div>
                <button
                  onClick={() => copyToClipboard(item.url)}
                  className="w-full py-1 border border-[#E5E5E5] hover:border-[#111111] text-[9px] uppercase font-mono flex items-center justify-center space-x-1 transition-colors bg-white"
                >
                  <Copy size={10} />
                  <span>Copy Path</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

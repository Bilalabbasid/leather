'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Check, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, clearToast } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn max-w-md w-full px-4">
      <div className="bg-[#111111] text-white px-5 py-4 shadow-2xl flex items-center justify-between border border-neutral-800">
        <div className="flex items-center space-x-3">
          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
            <Check size={12} strokeWidth={2.5} />
          </span>
          <p className="text-xs uppercase tracking-widest font-medium text-neutral-200">
            {toastMessage}
          </p>
        </div>
        <button
          onClick={clearToast}
          className="text-neutral-400 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

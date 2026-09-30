'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected connection error occurred');
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-neutral-50 border border-neutral-300 text-xs text-[#111111] tracking-wide">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-2"
        >
          Atelier Email
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="director@acemen.uk"
            className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] transition-colors font-sans"
          />
          <Mail className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[10px] uppercase tracking-widest font-mono text-[#767676] mb-2"
        >
          Access Key / Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] transition-colors font-sans"
          />
          <Lock className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest font-sans font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying Authorization...</span>
          </>
        ) : (
          <>
            <span>Authenticate & Enter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#111111] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-block mb-6">
          <span className="font-serif text-3xl font-light tracking-[0.25em] uppercase text-[#111111]">
            ACEMEN
          </span>
        </Link>
        <div className="inline-flex items-center space-x-2 px-3 py-1 border border-[#E5E5E5] text-[10px] tracking-widest uppercase font-mono text-[#767676] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Atelier Management Portal</span>
        </div>
        <h2 className="font-serif text-2xl font-light tracking-wide text-[#111111]">
          Authorised Personnel Access
        </h2>
        <p className="mt-2 text-xs text-[#767676] tracking-wide">
          Enter credentials to manage luxury allocations, catalog, and bespoke orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 border border-[#E5E5E5] sm:px-10">
          <Suspense fallback={<div className="text-center py-8 text-xs font-mono text-[#767676]">Loading authentication...</div>}>
            <AdminLoginForm />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-center">
            <p className="text-[11px] text-[#767676]">
              Default Seed Access: <span className="font-mono text-[#111111]">director@acemen.uk</span>
            </p>
            <p className="text-[10px] text-neutral-400 mt-1">
              Public self-registration is strictly disabled by protocol.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#767676] hover:text-[#111111] uppercase tracking-widest transition-colors font-mono"
          >
            ← Return to ACEMEN Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

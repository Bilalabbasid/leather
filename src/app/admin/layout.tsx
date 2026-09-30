'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import Toast from '@/components/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on admin login page, don't show admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];


  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#111111] text-white border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden text-neutral-300 hover:text-white p-1"
              aria-label="Toggle admin navigation"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg tracking-[0.2em] uppercase font-light text-white">
                ACEMEN
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700">
                Atelier CMS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink size={11} />
            </Link>

            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 px-2.5 py-1 flex items-center space-x-1.5 transition-colors"
            >
              <LogOut size={11} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Desktop Horizontal Sub-nav */}
        <div className="hidden lg:block border-t border-neutral-800/80 bg-[#161616]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2.5 text-xs uppercase tracking-[0.16em] flex items-center space-x-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-white text-white font-medium'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#181818] border-b border-neutral-800 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-xs uppercase tracking-widest ${
                    isActive
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      <Toast />
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import SizeGuideModal from '@/components/SizeGuideModal';
import Toast from '@/components/Toast';

export const metadata: Metadata = {
  title: 'ACEMEN | Direct Luxury Leather Goods & Bespoke Outerwear | London',
  description:
    'Full-grain leather jackets, Goodyear-welted footwear, and heirloom luggage. Handcrafted in limited allocations with disciplined British tailoring.',
  keywords: [
    'ACEMEN',
    'luxury leather jacket',
    'biker jacket',
    'goodyear welted footwear',
    'chelsea boot',
    'acemen london',
    'full grain leather',
    'bespoke leather goods',
  ],
  metadataBase: new URL('https://acemen.uk'),
  openGraph: {
    title: 'ACEMEN London — Luxury Leather Goods & Outerwear',
    description: 'Disciplined British tailoring, French & Italian tanneries, and direct atelier exclusivity.',
    url: 'https://acemen.uk',
    siteName: 'ACEMEN',
    images: [
      {
        url: '/images/hero/editorial_hero.jpg',
        width: 1920,
        height: 1080,
        alt: 'ACEMEN Luxury Leather Outerwear & Footwear Atelier',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACEMEN | Direct Luxury Leather Goods',
    description: 'Full-grain leather jackets, Goodyear-welted footwear, and heirloom luggage.',
    images: ['/images/hero/editorial_hero.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-[#111111] antialiased">
      <body className="min-h-screen flex flex-col justify-between selection:bg-[#111111] selection:text-white bg-white text-[#111111]">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <SearchModal />
        <SizeGuideModal />
        <Toast />
      </body>
    </html>
  );
}

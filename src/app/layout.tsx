import type { Metadata } from 'next';
import { Outfit, Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import SizeGuideModal from '@/components/SizeGuideModal';
import Toast from '@/components/Toast';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://acemen.co.uk'),
  title: {
    default: 'ACEMEN | British Luxury Footwear & Sartorial Leather Atelier • London',
    template: '%s | ACEMEN',
  },
  description:
    'British luxury leather house and master footwear atelier. Handcrafted Goodyear-welted shoes, outerwear, and fine leather goods handcrafted in limited London allocations.',
  keywords: [
    'ACEMEN',
    'luxury leather footwear',
    'goodyear welted shoes',
    'london footwear atelier',
    'luxury leather jacket',
    'chelsea boots',
    'oxford shoes',
    'bespoke leather goods',
    'full grain leather',
  ],
  authors: [{ name: 'ACEMEN' }],
  creator: 'ACEMEN',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://acemen.co.uk',
    siteName: 'ACEMEN',
    title: 'ACEMEN | British Luxury Footwear & Sartorial Leather Atelier • London',
    description: 'Disciplined British tailoring, French & Italian tanneries, and direct atelier exclusivity.',
    images: [
      {
        url: '/images/luxury/hero-campaign.webp',
        width: 1920,
        height: 1080,
        alt: 'ACEMEN British Luxury Footwear & Leather Atelier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACEMEN | British Luxury Footwear & Sartorial Leather Atelier',
    description: 'Handcrafted Goodyear-welted shoes, tailored leather outerwear, and fine leather goods.',
    images: ['/images/luxury/hero-campaign.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${inter.variable} bg-white text-[#111111] antialiased`}>
      <body className="min-h-screen flex flex-col justify-between selection:bg-[#111111] selection:text-white bg-white text-[#111111] font-sans">
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

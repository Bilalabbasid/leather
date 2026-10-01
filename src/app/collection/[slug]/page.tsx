'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown, Check, X, RotateCcw, Loader2, TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, SHOE_SUBCATEGORIES, BAG_SUBCATEGORIES } from '@/lib/data';
import { Product } from '@/lib/types';

// Virtual merchandising slugs (not DB categories)
const VIRTUAL_SLUGS: Record<string, { title: string; desc: string; apiParam: string; apiValue: string }> = {
  'top-selling': {
    title: 'Top Selling',
    desc: 'The most celebrated ACEMEN pieces — chosen by clients who understand the architecture of permanent form.',
    apiParam: 'topSelling',
    apiValue: 'true',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    desc: 'The latest allocations from the ACEMEN London atelier. Limited quantities at first release.',
    apiParam: 'newArrival',
    apiValue: 'true',
  },
};

// Subcategory tabs for parent routes
const SHOE_TABS = [
  { name: 'All Shoes', slug: 'shoes' },
  { name: 'Oxford', slug: 'shoes-oxford' },
  { name: 'Chelsea', slug: 'shoes-chelsea' },
  { name: 'Derby', slug: 'shoes-derby' },
  { name: 'Loafers', slug: 'shoes-loafer' },
  { name: 'Monk Straps', slug: 'shoes-monk' },
  { name: 'Dress Boots', slug: 'shoes-boots' },
];
const BAG_TABS = [
  { name: 'All Bags', slug: 'bags' },
  { name: 'Laptop & Briefcase', slug: 'bags-laptop' },
  { name: 'Handbags', slug: 'bags-handbag' },
  { name: 'Weekender', slug: 'bags-weekender' },
  { name: 'Backpacks', slug: 'bags-backpack' },
  { name: 'Messenger', slug: 'bags-messenger' },
];

const ALL_SUBCATEGORIES_FLAT = [...SHOE_SUBCATEGORIES, ...BAG_SUBCATEGORIES];

interface PLPProps {
  params: {
    slug: string;
  };
}

function CollectionPageContent({ params }: PLPProps) {
  const { slug } = params;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query states
  const sortBy = searchParams.get('sort') || 'featured';
  const selectedLeather = searchParams.get('leather') || 'ALL';
  const selectedSize = searchParams.get('size') || 'ALL';
  const selectedColor = searchParams.get('color') || 'ALL';
  const selectedPriceRange = searchParams.get('priceRange') || 'ALL';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  // Resolve category — check top-level, subcategories, and virtual routes
  const virtualMeta = VIRTUAL_SLUGS[slug] ?? null;
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug)
    ?? ALL_SUBCATEGORIES_FLAT.find((c) => c.slug === slug)
    ?? null;

  // Determine subcategory tabs to show
  const isShoeParent = slug === 'shoes';
  const isBagParent = slug === 'bags';
  const isShoeSubcat = SHOE_SUBCATEGORIES.some((c) => c.slug === slug);
  const isBagSubcat = BAG_SUBCATEGORIES.some((c) => c.slug === slug);
  const subTabs = isShoeParent || isShoeSubcat ? SHOE_TABS
    : isBagParent || isBagSubcat ? BAG_TABS
    : null;

  const [dbCategory, setDbCategory] = useState<{ name: string; description?: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) {
          const found = data.categories.find((c: any) => c.slug === slug);
          if (found) setDbCategory(found);
        }
      })
      .catch(() => {});
  }, [slug]);

  // Fetch products from database API or fallback
  useEffect(() => {
    async function loadCatalog() {
      try {
        const queryParams = new URLSearchParams();
        if (virtualMeta) {
          queryParams.set(virtualMeta.apiParam, virtualMeta.apiValue);
        } else if (slug !== 'all') {
          queryParams.set('category', slug);
        }
        if (selectedColor !== 'ALL') queryParams.set('color', selectedColor);
        if (sortBy) queryParams.set('sort', sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setProducts(data.products);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch fallback to local data');
      }

      // Fallback to local data
      if (virtualMeta?.apiParam === 'topSelling') {
        setProducts(INITIAL_PRODUCTS.filter((p) => p.isTopSelling));
      } else if (virtualMeta?.apiParam === 'newArrival') {
        setProducts(INITIAL_PRODUCTS.filter((p) => p.isNewArrival));
      } else if (slug === 'all') {
        setProducts(INITIAL_PRODUCTS);
      } else if (category) {
        if (slug === 'shoes') {
          setProducts(INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-shoes' || (p.categoryId || '').startsWith('cat-shoes-')));
        } else if (slug === 'bags') {
          setProducts(INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-bags' || (p.categoryId || '').startsWith('cat-bags-')));
        } else {
          setProducts(INITIAL_PRODUCTS.filter((p) => p.categoryId === category.id));
        }
      } else {
        setProducts([]);
      }
      setLoading(false);
    }

    loadCatalog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortBy, selectedColor]);

  // Update query params helper
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Derive facet options from catalog
  const availableLeathers = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.leatherGrade) set.add(p.leatherGrade);
      else if (p.material) set.add(p.material);
    });
    return Array.from(set);
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants?.forEach((v) => set.add(v.size)));
    return Array.from(set);
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.colorFamily) set.add(p.colorFamily);
    });
    return Array.from(set);
  }, [products]);

  // Client-side refinement matching active URL filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedLeather !== 'ALL') {
      result = result.filter(
        (p) => p.leatherGrade === selectedLeather || p.material === selectedLeather
      );
    }

    if (selectedSize !== 'ALL') {
      result = result.filter((p) => p.variants?.some((v) => v.size === selectedSize));
    }

    if (selectedColor !== 'ALL') {
      result = result.filter(
        (p) => p.colorFamily.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    if (selectedPriceRange !== 'ALL') {
      if (selectedPriceRange === 'under-1000') {
        result = result.filter((p) => p.priceInPence < 100000);
      } else if (selectedPriceRange === '1000-2000') {
        result = result.filter((p) => p.priceInPence >= 100000 && p.priceInPence <= 200000);
      } else if (selectedPriceRange === 'over-2000') {
        result = result.filter((p) => p.priceInPence > 200000);
      }
    }

    // Client sort safeguard
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceInPence - b.priceInPence);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceInPence - a.priceInPence);
    } else if (sortBy === 'top-selling') {
      result.sort((a, b) => (b.isTopSelling ? 1 : 0) - (a.isTopSelling ? 1 : 0));
    } else {
      result.sort((a, b) => b.displayPriority - a.displayPriority);
    }

    return result;
  }, [products, selectedLeather, selectedSize, selectedColor, selectedPriceRange, sortBy]);

  const hasActiveFilters =
    selectedLeather !== 'ALL' ||
    selectedSize !== 'ALL' ||
    selectedColor !== 'ALL' ||
    selectedPriceRange !== 'ALL' ||
    sortBy !== 'featured';

  const categoryTitle = virtualMeta
    ? virtualMeta.title
    : category
      ? category.name
      : dbCategory
        ? dbCategory.name
        : slug === 'all'
          ? 'All Collections'
          : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryDesc = virtualMeta
    ? virtualMeta.desc
    : category?.description
      ? category.description
      : dbCategory?.description
        ? dbCategory.description
        : 'Curated masterworks of British and Italian leather craftsmanship.';

  // Breadcrumb parent for subcategories
  const parentCrumb = isShoeSubcat
    ? { name: 'Shoes', href: '/collection/shoes' }
    : isBagSubcat
      ? { name: 'Bags', href: '/collection/bags' }
      : null;

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Category Editorial Header */}
      <div className="border-b border-[#E5E5E5] py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="text-[10px] uppercase tracking-[0.25em] text-[#767676] mb-4 font-mono">
            <Link href="/" className="hover:text-[#111111]">Home</Link>
            <span className="mx-2">/</span>
            <span>Collections</span>
            {parentCrumb && (
              <>
                <span className="mx-2">/</span>
                <Link href={parentCrumb.href} className="hover:text-[#111111]">{parentCrumb.name}</Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-[#111111]">{categoryTitle}</span>
          </nav>
          {virtualMeta && (
            <div className="flex items-center justify-center space-x-2 mb-3">
              {slug === 'top-selling' ? (
                <TrendingUp size={16} className="text-[#767676]" />
              ) : (
                <Sparkles size={16} className="text-[#767676]" />
              )}
            </div>
          )}
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#111111] tracking-tight uppercase mb-4">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#767676] font-sans leading-relaxed tracking-wide max-w-2xl mx-auto">
            {categoryDesc}
          </p>
        </div>
      </div>

      {/* Subcategory Tab Strip */}
      {subTabs && (
        <div className="border-b border-[#E5E5E5] bg-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-0 min-w-max">
              {subTabs.map((tab) => {
                const active = slug === tab.slug;
                return (
                  <Link
                    key={tab.slug}
                    href={`/collection/${tab.slug}`}
                    className={`px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.18em] whitespace-nowrap border-b-2 transition-colors ${
                      active
                        ? 'border-[#111111] text-[#111111]'
                        : 'border-transparent text-[#767676] hover:text-[#111111] hover:border-[#D4D4D4]'
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Desktop Filter & Sort Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Result Count & Clear Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-mono text-[#767676]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-widest text-[#111111] hover:text-[#767676] flex items-center space-x-1 border border-[#E5E5E5] px-2 py-0.5"
              >
                <RotateCcw size={10} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#111111] border border-[#E5E5E5] px-3.5 py-2 min-h-[40px] active:bg-neutral-100"
            aria-label="Refine collection"
          >
            <SlidersHorizontal size={13} />
            <span>Refine</span>
          </button>

          {/* Desktop Filter Dropdowns */}
          <div className="hidden md:flex items-center space-x-6 text-[11px] uppercase tracking-wider text-[#767676]">
            {/* Leather Type Filter */}
            {availableLeathers.length > 0 && (
              <div className="relative group">
                <span className="cursor-pointer group-hover:text-[#111111] flex items-center space-x-1 py-1">
                  <span>Leather</span>
                  <ChevronDown size={12} />
                </span>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-[#E5E5E5] shadow-lg py-2 w-64 z-50">
                  <button
                    onClick={() => updateFilter('leather', 'ALL')}
                    className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                      selectedLeather === 'ALL' ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                    }`}
                  >
                    <span>All Leathers</span>
                    {selectedLeather === 'ALL' && <Check size={12} />}
                  </button>
                  {availableLeathers.map((l) => (
                    <button
                      key={l}
                      onClick={() => updateFilter('leather', l)}
                      className={`w-full text-left px-4 py-1.5 text-xs truncate flex justify-between items-center ${
                        selectedLeather === l ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                      }`}
                    >
                      <span className="truncate">{l}</span>
                      {selectedLeather === l && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            {availableSizes.length > 0 && (
              <div className="relative group">
                <span className="cursor-pointer group-hover:text-[#111111] flex items-center space-x-1 py-1">
                  <span>Size</span>
                  <ChevronDown size={12} />
                </span>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-[#E5E5E5] shadow-lg py-2 w-48 z-50">
                  <button
                    onClick={() => updateFilter('size', 'ALL')}
                    className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                      selectedSize === 'ALL' ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                    }`}
                  >
                    <span>All Sizes</span>
                    {selectedSize === 'ALL' && <Check size={12} />}
                  </button>
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', s)}
                      className={`w-full text-left px-4 py-1.5 text-xs truncate flex justify-between items-center ${
                        selectedSize === s ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                      }`}
                    >
                      <span>{s}</span>
                      {selectedSize === s && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {availableColors.length > 0 && (
              <div className="relative group">
                <span className="cursor-pointer group-hover:text-[#111111] flex items-center space-x-1 py-1">
                  <span>Color</span>
                  <ChevronDown size={12} />
                </span>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-[#E5E5E5] shadow-lg py-2 w-44 z-50">
                  <button
                    onClick={() => updateFilter('color', 'ALL')}
                    className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                      selectedColor === 'ALL' ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                    }`}
                  >
                    <span>All Tones</span>
                    {selectedColor === 'ALL' && <Check size={12} />}
                  </button>
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilter('color', c)}
                      className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                        selectedColor === c ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedColor === c && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="relative group">
              <span className="cursor-pointer group-hover:text-[#111111] flex items-center space-x-1 py-1">
                <span>Price</span>
                <ChevronDown size={12} />
              </span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-[#E5E5E5] shadow-lg py-2 w-48 z-50">
                {[
                  { id: 'ALL', label: 'All Allocations' },
                  { id: 'under-1000', label: 'Under £1,000' },
                  { id: '1000-2000', label: '£1,000 – £2,000' },
                  { id: 'over-2000', label: 'Over £2,000' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => updateFilter('priceRange', tier.id)}
                    className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                      selectedPriceRange === tier.id ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{tier.label}</span>
                    {selectedPriceRange === tier.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="relative group pl-4 border-l border-[#E5E5E5]">
              <span className="cursor-pointer group-hover:text-[#111111] flex items-center space-x-1 py-1 font-medium text-[#111111]">
                <span>Sort: {sortBy.replace('-', ' ')}</span>
                <ChevronDown size={12} />
              </span>
              <div className="absolute right-0 top-full hidden group-hover:block bg-white border border-[#E5E5E5] shadow-lg py-2 w-52 z-50">
                {[
                  { id: 'featured', label: 'Featured Allocations' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'top-selling', label: 'Top Selling' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateFilter('sort', s.id)}
                    className={`w-full text-left px-4 py-1.5 text-xs flex justify-between items-center ${
                      sortBy === s.id ? 'font-medium text-[#111111] bg-neutral-50' : 'text-[#767676] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#E5E5E5] p-8 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl font-light text-[#111111] mb-2">
              {products.length === 0
                ? `No Allocations in ${categoryTitle} Yet`
                : 'No Pieces Match Your Current Refinement'}
            </h3>
            <p className="text-xs text-[#767676] mb-6 leading-relaxed max-w-md mx-auto">
              {products.length === 0
                ? 'Handcrafted allocations for this collection are currently in tailoring at our London atelier. Explore our other permanent collections in the meantime.'
                : 'Try adjusting your leather type, size, or price parameters to view available atelier allocations.'}
            </p>
            {products.length === 0 ? (
              <Link
                href="/collection/all"
                className="inline-block px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                Explore All Collections
              </Link>
            ) : (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 3} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs md:hidden">
          <div className="w-full max-w-sm bg-white h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                <h3 className="font-serif text-lg uppercase tracking-wide">Refine Collection</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#767676] hover:text-[#111111]"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sort Options */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#767676] block mb-2">
                  Sort By
                </span>
                <div className="space-y-1.5">
                  {[
                    { id: 'featured', label: 'Featured Allocations' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                    { id: 'top-selling', label: 'Top Selling' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateFilter('sort', s.id)}
                      className={`w-full text-left px-3 py-2 text-xs border ${
                        sortBy === s.id ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] text-[#767676]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#767676] block mb-2">
                  Price Allocation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'under-1000', label: '< £1,000' },
                    { id: '1000-2000', label: '£1,000–£2,000' },
                    { id: 'over-2000', label: '> £2,000' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateFilter('priceRange', p.id)}
                      className={`text-center py-2 text-xs border ${
                        selectedPriceRange === p.id ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] text-[#767676]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E5E5] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#111111] text-white text-xs uppercase tracking-widest"
              >
                Apply ({filteredProducts.length} Results)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 border border-[#E5E5E5] text-xs uppercase tracking-widest text-[#767676]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollectionPage(props: PLPProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#767676]">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Loading Atelier Collection...</span>
          </div>
        </div>
      }
    >
      <CollectionPageContent {...props} />
    </Suspense>
  );
}

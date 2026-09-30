/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  Settings,
  X,
  Upload,
} from 'lucide-react';
import {
  STORE_CONFIG,
  CATEGORIES,
  INITIAL_PRODUCTS,
  CUSTOMER_REVIEWS,
  PRODUCT_IMAGES,
  Product,
  ProductCategory,
  formatPKR,
  buildWhatsAppOrderUrl,
  cropWatchImageToSquareDataUrl,
} from './data/products';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { OrderFormModal, OrderTarget } from './components/OrderFormModal';
import { CatalogAdminModal } from './components/CatalogAdminModal';
import { ResilientImage } from './components/ResilientImage';

const STORAGE_KEYS = {
  PRODUCTS: 'rts_catalog_products_v4',
  CART: 'rts_shopping_cart_v4',
  WHATSAPP: 'rts_whatsapp_number_v4',
};

export default function App() {
  const batchUploadInputRef = useRef<HTMLInputElement>(null);

  // Persisted Products Catalog (10 Replica/Copy Gold Watches PKR 2,400–5,800 + 8 Perfumes)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to INITIAL_PRODUCTS
    }
    return INITIAL_PRODUCTS;
  });

  // Persisted WhatsApp Number (defaults to "923116164092" / local "03116164092")
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WHATSAPP) || STORE_CONFIG.whatsappNumber;
    } catch {
      return STORE_CONFIG.whatsappNumber;
    }
  });

  // Persisted Shopping Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Search, Category Filter & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SPECIAL_OFFER' | ProductCategory>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals & Drawers State
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderTarget, setOrderTarget] = useState<OrderTarget | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactTopic, setContactTopic] = useState('Watch & Perfume Consultation');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore storage quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP, whatsappNumber);
    } catch {
      // ignore
    }
  }, [whatsappNumber]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // All 10 Watch Collection products (unfiltered for the dedicated Watch Collection showcase, or filtered for Featured Watches)
  const allWatchCollection = useMemo(
    () => products.filter((p) => p.type === 'watch'),
    [products]
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'ALL'
          ? true
          : selectedCategory === 'SPECIAL_OFFER'
          ? Boolean(product.isSpecialOffer || (product.discountPercent && product.discountPercent >= 16))
          : product.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!q) return true;

      const haystack = [
        product.name,
        product.category,
        product.replicaLabel || '',
        product.shortDescription,
        product.fullDescription,
        product.sku,
        product.fragranceType || '',
        product.movement || '',
        product.scentNotes?.top || '',
        product.scentNotes?.heart || '',
        product.scentNotes?.base || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const watchProducts = useMemo(
    () => filteredProducts.filter((p) => p.type === 'watch'),
    [filteredProducts]
  );

  const perfumeProducts = useMemo(
    () => filteredProducts.filter((p) => p.type === 'perfume'),
    [filteredProducts]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Update a single product's image (auto-cropped to 1:1 square)
  const handleUpdateSingleProductImage = (productId: string, newDataUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: newDataUrl, imageStyle: '' } : p))
    );
    showToast('Watch photo updated & cropped to square!');
  };

  // Batch upload up to 10 watch photos at once
  const handleBatchWatchPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const croppedUrls = await Promise.all(
        files.slice(0, 10).map((f) => cropWatchImageToSquareDataUrl(f, true))
      );

      setProducts((prev) => {
        let watchIdx = 0;
        return prev.map((item) => {
          if (item.type === 'watch' && watchIdx < croppedUrls.length) {
            const updated = {
              ...item,
              image: croppedUrls[watchIdx],
              imageStyle: '',
            };
            watchIdx += 1;
            return updated;
          }
          return item;
        });
      });

      showToast(`Applied ${croppedUrls.length} uploaded watch photo(s) to Watch Collection!`);
    } catch {
      showToast('Could not process one or more image files.');
    }
    e.target.value = '';
  };

  // Cart Actions
  const handleAddToCart = (
    product: Product,
    sizeLabel: string,
    unitPrice: number,
    quantity = 1
  ) => {
    const key = `${product.id}__${sizeLabel}`;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.key === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          key,
          product,
          sizeLabel,
          unitPrice,
          quantity,
        },
      ];
    });
    showToast(`Added ${product.name} (${sizeLabel}) to your bag`);
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Buy Now Action -> Opens Order Form Modal AND triggers pre-filled WhatsApp Order Link
  const handleBuyNow = (
    product: Product,
    sizeLabel: string,
    unitPrice: number,
    quantity = 1
  ) => {
    setActiveProductModal(null);
    setOrderTarget({
      mode: 'single',
      product,
      sizeLabel,
      unitPrice,
      quantity,
    });
    setOrderModalOpen(true);

    const waUrl = buildWhatsAppOrderUrl(whatsappNumber, {
      productName: `${product.name}${product.type === 'watch' ? ' [Replica / Copy]' : ''} (${sizeLabel})`,
      quantity,
      priceFormatted: formatPKR(unitPrice * quantity),
    });
    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleProceedCartToOrderForm = () => {
    setCartDrawerOpen(false);
    setOrderTarget({
      mode: 'cart',
    });
    setOrderModalOpen(true);
  };

  // Section Navigation Helper
  const scrollToSection = (
    sectionId: string,
    filterType?: 'all' | 'watch' | 'perfume'
  ) => {
    if (filterType === 'all') {
      setSelectedCategory('ALL');
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryCard = (category: ProductCategory) => {
    setSelectedCategory(category);
    const targetId = category.includes('Watch') ? 'watches-section' : 'perfumes-section';
    const el = document.getElementById(targetId) || document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Catalog Admin Handlers
  const handleSaveCatalogProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updatedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      }
      return [updatedProduct, ...prev];
    });
    showToast(`Saved "${updatedProduct.name}" in catalog`);
  };

  const handleDeleteCatalogProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setWhatsappNumber(STORE_CONFIG.whatsappNumber);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP);
    showToast('Catalog reset to default items & WhatsApp 03116164092');
  };

  const handleContactWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*Concierge Inquiry — ${STORE_CONFIG.brandName}*\nCustomer Name: ${
      contactName || 'Valued Guest'
    }\nTopic: ${contactTopic}\nMessage: ${
      contactMessage || 'I would like assistance choosing a watch or perfume.'
    }`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F5F3EF]">
      {/* 1. PREMIUM NAVIGATION BAR (3-Zone Top Bar Contract) */}
      <Navbar
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setCartDrawerOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* Toast Notification for Cart / Admin Actions */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#16161A] border border-[#D4AF37]/60 text-xs font-medium text-[#F5F3EF] shadow-2xl"
        >
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-[#8A857B] hover:text-[#F5F3EF] ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-1">
        {/* 2. LARGE HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#0E0E11]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center flex-wrap gap-2 text-xs text-[#D4AF37] tracking-wide">
                  <span>Owner: {STORE_CONFIG.ownerName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Replica / Copy Watches PKR 2,400 – PKR 5,800</span>
                  <span aria-hidden="true">·</span>
                  <span>WhatsApp: {STORE_CONFIG.whatsappDisplay}</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F3EF] leading-[1.08] balance-text">
                  Timeless Watches. Signature Scents.
                </h1>

                <p className="text-base sm:text-lg text-[#C8C4BC] leading-relaxed max-w-xl">
                  Discover premium watches and captivating fragrances for every occasion. Explore our Gold &amp; Rado-Style Replica / Copy Watch Collection alongside long-lasting perfumes across Pakistan.
                </p>

                {/* Primary Hero CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      scrollToSection('watch-collection-section', 'watch');
                    }}
                    className="h-12 px-7 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-sm font-semibold hover:bg-[#E5C354] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Shop Watches</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      scrollToSection('perfumes-section', 'perfume');
                    }}
                    className="h-12 px-7 rounded-lg border border-[#D4AF37]/50 bg-[#151519] text-[#F5F3EF] text-sm font-semibold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Shop Perfumes</span>
                  </button>
                </div>

                {/* Unboxed Trust Metrics */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-mono-num text-lg font-semibold text-[#F5F3EF]">
                      PKR 2,400–5,800
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      Replica / Copy Watch Collection
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-num text-lg font-semibold text-[#F5F3EF]">
                      24–48 Hours
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      Cash on Delivery Across Pakistan
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-num text-lg font-semibold text-[#D4AF37]">
                      03116164092
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      Direct WhatsApp Ordering
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Hero Campaign Imagery */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#141418] shadow-2xl aspect-square max-w-md mx-auto">
                  <ResilientImage
                    src={products[0]?.image || STORE_CONFIG.heroImage}
                    alt="Rado Style Gold Classic Watch"
                    fallbackType="watch"
                    title="Rado Style Gold Classic Watch"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <span className="absolute top-4 left-4 bg-[#0B0B0C]/90 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold px-3 py-1 rounded">
                    Replica / Copy Edition
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="text-xs text-[#D4AF37] font-medium">
                        Featured Gold Collection
                      </div>
                      <div className="font-display text-xl sm:text-2xl font-semibold text-[#F5F3EF]">
                        {products[0]?.name || 'Rado Style Gold Classic Watch'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleBuyNow(
                          products[0],
                          products[0].sizes[0].label,
                          products[0].price,
                          1
                        )
                      }
                      className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[#25D366] text-[#0B0B0C] text-xs font-semibold hover:bg-[#2CE070] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Buy Now — {formatPKR(products[0]?.price || 3200)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW DEDICATED "WATCH COLLECTION" SECTION (All 10 Uploaded Watches) */}
        <section id="watch-collection-section" className="py-14 sm:py-18 border-b border-white/10 bg-[#0B0B0C]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center flex-wrap gap-2 text-xs text-[#D4AF37] font-medium mb-1">
                  <span>Watch Collection</span>
                  <span aria-hidden="true">·</span>
                  <span>Replica / Copy Edition</span>
                  <span aria-hidden="true">·</span>
                  <span>PKR 2,400 – PKR 5,800</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                  Watch Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#9E9A90] mt-1 max-w-2xl">
                  All 10 Gold &amp; Rado-Style Replica / Copy Watches with square product framing, clear PKR pricing, and instant WhatsApp ordering on 03116164092.
                </p>
              </div>

              {/* Optional 1-Click Batch Photo Uploader for the Owner */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  ref={batchUploadInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBatchWatchPhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => batchUploadInputRef.current?.click()}
                  className="h-10 px-4 rounded-lg border border-[#D4AF37]/50 bg-[#141418] text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0C] transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Sync Your Watch Photos</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {allWatchCollection.map((product) => (
                <ProductCard
                  key={`collection-${product.id}`}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  onSelectProduct={setActiveProductModal}
                  onAddToCart={(prod, size, price) =>
                    handleAddToCart(prod, size, price, 1)
                  }
                  onBuyNow={(prod, size, price) =>
                    handleBuyNow(prod, size, price, 1)
                  }
                  onUpdateProductImage={handleUpdateSingleProductImage}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. CATEGORIES SECTION */}
        <section className="py-14 sm:py-16 border-b border-white/10 bg-[#0E0E11]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs text-[#D4AF37] font-medium mb-1">
                  Curated Departments
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                  Explore by Category
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#9E9A90] max-w-md">
                Select any department below to filter our Replica / Copy watches and signature fragrances.
              </p>
            </div>

            {/* 6 Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategoryCard(cat.id)}
                    className={`group text-left relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer flex items-center gap-4 p-4 bg-[#131316] ${
                      isActive
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                        : 'border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#19191E] shrink-0 border border-white/10">
                      <ResilientImage
                        src={cat.image}
                        alt={cat.title}
                        fallbackType={cat.group === 'Watches' ? 'watch' : 'perfume'}
                        title={cat.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-[#D4AF37] font-medium">
                        {cat.group} · {count} Items · {cat.itemCountLabel}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors truncate">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-[#9E9A90] line-clamp-1 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A857B] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE SEARCH & FILTER TOOLBAR */}
        <section id="catalog-section" className="pt-12 pb-4 bg-[#0B0B0C]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-4 sm:p-5 rounded-xl bg-[#131316] border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Interactive Segmented Category Filter Controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] font-semibold'
                      : 'bg-[#19191E] text-[#C8C4BC] hover:text-[#F5F3EF]'
                  }`}
                >
                  All Collection ({products.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#D4AF37] text-[#0B0B0C] font-semibold'
                        : 'bg-[#19191E] text-[#C8C4BC] hover:text-[#F5F3EF]'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Search Input & Sort Selector */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#8A857B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Rado Style, Gold Watch, Oud..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0E0E11] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#7D7970] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="inline-flex items-center gap-2 bg-[#0E0E11] border border-white/15 rounded-lg px-3 h-10">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <select
                    aria-label="Sort products"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                    }
                    className="bg-transparent text-xs text-[#E5E0D8] focus:outline-none cursor-pointer"
                  >
                    <option value="featured" className="bg-[#121215]">
                      Sort: Featured
                    </option>
                    <option value="price-asc" className="bg-[#121215]">
                      Price: Low to High
                    </option>
                    <option value="price-desc" className="bg-[#121215]">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Status */}
            {(selectedCategory !== 'ALL' || searchQuery.trim() !== '') && (
              <div className="mt-4 flex items-center justify-between text-xs text-[#C8C4BC] px-1">
                <div>
                  Showing <strong>{filteredProducts.length}</strong> matching result(s)
                  {selectedCategory !== 'ALL' && (
                    <>
                      {' '}
                      in{' '}
                      <strong className="text-[#D4AF37]">
                        {selectedCategory === 'SPECIAL_OFFER'
                          ? 'Special Offer Collection'
                          : selectedCategory}
                      </strong>
                    </>
                  )}
                  {searchQuery && (
                    <>
                      {' '}
                      for <strong className="text-[#D4AF37]">"{searchQuery}"</strong>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. FEATURED WATCHES SECTION */}
        {(watchProducts.length > 0 ||
          selectedCategory === 'ALL' ||
          selectedCategory.includes('Watch')) && (
          <section id="watches-section" className="py-12 sm:py-16 bg-[#0B0B0C]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-1">
                    <span>Replica / Copy Watches</span>
                    <span aria-hidden="true">·</span>
                    <span>PKR 2,400 – PKR 5,800</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                    Featured Watches
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#9E9A90] max-w-md">
                  Rado-style and Gold Edition Replica / Copy watches with square product display and Cash on Delivery across Pakistan.
                </p>
              </div>

              {watchProducts.length === 0 ? (
                <div className="p-10 rounded-xl bg-[#131316] border border-white/10 text-center">
                  <p className="text-sm text-[#C8C4BC] mb-3">
                    No watches matched your current search or filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold cursor-pointer"
                  >
                    Show All Watches
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {watchProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      whatsappNumber={whatsappNumber}
                      onSelectProduct={setActiveProductModal}
                      onAddToCart={(prod, size, price) =>
                        handleAddToCart(prod, size, price, 1)
                      }
                      onBuyNow={(prod, size, price) =>
                        handleBuyNow(prod, size, price, 1)
                      }
                      onUpdateProductImage={handleUpdateSingleProductImage}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. SPECIAL OFFER BANNER */}
        <section className="py-6 bg-[#0B0B0C]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-r from-[#171510] via-[#121216] to-[#19160E] p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#D4AF37]">
                    <span>Special Collection</span>
                    <span aria-hidden="true">·</span>
                    <span>Seasonal Sale Across Pakistan</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F3EF] balance-text">
                    Up to 20% Off Selected Watches &amp; Perfumes
                  </h2>
                  <p className="text-sm text-[#C8C4BC] max-w-2xl leading-relaxed">
                    Order any Replica / Copy watch or signature perfume between PKR 2,400 and PKR 5,800 directly on WhatsApp (03116164092) with fast nationwide Cash on Delivery.
                  </p>
                </div>
                <div className="lg:col-span-4 flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('SPECIAL_OFFER');
                      scrollToSection('catalog-section');
                    }}
                    className="h-12 px-8 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-sm font-semibold hover:bg-[#E5C354] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-lg"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURED PERFUMES SECTION */}
        {(perfumeProducts.length > 0 ||
          selectedCategory === 'ALL' ||
          selectedCategory.includes('Perfume') ||
          selectedCategory.includes('Fragrance')) && (
          <section id="perfumes-section" className="py-12 sm:py-16 bg-[#0B0B0C] border-b border-white/10">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-1">
                    <span>Signature Fragrances</span>
                    <span aria-hidden="true">·</span>
                    <span>{perfumeProducts.length} Scents Available (50ml / 100ml)</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                    Featured Perfumes
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#9E9A90] max-w-md">
                  High-projection Extraits and Eau de Parfums formulated for long-lasting performance in Pakistan’s climate.
                </p>
              </div>

              {perfumeProducts.length === 0 ? (
                <div className="p-10 rounded-xl bg-[#131316] border border-white/10 text-center">
                  <p className="text-sm text-[#C8C4BC] mb-3">
                    No perfumes matched your current search or filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold cursor-pointer"
                  >
                    Show All Perfumes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {perfumeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      whatsappNumber={whatsappNumber}
                      onSelectProduct={setActiveProductModal}
                      onAddToCart={(prod, size, price) =>
                        handleAddToCart(prod, size, price, 1)
                      }
                      onBuyNow={(prod, size, price) =>
                        handleBuyNow(prod, size, price, 1)
                      }
                      onUpdateProductImage={handleUpdateSingleProductImage}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. WHY CHOOSE US SECTION */}
        <section className="py-16 bg-[#0E0E11] border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <div className="text-xs text-[#D4AF37] font-medium mb-1">
                The Royal Promise
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                Why Shop With Royal Time &amp; Scents
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="p-5 rounded-xl bg-[#141418] border border-white/10">
                <div className="font-mono-num text-xs text-[#D4AF37] mb-2">01.</div>
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1.5">
                  Premium Finish
                </h3>
                <p className="text-xs text-[#9E9A90] leading-relaxed">
                  Polished gold-tone Replica / Copy watches and high-concentration perfumes crafted for standout daily wear.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#141418] border border-white/10">
                <div className="font-mono-num text-xs text-[#D4AF37] mb-2">02.</div>
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1.5">
                  Honest Grading
                </h3>
                <p className="text-xs text-[#9E9A90] leading-relaxed">
                  Every watch is transparently labeled as a Replica / Copy and inspected before dispatch so you get exact value.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#141418] border border-white/10">
                <div className="font-mono-num text-xs text-[#D4AF37] mb-2">03.</div>
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1.5">
                  Fast Delivery Across Pakistan
                </h3>
                <p className="text-xs text-[#9E9A90] leading-relaxed">
                  24–48 hour express courier to Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan &amp; 150+ cities.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#141418] border border-white/10">
                <div className="font-mono-num text-xs text-[#D4AF37] mb-2">04.</div>
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1.5">
                  Secure Shopping
                </h3>
                <p className="text-xs text-[#9E9A90] leading-relaxed">
                  Pay via Cash on Delivery (COD) with parcel inspection privilege and a 7-day easy exchange policy.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#141418] border border-white/10">
                <div className="font-mono-num text-xs text-[#D4AF37] mb-2">05.</div>
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1.5">
                  Easy WhatsApp Ordering
                </h3>
                <p className="text-xs text-[#9E9A90] leading-relaxed">
                  One-click WhatsApp ordering on 03116164092 sends your complete order details directly to Hafiz Haider.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CUSTOMER REVIEWS SECTION (4 Realistic Reviews with Star Ratings) */}
        <section className="py-16 bg-[#0B0B0C] border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="text-xs text-[#D4AF37] font-medium mb-1">
                  Client Testimonials
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                  Trusted by Customers Across Pakistan
                </h2>
              </div>
              <div className="text-xs text-[#9E9A90]">
                Rated <strong className="font-mono-num text-[#D4AF37]">4.9 / 5.0</strong> from verified Cash-on-Delivery buyers
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CUSTOMER_REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="p-6 rounded-xl bg-[#131316] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Rating & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className="flex items-center gap-1 text-[#D4AF37]"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#8A857B]">{review.date}</span>
                    </div>

                    {/* Purchased Item Metadata */}
                    <div className="text-xs text-[#D4AF37] font-medium mb-2">
                      Verified Purchase · {review.productPurchased}
                    </div>

                    <p className="text-sm text-[#E5E0D8] leading-relaxed mb-5">
                      “{review.comment}”
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#F5F3EF]">
                        {review.customerName}
                      </div>
                      <div className="text-[#9E9A90]">
                        {review.role} · {review.city}
                      </div>
                    </div>
                    <span className="text-[#9E9A90]">Verified Buyer</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 9. ABOUT US SECTION */}
        <section id="about-section" className="py-16 sm:py-20 bg-[#0E0E11] border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="text-xs text-[#D4AF37] font-medium">
                  About Royal Time &amp; Scents · Founded by {STORE_CONFIG.ownerName}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF] balance-text">
                  Stylish Replica / Copy Watches &amp; Quality Fragrances at Competitive Prices in Pakistan
                </h2>
                <p className="text-sm sm:text-base text-[#C8C4BC] leading-relaxed">
                  Led by owner <strong>{STORE_CONFIG.ownerName}</strong>, <strong>Royal Time &amp; Scents</strong> provides Pakistan’s most popular Rado-style and Gold Edition Replica / Copy watches alongside long-lasting Eau de Parfums and Oud Extraits at affordable prices between <strong>PKR 2,400 and PKR 5,800</strong>.
                </p>
                <p className="text-sm text-[#9E9A90] leading-relaxed">
                  We believe in complete transparency: our watches are high-finish <strong>Replica / Copy</strong> editions checked for dial clarity, clasp comfort, and reliable timekeeping before shipping, paired with signature perfumes that deliver 12+ hour projection.
                </p>

                <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs">
                  <div>
                    <div className="font-mono-num text-xl font-semibold text-[#D4AF37]">
                      PKR 2.4k–5.8k
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      Replica / Copy Watch Range
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-num text-xl font-semibold text-[#D4AF37]">
                      12–16 Hrs
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      Fragrance Longevity
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-num text-xl font-semibold text-[#D4AF37]">
                      150+ Cities
                    </div>
                    <div className="text-[#9E9A90] mt-0.5">
                      COD Across Pakistan
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#141418] aspect-square">
                  <ResilientImage
                    src={PRODUCT_IMAGES.watch8}
                    alt="Gold Stone Dial Watch"
                    fallbackType="watch"
                    title="Gold Stone Dial Watch"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#141418] aspect-square">
                  <ResilientImage
                    src={PRODUCT_IMAGES.perfumeRoyalOud}
                    alt="Artisanal oud perfume bottle"
                    fallbackType="perfume"
                    title="Signature Perfumes"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. CONTACT SECTION */}
        <section id="contact-section" className="py-16 sm:py-20 bg-[#0B0B0C]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Contact Information Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="text-xs text-[#D4AF37] font-medium mb-1">
                    Owner: {STORE_CONFIG.ownerName} · Direct WhatsApp Desk
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F3EF]">
                    Get in Touch with Us
                  </h2>
                  <p className="text-sm text-[#9E9A90] mt-2 max-w-lg">
                    Connect directly with <strong>{STORE_CONFIG.ownerName}</strong> on WhatsApp at <strong>03116164092</strong> for instant watch and perfume orders, gift box customization, and nationwide delivery across Pakistan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#131316] border border-white/10 hover:border-[#25D366]/60 transition-colors flex items-start gap-3"
                  >
                    <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#F5F3EF]">
                        WhatsApp ({STORE_CONFIG.ownerName})
                      </div>
                      <div className="font-mono-num text-[#D4AF37] mt-0.5">
                        03116164092
                      </div>
                      <div className="text-[#8A857B] mt-0.5">Click to chat on WhatsApp</div>
                    </div>
                  </a>

                  <a
                    href="tel:03116164092"
                    className="p-4 rounded-xl bg-[#131316] border border-white/10 hover:border-[#D4AF37]/50 transition-colors flex items-start gap-3"
                  >
                    <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#F5F3EF]">
                        Direct Call — {STORE_CONFIG.ownerName}
                      </div>
                      <div className="font-mono-num text-[#C8C4BC] mt-0.5">
                        03116164092
                      </div>
                      <div className="text-[#8A857B] mt-0.5">Mon–Sun, 10am – 11pm PKT</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${STORE_CONFIG.email}`}
                    className="p-4 rounded-xl bg-[#131316] border border-white/10 hover:border-[#D4AF37]/50 transition-colors flex items-start gap-3"
                  >
                    <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#F5F3EF]">Email Desk</div>
                      <div className="text-[#C8C4BC] mt-0.5 break-all">
                        {STORE_CONFIG.email}
                      </div>
                      <div className="text-[#8A857B] mt-0.5">Replies within 2 hours</div>
                    </div>
                  </a>

                  <div className="p-4 rounded-xl bg-[#131316] border border-white/10 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#F5F3EF]">Store Location</div>
                      <div className="text-[#C8C4BC] mt-0.5">
                        {STORE_CONFIG.storeAddress}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#9E9A90]">
                  <span>Follow Royal Time &amp; Scents:</span>
                  <a
                    href={STORE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F5F3EF] hover:text-[#D4AF37] underline underline-offset-4"
                  >
                    Instagram ({STORE_CONFIG.instagramHandle})
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={STORE_CONFIG.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F5F3EF] hover:text-[#D4AF37] underline underline-offset-4"
                  >
                    Facebook Official Page
                  </a>
                </div>
              </div>

              {/* Direct Concierge Inquiry Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleContactWhatsAppSubmit}
                  className="p-6 sm:p-8 rounded-2xl bg-[#131316] border border-white/10 space-y-4"
                >
                  <h3 className="font-display text-2xl font-semibold text-[#F5F3EF]">
                    Message {STORE_CONFIG.ownerName} on WhatsApp (03116164092)
                  </h3>
                  <p className="text-xs text-[#9E9A90]">
                    Ask about watch styles, fragrance notes, or custom gift packaging.
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-10 px-3.5 rounded-lg bg-[#0E0E11] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={contactTopic}
                      onChange={(e) => setContactTopic(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-lg bg-[#0E0E11] border border-white/15 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Watch & Perfume Consultation">
                        Watch &amp; Perfume Consultation
                      </option>
                      <option value="Wedding / Gift Box Customization">
                        Wedding / Gift Box Customization
                      </option>
                      <option value="Order Dispatch & Tracking">
                        Order Dispatch &amp; Tracking
                      </option>
                      <option value="Corporate Bulk Inquiry">
                        Corporate Bulk Inquiry
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us which watch or fragrance you are looking for..."
                      className="w-full p-3.5 rounded-lg bg-[#0E0E11] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 px-5 rounded-lg bg-[#25D366] text-[#0B0B0C] text-xs font-semibold hover:bg-[#2CE070] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp (03116164092)</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER */}
      <footer className="bg-[#08080A] border-t border-white/10 pt-14 pb-10 text-xs text-[#9E9A90]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-3">
              <div className="font-display text-2xl font-semibold text-[#F5F3EF]">
                {STORE_CONFIG.brandName}
              </div>
              <p className="text-xs text-[#9E9A90] max-w-sm leading-relaxed">
                Pakistan’s trusted online store for Gold &amp; Rado-Style Replica / Copy watches (PKR 2,400 – PKR 5,800) and long-lasting signature perfumes.
              </p>
              <div className="pt-1 text-[#D4AF37] font-mono-num space-y-1">
                <div>Owner: {STORE_CONFIG.ownerName}</div>
                <div>WhatsApp: 03116164092</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <div className="text-[#F5F3EF] font-semibold">Quick Links</div>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('top', 'all')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('watch-collection-section', 'watch')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Watch Collection
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-section')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact-section')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Contact &amp; Store Location
                  </button>
                </li>
              </ul>
            </div>

            {/* Shop Watches */}
            <div className="space-y-2.5">
              <div className="text-[#F5F3EF] font-semibold">Shop Watches</div>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard("Men's Watches")}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Men's Watches
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard("Women's Watches")}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Women's Watches
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard('Luxury Watches')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Luxury Gold Watches
                  </button>
                </li>
              </ul>
            </div>

            {/* Shop Perfumes */}
            <div className="space-y-2.5">
              <div className="text-[#F5F3EF] font-semibold">Shop Perfumes</div>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard("Men's Perfumes")}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Men's Perfumes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard("Women's Perfumes")}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Women's Perfumes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryCard('Unisex Fragrances')}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Unisex Fragrances
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Admin Catalog Trigger */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()} {STORE_CONFIG.brandName} ({STORE_CONFIG.ownerName}). All rights reserved. Prices in Pakistani Rupees (PKR).
            </div>

            <div className="flex items-center gap-4">
              <a
                href={STORE_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
              >
                Facebook
              </a>
              <a
                href={STORE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
              >
                Instagram
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
              >
                WhatsApp (03116164092)
              </a>
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/15 bg-[#121215] text-[#C8C4BC] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Manage Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL (PDP) */}
      <ProductDetailModal
        product={activeProductModal}
        whatsappNumber={whatsappNumber}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        items={cartItems}
        whatsappNumber={whatsappNumber}
        onClose={() => setCartDrawerOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToOrderForm={handleProceedCartToOrderForm}
      />

      {/* BUY NOW / WHATSAPP ORDER FORM MODAL */}
      <OrderFormModal
        isOpen={orderModalOpen}
        orderTarget={orderTarget}
        allProducts={products}
        cartItems={cartItems}
        whatsappNumber={whatsappNumber}
        onClose={() => setOrderModalOpen(false)}
        onOrderSubmitted={() => {
          setCartItems([]);
        }}
      />

      {/* CATALOG & WHATSAPP ADMIN MANAGER MODAL */}
      <CatalogAdminModal
        isOpen={adminModalOpen}
        products={products}
        whatsappNumber={whatsappNumber}
        onUpdateWhatsappNumber={(num) => {
          setWhatsappNumber(num);
          showToast(`WhatsApp number updated to +${num}`);
        }}
        onSaveProduct={handleSaveCatalogProduct}
        onDeleteProduct={handleDeleteCatalogProduct}
        onResetCatalog={handleResetCatalog}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}

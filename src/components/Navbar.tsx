import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

interface NavbarProps {
  cartCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string, filterType?: 'all' | 'watch' | 'perfume') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    filterType?: 'all' | 'watch' | 'perfume'
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateSection(sectionId, filterType);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateSection('catalog-section');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-md border-b border-white/10">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, 'top', 'all')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#F5F3EF] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
        >
          {STORE_CONFIG.brandName}
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C8C4BC]"
        >
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top', 'all')}
            className="hover:text-[#D4AF37] transition-colors py-1 border-b border-transparent hover:border-[#D4AF37] whitespace-nowrap"
          >
            Home
          </a>
          <a
            href="#watches-section"
            onClick={(e) => handleNavClick(e, 'watches-section', 'watch')}
            className="hover:text-[#D4AF37] transition-colors py-1 border-b border-transparent hover:border-[#D4AF37] whitespace-nowrap"
          >
            Watches
          </a>
          <a
            href="#perfumes-section"
            onClick={(e) => handleNavClick(e, 'perfumes-section', 'perfume')}
            className="hover:text-[#D4AF37] transition-colors py-1 border-b border-transparent hover:border-[#D4AF37] whitespace-nowrap"
          >
            Perfumes
          </a>
          <a
            href="#about-section"
            onClick={(e) => handleNavClick(e, 'about-section')}
            className="hover:text-[#D4AF37] transition-colors py-1 border-b border-transparent hover:border-[#D4AF37] whitespace-nowrap"
          >
            About Us
          </a>
          <a
            href="#contact-section"
            onClick={(e) => handleNavClick(e, 'contact-section')}
            className="hover:text-[#D4AF37] transition-colors py-1 border-b border-transparent hover:border-[#D4AF37] whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Search & Cart primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search watches and perfumes"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#E5E0D8] hover:text-[#D4AF37] hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="h-10 px-3.5 inline-flex items-center gap-2 rounded-lg bg-[#16161A] border border-white/15 text-[#F5F3EF] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium hidden sm:inline">Bag</span>
            <span className="font-mono-num text-xs font-medium text-[#D4AF37]">
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#E5E0D8] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#111114] px-4 sm:px-6 lg:px-8 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-[1280px] mx-auto flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              placeholder="Search by watch name, perfume note (e.g. Oud, Saffron, Chronograph, Women's)..."
              autoFocus
              className="w-full bg-transparent text-sm text-[#F5F3EF] placeholder-[#8A857B] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs text-[#9E9A90] hover:text-[#F5F3EF] whitespace-nowrap"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold hover:bg-[#E5C354] transition-colors whitespace-nowrap"
            >
              View Results
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/10 bg-[#111114] px-6 py-5 space-y-3"
        >
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top', 'all')}
            className="block py-2 text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37] border-b border-white/5"
          >
            Home
          </a>
          <a
            href="#watches-section"
            onClick={(e) => handleNavClick(e, 'watches-section', 'watch')}
            className="block py-2 text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37] border-b border-white/5"
          >
            Watches
          </a>
          <a
            href="#perfumes-section"
            onClick={(e) => handleNavClick(e, 'perfumes-section', 'perfume')}
            className="block py-2 text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37] border-b border-white/5"
          >
            Perfumes
          </a>
          <a
            href="#about-section"
            onClick={(e) => handleNavClick(e, 'about-section')}
            className="block py-2 text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37] border-b border-white/5"
          >
            About Us
          </a>
          <a
            href="#contact-section"
            onClick={(e) => handleNavClick(e, 'contact-section')}
            className="block py-2 text-base font-medium text-[#F5F3EF] hover:text-[#D4AF37]"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
};

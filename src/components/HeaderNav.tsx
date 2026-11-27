import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderNavProps {
  onRequestQuote: (projectType?: string) => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'Our Team', href: '#team' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const;

export function HeaderNav({ onRequestQuote }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const handleQuoteClick = () => {
    setMobileOpen(false);
    onRequestQuote();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? 'bg-[#FFFFFF]/96 border-b border-[#294D4A]/15 shadow-sm'
          : 'bg-[#141414]/72 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark & Logo */}
        <a
          href="#home"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#579091]"
          aria-label="Professional Landscapes — Home"
        >
          <picture className="shrink-0">
            <source srcSet="/images/logo/pl-logo.webp" type="image/webp" />
            <img
              src="/images/logo/pl-logo.png"
              alt="Professional Landscapes emblem"
              width={48}
              height={24}
              className={`h-7 w-auto object-contain transition-all ${
                scrolled || mobileOpen ? '' : 'brightness-0 invert'
              }`}
            />
          </picture>
          <span
            className={`font-display text-lg font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
              scrolled || mobileOpen ? 'text-[#294D4A]' : 'text-white'
            }`}
          >
            Professional Landscapes
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#579091] ${
                scrolled
                  ? 'text-[#172625] hover:text-[#579091] hover:border-[#579091]'
                  : 'text-[#F5F5F5] hover:text-white hover:border-[#68ACAE]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide uppercase bg-[#579091] text-white hover:bg-[#294D4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579091]"
          >
            Free Quotation
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579091] ${
              scrolled || mobileOpen
                ? 'text-[#294D4A] hover:bg-[#EFECE5]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        className={`lg:hidden overflow-hidden transition-all duration-200 bg-white border-t border-[#294D4A]/15 ${
          mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav aria-label="Mobile Navigation" className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="min-h-[44px] flex items-center px-3 text-base font-medium text-[#172625] hover:bg-[#F7F6F2] hover:text-[#579091] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-[#294D4A]/10">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full min-h-[48px] px-5 py-3 text-sm font-semibold tracking-wide uppercase bg-[#579091] text-white hover:bg-[#294D4A] transition-colors cursor-pointer"
            >
              Arrange a Free Quotation
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

import { ArrowDown, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

interface HeroSectionProps {
  onRequestQuote: () => void;
}

export function HeroSection({ onRequestQuote }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen flex items-end bg-[#141414] overflow-hidden"
    >
      {/* Above-the-fold Genuine Project Photography (eager, high fetch priority) */}
      <div className="absolute inset-0">
        <OptimizedImage
          image={HERO_IMAGE}
          sizes="100vw"
          priority
          variant="full"
          className="w-full h-full object-cover"
          wrapperClassName="w-full h-full"
          objectPosition="center 45%"
        />
        {/* Measured scrim ensuring >= 4.5:1 contrast for hero text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#141414]/92 via-[#141414]/52 to-[#141414]/35"
        />
      </div>

      {/* Editorial Foreground Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-[#68ACAE] mb-4">
              Over 25 Years of Landscaping Craftsmanship
            </p>
            <h1 className="font-display text-white text-balance text-[clamp(2.25rem,4.6vw,4.1rem)] font-semibold leading-[1.08] tracking-tight mb-6">
              Outdoor Spaces, Crafted with Experience.
            </h1>
            <p className="text-[#E2E2E2] text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              From beautifully finished patios and natural stone paving to bespoke garden features,
              decking and outdoor structures, our close-knit team brings decades of landscaping
              experience to every project.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onRequestQuote}
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 text-sm font-semibold tracking-wide bg-[#579091] text-white hover:bg-[#39A097] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Arrange a Free Quotation</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="#work"
                className="inline-flex items-center justify-center min-h-[48px] px-7 py-3.5 text-sm font-semibold tracking-wide text-white border border-white/35 bg-[#141414]/45 hover:bg-white hover:text-[#141414] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore Our Work
              </a>
            </div>
          </div>

          {/* Quiet factual context block + subtle scroll cue */}
          <div className="lg:col-span-4 lg:text-right flex flex-col lg:items-end justify-between gap-6">
            <div className="border-t border-white/20 pt-4 text-left lg:text-right max-w-xs">
              <p className="text-xs uppercase tracking-[0.12em] text-[#A1A1A1] mb-1">
                Established Craft
              </p>
              <p className="text-sm text-[#F5F5F5] leading-relaxed">
                Patios, block paving, brickwork, decking, pergolas, fencing &amp; complete garden
                improvements.
              </p>
            </div>

            <a
              href="#experience"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-[#E2E2E2] hover:text-white transition-colors self-start lg:self-end"
              aria-label="Scroll to Experience section"
            >
              <span>Scroll to explore</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

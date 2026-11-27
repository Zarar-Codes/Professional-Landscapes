import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

interface ServicesSectionProps {
  onSelectServiceQuote: (projectType: string) => void;
}

export function ServicesSection({ onSelectServiceQuote }: ServicesSectionProps) {
  const [stoneChoice, setStoneChoice] = useState<'sandstone' | 'porcelain'>('sandstone');

  const patioService = SERVICES_DATA[0];
  const blockService = SERVICES_DATA[1];
  const brickService = SERVICES_DATA[2];
  const timberService = SERVICES_DATA[3];
  const finishesService = SERVICES_DATA[4];

  const activeComparison =
    stoneChoice === 'sandstone'
      ? patioService.comparison!.sandstone
      : patioService.comparison!.porcelain;

  return (
    <section id="services" className="py-20 sm:py-28 bg-white border-b border-[#294D4A]/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-20">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
            Services &amp; Craft Pathways
          </p>
          <h2 className="font-display text-[#172625] text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight mb-5">
            Five Clear Pathways to Transform Your Garden.
          </h2>
          <p className="text-[#4B5B59] text-base sm:text-lg leading-relaxed">
            Whether you are planning a single patio or a complete outdoor improvement, explore our
            core areas of work below and talk directly with our team about your space.
          </p>
        </div>

        {/* SERVICE 01 — PATIOS & NATURAL STONE (Large Featured Editorial Block + Sandstone vs Porcelain Toggle) */}
        <article className="mb-16 lg:mb-24 bg-[#F7F6F2] border border-[#294D4A]/12 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#579091] tabular-nums mb-2">
                {patioService.index}. Core Service
              </p>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172625] mb-4">
                {patioService.title}
              </h3>
              <p className="text-[#4B5B59] text-base leading-relaxed mb-6">
                {patioService.summary}
              </p>

              <ul className="space-y-3 mb-8">
                {patioService.details.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#172625]">
                    <Check
                      className="w-4 h-4 text-[#579091] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Material Choice Comparison Switcher */}
              <div className="bg-white border border-[#294D4A]/12 p-5 sm:p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#4B5B59]">
                    Compare Popular Patio Materials
                  </span>
                  <div
                    role="tablist"
                    aria-label="Compare Sandstone and Porcelain paving"
                    className="inline-flex bg-[#EFECE5] p-1"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={stoneChoice === 'sandstone'}
                      onClick={() => setStoneChoice('sandstone')}
                      className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        stoneChoice === 'sandstone'
                          ? 'bg-[#294D4A] text-white'
                          : 'text-[#172625] hover:text-[#579091]'
                      }`}
                    >
                      Natural Sandstone
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={stoneChoice === 'porcelain'}
                      onClick={() => setStoneChoice('porcelain')}
                      className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        stoneChoice === 'porcelain'
                          ? 'bg-[#294D4A] text-white'
                          : 'text-[#172625] hover:text-[#579091]'
                      }`}
                    >
                      Porcelain Paving
                    </button>
                  </div>
                </div>
                <h4 className="font-display text-lg font-semibold text-[#172625] mb-1.5">
                  {activeComparison.title}
                </h4>
                <p className="text-sm text-[#4B5B59] leading-relaxed">
                  {activeComparison.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectServiceQuote(patioService.enquiryProjectType)}
                className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 text-sm font-semibold bg-[#579091] text-white hover:bg-[#294D4A] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{patioService.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 gap-4">
              <div className="aspect-[16/10] overflow-hidden bg-[#EFECE5]">
                <OptimizedImage
                  image={activeComparison.image}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[16/10] overflow-hidden bg-[#EFECE5]">
                  <OptimizedImage
                    image={patioService.primaryImage}
                    sizes="(min-width: 1024px) 22vw, 48vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="aspect-[16/10] overflow-hidden bg-[#EFECE5]">
                  <OptimizedImage
                    image={{
                      slug: 'porcelain-circle-gate',
                      width: 1080,
                      height: 810,
                      alt: 'Circular porcelain seating patio with cobble border',
                    }}
                    sizes="(min-width: 1024px) 22vw, 48vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SERVICE 02 & SERVICE 03 — Asymmetric Architectural Pair */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-16 lg:mb-24 items-stretch">
          {/* SERVICE 02 — BLOCK PAVING & DRIVEWAYS */}
          <article className="lg:col-span-7 flex flex-col justify-between bg-[#141414] text-white p-6 sm:p-10">
            <div>
              <div className="aspect-[16/10] overflow-hidden mb-7 bg-[#292929]">
                <OptimizedImage
                  image={blockService.primaryImage}
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#68ACAE] tabular-nums mb-2">
                {blockService.index}. Driveways &amp; Paths
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3">
                {blockService.title}
              </h3>
              <p className="text-[#E2E2E2] text-base leading-relaxed mb-5">
                {blockService.summary}
              </p>
              <ul className="space-y-2.5 mb-8">
                {blockService.details.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#E2E2E2]/90">
                    <Check
                      className="w-4 h-4 text-[#68ACAE] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/12 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 overflow-hidden border border-white/15">
                  <OptimizedImage
                    image={blockService.secondaryImages[0]}
                    variant="thumbnail"
                    sizes="64px"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="w-16 h-16 overflow-hidden border border-white/15">
                  <OptimizedImage
                    image={blockService.secondaryImages[1]}
                    variant="thumbnail"
                    sizes="64px"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectServiceQuote(blockService.enquiryProjectType)}
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold bg-[#579091] text-white hover:bg-[#39A097] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{blockService.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </article>

          {/* SERVICE 03 — BRICKWORK & GARDEN WALLS */}
          <article className="lg:col-span-5 flex flex-col justify-between bg-[#EFECE5] border border-[#294D4A]/12 p-6 sm:p-9">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#579091] tabular-nums mb-2">
                {brickService.index}. Structural Masonry
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#172625] mb-3">
                {brickService.title}
              </h3>
              <p className="text-[#4B5B59] text-base leading-relaxed mb-5">
                {brickService.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="aspect-[3/4] overflow-hidden bg-white">
                  <OptimizedImage
                    image={brickService.primaryImage}
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex-1 overflow-hidden bg-white">
                    <OptimizedImage
                      image={brickService.secondaryImages[0]}
                      sizes="(min-width: 1024px) 18vw, 45vw"
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden bg-white">
                    <OptimizedImage
                      image={brickService.secondaryImages[1]}
                      sizes="(min-width: 1024px) 18vw, 45vw"
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 mb-7">
                {brickService.details.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#172625]">
                    <Check
                      className="w-4 h-4 text-[#579091] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onSelectServiceQuote(brickService.enquiryProjectType)}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-semibold bg-[#294D4A] text-white hover:bg-[#579091] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{brickService.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>
        </div>

        {/* SERVICE 04 — DECKING, PERGOLAS & FENCING (Wide Architectural Strip) */}
        <article className="mb-16 lg:mb-20 border-t border-b border-[#294D4A]/15 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#579091] tabular-nums mb-2">
                {timberService.index}. Timber &amp; Boundaries
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#172625] mb-3">
                {timberService.title}
              </h3>
              <p className="text-[#4B5B59] text-base leading-relaxed mb-6">
                {timberService.summary}
              </p>
              <ul className="space-y-3 mb-8">
                {timberService.details.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#172625]">
                    <Check
                      className="w-4 h-4 text-[#579091] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onSelectServiceQuote(timberService.enquiryProjectType)}
                className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 text-sm font-semibold bg-[#579091] text-white hover:bg-[#294D4A] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{timberService.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7 aspect-[4/3] overflow-hidden bg-[#EFECE5]">
                <OptimizedImage
                  image={timberService.primaryImage}
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <div className="sm:col-span-5 flex flex-col gap-4">
                <div className="aspect-[16/9] sm:flex-1 overflow-hidden bg-[#EFECE5]">
                  <OptimizedImage
                    image={timberService.secondaryImages[0]}
                    sizes="(min-width: 1024px) 22vw, 100vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="aspect-[16/9] sm:flex-1 overflow-hidden bg-[#EFECE5]">
                  <OptimizedImage
                    image={timberService.secondaryImages[1]}
                    sizes="(min-width: 1024px) 22vw, 100vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                    objectPosition="center 35%"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SERVICE 05 — GARDEN FINISHES & LAWN INSTALLATION */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 aspect-[4/3] overflow-hidden bg-[#EFECE5]">
              <OptimizedImage
                image={finishesService.primaryImage}
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
            </div>
            <div className="sm:col-span-4 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#EFECE5]">
              <OptimizedImage
                image={finishesService.secondaryImages[0]}
                sizes="(min-width: 1024px) 18vw, 100vw"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#579091] tabular-nums mb-2">
              {finishesService.index}. Planting &amp; Ground Finishes
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#172625] mb-3">
              {finishesService.title}
            </h3>
            <p className="text-[#4B5B59] text-base leading-relaxed mb-6">
              {finishesService.summary}
            </p>
            <ul className="space-y-3 mb-8">
              {finishesService.details.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#172625]">
                  <Check
                    className="w-4 h-4 text-[#579091] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectServiceQuote(finishesService.enquiryProjectType)}
              className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 text-sm font-semibold border border-[#294D4A] text-[#294D4A] hover:bg-[#294D4A] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{finishesService.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

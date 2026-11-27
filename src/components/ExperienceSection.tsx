import { EXPERIENCE_IMAGES } from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-[#F7F6F2] border-b border-[#294D4A]/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
              Proven Groundwork &amp; Craft
            </p>
            <h2 className="font-display text-[#172625] text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight">
              Experience That Shows in the Details.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[#4B5B59] text-base sm:text-lg leading-relaxed">
              With more than 25 years of landscaping experience, our team has worked across a wide
              range of outdoor projects, bringing care, practical knowledge and attention to detail
              to every space.
            </p>
          </div>
        </div>

        {/* Asymmetric Editorial Grid: Prominent Project Photo + Verified Exhibition / Project Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          <div className="lg:col-span-7 flex flex-col">
            <figure className="h-full flex flex-col bg-white border border-[#294D4A]/12">
              <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] overflow-hidden">
                <OptimizedImage
                  image={EXPERIENCE_IMAGES.primary}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <figcaption className="px-5 py-4 border-t border-[#294D4A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#4B5B59]">
                <span className="font-medium text-[#172625]">
                  Raised porcelain terrace, inset steps &amp; brick retaining wall
                </span>
                <span>Completed project photography</span>
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-5 bg-[#141414] text-[#F5F5F5] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#68ACAE] mb-5">
                Notable Projects &amp; Exhibitions
              </p>
              <div className="divide-y divide-white/12">
                <div className="pb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-2xl font-semibold text-[#68ACAE] tabular-nums">
                      25+
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Years of Landscaping Experience
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[#E2E2E2]/85 leading-relaxed">
                    Over two decades laying sandstone and porcelain patios, block paving, structural
                    brickwork, and timber garden features.
                  </p>
                </div>

                <div className="py-5">
                  <h3 className="text-base font-semibold text-white">
                    Queen&apos;s Golden Jubilee Garden — Windsor Great Park
                  </h3>
                  <p className="mt-1.5 text-sm text-[#E2E2E2]/85 leading-relaxed">
                    Our team has worked on prestigious outdoor projects including the Queen&apos;s
                    Golden Jubilee Garden at Windsor Great Park.
                  </p>
                </div>

                <div className="py-5">
                  <h3 className="text-base font-semibold text-white">
                    RHS Chelsea Flower Show
                  </h3>
                  <p className="mt-1.5 text-sm text-[#E2E2E2]/85 leading-relaxed">
                    Landscaping work by our team has been exhibited at the RHS Chelsea Flower Show.
                  </p>
                </div>

                <div className="pt-5">
                  <h3 className="text-base font-semibold text-white">
                    Hampton Court Flower Show
                  </h3>
                  <p className="mt-1.5 text-sm text-[#E2E2E2]/85 leading-relaxed">
                    Landscaping work by our team has also been displayed at the Hampton Court Flower
                    Show.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/12">
              <a
                href="#work"
                className="inline-flex items-center text-sm font-semibold text-[#68ACAE] hover:text-white transition-colors"
              >
                Inspect finished work in our portfolio →
              </a>
            </div>
          </div>
        </div>

        {/* Supporting Genuine Detail Photography Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <figure className="bg-white border border-[#294D4A]/12 overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <OptimizedImage
                image={EXPERIENCE_IMAGES.detailOne}
                sizes="(min-width: 768px) 48vw, 100vw"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
            </div>
            <figcaption className="px-5 py-3.5 border-t border-[#294D4A]/10 text-sm text-[#4B5B59]">
              <strong className="font-medium text-[#172625]">Stepped masonry &amp; piers:</strong>{' '}
              clean mortar joints, brick pier caps, and timber gate fitting.
            </figcaption>
          </figure>

          <figure className="bg-white border border-[#294D4A]/12 overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <OptimizedImage
                image={EXPERIENCE_IMAGES.detailTwo}
                sizes="(min-width: 768px) 48vw, 100vw"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
                objectPosition="center 65%"
              />
            </div>
            <figcaption className="px-5 py-3.5 border-t border-[#294D4A]/10 text-sm text-[#4B5B59]">
              <strong className="font-medium text-[#172625]">Precision radius cutting:</strong>{' '}
              circular porcelain patio edged cleanly with charcoal cobble setts.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

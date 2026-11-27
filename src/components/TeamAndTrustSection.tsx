import { Phone, Mail } from 'lucide-react';
import { BRAND_INFO, CREDENTIALS_LIST, PROCESS_STEPS } from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

export function TeamAndTrustSection() {
  return (
    <>
      {/* SECTION 05 — THE TEAM: PERSONAL & APPROACHABLE */}
      <section id="team" className="py-20 sm:py-28 bg-white border-b border-[#294D4A]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
                The People Behind the Craft
              </p>
              <h2 className="font-display text-[#172625] text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight mb-5">
                A Close-Knit Team. A Shared Pride in Our Work.
              </h2>
              <p className="text-[#4B5B59] text-base sm:text-lg leading-relaxed mb-5">
                We are a close team of family and friends who share a commitment to careful
                workmanship and creating outdoor spaces that our customers can enjoy.
              </p>
              <p className="text-[#4B5B59] text-base leading-relaxed mb-8">
                Working as a dedicated family-and-friends team means you deal directly with the
                people planning, preparing, and building your garden—with consistent attention to
                foundations, drainage, levels, and finishing detail on every site.
              </p>

              {/* Direct Human Contact Strip (verified details only) */}
              <div className="bg-[#F7F6F2] border border-[#294D4A]/12 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#579091] mb-1">
                    Family Office
                  </p>
                  <a
                    href={BRAND_INFO.officePhoneHref}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-[#172625] hover:text-[#579091] transition-colors tabular-nums"
                  >
                    <Phone className="w-4 h-4 text-[#579091]" aria-hidden="true" />
                    <span>{BRAND_INFO.officePhone}</span>
                  </a>
                  <p className="text-xs text-[#4B5B59] mt-1">Hours: {BRAND_INFO.hours}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#579091] mb-1">
                    Matt&apos;s Mobile &amp; Email
                  </p>
                  <a
                    href={BRAND_INFO.mattMobileHref}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-[#172625] hover:text-[#579091] transition-colors tabular-nums"
                  >
                    <Phone className="w-4 h-4 text-[#579091]" aria-hidden="true" />
                    <span>{BRAND_INFO.mattMobile}</span>
                  </a>
                  <div className="mt-1">
                    <a
                      href={`mailto:${BRAND_INFO.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#294D4A] hover:text-[#579091] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{BRAND_INFO.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-stretch">
              <div className="col-span-7 aspect-[3/4] overflow-hidden bg-[#EFECE5]">
                <OptimizedImage
                  image={{
                    slug: 'block-path-roses',
                    width: 810,
                    height: 1080,
                    alt: 'Symmetrical herringbone block-paved garden walk flanked by rose borders',
                  }}
                  sizes="(min-width: 1024px) 28vw, 60vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <div className="col-span-5 flex flex-col gap-4">
                <div className="flex-1 overflow-hidden bg-[#EFECE5]">
                  <OptimizedImage
                    image={{
                      slug: 'stone-grey-courtyard',
                      width: 1080,
                      height: 810,
                      alt: 'Cleanly laid grey riven stone terrace alongside brickwork and lawn',
                    }}
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="bg-[#294D4A] text-white p-5">
                  <p className="font-display text-xl font-semibold mb-1">Family-Run Standards</p>
                  <p className="text-xs text-[#E2E2E2]/90 leading-relaxed">
                    Direct communication from initial visit through to final clean-down.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06 — TRUST & CREDIBILITY */}
      <section className="py-20 sm:py-24 bg-[#141414] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#68ACAE] mb-3">
              Verified Credentials &amp; Track Record
            </p>
            <h2 className="font-display text-white text-balance text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight">
              Built on Experience, Exhibitions &amp; Trusted Craft.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/12">
            {CREDENTIALS_LIST.map((cred, idx) => (
              <div
                key={cred.title}
                className="p-7 sm:p-8 border-r border-b border-white/12 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#68ACAE] tabular-nums">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-white mt-2 mb-3">
                    {cred.title}
                  </h3>
                  <p className="text-sm text-[#E2E2E2]/85 leading-relaxed">{cred.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 07 — HOW WE WORK */}
      <section id="process" className="py-20 sm:py-28 bg-[#F7F6F2] border-b border-[#294D4A]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
                How We Work
              </p>
              <h2 className="font-display text-[#172625] text-balance text-3xl sm:text-4xl font-semibold leading-[1.14] tracking-tight mb-5">
                A Straightforward Path from First Call to Finished Garden.
              </h2>
              <p className="text-[#4B5B59] text-base leading-relaxed mb-8">
                Every garden has its own levels, access, and soil conditions. We keep our process
                clear and personal so you know what to expect at every stage.
              </p>

              <div className="aspect-[16/10] overflow-hidden bg-[#EFECE5] border border-[#294D4A]/12">
                <OptimizedImage
                  image={{
                    slug: 'sandstone-white-cobbles',
                    width: 1080,
                    height: 810,
                    alt: 'Completed multi-tone sandstone front pathway with decorative white cobble border',
                  }}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#294D4A]/15 border-t border-b border-[#294D4A]/15">
              {PROCESS_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline"
                >
                  <div className="sm:col-span-2">
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-[#579091] tabular-nums">
                      {item.step}
                    </span>
                  </div>
                  <div className="sm:col-span-10">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#172625] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#4B5B59] text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

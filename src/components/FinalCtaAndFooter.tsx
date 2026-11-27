import { ArrowRight, Mail, Phone } from 'lucide-react';
import { BRAND_INFO, SERVICES_DATA } from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

interface FinalCtaAndFooterProps {
  onRequestQuote: () => void;
}

export function FinalCtaAndFooter({ onRequestQuote }: FinalCtaAndFooterProps) {
  return (
    <>
      {/* SECTION 10 — FINAL CONVERSION CTA */}
      <section className="relative py-24 sm:py-32 bg-[#141414] text-white overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            image={{
              slug: 'pergola-amber-studio',
              width: 1080,
              height: 486,
              alt: 'Timber pergola over grey natural stone patio with garden studio and lawn',
            }}
            sizes="100vw"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#141414]/92 via-[#141414]/80 to-[#141414]/68"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#68ACAE] mb-3">
              Start Your Garden Project
            </p>
            <h2 className="font-display text-white text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight mb-5">
              Your Garden Has Potential. Let&apos;s Make It Happen.
            </h2>
            <p className="text-[#E2E2E2] text-base sm:text-lg leading-relaxed mb-8">
              Tell us what you have in mind. Our team would be happy to discuss your landscaping
              ideas and arrange a free quotation.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                type="button"
                onClick={onRequestQuote}
                className="inline-flex items-center gap-2.5 min-h-[50px] px-7 py-3.5 text-sm font-semibold bg-[#579091] text-white hover:bg-[#39A097] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Arrange Your Free Quotation</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#F5F5F5]">
              <a
                href={BRAND_INFO.officePhoneHref}
                className="inline-flex items-center gap-2 hover:text-[#68ACAE] transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#68ACAE]" aria-hidden="true" />
                <span>Office: {BRAND_INFO.officePhone}</span>
              </a>
              <a
                href={`mailto:${BRAND_INFO.email}`}
                className="inline-flex items-center gap-2 hover:text-[#68ACAE] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#68ACAE]" aria-hidden="true" />
                <span>{BRAND_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FOOTER */}
      <footer className="bg-[#0C0D0D] text-[#E2E2E2] py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Brand Intro */}
            <div className="lg:col-span-4">
              <a href="#home" className="inline-flex items-center gap-3 mb-4">
                <picture>
                  <source srcSet="/images/logo/pl-logo.webp" type="image/webp" />
                  <img
                    src="/images/logo/pl-logo.png"
                    alt="Professional Landscapes logo"
                    width={52}
                    height={26}
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                </picture>
                <span className="font-display text-lg font-semibold text-white">
                  Professional Landscapes
                </span>
              </a>
              <p className="text-sm text-[#A1A1A1] leading-relaxed max-w-sm">
                A close team of family and friends with more than 25 years of landscaping
                experience across patios, driveways, brickwork, timber structures, and complete
                garden improvements.
              </p>
            </div>

            {/* Services Links */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white mb-4">
                Services
              </h3>
              <ul className="space-y-2.5 text-sm">
                {SERVICES_DATA.map((service) => (
                  <li key={service.id}>
                    <a
                      href="#services"
                      className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore Anchors */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#home" className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#experience"
                    className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors"
                  >
                    Experience
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors">
                    Project Portfolio
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#studio-3d"
                    className="text-[#A1A1A1] hover:text-[#68ACAE] transition-colors"
                  >
                    3D Garden Visualiser
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white mb-4">
                Contact
              </h3>
              <ul className="space-y-2.5 text-sm text-[#A1A1A1]">
                <li>
                  <a
                    href={BRAND_INFO.officePhoneHref}
                    className="hover:text-white transition-colors tabular-nums"
                  >
                    Office: {BRAND_INFO.officePhone}
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND_INFO.mattMobileHref}
                    className="hover:text-white transition-colors tabular-nums"
                  >
                    Matt mobile: {BRAND_INFO.mattMobile}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="hover:text-white transition-colors break-all"
                  >
                    {BRAND_INFO.email}
                  </a>
                </li>
              </ul>

              <div className="flex items-center gap-4 mt-5 text-sm">
                <a
                  href={BRAND_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#68ACAE] hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <a
                  href={BRAND_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#68ACAE] hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A1A1A1]">
            <p>© {new Date().getFullYear()} Professional Landscapes. All Rights Reserved.</p>
            <p>Hours: {BRAND_INFO.hours}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

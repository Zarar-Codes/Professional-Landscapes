import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  type PortfolioCategory,
  type PortfolioProject,
} from '../data/landscapingData';
import { OptimizedImage } from './OptimizedImage';

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PORTFOLIO_PROJECTS;
    return PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const openProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    setActiveSlideIndex(0);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };

  const selectedImages = useMemo(() => {
    if (!selectedProject) return [];
    return [selectedProject.mainImage, ...(selectedProject.detailImages ?? [])];
  }, [selectedProject]);

  const navigateProject = (direction: -1 | 1) => {
    if (!selectedProject) return;
    const idx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIdx]);
    setActiveSlideIndex(0);
  };

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateProject(1);
      if (e.key === 'ArrowLeft') navigateProject(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <section id="work" className="py-20 sm:py-28 bg-[#F7F6F2] border-b border-[#294D4A]/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portfolio Header & Category Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
              Completed Landscaping Work
            </p>
            <h2 className="font-display text-[#172625] text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight mb-4">
              Selected Projects Across Stone, Brick &amp; Timber.
            </h2>
            <p className="text-[#4B5B59] text-base sm:text-lg leading-relaxed">
              Every photograph below shows completed work by our team. Click any project to inspect
              full-resolution detail views and visible construction features.
            </p>
          </div>

          {/* Interactive Filter Bar */}
          <div
            role="tablist"
            aria-label="Filter portfolio projects by service category"
            className="flex flex-wrap gap-1.5 bg-[#EFECE5] p-1.5 border border-[#294D4A]/10"
          >
            {PORTFOLIO_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === category
                    ? 'bg-[#294D4A] text-white'
                    : 'text-[#172625] hover:text-[#579091]'
                }`}
              >
                {category === 'All' ? 'All Projects' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural Bento / Asymmetric Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => {
            const isFeatured =
              activeCategory === 'All' && (index === 0 || project.layoutSpan === 'featured');
            const isWide =
              activeCategory === 'All' && !isFeatured && project.layoutSpan === 'wide';
            const colClass = isFeatured
              ? 'md:col-span-2 lg:col-span-8'
              : isWide
              ? 'lg:col-span-6'
              : 'lg:col-span-4';

            const aspectClass = isFeatured
              ? 'aspect-[16/9]'
              : isWide
              ? 'aspect-[16/10]'
              : 'aspect-[4/3]';

            return (
              <article
                key={project.id}
                className={`${colClass} group bg-white border border-[#294D4A]/12 flex flex-col justify-between transition-colors hover:border-[#579091]`}
              >
                <button
                  type="button"
                  onClick={() => openProject(project)}
                  className="text-left flex flex-col h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579091]"
                  aria-label={`Inspect ${project.title} full-size photographs`}
                >
                  <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#EFECE5]`}>
                    <OptimizedImage
                      image={project.mainImage}
                      variant="thumbnail"
                      sizes={
                        isFeatured
                          ? '(min-width: 1024px) 64vw, 100vw'
                          : isWide
                          ? '(min-width: 1024px) 48vw, 100vw'
                          : '(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw'
                      }
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      wrapperClassName="w-full h-full"
                    />
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-[#141414]/86 text-white opacity-95 group-hover:bg-[#579091] transition-colors">
                      <Expand className="w-3 h-3" aria-hidden="true" />
                      <span>
                        View {1 + (project.detailImages?.length ?? 0)}{' '}
                        {(project.detailImages?.length ?? 0) > 0 ? 'Photos' : 'Photo'}
                      </span>
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#579091] mb-1.5">
                        {project.category}
                        <span className="mx-2 text-[#294D4A]/30" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[#4B5B59]">
                          {project.confirmedMaterials.join(' / ')}
                        </span>
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#172625] group-hover:text-[#294D4A] transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#4B5B59] leading-relaxed">{project.overview}</p>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Full-Size Lightbox Modal (loads -lg.webp on demand) */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
          className="fixed inset-0 z-50 bg-[#141414]/94 flex items-center justify-center p-3 sm:p-6 lg:p-10"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] bg-[#141414] border border-white/15 flex flex-col lg:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close project viewer"
              className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-11 h-11 bg-[#141414]/90 text-white border border-white/20 hover:bg-[#579091] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main High-Resolution Image Stage */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[260px] sm:min-h-[420px] lg:min-h-[560px]">
              <OptimizedImage
                image={selectedImages[activeSlideIndex]}
                variant="full"
                priority
                sizes="(min-width: 1024px) 68vw, 100vw"
                className="max-h-[60vh] lg:max-h-[82vh] w-auto max-w-full object-contain"
                wrapperClassName="w-full h-full"
              />

              {/* Project Prev / Next Controls */}
              {filteredProjects.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => navigateProject(-1)}
                    aria-label="Previous project"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 bg-[#141414]/85 text-white border border-white/15 hover:bg-[#579091] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateProject(1)}
                    aria-label="Next project"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 bg-[#141414]/85 text-white border border-white/15 hover:bg-[#579091] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Project Details & Detail-Image Thumbnails */}
            <div className="w-full lg:w-[360px] bg-[#1B1D1D] text-white p-6 sm:p-7 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/12">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#68ACAE] mb-2">
                  {selectedProject.category}
                </p>
                <h3 className="font-display text-2xl font-semibold text-white mb-3">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-[#E2E2E2] leading-relaxed mb-6">
                  {selectedProject.overview}
                </p>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A1A1A1] mb-2.5">
                    Visible Construction Features
                  </h4>
                  <ul className="space-y-2 text-sm text-[#E2E2E2]/90">
                    {selectedProject.visibleFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="text-[#68ACAE]" aria-hidden="true">
                          —
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A1A1A1] mb-2">
                    Confirmed Materials
                  </h4>
                  <p className="text-sm text-white">
                    {selectedProject.confirmedMaterials.join(' · ')}
                  </p>
                </div>

                {selectedImages.length > 1 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A1A1A1] mb-2.5">
                      Project Views ({activeSlideIndex + 1}/{selectedImages.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.map((img, i) => (
                        <button
                          key={img.slug}
                          type="button"
                          onClick={() => setActiveSlideIndex(i)}
                          className={`aspect-[4/3] overflow-hidden border-2 transition-colors cursor-pointer ${
                            activeSlideIndex === i
                              ? 'border-[#68ACAE]'
                              : 'border-transparent opacity-65 hover:opacity-100'
                          }`}
                          aria-label={`View photograph ${i + 1} of ${selectedProject.title}`}
                        >
                          <OptimizedImage
                            image={img}
                            variant="thumbnail"
                            sizes="100px"
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-white/12">
                <a
                  href="#quotation"
                  onClick={closeLightbox}
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#579091] text-white hover:bg-[#39A097] transition-colors"
                >
                  Enquire About a Similar Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

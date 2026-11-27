import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ServicesSection } from './components/ServicesSection';
import { GardenSceneCanvas } from './components/three/GardenSceneCanvas';
import { PortfolioSection } from './components/PortfolioSection';
import { TeamAndTrustSection } from './components/TeamAndTrustSection';
import { EnquirySection } from './components/EnquirySection';
import { FinalCtaAndFooter } from './components/FinalCtaAndFooter';

export default function App() {
  const [selectedProjectType, setSelectedProjectType] = useState<string | undefined>(undefined);

  const handleRequestQuote = useCallback((projectType?: string) => {
    if (projectType) {
      setSelectedProjectType(projectType);
    }
    const el = document.getElementById('quotation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#172625] selection:bg-[#579091] selection:text-white">
        <HeaderNav onRequestQuote={handleRequestQuote} />

        <main className="flex-1">
          <HeroSection onRequestQuote={() => handleRequestQuote()} />
          <ExperienceSection />
          <ServicesSection onSelectServiceQuote={handleRequestQuote} />
          <GardenSceneCanvas onSelectFinishQuote={handleRequestQuote} />
          <PortfolioSection />
          <TeamAndTrustSection />
          <EnquirySection preselectedProjectType={selectedProjectType} />
        </main>

        <FinalCtaAndFooter onRequestQuote={() => handleRequestQuote()} />
      </div>
    </MotionConfig>
  );
}

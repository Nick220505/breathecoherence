import { CTASection } from './components/home/cta-section';
import { FeaturesSection } from './components/home/features-section';
import { HeroSection } from './components/home/hero-section';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}

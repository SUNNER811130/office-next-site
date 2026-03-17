import { BrandCoreSection } from "@/components/home/brand-core-section";
import { CorporateTrainingSection } from "@/components/home/corporate-training-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import { FlagshipCourseSection } from "@/components/home/flagship-course-section";
import { HeroSection } from "@/components/home/hero-section";
import { InsightsSection } from "@/components/home/insights-section";
import { PainPointsSection } from "@/components/home/pain-points-section";
import { ServicesOverviewSection } from "@/components/home/services-overview-section";
import { WhySection } from "@/components/home/why-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandCoreSection />
      <WhySection />
      <PainPointsSection />
      <ServicesOverviewSection />
      <FlagshipCourseSection />
      <CorporateTrainingSection />
      <InsightsSection />
      <FinalCtaSection />
    </>
  );
}

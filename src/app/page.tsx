import PageTransition from "@/components/layout/PageTransition";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatisticsSection from "@/components/landing/StatisticsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <HeroSection />
        <FeaturesSection />
        <StatisticsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
    </PageTransition>
  );
}

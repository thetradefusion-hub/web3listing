import { Suspense } from "react";
import { HomeHero } from "@/components/public/home/hero";
import { WhySection } from "@/components/public/home/why-section";
import { IndustriesSection } from "@/components/public/home/industries-section";
import { ListingDeepDive } from "@/components/public/home/listing-deep-dive";
import { ServicePillars } from "@/components/public/home/service-pillars";
import { PricingPackages } from "@/components/public/home/pricing-packages";
import { PartnerStrip } from "@/components/public/home/partner-strip";
import { GrowthStats } from "@/components/public/home/growth-stats";
import { SetsApartSection } from "@/components/public/home/sets-apart-section";
import { ConsultationCta } from "@/components/public/home/consultation-cta";
import { HomeFaqSection } from "@/components/public/home/faq-section";
import { HomeDisclaimer } from "@/components/public/home/disclaimer";
import { HowItWorksSection } from "@/components/public/home/how-it-works-section";
import { PopularServicesSection } from "@/components/public/home/popular-services-section";
import { WhyChooseSection } from "@/components/public/home/why-choose-section";
import { ScrollToTop } from "@/components/public/scroll-to-top";
import { TelegramChatFab } from "@/components/public/telegram-chat-fab";
import { getHomeFeaturedServices } from "@/lib/home-featured-services";

export const revalidate = 300;

async function PopularServicesBlock() {
  const popularServices = await getHomeFeaturedServices();
  return <PopularServicesSection services={popularServices} />;
}

function PopularServicesFallback() {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted/70" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhySection />
      <PartnerStrip />
      <IndustriesSection />
      <ListingDeepDive />
      <PricingPackages />
      <ServicePillars />
      <GrowthStats />
      <HowItWorksSection />
      <Suspense fallback={<PopularServicesFallback />}>
        <PopularServicesBlock />
      </Suspense>
      <SetsApartSection />
      <WhyChooseSection />
      <HomeFaqSection />
      <ConsultationCta />
      <HomeDisclaimer />
      <TelegramChatFab />
      <ScrollToTop />
    </>
  );
}

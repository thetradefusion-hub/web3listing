import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HomeHero } from "@/components/public/home/hero";
import { WhySection } from "@/components/public/home/why-section";
import { StatsBanner } from "@/components/public/home/stats-banner";
import { ServicePillars } from "@/components/public/home/service-pillars";
import { PricingPackages } from "@/components/public/home/pricing-packages";
import { PartnerStrip } from "@/components/public/home/partner-strip";
import { ConsultationCta } from "@/components/public/home/consultation-cta";
import { ServiceShowcase } from "@/components/public/home/service-showcase";
import { HomeFaqSection } from "@/components/public/home/faq-section";
import { HomeDisclaimer } from "@/components/public/home/disclaimer";
import { HowItWorksSection } from "@/components/public/home/how-it-works-section";
import { PopularServicesSection } from "@/components/public/home/popular-services-section";
import { WhyChooseSection } from "@/components/public/home/why-choose-section";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*, service_categories(name, slug)")
    .eq("is_active", true)
    .order("sort_order")
    .limit(8);

  return (
    <>
      <HomeHero />
      <WhySection />
      <StatsBanner />
      <ServicePillars />
      <ConsultationCta />
      <PricingPackages />
      <PartnerStrip />
      <ServiceShowcase />
      <HowItWorksSection />
      <PopularServicesSection services={services} />
      <WhyChooseSection />
      <HomeFaqSection />
      <ConsultationCta
        title="Ready to grow your project?"
        subtitle="Launch faster, build trust, and scale your Web3 ecosystem with professional support."
        primaryLabel="Book a free consultation"
        secondaryLabel="Create your account"
        secondaryHref="/signup"
      />
      <HomeDisclaimer />
    </>
  );
}

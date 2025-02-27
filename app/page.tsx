import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";
import DynamicComponent from "@/components/DynamicComponent";

export const metadata = {
  title: "Shadcn - Landing template",
  description: "Free Shadcn landing page for developers",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "Free Shadcn landing page for developers",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn - Landing template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "Free Shadcn landing page for developers",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* <DynamicComponent componentKey="organize-tasks-simply-9ze37z" />
      <DynamicComponent componentKey="tic-tac-toe-8npgyr" /> */}
      <DynamicComponent componentKey="Organize-Tasks-Easily-8lww0y" />
      
      <DynamicComponent componentKey="brave-core-element-6oqyyh" />
      {/* <HeroSection /> */}

      <SponsorsSection />

      <DynamicComponent componentKey="benefits-layout-shift-724ydz" />
      {/* <BenefitsSection /> */}

      {/* keeping features the same */}
      <FeaturesSection />

      <DynamicComponent componentKey="business-growth-layout-1ezu9a" />
      {/* <ServicesSection /> */}

      {/* <DynamicComponent componentKey="carousel-review-slider-zdaxo2" /> */}
      <DynamicComponent componentKey="review-carousel-design-30z9u8" />
      {/* <TestimonialSection /> */}

      {/*  */}
      <TeamSection />

      {/* <DynamicComponent componentKey="Community-White-Invisible-31a4f3" /> */}
      <CommunitySection />

      <DynamicComponent componentKey="Pricing-Card-Design-qfy6yr" />
      {/* <PricingSection /> */}

      <DynamicComponent componentKey="contact-card-component-wiz1r1" />
      {/* <ContactSection /> */}

      <DynamicComponent componentKey="faq-accordion-component-qh3wdt" />
      {/* <FAQSection /> */}

      <FooterSection />
    </>
  );
}

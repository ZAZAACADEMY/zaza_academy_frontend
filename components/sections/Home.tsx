import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "../layout/Navbar";
import { Hero } from "./Hero";
import { WhyZaza } from "./WhyZaza";
import { WhatWillLearn } from "./WhatWillLearn";
import { AgeGroupProgram } from "./AgeGroupProgram";
import { Pricing } from "./Pricing";
import { FounderQuote } from "./FounderQuote";
import { Testimonials } from "./Testimonials";
import { CallToAction } from "./CallToAction";
import { Footer } from "../layout/Footer";
import { WavyDivider } from "../ui/WavyDivider";
import { FloatingDoodles } from "../ui/FloatingDoodles";

// Lazy load client components
const GetStarted = dynamic(
  () => import("./GetStarted").then((mod) => mod.GetStarted),
  {
    loading: () => (
      <div className="h-[600px] w-full bg-brand-cream animate-pulse" />
    ),
  },
);

const FAQ = dynamic(() => import("./FAQ").then((mod) => mod.FAQ), {
  loading: () => (
    <div className="h-[400px] w-full bg-brand-cream animate-pulse" />
  ),
});

export const Home = () => {
  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-dark selection:text-white overflow-x-hidden flex flex-col items-center">
      <Navbar />
      <main className="w-full relative">
        <FloatingDoodles />
        <Hero />

        {/* Cream -> White */}
        <div className="bg-white -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FDFCF8" />
        </div>
        <WhyZaza />

        {/* White -> Cream */}
        <div className="bg-brand-cream -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FFFFFF" />
        </div>
        <WhatWillLearn />

        {/* Cream -> White */}
        <div className="bg-white -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FDFCF8" />
        </div>
        <AgeGroupProgram />

        {/* White -> Cream */}
        <div className="bg-brand-cream -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FFFFFF" />
        </div>
        <GetStarted />

        {/* Cream -> White */}
        <div className="bg-white -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FDFCF8" />
        </div>
        <FounderQuote />

        {/* White -> Cream */}
        <div className="bg-brand-cream -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FFFFFF" />
        </div>
        <Pricing />

        {/* Cream -> White */}
        <div className="bg-white -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FDFCF8" />
        </div>
        <Testimonials />

        {/* White -> Pink FAQ */}
        <div className="bg-[#FFF5F9] -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FFFFFF" />
        </div>
        <FAQ />

        {/* Pink FAQ -> Cream CTA */}
        <div className="bg-brand-cream -mt-2 relative z-10 lg:hidden">
          <WavyDivider color="#FFF5F9" />
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

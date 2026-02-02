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
      <main className="w-full ">
        <Hero />
        <WhyZaza />
        <WhatWillLearn />
        <AgeGroupProgram />
        <GetStarted />
        <FounderQuote />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

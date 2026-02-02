"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FadeIn } from "../ui/motion/FadeIn";
import { motion } from "framer-motion";
import GetStartedImage1 from "../../public/images/GetStarted1.png";
import GetStartedImage2 from "../../public/images/GetStarted2.png";
import GetStartedImage3 from "../../public/images/GetStarted3.png";
import GetStartedImage4 from "../../public/images/GetStarted4.png";
import { useTranslations } from "next-intl";

const Step = ({
  number,
  title,
  description,
  isActive,
  onClick,
  isLast,
  stepRef,
}: {
  number: string;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  isLast: boolean;
  stepRef: React.Ref<HTMLDivElement>;
}) => (
  <div
    className="flex gap-4 cursor-pointer group isolate flex-1"
    onClick={onClick}
    ref={stepRef}
  >
    <div className="w-[24px]" aria-hidden />

    <div className={`w-full flex flex-col ${isLast ? "" : "pb-4"}`}>
      <div
        className={`relative flex-1 overflow-hidden flex items-start gap-4 p-4 md:p-5 rounded-[16px] border shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] transition-all duration-300 w-full
        ${
          isActive
            ? "border-transparent shadow-md scale-[1.02]"
            : "bg-white border-[#FBCFE3] hover:border-brand-accent/30 hover:shadow-md"
        }`}
        style={
          isActive
            ? {
                background:
                  "linear-gradient(90deg, #F9A8CB -33.71%, #FFFFFF 91.77%)",
              }
            : {}
        }
      >
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-display font-bold text-[20px] shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <h3 className="font-display font-bold text-[20px] md:text-[22px] text-brand-black leading-tight">
            {title}
          </h3>
          <p className="font-sans text-[#6B7280] text-[15px] leading-[160%]">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const GetStarted = () => {
  const t = useTranslations("GetStarted");
  const [activeStep, setActiveStep] = useState(0);
  const [highlightTop, setHighlightTop] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  type StepMessage = {
    number: string;
    title: string;
    description: string;
  };
  type StepData = StepMessage & { image: any };

  const stepImages = [
    GetStartedImage1,
    GetStartedImage2,
    GetStartedImage3,
    GetStartedImage4,
  ];

  const steps: StepData[] = (t.raw("steps") as StepMessage[]).map(
    (step, index) => ({
      ...step,
      image: stepImages[index] ?? stepImages[0],
    }),
  );

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const currentStep = stepRefs.current[activeStep];
      if (container && currentStep) {
        const containerRect = container.getBoundingClientRect();
        const stepRect = currentStep.getBoundingClientRect();
        setHighlightTop(stepRect.top - containerRect.top);
        setHighlightHeight(stepRect.height);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeStep]);

  return (
    <section className="w-full bg-brand-cream py-20" id="how-it-works">
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-16">
        <div className="text-center mb-[60px]">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] tracking-tight">
              {t.rich("title", {
                accent: (chunks) => (
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {chunks}
                  </span>
                ),
              })}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="font-sans font-medium text-[#6B7280] text-[16px] md:text-[18px] max-w-[600px] mx-auto leading-[160%]">
              {t("subtitle")}
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-[40px] lg:gap-[40px] lg:items-stretch">
          {/* Left Column: Steps */}
          <div
            className="relative flex flex-col h-full lg:justify-between w-full"
            ref={containerRef}
          >
            <div
              className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-[#E5E7EB] rounded-full"
              aria-hidden
            />
            <FadeIn direction="down" delay={0.1}>
              <motion.div
                className="absolute left-[20px] w-[4px] rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #7F26D9 0%, #C23CDD 50%, #F25A73 100%)",
                }}
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  top: highlightTop,
                  height: highlightHeight,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  opacity: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.6,
                  },
                }}
                aria-hidden
              />
            </FadeIn>
            {steps.map((step, index) => (
              <FadeIn
                key={index}
                direction="left"
                delay={0.1 * index}
                className={index < steps.length - 1 ? "flex-1" : ""}
              >
                <Step
                  {...step}
                  isActive={activeStep === index}
                  onClick={() => setActiveStep(index)}
                  isLast={index === steps.length - 1}
                  stepRef={(el) => {
                    stepRefs.current[index] = el;
                  }}
                />
              </FadeIn>
            ))}
          </div>

          {/* Right Column: Image Composition */}
          <FadeIn direction="right" delay={0.4} className="h-full">
            <div className="relative w-full lg:w-[576px] h-[664px] rounded-[16px] overflow-hidden shadow-xl mx-auto lg:ml-auto lg:mr-0 bg-gray-100">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    activeStep === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

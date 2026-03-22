"use client";

import React, { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Star } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { SparkleDoodle } from "../ui/Doodles";
import { TiltEffect } from "../ui/motion/TiltEffect";
import { useTranslations } from "next-intl";
import Profil1 from "../../public/images/amina.jpg";
import Profil3 from "../../public/images/profil2.jpg";

const TestimonialCard = ({
  quote,
  name,
  role,
  imageSrc,
}: {
  quote: string;
  name: string;
  role: string;
  imageSrc: string | StaticImageData;
}) => (
  <TiltEffect className="h-full">
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white p-[32px] rounded-[24px] border border-[#F0F0FF] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] lg:hover:shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col gap-[24px] h-full"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className="text-[#FFC107] fill-[#FFC107]"
            strokeWidth={1}
          />
        ))}
      </div>

      <p className="font-sans text-[#6B7280] text-[16px] leading-[160%] flex-grow">
        "{quote}"
      </p>

      <div className="flex items-center gap-[16px] mt-auto">
        <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={imageSrc}
            alt={name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="font-display font-bold text-[18px] text-brand-black leading-tight">
            {name}
          </h4>
          <span className="font-sans text-[13px] text-[#9CA3AF]">{role}</span>
        </div>
      </div>
    </motion.div>
  </TiltEffect>
);

/** Swipeable carousel used on mobile */
const TestimonialCarousel = ({
  testimonials,
}: {
  testimonials: {
    quote: string;
    name: string;
    role: string;
    imageSrc: string | StaticImageData;
  }[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = testimonials.length;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, count - 1));
    setActiveIndex(clamped);
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    animate(x, -clamped * containerWidth, {
      type: "spring",
      stiffness: 300,
      damping: 35,
      mass: 0.8,
    });
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const containerWidth = containerRef.current?.offsetWidth ?? 1;
    const threshold = containerWidth * 0.2;
    const { offset, velocity } = info;

    if (offset.x < -threshold || velocity.x < -500) {
      goTo(activeIndex + 1);
    } else if (offset.x > threshold || velocity.x > 500) {
      goTo(activeIndex - 1);
    } else {
      // snap back
      animate(x, -activeIndex * containerWidth, {
        type: "spring",
        stiffness: 300,
        damping: 35,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Track */}
      <div ref={containerRef} className="overflow-hidden w-full">
        <motion.div
          className="flex"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          initial={false}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-full px-1 select-none"
              style={{ userSelect: "none" }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            aria-label={`Testimonial ${index + 1}`}
            onClick={() => goTo(index)}
            className="transition-all duration-300 rounded-full bg-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
            style={{
              width: index === activeIndex ? 24 : 8,
              height: 8,
              opacity: index === activeIndex ? 1 : 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Testimonials = () => {
  const t = useTranslations("Testimonials");

  type TestimonialMessage = {
    quote: string;
    name: string;
    role: string;
  };

  const fallbackImages = [
    Profil1,
    "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=150&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YWZyaWNhbiUyMG1hbnxlbnwwfHwwfHw%3D",
    Profil3,
  ];

  const testimonials = (t.raw("items") as TestimonialMessage[]).map(
    (item, index) => ({
      ...item,
      imageSrc: fallbackImages[index % fallbackImages.length],
    }),
  );

  return (
    <section id="testimonials" className="w-full bg-white py-20 scroll-mt-24">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16">
        <div className="text-center mb-[60px]">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] tracking-tight relative inline-block">
              <SparkleDoodle className="w-8 h-8 text-[#F472B6] -top-6 -left-6" />
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

        {/* Mobile: swipe carousel */}
        <div className="md:hidden">
          <FadeIn direction="up" delay={0.3}>
            <TestimonialCarousel testimonials={testimonials} />
          </FadeIn>
        </div>

        {/* Desktop: 3-col grid */}
        <StaggerContainer className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <TestimonialCard {...testimonial} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

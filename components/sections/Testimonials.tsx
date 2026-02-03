"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { SparkleDoodle } from "../ui/Doodles";
import { TiltEffect } from "../ui/motion/TiltEffect";
import { useTranslations } from "next-intl";

const TestimonialCard = ({
  quote,
  name,
  role,
  imageSrc,
}: {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
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
          <Image src={imageSrc} alt={name} fill className="object-cover" />
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

export const Testimonials = () => {
  const t = useTranslations("Testimonials");

  type TestimonialMessage = {
    quote: string;
    name: string;
    role: string;
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YWZyaWNhbiUyMHdvbWFufGVufDB8fDB8fA%3D%3D",
    "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=150&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YWZyaWNhbiUyMG1hbnxlbnwwfHwwfHw%3D",
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMG1hbGV8ZW58MHx8MHx8",
  ];

  const testimonials = (t.raw("items") as TestimonialMessage[]).map(
    (item, index) => ({
      ...item,
      imageSrc: fallbackImages[index % fallbackImages.length],
    }),
  );

  return (
    <section id="testimonials" className="w-full bg-white py-20 scroll-mt-24">
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-16">
        <div className="text-center mb-[60px]">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] tracking-tight relative inline-block">
              <SparkleDoodle
                className="w-8 h-8 text-[#F472B6] -top-6 -left-6"
              />
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

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
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

"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "../ui/motion/FadeIn";
import { SparkleDoodle } from "../ui/Doodles";
import CtaImage from "../../public/images/HeroChild1.png";
import CtaImage2 from "../../public/images/AgeGroup2.png";
import { useTranslations } from "next-intl";

export const CallToAction = () => {
  const t = useTranslations("CallToAction");
  return (
    <section className="w-full max-w-[1440px] mx-auto px-2 md:px-16 py-10 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-[40px] px-6 py-16 md:px-12 md:py-24 overflow-hidden flex flex-col items-center text-center shadow-2xl"
        style={{
          background:
            "linear-gradient(107.74deg, #7F26D9 -10.12%, #C23CDD 46.16%, #F25A73 108.12%)",
        }}
      >
        {/* Background Decorative Elements */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#FFF 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Floating Images - Left */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block absolute left-[5%] top-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-white p-2 rounded-[20px] shadow-xl rotate-[-12deg]"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-full h-full"
          >
            <Image
              src={CtaImage}
              alt="Happy student"
              fill
              className="object-cover rounded-[16px]"
            />
          </motion.div>
        </motion.div>

        {/* Floating Images - Right */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-white p-2 rounded-[20px] shadow-xl rotate-[12deg]"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-full h-full"
          >
            <Image
              src={CtaImage2}
              alt="Group learning"
              fill
              className="object-cover rounded-[16px]"
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <FadeIn direction="up">
            <h2 className="font-display font-bold text-[32px] md:text-[48px] text-white mb-6 leading-[120%] relative">
              <SparkleDoodle className="absolute -top-8 -left-8 w-10 h-10 text-[#FFD700] animate-pulse hidden md:block" />
              {t("title")}
              <SparkleDoodle className="absolute -bottom-4 -right-6 w-8 h-8 text-[#FFD700] animate-pulse delay-75 hidden md:block" />
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className="font-sans font-medium text-white/90 text-[16px] md:text-[18px] mb-10 leading-[160%] max-w-xl">
              {t("subtitle")}
            </p>
          </FadeIn>

          <ScaleIn delay={0.4}>
            <button className="bg-brand-dark text-white font-bold text-[16px] md:text-[18px] px-8 py-4 rounded-full shadow-[0px_10px_20px_rgba(0,0,0,0.2)] hover:bg-[#1F1235] hover:scale-105 transition-all duration-300 flex items-center gap-2">
              {t("cta")} <ChevronRight size={20} />
            </button>
          </ScaleIn>
        </div>
      </motion.div>
    </section>
  );
};

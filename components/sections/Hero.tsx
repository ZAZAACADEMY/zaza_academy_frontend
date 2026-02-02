"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Star, PiggyBank, TrendingUp, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { JellyButton } from "../ui/motion/JellyButton";
import { UnderlineDoodle, SparkleDoodle } from "../ui/Doodles";
import { FloatingElements } from "../ui/FloatingElements";
import HeroChild1 from "../../public/images/HeroChild1.png";
import { useTranslations } from "next-intl";
import HeroChild2 from "../../public../../public/images/HeroChild2.png";
import HeroChild3 from "../../public/images/HeroChild3.png";
import HeroChild4 from "../../public/images/HeroChild4.png";

// Custom components to match the specific design needs
const FloatingImage = ({
  src,
  alt,
  className,
  rotation,
  priority = false,
  delay = 0, // Ajout du délai
}: {
  src: string;
  alt: string;
  className?: string;
  rotation?: string;
  priority?: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={`absolute rounded-2xl overflow-hidden shadow-lg border-[3px] border-white z-20 hidden lg:block ${className}`}
    style={{ transform: rotation ? `rotate(${rotation})` : undefined }}
    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
  >
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority={priority}
    />
  </motion.div>
);

const FeatureCard = ({
  icon,
  title,
  subtitle,
  description,
  rotateClass,
  shadowClass,
  zIndex = 10,
  style = {},
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  rotateClass?: string;
  shadowClass?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "backOut" }}
    className={`relative bg-white rounded-[20px] p-[20px] pt-[18px] flex flex-col gap-[14px] w-full max-w-[280px] md:w-[234px] lg:w-[320px] min-h-[245px] ${shadowClass} ${rotateClass}`}
    style={{ ...style, zIndex }}
    whileHover={{ scale: 1.05, zIndex: 50, transition: { duration: 0.3 } }}
  >
    <div className="flex items-center gap-[14px]">
      <div className="w-[56px] h-[56px] shrink-0 flex items-center justify-center rounded-2xl bg-gray-50 text-brand-dark">
        {icon}
      </div>
      <div className="flex flex-col gap-[2px]">
        <h3 className="font-semibold text-[14px] lg:text-[16px] text-[#111827] leading-[140%]">
          {title}
        </h3>
        <p className="font-normal text-[13px] lg:text-[14px] text-[#6B7280] leading-[140%]">
          {subtitle}
        </p>
      </div>
    </div>
    <p className="font-normal text-[13px] lg:text-[15px] text-[#111827] leading-[150%] text-left">
      {description}
    </p>
  </motion.div>
);

export const Hero = () => {
  const t = useTranslations("Hero");

  type FeatureCardMessage = {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  };

  const iconMap: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  > = {
    piggy: PiggyBank,
    trending: TrendingUp,
    sprout: Sprout,
  };

  const featureCards = (t.raw("featureCards") as FeatureCardMessage[]).map(
    (card) => ({
      ...card,
      Icon: iconMap[card.icon] ?? PiggyBank,
    }),
  );

  const desktopLayouts = [
    {
      wrapperClass: "absolute bottom-[28px] left-[calc(50%-425px)]",
      rotateClass: "-rotate-6",
      shadowClass: "shadow-card-1 border border-gray-100",
      zIndex: 10,
      style: { width: "350px" },
      delay: 0.8,
    },
    {
      wrapperClass: "absolute bottom-[35px] left-[calc(50%-175px)]",
      rotateClass: "rotate-2",
      shadowClass: "shadow-card-2",
      zIndex: 20,
      style: { width: "350px" },
      delay: 1.0,
    },
    {
      wrapperClass: "absolute bottom-[20px] left-[calc(50%+75px)]",
      rotateClass: "rotate-6",
      shadowClass: "shadow-card-3",
      zIndex: 30,
      style: { width: "350px" },
      delay: 1.2,
    },
  ];

  return (
    <section
      id="home"
      className="relative w-[calc(100%-20px)] mx-auto mt-1 md:min-h-[1000px] bg-hero-gradient rounded-2xl overflow-hidden  scroll-mt-[100px]"
    >
      <FloatingElements />
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#AFA6FB 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* --- DECORATIONS (Floating Images) --- */}

      {/* Top Left Image */}
      <FloatingImage
        src={HeroChild1.src}
        alt="Kids playing together"
        className="w-[100px] h-[100px] xl:w-[100px] xl:h-[100px] top-[180px] left-[20px] xl:top-[209px] xl:left-[90px]"
        rotation="15deg"
        priority={true}
        delay={0.2}
      />
      {/* Small Star near top left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="absolute top-[214px] left-[999px] hidden lg:block animate-pulse w-[40px] h-[40px]"
      >
        <Image
          src="/vectors/star-purple.svg"
          alt="Decorative purple star"
          fill
          className="object-contain"
          priority={false}
        />
      </motion.div>

      {/* Top Right Image */}
      <FloatingImage
        src={HeroChild2.src}
        alt="Boy reading"
        className="w-[100px] h-[100px] xl:w-[100px] xl:h-[100px] top-[140px] right-[40px] xl:top-[158px] xl:right-[140px]"
        rotation="15deg"
        delay={0.4}
      />

      {/* Bottom Left Image & Vector */}
      <FloatingImage
        src={HeroChild3.src}
        alt="Girl saving money"
        className="w-[100px] h-[100px] xl:w-[100px] xl:h-[100px] top-[500px] left-[40px] xl:top-[548px] xl:left-[95px]"
        rotation="-8deg"
        delay={0.6}
      />
      {/* Decorative loop vector */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute top-[553px] left-[219px] w-[88px] h-[87px] hidden lg:block"
      >
        <Image
          src="/vectors/loop-accent.svg"
          alt="Decorative accent loop"
          fill
          className="object-contain"
          priority={false}
        />
      </motion.div>
      {/* Pink Star */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        className="absolute top-[640px] left-[307px] hidden lg:block w-[30px] h-[30px] animate-bounce"
      >
        <Image
          src="/vectors/star-pink.svg"
          alt="Decorative pink star"
          fill
          className="object-contain"
          priority={false}
        />
      </motion.div>

      {/* Bottom Right Image & Vector */}
      <FloatingImage
        src={HeroChild4.src}
        alt="Group of friends"
        className="w-[100px] h-[100px] xl:w-[100px] xl:h-[100px] top-[480px] right-[60px] xl:top-[526px] xl:right-[195px]"
        rotation="-15deg"
        delay={0.8}
      />
      {/* Gradient Swirl Vector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        className="absolute top-[420px] right-[120px] w-[120px] h-[180px] hidden lg:block"
      >
        <Image
          src="/vectors/swirl-loop.svg"
          alt="Decorative gradient swirl"
          fill
          className="object-contain opacity-60"
          priority={false}
        />
      </motion.div>

      {/* --- MAIN CONTENT CENTER --- */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-2 md:px-16 flex flex-col items-center pt-[80px] sm:pt-[120px] md:pt-[190px] text-center">
        {/* Badge */}
        <FadeIn direction="down" delay={0.1}>
          <div className="inline-flex items-center px-[16px] md:px-[20px] py-[8px] md:py-[10px] rounded-[59px] border border-brand-dark bg-brand-light mb-[24px] md:mb-[40px]">
            <span className="font-montserrat font-medium text-[12px] md:text-[16px] text-brand-dark">
              Financial Education for Kids 5-16
            </span>
          </div>
        </FadeIn>

        {/* Hero Title */}
        <FadeIn delay={0.2} duration={0.8}>
          <h1 className="max-w-full md:max-w-[1086px] mx-auto font-display font-bold text-[36px] sm:text-[42px] md:text-[56px] lg:text-[64px] leading-[110%] md:leading-[120%] tracking-tight mb-[24px] md:mb-[40px] relative">
            <span className="hidden lg:block absolute -top-8 -left-12 opacity-80 animate-pulse">
              <SparkleDoodle className="w-12 h-12 text-[#FFD700]" />
            </span>
            {t.rich("title", {
              strong1: (chunks) => (
                <span className="bg-text-gradient bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
              strong2: (chunks) => (
                <span className="text-brand-dark">{chunks}</span>
              ),
              highlight: (chunks) => (
                <span className="relative inline-block">
                  <span className="bg-text-gradient bg-clip-text text-transparent block md:inline relative z-10">
                    {chunks}
                  </span>
                  <UnderlineDoodle className="absolute -bottom-2 left-0 w-full h-[15px] text-brand-accent/60 z-0" />
                </span>
              ),
            })}
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.4} duration={0.8}>
          <p className="max-w-full md:max-w-[630px] mx-auto font-montserrat font-medium text-[15px] md:text-[18px] text-brand-black leading-[150%] md:leading-[140%] mb-[32px] md:mb-[40px] px-2">
            {t("subtitle")}
          </p>
        </FadeIn>

        {/* Social Proof */}
        <FadeIn delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center gap-[12px] mb-[40px]">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[40px] md:w-[44px] h-[40px] md:h-[44px] rounded-full border border-white bg-[#D9D9D9] overflow-hidden relative"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?img=${i + 20}`}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-[#F59E0B] fill-[#F59E0B]"
                  />
                ))}
              </div>
              <p className="font-montserrat text-[13px] md:text-[14px] text-black">
                {t("socialProof.count")}{" "}
                <span className="font-medium text-[#9782F7]">
                  {t("socialProof.label")}
                </span>
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Buttons */}
        <FadeIn delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center gap-[16px] md:gap-[28px] mb-[60px] md:mb-0 w-full sm:w-auto px-4 sm:px-0">
            <JellyButton className="group flex items-center justify-center gap-[10px] w-full sm:w-[242px] h-[54px] bg-brand-dark rounded-[50px] shadow-btn-enroll transition-all duration-300">
              <span className="font-montserrat font-medium text-[16px] md:text-[18px] text-[#FDFDFD]">
                {t("enroll")}
              </span>
              <div className="bg-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} className="text-brand-dark" />
              </div>
            </JellyButton>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-[10px] w-full sm:w-[233px] h-[54px] bg-brand-light border-2 border-[#AFA6FB] rounded-[50px] hover:bg-white transition-all duration-300"
            >
              <div className="w-[24px] h-[24px] flex items-center justify-center bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-dark"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-montserrat font-medium text-[16px] md:text-[18px] text-brand-dark">
                {t("howKidsLearn")}
              </span>
            </motion.button>
          </div>
        </FadeIn>
      </div>

      {/* --- FEATURE CARDS SECTION --- */}

      {/* Desktop View (Cards at Bottom, Fanned Out) */}
      <div className="hidden lg:block absolute bottom-[-40px] left-0 right-0 w-full h-[320px] overflow-visible">
        <div className="relative w-full max-w-[1000px] mx-auto h-full">
          {/* Card 1: Saving Milestone (Left, Bottom Layer) */}
          {featureCards.map((card, index) => {
            const layout = desktopLayouts[index] ?? desktopLayouts[0];
            const Icon = card.Icon;
            return (
              <div key={card.title} className={layout.wrapperClass}>
                <FeatureCard
                  icon={
                    <Icon
                      size={36}
                      className={
                        index === 0
                          ? "text-pink-500"
                          : index === 1
                            ? "text-green-500"
                            : "text-yellow-500"
                      }
                    />
                  }
                  title={card.title}
                  subtitle={card.subtitle}
                  description={card.description}
                  rotateClass={layout.rotateClass}
                  shadowClass={layout.shadowClass}
                  zIndex={layout.zIndex}
                  style={layout.style}
                  delay={layout.delay}
                />
              </div>
            );
          })}

          {/* --- Buried Overlay Elements (Inside Desktop Container) --- */}
          {/* Left Overlay - Overlapping Left Card Extreme */}
          <div
            className="hidden lg:block absolute pointer-events-none z-[40]"
            style={{
              width: "64px",
              height: "235px",
              bottom: "28px",
              left: "calc(50% - 440px)",
              background:
                "linear-gradient(90deg, #FFF2B9 20%, rgba(255, 242, 185, 0) 100%)",
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
            }}
          />
          {/* Right Overlay - Overlapping Right Card Extreme */}
          <div
            className="hidden lg:block absolute pointer-events-none z-[40]"
            style={{
              width: "64px",
              height: "235px",
              bottom: "20px",
              left: "calc(50% + 310px)",
              background:
                "linear-gradient(90deg, rgba(255, 242, 185, 0) 0%, #FFF2B9 80%)",
              borderTopRightRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          />
        </div>
      </div>

      {/* Mobile/Tablet View for Cards (Stacked Vertically) */}
      <div className="lg:hidden flex flex-col gap-6 px-4 mt-8 pb-4 items-center w-full">
        {featureCards.map((card, index) => {
          const Icon = card.Icon;
          const colorClass =
            index === 0
              ? "text-pink-500"
              : index === 1
                ? "text-green-500"
                : "text-yellow-500";
          return (
            <FeatureCard
              key={card.title}
              icon={<Icon size={32} className={colorClass} />}
              title={card.title}
              subtitle={card.subtitle}
              description={card.description}
              rotateClass="rotate-0"
              shadowClass="shadow-lg"
            />
          );
        })}
      </div>
    </section>
  );
};

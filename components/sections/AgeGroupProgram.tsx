"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "../ui/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { CircleDoodle, ArrowDoodle } from "../ui/Doodles";
import { useLocale, useTranslations } from "next-intl";
import AgeGroupImage1 from "../../public/images/Saving.png";
import AgeGroupImage2 from "../../public/images/NeedsWants.png";
import AgeGroupImage3 from "../../public/images/AgeGroup3.png";

const ProgramCard = ({
  imageSrc,
  ageRange,
  title,
  description,
  gradientId,
  ctaLabel,
  onLearnMore,
}: {
  imageSrc: string | StaticImageData;
  ageRange: string;
  title: string;
  description: string;
  gradientId?: string;
  ctaLabel: string;
  onLearnMore: (trigger: HTMLElement) => void;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] hover:shadow-[0px_12px_40px_0px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full group cursor-pointer"
  >
    <div className="h-[240px] w-full overflow-hidden bg-gray-100 relative">
      <div className="absolute inset-0 bg-brand-light/20 z-10 mix-blend-multiply"></div>
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
    <div className="p-[32px] flex flex-col flex-grow items-start">
      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#EFEEFF] text-[#7F26D9] font-bold text-[12px] mb-5">
        {ageRange}
      </span>
      <h3 className="font-display font-bold text-[24px] text-brand-black mb-3 leading-[130%]">
        {title}
      </h3>
      <p className="font-sans text-[#6B7280] text-[15px] leading-[160%] mb-8 flex-grow">
        {description}
      </p>
      <button
        type="button"
        onClick={(e) => onLearnMore(e.currentTarget)}
        className="flex items-center gap-2 font-semibold text-[16px] group-hover:gap-3 transition-all duration-300"
        style={{
          background:
            "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {ctaLabel}{" "}
        <ArrowRight
          size={20}
          stroke={gradientId ? `url(#${gradientId})` : "currentColor"}
        />
      </button>
    </div>
  </motion.div>
);

export const AgeGroupProgram = () => {
  const t = useTranslations("AgeGroupProgram");
  const locale = useLocale();
  type Program = {
    imageSrc: string | StaticImageData;
    ageRange: string;
    title: string;
    description: string;
    details: string;
    gradientId?: string;
    ctaLabel: string;
  };

  const [activeProgram, setActiveProgram] = React.useState<Program | null>(
    null,
  );
  const gradientId = "age-arrow-gradient";
  const programs: Program[] = [
    {
      imageSrc: AgeGroupImage1,
      ageRange: t("programs.0.ageRange"),
      title: t("programs.0.title"),
      description: t("programs.0.description"),
      gradientId,
      details: t("programs.0.details"),
      ctaLabel: t("learnMore"),
    },
    {
      imageSrc: AgeGroupImage2,
      ageRange: t("programs.1.ageRange"),
      title: t("programs.1.title"),
      description: t("programs.1.description"),
      gradientId,
      details: t("programs.1.details"),
      ctaLabel: t("learnMore"),
    },
    {
      imageSrc: AgeGroupImage3,
      ageRange: t("programs.2.ageRange"),
      title: t("programs.2.title"),
      description: t("programs.2.description"),
      gradientId,
      details: t("programs.2.details"),
      ctaLabel: t("learnMore"),
    },
  ];

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!activeProgram) {
      return;
    }
    // Focus the close button when the modal opens
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProgram(null);
      }

      if (event.key === "Tab") {
        const focusableSelectors =
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusable =
          modalRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
        if (!focusable || focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement as HTMLElement | null;

        if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeProgram]);

  return (
    <section className="w-full bg-white py-20 relative" id="programs">
      <motion.div
        key={locale}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[1440px] mx-auto px-2 md:px-16"
      >
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7F26D9" />
              <stop offset="46.63%" stopColor="#C23CDD" />
              <stop offset="100%" stopColor="#DC2663" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex flex-col items-center text-center mb-[48px] md:mb-[60px] gap-6">
          <div className="max-w-[700px] mx-auto flex flex-col items-center text-center">
            <FadeIn direction="up">
              <h2 className="font-display font-bold text-[36px] md:text-[48px] text-brand-black mb-[16px] leading-[120%] tracking-tight">
                {t.rich("title", {
                  accent: (chunks) => (
                    <span className="relative inline-block px-2">
                      <span
                        className="relative z-10"
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
                      <CircleDoodle className="absolute -top-2 -left-2 w-[110%] h-[120%] text-brand-accent/40 z-0 -rotate-2" />
                    </span>
                  ),
                })}
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="font-sans text-[#4B5563] text-[16px] md:text-[18px] max-w-[600px] leading-[150%]">
                {t("subtitle")}
              </p>
            </FadeIn>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
          {programs.map((program, index) => (
            <StaggerItem key={index}>
              <ProgramCard
                imageSrc={program.imageSrc}
                ageRange={program.ageRange}
                title={program.title}
                description={program.description}
                gradientId={program.gradientId}
                ctaLabel={program.ctaLabel}
                onLearnMore={(trigger) => {
                  triggerRef.current = trigger;
                  setActiveProgram(program);
                }}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>

      <AnimatePresence>
        {activeProgram && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setActiveProgram(null);
              triggerRef.current?.focus();
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              ref={modalRef}
              className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="program-modal-title"
              aria-describedby="program-modal-description"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 8, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[220px] w-full bg-gray-100">
                <div className="absolute inset-0 bg-brand-light/15 z-10 mix-blend-multiply" />
                <Image
                  src={activeProgram.imageSrc}
                  alt={activeProgram.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EFEEFF] text-[#7F26D9] font-semibold text-[12px] w-fit">
                      {activeProgram.ageRange}
                    </span>
                    <h3
                      id="program-modal-title"
                      className="font-display font-bold text-[26px] md:text-[30px] text-brand-black leading-[120%]"
                    >
                      {activeProgram.title}
                    </h3>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => {
                      setActiveProgram(null);
                      triggerRef.current?.focus();
                    }}
                    className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    aria-label={t("close")}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p
                  id="program-modal-description"
                  className="text-[#4B5563] text-[15px] md:text-[16px] leading-[160%]"
                >
                  {activeProgram.description}
                </p>
                <div className="text-[#111827] text-[15px] md:text-[16px] leading-[170%] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-4">
                  {activeProgram.details}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

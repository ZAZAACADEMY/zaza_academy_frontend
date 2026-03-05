import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { FadeIn } from "../ui/motion/FadeIn";
import FounderImage from "../../public/images/Stephanie-Mbida.jpg";
import { useTranslations } from "next-intl";

export const FounderQuote = () => {
  const t = useTranslations("FounderQuote");
  const body = t.raw("body") as string[];
  return (
    <section className="w-full bg-white py-10 md:py-20">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16">
        <FadeIn>
          <div
            className="w-full rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start text-white relative overflow-hidden shadow-xl"
            style={{
              background:
                "linear-gradient(123.04deg, #7F26D9 -9.47%, #C23CDD 46.8%, #DC2663 118.16%)",
            }}
          >
            {/* Background Quote Icon */}
            <div className="absolute top-10 left-[30%] opacity-10 pointer-events-none">
              <Quote size={200} fill="white" />
            </div>

            {/* Left Column: Image & Name */}
            <div className="flex flex-col items-center gap-4 shrink-0 mx-auto lg:mx-0 w-full max-w-[300px]">
              <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden shadow-lg bg-white/10">
                <Image
                  src={FounderImage}
                  alt="Stéphanie Mbida"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center w-full">
                <h4 className="font-display font-bold text-[22px] leading-tight">
                  {t("name")}
                </h4>
                <p className="text-white/90 font-sans text-[14px] mt-1">
                  {t("role")}
                </p>
              </div>
            </div>

            {/* Right Column: Quote & Content */}
            <div className="flex flex-col relative z-10 pt-4 lg:pt-8 w-full">
              <h2 className="font-display font-bold text-[24px] md:text-[32px] lg:text-[36px] leading-[130%] mb-6">
                &ldquo;{t("quote")}&rdquo;
              </h2>

              <div className="space-y-6 text-white/90 font-sans text-[15px] md:text-[16px] leading-[160%] font-medium max-w-3xl">
                {body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 opacity-80">
                <div className="h-[1px] w-[50px] bg-white"></div>
                <span className="font-display font-bold text-lg">
                  {t("name")}
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

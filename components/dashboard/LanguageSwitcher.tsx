"use client";

import React from "react";
import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";

/** Compact pill switcher — pass `dark` for use on dark backgrounds */
export const LanguageSwitcherLight = ({ dark = false }: { dark?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div
      className={`${
        dark ? "bg-white/10" : "bg-gray-100"
      } rounded-full p-[3px] relative grid grid-cols-2 h-8 w-[68px] shrink-0`}
    >
      <div
        className={`absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] bg-white rounded-full transition-all duration-300 shadow-sm ${
          locale === "en" ? "left-[calc(50%+1px)]" : "left-[3px]"
        }`}
      />
      <button
        onClick={() => router.replace(pathname, { locale: "fr" })}
        className={`relative z-10 text-[11px] font-bold transition-colors flex items-center justify-center ${
          locale === "fr"
            ? "text-[#2D1B4E]"
            : dark
              ? "text-white/50 hover:text-white/80"
              : "text-gray-400"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => router.replace(pathname, { locale: "en" })}
        className={`relative z-10 text-[11px] font-bold transition-colors flex items-center justify-center ${
          locale === "en"
            ? "text-[#2D1B4E]"
            : dark
              ? "text-white/50 hover:text-white/80"
              : "text-gray-400"
        }`}
      >
        EN
      </button>
    </div>
  );
};

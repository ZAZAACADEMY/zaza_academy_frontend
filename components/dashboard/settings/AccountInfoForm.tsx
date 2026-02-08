"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRY_CODES } from "@/components/auth/signup/constants";

export const AccountInfoForm = () => {
  const t = useTranslations("dashboard.settings.form");
  const locale = useLocale();
  const [country, setCountry] = useState("US"); // Default value for demo
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryWrapperRef = useRef<HTMLDivElement>(null);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch (e) {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
  }, [locale]);

  const countryOptions = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        name: displayNames.of(code) ?? code,
      })),
    [displayNames],
  );

  // Initialize search with current country name
  useEffect(() => {
    const found = countryOptions.find((c) => c.code === country);
    if (found) {
      setCountrySearch(found.name);
    }
  }, [country, countryOptions]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryWrapperRef.current &&
        !countryWrapperRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
        // Reset search to current selected country
        const found = countryOptions.find((c) => c.code === country);
        if (found) {
          setCountrySearch(found.name);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [country, countryOptions]);

  return (
    <div className="bg-[#F8F7FF] rounded-[24px] p-8 mb-8">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("firstName")}
            </label>
            <input
              type="text"
              defaultValue="Zaza"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("lastName")}
            </label>
            <input
              type="text"
              defaultValue="Academy"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("email")}
            </label>
            <input
              type="email"
              defaultValue="zazaacademy@gmail.com"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("country")}
            </label>
            <div className="relative" ref={countryWrapperRef}>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                  setIsCountryOpen(true);
                }}
                onFocus={() => setIsCountryOpen(true)}
                placeholder={t("selectCountry")}
                className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400 transition-all cursor-pointer"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="rotate-90 text-gray-400" size={20} />
              </div>

              {isCountryOpen && (
                <div
                  role="listbox"
                  className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-[250px] overflow-y-auto bg-white border border-gray-100 rounded-[24px] shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                >
                  {countryOptions.filter((c) =>
                    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
                  ).length > 0 ? (
                    countryOptions
                      .filter((c) =>
                        c.name
                          .toLowerCase()
                          .includes(countrySearch.toLowerCase()),
                      )
                      .map((c) => (
                        <div
                          key={c.code}
                          role="option"
                          aria-selected={country === c.code}
                          className={`px-4 py-2.5 rounded-[12px] cursor-pointer text-sm font-medium transition-colors ${country === c.code ? "bg-[#F3F0FF] text-[#A655F7]" : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"}`}
                          onClick={() => {
                            setCountry(c.code);
                            setCountrySearch(c.name);
                            setIsCountryOpen(false);
                          }}
                        >
                          {c.name}
                        </div>
                      ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      {t("noCountries")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-[#2D1B4E] text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

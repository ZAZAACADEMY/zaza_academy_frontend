"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRY_CODES } from "@/components/auth/signup/constants";
import { useGetMeQuery, useUpdateMeMutation } from "@/lib/store/services/usersApi";

export const AccountInfoForm = () => {
  const t = useTranslations("dashboard.settings.form");
  const locale = useLocale();

  const { data: user, isLoading: isLoadingUser } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating, isSuccess }] = useUpdateMeMutation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "US",
  });

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        country: user.country?.code || "US",
      });
    }
  }, [user]);

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

  useEffect(() => {
    const found = countryOptions.find((c) => c.code === formData.country);
    if (found) {
      setCountrySearch(found.name);
    }
  }, [formData.country, countryOptions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryWrapperRef.current &&
        !countryWrapperRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
        const found = countryOptions.find((c) => c.code === formData.country);
        if (found) {
          setCountrySearch(found.name);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formData.country, countryOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateMe({
      first_name: formData.first_name,
      last_name: formData.last_name,
      // email is not updated here as it's often a separate verification process
      country: formData.country as any,
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-40 bg-[#F8F7FF] rounded-[24px] p-8 mb-8">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F7FF] rounded-[24px] p-8 mb-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("firstName")}
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              {t("lastName")}
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
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
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-6 py-3 rounded-full border border-purple-200 bg-gray-100 text-gray-500 cursor-not-allowed"
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
                          aria-selected={formData.country === c.code}
                          className={`px-4 py-2.5 rounded-[12px] cursor-pointer text-sm font-medium transition-colors ${formData.country === c.code ? "bg-[#F3F0FF] text-[#A655F7]" : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"}`}
                          onClick={() => {
                            setFormData(prev => ({...prev, country: c.code}));
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

        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-[#2D1B4E] text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating && <Loader2 className="animate-spin" size={18} />}
            {t("save")}
          </button>
          {isSuccess && (
             <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-medium">{t('successMessage')}</span>
             </div>
          )}
        </div>
      </form>
    </div>
  );
};

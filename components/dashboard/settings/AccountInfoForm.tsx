"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronRight,
  Loader2,
  CheckCircle,
  Pencil,
  X,
  Globe,
  Mail,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRY_CODES } from "@/components/auth/signup/constants";
import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/lib/store/services/usersApi";
import { toast } from "sonner";

const ReadRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
      {icon}
      {label}
    </span>
    <span className="font-semibold text-[15px] text-[#1F1235]">
      {value || "—"}
    </span>
  </div>
);

export const AccountInfoForm = () => {
  const t = useTranslations("dashboard.settings.form");
  const locale = useLocale();

  const { data: user, isLoading: isLoadingUser } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating, isSuccess }] =
    useUpdateMeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "US",
  });
  // Snapshot to restore on cancel
  const [savedData, setSavedData] = useState(formData);

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

  useEffect(() => {
    if (user) {
      const initial = {
        first_name: (user as any).first_name || "",
        last_name: (user as any).last_name || "",
        email: (user as any).email || "",
        country: (user as any).country?.code || "US",
      };
      setFormData(initial);
      setSavedData(initial);
    }
  }, [user]);

  useEffect(() => {
    const found = countryOptions.find((c) => c.code === formData.country);
    if (found) setCountrySearch(found.name);
  }, [formData.country, countryOptions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryWrapperRef.current &&
        !countryWrapperRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
        const found = countryOptions.find((c) => c.code === formData.country);
        if (found) setCountrySearch(found.name);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.country, countryOptions]);

  // Return to view mode after successful save
  useEffect(() => {
    if (isSuccess) {
      setSavedData(formData);
      toast.success(t("successMessage"), { duration: 3000 });
      const timer = setTimeout(() => setIsEditing(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateMe({
      first_name: formData.first_name,
      last_name: formData.last_name,
      country: formData.country as any,
    } as any);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  const countryLabel =
    countryOptions.find((c) => c.code === formData.country)?.name ??
    formData.country;

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin text-brand-purple" size={28} />
      </div>
    );
  }

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{t("emailNote")}</p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-purple-700 transition-colors px-4 py-2 rounded-full border border-purple-200 hover:bg-purple-50"
          >
            <Pencil size={14} />
            {t("edit")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadRow
            label={t("firstName")}
            value={formData.first_name}
            icon={<User size={11} />}
          />
          <ReadRow
            label={t("lastName")}
            value={formData.last_name}
            icon={<User size={11} />}
          />
          <ReadRow
            label={t("email")}
            value={formData.email}
            icon={<Mail size={11} />}
          />
          <ReadRow
            label={t("country")}
            value={countryLabel}
            icon={<Globe size={11} />}
          />
        </div>
      </div>
    );
  }

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{t("emailNote")}</p>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <X size={14} />
          {t("cancel")}
        </button>
      </div>

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
                        className={`px-4 py-2.5 rounded-[12px] cursor-pointer text-sm font-medium transition-colors ${
                          formData.country === c.code
                            ? "bg-[#F3F0FF] text-[#A655F7]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, country: c.code }));
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
            <span className="font-medium">{t("successMessage")}</span>
          </div>
        )}
      </div>
    </form>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Cookie,
  ChevronDown,
  Shield,
  BarChart2,
  Megaphone,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

const STORAGE_KEY = "zaza_cookie_consent";
const CONSENT_VERSION = 2; // Bump this number to force the banner to reappear for all users

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

type PanelView = "banner" | "settings";

export const CookieBanner = () => {
  const t = useTranslations("Cookies");

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>("banner");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If no version or outdated version, show banner again
        if (!parsed._version || parsed._version < CONSENT_VERSION) {
          setTimeout(() => {
            setVisible(true);
            setIsFirstVisit(true);
          }, 4000);
        } else {
          setPreferences(parsed);
          setVisible(false);
        }
      } catch {
        // Corrupted storage — show after short delay
        setTimeout(() => {
          setVisible(true);
          setIsFirstVisit(true);
        }, 4000);
      }
    } else {
      // First visit: wait 4 seconds before appearing
      setTimeout(() => {
        setVisible(true);
        setIsFirstVisit(true);
      }, 4000);
    }
  }, []);

  const persist = (prefs: CookiePreferences) => {
    const toStore = { ...prefs, _version: CONSENT_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    setPreferences(prefs);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setVisible(false);
    }, 900);
  };

  const acceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () =>
    persist({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => persist({ ...preferences, necessary: true });

  const openSettings = () => {
    setPanelView("settings");
    setVisible(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Floating cookie icon — hidden while panel is open ── */}
      <button
        onClick={openSettings}
        aria-label={t("openSettings")}
        className={`fixed bottom-[70px] left-1 lg:bottom-1 lg:left-1 z-40 w-8 h-8 bg-white/80 border border-gray-200 shadow-md rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group ${
          visible
            ? "opacity-0 pointer-events-none"
            : "opacity-100 animate-fade-in"
        } ${scrolled ? "max-lg:opacity-0 max-lg:pointer-events-none" : ""}`}
      >
        <Cookie
          size={15}
          className="text-[#A655F7] group-hover:rotate-12 transition-transform duration-300"
        />
      </button>

      {/* â”€â”€ Overlay â”€â”€ */}
      {visible && (
        <>
          {/* Backdrop â€” only in settings mode */}
          {panelView === "settings" && (
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
              onClick={() => {
                if (!isFirstVisit) setVisible(false);
              }}
            />
          )}

          {/* â”€â”€ Panel â”€â”€ */}
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-5">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
              {/* â”€â”€ Header â”€â”€ */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Back button in settings during first visit */}
                  {panelView === "settings" && isFirstVisit && (
                    <button
                      type="button"
                      onClick={() => setPanelView("banner")}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#A655F7] hover:bg-[#F3F0FF] transition-colors -ml-1"
                      aria-label={t("back")}
                    >
                      <ArrowLeft size={17} />
                    </button>
                  )}
                  <div className="w-9 h-9 rounded-full bg-[#F3F0FF] flex items-center justify-center shrink-0">
                    <Cookie size={17} className="text-[#A655F7]" />
                  </div>
                  <h2 className="font-bold text-brand-black text-[16px] leading-tight">
                    {panelView === "banner"
                      ? t("bannerTitle")
                      : t("settingsTitle")}
                  </h2>
                </div>

                {/* Close â€” only when the user already made a choice */}
                {!isFirstVisit && (
                  <button
                    onClick={() => setVisible(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label={t("close")}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {/* â”€â”€ Body â”€â”€ */}
              <div
                className={`px-6 py-5 space-y-4 ${
                  panelView === "settings"
                    ? "max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                    : ""
                }`}
              >
                {/* â”€â”€ Banner view â”€â”€ */}
                {panelView === "banner" && (
                  <>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("bannerDescription")}{" "}
                      <Link
                        href="/privacy"
                        className="text-[#A655F7] underline underline-offset-2 hover:text-[#7C3AED] transition-colors"
                      >
                        {t("privacyLink")}
                      </Link>
                    </p>
                    <p className="text-xs text-gray-400 italic -mt-1">
                      {t("bannerSubtitle")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={acceptAll}
                        className="flex-1 bg-[#A655F7] text-white font-bold text-sm py-3 rounded-[50px] hover:bg-[#8B35E8] active:scale-95 transition-all shadow-sm"
                      >
                        {t("acceptAll")}
                      </button>
                      <button
                        onClick={rejectAll}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-[50px] hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        {t("rejectAll")}
                      </button>
                      <button
                        onClick={() => setPanelView("settings")}
                        className="flex-1 border border-gray-300 text-gray-600 font-semibold text-sm py-3 rounded-[50px] hover:border-[#A655F7] hover:text-[#A655F7] hover:bg-[#F3F0FF] active:scale-95 transition-all"
                      >
                        {t("customize")}
                      </button>
                    </div>
                  </>
                )}

                {/* â”€â”€ Settings view â”€â”€ */}
                {panelView === "settings" && (
                  <>
                    <p className="text-xs text-gray-400 leading-relaxed -mt-1">
                      {t("settingsDescription")}
                    </p>

                    <div className="space-y-2.5">
                      {/* Necessary */}
                      <CategoryRow
                        icon={<Shield size={15} className="text-[#A655F7]" />}
                        label={t("necessaryLabel")}
                        description={t("necessaryDesc")}
                        enabled={true}
                        locked={true}
                        requiredLabel={t("requiredLabel")}
                        isOpen={false}
                        onToggleOpen={() => {}}
                      />
                      {/* Analytics */}
                      <CategoryRow
                        icon={
                          <BarChart2 size={15} className="text-[#A655F7]" />
                        }
                        label={t("analyticsLabel")}
                        description={t("analyticsDesc")}
                        enabled={preferences.analytics}
                        locked={false}
                        requiredLabel={t("requiredLabel")}
                        isOpen={analyticsOpen}
                        onToggleOpen={() => setAnalyticsOpen((v) => !v)}
                        onToggleEnabled={(val) =>
                          setPreferences((p) => ({ ...p, analytics: val }))
                        }
                      />
                      {/* Marketing */}
                      <CategoryRow
                        icon={
                          <Megaphone size={15} className="text-[#A655F7]" />
                        }
                        label={t("marketingLabel")}
                        description={t("marketingDesc")}
                        enabled={preferences.marketing}
                        locked={false}
                        requiredLabel={t("requiredLabel")}
                        isOpen={marketingOpen}
                        onToggleOpen={() => setMarketingOpen((v) => !v)}
                        onToggleEnabled={(val) =>
                          setPreferences((p) => ({ ...p, marketing: val }))
                        }
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <button
                        onClick={saveCustom}
                        className="flex-1 bg-[#A655F7] text-white font-bold text-sm py-3 rounded-[50px] hover:bg-[#8B35E8] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        {saved ? (
                          <>
                            <CheckCircle2 size={16} />
                            {t("saved")}
                          </>
                        ) : (
                          t("savePreferences")
                        )}
                      </button>
                      <button
                        onClick={acceptAll}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-[50px] hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        {t("acceptAll")}
                      </button>
                      <button
                        onClick={rejectAll}
                        className="flex-1 border border-gray-300 text-gray-600 font-semibold text-sm py-3 rounded-[50px] hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        {t("rejectAll")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* â”€â”€â”€ Category row sub-component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface CategoryRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  locked: boolean;
  requiredLabel: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleEnabled?: (val: boolean) => void;
}

const CategoryRow = ({
  icon,
  label,
  description,
  enabled,
  locked,
  requiredLabel,
  isOpen,
  onToggleOpen,
  onToggleEnabled,
}: CategoryRowProps) => (
  <div
    className={`rounded-2xl overflow-hidden border transition-colors duration-200 ${
      enabled
        ? "border-[#A655F7]/30 bg-[#FAFAFF]"
        : "border-gray-200 bg-gray-50"
    }`}
  >
    {/* Row header */}
    <div className="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex items-center gap-2.5 flex-1 text-left min-w-0"
      >
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-200 ${
            enabled
              ? "bg-[#F3F0FF] border-[#A655F7]/20"
              : "bg-white border-gray-200"
          }`}
        >
          {icon}
        </span>
        <span
          className={`font-semibold text-sm truncate transition-colors duration-200 ${
            enabled ? "text-[#7C3AED]" : "text-brand-black"
          }`}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 ml-auto shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Toggle */}
      <div className="ml-3 shrink-0">
        {locked ? (
          <span className="text-xs text-[#A655F7] font-semibold bg-[#F3F0FF] px-3 py-1 rounded-full">
            {requiredLabel}
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggleEnabled?.(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A655F7] focus-visible:ring-offset-2 ${
              enabled ? "bg-[#A655F7]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      </div>
    </div>

    {/* Accordion description */}
    <div
      style={{ maxHeight: isOpen ? "200px" : "0px" }}
      className="overflow-hidden transition-all duration-300 ease-in-out"
    >
      <p className="px-4 pb-3.5 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
        {description}
      </p>
    </div>
  </div>
);

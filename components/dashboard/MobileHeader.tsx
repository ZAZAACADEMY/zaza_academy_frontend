"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useGetMeQuery } from "@/lib/store/services/usersApi";
import { useLogoutMutation } from "@/lib/store/services/authApi";
import { tokenStore } from "@/lib/api/tokenStore";
import { LogoutModal } from "./LogoutModal";
import { LanguageSwitcherLight } from "./LanguageSwitcher";

export const MobileHeader = () => {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const router = useRouter();

  const { data: userData } = useGetMeQuery();
  const u = userData as any;
  const fullName = [u?.first_name, u?.last_name].filter(Boolean).join(" ");
  const initials =
    [u?.first_name?.[0], u?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() ||
    u?.email?.[0]?.toUpperCase() ||
    "?";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    toast.success(t("farewellToast"), { duration: 2500, icon: "👋" });
    await new Promise((r) => setTimeout(r, 600));
    try {
      tokenStore.removeTokens();
      localStorage.removeItem("zaza_signup_state");
      logout();
    } catch (e) {
      console.warn("Logout failed (demo mode)", e);
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/login", { locale });
  };

  return (
    <>
      <div className="lg:hidden bg-[#2D1B4E] px-4 h-14 flex items-center justify-between fixed top-0 left-0 right-0 z-30 gap-3">
        {/* Logo */}
        <a href={`/${locale}`} className="shrink-0">
          <Image
            src="/vectors/logo_dashboard.svg"
            alt="Zaza"
            width={80}
            height={32}
            className="h-7 w-auto"
          />
        </a>

        {/* Right side: lang + profile */}
        <div className="flex items-center gap-2 ml-auto">
          <LanguageSwitcherLight dark />

          {/* Profile avatar + dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full pl-1 pr-2 py-1"
            >
              {/* Avatar circle */}
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-bold text-[11px] shrink-0 border border-white/20">
                {initials}
              </div>
              <ChevronDown
                size={13}
                className={`text-white/70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/60">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-[#1F1235] truncate leading-tight">
                        {fullName || u?.email || "—"}
                      </span>
                      {fullName && (
                        <span className="text-gray-400 text-xs truncate">
                          {u?.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <Link
                      href={`/${locale}/dashboard/settings`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={15} className="text-gray-400" />
                      {t("account")}
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut size={15} />
                      {t("logout")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        userName={fullName || u?.email || ""}
      />
    </>
  );
};

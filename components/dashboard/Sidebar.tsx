"use client";

import React, { useState } from "react";
import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  LayoutDashboard,
  // Users,
  // BookOpen,
  PlayCircle,
  Video,
  // Award,
  CreditCard,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { LogoutModal } from "./LogoutModal";
import Image from "next/image";
import { useLogoutMutation } from "@/lib/store/services/authApi";
import { useGetMeQuery } from "@/lib/store/services/usersApi";
import { tokenStore } from "@/lib/api/tokenStore";
import { toast } from "sonner";

const sidebarItems = [
  { icon: LayoutDashboard, key: "dashboard", href: "/dashboard" },
  //   { icon: BookOpen, key: "programs", href: "/dashboard/programs" },
  { icon: PlayCircle, key: "videoLibrary", href: "/dashboard/videos" },
  { icon: Video, key: "liveSessions", href: "/dashboard/live" },
  //   { icon: Award, key: "achievements", href: "/dashboard/achievements" },
  { icon: CreditCard, key: "billing", href: "/dashboard/billing" },
  { icon: Settings, key: "settings", href: "/dashboard/settings" },
];

const SidebarLanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="mx-4 mb-6 bg-white/10 rounded-full p-1 relative grid grid-cols-2 h-[40px]">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 shadow-sm ${
          locale === "en" ? "left-[calc(50%)]" : "left-1"
        }`}
      />
      <button
        onClick={() => handleLanguageChange("fr")}
        className={`relative z-10 text-sm font-bold transition-colors flex items-center justify-center ${
          locale === "fr" ? "text-[#2D1B4E]" : "text-white/70 hover:text-white"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange("en")}
        className={`relative z-10 text-sm font-bold transition-colors flex items-center justify-center ${
          locale === "en" ? "text-[#2D1B4E]" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export const Sidebar = () => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();
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

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    // Show farewell toast briefly before redirecting
    toast.success(t("farewellToast"), {
      duration: 2500,
      icon: "👋",
    });

    // Small delay so the toast is visible
    await new Promise((r) => setTimeout(r, 600));

    try {
      tokenStore.removeTokens();
      localStorage.removeItem("zaza_signup_state");
      logout();
    } catch (e) {
      console.warn("Logout API call failed (expected in demo mode)", e);
    }

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }

    router.replace("/login", { locale });
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-[#2D1B4E] text-white h-screen fixed left-0 top-0 overflow-y-auto z-50">
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/">
            {/* Using Next Image for the SVG logo */}
            <Image
              src="/vectors/logo_dashboard.svg"
              alt="Zaza Logo"
              width={100}
              height={100}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {sidebarItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-[#2D1B4E] font-bold"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher & Profile */}
        <div className="mt-auto">
          <SidebarLanguageSwitcher />

          {/* User Profile Block with popup */}
          <div className="relative mx-4 mb-4" ref={profileRef}>
            {/* Popup — appears above the button */}
            {isProfileOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-50">
                {/* User info header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-[#1F1235] truncate">
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
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                    {t("account")}
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut size={16} />
                    {t("logout")}
                  </button>
                </div>
              </div>
            )}

            {/* Trigger button */}
            <button
              onClick={() => setIsProfileOpen((v) => !v)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A655F7] to-[#F46AA3] flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-white/20">
                {initials}
              </div>
              <div className="flex flex-col min-w-0 flex-1 text-left">
                <span className="text-white font-semibold text-sm leading-tight truncate">
                  {fullName || u?.email || "—"}
                </span>
                {fullName && (
                  <span className="text-white/50 text-xs truncate">
                    {u?.email}
                  </span>
                )}
              </div>
              <ChevronUp
                size={14}
                className={`text-white/40 shrink-0 transition-transform duration-200 ${isProfileOpen ? "" : "rotate-180"}`}
              />
            </button>
          </div>

          <div className="pb-4" />
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        userName={fullName || u?.email || ""}
      />
    </>
  );
};

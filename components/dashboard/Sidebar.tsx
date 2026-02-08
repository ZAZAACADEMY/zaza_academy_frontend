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
  X,
} from "lucide-react";
import { LogoutModal } from "./LogoutModal";
import Image from "next/image";
import { useLogoutMutation } from "@/lib/store/services/authApi";

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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call Logout API via Redux
      await logout().unwrap();
    } catch (e) {
      console.error("Logout failed", e);
    }

    // Redirect to login
    router.push("/login");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-[#2D1B4E] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/">
            {/* Using Next Image for the SVG logo */}
            <Image
              src="/images/logo.png"
              alt="Zaza Logo"
              width={100}
              height={100}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
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

        {/* Language Switcher & Logout */}
        <div className="mt-auto">
          <SidebarLanguageSwitcher />

          <div className="p-4 pt-0 mb-4">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-white/5"
            >
              <LogOut size={20} />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

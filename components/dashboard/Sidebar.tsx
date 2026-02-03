"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PlayCircle,
  Video,
  Award,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoutModal } from "./LogoutModal";
import Image from "next/image";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Children", href: "/dashboard/children" },
//   { icon: BookOpen, label: "Programs", href: "/dashboard/programs" },
  { icon: PlayCircle, label: "Video Library", href: "/dashboard/videos" },
  { icon: Video, label: "Live Sessions", href: "/dashboard/live" },
//   { icon: Award, label: "Achievements", href: "/dashboard/achievements" },
  { icon: CreditCard, label: "Billing / Plan", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    router.push(`/${locale}/login`);
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside className="w-64 bg-[#2D1B4E] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-40">
        {/* Logo */}
        <div className="p-8">
          <Link href={`/${locale}`}>
            {/* Using Next Image for the SVG logo */}
            <Image
              src="/images/logo.png"
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
            const localizedHref = `/${locale}${item.href}`;
            // Use exact match for the main dashboard link to avoid active state on sub-routes
            const isActive =
              item.href === "/dashboard"
                ? pathname === localizedHref
                : pathname.startsWith(localizedHref) &&
                  (item.href === "/dashboard"
                    ? pathname === localizedHref
                    : true);

            // Simplified active check:
            // if href is /dashboard, exact match
            // else if pathname starts with href
            const isActiveSimple =
              item.href === "/dashboard"
                ? pathname === localizedHref
                : pathname.startsWith(localizedHref);

            return (
              <Link
                key={item.href}
                href={localizedHref}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActiveSimple
                    ? "bg-white text-[#2D1B4E] font-bold"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto mb-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
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

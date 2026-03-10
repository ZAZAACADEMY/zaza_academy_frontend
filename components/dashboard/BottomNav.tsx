"use client";

import React from "react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  PlayCircle,
  Video,
  CreditCard,
  Settings,
} from "lucide-react";

const navItems = [
  {
    icon: LayoutDashboard,
    labelKey: "navShortDashboard",
    href: "/dashboard",
    exact: true,
  },
  {
    icon: PlayCircle,
    labelKey: "navShortVideoLibrary",
    href: "/dashboard/videos",
    exact: false,
  },
  {
    icon: Video,
    labelKey: "navShortLiveSessions",
    href: "/dashboard/live",
    exact: false,
  },
  {
    icon: CreditCard,
    labelKey: "navShortBilling",
    href: "/dashboard/billing",
    exact: false,
  },
  {
    icon: Settings,
    labelKey: "navShortSettings",
    href: "/dashboard/settings",
    exact: false,
  },
];

export const BottomNav = () => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 ${
                isActive ? "text-[#7F26D9]" : "text-gray-400"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-[#7F26D9]/10" : ""
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-semibold leading-none ${
                  isActive ? "text-[#7F26D9]" : "text-gray-400"
                }`}
              >
                {t(item.labelKey as any)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

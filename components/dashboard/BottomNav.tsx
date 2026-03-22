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
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Glass background bar */}
      <div className="mx-3 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100/80 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex items-stretch h-15">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 relative"
              >
                {/* Active top indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#7F26D9] rounded-full" />
                )}
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                    isActive ? "bg-[#7F26D9]/10 scale-110" : ""
                  }`}
                >
                  <Icon
                    size={isActive ? 22 : 20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? "text-[#7F26D9]" : "text-gray-400"}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold leading-none tracking-tight ${
                    isActive ? "text-[#7F26D9]" : "text-gray-400"
                  }`}
                >
                  {t(item.labelKey as any)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Children", href: "/dashboard/children" },
  { icon: BookOpen, label: "Programs", href: "/dashboard/programs" },
  { icon: PlayCircle, label: "Video Library", href: "/dashboard/videos" },
  { icon: Video, label: "Live Sessions", href: "/dashboard/live" },
  { icon: Award, label: "Achievements", href: "/dashboard/achievements" },
  { icon: CreditCard, label: "Billing / Plan", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="w-64 bg-[#2D1B4E] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-8">
        <Link href={`/${locale}`}>
          {/* Assuming logo exists, using text as fallback or the one from navbar if available */}
          <h1 className="text-3xl font-display font-bold">
            zaza<span className="text-pink-400">.</span>
          </h1>
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
              : pathname.startsWith(localizedHref);
          return (
            <Link
              key={item.href}
              href={localizedHref}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive
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
        <button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

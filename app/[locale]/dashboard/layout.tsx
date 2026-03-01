"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FavoritesProvider } from "@/components/dashboard/videos/FavoritesContext";
import { Menu } from "lucide-react";
import { tokenStore } from "@/lib/api/tokenStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const token = tokenStore.getToken();
    if (!token) {
      router.replace(`/${locale}/login`);
    }
  }, [router, locale]);

  // Optionally, show a loading spinner while checking auth
  if (!tokenStore.getToken()) {
    return (
      <div className="flex items-center justify-center h-screen">
        Redirecting...
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-[#F8F9FC]">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-30">
          <span className="font-display font-bold text-brand-purple text-xl">
            Zaza Academy
          </span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-brand-purple hover:bg-brand-purple/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="lg:ml-64 min-h-screen transition-all duration-300">
          {children}
        </main>
      </div>
    </FavoritesProvider>
  );
}

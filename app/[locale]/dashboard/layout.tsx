"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FavoritesProvider } from "@/components/dashboard/videos/FavoritesContext";
import { Menu, Loader2 } from "lucide-react";
import { tokenStore } from "@/lib/api/tokenStore";
import { useGetMyActiveSubscriptionsQuery } from "@/lib/store/services/subscriptionsApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const token = tokenStore.getToken();

  const {
    data: activeSubscriptions,
    isLoading: isLoadingSubscription,
    isError,
  } = useGetMyActiveSubscriptionsQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      router.replace(`/${locale}/login`);
      return;
    }

    // if (!isLoadingSubscription && !activeSubscriptions?.length) {
    //   // Redirect to plan selection if no active subscription
    //   router.replace(`/${locale}/signup?step=2`);
    // }
  }, [token, activeSubscriptions, isLoadingSubscription, router, locale]);

  // Show loading spinner while checking auth or subscription
  if (!token || isLoadingSubscription) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <FavoritesProvider>
...
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

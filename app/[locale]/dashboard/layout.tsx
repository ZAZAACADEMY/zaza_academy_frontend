"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { FavoritesProvider } from "@/components/dashboard/videos/FavoritesContext";
import { tokenStore } from "@/lib/api/tokenStore";
import { useGetMyActiveSubscriptionsQuery } from "@/lib/store/services/subscriptionsApi";

const Sidebar = dynamic(
  () => import("@/components/dashboard/Sidebar").then((m) => m.Sidebar),
  { ssr: false },
);
const BottomNav = dynamic(
  () => import("@/components/dashboard/BottomNav").then((m) => m.BottomNav),
  { ssr: false },
);
const MobileHeader = dynamic(
  () =>
    import("@/components/dashboard/MobileHeader").then((m) => m.MobileHeader),
  { ssr: false },
);
const EmailVerificationBanner = dynamic(
  () =>
    import("@/components/dashboard/EmailVerificationBanner").then(
      (m) => m.EmailVerificationBanner,
    ),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <MobileHeader />
        {/* Spacer for fixed mobile header */}
        <div className="lg:hidden h-14" />

        <Sidebar />

        <main className="lg:ml-64 min-h-screen transition-all duration-300 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <EmailVerificationBanner />
          {children}
        </main>
      </div>
      <BottomNav />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontFamily: "inherit", borderRadius: "16px" },
        }}
        richColors
      />
    </FavoritesProvider>
  );
}

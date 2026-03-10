"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Loader2,
  AlertTriangle,
  Users,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { ChildOverviewCard } from "@/components/dashboard/children/ChildOverviewCard";
import { RecentMilestones } from "@/components/dashboard/children/RecentMilestones";
import { useListChildrenQuery } from "@/lib/store/services/childrenApi";
import { useGetMyActiveSubscriptionsQuery } from "@/lib/store/services/subscriptionsApi";
import { AddChildModal } from "@/components/dashboard/children/AddChildModal";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

function getMaxChildren(planName?: string): number {
  if (!planName) return 1;
  const lower = planName.toLowerCase();
  if (lower.includes("famille") || lower.includes("family")) return 3;
  return 1;
}

export default function ChildrenPage() {
  const t = useTranslations("DashboardChildren");
  const { data: children, isLoading, isError } = useListChildrenQuery();
  const { data: activeSubs } = useGetMyActiveSubscriptionsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);

  const sub = (activeSubs as any)?.[0];
  const payments: any[] = sub?.payments ?? [];
  const planName: string = payments[0]?.plan_name ?? "";
  const maxChildren = getMaxChildren(planName);
  const childCount = children?.length ?? 0;
  const isAtLimit = childCount >= maxChildren;

  const handleAddChildClick = () => {
    if (isAtLimit) {
      setIsUpsellOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>
        <button
          onClick={handleAddChildClick}
          className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity self-start md:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          {t("addChild")}
        </button>
      </div>

      {/* Children Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-10 rounded-[32px] text-center text-red-600 border border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t("errorTitle")}</h2>
          <p>{t("errorBody")}</p>
        </div>
      ) : children?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-[32px] text-center border-2 border-dashed border-gray-200">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("emptyTitle")}
          </h2>
          <p className="text-gray-500 mb-8">{t("emptySubtitle")}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
          >
            {t("addFirstChild")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children?.map((child) => (
            <ChildOverviewCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {/* Recent Milestones */}
      <RecentMilestones />

      {/* Add child modal */}
      <AddChildModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Upsell modal */}
      {isUpsellOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 text-center">
            <button
              onClick={() => setIsUpsellOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-brand-purple" />
            </div>

            <h2 className="text-2xl font-display font-bold text-brand-dark mb-3">
              {t("upsell.title")}
            </h2>
            <p className="text-gray-500 mb-2">{t("upsell.body")}</p>
            <p className="text-sm font-semibold text-brand-purple mb-6">
              {t("upsell.planHint")}
            </p>

            {/* Feature highlights */}
            <ul className="text-left space-y-2 mb-8">
              {["feature1", "feature2", "feature3"].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {t(`upsell.${key}`)}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/billing"
              onClick={() => setIsUpsellOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-purple to-purple-600 text-white font-bold py-3.5 px-8 rounded-full hover:opacity-90 transition-opacity"
            >
              {t("upsell.cta")}
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => setIsUpsellOpen(false)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-500 transition-colors"
            >
              {t("upsell.dismiss")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

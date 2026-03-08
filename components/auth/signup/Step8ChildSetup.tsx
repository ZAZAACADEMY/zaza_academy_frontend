"use client";
import React, { useState } from "react";
import { useRouter } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Avatar1 from "../../../public/avatars/A1.jpeg";
import Avatar2 from "../../../public/avatars/A2.jpeg";
import Avatar3 from "../../../public/avatars/A3.jpeg";
import Avatar4 from "../../../public/avatars/A4.jpeg";
import Avatar5 from "../../../public/avatars/A5.jpeg";
import Avatar6 from "../../../public/avatars/A6.jpeg";
import Avatar7 from "../../../public/avatars/A7.jpeg";
import Avatar8 from "../../../public/avatars/A8.jpeg";
import Avatar9 from "../../../public/avatars/A9.jpeg";
import Avatar10 from "../../../public/avatars/A10.jpeg";

import {
  User,
  Calendar,
  Circle,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useSignup } from "./SignupContext";
import { useAddChildMutation, useListChildrenQuery } from "@/lib/store/services/childrenApi";
import { useGetPlanByIdQuery } from "@/lib/store/services/plansApi";
import { getAvatarPath } from "@/lib/api/avatarUtils";

const avatars = [
  { src: Avatar1, url: "/avatars/A1.jpeg" },
  { src: Avatar2, url: "/avatars/A2.jpeg" },
  { src: Avatar3, url: "/avatars/A3.jpeg" },
  { src: Avatar4, url: "/avatars/A4.jpeg" },
  { src: Avatar5, url: "/avatars/A5.jpeg" },
  { src: Avatar6, url: "/avatars/A6.jpeg" },
  { src: Avatar7, url: "/avatars/A7.jpeg" },
  { src: Avatar8, url: "/avatars/A8.jpeg" },
  { src: Avatar9, url: "/avatars/A9.jpeg" },
  { src: Avatar10, url: "/avatars/A10.jpeg" },
];

const getAgeGroup = (age: number): "5-8" | "9-12" | "13-16" => {
  if (age <= 8) return "5-8";
  if (age <= 12) return "9-12";
  return "13-16";
};

export const Step8ChildSetup = () => {
  const {
    currentChild,
    setCurrentChild,
    setStep,
    selectedPlan,
  } = useSignup();
  const t = useTranslations("Signup.step8");
  const [ageError, setAgeError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const { data: plan } = useGetPlanByIdQuery(selectedPlan, { skip: !selectedPlan });
  const { data: childrenFromApi } = useListChildrenQuery();
  const [addChild, { isLoading: isAdding }] = useAddChildMutation();

  const planChildLimit: Record<string, number> = {
    STANDARD: 1,
    PREMIUM: 3,
    FAMILLE: 5,
  };
  
  const planName = plan?.name || "STANDARD";
  const childLimit = planChildLimit[planName] ?? 1;
  const childrenCount = childrenFromApi?.length || 0;
  const remainingSlots = Math.max(childLimit - childrenCount, 0);
  const limitReached = remainingSlots === 0;

  const handleAddChild = async () => {
    setGeneralError("");
    const ageNum = Number(currentChild.age);
    if (!ageNum || ageNum < 5 || ageNum > 16) {
      setAgeError(t("ageError"));
      return;
    }
    if (limitReached) return;

    try {
      const avatarPath = avatars[currentChild.avatar].url;
      const absoluteAvatarUrl = `${window.location.origin}${avatarPath}`;
      
      await addChild({
        pseudo: currentChild.name,
        age: ageNum,
        age_group: getAgeGroup(ageNum),
        avatar: absoluteAvatarUrl,
      } as any).unwrap();

      setCurrentChild({ name: "", age: "", gender: "", avatar: 0, program: "" });
      setStep(9); // Go to summary
      setAgeError("");
    } catch (err: any) {
      setGeneralError(err.data?.detail || "Failed to add child profile.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {generalError && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">{generalError}</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Avatar Selection */}
        <div className="bg-gradient-to-r from-[#F5ECFF] via-white to-[#E7F2FF] border border-gray-100 rounded-[20px] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">
                Look & feel
              </p>
              <p className="font-bold text-brand-black text-[16px]">
                {t("chooseAvatar")}
              </p>
              <p className="text-sm text-gray-500">
                Personalize their profile in one tap.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600 bg-white/80 border border-gray-100 rounded-full px-3 py-2 shadow-inner">
              <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-sm">
                <Image
                  src={avatars[currentChild.avatar].src}
                  alt="selected avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold text-brand-black">Selected</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {avatars.map((avatar, idx) => {
              const isActive = currentChild.avatar === idx;
              return (
                <button
                  key={`avatar-${idx}`}
                  type="button"
                  onClick={() =>
                    setCurrentChild({ ...currentChild, avatar: idx })
                  }
                  className={`group relative aspect-square rounded-[16px] border overflow-hidden transition-all bg-white
                    ${isActive ? "border-[#A655F7] shadow-[0_16px_48px_-20px_rgba(166,85,247,0.65)]" : "border-gray-200 hover:border-[#A655F7]/60"}
                  `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-white/0 via-[#A655F7]/6 to-[#6EE7B7]/10 transition-opacity
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"}
                    `}
                    aria-hidden
                  />
                  <Image
                    src={avatar.src}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                  {isActive && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#A655F7] text-white flex items-center justify-center shadow-md">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-brand-black text-[14px] flex items-center gap-2">
              {t("childName")}
              <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
                {remainingSlots} left
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentChild.name}
                onChange={(e) =>
                  setCurrentChild({ ...currentChild, name: e.target.value })
                }
                placeholder={t("namePlaceholder")}
                className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all pl-12"
              />
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-brand-black text-[14px]">
              {t("ageLabel")}
            </label>
            <div className="relative">
              <input
                type="number"
                value={currentChild.age}
                onChange={(e) => {
                  setCurrentChild({ ...currentChild, age: e.target.value });
                  setAgeError("");
                }}
                placeholder={t("agePlaceholder")}
                min={5}
                max={16}
                aria-invalid={!!ageError}
                aria-describedby={ageError ? "age-error" : undefined}
                className="w-full px-6 py-4 rounded-[50px] border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all pl-12"
              />
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {ageError && (
              <p
                id="age-error"
                className="text-red-500 text-xs ml-4"
                role="alert"
              >
                {ageError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-brand-black text-[14px]">
            {t("genderLabel")}
          </label>
          <div className="flex gap-4">
            {["Boy", "Girl"].map((g) => (
              <div
                key={g}
                onClick={() => setCurrentChild({ ...currentChild, gender: g })}
                className={`flex-1 py-3 px-4 rounded-[16px] border cursor-pointer text-center font-medium transition-all
                  ${currentChild.gender === g ? "bg-[#F3F0FF] border-[#A655F7] text-[#A655F7]" : "border-gray-200 text-gray-500 hover:border-gray-300"}
                `}
              >
                {g === "Boy" ? t("genderBoy") : t("genderGirl")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(7)}
          className="w-14 h-14 shrink-0 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button
          onClick={handleAddChild}
          disabled={!currentChild.name || !currentChild.age || limitReached || isAdding}
          className="flex-1 bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? <Loader2 className="animate-spin" size={20} /> : (limitReached ? "Plan limit reached" : t("saveProfile"))}
        </button>
      </div>
      {limitReached && (
        <p className="text-sm text-gray-500 text-center">
          You have used all child profiles for this plan.
        </p>
      )}
    </div>
  );
};

export const Step9ChildSummary = () => {
  const { setStep, setCurrentChild, selectedPlan, clearSignupData } = useSignup();
  const router = useRouter();
  const t = useTranslations("Signup.step9");

  const { data: plan } = useGetPlanByIdQuery(selectedPlan, { skip: !selectedPlan });
  const { data: childrenList, isLoading } = useListChildrenQuery();

  const planChildLimit: Record<string, number> = {
    STANDARD: 1,
    PREMIUM: 3,
    FAMILLE: 5,
  };
  
  const planName = plan?.name || "STANDARD";
  const childLimit = planChildLimit[planName] ?? 1;
  const canAddMore = (childrenList?.length || 0) < childLimit;

  const startNewChild = () => {
    setCurrentChild({ name: "", age: "", gender: "", avatar: 0, program: "" });
    setStep(8);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#A655F7]" />
        <p className="text-gray-500">Updating your family...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-brand-black">{t("title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList?.map((child, idx) => (
          <div
            key={child.id || idx}
            className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-50">
              <Image
                src={getAvatarPath(child.avatar)}
                alt={child.pseudo || child.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-brand-black">{child.pseudo || child.name}</h4>
              <p className="text-sm text-gray-500">
                {t("ageDisplay", { age: child.age })}
              </p>
            </div>
          </div>
        ))}

        {canAddMore ? (
          <button
            onClick={startNewChild}
            className="h-[80px] rounded-[20px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 hover:border-[#A655F7] hover:text-[#A655F7] transition-all"
          >
            <Plus size={24} />
            <span className="font-bold">{t("addChild")}</span>
          </button>
        ) : (
          <div className="h-[80px] rounded-[20px] border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 text-sm font-semibold p-4 text-center">
            Plan limit reached ({childLimit})
          </div>
        )}
      </div>

      <button
        onClick={() => {
          clearSignupData();
          router.push("/dashboard");
        }}
        className="mt-4 w-full bg-[#16A34A] text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#15803D] transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {t("complete")}
        <ArrowLeft className="rotate-180" size={20} />
      </button>
    </div>
  );
};

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
} from "lucide-react";
import { useSignup } from "./SignupContext";

const avatars = [
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
    Avatar8,
    Avatar9,
    Avatar10,
];

export const Step8ChildSetup = () => {
  const {
    currentChild,
    setCurrentChild,
    setChildrenList,
    childrenList,
    setStep,
    selectedPlan,
  } = useSignup();
  const t = useTranslations("Signup.step8");
  const [ageError, setAgeError] = useState("");
  const planChildLimit: Record<string, number> = {
    Solo: 1,
    Family: 3,
    "Family Plus": 5,
  };
  const childLimit = planChildLimit[selectedPlan] ?? 1;
  const remainingSlots = Math.max(childLimit - childrenList.length, 0);
  const limitReached = remainingSlots === 0;

  const handleAddChild = () => {
    const ageNum = Number(currentChild.age);
    if (!ageNum || ageNum < 5 || ageNum > 16) {
      setAgeError(t("ageError"));
      return;
    }
    if (limitReached) return;
    setChildrenList([...childrenList, currentChild]);
    setCurrentChild({ name: "", age: "", gender: "", avatar: 0, program: "" });
    setStep(9); // Go to summary
    setAgeError("");
  };

  return (
    <div className="flex flex-col gap-8">
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
                  src={avatars[currentChild.avatar]}
                  alt="selected avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold text-brand-black">Selected</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {avatars.map((_, idx) => {
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
                  <Image src={src} alt="avatar" fill className="object-cover" />
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

      <button
        onClick={handleAddChild}
        disabled={!currentChild.name || !currentChild.age || limitReached}
        className="w-full bg-brand-dark text-white font-bold text-[16px] py-4 rounded-[50px] hover:bg-[#1F1235] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {limitReached ? "Plan limit reached" : t("saveProfile")}
      </button>
      {limitReached && (
        <p className="text-sm text-gray-500 text-center">
          You have used all child profiles for this plan.
        </p>
      )}
    </div>
  );
};

export const Step9ChildSummary = () => {
  const { childrenList, setStep, setCurrentChild, selectedPlan } = useSignup();
  const router = useRouter();
  const t = useTranslations("Signup.step9");

  const planChildLimit: Record<string, number> = {
    Solo: 1,
    Family: 3,
    "Family Plus": 5,
  };
  const childLimit = planChildLimit[selectedPlan] ?? 1;
  const canAddMore = childrenList.length < childLimit;

  const startNewChild = () => {
    setCurrentChild({ name: "", age: "", gender: "", avatar: 0, program: "" });
    setStep(8);
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-brand-black">{t("title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList.map((child, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
              <Image
                src={avatars[child.avatar]}
                alt={child.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-brand-black">{child.name}</h4>
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
          <div className="h-[80px] rounded-[20px] border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 text-sm font-semibold">
            Plan limit reached
          </div>
        )}
      </div>

      <button
        onClick={() => {
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

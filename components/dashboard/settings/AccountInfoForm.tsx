"use client";

import React from "react";
import { User } from "lucide-react";

export const AccountInfoForm = () => {
  return (
    <div className="bg-[#F8F7FF] rounded-[24px] p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-5 h-5 text-brand-purple" />
        <h2 className="text-lg font-bold text-brand-dark">
          Account Information
        </h2>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              First Name
            </label>
            <input
              type="text"
              defaultValue="Zaza"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Academy"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="zazaacademy@gmail.com"
              className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-dark">Country</label>
            <div className="relative">
              <select
                className="w-full px-6 py-3 rounded-full border border-purple-200 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-white text-gray-700 appearance-none cursor-pointer"
                defaultValue="Country"
              >
                <option disabled>Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="FR">France</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-brand-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-[#2D1B4E] text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

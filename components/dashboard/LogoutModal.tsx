"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onLogout,
  userName,
}: LogoutModalProps) => {
  const t = useTranslations("LogoutModal");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl pointer-events-auto relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                {/* Gradient icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A655F7]/10 to-[#F46AA3]/10 flex items-center justify-center mb-5 ring-8 ring-purple-50">
                  <LogOut className="w-9 h-9 text-[#7F26D9] ml-1" />
                </div>

                <h2 className="text-xl font-display font-bold text-[#1F1235] mb-2">
                  {userName
                    ? t("titleWithName", { name: userName })
                    : t("title")}
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  {t("message")}
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-full border-2 border-gray-200 text-[#1F1235] font-bold hover:bg-gray-50 transition-colors text-sm"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#7F26D9] to-[#C23CDD] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30 text-sm"
                  >
                    {t("confirm")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

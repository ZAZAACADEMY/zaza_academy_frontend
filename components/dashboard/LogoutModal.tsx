"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onLogout,
}: LogoutModalProps) => {
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
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <LogOut className="w-10 h-10 text-red-500 ml-1" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Logout Confirmation
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Are you sure you want to logout? You'll need to sign in again
                  to access your dashboard.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-full border border-brand-dark text-brand-dark font-bold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full py-3 px-4 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm"
                  >
                    Log Out
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

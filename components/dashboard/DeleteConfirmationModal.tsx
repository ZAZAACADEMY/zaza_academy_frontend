"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Profile?",
  message = "Are you sure you want to remove this child profile? This action cannot be undone and all progress will be lost.",
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
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
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                  <Trash2 className="w-10 h-10 text-red-500" />
                </div>

                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  {title}
                </h3>

                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  {message}
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 hover:text-gray-800 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
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

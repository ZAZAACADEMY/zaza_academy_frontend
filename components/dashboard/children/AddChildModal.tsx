"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, User, Calendar, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateChildData, UpdateChildData } from "@/lib/api/children";
import { ChildProfile } from "@/lib/api/types";

// Avatars imports (using placeholders effectively or imports if available)
// I will reuse the imports from the signup component if possible, but for now I'll use static paths or placeholders
// to correspond with what was in Step8ChildSetup.tsx.
// Assuming public/avatars folder exists.

const AVATARS = [
  "/avatars/A1.jpeg",
  "/avatars/A2.jpeg",
  "/avatars/A3.jpeg",
  "/avatars/A4.jpeg",
  "/avatars/A5.jpeg",
  "/avatars/A6.jpeg",
  "/avatars/A7.jpeg",
  "/avatars/A8.jpeg",
  "/avatars/A9.jpeg",
  "/avatars/A10.jpeg",
];

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateChildData | UpdateChildData) => Promise<void>;
  initialData?: ChildProfile | null;
}

export const AddChildModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddChildModalProps) => {
  const [formData, setFormData] = useState<CreateChildData>({
    name: "",
    age: 0,
    avatar: "0",
  });
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        age: initialData.age,
        avatar: initialData.avatar,
      });
      setSelectedAvatarIndex(parseInt(initialData.avatar || "0"));
    } else {
      setFormData({ name: "", age: 0, avatar: "0" });
      setSelectedAvatarIndex(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (formData.age < 5 || formData.age > 18) {
      setError("Age must be between 5 and 18");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSave({
        ...formData,
        avatar: selectedAvatarIndex.toString(),
      });
      onClose();
      // Only reset if we are creating, not typically needed as useEffect handles it on open/close but good practice
      if (!isEditMode) {
        setFormData({ name: "", age: 0, avatar: "0" });
        setSelectedAvatarIndex(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? "Edit Profile" : "Add Child"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {isEditMode
                      ? "Update child information"
                      : "Create a profile for your child"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto">
                <form
                  id="add-child-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  {/* Avatar Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Choose an avatar
                    </label>
                    <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                      {AVATARS.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedAvatarIndex(index)}
                          className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
                            selectedAvatarIndex === index
                              ? "scale-110"
                              : "hover:scale-105 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"
                          }`}
                        >
                          <div
                            className={`relative w-full h-full rounded-full overflow-hidden border-4 ${
                              selectedAvatarIndex === index
                                ? "border-brand-purple shadow-lg shadow-brand-purple/30"
                                : "border-gray-100"
                            }`}
                          >
                            <Image
                              src={avatar}
                              alt={`Avatar ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {selectedAvatarIndex === index && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center text-white border-4 border-white shadow-md z-10">
                              <Check size={16} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-bold text-gray-700"
                      >
                        First Name
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple transition-colors">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                          placeholder="e.g. Emma"
                          required
                        />
                      </div>
                    </div>

                    {/* Age Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="age"
                        className="block text-sm font-bold text-gray-700"
                      >
                        Age
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple transition-colors">
                          <Calendar size={20} />
                        </div>
                        <input
                          type="number"
                          id="age"
                          min="5"
                          max="16"
                          value={formData.age || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              age: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                          placeholder="Age (5-16)"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  form="add-child-form"
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-[#432C7A] text-white font-bold hover:shadow-lg hover:shadow-brand-purple/30 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : isEditMode ? (
                    "Update Profile"
                  ) : (
                    "Create Profile"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

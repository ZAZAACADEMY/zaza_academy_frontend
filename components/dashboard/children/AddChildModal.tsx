"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, User, Calendar, Check, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { components } from "@/lib/api/v1";
import { useAddChildMutation, useUpdateChildMutation } from "@/lib/store/services/childrenApi";

type ChildCreateData = components["schemas"]["ChildCreateSerializer"];
type ChildUpdateData = components["schemas"]["PatchedChildCreateUpdate"]; // Partial update
type ChildDetail = components["schemas"]["ChildDetail"];

// Avatars imports (using placeholders effectively or imports if available)
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
  initialData?: ChildDetail | null;
}

export const AddChildModal = ({
  isOpen,
  onClose,
  initialData,
}: AddChildModalProps) => {
  const [formData, setFormData] = useState<Partial<ChildCreateData>>({
    first_name: "", // Renamed from 'name' to 'first_name' to match API
    age: 0,
    avatar: 0, // Avatar is an integer in the API
    age_group: "5-8", // Default for now
  });
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [error, setError] = useState("");

  const isEditMode = !!initialData;

  const [addChild, { isLoading: isAdding }] = useAddChildMutation();
  const [updateChild, { isLoading: isUpdating }] = useUpdateChildMutation();

  const isLoading = isAdding || isUpdating;

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name,
        age: initialData.age,
        avatar: parseInt(initialData.avatar?.toString() || "0"), // API returns it as string, convert back to number
        age_group: initialData.age_group,
      });
      setSelectedAvatarIndex(parseInt(initialData.avatar?.toString() || "0"));
    } else {
      setFormData({ first_name: "", age: 0, avatar: 0, age_group: "5-8" });
      setSelectedAvatarIndex(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.first_name || !formData.first_name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.age || formData.age < 5 || formData.age > 18) {
      setError("Age must be between 5 and 18");
      return;
    }

    try {
      const dataToSave: ChildCreateData = {
        ...formData,
        avatar: selectedAvatarIndex, // Ensure integer is sent
        // age_group needs to be derived from age, or user selects it
        // For now, mapping directly from child.age in ChildrenList is sufficient.
        // Assuming age_group can be simplified for now or a proper dropdown is needed.
        // For current form, it's not a direct input, so we might need a better mapping or input for it.
        // Let's derive it from age as previously.
        age_group: formData.age && formData.age <= 8 ? "5-8" : (formData.age && formData.age <= 12 ? "9-12" : "13-16")
      } as ChildCreateData;


      if (isEditMode && initialData?.id) {
        await updateChild({ id: initialData.id, body: dataToSave as ChildUpdateData }).unwrap();
      } else {
        await addChild(dataToSave).unwrap();
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.data?.message || err.data?.detail || "Failed to save profile. Please try again.");
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
                    {isEditMode ? "Edit Child Profile" : "Add New Child"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {isEditMode
                      ? "Update child information"
                      : "Create a profile for your child"}
                  </p>
                </div>
                <button
                  type="button"
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
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                      <AlertTriangle size={18} />
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
                        htmlFor="first_name" // Changed from 'name'
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
                          id="first_name" // Changed from 'name'
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({ ...formData, first_name: e.target.value })
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

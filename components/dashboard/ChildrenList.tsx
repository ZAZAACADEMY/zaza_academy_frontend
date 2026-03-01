"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Users,
  Loader2,
  Trash2,
  Edit2,
  Sparkles,
  Video,
  AlertTriangle,
} from "lucide-react";
import {
  useListChildrenQuery,
  useDeleteChildMutation,
  Child,
} from "@/lib/store/services/childrenApi";
import { AddChildModal } from "./children/AddChildModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Helper to get avatar path - mapping index to local path or external URL
const getAvatarPath = (avatarStr?: string | null) => {
  if (!avatarStr) return "/avatars/A1.jpeg";
  
  // If it's a number/index string or API provides a direct URL
  const index = parseInt(avatarStr);
  if (!isNaN(index) && index >= 0 && index < 10) { // Assuming 0-9 for A1-A10
    return `/avatars/A${index + 1}.jpeg`;
  }
  // Fallback if avatarStr is a URL
  return avatarStr;
};

export const ChildrenList = () => {
  const t = useTranslations("ChildrenList");
  const {
    data: childrenData,
    isLoading,
    isError,
    error: fetchError,
  } = useListChildrenQuery();
  const [deleteChild] = useDeleteChildMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (child: Child) => {
    setEditingChild(child);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingChild(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChildToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!childToDelete) return;

    try {
      setIsDeleting(true);
      await deleteChild(childToDelete).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setChildToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/50 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching children:", fetchError);
    return (
      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/50 flex flex-col justify-center items-center h-64 text-red-700">
        <AlertTriangle className="w-10 h-10 mb-4" />
        <h3 className="text-lg font-bold mb-2">{t("errorLoadingChildren")}</h3>
        <p className="text-sm">{t("errorTryAgain")}</p>
      </div>
    );
  }

  const children = childrenData || [];

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#1F1235] flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </span>
              {t("myChildren")}
            </h3>
          </div>
          <button
            onClick={handleAddClick}
            className="group flex items-center gap-2 bg-[#2D1B4E] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#432C7A] transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            {t("addChild")}
          </button>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
              <Users size={32} />
            </div>
            <p className="text-gray-500 font-medium mb-4">{t("emptyState")}</p>
            <button
              onClick={handleAddClick}
              className="text-brand-purple font-bold hover:underline"
            >
              {t("addFirst")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                key={child.id}
                onClick={() => handleEditClick(child)}
                className="group relative flex flex-col p-6 bg-white border border-gray-100 rounded-[32px] hover:border-brand-purple/20 hover:shadow-2xl hover:shadow-brand-purple/10 transition-all cursor-pointer overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-purple/5 to-pink-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500 ease-out" />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-purple border border-brand-purple/10 shadow-sm flex items-center gap-1">
                  <Sparkles size={12} className="text-yellow-400" />
                  {child.age_group}
                </div>

                {/* Avatar & Header */}
                <div className="relative z-10 flex items-start gap-4 mb-6">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-brand-purple/15 border-4 border-white group-hover:rotate-3 transition-transform duration-300 bg-gray-50">
                    <Image
                      src={getAvatarPath(child.avatar)}
                      alt={child.name || "Child avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display font-bold text-2xl text-brand-dark mb-1 group-hover:text-brand-purple transition-colors">
                      {child.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      {t("age", { age: child.age })}
                    </div>
                  </div>
                </div>

                {/* Stats Grid (Videos) */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:bg-brand-light/30 transition-colors flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                        <Video size={14} className="text-brand-purple" />
                        {t("videosWatched")}
                      </div>
                      <div className="text-xl font-bold text-brand-dark mt-1">
                        <span className="text-brand-purple">
                          0
                        </span>
                        <span className="text-gray-400 text-lg mx-1">/</span>
                        <span className="text-gray-600">
                          0
                        </span>
                      </div>
                    </div>

                    {/* Circle Progress */}
                    <div className="relative w-12 h-12">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-gray-200"
                          d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="text-brand-purple transition-all duration-1000 ease-out"
                          strokeDasharray="0, 100"
                          d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                        0%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer/Actions */}
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                  <button className="flex items-center gap-2 text-sm font-bold text-brand-purple/70 group-hover:text-brand-purple transition-colors">
                    <Edit2 size={16} />
                    Edit Profile
                  </button>

                  <button
                    title="Delete Profile"
                    onClick={(e) => handleDeleteClick(e, child.id!)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Add Child Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddClick}
              className="flex flex-col items-center justify-center p-6 min-h-[280px] border-2 border-dashed border-gray-200 rounded-[32px] hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-3xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:border-brand-purple group-hover:text-brand-purple transition-all shadow-sm group-hover:shadow-brand-purple/20">
                <Plus
                  size={32}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-gray-500 group-hover:text-brand-purple transition-colors">
                Add New Profile
              </span>
            </motion.button>

            <DeleteConfirmationModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={confirmDelete}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>

      <AddChildModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChild(null);
        }}
        initialData={editingChild}
      />
    </>
  );
};

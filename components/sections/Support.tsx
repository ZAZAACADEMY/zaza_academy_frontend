"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  ChevronDown,
  HeartHandshake,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type InfoCard = { icon: string; title: string; value: string; desc: string };
type FaqItem = { question: string; answer: string };

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail size={22} />,
  clock: <Clock size={22} />,
  message: <MessageCircle size={22} />,
};

export const Support = () => {
  const t = useTranslations("SupportPage");
  const tContact = useTranslations("Contact");

  const [formState, setFormState] = React.useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [subjectOpen, setSubjectOpen] = React.useState(false);
  const subjectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        subjectRef.current &&
        !subjectRef.current.contains(e.target as Node)
      ) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const infoCards = t.raw("infoCards") as InfoCard[];
  const faqItems = t.raw("faqSection.items") as FaqItem[];
  const subjectOptions = t.raw("formSection.subjectOptions") as string[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9F5FF] flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E1240] via-[#311F54] to-[#5A2D90] pt-32 pb-28 px-4 md:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[480px] h-[480px] bg-[#A655F7]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] bg-[#F46AA3]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-white"
          >
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
              <HeartHandshake size={16} />
              Support
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <Image
              src="/images/GetStarted2.png"
              alt="Support"
              width={440}
              height={380}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
          >
            <path
              d="M0 70L1440 70L1440 28C1200 70 960 0 720 28C480 56 240 0 0 28L0 70Z"
              fill="#F9F5FF"
            />
          </svg>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="px-4 md:px-8 -mt-4 pb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 border border-purple-50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#F3EAFF] to-[#E8D5FF] text-[#A655F7] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                {iconMap[card.icon] ?? <Mail size={22} />}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
                  {card.title}
                </p>
                <p className="text-[#311F54] font-bold text-sm leading-snug">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="py-16 px-4 md:px-8 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl border border-purple-50 p-8 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#311F54] mb-1">
              {t("formSection.title")}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {t("formSection.subtitle")}
            </p>

            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-[#311F54] mb-2">
                    {tContact("successTitle")}
                  </h3>
                  <p className="text-gray-500">{tContact("successMessage")}</p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-6 text-sm text-[#A655F7] font-semibold hover:underline"
                  >
                    ← Retour
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {tContact("nameLabel")}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all text-sm"
                        placeholder={tContact("namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {tContact("emailLabel")}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all text-sm"
                        placeholder={tContact("emailPlaceholder")}
                      />
                    </div>
                  </div>

                  {/* Subject — custom dropdown */}
                  <div className="space-y-1.5" ref={subjectRef}>
                    <label className="text-sm font-medium text-gray-700">
                      {t("formSection.subjectLabel")}
                    </label>
                    {/* Hidden native input for form validation */}
                    <input
                      type="hidden"
                      name="subject"
                      value={selectedSubject}
                      required
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSubjectOpen((v) => !v)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between gap-2 transition-all outline-none ${
                          subjectOpen
                            ? "border-[#A655F7] ring-2 ring-[#A655F7]/20"
                            : "border-gray-200 hover:border-[#A655F7]/50"
                        } bg-white`}
                      >
                        <span
                          className={
                            selectedSubject ? "text-gray-800" : "text-gray-400"
                          }
                        >
                          {selectedSubject ||
                            t("formSection.subjectPlaceholder")}
                        </span>
                        <motion.span
                          animate={{ rotate: subjectOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[#A655F7] flex-shrink-0"
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {subjectOpen && (
                          <motion.ul
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-purple-100 rounded-2xl shadow-xl overflow-hidden"
                          >
                            {subjectOptions.map((opt, i) => (
                              <li key={i}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSubject(opt);
                                    setSubjectOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                                    selectedSubject === opt
                                      ? "bg-[#F3EAFF] text-[#311F54] font-semibold"
                                      : "text-gray-700 hover:bg-[#F9F5FF]"
                                  }`}
                                >
                                  {selectedSubject === opt && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#A655F7] flex-shrink-0" />
                                  )}
                                  {opt}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      {tContact("messageLabel")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A655F7] focus:ring-2 focus:ring-[#A655F7]/20 outline-none transition-all resize-none text-sm"
                      placeholder={tContact("messagePlaceholder")}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={formState === "submitting"}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 bg-[#311F54] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#4A2D7A] active:bg-[#231545] transition-colors disabled:opacity-60 shadow-lg shadow-[#311F54]/25 text-sm"
                  >
                    {formState === "submitting" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        {tContact("sendButton")}
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#311F54] mb-1">
              {t("faqSection.title")}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {t("faqSection.subtitle")}
            </p>

            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-3"
                  >
                    <span className="font-semibold text-[#311F54] text-sm leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#A655F7] flex-shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

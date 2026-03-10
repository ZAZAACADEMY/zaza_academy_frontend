import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslations } from "next-intl";

export default function TermsAndConditions() {
  const t = useTranslations("TermsAndConditions");
  type Section = { title: string; content: string };
  const sections = t.raw("sections") as Section[];

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar />
      <main className="grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-purple mb-6">
            {t("title")}
          </h1>
          <p className="text-brand-purple/60 mb-8 italic">{t("lastUpdated")}</p>

          <div className="prose prose-lg prose-purple max-w-none">
            <p className="text-brand-purple/80 mb-8 leading-relaxed">
              {t("intro")}
            </p>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <section
                  key={index}
                  className="border-b border-gray-100 pb-8 last:border-0"
                >
                  <h2 className="text-2xl font-display font-bold text-brand-purple mb-4">
                    {section.title}
                  </h2>
                  <p className="text-brand-purple/70 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "../ui/motion/Stagger";
import { FadeIn } from "../ui/motion/FadeIn";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

// Custom TikTok icon since it might not be in the installed version of lucide-react
const TikTok = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer = () => {
  const t = useTranslations("Footer");
  const tAria = useTranslations("Footer.aria");

  type LinkItem = { name: string; href: string };
  const productLinks = t.raw("productLinks") as LinkItem[];

  return (
    <footer className="w-full bg-[#311F54] text-white pt-20 pb-10 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16">
        {/* Main Footer Content */}
        <StaggerContainer
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16 border-b border-white/10 pb-12"
        >
          {/* Brand Column */}
          <StaggerItem className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-[28px] tracking-tight">
              {t("brand")}
            </h3>
            <p className="font-sans text-white/70 text-[15px] leading-[160%] max-w-[280px]">
              {t("tagline")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.instagram.com/zazaa_cademy"
                aria-label={tAria("instagram")}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#F46AA3] transition-all duration-300 transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587371184860&sk=directory_contact_info&fb_profile_edit_entry_point=%7B%22feature%22%3A%22profile_directory%22%2C%22click_point%22%3A%22pencil_edit_directory_section%22%2C%22additional_metadata%22%3A%7B%22section_type%22%3A%22contact_info%22%7D%7D"
                aria-label={tAria("facebook")}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#F46AA3] transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.youtube.com/@ParlonsDeBusiness"
                aria-label={tAria("youtube")}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#F46AA3] transition-all duration-300 transform hover:scale-110"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@zazaacademy?lang=en-GB"
                aria-label={tAria("tiktok")}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#F46AA3] transition-all duration-300 transform hover:scale-110"
              >
                <TikTok size={20} />
              </a>
            </div>
          </StaggerItem>

          {/* Product Links */}
          <StaggerItem className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-[18px] uppercase tracking-wider text-white/90">
              {t("product")}
            </h4>
            <ul className="flex flex-col gap-4 text-white/70 font-sans text-[15px]">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Support Links */}
          <StaggerItem className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-[18px] uppercase tracking-wider text-white/90">
              {t("support")}
            </h4>
            <ul className="flex flex-col gap-4 text-white/70 font-sans text-[15px]">
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {t("termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {t("refundPolicy")}
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Contact Info */}
          <StaggerItem className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-[18px] uppercase tracking-wider text-white/90">
              {t("contact")}
            </h4>
            <ul className="flex flex-col gap-4 text-white/70 font-sans text-[15px]">
              <li className="flex items-center gap-3 group">
                <Phone
                  size={18}
                  className="text-[#F46AA3] group-hover:scale-110 transition-transform"
                />
                <span>{t("phone")}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail
                  size={18}
                  className="text-[#F46AA3] group-hover:scale-110 transition-transform"
                />
                <a href={`mailto:${t("email")}`} className="hover:text-white">
                  {t("email")}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <MapPin
                  size={18}
                  className="text-[#F46AA3] group-hover:scale-110 transition-transform"
                />
                <span>{t("address")}</span>
              </li>
            </ul>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-[14px] font-sans text-center md:text-left">
            © {new Date().getFullYear()} {t("poweredBy")}
            <span className="mx-2 hidden md:inline">|</span>
            <Link
              href="/privacy"
              className="block md:inline mt-2 md:mt-0 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
            >
              {t("privacyPolicy")}
            </Link>
            <span className="mx-2 hidden md:inline">·</span>
            <Link
              href="/terms"
              className="block md:inline mt-2 md:mt-0 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
            >
              {t("termsAndConditions")}
            </Link>
            <span className="mx-2 hidden md:inline">·</span>
            <Link
              href="/refund"
              className="block md:inline mt-2 md:mt-0 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
            >
              {t("refundPolicy")}
            </Link>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-white/70 text-[14px] mr-2">
              {t("paymentsLabel")}
            </span>
            <div className="flex items-center gap-2">
              {/* Simple CSS-only badges to represent payment methods */}
              <div
                className="h-6 w-9 bg-[#0070BA] rounded flex items-center justify-center text-[8px] font-bold italic hover:scale-110 transition-transform cursor-default"
                title="PayPal"
              >
                Pay
              </div>
              <div
                className="h-6 w-9 bg-white rounded flex items-center justify-center text-[8px] font-bold text-[#1A1F71] hover:scale-110 transition-transform cursor-default"
                title="Visa"
              >
                VISA
              </div>
              <div
                className="h-6 w-9 bg-white rounded flex items-center justify-center text-[8px] font-bold text-[#EB001B] hover:scale-110 transition-transform cursor-default"
                title="Mastercard"
              >
                MC
              </div>
              <div
                className="h-6 w-9 bg-black rounded flex items-center justify-center text-[8px] font-bold hover:scale-110 transition-transform cursor-default"
                title="Apple Pay"
              >
                Pay
              </div>
              <div
                className="h-6 w-9 bg-[#006FCF] rounded flex items-center justify-center text-[8px] font-bold text-white hover:scale-110 transition-transform cursor-default"
                title="Amex"
              >
                AMEX
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

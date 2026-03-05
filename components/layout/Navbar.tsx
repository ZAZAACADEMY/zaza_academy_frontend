"use client";
import React from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, usePathname, useRouter } from "@/navigation";
import { JellyButton } from "../ui/motion/JellyButton";
import { usePageTransition } from "../ui/PageTransition";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Logo from "../../public/vectors/logo.svg";

interface LanguageSwitcherProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

// Composant réutilisable pour le sélecteur de langue pour éviter la duplication
const LanguageSwitcher = ({
  currentLang,
  onLanguageChange,
}: LanguageSwitcherProps) => {
  const t = useTranslations("Navbar.aria");
  return (
    <div
      className="w-[103px] h-[37px] bg-[#EFEEFF] rounded-[50px] p-[4px] flex items-center relative"
      role="group"
      aria-label={t("switcher")}
    >
      {/* Sliding Background */}
      <div
        className="absolute top-[4px] left-[4px] w-[47px] h-[29px] bg-white rounded-[24px] shadow-md transition-transform duration-300 ease-out"
        style={{
          transform:
            currentLang === "fr" ? "translateX(0)" : "translateX(48px)",
        }}
      />

      <button
        onClick={() => onLanguageChange("fr")}
        aria-label={t("switchToFr")}
        aria-pressed={currentLang === "fr"}
        className={`relative z-10 flex items-center justify-center w-[47px] h-[29px] rounded-[24px] font-medium text-sm transition-colors duration-300 ${
          currentLang === "fr"
            ? "text-brand-dark font-bold"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        FR
      </button>

      <button
        onClick={() => onLanguageChange("en")}
        aria-label={t("switchToEn")}
        aria-pressed={currentLang === "en"}
        className={`relative z-10 flex items-center justify-center w-[47px] h-[29px] rounded-[24px] font-medium text-sm transition-colors duration-300 ml-auto ${
          currentLang === "en"
            ? "text-brand-dark font-bold"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const t = useTranslations("Navbar");
  const tAria = useTranslations("Navbar.aria");
  const locale = useLocale();
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = React.useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");

  React.useEffect(() => {
    const sectionIds = ["about", "programs", "pricing", "testimonials", "faq"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleLanguageChange = async (newLocale: string) => {
    if (!pathname) return;
    if (newLocale === locale) return;
    try {
      await router.replace(pathname, { locale: newLocale });
    } catch (error) {
      // Fallback to hard navigation if client transition fails
      window.location.href = `/${newLocale}${pathname}`;
    }
  };

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Ne pas cacher la barre de navigation sur la section Hero (environ 700px)
      if (window.scrollY < 700) {
        setIsVisible(true);
        return;
      }

      // Cacher pendant le scroll
      setIsVisible(false);

      // Réafficher après l'arrêt du scroll
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const navLinks = [
    { name: t("about"), href: "#about" },
    { name: t("programs"), href: "#programs" },
    { name: t("pricing"), href: "#pricing" },
    { name: t("testimonials"), href: "#testimonials" },
    { name: t("faq"), href: "#faq" },
  ];

  return (
    <div
      className={`w-full flex justify-center pt-2 md:pt-5 z-[1000] fixed top-0 pointer-events-none transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full max-w-[1440px] px-5 md:px-16 pointer-events-auto">
        <nav className="w-full min-h-[64px] md:h-[74px] bg-[#FDFDFD] rounded-[24px] md:rounded-[65px] shadow-nav flex items-center justify-between px-4 lg:px-[20px] relative transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/#home"
              className="relative cursor-pointer ml-0 md:ml-[10px]"
              aria-label={tAria("home")}
            >
              <Image
                src={Logo}
                alt="Zaza Financial Education"
                className="h-[36px] w-auto md:h-[42px]"
                priority
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-[20px] xl:gap-[28px]">
            {navLinks.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-normal text-[15px] xl:text-[17px] transition-all leading-[140%] whitespace-nowrap relative ${
                    isActive
                      ? "text-brand-dark font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#A655F7] after:rounded-full"
                      : "text-[#404040] hover:text-brand-dark"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-[16px] xl:gap-[24px]">
            {/* Language Switcher */}
            <LanguageSwitcher
              currentLang={locale}
              onLanguageChange={handleLanguageChange}
            />

            <div className="flex items-center gap-[16px] bg-white rounded-[32px] pl-[8px] xl:pl-[16px]">
              <button
                onClick={() => navigateTo("/login")}
                className="text-brand-black font-medium text-[16px] xl:text-[18px] hover:text-brand-accent active:scale-95 transition-all"
              >
                {t("login")}
              </button>

              <JellyButton
                onClick={() => navigateTo("/signup")}
                className="bg-brand-dark text-[#FDFDFD] px-6 py-3 xl:w-[156px] xl:h-[54px] rounded-[50px] font-medium text-[16px] xl:text-[18px] shadow-sm whitespace-nowrap"
              >
                {t("getStarted")}
              </JellyButton>
            </div>
          </div>

          {/* Mobile Actions: Language Switcher and Menu Button */}
          <div className="lg:hidden flex items-center gap-2 relative">
            {/* Mobile Language Switcher - Dropdown style */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-brand-cream/50 text-brand-dark font-bold text-xs border border-brand-dark/10 active:bg-gray-100 transition-colors"
                aria-label={tAria("switcher")}
                aria-expanded={isLangMenuOpen}
              >
                {locale.toUpperCase()}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isLangMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-[60]">
                  <button
                    onClick={() => {
                      handleLanguageChange("fr");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      locale === "fr"
                        ? "font-bold text-brand-dark bg-brand-cream/30"
                        : "text-gray-600"
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange("en");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      locale === "en"
                        ? "font-bold text-brand-dark bg-brand-cream/30"
                        : "text-gray-600"
                    }`}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="text-brand-dark p-2 hover:bg-gray-50 rounded-full transition-colors relative z-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? tAria("closeMenu") : tAria("openMenu")}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div
              id="mobile-menu"
              className="absolute top-[70px] md:top-[80px] left-0 right-0 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 lg:hidden animate-fade-in z-50 border border-gray-100 mx-4"
            >
              {navLinks.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`py-3 border-b border-gray-50 last:border-0 text-center text-lg active:bg-gray-50 font-medium transition-colors ${
                      isActive ? "text-[#A655F7] font-bold" : "text-gray-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => {
                    navigateTo("/login");
                    setIsOpen(false);
                  }}
                  className="w-full py-3 text-center text-gray-700 font-bold border border-gray-200 rounded-full hover:bg-gray-50 active:scale-95 transition-transform"
                >
                  {t("login")}
                </button>
                <JellyButton
                  onClick={() => {
                    navigateTo("/signup");
                    setIsOpen(false);
                  }}
                  className="w-full py-3 text-center bg-brand-dark text-white font-bold rounded-full shadow-lg"
                >
                  {t("getStarted")}
                </JellyButton>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

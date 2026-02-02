"use client";
import React from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/navigation";
import { JellyButton } from "../ui/motion/JellyButton";
import { useTranslations, useLocale } from "next-intl";

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
  const pathname = usePathname();
  const [isVisible, setIsVisible] = React.useState(true);

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
      <div className="w-full max-w-[1440px] px-2 md:px-16 pointer-events-auto">
        <nav className="w-full min-h-[64px] md:h-[74px] bg-[#FDFDFD] rounded-[24px] md:rounded-[65px] shadow-nav flex items-center justify-between px-4 lg:px-[20px] relative transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/#home"
              className="relative cursor-pointer ml-0 md:ml-[10px]"
              aria-label={tAria("home")}
            >
              <span className="font-display font-bold text-2xl md:text-[32px] text-brand-dark tracking-tight">
                zaza<span className="text-brand-accent">.</span>
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-[20px] xl:gap-[28px]">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#404040] hover:text-brand-dark font-normal text-[15px] xl:text-[17px] transition-colors leading-[140%] whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
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
                onClick={() => router.push("/login")}
                className="text-brand-black font-medium text-[16px] xl:text-[18px] hover:text-brand-accent active:scale-95 transition-all"
              >
                {t("login")}
              </button>

              <JellyButton
                onClick={() => router.push("/signup")}
                className="bg-brand-dark text-[#FDFDFD] px-6 py-3 xl:w-[156px] xl:h-[54px] rounded-[50px] font-medium text-[16px] xl:text-[18px] shadow-sm whitespace-nowrap"
              >
                {t("getStarted")}
              </JellyButton>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-brand-dark p-2 hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? tAria("closeMenu") : tAria("openMenu")}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div
              id="mobile-menu"
              className="absolute top-[70px] md:top-[80px] left-0 right-0 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 lg:hidden animate-fade-in z-50 border border-gray-100"
            >
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 font-medium py-3 border-b border-gray-50 last:border-0 text-center text-lg active:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex justify-center py-2">
                <LanguageSwitcher
                  currentLang={locale}
                  onLanguageChange={handleLanguageChange}
                />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsOpen(false);
                  }}
                  className="w-full py-3 text-center text-gray-700 font-bold border border-gray-200 rounded-full hover:bg-gray-50 active:scale-95 transition-transform"
                >
                  {t("login")}
                </button>
                <JellyButton
                  onClick={() => {
                    router.push("/signup");
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

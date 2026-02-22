import type { Metadata } from "next";
import { Montserrat, Fredoka } from "next/font/google";
import "gotham-fonts/css/gotham-rounded.css";
import "../globals.css";
import { MouseTrail } from "@/components/ui/MouseTrail";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import StoreProvider from "@/app/StoreProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = "https://zaza-finance.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = ["en", "fr"].includes(resolvedParams?.locale)
    ? resolvedParams.locale
    : "en";
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: "%s | Zaza",
    },
    description: t("description"),
    keywords: [
      "financial education",
      "kids",
      "money management",
      "parenting",
      "learning",
      "gamified learning",
    ],
    authors: [{ name: "Zaza Team" }],
    creator: "Zaza Financial Education",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ogLocale === "en_US" ? ["fr_FR"] : ["en_US"],
      url: `${siteUrl}/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: "Zaza Academy",
      images: [
        {
          url: `/${locale}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@zazafinance",
      images: [`/${locale}/twitter-image.png`],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${fredoka.variable} font-sans bg-brand-cream antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <MouseTrail />
            {children}
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

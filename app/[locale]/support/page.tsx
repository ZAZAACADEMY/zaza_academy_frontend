import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Support } from "@/components/sections/Support";

const siteUrl = "https://zaza-finance.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SupportPage.meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: `${siteUrl}/${locale}/support`,
      languages: {
        en: `${siteUrl}/en/support`,
        fr: `${siteUrl}/fr/support`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${siteUrl}/${locale}/support`,
      title: t("title"),
      description: t("description"),
      siteName: "Zaza Academy",
      images: [
        {
          url: `${siteUrl}/${locale}/opengraph-image.png`,
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
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function SupportPage() {
  return <Support />;
}

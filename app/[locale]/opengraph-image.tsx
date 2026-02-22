import { ImageResponse } from "next/og";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const DICTIONARY = {
  en: {
    title: "Money confidence for kids",
    subtitle: "Turn 'I want this!' into 'I'm saving for this.' 🧸💰",
    ages: "Ages 5–16",
    cta: "zaza-finance.com",
  },
  fr: {
    title: "La confiance financière pour les enfants",
    subtitle: "Transformez les « Je veux ! » en « J'économise. » 🧸💰",
    ages: "5–16 ans",
    cta: "zaza-finance.com",
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = (
    ["en", "fr"].includes(locale) ? locale : "en"
  ) as keyof typeof DICTIONARY;
  const t = DICTIONARY[lang];

  // Try to fetch text font if needed, but for now we rely on system/fallback or imported google fonts if configured nicely.
  // We will load the custom background image.
  // Ideally this image is placed at public/images/og-whatsapp.png
  const imageData = await fetch(
    new URL("../../public/images/og-whatsapp.png", import.meta.url),
  )
    .then((res) => {
      // If file doesn't exist, we fall back to a gradient
      if (res.status === 404) return null;
      return res.arrayBuffer();
    })
    .catch(() => null);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // If image exists, use it as background
        background: imageData
          ? undefined // Background image is handled by <img /> or absolute positioning div if we want overlay
          : "linear-gradient(135deg, #311F54 0%, #F46AA3 100%)",
        color: "#FDFCF8",
        fontFamily: "'Gotham Rounded', 'Montserrat', sans-serif",
        position: "relative",
      }}
    >
      {/* Background Image Layer */}
      {imageData && (
        <img
          // @ts-ignore
          src={imageData}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* Gradient Overlay for Text Readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgba(49, 31, 84, 0.85) 0%, rgba(49, 31, 84, 0.4) 50%, rgba(49, 31, 84, 0.1) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content Layer */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "64px 72px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              padding: "12px 24px",
              borderRadius: "99px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Zaza
          </div>
        </div>

        {/* Main Text */}
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {t.title}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.95,
              fontWeight: 500,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t.subtitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "12px 20px",
              background: "#FFD233",
              color: "#311F54",
              borderRadius: "16px",
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {t.ages}
          </div>
          <div
            style={{
              padding: "12px 20px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              borderRadius: "16px",
              fontSize: 24,
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {t.cta}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}

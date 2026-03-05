import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

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

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = (
    ["en", "fr"].includes(locale) ? locale : "en"
  ) as keyof typeof DICTIONARY;
  const t = DICTIONARY[lang];

  // Load background image and convert to base64 data URL
  let imageSrc: string | null = null;
  try {
    const imgBuffer = await readFile(
      path.join(process.cwd(), "public", "images", "og-whatsapp.png"),
    );
    imageSrc = `data:image/png;base64,${imgBuffer.toString("base64")}`;
  } catch {
    // Fallback to gradient if image not found
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: imageSrc
          ? undefined
          : "linear-gradient(135deg, #311F54 0%, #F46AA3 100%)",
        color: "#FDFCF8",
        fontFamily: "'Gotham Rounded', 'Montserrat', sans-serif",
        position: "relative",
      }}
    >
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
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

import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const background =
  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%)," +
  "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 35%)," +
  "linear-gradient(135deg, #311F54 0%, #F46AA3 100%)";

const card = (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      color: "#FDFCF8",
      background,
      position: "relative",
      overflow: "hidden",
      fontFamily:
        "'Gotham Rounded', 'Montserrat', 'Inter', 'Segoe UI', sans-serif",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "28px",
        borderRadius: "32px",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: "180px",
        height: "180px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        top: "-60px",
        right: "-20px",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: "260px",
        height: "260px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "50%",
        bottom: "-80px",
        left: "-40px",
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        zIndex: 1,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          padding: "12px 18px",
          borderRadius: "999px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        Zaza
      </div>
      <div style={{ opacity: 0.85 }}>Financial Education</div>
    </div>

    <div style={{ maxWidth: "720px", zIndex: 1 }}>
      <div
        style={{
          fontSize: 70,
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 18,
        }}
      >
        Money confidence for kids
      </div>
      <div style={{ fontSize: 32, opacity: 0.9 }}>
        Give your child a playful path to budgeting, saving, and smart spending.
      </div>
    </div>

    <div
      style={{ display: "flex", alignItems: "center", gap: "14px", zIndex: 1 }}
    >
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(255,255,255,0.16)",
          borderRadius: "12px",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        Ages 5–16
      </div>
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: "12px",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        zaza-finance.com
      </div>
    </div>
  </div>
);

export default function TwitterImage() {
  return new ImageResponse(card, {
    ...size,
  });
}

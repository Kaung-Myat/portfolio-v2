import { ImageResponse } from "next/og";

export const alt = "Kaung Mrat Thu — Flutter Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#111111",
          color: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -110,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: "#8b7cf8",
            opacity: 0.17,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 105,
            bottom: 70,
            width: 230,
            height: 230,
            border: "2px solid rgba(139,124,248,0.42)",
            borderRadius: 48,
            transform: "rotate(12deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 790,
            padding: "72px 84px",
          }}
        >
          <div
            style={{
              color: "#8b7cf8",
              fontFamily: "monospace",
              fontSize: 24,
              letterSpacing: 1,
            }}
          >
            {"// FLUTTER DEVELOPER"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -3,
            }}
          >
            Kaung Mrat Thu
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              color: "#a1a1a1",
              fontSize: 31,
            }}
          >
            Thoughtful mobile experiences.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

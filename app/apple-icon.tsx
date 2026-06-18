import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#241B3A",
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 6,
          position: "relative",
        }}
      >
        {/* Gold ring */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: "50%",
            border: "2px solid #B8860B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {/* Compass N marker */}
        <div
          style={{
            color: "#C05A12",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "Georgia, serif",
          }}
        >
          N
        </div>
        {/* Wordmark */}
        <div
          style={{
            color: "#B8860B",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: "Georgia, serif",
          }}
        >
          VaastuSetu
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}

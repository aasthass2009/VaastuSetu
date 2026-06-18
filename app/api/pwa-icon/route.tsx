import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("s");
  const size = raw === "512" ? 512 : 192;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#241B3A",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: Math.round(size * 0.04),
          position: "relative",
        }}
      >
        {/* Gold ring */}
        <div
          style={{
            position: "absolute",
            inset: Math.round(size * 0.07),
            borderRadius: "50%",
            border: `${Math.round(size * 0.012)}px solid #B8860B`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {/* North marker */}
        <div
          style={{
            color: "#C05A12",
            fontSize: Math.round(size * 0.3),
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          N
        </div>
        {/* Wordmark */}
        <div
          style={{
            color: "#FBF5EA",
            fontSize: Math.round(size * 0.12),
            fontWeight: 600,
            letterSpacing: Math.round(size * 0.005),
            fontFamily: "Georgia, serif",
          }}
        >
          VaastuSetu
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}

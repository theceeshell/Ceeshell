import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0E3557 0%, #1E5D83 100%)",
          color: "#F8F7F4",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 96, letterSpacing: -2 }}>Cee-Shell</div>
        <div style={{ fontSize: 30, marginTop: 24, opacity: 0.8, fontFamily: "sans-serif", letterSpacing: 2 }}>
          CREATIVE BRANDING &middot; PHOTOGRAPHY &middot; PACKAGING
        </div>
      </div>
    ),
    { ...size }
  );
}

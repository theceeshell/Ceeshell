import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/cms/site-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cee-Shell — Creative Branding, Photography & Packaging Studio";

/** Default share image: the CMS "Default OG image" if one is set, otherwise a generated brand card. */
export default async function Image() {
  const settings = await getSiteSettings().catch(() => null);

  if (settings?.defaultOgImageUrl) {
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
        <img src={settings.defaultOgImageUrl} alt="" width={size.width} height={size.height} style={{ objectFit: "cover" }} />
      ),
      { ...size }
    );
  }

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
        <div style={{ fontSize: 96, letterSpacing: -2 }}>{settings?.websiteName ?? "Cee-Shell"}</div>
        <div style={{ fontSize: 30, marginTop: 24, opacity: 0.8, fontFamily: "sans-serif", letterSpacing: 2 }}>
          CREATIVE BRANDING &middot; PHOTOGRAPHY &middot; PACKAGING
        </div>
      </div>
    ),
    { ...size }
  );
}

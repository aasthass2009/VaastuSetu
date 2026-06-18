import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VaastuSetu",
    short_name: "VaastuSetu",
    description: "Ancient Wisdom, Modern Spaces — Vastu Shastra for everyone",
    start_url: "/",
    display: "standalone",
    background_color: "#241B3A",
    theme_color: "#241B3A",
    orientation: "portrait-primary",
    categories: ["lifestyle", "utilities"],
    icons: [
      {
        src: "/api/pwa-icon?s=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/pwa-icon?s=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/api/pwa-icon?s=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

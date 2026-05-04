import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KardKeeper",
    short_name: "KardKeeper",
    description: "Manage your album collection",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a1b",
    theme_color: "#1a1a1b",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

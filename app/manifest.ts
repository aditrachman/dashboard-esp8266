import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const icons = [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png" as const,
      purpose: "any maskable",
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png" as const,
      purpose: "any maskable",
    },
  ] as unknown as MetadataRoute.Manifest["icons"];

  return {
    name: "Irigasi Prediktif",
    short_name: "Irigasi",
    description:
      "Dashboard monitoring sistem irigasi prediktif berbasis IoT — realtime dari Wemos D1 Mini",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait",
    icons,
  };
}

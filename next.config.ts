import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  // Disable di dev mode — Serwist gak support Turbopack
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  // Turbopack config kosong — biar gak error "no turbopack config"
  turbopack: {},
};

export default withSerwist(nextConfig);

"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const SerwistProvider = dynamic(
  () => import("@serwist/next/react").then((m) => m.SerwistProvider),
  { ssr: false }
);

export default function SerwistGuard({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "production") {
    return <>{children}</>;
  }
  return <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>;
}

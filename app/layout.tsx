import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://squareson.github.io"),
  title: {
    default: "方子 · Zi Fang",
    template: "%s · Zi Fang",
  },
  description:
    "Research portfolio of Zi Fang — 3D perception, embodied intelligence, medical imaging, and medical robotics.",
  authors: [{ name: "Zi Fang" }],
  creator: "Zi Fang",
  keywords: [
    "Zi Fang",
    "方子",
    "3D perception",
    "medical robotics",
    "freehand ultrasound",
    "NeRF",
    "Shanghai Jiao Tong University",
  ],
  icons: {
    icon: "/images/profile/zi-fang.png",
    apple: "/images/profile/zi-fang.png",
  },
  openGraph: {
    type: "profile",
    locale: "zh_CN",
    alternateLocale: "en_US",
    siteName: "Zi Fang Research",
    title: "方子 · Zi Fang",
    description: "3D Perception · Embodied Intelligence · Medical Robotics",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Zi Fang — 3D Perception, Embodied Intelligence, Medical Robotics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "方子 · Zi Fang",
    description: "3D Perception · Embodied Intelligence · Medical Robotics",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0ea",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

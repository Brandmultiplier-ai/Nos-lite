import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-display",
  weight: ["500", "600", "700", "800"],
});

const plusJakartaText = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-text",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Narrative OS · BrandMultiplier",
  description: "Narrative OS — operating layer for GTM signals. Demo workspace by BrandMultiplier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${plusJakartaText.variable} h-full`}
    >
      <body className="nos-scrollbar min-h-full antialiased">{children}</body>
    </html>
  );
}

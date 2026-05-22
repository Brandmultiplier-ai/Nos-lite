import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
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
      className={`${plusJakarta.variable} ${plusJakartaText.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="nos-scrollbar min-h-full antialiased">{children}</body>
    </html>
  );
}

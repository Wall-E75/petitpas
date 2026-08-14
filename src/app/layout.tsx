import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetitsPas",
  description: "Des activités adaptées à l'âge exact de votre enfant",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

// Depuis Next.js 14, themeColor ne fait plus partie de `metadata` : c'est un
// champ dédié au head (comme width/initialScale), donc typé et exporté via
// Viewport plutôt que Metadata — les deux exports ne se mélangent pas.
export const viewport: Viewport = {
  themeColor: "#fbbf24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

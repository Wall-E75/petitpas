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

const siteName = "PetitsPas";
const siteDescription = "Des activités adaptées à l'âge exact de votre enfant";

export const metadata: Metadata = {
  // metadataBase compose les champs d'URL (ex: openGraph.images) en URLs
  // absolues à partir de chemins relatifs — obligatoire pour les bots sociaux,
  // qui n'acceptent pas d'URL relative. NEXT_PUBLIC_SITE_URL sera à définir
  // en variable d'environnement de prod ; fallback localhost pour le dev local.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: siteName,
  description: siteDescription,
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  // openGraph est un objet distinct de title/description : il pilote les
  // balises og:* lues par les bots de prévisualisation sociale (Facebook,
  // LinkedIn, Slack...), pas les moteurs de recherche. Les pages enfants
  // (ex: activités) hériteront de ces valeurs sauf si elles définissent
  // leur propre openGraph — voir la doc "Merging" de generateMetadata.
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    locale: "fr_FR",
    type: "website",
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

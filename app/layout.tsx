import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "A.E.P.V.B | Action pour l'Encadrement et la Promotion des Vulnérables au Burundi",
    template: "%s | A.E.P.V.B",
  },
  description: "Association pour la défense et la promotion des droits des personnes vulnérables au Burundi. Contribuant à la promotion socio-économique, socio-éducative et de la culture de la paix.",
  keywords: ["AEPVB", "Association", "Personnes vulnérables", "Burundi", "Handicap", "Droits humains", "Développement social", "Aide humanitaire"],
  authors: [{ name: "A.E.P.V.B" }],
  creator: "A.E.P.V.B",
  publisher: "A.E.P.V.B",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aepvb.org"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "A.E.P.V.B",
    title: "A.E.P.V.B | Action pour l'Encadrement et la Promotion des Vulnérables au Burundi",
    description: "Association pour la défense et la promotion des droits des personnes vulnérables au Burundi",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "A.E.P.V.B Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "A.E.P.V.B | Action pour l'Encadrement et la Promotion des Vulnérables au Burundi",
    description: "Association pour la défense et la promotion des droits des personnes vulnérables au Burundi",
    images: ["/favicon_io/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Action pour l'Encadrement et la Promotion des Vulnérables au Burundi - Association pour la défense et la promotion des droits des personnes vulnérables" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

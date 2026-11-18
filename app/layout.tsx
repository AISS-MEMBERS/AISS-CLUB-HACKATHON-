import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aiss-club-hackathon.vercel.app"),
  title: "AISS Club | Üsküdar University",
  description:
    "Üsküdar University's student community for artificial intelligence, intelligent systems, workshops and hands-on projects.",
  openGraph: {
    title: "AISS Club | Üsküdar University",
    description:
      "Üsküdar University's student community for artificial intelligence, intelligent systems, workshops and hands-on projects.",
    url: "https://aiss-club-hackathon.vercel.app",
    siteName: "AISS Club",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AISS Club website preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AISS Club | Üsküdar University",
    description:
      "Üsküdar University's student community for artificial intelligence, intelligent systems, workshops and hands-on projects.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLocale="en">
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "./pwa-register";
import { ErrorBoundary } from "./components/error-boundary";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/utils/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gerejahub.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ["church", "community", "worship", "sermons", "events", "ministries", "prayer"],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo_svg.svg", type: "image/svg+xml" },
      { url: "/media/logo.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/media/logo.png"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/media/hero-poster.jpg",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Church Community`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/media/hero-poster.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#f7f1e8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <PwaRegister />
      </body>
    </html>
  );
}

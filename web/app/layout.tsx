import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "@/lib/RootProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata with OpenGraph and Twitter Cards
export const metadata: Metadata = {
  title: {
    default: "DingDong BMS - Intelligent Building Management System",
    template: "%s | DingDong BMS",
  },
  description:
    "DingDong BMS is a comprehensive building management system designed for property managers, social housing operators, corporate owners, and administrators. Manage properties, tenants, maintenance, subsidies, and compliance with ease.",
  keywords: [
    "building management",
    "property management",
    "BMS",
    "tenant management",
    "maintenance tracking",
    "property administration",
    "social housing",
    "corporate property",
    "real estate management",
    "facility management",
  ],
  category: "Business",
  authors: [{ name: "TriMatrixLab", url: "https://dingdong-bms.com" }],
  creator: "TriMatrixLab",
  publisher: "DingDong",
  
  // OpenGraph for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dingdong-bms.com",
    siteName: "DingDong BMS",
    title: "DingDong BMS - Intelligent Building Management System",
    description:
      "Streamline property management and tenant operations with DingDong's comprehensive building management platform.",
    images: [
      {
        url: "https://dingdong-bms.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DingDong BMS - Building Management System",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@dingdong_bms",
    creator: "@dingdong_bms",
    title: "DingDong BMS - Building Management System",
    description:
      "Intelligent property and tenant management for modern buildings.",
    images: ["https://dingdong-bms.com/twitter-image.png"],
  },

  // Additional metadata
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

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DingDong BMS",
  },

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  verification: {
    google: "your-google-verification-code",
  },

  metadataBase: new URL("https://dingdong-bms.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://dingdong-bms.com" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://cdn.example.com" />

        {/* Theme color */}
        <meta name="theme-color" content="#1e293b" />

        {/* JSON-LD Schema Markup for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DingDong BMS",
              url: "https://dingdong-bms.com",
              logo: "https://dingdong-bms.com/logo.png",
              description:
                "Intelligent Building Management System for property managers and stakeholders",
              sameAs: [
                "https://www.facebook.com/dingdongbms",
                "https://twitter.com/dingdong_bms",
                "https://www.linkedin.com/company/dingdong-bms",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                telephone: "+1-XXX-XXX-XXXX",
                email: "support@dingdong-bms.com",
              },
            }),
          }}
        />

        {/* JSON-LD Schema for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DingDong BMS",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              operatingSystem: "Web",
              url: "https://dingdong-bms.com",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

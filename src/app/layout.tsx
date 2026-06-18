import type { Metadata } from "next";
import "./globals.css";
import LiveBackground from "@/components/LiveBackground";
import { Nav, Footer, FloatingContacts } from "@/components/ui-shared";
import DisableRightClick from "@/components/DisableRightClick";

export const metadata: Metadata = {
  title: "AVENSIS — Turning Vision Into Innovation",
  description: "AVENSIS designs premium technology — school and hotel platforms, smart NFC identity, and custom software for the businesses shaping tomorrow.",
  openGraph: {
    title: "AVENSIS — Turning Vision Into Innovation",
    description: "Luxury technology. Intelligent platforms. Built for the future.",
    url: "/",
    siteName: "AVENSIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
      </head>
      <body>
        <DisableRightClick />
        <LiveBackground />
        <Nav />
        {children}
        <Footer />
        <FloatingContacts />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.attriassociates.com"),
  title: "Attri Associates & Vastu Consultants | Architecture & Scientific Vastu",
  description:
    "Integrated architecture, structural engineering, interior design, construction consultancy and scientific Vastu solutions for residential, commercial and industrial projects.",
  keywords: ["Vastu consultant", "architecture firm", "structural design", "interior design", "scientific Vastu", "Faridabad"],
  openGraph: {
    title: "Attri Associates & Vastu Consultants",
    description: "Infinite World of Modern & Vedic Vastu Science",
    type: "website",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "Attri Associates — Architecture, Engineering and Scientific Vastu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Attri Associates & Vastu Consultants",
    description: "Architecture, engineering and scientific Vastu for purposeful spaces.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attri Associates & Vastu Consultants | Architecture & Scientific Vastu",
  description:
    "Integrated architecture, structural engineering, interior design, construction consultancy and scientific Vastu solutions for residential, commercial and industrial projects.",
  keywords: ["Vastu consultant", "architecture firm", "structural design", "interior design", "scientific Vastu", "Faridabad"],
  openGraph: {
    title: "Attri Associates & Vastu Consultants",
    description: "Infinite World of Modern & Vedic Vastu Science",
    type: "website",
  },
  other: {
    "codex-preview": "development",
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

import type { Metadata } from "next";
import "./globals.css";
import { env } from "@server";

export const dynamic = "force-dynamic";
const fallbackTitle = "Attri Associates & Vastu Consultants | Architecture & Scientific Vastu";
const fallbackDescription = "Integrated architecture, structural engineering, interior design, construction consultancy and scientific Vastu solutions for residential, commercial and industrial projects.";
export async function generateMetadata(): Promise<Metadata> {
  let title = fallbackTitle, description = fallbackDescription, keywords = ["Vastu consultant", "architecture firm", "structural design", "interior design", "scientific Vastu", "Faridabad"];
  try { const rows = await env.DB.prepare("SELECT setting_key AS key,setting_value AS value FROM site_settings WHERE setting_key IN ('seo_default_title','seo_default_description','seo_default_keywords')").all<{key:string;value:string}>(); const values = Object.fromEntries(rows.results.map(row => [row.key, row.value])); title = values.seo_default_title || title; description = values.seo_default_description || description; if (values.seo_default_keywords) keywords = values.seo_default_keywords.split(",").map(value => value.trim()).filter(Boolean); } catch {}
  return { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.attriassociates.com"), title, description, keywords, openGraph: { title, description, type: "website", images: [{ url: "/og.png", width: 1680, height: 945, alt: "Attri Associates — Architecture, Engineering and Scientific Vastu" }] }, twitter: { card: "summary_large_image", title, description, images: ["/og.png"] }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
}

const metadataDefaults: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.attriassociates.com"),
  title: "Attri Associates & Vastu Consultants | Architecture & Scientific Vastu",
  description: fallbackDescription,
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
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"Attri Associates & Vastu Consultants",url:process.env.NEXT_PUBLIC_SITE_URL||"https://www.attriassociates.com",logo:`${process.env.NEXT_PUBLIC_SITE_URL||"https://www.attriassociates.com"}/favicon.svg`})}}/>{children}</body>
    </html>
  );
}

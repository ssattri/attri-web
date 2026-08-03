import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = { title: "Vastu Shop | Attri Associates", description: "Curated Vastu tools, remedies, reports, books and software from Attri Associates." };

export default function ShopPage() {
  return <main className="shop-page"><SiteHeader active="/shop"/><section className="shop-hero"><p>ATTRI CURATED</p><h1>Tools for spaces<br/><em>in balance.</em></h1><span>Expert-selected Vastu tools, remedies, knowledge and digital products.</span></section><section className="shop-content"><ShopClient/></section><SiteFooter/></main>;
}

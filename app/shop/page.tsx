import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageFaqs from "../components/PageFaqs";
import DynamicBanner from "../components/DynamicBanner";
import { moduleState } from "../module-visibility";

export const metadata: Metadata = { title: "Vastu Shop | Attri Associates", description: "Curated Vastu tools, remedies, reports, books and software from Attri Associates." };

export default async function ShopPage() {
  const visibility=await moduleState("shop");if(!visibility.enabled)return <main className="shop-page"><SiteHeader/><section className="module-disabled"><p>MODULE PAUSED</p><h1>Shop is temporarily unavailable.</h1><span>{visibility.message}</span></section><SiteFooter/></main>;
  return <main className="shop-page"><SiteHeader active="/shop"/><DynamicBanner placement="shop-top"/><section className="shop-hero"><p>ATTRI CURATED</p><h1>Tools for spaces<br/><em>in balance.</em></h1><span>Expert-selected Vastu tools, remedies, knowledge and digital products.</span></section><section className="shop-content"><ShopClient/></section><PageFaqs pageSlug="shop"/><SiteFooter/></main>;
}

import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/shop", "/websites", "/ki-automatisierung", "/ueber", "/kontakt", "/faq", "/impressum", "/datenschutz", "/agb", "/widerruf"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.filter((p) => !p.demo).map((p) => ({ url: `${base}/shop/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}

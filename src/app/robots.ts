import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow ? { userAgent: "*", allow: "/", disallow: ["/api/", "/konto", "/warenkorb", "/checkout/"] } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}

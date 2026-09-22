import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/en/admin", "/api/admin/"],
    },
    sitemap: "https://augur-sahbaz.vercel.app/sitemap.xml",
  };
}

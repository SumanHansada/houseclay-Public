// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/manage-account",
          "/edit-property",
          "/list-property",
        ],
      },
    ],
    sitemap: "https://houseclay.com/sitemap.xml",
  };
}

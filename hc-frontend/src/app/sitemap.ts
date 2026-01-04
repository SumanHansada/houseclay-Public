// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://houseclay.com";

  return [
    // Home
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    // Rent (Zero Brokerage)
    {
      url: `${baseUrl}/property-search?${new URLSearchParams({
        city: "bengaluru",
        propertyCategory: "rent",
      })
        .toString()
        .replace(/&/g, "&amp;")}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // Flatmates
    {
      url: `${baseUrl}/property-search?${new URLSearchParams({
        city: "bengaluru",
        propertyCategory: "flatmate",
      })
        .toString()
        .replace(/&/g, "&amp;")}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // About Us
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}

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
      url: `${baseUrl}/property-search?city=bengaluru&propertyCategory=rent`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // Flatmates
    {
      url: `${baseUrl}/property-search?city=bengaluru&propertyCategory=flatmate`,
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

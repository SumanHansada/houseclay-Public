import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cache } from "react";

import { CDN_BASE_URL, WEBSITE_BASE_URL } from "@/common/constants";
import {
  BHK_TYPE_OPTIONS,
  getOptionLabel,
} from "@/common/dataConstants/options";
import { pascalCase } from "@/common/utils";
import { ServerAPIService } from "@/services/serverAPIService";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

// Cache the page for 6 hours (21600 seconds)
// This enables ISR: first request generates the page, subsequent requests use cache
// The page will be cached per propertyID
export const revalidate = 21600;

type PropertyParams = Promise<{ propertyID: string }>;

type PropertyData = {
  bhkType?: string;
  locationOrSocietyName?: string;
  propertyCategory?: string;
  city?: string;
  images?: string[];
};

const resolvePropertyFromResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
): PropertyData | undefined => {
  if (!response) {
    return undefined;
  }

  if ("property" in response) {
    return response.property as PropertyData;
  }

  return response as PropertyData;
};

// Cached function to fetch property data - deduplicates requests within the same render
// This ensures generateMetadata and the page component share the same fetch
const getCachedPropertyDataWithoutAuth = cache(
  async (propertyID: string): Promise<PropertyData | undefined> => {
    try {
      const propertyData: { property: PropertyData | undefined } = {
        property: undefined,
      };
      propertyData.property =
        await ServerAPIService.getPublicPropertyByID(propertyID);
      console.log("Property Data", propertyData);
      return resolvePropertyFromResponse(propertyData);
    } catch (error) {
      console.error("Error fetching property data", error);
      return undefined;
    }
  },
);

const getCachedPropertyDataWithAuth = cache(
  async (propertyID: string): Promise<PropertyData | undefined> => {
    try {
      const propertyData = await ServerAPIService.getPropertyByID(propertyID);
      console.log("Property Data", propertyData);
      return resolvePropertyFromResponse(propertyData);
    } catch (error) {
      console.error("Error fetching property data", error);
      return undefined;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: PropertyParams;
}): Promise<Metadata> {
  const { propertyID } = await params;

  // Check if user is authenticated by checking for token cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  // Use authenticated endpoint if token exists, otherwise use public endpoint
  // This will be deduplicated if also called in page component
  const property = isAuthenticated
    ? await getCachedPropertyDataWithAuth(propertyID)
    : await getCachedPropertyDataWithoutAuth(propertyID);

  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType);
  const location = property?.locationOrSocietyName ?? "";
  const propertyCategory = property?.propertyCategory ?? "";
  const city = property?.city ?? "";

  const titleSegments = [
    bhkType && `${bhkType}`,
    location && `in ${location}`,
    propertyCategory && `for ${pascalCase(propertyCategory)}`,
    city && `in ${city}`,
  ].filter(Boolean);

  const title =
    titleSegments.join(" ").trim() || "Property Details | Houseclay";

  const locationSummary = [location, city].filter(Boolean).join(", ");
  const description = [title, locationSummary].filter(Boolean).join(" | ");

  const imageUrl = `${CDN_BASE_URL}/${property?.images?.[0]}`;
  console.log("Image Url", imageUrl);
  const pageUrl = `${WEBSITE_BASE_URL}/property-details/${propertyID}`;

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: description || undefined,
      url: pageUrl,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      title,
      card: "summary_large_image",
      description: description || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

// Server Component
async function PropertyDetails({ params }: { params: PropertyParams }) {
  // Await the params before using them
  const { propertyID } = await params;

  // Check if user is authenticated by checking for token cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  // Fetch property data - use authenticated endpoint if token exists
  // This will be deduplicated with generateMetadata's call above
  const propertyData = isAuthenticated
    ? await getCachedPropertyDataWithAuth(propertyID)
    : await getCachedPropertyDataWithoutAuth(propertyID);

  return (
    <PropertyDetailsClient
      propertyID={propertyID}
      initialPropertyData={propertyData}
      isAuthenticated={isAuthenticated}
    />
  );
}

export default PropertyDetails;

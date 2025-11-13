import type { Metadata } from "next";

import { pascalCase } from "@/common/utils";
import { ServerAPIService } from "@/services/serverAPIService";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

const WEBSITE_BASE_URL = "https://houseclay.com";

type PropertyParams = Promise<{ propertyID: string }>;

type PropertyData = {
  bhkType?: string;
  locationOrSocietyName?: string;
  propertyCategory?: string;
  city?: string;
  images?: string[];
};

const buildImageUrl = (image?: string | null) => {
  if (!image) {
    return undefined;
  }

  const imagePart = image
    .split("?")[0]
    .split("https://houseclay.s3.ap-south-1.amazonaws.com/")[1];
  return `https://cdn.houseclay.com/${imagePart}`;
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

export async function generateMetadata({
  params,
}: {
  params: PropertyParams;
}): Promise<Metadata> {
  const { propertyID } = await params;

  let property: PropertyData | undefined;

  try {
    const propertyData =
      await ServerAPIService.getPublicPropertyByID(propertyID);
    property = resolvePropertyFromResponse(propertyData);
  } catch (_error) {
    // Ignore metadata fetch failures; fall back to defaults
    console.error("Error fetching property data", _error);
  }

  const bhkType = property?.bhkType ?? "";
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

  const imageUrl = buildImageUrl(property?.images?.[0]);
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
  };
}

// Server Component
async function PropertyDetails({ params }: { params: PropertyParams }) {
  // Await the params before using them
  const { propertyID } = await params;

  try {
    const propertyData =
      await ServerAPIService.getPublicPropertyByID(propertyID);
    console.log("Property Data", propertyData);
    return (
      <PropertyDetailsClient
        propertyID={propertyID}
        initialData={propertyData}
      />
    );
  } catch (error) {
    console.error("Error fetching property data", error);
  }
}

export default PropertyDetails;
